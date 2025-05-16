const Listing = require("../models/listing");
const Review = require("../models/reviews")


module.exports.createReview = async (req, res) => {  
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review);  
    newReview.auther = req.user._id;
    console.log(newReview);
    
    listing.reviews.push(newReview);

    await newReview.save();  
    await listing.save();
    req.flash("success","New Review Added");
    res.redirect(`/listings/${listing._id}`);
   
   
  }


  module.exports.deleteReview =async (req, res) => {
    console.log("Delete Route hit");
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("deleted","Review Deleted");
    res.redirect(`/listings/${id}`);
  }