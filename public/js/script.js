$(function () {

    $.validator.addMethod("requireOneImage", function (value, element) {

        const file = $("#imageFile").val().trim();
        const url = $("#imageUrl").val().trim();
        return file !== "" || url !== "";

    }, "Upload an image OR provide a URL.");

    $("#listing-form").validate({
        rules: {
            title: { required: true, minlength: 3 },
            description: { required: true, minlength: 10 },
            price: { required: true, number: true, min: 1 },
            location: { required: true, minlength: 2 },
            country: { required: true, minlength: 2 },
            imageFile: {},
            imageUrl: { requireOneImage: true, url: true }
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
            imageUrl: {
                requireOneImage: "Provide a URL OR upload a file.",
                url: "Enter a valid URL."
            }
        },

        errorPlacement: function (error, element) {
            if (element.attr("name") === "imageFile" ||
                element.attr("name") === "imageUrl") {
                error.insertAfter("#imageUrl");
            } else {
                error.insertAfter(element);
            }
        }
    });

    $("#imageFile, #imageUrl").on("change keyup", function () {
        $("#imageUrl").valid();
    });

});