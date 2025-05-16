const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validationListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer  = require('multer')
const {storage,}=require("../cloudConfig.js")
const upload = multer({ storage })

// Show all listings
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listings[image]'), wrapAsync(listingController.createListing));
    

    router.get("/new", isLoggedIn, listingController.renderNewForm)

    router.route("/:id")
    .get( wrapAsync(listingController.showListing))// Show a single listing
    .put( isLoggedIn, isOwner,upload.single('listings[image][url]'), validationListing, wrapAsync(listingController.updateListing))// Update listing
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))// Delete listing


// Edit listing form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));




module.exports = router;