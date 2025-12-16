const Listing = require("../models/listing");
const path = require("path");

const { ListingToasts } = require(path.join("../config/toastMsgs.js"));
const { uploadToCloudinary } = require("../cloudinary.js");


module.exports.getAllListings = async (req, res) => {

    const listings = await Listing.find({});

    res.render("listings/HomePage.ejs", { listings: listings.reverse() });

}


module.exports.createNewListingForm = (req, res) => {

    res.render("listings/NewListing.ejs");

}


module.exports.createNewListing = async (req, res) => {

    const { title, description, price, location, country, imageUrl } = req.body;

    let finalImageUrl = imageUrl;

    // If user uploads file upload it to cloudinary 

    if (req.file) {
        // const result = await uploadToCloudinary(req.file.buffer);
        // finalImageUrl = result.secure_url;
        finalImageUrl = "https://res.cloudinary.com/dymt5cvoc/image/upload/v1763280098/wanderlust/s1wziutvubnquwgp0qus.jpg"
    }


    const newListing = await Listing.insertOne({
        title, description, price, location, country,
        image: {
            url: finalImageUrl
        },
        owner: req.user._id
    });

    req.flash("success", ListingToasts.created);
    res.redirect("listings");

}


module.exports.showListing = async (req, res) => {

    let { id } = req.params;

    const data = await Listing.findById(id).populate("owner").populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    });

    if (!data) {
        req.flash("error", ListingToasts.listingNotFound)
        res.redirect("/listings");
        return;
        // throw new CustomExpressError(404, "No Such Listing Exists")
    }

    res.render("listings/ListingInfo.ejs", data.toObject()); // Its a document not object
}


module.exports.updateListingForm = async (req, res) => {

    const { id } = req.params;

    const listingData = await Listing.findById(id);

    if (!listingData) {
        req.flash("error", ListingToasts.listingNotFound);
        res.redirect("/listings");
        return;
        // throw new CustomExpressError(404, "No Such Listing Exists")
    }

    res.render("listings/UpdateListing.ejs", listingData.toObject())
}


module.exports.updateListing = async (req, res) => {

    const { id } = req.params;
    const data = req.body;


    if (data?.imageUrl.trim()) {

        data.image = {
            url: data.imageUrl
        }

    }
    else if (req.file) {
        // const result = await uploadToCloudinary(req.file.buffer);
        // data.image = {
        //     url : result.secure_url;
        // }
    }

    delete data.imageUrl;


    const updatedListing = await Listing.findByIdAndUpdate(id, data, { runValidators: true, new: true });

    req.flash("success", ListingToasts.updated);
    res.redirect(`/listings/${id}`);

}


module.exports.deleteListing = async (req, res) => {

    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    req.flash("success", ListingToasts.deleted);

    res.redirect("/listings")

}