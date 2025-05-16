const mongoose= require ("mongoose");
const initData = require("./data.js");
 const Listing = require ("../models/listing.js");


 const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; // Mongo DB connection URL 
 main().then((res) => {  // call  main function
     console.log("Connection Successful");
 }).catch((err) => {
     console.log(err);
 })
 async function main() { // function for MONGO URL
     await mongoose.connect(MONGO_URL)
 }

 const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6810f78c3ac5235ba5d994fa"}));
    await Listing.insertMany(initData.data);
    console.log("Data Was Initilaization");
    
 };

 initDB();