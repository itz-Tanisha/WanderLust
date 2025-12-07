const Joi = require("joi");

const listingSchemaValidator = Joi.object({

    title : Joi.string().required(),
    description : Joi.string().required(),
    price :  Joi.number().required().min(0),
    location :  Joi.string().required(),
    country :  Joi.string().required(),
    imageUrl : Joi.string().empty('').optional(),
})

const reviewSchemaValidator = Joi.object({

    comment : Joi.string().required(),
    rating : Joi.number().required().min(1).max(5)

})

module.exports = {
    listingSchemaValidator,
    reviewSchemaValidator
};