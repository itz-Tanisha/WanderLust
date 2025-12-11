const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email address"
        ]

    },

    // username: {
    //     type: String,
    //     required: [true, "Username is required !"],
    //     trim: true,
    //     unique: true,
    //     minlength: [3, "Username must be at least 3 characters"],
    //     maxlength: [30, "Username cannot exceed 30 characters"],
    // },

    // password: {
    //     type: String,
    //     required: true,
    //     minlength : [ 8, "Password must be atleast 8 characters !"]
    // },

   
})

UserSchema.plugin(passportLocalMongoose);

// Passport local mongose will create a username, password field and generate salted and hashed password to store in database and other methods

const User = mongoose.model("User", UserSchema);

module.exports = User;
