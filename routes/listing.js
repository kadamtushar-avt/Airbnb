const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewsSchema} = require("../schema.js"); 
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, validateListing, isOwner} = require("../middleware.js")
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
// const upload = multer({ storage });



//index Route :-  Display all listings in databse 
//create route :- after taking details of listing updations in DB
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,upload.single("listing[image]"),wrapAsync(listingController.createListing));


//new route :- rendering form and taking details of new listing from user

router.get("/new",isLoggedIn,listingController.renderNewForm);


//show Route :- showing details of individual listing 
//Edit---------Update route:- actual updations in DB after editing

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

//edit route :- rendering form and user can edit details

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));




//Delete route: deleting individual listing
router.delete("/:id/delete",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


module.exports = router;