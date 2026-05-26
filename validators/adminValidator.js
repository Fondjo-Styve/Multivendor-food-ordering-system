import joi from "joi";

export const createRestaurantSchema=joi.object({
    name:joi.string()
            .required()
            .trim()
            .max(25)
            .min(3),
    ownerName:joi.string()
            .required()
            .trim()
            .max(25)
            .min(3),
    address:joi.string()
               .required()
               .trim(),
    phoneNumber:joi.string()
                   .required()
                   .trim(),
    email:joi.string()
             .email()
             .required()
             .trim(),
    temporaryPassword:joi.string()
                .trim()
                .required()
                .min(8)
                .max(16),
    description:joi.string()
                   .min(5)
                   .max(100) 
                   .trim()
                   .required(),
    cuisineType: joi.array()
                    .items(joi.string()
                              .trim()
                              .lowercase()) // Trims and clean individual items
                    .min(1) // Enforces that they pick at least one cuisine type
                    .required()
});

export const updateRestaurantSchema=joi.object({
      name:joi.string()
            .trim()
            .max(25)
            .min(3),
    ownerName:joi.string()
            .required()
            .trim()
            .max(25)
            .min(3),
    address:joi.string()
               .trim(),

    phoneNumber:joi.string()
                   .trim(),

    email:joi.string()
             .email()
             .trim(),

    temporaryPassword:joi.string()
                .trim()
                .min(8)
                .max(16),

    description:joi.string()
                   .min(5)
                   .max(40) 
                   .trim(),

    cuisineType: joi.array()
                    .items(joi.string()
                              .trim()
                              .lowercase()) // Trims and clean individual items
                    .min(1) // Enforces that they pick at least one cuisine type
})

export const mongoIdSchema = joi.object({
    // Enforces that the incoming ID matches MongoDB's 24-character hex format
    restaurantId: joi.string()
           .hex()
           .length(24)
           .required()
           .messages({
               "string.length": "The provided ID must be a valid 24-character hexadecimal string."
           })
});