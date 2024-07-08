const express = require("express");
const authController = require('../controllers/authController');
const router = express.Router();

// router.get("*",authController.authenticate);

router.get("/signup", authController.userSignUpPageRender);

router.get("/login", authController.loginPageRender);

router.get("/logout", authController.userLogout);

router.get("/verify/:token",authController.tokenRegister);

router.post("/verifyUser",authController.verifyUser);

router.post("/login", authController.userLogin);

module.exports = router;