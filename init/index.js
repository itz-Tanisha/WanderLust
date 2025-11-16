const mongoose = require("mongoose");

const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const MONGO_URL = process.env.MONGO_URL;

async function connectToDB() {
    await mongoose.connect(MONGO_URL)
}

connectToDB()
    .then((res) => console.log("Connection successful"))
    .catch((err) => console.log(err))


const Listing = require(path.join(__dirname, "../models/listing.js"));

const { data } = require(path.join(__dirname, "./data.js"));

const initDB = async() => {
    await Listing.deleteMany({});
    await Listing.insertMany(data);

    console.log("Initialized DB");
}

initDB();   