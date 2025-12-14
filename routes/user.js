const express = require("express");
const { register } = require("module");
const router = express.Router();
const path = require("path");
const passport = require("passport");

const User = require(path.join("../models/user.js"));
const { UserToasts } = require(path.join("../config/toastMsgs.js"))

// Custom error 
const CustomExpressError = require("../utils/ExpressError.js");
const { SignInLoginFormValidator } = require("../utils/Schema.js");

const validateSignUpForm = (req, res, next) => {

    if (!req.body) throw new CustomExpressError(404, "Please send required fields");

    const { error } = SignInLoginFormValidator.validate(req.body);

    if (error) {
        throw new CustomExpressError(400, error.message)
    }

    next();
}

// ROUTES 


// I : SIGNUP
router.get("/signup", (req, res) => {

    res.render("users/signup.ejs", { hideNavbarMenu: true });

})

router.post("/signup", validateSignUpForm, async (req, res) => {

    try {

        let { username, email, password } = req.body;

        const response = await User.register({ username, email }, password);

        req.logIn(response, (err) => {
            
            if(err){
                return next(err);
            }

            req.flash("success", UserToasts.registered);

            res.redirect("/listings");

        })

    }
    catch (err) {
        req.flash("error", err.message);
        console.log(err)
        res.redirect("/signup");
    }

})


// II : LOGIN
router.get("/login", (req, res) => {

    res.render("users/login.ejs", { hideNavbarMenu: true });
})

router.post("/login",
    validateSignUpForm,
    passport.authenticate(
        "local",
        { failureRedirect: "/login", failureFlash: true }
    ),
    (req, res) => {

        req.flash("success", UserToasts.loggedIn);
        res.redirect("/listings");
    }
)

// III : LOGOUT

// removing user data from session storage and its removes session Id as well
router.get('/logout', (req, res) => {

    req.logOut((err) => {
        
        if (err) {
            next(err);
            return;
        }

        req.flash("success", UserToasts.loggedOut);
        res.redirect("/listings");

    })
})

module.exports = router;