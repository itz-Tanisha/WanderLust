// New Listing and update listing validation


$(function () {

    $.validator.addMethod("requireImage", function (value, element) {

        const file = $("#imageFile").val().trim();
        return file !== "";

    }, "Please upload a property image.");

    $("#listing-form").validate({
        rules: {
            title: { required: true, minlength: 3 },
            description: { required: true, minlength: 10 },
            price: { required: true, number: true, min: 1 },
            location: { required: true, minlength: 2 },
            country: { required: true, minlength: 2 },
            imageFile: { requireImage: true },
        },
        messages: {
            title: {
                required: "Title is required.",
                minlength: "Title must be at least 3 characters long."
            },
            description: {
                required: "Description is required.",
                minlength: "Description must be at least 10 characters."
            },
            price: {
                required: "Price is required.",
                number: "Enter a valid number.",
                min: "Price must be at least 1."
            },
            location: {
                required: "Please enter the location.",
                minlength: "Location must be at least 2 characters."
            },
            country: {
                required: "Please enter the country.",
                minlength: "Country must be at least 2 characters."
            },
        },

        errorPlacement: function (error, element) {
                error.insertAfter(element);
        }
    });

    $("#imageFile").on("change keyup", function () {
        $("#imageFile").valid();
    });

});

// STARS FUNCTIONALITY JS

const stars = document.querySelectorAll('#starRating i');
const ratingInput = document.getElementById('ratingInput');

let selectedRating = 0;

// fill stars up to given number
function fillStars(rating) {
    stars.forEach(star => {
        const value = parseInt(star.dataset.value);
        if (value <= rating) {
            star.classList.remove('fa-regular');
            star.classList.add('fa-solid');
        } else {
            star.classList.remove('fa-solid');
            star.classList.add('fa-regular');
        }
    });
}

// Hover effect
stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        const hoverValue = parseInt(star.dataset.value);
        fillStars(hoverValue);
    });

    // Reset on mouse leave → back to selected state
    star.addEventListener('mouseleave', () => {
        fillStars(selectedRating);
    });

    // On click → final selected rating
    star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.value);
        ratingInput.value = selectedRating; // set hidden input
        fillStars(selectedRating);
    });
});


// Review form validation 

$(function () {

    $.validator.addMethod("validRating", function (value, element) {
        return parseInt(value) > 0;
    }, "Please select a rating.");

    $("#review-form").validate({
        ignore: [],  // IMPORTANT: Validate hidden fields too
        rules: {
            rating: { validRating: true },
            comment: { required: true, minlength: 5 }
        },

        messages: {
            rating: {
                validRating: "Please select a star rating."
            },
            comment: {
                required: "Please write your review.",
                minlength: "Your review must be at least 5 characters long."
            }
        },

        errorPlacement: function (error, element) {
            if (element.attr("name") === "rating") {
                error.insertAfter("#starRating");
            } else {
                error.insertAfter(element);
            }
        }
    });

    // Trigger rating validation whenever a star is clicked
    $("#starRating i").on("click", function () {
        $("#ratingInput").valid();  // triggers rating validation
    });

});


// Login form validation

$(
    function () {

        $("#login-form").validate({

            rules: {
                username: { required: true },
                email: { required: true, email: true },
                password: { required: true },
            },
            messages: {
                username: {
                    required: "Username is required !"
                },
                email: {
                    required: "Email is required !",
                    email: "Please enter a valid email address."
                },
                password: {
                    required: "Password is required !",
                }
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        })
    }
)



// Signup form validation

$(
    function () {

        $("#signup-form").validate({

            rules: {
                username: { required: true },
                email: { required: true, email: true },
                password: {
                    required: true,
                    minlength: 8,
                    maxlength: 20,
                },
            },
            messages: {
                username: {
                    required: "Username is required !"
                },
                email: {
                    required: "Email is required !",
                    email: "Please enter a valid email address."
                },
                password: {
                    required: "Password is required !",
                    minlength: "Password must be at least 8 characters.",
                    maxlength: "Password must not exceed 20 characters.",
                }
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element);
            }
        })
    }
)


// Toast / Flash Msg Script 

document.addEventListener("DOMContentLoaded", () => {

    const toasts = document.querySelectorAll("[data-toast]");

    toasts.forEach(toast => {

        // Close on clicking "X"
        const closeBtn = toast.querySelector("[data-close]");

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                toast.classList.add("toast-hide");
                setTimeout(() => toast.remove(), 350);
            });
        }

        setTimeout(() => {
            toast.classList.add("toast-hide");
            setTimeout(() => toast.remove(), 350);
        }, 4000);

    });
});