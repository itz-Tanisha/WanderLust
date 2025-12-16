const ListingToasts = {

    // created: "Your listing just went live !",
    // updated: "Your listing got a glow-up !",
    // deleted: "Listing successfully destroyed !",
    listingNotFound: "The Listing you requested does not exist !",

    created: "New Listing Created !",
    updated: "Listing updated successfully.",
    deleted: "Listing deleted successfully.",
    // listingNotFound : "No Such Listing Exists",
    notOwnerToast : "You don't have enough permissions to modify this listing !",

}

const ReviewToast = {
    added: "Review dropped! Thanks for the wisdom.",
    deleted: "“Review removed… like it never happened.",
    notFound : "Review not found",
    notAuthorToast : "You don't have enough permissions to delete this review !",
}

const UserToasts = {
    registered : "User registered successfully !",
    loggedIn : "Welcome to Wanderlust ! You are logged in !",
    loggedOut : "You're logged out successfully !",
    notLoggedIn : "You must be logged in to create a new listing !"
}

const ErrorToasts = {
    invalidFileType : "Invalid file type. Please upload JPG, JPEG or PNG images only.",
}

module.exports = {
    ListingToasts, 
    ReviewToast,
    UserToasts,
    ErrorToasts
}