const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service");
const tokenBlackListModel = require("../models/blackList.model");


/**
 * - user register controller
 * - POST /api/auth/register
 */
async function userRegisterController(req, res){
    try{
   const {email, password, name} = req.body;
  // this is a process called validation, we are checking if the user already exists with the email or not, if exists then we will return an error message to the client, if not then we will create a new user in the database
   if(!email || !password || !name){
    return res.status(400).json({
        message: "All fields are required"
    })
   }
   const isExist = await userModel.findOne({
    email : email
   })

   if(isExist){
    return res.status(422).json({
        message: "User already exists with email",
        status : "failed"
    })
   }

   const user = await userModel.create({
    email, password, name
   })

   const token = jwt.sign({userId : user._id }, process.env.JWT_SECRET, {expiresIn: "3d"} )
   res.cookie("token", token, {
    httpOnly : true,
    secure : process.env.NODE_ENV === "production",
    sameSite : "lax",
    maxAge: 3 * 24 * 60 * 60 * 1000
   })
   res.status(201).json({
    user: {
        _id: user._id,
        email: user.email,
        name: user.name
    },
    token
   })

    emailService.sendRegistrationEmail(user.email, user.name).catch(err => {
      console.error("Failed to send registration email:", err);
    });

  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      return res.status(422).json({ message: "User already exists with email" });
    }
    console.error("Register error:", err);
    return res.status(500).json({ message: "Something went wrong during registration" });
  }
}


/**
 * -user login controller
 * -POST /api/auth/login
 * 
 */
async function userLoginController(req, res){
    const {email, password} = req.body

    const user = await userModel.findOne({email}).select("+password")  // bydefault password query me nhi aayega isliye select me +password likhna padta hai
    if(!user){
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if(!isValidPassword){
        return res.status(401).json({
            message : "Invalid Credentials"
        })
    }

    const token = jwt.sign({userId : user._id}, process.env.JWT_SECRET, {expiresIn: "3d"})
    res.cookie("token", token, {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "lax",
        maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
    })

    res.status(200).json({
        message : "User LoggedIn Successfully!",
        user: {
            _id : user._id,
            email: user.email,
            name : user.name
        },
        token
    })

   
}
/**
 * -User Logout Controller
 * -POST/api/auth/logout
 */
async function userLogoutController(req, res){
   const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]  

if(!token ){
    return res.status(200).json({
        message : "User logged out successfully"
    })
}
 res.clearCookie("token", {
    httpOnly : true,
    secure : process.env.NODE_ENV === "production",
    sameSite : "lax"
 })
 await tokenBlackListModel.create({
    token : token
 })

  res.status(200).json({
    message : "User logged out successfully"
  })
}
/**
 * GET /api/auth/me
 */
async function getMeController(req, res) {
  res.status(200).json({
    user: {
      _id: req.user._id,
      email: req.user.email,
      name: req.user.name
    }
  })
}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController,
    getMeController
}