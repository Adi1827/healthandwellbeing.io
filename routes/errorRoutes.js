const express = require("express");
const router = express.Router();

// router.use((req,res,next)=>{
//     const err=new Error("Page not found!");
//     err.status=404;
//     next(err);
// })

router.get("*",(err,req,res,next)=>{
    res.render("default",{err});
})

module.exports=router;