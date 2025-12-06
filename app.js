require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const hobbiesRouter = require("./routes/hobbies");
const userRouter = require("./routes/user");
const flash = require("connect-flash");
const passport = require("passport");
const authRouter = require("./routes/auth");
const ExpressError = require("./utils/ExpressError");
const {navbarChange} = require("./middleware");
const MongoStore = require("connect-mongo");
require("./config/passport");
const methodOverride = require("method-override");
const User = require("./models/user");

app.use(methodOverride("_method")); //for post and delete

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended:true }));

app.engine("ejs",ejsMate); 

const MONGO_URL = process.env.MONGO_URL;

//below code is from mongoose documentation
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("error has occurred");
  });

async function main() {
  await mongoose.connect(MONGO_URL); //mongodb se connect hogya so that we could host our website 
}
//till here

//sessions has been downloaded, and below code is borrowed from npm session package doc
const session = require("express-session");

//we downloaded mongostore, so that if any change i do in website, it will keep us loggedin, and i dont hv to keep loging again 
const sessionStore = MongoStore.create({
  mongoUrl: MONGO_URL,
  collectionName: "sessions",
  ttl: 14 * 24 * 60 * 60 // 14 days
});

const sessionOptions = {
    secret: process.env.SECRET, 
    resave: false, //agar koi change nhi hua then session will not save anything this saves time
    saveUninitialized: true, //we can save empty sessions as well
    store: sessionStore,
    cookie: {
        //below it say sit will expire in 7 days, 24 hours, 60 min, 60 sec, 1000 millisecond
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};
//till here

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");//locals helps in making it available in other templates
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; //it contains the user object of whoever is logged in.
  // If user is logged in, isAuthenticated = true. If not logged in, isAuthenticated = false, applied to every page
  if (req.user) {
  res.locals.isAuthenticated = true;
} else {
  res.locals.isAuthenticated = false;
}
  next(); // this way the site wont keep loading
});

app.use(passport.initialize()); //sets up Passport for every request.
app.use(passport.session()); //connects Passport with express-session so logged-in users stay logged in as they move between pages.

app.use(navbarChange);

app.use(hobbiesRouter);   // all hobby-related routes start with /hobbies
app.use(userRouter);        // all user routes start with /users
app.use(authRouter);         // all auth routes like Google login


app.get("/user-count", async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (e) {
        res.json({ count: 0 });
    }
});



app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


app.use((err,req,res,next)=>{
  let { statusCode = 500, message= "Something went wrong"} = err;
  res.status(statusCode).render("error.ejs",{message});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port:", PORT);
});

