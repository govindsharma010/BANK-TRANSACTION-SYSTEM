const {Router} = require("express")
const { body , validationResult} = require("express-validator");
const authMiddleware = require("../middleware/auth.middleware")
const transactionController = require("../controllers/transaction.controller")

const transactionRoutes = Router();
const asyncHandler = require("../utils/asyncHandler")
const validateTransaction = [
  body("fromAccount").isMongoId().withMessage("fromAccount must be a valid account id"),
  body("toAccount").isMongoId().withMessage("toAccount must be a valid account id"),
  body("amount").isFloat({ gt: 0 }).withMessage("amount must be a positive number"),
  body("idempotencyKey").isString().notEmpty().withMessage("idempotencyKey is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }
    next();
  }
]
/**
 * -POST/api/transactions/
 * -Create a new transaction
 */

transactionRoutes.post("/", asyncHandler(authMiddleware.authMiddleware), validateTransaction, transactionController.createTransaction)

/**
 * GET /api/transactions
 */
transactionRoutes.get("/", asyncHandler(authMiddleware.authMiddleware), asyncHandler(transactionController.getUserTransactions))

/**
 * -POST /api.transaction/system/initial-funds
 * -Create initial funds transaction from system user
 */

transactionRoutes.post("/system/initial-funds", asyncHandler(authMiddleware.authSystemUserMiddleware), transactionController.createInitialFundsTransaction )
module.exports = transactionRoutes

