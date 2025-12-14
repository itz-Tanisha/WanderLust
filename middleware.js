const { UserToasts } = require("./config/toastMsgs");

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

module.exports.saveRedirectUrl = ( req, res, next ) => {

    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
}