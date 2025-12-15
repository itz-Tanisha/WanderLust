const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({

    comment: {
        type: String,
    },

    rating: {
        type: Number,
        min: 1,
        max: 5
    },

    author : {
        ref: 'User',
        type : mongoose.Schema.Types.ObjectId,
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }

})


reviewSchema.post("findOneAndDelete", async (data) => {

    if (data._id) {

        const Listing = mongoose.model("Listing");

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