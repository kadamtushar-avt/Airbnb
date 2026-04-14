const Listing = require("../models/listing")



const getCoordinates = async(location)=> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;

    const response = await fetch(url, {
        headers: {
            "User-Agent": "airbnb-project"   // VERY IMPORTANT
        }
    });

    const data = await response.json();

    if (!data || data.length === 0) {
        throw new Error("Invalid location");
    }

    return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon)
    };
}







module.exports.index = async(req,res)=>{   //  /listings

    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});

};


module.exports.renderNewForm = (req,res)=>{    // /listings/new
    res.render("listings/new.ejs")
};

module.exports.showListing = async(req,res)=>{     // /listings/:id

    let {id} = req.params;
    console.log(id);
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path: "author"
        }
    }).populate("owner");
    console.log(listing);
    if(!listing){
        req.flash("error","Listing you requested for does not exists")
        return res.redirect("/listings")
    }
    console.log(listing.reviews);
    res.render("listings/show.ejs",{listing});
};


module.exports.createListing = async(req,res)=>{     // /listings
    console.log("Inside Create Listing")
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.image = {url,filename};
    
    newListing.owner = req.user._id;

    try {
        const coords = await getCoordinates(req.body.listing.location);

        newListing.lat = coords.lat;
        newListing.lng = coords.lng;

    } catch (err) {
        console.log(err);
        req.flash("error", "Invalid location");
        return res.redirect("/listings/new");
    }
    console.log(newListing);
    await newListing.save();
    req.flash("success","Successfully Listing Created !")
    res.redirect("/listings");
};




module.exports.renderEditForm = async(req,res)=>{      // /listings/:id/edit
     
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exists")
        return res.redirect("/listings")
    }
    
    let orignalImageUrl = listing.image.url;
    orignalImageUrl = orignalImageUrl.replace(
    "/upload",
    "/upload/w_250,h_250"
    );
    console.log(orignalImageUrl)


    res.render("listings/edit.ejs",{listing,orignalImageUrl});
};


module.exports.updateListing = async(req,res)=>{        // /listings/:id
    console.log("Inside update")
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success","Listing Updated !")
    
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async(req,res)=>{   // /listings/:id/delete
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully !")
    console.log(deletedListing);
    res.redirect("/listings");
};