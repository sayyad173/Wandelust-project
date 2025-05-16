const express = require("express");
const route = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuther} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")

//Review Route ----> Post Route
route.post("/",isLoggedIn, validateReview,wrapAsync(reviewController.createReview));
  
  //Review Delete oute
  route.delete("/:reviewId",isLoggedIn,isReviewAuther, wrapAsync(reviewController.deleteReview));

  module.exports=route;