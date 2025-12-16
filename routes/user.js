const express = require("express");
const router = express.Router();
const passport = require("passport");


const { saveRedirectUrl, validateSignUpLoginForm } = require("../middleware.js");
const UserControllers = require("../controllers/user.js")

// ROUTES 


// I : SIGNUP
router.get("/signup", UserControllers.getSignUpForm)

router.post("/signup", saveRedirectUrl, validateSignUpLoginForm, UserControllers.signUp)


// II : LOGIN
router.get("/login", UserControllers.getLoginForm)

router.post("/login",
    saveRedirectUrl,
    validateSignUpLoginForm,
    passport.authenticate(
        "local",
        { failureRedirect: "/login", failureFlash: true }
    ),
    UserControllers.login
)

// III : LOGOUT

// removing user data from session storage and its removes session Id as well
router.get('/logout', UserControllers.logout)


module.exports = router;