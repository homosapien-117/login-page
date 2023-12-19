const express = require("express")
const app =express();
const {router} = require("./router/router")
const session = require("express-session")
const nocache = require("nocache")
const {admin}=require("./router/admin")
// const path = require("path")
//view engine
app.set("view engine","ejs")





//session
app.use(nocache());
app.use(session({
    secret:"your-secret-key",
    resave:false,
    saveUninitialized:true
}))




//router conect
app.use("/",router);
app.use("/admin",admin);





//HOST

    app.listen(5000,()=>{
        console.log("Server running on port http://localhost:5000")
    })