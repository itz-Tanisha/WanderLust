const path = require("path");
const Review = require(path.join("../models/review.js"))
const Listing = require(path.join("../models/listing.js"));
const { ReviewToast } = require(path.join("../config/toastMsgs.js"))

module.exports.postReview = async (req, res) => {

    const { id } = req.params;

    const { comment, rating } = req.body;

    const newReview = await Review.insertOne({ comment, rating, author: req.user._id });

    const updatedListing = await Listing.findByIdAndUpdate(id, { $push: { reviews: newReview } }, { new: true, runValidators: true });

    req.flash("success", ReviewToast.added);
    res.redirect(`/listings/${id}`)

}


module.exports.destroyReview = async (req, res) => {

    const { id, reviewId } = req.params;

    const result = await Review.findByIdAndDelete(reviewId);

    req.flash("success", ReviewToast.deleted);
    res.redirect(`/listings/${id}`)

}