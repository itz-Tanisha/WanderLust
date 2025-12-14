const express = require("express");
const router = express.Router();
const path = require("path");

const Listing = require(path.join("../models/listing.js"));
const { ListingToasts } = require(path.join("../config/toastMsgs.js"))
const { isLoggedIn } = require("../middleware.js")

// Image Upload 
const multer = require("multer"); // This is a function 
const upload = multer({ storage: multer.memoryStorage() });
const { uploadToCloudinary } = require("../cloudinary.js");

// Custom Error and Validation
const CustomExpressError = require("../utils/ExpressError.js");
const { listingSchemaValidator } = require("../utils/Schema.js");


// SCHEMA VALIDATION MIDDLEWARE 

const validateBody = (req, res, next) => {

    if (!req.body) throw new CustomExpressError(400, `Please send required fields `)

    const { error } = listingSchemaValidator.validate(req.body);

    if (error) {
        throw new CustomExpressError(400, error.message)
    }

    next();
}


// ROUTES 


//  I : GET ALL LISTINGS 

router.get("/", async (req, res) => {

    const listings = await Listing.find({});

    res.render("listings/HomePage.ejs", { listings: listings.reverse() });

})


// II : CREATE ROUTE 

router.get("/new", isLoggedIn, (req, res) => { // express matches /new as /:id ie anything after listing match that

    res.render("listings/NewListing.ejs");

})


router.post("/", isLoggedIn, upload.single("imageFile"), validateBody, async (req, res) => {

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
        }
    });

    req.flash("success", ListingToasts.created);
    res.redirect("listings");

})

// SHOW ROUTE 

router.get("/:id", async (req, res) => {

    let { id } = req.params;

    const data = await Listing.findById(id).populate("reviews");

    if (!data) {
        req.flash("error", ListingToasts.listingNotFound)
        res.redirect("/listings");
        return;
        // throw new CustomExpressError(404, "No Such Listing Exists")
    }

    res.render("listings/ListingInfo.ejs", data.toObject()); // Its a document not object
})



// III : UPDATE ROUTE 

router.get("/:id/edit", isLoggedIn, async (req, res) => {

    const { id } = req.params;

    const listingData = await Listing.findById(id);

    if (!listingData) {
        req.flash("error", ListingToasts.listingNotFound);
        res.redirect("/listings");
        return;
        // throw new CustomExpressError(404, "No Such Listing Exists")
    }

    res.render("listings/UpdateListing.ejs", listingData.toObject())
})



router.put("/:id/edit", isLoggedIn, upload.single("imageFile"), validateBody, async (req, res) => {

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

})



// IV : DELETE ROUTE 

router.delete("/:id", isLoggedIn, async (req, res) => {

    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    req.flash("success", ListingToasts.deleted);

    res.redirect("/listings")

})


module.exports = router;