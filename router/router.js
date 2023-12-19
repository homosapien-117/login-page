const express = require("express");
const router =express.Router();
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

router.use(express.urlencoded({extended:true}))

//connecting mongoose
mongoose.connect("mongodb://127.0.0.1:27017/profile").then(console.log("done"));
const userschema = new mongoose.Schema({
    username : String,
    email : String,
    password : String,
});
const usersModel = new mongoose.model("user",userschema)


function signin(req,res,next){
    if(req.session.isAuth){
        next();
    }
    else{
        res.redirect("/")
    }
    
}

//login page
router.get("/",async(req,res)=>{
    if(req.session.isAuth){
        res.redirect("/home")
    }
    else{
        res.render("login")
    }
})



//Signup page
router.get("/signin",(req,res)=>{
  if(req.session.isAuth){
    res.redirect("/home")
  }
  else{
    res.render("signin")
  }
})
//signup data collection
router.post("/signin",async(req,res)=>{
    const emailexist = await usersModel.findOne({
    email:req.body.email});
    if(emailexist){
        res.render("signin",{emailexist:"e-mail alredy exist"});
    }
    else{
        const hashedpassword = await bcrypt.hash(req.body.password,10);
        const {username,email,password} = req.body;
        await usersModel.insertMany([
            {username:username,email:email,password:hashedpassword}
        ]);
        res.redirect("/");
    }
});


//login process
router.post("/login",async (req,res)=>{
    try {
        const data = await usersModel.findOne({
        username: req.body.username});
        const passwordmatch = await bcrypt.compare(req.body.password,data.password);
        if(passwordmatch){
            req.session.username = req.body.username;
            req.session.isAuth=true;
            res.redirect("/home")
        }
        else{
            res.render("login",{perror:"Invalid password"})
        }
    } catch {
        res.render("login",{unerror:"Invaild Username"});
    }
})


//home page
router.get("/home",signin,(req,res)=>{
    if(req.session.isAuth) {
        res.render("home")
    }
    else {
        res.redirect("/")
    }
});
   







router.get("/logout", (req, res) => {
    req.session.isAuth = false;
    req.session.destroy();
    res.redirect("/");
  });


module.exports={router,usersModel}



