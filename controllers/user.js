const path = require("path");
const User = require(path.join("../models/user.js"));
const { UserToasts } = require(path.join("../config/toastMsgs.js"));


module.exports.getSignUpForm = (req, res) => {

    if (!req.session.redirectUrl) req.session.redirectUrl = req.get("Referer");

    res.render("users/signup.ejs", { hideNavbarMenu: true });

}


module.exports.signUp = async (req, res) => {

    try {

        let { username, email, password } = req.body;

        const response = await User.register({ username, email }, password);

        req.logIn(response, (err) => {

            if (err) {
                return next(err);
            }

            req.flash("success", UserToasts.registered);

            const redirectUrl = res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);

        })

    }
    catch (err) {
        req.flash("error", err.message);
        console.log(err)
        res.redirect("/signup");
    }

}


module.exports.getLoginForm = (req, res) => {

    if (!req.session.redirectUrl) req.session.redirectUrl = req.get("Referer");

    res.render("users/login.ejs", { hideNavbarMenu: true });
}


module.exports.login = (req, res) => {

    req.flash("success", UserToasts.loggedIn);
    const redirectUrl = res.locals.redirectUrl || "/listings";
    delete res.locals.redirectUrl; // automatically delete as it persists only for one req res cycle 

    res.redirect(redirectUrl);
}


module.exports.logout = (req, res) => {

    req.logOut((err) => {

        if (err) {
            next(err);
            return;
        }

        req.flash("success", UserToasts.loggedOut);
        res.redirect("/listings");

    })
}

