const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");

const {listingSchema, reviewsSchema} = require("./schema.js"); 
const ExpressError = require("./utils/ExpressError.js");





module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to perform Operations !")
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(res.locals.currentUser && !listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the Owner of Listing !")
        return res.redirect(`/listings/${id}`);
    }
    next();
}    

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",");
        console.log(errorMsg);
        throw new ExpressError(404,errorMsg);
    }else{
        next();
    }
    
}


module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewsSchema.validate(req.body);
    console.log(error);
    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errorMsg);
    }else{
        next();
    }
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(res.locals.currentUser && !listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the Owner of Listing !")
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isreviewAuthor = async(req,res,next)=>{
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);

    if(res.locals.currentUser && !review.author._id.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the Author of Review !")
        return res.redirect(`/listings/${id}`);
    }
    next();
}    