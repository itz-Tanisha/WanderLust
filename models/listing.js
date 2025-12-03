const mongoose = require("mongoose");

const ListingSchema = new mongoose.Schema({

    title : {
        type : String, 
        required : true,
        trim : true,
    },

    description : {
        required : true,
        type : String, 
    },

    image : {
        url : String,
        fileName : String
    },

    price : {
        type : Number, 
        required: true,
        min : 0
    },

    propertyInfo : {    // pdf url 
        type : String
    },

    location : {
        type : String, 
        required: true,
    },

    country : {
        type : String, 
        required: true,
    },

    createdAt : {
        type : Date,
        default : Date.now(),
    }
})

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;

