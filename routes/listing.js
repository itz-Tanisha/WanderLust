const express = require("express");
const router = express.Router();
const { isLoggedIn, isListingOwner, validateListing } = require("../middleware.js")

// Image Upload 
const multer = require("multer"); // This is a function 

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits : {
        fileSize : 10 * 1024 * 1024, // 10 MB 
    },
    fileFilter : (req, file, cb) => {

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new CustomExpressError(400, "Invalid File Type !"), false);
        }

        cb(null, true);
    }
});

const ListingControllers = require("../controllers/listing.js");
const CustomExpressError = require("../utils/ExpressError.js");

// ROUTES 

//  I : GET ALL LISTINGS 

router.get("/", ListingControllers.getAllListings)


// II : CREATE ROUTE 

// express matches /new as /:id ie anything after listing match that
router.get("/new", isLoggedIn, ListingControllers.createNewListingForm)

router.post("/", isLoggedIn, upload.single("imageFile"), validateListing, ListingControllers.createNewListing )


// SHOW ROUTE 

router.get("/:id", ListingControllers.showListing)


// III : UPDATE ROUTE 

router
    .route("/:id/edit")
    .get(isLoggedIn, isListingOwner, ListingControllers.updateListingForm)
    .put(isLoggedIn, isListingOwner, upload.single("imageFile"), validateListing, ListingControllers.updateListing)


// IV : DELETE ROUTE 

router.delete("/:id", isLoggedIn, isListingOwner, ListingControllers.deleteListing)


module.exports = router;