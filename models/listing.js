const mongoose = require("mongoose");
const Review = require("./review")

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
    ]
})

ListingSchema.post("findOneAndDelete", (data) => {

    if(data){
        const allReviewsId = data.reviews;

        Review.deleteMany({ _id : { $in  : allReviewsId }})
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
    }
})

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;

