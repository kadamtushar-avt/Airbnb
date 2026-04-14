const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewsSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { validateReview } = require("../middleware.js");
const {isLoggedIn,isreviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/review.js")





//POST ROUTE:  Review Route

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//DELETE ROUTE : REVIEW

router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports = router;