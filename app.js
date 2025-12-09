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