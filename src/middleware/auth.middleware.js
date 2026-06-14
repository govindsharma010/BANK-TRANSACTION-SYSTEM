const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../models/blackList.model")

async function authMiddleware(req, res, next){
  // checking weather the token is available in cookie ( or headers) or not
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
  if(!token){
    return res.status(401).json({
        message  :"Unauthorized Access token is missing"
    })
  }
  const isBlackListed = await tokenBlackListModel.findOne({token})
  if(isBlackListed){
    return res.status(401).json({
      message : "Unauthorized access, token is invalid"
    })
  }

  try{

     const decoded = jwt.verify(token, process.env.JWT_SECRET) // inside decoded we will get userId as the same data (id) we used(auth.controller) in creating a token

     const user = await userModel.findById(decoded.userId)

     req.user = user

     return next()


  }catch(err){
    return res.status(401).json({
        message: "Unauthorized access, token is invalid"
    })   
  }

}
async function authSystemUserMiddleware(req,res, next){
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

  if(!token){
    return res.status(401).json({
      message : "Unauthorized access, token is missing"
    })
  }
  const isBlackListed = await tokenBlackListModel.findOne({token})
  if(isBlackListed){
    return res.status(401).json({
      message : "Unauthorized access, token is invalid"
    })
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findById(decoded.userId).select("+systemUser")
    if(!user || !user.systemUser){
      return res.status(403).json({
        message : "forbidden access, not a system user"
      })
    }
    req.user = user
    return next()
  }
  catch(err){
    return res.status(401).json({
      message: "Unauthorised access, token is invalid"
    })
  }
}

module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}