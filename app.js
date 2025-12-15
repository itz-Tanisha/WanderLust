const express = require("express");
const mongoose = require("mongoose");

const path = require("path");
const method_override = require("method-override");

const ejsMate = require("ejs-mate");
const CustomExpressError = require("./utils/ExpressError.js");

require("dotenv").config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

const listingsRoutes = require("./routes/listing.js")
const reviewsRoutes = require("./routes/review.js")
const userRoutes = require("./routes/user.js")

const session = require("express-session");
const flash = require("connect-flash")

const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");

// A : Express Setup 

const app = express();


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(method_override("_method"));
app.use(express.urlencoded({ extended: true }));

app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Session and Flash setup

const SessionOptions = {
    secret : process.env.EXPRESS_SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true, // To prevent cross scripting attacks
    }
}

app.use(session(SessionOptions));

app.use(flash()); // middlewares always must be written before routes

// Passport setup 

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    
    next();
})


// B : Mongoose Connection 

async function connectToDB() {
    await mongoose.connect(MONGO_URL)
}

connectToDB()
    .then((res) => console.log("Connection successful"))
    .catch((err) => console.log(err))


// C : Index Route 

app.get("/", (req, res) => {
    res.send("Working")
    // res.redirect("/listings")
})

// ROUTES 

app.use("/listings", listingsRoutes);

app.use("/listings/:id/reviews", reviewsRoutes);

app.use("/", userRoutes );


// V : PAGE NOT FOUND AS ERROR AND NOT MIDDLEWARE

// app.all("/*any", (req, res) => {
    
//     throw new CustomExpressError(404, "Page NOT Found !");

// })



// SINCE newer forwards async errors to err middleware we ll just define our middleware 
app.use((err, req, res, next) => {

    if(err.status === 404){
        res.status(404).render("NotFound.ejs");
    }

    const { status = 500, message = "Internal Server Error"} = err;

    // res.status(status).json({
    //     success: false,
    //     error: err.message
    // })

    res.status(status).render("Error.ejs", { message })
})


app.use((req, res) => {

    res.status(404).render("NotFound.ejs");

})  