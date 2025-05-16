const Listing = require("../models/listing");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings })
}

module.exports.renderNewForm = (req, res) => {
    console.log(req.user);
    res.render("listings/new");
}

module.exports.createListing = async (req, res, next) => {
    // console.log("Received Data:", req.body);  // Debugging
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, "..", filename);

    const { title, description, price, location, country, image } = req.body.listings; // Data extract 


    const newListing = new Listing({
        title,
        description,
        price,
        location,
        country,
        image: {
            filename: "listingimage",
            url: url || "default.jpg"  // Agar image nahi diya toh default de do
        }
    });


    newListing.owner = req.user._id;
    newListing.image = { url, filename }
    await newListing.save();
    req.flash("success", "New Listings Created");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {


    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "auther",
            },
        }).populate("owner");
    if (!listing) {
        req.flash("error", "Your Listings Already Deleted")
        res.redirect("/listings")
    }
    // console.log(listing);

    res.render("listings/show", { listing })
}





module.exports.editListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Your Listings Already Deleted")
        res.redirect("/listings")
    }

    let orignalImage = listing.image.url;   
    let orignalImageUrl = orignalImage.replace("/upload","/upload/w_250")
    req.flash("success", "Listings Edited");
    res.render("listings/edit", { listing ,orignalImageUrl});
}

module.exports.updateListing = async (req, res) => {
    // console.log(req.body);

    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listings }); // fix here
    if(typeof req.file !== "undefined"){

        let url = req.file.path;
        let filename = req.file.filename;
        
        listing.image = { url, filename }
        await listing.save();
    }
    req.flash("success", "Listings Updated");
    res.redirect(`/listings/${id}`); // fix here
}


module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListings = await Listing.findByIdAndDelete(id);


    req.flash("deleted", "Listings Deleted");

    res.redirect("/listings")
}