const mongoose = require("mongoose");
const {Schema} = mongoose;
const Review = require("./reviews");
const User = require("./user");
const { ref } = require("joi");

let listingSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: String,

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://plus.unsplash.com/premium_photo-1669018131105-111fdd827dbd?w=600&auto=format&fit=crop&q=60",
    },
  },

  price:{
    type: Number,
    required:true
  },
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  }
});

//Middleware triggered when findbyidanddelete is called 
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id : { $in : listing.reviews}}); //if reviews id is present in listing.reviews(array) then delete it
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;