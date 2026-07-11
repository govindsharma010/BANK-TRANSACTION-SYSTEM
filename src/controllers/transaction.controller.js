const accountModel = require("../models/account.model")
const ledgerModel= require("../models/ledger.model")
const transactionModel = require("../models/transaction.model")
const mongoose = require("mongoose")
const emailService = require("../services/email.service")
/**
 * -Create a new transaction
 * THE 10-STEP TRANSFER FLOW
 * 1. Validate Request
 * 2. Validate idempotency key
 * 3. Check Account Status
 * 4. Derive Sender Balance from Ledger
 * 5. Create Transaction (pending)
 * 6. Create DEBIT ledger Entry
 * 7. Create CREDIT ledger entry
 * 8. Mark Transaction COMPLETED
 * 9. Commit MongoDB session
 * 10. Send Email notification
 */

async function createTransaction(req, res){

    /**
     * 1.Validate request
     */
    const {fromAccount, toAccount, amount , idempotencyKey} = req.body

    if(!fromAccount || !toAccount || amount === undefined || amount === null || !idempotencyKey){
        return res.status(400).json({
            message: "FromAccount, toAccount, amount and idempotencyKey are required"

        })
    }
   
    if (!mongoose.Types.ObjectId.isValid(fromAccount) || !mongoose.Types.ObjectId.isValid(toAccount)) {
    return res.status(400).json({ message: "fromAccount and toAccount must be valid account IDs" })
    }

   if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "amount must be a positive number" })
   }

   if (fromAccount === toAccount) {
    return res.status(400).json({ message: "fromAccount and toAccount cannot be the same" })
  }

    const fromUserAccount = await accountModel.findOne({
        _id : fromAccount,
        user : req.user._id
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if(!fromUserAccount ){
        return res.status(403).json({
            message: "Invalid fromAccount or you are not authorized to perform this transaction"
        })
    }
     if(!toUserAccount){
        return res.status(403).json({
            message: "Invalid toAccount "
        })
    }
 

    /**
     * 2. Validate idempotency key
    
     */

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey : idempotencyKey 
    })
   
    if(isTransactionAlreadyExists) {
        if(isTransactionAlreadyExists.status === "COMPLETED"){
           return  res.status(200).json({
                message: "Transaction Already Processed",
                transaction : isTransactionAlreadyExists
            })
        }
        if(isTransactionAlreadyExists.status === "PENDING"){
            return res.status(200).json({
                message: "Transaction is still in processing"
            })
        }
        if(isTransactionAlreadyExists.status === "FAILED"){
            return res.status(500).json({
                message: "Transaction gets Failed, try again"
            })
        }
        if(isTransactionAlreadyExists.status === "REVERSED"){
            return res.status(500).json({
                message: "Transaction was reversed, please retry"
            })
        }
    }

    /**
     * 3. Check Account Statu
     */
    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message : "Both fromAccount and toAccount must be ACTIVE"
        })
    }

    /**
     * 4. Derive Sender Balance from ledger
     */
    const balance = await fromUserAccount.getBalance()
    if(balance < amount ){
        return res.status(400).json({
            message : `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}` 
        })
    }
     
    /**
     * 5. Create Transaction
     */ // to avoid inconsistency we have to do 5,6, 7, 8 all at once other wise revert back all if any error occur

     
    const session = await mongoose.startSession()
try{
     session.startTransaction()

      const transaction = (await transactionModel.create([
        {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
      }], {session} ))[ 0 ]

      await ledgerModel.create([{
        account : fromAccount,
        amount : amount ,
        transaction : transaction._id,
        type: "DEBIT"
      }], {session})

      await ledgerModel.create([{
        account : toAccount,
        amount : amount ,
        transaction : transaction._id,
        type: "CREDIT"
      }], {session})

       const completedTransaction = await transactionModel.findOneAndUpdate(
        {  _id: transaction._id },
        { status : "COMPLETED"},
        { session, new: true }
       )

      await session.commitTransaction()
      session.endSession()

    await emailService.sendTransactionSuccessEmail(req.user.email, req.user.name, amount, completedTransaction._id ,toAccount)

    return res.status(201).json({
       message : "Transaction completed successfully",
       transaction : completedTransaction 
    })
   } catch(error){
      await session.abortTransaction().catch(() => {})
      session.endSession()
      console.error("Transaction error:", error)
      return res.status(500).json({
        message : "Transaction failed due to a server error"
    })
  }
}

async function createInitialFundsTransaction(req,res){
   const {toAccount, amount , idempotencyKey} = req.body

    if(!toAccount || amount===undefined || amount === null || !idempotencyKey){
    return res.status(400).json({
        message : "toAccount amount  and idempotencyKey are required "
    })
   }
    
    if (!mongoose.Types.ObjectId.isValid(toAccount)) {
    return res.status(400).json({ message: "toAccount must be a valid account ID" })
    }

   if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "amount must be a positive number" })
   }


  const isTransactionAlreadyExists = await transactionModel.findOne({ idempotencyKey })

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
    return res.status(200).json({
      message: "Transaction already processed",
      transaction: isTransactionAlreadyExists
    })
    }
    if (isTransactionAlreadyExists.status === "PENDING") {
    return res.status(200).json({ message: "Transaction is still processing" })
   }
  return res.status(409).json({ message: `Transaction previously ${isTransactionAlreadyExists.status.toLowerCase()}, please retry with a new idempotency key` })
  }


   const toUserAccount = await accountModel.findOne({
    _id: toAccount

   })

   if(!toUserAccount){
    return res.status(400).json({
        message : "Inavalid toAccount"
    })
   }

    const fromUserAccount = await accountModel.findOne({
     user : req.user._id
    })

   if(!fromUserAccount){
    return res.status(400).json({
        message :  "SystemUser account  not found"
    })
   }

   const session = await mongoose.startSession()
   try{
   session.startTransaction()

   const transaction = await  transactionModel.create([{
       fromAccount: fromUserAccount._id,
       toAccount,
       amount,
       idempotencyKey,
       status : "PENDING"
   }], { session } ) 

   const debitLedgerEntry = await ledgerModel.create([{
    account: fromUserAccount._id,
    amount : amount,
    transaction : transaction._id,
    type : "DEBIT"
}], {session})

   const creditLedgerEntry = await ledgerModel.create([{
    account: toAccount,
    amount : amount,
    transaction : transaction._id,
    type : "CREDIT"
   }], {session})

   transaction.status = "COMPLETED"
   await transaction.save ({ session })
   await session.commitTransaction()
   session.endSession()

   return res.status(201).json({
    message : "Initial funds transaction completed successfull",
    transaction : transaction
   })
} catch(error){
    await session.abortTransaction()
    session.endSession()
    console.error("Error during initial funds transaction:", error)
    return res.status(400).json({
        message : "An error occurred while processing the transaction"
    })
}

}

async function getUserTransactions(req, res) {
  const userAccounts = await accountModel.find({ user: req.user._id }).select("_id")
  const accountIds = userAccounts.map((account) => account._id)

  const transactions = await transactionModel
    .find({
      $or: [
        { fromAccount: { $in: accountIds } },
        { toAccount: { $in: accountIds } }
      ]
    })
    .sort({ createdAt: -1 })

  res.status(200).json({ transactions })
}

module.exports = {
    createTransaction,
    createInitialFundsTransaction,
    getUserTransactions
}