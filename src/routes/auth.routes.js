const express = require("express");
const authController = require("../controllers/auth.controller")

const router = express.Router();


// creating endpoints or  api

router.post("/register", authController.userRegisterController) // api looks like /api/auth/register

/*POST / api/auth/login */
router.post("/login", authController.userLoginController) // api looks like /api/auth/login

/**
 * -POST/api/auth/logout
 */
router.post("/logout", authController.userLogoutController)

module.exports = router