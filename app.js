const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewsSchema} = require("./schema.js"); 
const Review = require("./models/reviews.js");

const listings = require("./routes/listing.js"); //router object for /listings
const reviews = require("./routes/reviews.js"); //router object for /reviews
const session = require("express-session");

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}




app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
app.set("layout","layouts/boilerplate");
app.use("/listings",listings); //(/listings) router middleware
app.use("/listings/:id/reviews",reviews);
app.use(session(sessionOptions));





main().then((res)=>{
    console.log("Connected to DATABASE");
})
.catch((err)=>{
    console.log("Error : ",err);
})


async function main(params) {
    await mongoose.connect(MONGO_URL);
}

app.listen(8080,()=>{
    console.log("Listening at Port 8080");
});

app.get("/",(req,res)=>{
    res.send("Welcome");
});

app.get("/testListings",async(req,res)=>{
    
    let data1 = new Listing({
        title:"Tushar",
        discription:"Ms dhonii",
        price:1250,
        location:"Ahmednagar",
        country:"India"
    });

    await data1.save();
    console.log("Sample saved");
});

//for all routes
app.use((req, res, next) => {
    // next(new ExpressError(404, "Page not found"));
    next(new ExpressError(400,"Page not found"));
});


//Error handling middleware:- 

app.use((err,req,res,next)=>{
    let {statusCode = 500,message="Something went wrong"} = err;
    
    res.status(statusCode).render("listings/error.ejs",{message})
});

//console.log(err.name);
    // res.status(statusCode).send(message);