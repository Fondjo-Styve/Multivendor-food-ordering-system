import { forgotPasswordResetCodeSchema,
        signInSchema,changePasswordSchema,
        resetPasswordSchema,forgotPasswordSchema,
        signUpSchema ,verifyOTPSchema,sendOTPSchema
    } from "../validators/authValidator.js";

import { createCustomError } from "../utils/createError.js";
import {generateAndSendOTP,
       changePasswordService,
       signInService,registerUser,
       verifyOTP, forgotPasswordService,
       verifyForgotPasswordCodeService,
       resetPasswordService
    }from '../services/authService.js';

export const signUp=async (req,res,next)=>{
   const {error,value}=signUpSchema.validate(req.body);
   if(error){
     const validationError=createCustomError(400,error.details[0].message)
     return next(validationError);
   } 
   
   try {
    const newUser=await registerUser(value);

    return res.status(201)
             .json({
                success:true,
                message:'user created sucessfully',
                newUser
             })

   } catch (err) {
     console.error(err);
     next(err);
   }
}

export const sendVerificationCode=async (req,res,next)=>{
    const {error,value}=sendOTPSchema.validate(req.body)
        if(error){
            return next(createCustomError(400,error.details[0].message));
        }

        try {

          await generateAndSendOTP(value)
          return res.status(200)
                    .json({
                        success:true,
                        message:'verification code sent sucessfully it expires in 5 minutes'
                    });

        } catch (err) {
            console.error(err);
            next(err)
        }
}

export const verifyVerificationCode=async (req,res,next)=>{
    const{error,value}=verifyOTPSchema.validate(req.body);

    if(error){
        return next(createCustomError(400,error.details[0].message));
    }

    try {
       await verifyOTP(value);
        return res.status(200)
                  .json({
                    success:true,
                    message:'verification successful'
                  })

    } catch (err) {
        console.error(err);
        next(err)
    }
}

export const signIn=async (req,res,next)=>{
    const{error,value}=signInSchema.validate(req.body);
    if(error){
        return next(createCustomError(400,error.details[0].message));
    }
    
    try {
        
        const{token,user} = await signInService(value);

        return res.status(200)
                  .cookie('Authorization',token,{
                    httpOnly:true,
                    expires:new Date(Date.now()+ 6 * 60 * 60 * 1000)
                  })
                  .json({
                    success:true,
                    message:'signIn sucessful',
                    user
                  })
    } catch (err) {
        console.error(err);
        next(err)
    }
    
}

export const signOut=async (req,res,next)=>{
   try {
    return res.clearCookie('Authorization',{
        httpOnly:true,
    })
    .status(200)
    .json({
        success:true,
        message:'signOut successful'
    })
   } catch (err) {
    next(err)
   }
}

export const changePassword=async (req,res,next)=>{
    const {userId}=req.user;
    const {error,value}=changePasswordSchema.validate(req.body);
    if(error){
        return next(createCustomError(400,error.details[0].message));
    }

    try {
        await  changePasswordService(value);
        res.clearCookie('Authorization');
        return res.status(200)
                  .json({
                    success:true,
                    message:'Password reset succesful signIn to your account'
                  })
    } catch (err) {
        console.error(err);
        next(err)
    }
}

export const forgotPassword=async (req,res,next)=>{
    const {error,value}=forgotPasswordSchema.validate(req.body);
    if(error){
        return next(createCustomError(400,error.details[0].message));
    }
    
    try {
        
        await forgotPasswordService(value);
        return res.status(200)
                  .json({
                    success:true,
                    message:'password reset code sent successfully it expires in 5 minutes'
                  })
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const verifyForgotPasswordCode=async (req,res,next)=>{
    const{error,value}=forgotPasswordResetCodeSchema.validate(req.body);
    if(error){
        return next(createCustomError(400,error.details[0].message));
    }

    try {
        const {resetToken}=await verifyForgotPasswordCodeService(value);

        return res.status(200)
                  .json({
                    success:true,
                    message:'verification sucessful',
                    resetToken
                  });

    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const resetPassword=async (req,res,next)=>{
    const {error,value}=resetPasswordSchema.validate(req.body);
    if(error){
        return next(createCustomError(400,error.details[0].message));
    }

    try {
      await resetPasswordService(value);
    return res.status(200)
              .json({
                success:true,
                message:'password reset succesful'
              });
    } catch (error) {
        console.error();
        next(error);
    }
}