const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    
      email: {
        type : String,
        required : [true, "Email is required for creating a user"],
        trim : true,
        lowercase : true,
        match : [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email"],
        unique : [true, "email already exists"]
    },
    name : {
        type : String,
        required : [true, "Name is required for creating an account"],

    },

    password : {
        type : String,
        required :[ true, "Password is required for creating an account"],
        minLength : [6, "password should contain min 6 character"],
        select : true // bydefault query me nhi aayega when we requireed user deatils if false and if chahiye to true karo
    },
    systemUser : {
      type : Boolean,
      default : false,
      immutable : true,
      select : false
    }
}, {
    timestamps : true
})

userSchema.pre("save", async function(){ // jb bhi user data saved this fn will be executed
 if(!this.isModified("password")){
    return 
 }
 // if password changed
 const hash = await bcrypt.hash(this.password, 10)   // 10 round of sort
 this.password = hash

 return 
})

 userSchema.methods.comparePassword = async function( password ){
    return await bcrypt.compare(password, this.password); // this point to databse saved data
 }

 const userModel = mongoose.model ("user", userSchema) // schema_name, schema passed as argument to create a usermodel
 
 module.exports = userModel;