const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewsSchema} = require("../schema.js"); 
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");






//function as a middleware
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        let errorMsg = error.details.map((el)=>el.message).join(",");
        console.log(errorMsg);
        throw new ExpressError(404,errorMsg);
    }else{
        next();
    }
    
}







//index Route :-  Display all listings in databse 

router.get("/",wrapAsync(async(req,res)=>{   //  /listings

    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});

}));



//new route :- rendering form and taking details of new listing from user

router.get("/new",(req,res)=>{    // /listings/new
    res.render("listings/new.ejs")
});



//show Route :- showing details of individual listing 

router.get("/:id",wrapAsync(async(req,res)=>{     // /listings/:id

    let {id} = req.params;
    console.log(id);
    const listing = await Listing.findById(id).populate("reviews");
    console.log(listing.reviews);
    res.render("listings/show.ejs",{listing});
}));




//create route :- after taking details of listing updations in DB

router.post("/",validateListing,wrapAsync(async(req,res)=>{     // /listings
    
    let newListing = new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    res.redirect("/listings");
}));

//edit route :- rendering form and user can edit details

router.get("/:id/edit",wrapAsync(async(req,res)=>{      // /listings/:id/edit
     
    let {id} = req.params;
    let listing = await Listing.findById(id);


    res.render("listings/edit.ejs",{listing});
}));

//Edit---------Update route:- actual updations in DB after editing
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{        // /listings/:id
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete route: deleting individual listing
router.delete("/:id/delete",wrapAsync(async(req,res)=>{   // /listings/:id/delete
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));


module.exports = router;