import express from "express";
import path from "path";
import conn from "./src/db/conn.js"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;

const __views = path.join('C:', 'Users', 'Aditya', 'OneDrive', 'Desktop', 'Health-Wellbeing','src','views');
const __dirname1 = path.join('C:', 'Users', 'Aditya', 'OneDrive', 'Desktop', 'Health-Wellbeing')
app.set("views",__views)

app.use(express.urlencoded());
app.use(express.static(path.join(__dirname1,"public")));
app.use(express.json());

if(!process.env.SECRET_KEY){
    throw new Error("Secret Key must be declared");
}

// var data;
// conn.query(`SELECT * FROM USER`,[],(err,results)=>{
//     if(err){
//         console.log(err);
//         }
//         data=results;
// })


// const User = require("../models/userModel");
// exports.authenticate = async (req, res,next) => {
//     try {
//         const token= req.header("Authorization").replace("Bearer ","");
//         if(!token){
//             return res.status(401).json({
//                 success: false,
//                 message: "Please login to access this service."
//             })
//         }

//         const decode=await jwt.verify(token,"Pushti-Soni")

//         const userData= await User.findById(decode.id)
//         if(!userData){
//             return res.status(401).json({
//                 success: false,
//                 message: "Please login to access this service."
//             })
//         }

//         req.user= decode;
//         next();
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//         })
//     }
// }

app.get("/signup",(req,res)=>{
    res.render(__views+'/signup.ejs');
})

app.get("/login",(req,res)=>{
    console.log(req.headers);
        res.render(__views+'/login.ejs');
})

app.post("/login",(req,res)=>{
    const {uname,pwd}=req.body;
    if(uname===process.env.USERNAME && pwd===process.env.PASSWORD){
        const token = jwt.sign({"uname":uname,"pwd":pwd},process.env.SECRET_KEY,{expiresIn:10000});
        // res.set("Authorization",`Bearer ${token}`);
        // console.log(req.header("Authorization")?.replace("Bearer ",""));
        res.redirect(`/landing?token=${token}`);
    }
    else{
     console.log(process.env.USERNAME,process.env.PASSWORD);   
        res.sendStatus(401,"UserName Password not valid")
    }

})

app.get("/landing",(req,res)=>{
    // console.log("Landing Page ",req.header("authorization"));
    const authHeader = req.query.token;
    if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            res.send(`Welcome to the landing page, ${decoded.uname}!`);
        } catch (err) {
            res.sendStatus(401,"Is true but error");
        }
    } else {
        res.status(403).send("Your header isn't Available");
    }

})
// });
//     // if(req.session?.logged){
//         // console.log(req.sessionID);
//     }
// //     else
// //     res.redirect('/login');
// // }
// )

// app.post("/details",(req,res)=>{
//     const decode = jwt.verify(req.header("Authorization").replace("Bearer ",""),'Aditya-Dalwadi',(err,token)=>{
//         if(err) throw err;
//         return token;
//     })
//     console.log(req.headers);
//     res.send(decode.uname);
//     // if(req.body.uname===user.username && req.body.pwd===user.password){
//     //     req.session.logged = true;
//     // res.send(`
//     //     <!DOCTYPE html>
//     //   <html lang="en">
//     //   <head>
//     //     <meta charset="UTF-8">
//     //     <meta http-equiv="refresh" content="3; url=/landing">
//     //     <title>Welcome to MedKarts</title>
//     //   </head>
//     //   <body>
//     //     Welcome ${user.username}
//     //     </body>
//     //   </html>`)
//     }
//     // else{res.send(`
//     //     <!DOCTYPE html>
//     //   <html lang="en">
//     //   <head>
//     //     <meta charset="UTF-8">
//     //     <meta http-equiv="refresh" content="5; url=/login">
//     //     <title>Invalid Credentials</title>
//     //   </head>
//     //   <body>
//     //     <h1>Please enter correct details. Redirecting to login page in 5 seconds...</h1>
//     //   </body>
//     //   </html>
//     //   `)}
// // }
// )

// app.delete('/logout',(req,res)=>{
//     try {
//         if(req.session?.logged){
//             req.session.destroy((req.sessionID),(err)=>{
//             if(err){
//                 console.log(err);
//                 return err;}
//             else{
//                 console.log("Destroyed Sucessfully",req.sessionID);
//                 res.sendStatus(200);
//             }
//         })}
//         else{
//             res.redirect('/login');
//         }
//     } catch(error) {
//         console.log("Error Logging Out")
//         res.status(505).send({error : error.message});
//     }
    
// })

app.listen(port,(err)=>{
    if(err){
        console.log("Some error starting the server...",err);
        throw err;
    }
    console.log(`Server Started on http://localhost:${port}/login`);
})
