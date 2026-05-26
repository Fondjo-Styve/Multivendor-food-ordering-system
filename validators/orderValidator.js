import joi from 'joi';
export const paymentWebhookschema=joi.object({
      status:joi.string()
                .required()
                .valid("success","failed","cancelled"),
      payment_ref:joi.string()
               .length(24)
               .hex()
               .required()
               
})
