const express = require("express")
const authMiddleware = require("../middleware/auth.middleware") 
const accountController = require("../controllers/account.controller")

const router = express.Router()
const asyncHandler = require("../utils/asyncHandler")
/**
 * -POST /api/account/
 * -Create a new account
 * -Protected Route (authentication by middleware)
 */
 router.post("/", asyncHandler(authMiddleware.authMiddleware), accountController.createAccountController)

 /**
  * -GET/api/accounts
  * -Get all accounts of the looged_in user
  * -Protected Route
  */
 router.get("/", asyncHandler(authMiddleware.authMiddleware), accountController.getUserAccountsController)
 
 /**
  * -GET/api/accounts/balance/:accountId
  * 
  */
 
 router.get("/balance/:accountId", asyncHandler(authMiddleware.authMiddleware), asyncHandler(accountController.getAccountBalanceController))

module.exports = router