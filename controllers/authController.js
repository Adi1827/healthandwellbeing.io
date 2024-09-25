const jwt = require("jsonwebtoken");
const schedule = require("node-schedule")
const User = require("../models/userModels");
const sendEmail = require("../config/email");
const headers = new Headers();
const Register = require("../utils/userRegister");

exports.loginPageRender = function (req, res) {
  if (req.cookies.session) {
    res.redirect("/landing");
  } else {
    res.render("login");
  }
};

exports.userLogin = async function (req, res) {
  try {
    const { uname, pwd } = req.body;
    console.log(pwd);
    
    const userAvailable = await User.findOne({
      where: { userName: uname, password: pwd },
    });

    if (userAvailable) {
      // Sends Mail to User on LogIn
      sendEmail.sendLoginMail(userAvailable);
      // Signing the jwt
      const token = jwt.sign(
        { uname: uname, pwd: pwd },
        process.env.SECRET_KEY,
        { expiresIn: "150d" }
      );
      res.cookie("session", token, { httpOnly: true, secure: true, maxAge: 1000*60*60*24*150 });
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
    if (req.cookies.session) {
      res.redirect("/landing");
    } else {
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

exports.jwtVerifier = async function (req, res) {
  const authHeader = req.cookies.session;
  if (authHeader) {
    const token = authHeader;
    try {
      // Configuring the user's particular Jobs
      const jobs = Object.keys(schedule.scheduledJobs);      
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      const userID = await User.findOne({
        where : {
          userName : decoded.uname,
        },
        attributes : ["id"]
      });
      const jobList = jobs.map(
        (x)=>
          {
            console.log(x);
            
            if(parseInt(x.split(':')[0])===userID.id && jobs.length!=0 && !x.split(':')[2].match(/.*-Report$/)){
              return x.split(':')[1];
            }
         })

      res.render(`landing`, { decoded ,jobList });
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
    const userCreate = Register.userRegister(
      verifyToken.name,
      verifyToken.lname,
      parseInt(verifyToken.age),
      verifyToken.email,
      verifyToken.uname,
      verifyToken.pwd );

    if(userCreate){
    console.log("User Verified and Registering");
    const token = jwt.sign(
      { uname : verifyToken.uname, pwd: verifyToken.pwd },
      process.env.SECRET_KEY,
      { expiresIn: '100d' }
    )
    res.cookie("session",token, {httpOnly:true, secure:true, maxAge:1000*60*60*24*100})
    res.redirect('/login');}
    else{
    console.log("User Verified but not Registering");
    res.status(404).send("Couldn't register the User");
  }}
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
    { expiresIn: "150d" }
  );
  sendEmail.sendRegistrationMail(name, email, token);
  res.render("waitingPage", { email });
};

exports.userLogout = function (req, res) {
  if (req.cookies.session) {
    res.clearCookie("session");
    res.status(200);
    res.redirect("/login");
  } else
    res.status(401).send(`<head>
        <meta http-equiv='refresh' content='2; URL=/login'></head>LogIn to access this functionality`);
};
