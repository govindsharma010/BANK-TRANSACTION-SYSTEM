const mongoose = require("mongoose")
const ledgerModel = require("./ledger.model")

const accountSchema  = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : [true, "Account must be associated with a user"],
        index : true // for faster lookups

    },
    status:{
        type : String,
        enum : {
            values: ["ACTIVE" , "FROZEN", "CLOSED"],
            message:"Status can be either ACTIVE, FROZEN or CLOSED",
           
        },
         default : "ACTIVE"
       
    },
    currency : {
        type : String,
        required : [true, "Currency is required"],
        default : "INR"
    }

}, {
    timestamps : true
})

// Compound index to ensure uniqueness of user and status combination
accountSchema.index({user : 1, status: 1})  // if we have to find on the basis of user and status, it will be faster
accountSchema.methods.getBalance = async  function(){
    const balanceData = await ledgerModel.aggregate([
           { $match: {account: this._id} },
           {
             $group: {
                _id: null, // this is null so that let mongoDB do not create sepreate group for credit and debit 
                totalDebit : {
                    $sum : {
                        $cond : [
                            {  $eq : ["$type", "DEBIT"]},
                           "$amount",
                           0
                        ]
                    
                    }
                },
                totalCredit : {
                    $sum : {
                        $cond : [
                            { $eq : ["$type", "CREDIT"]},
                            "$amount",
                            0
                        ]
                    }
                }
             }
            },
            {
                $project : {
                  _id: 0,
                  balance : {$subtract : ["$totalCredit", "$totalDebit"]}
                }
            }
    ])

    // if ledger is empty 
    if(balanceData.length === 0){
        return 0
    }
    return balanceData[0].balance // if we got some balance if ledger not empty
}

const accountModel = mongoose.model("account", accountSchema)

module.exports = accountModel