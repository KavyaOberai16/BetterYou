const Hobby = require("./models/hobbies");
const dailyLog = require("./models/dailyLogs");
const ExpressError = require("./utils/ExpressError");
const {dailyLogsSchema} = require("./schema");

module.exports.validation = (req,res,next)=>{
    let {error} = dailyLogsSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error.details[0].message);
    }
    else{
        next();
    }
};
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You need to login first, to start a hobby 🤐");
        return res.redirect("/hobbies");
    }
    next();
}
module.exports.navbarChange = (req,res,next)=>{//this middleware is puted in app.js and navbar.ejs has been modified as to when show login,logout,mypage ets
//locals meaning in my local system the passport who has embedded system of checing if it isAuthenticated based on req of user
    res.locals.isAuthenticated = req.user? true:false;
    next();
}
