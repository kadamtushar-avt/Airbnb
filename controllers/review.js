const Listing = require("../models/listing")
const Review = require("../models/reviews")


module.exports.createReview = async(req,res)=>{              // /listings/:id/reviews common part in all
    let listing = await Listing.findById(req.params.id);
    let {review} = req.body;
    console.log(review);

    let newReview = new Review(review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","Review Added Successfully !")

    res.redirect(`/listings/${listing._id}`);
};


module.exports.destroyReview = async(req,res)=>{    //   /listings/:id/reviews/:reviewId
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully !")

    res.redirect(`/listings/${id}`);
}