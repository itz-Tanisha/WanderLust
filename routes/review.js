const express = require("express");
const router = express.Router({ mergeParams : true });

const { validateReviews, isLoggedIn, isReviewOwner } = require("../middleware");
const ReviewController = require("../controllers/review");


// ROUTES 

// V : Listings - Post New Review 
router.post("/", isLoggedIn, validateReviews, ReviewController.postReview)


// VI : Delete Reviews Route 

router.delete("/:reviewId", isLoggedIn, isReviewOwner, ReviewController.destroyReview)


module.exports = router;