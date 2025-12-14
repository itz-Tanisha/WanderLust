const { ErrorToasts } = require("./config/toastMsgs");

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        req.flash("error", ErrorToasts.notLoggedIn);

        // If you want the prev url from which req was made 
        // const redirectUrl = req.get("Referer");
        // console.log(redirectUrl);
        // res.redirect(redirectUrl);

        res.redirect("/login")
        return;
    }

    next();
}