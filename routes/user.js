const express = require("express");
const router = express.Router();
const user = require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");


router.get("/signup", (req, res) => {
  res.render("users/signup");
});


router.get("/login", (req, res) => {
  res.render("users/login");
});


router.post("/signup", wrapAsync(async(req, res) => {
  try{
    let { username,email,password } = req.body;
    const existingUser = await user.findOne({email});
    if(existingUser){
      req.flash("error","User already exists, please login 😦");
      return res.redirect("/signup");
    }//in above code we checked if user exists or not, if does we give flash otherwise
//in below code the user gets registered for 1st time and then logged in right after signup
    const newUser = new user({username,email});//yaha par newuser se email,name lia
    const registeredUser = await user.register(newUser,password);//then passport would add salt and hashing in password for security
    req.login(registeredUser, (err)=>{//jab register hogya then loggedin bhi hogya user
      if(err){
        return next(err);
      }
      req.flash("success","You are successfully registered 😎");
      res.redirect("/hobbies");
    });
  }
  catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
  }
}));


router.post("/login", passport.authenticate("local",{ //passport pehle autheticate karega ki psw and username both are correct or not
    failureRedirect: "/login",
    failureFlash: "Username or password is incorrect 😕"//if not then flash and redirect will happen
  }),
  //if correct credentials then below will happen
  (req, res) => {
    req.flash("success", `Welcome Back ${req.user.username}✨`);
    const redirectUrl = res.locals.redirectUrl || "/hobbies";
    res.redirect(redirectUrl); 
});

router.get("/logout",(req,res)=>{
  req.logout(function(err){
    if(err){
      return next(err);
    }
    req.flash("success","You're logged out! Come back tomorrow to keep your streak going 😇");
    res.redirect("/hobbies");
  });
});
module.exports = router;
