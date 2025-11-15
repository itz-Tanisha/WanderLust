const express = require("express");
const mongoose = require("mongoose");

const path = require("path");
const method_override = require("method-override");

require("dotenv").config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

const Listing = require(path.join(__dirname, "/models/listing.js"))

// A : Express Setup 

const app = express();


app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(method_override("_method"));
app.use(express.urlencoded({ extended : true }));


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
})


// D : Initialising collection 

const Listing1 = new Listing({
    title : "Test Listing",
    description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    price : "1000",
    propertyInfo  : "",
    location : "Meghalaya",
    country : "India"
})

Listing1.save()
    .then((res) => console.log(res))
    .catch((err) => console.log(err))