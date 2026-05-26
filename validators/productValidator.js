import joi from 'joi';

export const createProductSchema = joi.object({
    name: joi.string()
             .trim()
             .min(2)
             .max(40)
             .required(),
    description: joi.string()
                    .trim()
                    .min(5)
                    .max(500)
                    .required(),
    price: joi.number()
              .positive()
              .required(),
    category: joi.string()
                 .trim() // 👈 Move trim BEFORE valid
                 .valid("starter","Main course","Dessert","Beverage","Sides") // 👈 Fixed spelling of 'Starter'
                 .required()
});
