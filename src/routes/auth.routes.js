const express = require("express");
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")

const router = express.Router();

const asyncHandler = require("../utils/asyncHandler")
// creating endpoints or  api

router.post("/register", asyncHandler(authController.userRegisterController)) // api looks like /api/auth/register

/*POST / api/auth/login */
router.post("/login", asyncHandler(authController.userLoginController))

/**
 * -POST/api/auth/logout
 */
router.post("/logout", asyncHandler(authController.userLogoutController))

/**
 * GET /api/auth/me
 */
router.get("/me", asyncHandler(authMiddleware.authMiddleware), asyncHandler(authController.getMeController))

module.exports = router