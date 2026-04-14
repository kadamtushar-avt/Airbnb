require("dotenv").config(); // must be at top



const express = require("express");
const app = express();
const mongoose = require("mongoose");


const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalPassportStratergy = require("passport-local");
const User = require("./models/user.js");

// ---------------- SESSION CONFIG ----------------


const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

// ---------------- MIDDLEWARE ----------------
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

// view engine
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",ejsMate);
app.set("layout","layouts/boilerplate");

// ✅ IMPORTANT ORDER
app.use(session(sessionOptions));   // 1. session
app.use(flash());                  // 2. flash
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalPassportStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 3. locals middleware
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user;
    next();
});

// 4. routes
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);

// ---------------- DATABASE ----------------
main().then(()=>{
    console.log("Connected to DATABASE");
}).catch((err)=>{
    console.log("Error : ",err);
});

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}

// ---------------- ROUTES ----------------


app.get("/demoUser",async(req,res)=>{
    let fakeUser = new User({
        email: "kadamtushar457@gmail.com",
        username:"Tushar",
    });
    let registeredUser = await User.register(fakeUser,"helloworld")
    res.send(registeredUser);
})

// ---------------- ERROR HANDLING ----------------
app.use((req, res, next) => {
    next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 500,message="Something went wrong"} = err;
    res.status(statusCode).render("listings/error.ejs",{message});
});

// ---------------- SERVER ----------------
app.listen(8080,()=>{
    console.log("Listening at Port 8080");
});