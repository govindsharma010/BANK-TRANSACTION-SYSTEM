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

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "FromAccount, toAccount, amount and idempotencyKey are required"

        })
    }
    const fromUserAccount = await accountModel.findOne({
        _id : fromAccount
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message: "Invalid fromAccount or toAccount"
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
            return res.status(500).json({
                message: "Transaction is in processing"
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

     
try{
     const session = await mongoose.startSession()
     session.startTransaction()  // after this whatever we would do  will occcur all at once otherwise not 

      const transaction = (await transactionModel.create([
        {
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
      }], {session} ))[ 0 ]

      const debitLedgerEntry = await ledgerModel.create([{
        account : fromAccount,
        amount : amount ,
        transaction : transaction._id,
        type: "DEBIT"
      }], {session})

      await (() => {
       return new Promise((resolve)  => setTimeout(resolve, 15 * 1000))  
      })()

      const creditLedgerEntry = await ledgerModel.create([{
        account : toAccount,
        amount : amount ,
        transaction : transaction._id,
        type: "CREDIT"
      }], {session})
      // transaction.status = "COMPLETED"
      // await transaction.save({session})

       await transactionModel.findOneAndUpdate(
        {  _id: transaction._id },
        { status : "COMPLETED"},
        { session }
       )

      await session.commitTransaction()
      session.endSession()
    

    /**
     * 10. Send Transaction Email
     */
    await emailService.sendTransactionSuccessEmail(req.user.email, req.user.name, amount, transaction._id ,toAccount)

    return res.status(201).json({
       message : "Transaction completed successfully",
       transaction : transaction 
    })
   } catch(error){

      return res.status(400).json({
        message : "transaction is Pending due to some issue"
    })
  }
}

async function createInitialFundsTransaction(req,res){
   const {toAccount, amount , idempotencyKey} = req.body

    if(!toAccount || !amount || !idempotencyKey){
    return res.status(400).json({
        message : "toAccount amount  and idempotencyKey are required "
    })
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

}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}