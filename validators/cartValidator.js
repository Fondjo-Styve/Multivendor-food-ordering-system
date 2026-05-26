import joi from 'joi';

export const addToCartSchema = joi.object({               
    quantity: joi.number()
                 .integer()       
                 .min(1)
                 .message("quantity must be greather than or equall to 1") // Added right after the numeric rules
                 .required()
});
