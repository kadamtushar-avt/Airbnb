const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const initDb = require("./data.js");

main().then((res)=>{
    console.log("Connected to DATABASE");
})
.catch((err)=>{
    
    console.log("Error : ",err);
})


async function main(params) {
    await mongoose.connect(MONGO_URL);
}

const initDatabase = async()=>{
    await Listing.deleteMany({});
    initDb.data = initDb.data.map((obj)=>({...obj,owner:"69c7a841b29ecf48493a5016"}))
    await Listing.insertMany(initDb.data);
    console.log("Database is initialised with data");  
}

initDatabase();