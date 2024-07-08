const express = require("express");
const authController = require('../controllers/authController')
const router = express.Router();

router.get("/landing",authController.jwtVerifier);

module.exports=router;