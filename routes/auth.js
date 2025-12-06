const express = require("express");
const passport = require("passport");
const router = express.Router();

//the below route basically bhej deta hain user to google ki aap iska login kardo, jab hojae toh behj dena wapis
//scope mtlb website basically mang rha kya kya cheeze usse chahiye for the user to access its website 
router.get("/auth/google", //passport is itself a middleware so no requirement for re,res
    passport.authenticate('google', {scope:['profile','email']}));

//the below route signifise
//After the user signs in on Google and clicks “Allow”, Google redirects the user back to this route. 
// Passport now: Takes the “authorization code” sent by Google. Exchanges it behind the scenes for an access token and the user’s profile.

//Either: If successful → puts the user’s info into req.user and moves to the next function. If it fails → redirects 
// to the failureRedirect URL. The final (req, res) handler only runs if authentication succeeded → we redirect to /hobbies.
router.get("/auth/google/callback",
    passport.authenticate("google", {failureRedirect: "/"}),
    (req,res) => {
        req.flash("success",`Welcome Back ${req.user.username}✨`)
        res.redirect("/hobbies");
    }
);

module.exports = router;