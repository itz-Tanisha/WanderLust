const ListingToasts = {

    // created: "Your listing just went live !",
    // updated: "Your listing got a glow-up !",
    // deleted: "Listing successfully destroyed !",
    listingNotFound: "The Listing you requested does not exist !",

    created: "New Listing Created !",
    updated: "Listing updated successfully.",
    deleted: "Listing deleted successfully.",
    // listingNotFound : "No Such Listing Exists",

}

const ReviewToast = {
    added: "Review dropped! Thanks for the wisdom.",
    deleted: "“Review removed… like it never happened."
}

const UserToasts = {
    registered : "User registered successfully !",
    loggedIn : "Welcome to Wanderlust ! You are logged in !"
}

const ErrorToasts = {
    notLoggedIn : "You must be logged in to create a new listing !"
}

module.exports = {
    ListingToasts, 
    ReviewToast,
    UserToasts,
    ErrorToasts
}