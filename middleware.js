const { UserToasts, ListingToasts } = require("./config/toastMsgs");
const Listing = require('./models/listing')

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