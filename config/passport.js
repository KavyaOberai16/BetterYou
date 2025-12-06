//the below file consists of applying OAuth using googlecloud, mtlb signin through google
require("dotenv").config();

const passport = require("passport");
const LocalStrategy = require("passport-local");
const googleAuth = require("passport-google-oauth20");
const user = require("../models/user");

passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser((user,done)=>{ // serializer basically stores the user id in its session
    done(null,user._id);
});
passport.deserializeUser(async (id,done)=>{ //deserialize kya karta hain based upon that user id, it checks the 
// whole profile of user in its db and based upon that certain functionalities are done, for eg when we login back it shows our prev progress
    try{
        const detailsfromDB = await user.findById(id);
        done(null,detailsfromDB);
    }
    catch(err){
        done(err,null); 
    }
});

const googleStrategy = googleAuth.Strategy; //From the passport-google-oauth20 package, I’ll be using the Strategy class to configure Google login.

const credentials = {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
};

//the below code has been acquired from google auth documentation
passport.use(new googleStrategy({
    clientID: credentials.clientID,
    clientSecret: credentials.clientSecret,
    callbackURL: "/auth/google/callback"
},
//accesstoken means req to google api on user's behalf, refreshtoken if token expires, the users basic info is 
// sent by google to the website in the form of profile
// When a user logs in through Google, Google sends your app a profile object.
// This contains details like:
// profile.id → Unique Google ID for that user, profile.displayName → Their name on Google,  profile.emails[0].value → Their email
async(accessToken, refreshToken, profile, done) =>{
    try{
        //in below code if person is already existinguser it will get login by googel
         existingUser = await user.findOne({ googleId: profile.id });
        if(existingUser){
            return done(null, existingUser);
        }
//in below case if existing user exists in normal website login but does not through google, then google will 
// take website profile of user make it as own if user tries to login through google, and save it
        existingUser = await user.findOne({ email: profile.emails[0].value });
        if(existingUser){
            existingUser.googleId = profile.id;
            await existingUser.save();
            return done(null,existingUser);
        }
        //if neither of the above cases then a new existingUser will get created by google
        existingUser = await user.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value
        });
        return done(null,existingUser);
    }
    catch(err){
        return done(err,null);
    }
}));

//Below steps of how Oauth works
// Flow of login
// User clicks “Login with Google”
// Your app sends them to Google’s login page
// Google authenticates the user
// Google sends the user back to the URL you specified (/auth/google/callback) with info about the user
// Your route at /auth/google/callback takes that info, logs the user in, and finally redirects them wherever you want (/hobbies/hobbyPage)