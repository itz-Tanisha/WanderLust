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
    },

    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ],

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
})

ListingSchema.post("findOneAndDelete", async (data) => {

    if(data){
        
        const allReviewsId = data.reviews || [];

        const Review = mongoose.model("Review");

        const result = await Review.deleteMany({ _id : { $in  : allReviewsId }});

        console.log(result);
    }
})

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;

