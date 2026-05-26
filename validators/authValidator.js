import joi from 'joi';
export const signUpSchema=joi.object({
    name:joi.string()
            .required()
            .max(20)
            .min(3)
            .trim(),
    email:joi.string()
             .required()
             .trim()
             .email(),
    password:joi.string()
                .required()
                .max(16)
                .min(8) 
                .trim()     
});

export const sendOTPSchema=joi.object({
        email:joi.string()
                 .required()
                 .email()
                 .trim()
});

export const verifyOTPSchema=joi.object({
        email:joi.string()
                 .required()
                 .email()
                 .trim(),
        verificationCode:joi.string()
                            .required()
                            .trim()
                            .min(5)
                            .max(7)
});

export const signInSchema=joi.object({
        email:joi.string()
                 .required()
                 .email()
                 .trim(),
        password:joi.string()
                .required()
                .max(16)
                .min(8)
                .trim()
});

export const changePasswordSchema=joi.object({
        oldPassword:joi.string()
                       .trim()
                       .required()
                       .min(8)
                       .max(16),
        newPassword:joi.string()
                       .trim()
                       .required()
                       .min(8)
                       .max(16)
})

export const forgotPasswordSchema=joi.object({
          email:joi.string()
             .required()
             .trim()
             .email()  
});

export const forgotPasswordResetCodeSchema=joi.object({
        email:joi.string()
                 .required()
                 .email()
                 .trim(),
        resetCode:joi.string()
                       .required()
                       .trim()
                       .min(5)
                       .max(8)     
});

export const resetPasswordSchema=joi.object({
        newPassword:joi.string()
                       .required()
                       .trim()
                       .min(8)
                       .max(16),
        resetToken:joi.string()
                      .required()
})
