const mongoose = require("mongoose")

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

const accountModel = mongoose.model("account", accountSchema)

module.exports = accountModel