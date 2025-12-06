const express = require("express");
const mongoose = require("mongoose");

const path = require("path");
const method_override = require("method-override");

const ejsMate = require("ejs-mate");

require("dotenv").config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

const Listing = require(path.join(__dirname, "/models/listing.js"));
const Review = require(path.join(__dirname, "/models/review.js"))

const multer = require("multer"); // This is a function 

const upload = multer({ storage : multer.memoryStorage()});

const { uploadToCloudinary } = require("./cloudinary.js");

const CustomExpressError = require("./utils/ExpressError.js");

const { listingSchemaValidator, reviewSchemaValidator } = require("./utils/Schema.js");

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
    // res.send("Working")
    res.redirect("/listings")
})


// D : Initialising collection 

const Listing1 = new Listing({
    title: "Test Listing",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price: "1000",
    propertyInfo: "",
    location: "Meghalaya",
    country: "India"
})

// Listing1.save()
//     .then((res) => console.log(res))
//     .catch((err) => console.log(err))


// SCHEMA VALIDATION MIDDLEWARE 

const validateBody = (req, res, next) => {

    if(!req.body)  throw new CustomExpressError(400, `Please send required fields `)

    const { error } = listingSchemaValidator.validate(req.body);

    if(error){
        throw new CustomExpressError(400, error.message)
    }

    next();
}

const validateReviews = (req, res, next ) => {

    if(!req.body)  throw new CustomExpressError(400, `Please send required fields `)
     
    const { error } = reviewSchemaValidator.validate(req.body);

    if(error){

        throw new CustomExpressError(400, error.message)
    }

    next();
}
// ROUTES 


//  I : GET ALL LISTINGS 

app.get("/listings", async (req, res) => {

    const listings = await Listing.find({});

    res.render("listings/HomePage.ejs", { listings: listings.reverse() });

})


// II : CREATE ROUTE 

app.get("/listings/new", (req, res) => { // express matches /new as /:id ie anything after listing match that

    res.render("listings/NewListing.ejs");

})


app.post("/listings",  upload.single("imageFile"), validateBody, async (req, res) => {

    const { title, description, price, location, country, imageUrl } = req.body;

    let finalImageUrl = imageUrl;

    // If user uploads file upload it to cloudinary 

    if (req.file) {
        // const result = await uploadToCloudinary(req.file.buffer);
        // finalImageUrl = result.secure_url;
        finalImageUrl = "https://res.cloudinary.com/dymt5cvoc/image/upload/v1763280098/wanderlust/s1wziutvubnquwgp0qus.jpg"
    }


    const newListing = await Listing.insertOne({
        title, description, price, location, country,
        image: {
            url: finalImageUrl
        }
    });

    res.redirect("listings");

})

// SHOW ROUTE 

app.get("/listings/:id", async (req, res) => {

    let { id } = req.params;

    const data = await Listing.findById(id);

    res.render("listings/ListingInfo.ejs", data.toObject()); // Its a document not object
})



// III : UPDATE ROUTE 

app.get("/listings/:id/edit", async (req, res) => {

    const { id } = req.params;

    const listingData = await Listing.findById(id);

    res.render("listings/UpdateListing.ejs", listingData.toObject())
})



app.put("/listings/:id/edit", upload.single("imageFile"), validateBody, async (req, res) => {

    const { id } = req.params;
    const data = req.body;


    if (data?.imageUrl.trim()) {

        data.image = {
            url: data.imageUrl
        }

    }
    else if (req.file) {
        // const result = await uploadToCloudinary(req.file.buffer);
        // data.image = {
        //     url : result.secure_url;
        // }
    }

    delete data.imageUrl;


    const updatedListing = await Listing.findByIdAndUpdate(id, data, { runValidators: true, new: true });

    res.redirect(`/listings/${id}`);

})



// IV : DELETE ROUTE 

app.delete("/listings/:id", async (req, res) => {

    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    res.redirect("/listings")

})

// V : Listings - Post New Review 
app.post("/listings/:id/reviews", validateReviews, async (req, res) => {

    const { id } = req.params;

    const { comment, rating } = req.body;

    const newReview = await Review.insertOne({ comment, rating });

    const updatedListing = await Listing.findByIdAndUpdate(id, { $push : {reviews : newReview }}, { new : true, runValidators : true});

    res.redirect(`/listings/${id}`)

})


// V : PAGE NOT FOUND AS ERROR AND NOT MIDDLEWARE

// app.all("/*any", (req, res) => {
    
//     throw new CustomExpressError(404, "Page NOT Found !");

// })



// SINCE newer forwards async errors to err middleware we ll just define our middleware 
app.use((err, req, res, next) => {

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