const express = require("express");
const authController = require('../controllers/authController');
const emailController = require('../controllers/emailController');
const router = express.Router();

router.get("/landing",authController.jwtVerifier);

router.post("/oneTimeJob",emailController.oneTimeJob);

router.post("/recurJob",emailController.recurringJob);

module.exports=router;