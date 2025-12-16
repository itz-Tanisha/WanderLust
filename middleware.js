const { UserToasts, ListingToasts, ReviewToast } = require("./config/toastMsgs");
const Listing = require('./models/listing');
const Review = require('./models/review');
const CustomExpressError = require("./utils/ExpressError");
const { listingSchemaValidator, reviewSchemaValidator, SignInLoginFormValidator } = require("./utils/Schema");
const { v2 : cloudinary } = require("cloudinary");

// SCHEMA VALIDATION MIDDLEWARE 

module.exports.validateListing = (req, res, next) => {

    if (!req.body) throw new CustomExpressError(400, `Please send required fields `)

    const { error } = listingSchemaValidator.validate(req.body);

    if (error) {
        throw new CustomExpressError(400, error.message)
    }

    next();
}

// SCHEMA VALIDATION MIDDLEWARE 

module.exports.validateReviews = (req, res, next) => {

    if (!req.body) throw new CustomExpressError(400, `Please send required fields `)

    const { error } = reviewSchemaValidator.validate(req.body);

    if (error) {

        throw new CustomExpressError(400, error.message)
    }

    next();
}

module.exports.validateSignUpLoginForm = (req, res, next) => {

    if (!req.body) throw new CustomExpressError(404, "Please send required fields");

    const { error } = SignInLoginFormValidator.validate(req.body);

    if (error) {
        throw new CustomExpressError(400, error.message)
    }

    next();
}


// check if user is logged in to access protected routes 
module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.flash("error", UserToasts.notLoggedIn);
        req.session.redirectUrl = req.originalUrl;

        // If you want the prev url from which req was made 
        // const redirectUrl = req.get("Referer");
        // console.log(redirectUrl);
        // res.redirect(redirectUrl);

        res.redirect("/login")
        return;
    }

    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {

    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
}

// check if user is owner to edit and delete 
module.exports.isListingOwner = async (req, res, next) => {

    const { id } = req.params;
    const data = await Listing.findById(id);  // 1: Listing does not exist 

    if (!data) {
        req.flash("error", ListingToasts.listingNotFound)
        res.redirect("/listings");
        return;
    }


    if (!data.owner.equals(req.user._id)) {

        req.flash("error", ListingToasts.notOwnerToast);
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.isReviewOwner = async (req, res, next) => {

    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", ReviewToast.notFound);
        res.redirect(`/listings/${id}`);

        return;
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", ReviewToast.notAuthorToast);
        res.redirect(`/listings/${id}`);
        return;
    }

    next();

}

module.exports.deleteOldImage = async (req, res, next) => {

    if (req.file) {

        const { id } = req.params;
        const existingListing = await Listing.findById(id);

        if(existingListing.image.fileName){
            const result = await cloudinary.uploader.destroy(existingListing.image.fileName);
            console.log(result);
        }
    }

    next();

}