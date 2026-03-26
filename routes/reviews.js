const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewsSchema} = require("../schema.js");









const validateReview = (req,res,next)=>{
    let {error} = reviewsSchema.validate(req.body);
    console.log(error);
    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(404,errorMsg);
    }else{
        next()
    }
}







//POST ROUTE:  Review Route
router.post("/",validateReview,wrapAsync(async(req,res)=>{              // /listings/:id/reviews common part in all
    let listing = await Listing.findById(req.params.id);
    let {review} = req.body;
    console.log(review);

    let newReview = new Review(review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//DELETE ROUTE : REVIEW

router.delete("/:reviewId",wrapAsync(async(req,res)=>{    //   /listings/:id/reviews/:reviewId
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));


module.exports = router;