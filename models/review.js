const mongoose = require("mongoose");
const Listing = require("./listing")

const reviewSchema = mongoose.Schema({

    comment: {
        type: String,
    },

    rating: {
        type: Number,
        min: 1,
        max: 5
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }

})


reviewSchema.post("findOneAndDelete", async (data) => {

    if (data._id) {

        const res = await Listing.findOneAndUpdate(
            { reviews: { $in: data._id } },
            { $pull: { reviews: data._id } },
            { new: true }
        )

        console.log(res)

    }

})

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;