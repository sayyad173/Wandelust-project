//Joi ak npm package hai  isse install krna hai
//fir joi.dev web site se hame code lena hai
//ye scema ko validate krna ka kaam 'joi' krna ta hai --> mtlb jaise clint side yani front end pe form ki validation ke liye hum kuch value use krte hai bootstrap ki waise  / Server side validation ke liye hum joi validation ka use krte hai


const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listings: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.alternatives().try(
            Joi.string().uri().allow("", null),
            Joi.object({
                url: Joi.string().uri().allow("", null),
                filename: Joi.string().allow("", null)
            })
        ).optional()
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});