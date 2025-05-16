
const Listing = require("./models/listing")
const Review = require("./models/reviews")
const ExpressError = require("./utils/ExpressError")
const {listingSchema,reviewSchema }= require("./schema.js")



// Middleware Ye middleware dekhega ki user already login hai
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must to be logged to create listings!") // agr login nhi hai to ak alert jayega 
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
     let { id } = req.params;
    let listing= await Listing.findById(id);
        if(!listing.owner.equals(res.locals.currUser._id)){
            req.flash("error","You Are Not Owner Of This Listings!");
           return res.redirect(`/listings/${id}`)
        }
        next();
}

//Validation erro ke liye server side  -- listingSchema---
module.exports.validationListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {    
        next();
    }
}



module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg)
    } else {
      next();
    }
  }


  module.exports.isReviewAuther = async (req,res,next)=>{
    let {id, reviewId } = req.params;
   let review= await Review.findById(reviewId);
       if(!review.auther.equals(res.locals.currUser._id)){
           req.flash("error","You are Not auther this Review!");
          return res.redirect(`/listings/${id}`)
       }
       next();
}