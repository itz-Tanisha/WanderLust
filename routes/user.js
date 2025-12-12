const express = require("express");
const { register } = require("module");
const router = express.Router();
const path = require("path");

const User = require(path.join("../models/user.js"));
const { UserToasts } = require(path.join("../config/toastMsgs.js"))

// Custom error 
const CustomExpressError = require("../utils/ExpressError.js");
const { SignInLoginFormValidator } = require("../utils/Schema.js");

const validateSignUpForm = ( req, res, next ) => {

    if(!req.body) throw new CustomExpressError(404, "Please send required fields");

    const { error } = SignInLoginFormValidator.validate(req.body);

    if(error){
        throw new CustomExpressError(400, error.message)
    }

    next();
}

// ROUTES 

router.get("/signup", (req, res) => {

    res.render("users/signup.ejs");

})

router.post("/signup", validateSignUpForm, async (req, res) => {

    try {

        let { username, email, password } = req.body;

        const response = await User.register({username, email}, password);

        req.flash("success", UserToasts.registered);

        res.redirect("/listings");

    }
    catch(err){
        req.flash("error", err.message);
        console.log(err)
        res.redirect("/signup");
    }

})




module.exports = router;