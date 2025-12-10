const express = require("express");
const router = express.Router({ mergeParams : true });
const path = require("path");

const Review = require(path.join("../models/review.js"))
const Listing = require(path.join("../models/listing.js"));
const { ReviewToast } = require(path.join("../config/toastMsgs.js"))

// Custom Error and Body Validation
const CustomExpressError = require("../utils/ExpressError.js");
const { reviewSchemaValidator } = require("../utils/Schema.js");


// SCHEMA VALIDATION MIDDLEWARE 

const validateReviews = (req, res, next) => {

    if (!req.body) throw new CustomExpressError(400, `Please send required fields `)

    const { error } = reviewSchemaValidator.validate(req.body);

    if (error) {

        throw new CustomExpressError(400, error.message)
    }

    next();
}

// ROUTES 

// V : Listings - Post New Review 
router.post("/", validateReviews, async (req, res) => {

    const { id } = req.params;

    const { comment, rating } = req.body;

    const newReview = await Review.insertOne({ comment, rating });

    const updatedListing = await Listing.findByIdAndUpdate(id, { $push: { reviews: newReview } }, { new: true, runValidators: true });

    req.flash("success", ReviewToast.added);
    res.redirect(`/listings/${id}`)

})


// VI : Delete Reviews Route 

router.delete("/:reviewId", async (req, res) => {

    const { id, reviewId } = req.params;

    const result = await Review.findByIdAndDelete(reviewId);

    req.flash("success", ReviewToast.deleted);
    res.redirect(`/listings/${id}`)

})


module.exports = router;