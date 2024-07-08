const jwt = require("jsonwebtoken");
const DataTypes = require("sequelize");
const User = require("../models/userModels");
const sendEmail = require("../config/email");
const headers = new Headers();
const Register = require("../utils/userRegister");

exports.loginPageRender = function (req, res) {
  if (req.cookies.jwt) {
    res.redirect("/landing");
  } else {
    res.render("login");
  }
};

exports.userLogin = async function (req, res) {
  try {
    const { uname, pwd } = req.body;
    const userAvailable = await User.findOne({
      where: { userName: uname, password: pwd },
    });

    if (userAvailable) {
      // Sends Mail to User on LogIn
      sendEmail.sendLoginMail(userAvailable);
      const token = jwt.sign(
        { uname: uname, pwd: pwd },
        process.env.SECRET_KEY,
        { expiresIn: "60s" }
      );
      res.cookie("jwt", token, { httpOnly: true, secure: true, maxAge: 60000 });
      res.status(200).send(token);
    } else {
      res.status(401).send("Username or Password not valid");
    }
  } catch (err) {
    if (err) res.render("default", err);
  }
};

exports.userSignUpPageRender = async function (req, res) {
  try {
    // IF USER ALREADY LOGGEDIN
    if (req.cookies.jwt) {
      res.redirect("/landing");
    } else {
      // const usernames = await User.findAll(
      //   {attributes: ["userName"]}
      // );
      res.render("signup");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.userRegister = async function (req, res) {
  try {
    const { name, lname, age, uname, email, password } = req.body;
    const created = await Register.userRegister(
      name,
      lname,
      age,
      uname,
      email,
      password);

    if (created) {
      res.redirect("/login");
    } else res.redirect(404, "/signup");
  } catch (err) {
    if (err) {
      console.error(err);
      res.status(404).send(err.message);
    }
  }
};

exports.jwtVerifier = function (req, res) {
  const authHeader = req.cookies.jwt;
  if (authHeader) {
    const token = authHeader;
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      res.render(`landing`, { decoded });
    } catch (err) {
      res.status(401).send(`<head>
      <meta http-equiv='refresh' content='2; URL=/login'>
      </head>
      Error: ${err.message}<br>If not redirected automatically click here <a href="/login">Click here to login again</a>`);
    }
  } else {
    res.status(403).send(`<head>
      <meta http-equiv='refresh' content='2; URL=/login'>
      </head><body><h1>Access Denied</h1><p>Please login to access </p>
      </body>
      `);
  }
};

exports.tokenRegister = function (req, res) {
  const verifyToken = jwt.verify(req.params.token, process.env.SECRET_KEY);
  if (verifyToken) {
    // Registering User 
    // console.log(verifyToken.name);
    const userCreate = Register.userRegister( verifyToken.name, verifyToken.lname, parseInt(verifyToken.age), verifyToken.email, verifyToken.uname, verifyToken.pwd );
    if(userCreate){
    console.log("User Verified and Registering");
    res.redirect('/login');
  }
  else{
    console.log("User Verified but not Registering");
    res.status(404).send("Could'nt register the User");
  }
  }
  // res.cookies("jwt",req.params.token,)
};

exports.verifyUser = function (req, res) {
  const { name, lname, age, uname, email, password } = req.body;
  const token = jwt.sign(
    {
      name: name,
      lname: lname,
      age: age,
      email: email,
      uname: uname,
      pwd: password,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );
  sendEmail.sendRegistrationMail(name, email, token);
  res.render("waitingPage", { email });
};

exports.userLogout = function (req, res) {
  if (req.cookies.jwt) {
    res.clearCookie("jwt");
    res.status(200);
    res.redirect("/login");
  } else
    res.status(401).send(`<head>
        <meta http-equiv='refresh' content='2; URL=/login'></head>LogIn to access this functionality`);
};
