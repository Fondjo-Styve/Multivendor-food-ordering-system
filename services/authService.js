import { User } from "../models/userModel.js";
import { createCustomError } from "../utils/createError.js";

import { passwordHash ,
        verificationCodeCompaire,
        hashOTP,
       passwordCompaire} from "../utils/hashing.js";

import {sendMail} from '../config/sendMail.js';
import jwt from "jsonwebtoken";
// userData is same as value from joi validation in the signIn authController
// signUp service
export const registerUser=async(UserData)=>{
    const {name,email,password}=UserData;

    const existingUser=await User.findOne({email})
    if(existingUser){
        throw createCustomError(409,'This email is already registered');
    }

    const hashPassword=await passwordHash(password,12);

    const newUser=await User.create({
        email,
        name,
        password:hashPassword
    });

    newUser.password=undefined;
    return newUser;
};

export const generateAndSendOTP=async(userData)=>{
    const{email}=userData;
    const existingUser=await User.findOne({email});
                if(!existingUser){
                    throw createCustomError(403,'Unauthorized permission user does not exist');
                }
    
                if(existingUser.verified===true){
                    throw createCustomError(400,'This account is already verified');
                }
    
                const verificationCode=Math.floor(100000 + Math.random() * 900000).toString();
                const hashedCode=await hashOTP(verificationCode,10)
    
                existingUser.emailVerificationCode=hashedCode;
                existingUser.emailVerificationCodeExpiresAt=Date.now()+5*60*1000;
    
                console.log(verificationCode);
                console.log(existingUser.emailVerificationCodeExpiresAt);
                await existingUser.save();
    
                await sendMail(
                   email,
                   'Your verification code is',
                   `<h1>${verificationCode}</h1>
                   <p>it expires in 5 minutes</p>`
                )

};

export const verifyOTP=async(userData)=>{
     const {email,verificationCode}=userData;
     const existingUser=await User.findOne({email}).select('+emailVerificationCodeExpiresAt +emailVerificationCode');
            if(!existingUser){
                throw createCustomError(404,'User does not exist');
            }
           
            if(existingUser.verified){
                throw createCustomError(403,'forbidened user already verified');
            }
    
            if(Date.now()>existingUser.emailVerificationCodeExpiresAt){
                throw createCustomError(400,'verification code expired');
            }
    
            const isMatch=await verificationCodeCompaire(verificationCode,existingUser.emailVerificationCode);
            if(!isMatch){
                throw createCustomError(400,'your verification code is invalid');
            }
    
            existingUser.emailVerificationCode=undefined;
            existingUser.verified=true;
            existingUser.emailVerificationCodeExpiresAt=undefined;
    
            await existingUser.save();
}

export const signInService=async(userData)=>{

            const {email,password}=userData;

            const existingUser=await User.findOne({email}).select('+password')
    
            if(!existingUser){
              throw createCustomError(403,'User does not exist');
            }
    
            if(!existingUser.isActive){
                throw createCustomError(401,'Your account has been deactivated');
            }
            
            if(!existingUser.verified){
                throw createCustomError(403,'User is not verified');
            }
    
            const isMatch=await passwordCompaire(password,existingUser.password)
            if(!isMatch){
                throw createCustomError(401,'password verification failed');
            }
            
            const userId=existingUser._id.toString();
            const token=jwt.sign({
                userId,
                role:existingUser.role,
                email:existingUser.email,
                verified:existingUser.verified
            },process.env.TOKEN_SECRET,{expiresIn:'6h'})

            return {
                token,
                user:{
                 email:existingUser.email,
                 role:existingUser.role,
                }
           }
}

export const changePasswordService=async(userData)=>{
     const {userId}=req.user;
     const {newPassword,oldPassword}=userData;

     const existingUser=await User.findById(userId).select('+password +verified')
            if(!existingUser){
                throw createCustomError(404,'User does not exist');
               }
            
            const isMatch=await passwordCompaire(oldPassword,existingUser.password);
            if(!isMatch){
                throw createCustomError(401,'password verification error check your password');
            }
        
            const hashNewPassword=await passwordHash(newPassword,12);
            existingUser.password=hashNewPassword;
    
            await existingUser.save();
}

export const forgotPasswordService=async (userData)=>{
    const {email}=userData;
    const existingUser=await User.findOne({email}).select('+verified');
            if(!existingUser){
                throw createCustomError(400,'User does not exist or invalid email');
            }
            
            if(!existingUser.verified){
                throw createCustomError(403,'User not verified');
            }
    
            const resetCode=Math.floor(100000 + Math.random() * 900000).toString();
            await sendMail(
                email,
                'Your password reset code is',
                `<h1>${resetCode}</h1>
                <p>it expires in 5 minutes</p>`
            )
            
            const hashResetCode=await hashOTP(resetCode,10);
            existingUser.forgotPasswordResetCode=hashResetCode;
            existingUser.forgotPasswordResetCodeExpresAt=Date.now()+5*60*1000;
    
            await existingUser.save();
}

export const verifyForgotPasswordCodeService=async(userData)=>{
    const {email,resetCode}=userData;

            const existingUser=await User.findOne({email}).select('+forgotPasswordResetCode +forgotPasswordResetCodeExpresAt');
            if(!existingUser){
                throw createCustomError(404,'User does not exist');
            }
    
           if(!existingUser.forgotPasswordResetCode || !existingUser.forgotPasswordResetCodeExpresAt ){
               throw createCustomError(400,'Something is wrong with the code');
            }
    
            if(!existingUser.verified){
                throw createCustomError(403,'User not verified');
            }
    
            const isMatch=await resetCodeCodeCompaire(resetCode,existingUser.forgotPasswordResetCode);
            if(!isMatch){
                throw createCustomError(401,' code matching error');
            }
    
            if(Date.now()>existingUser.forgotPasswordResetCodeExpresAt){
                throw createCustomError(402,'password reset code expired');
            }
        
            const resetToken=jwt.sign({
                userId:existingUser._id
            },process.env.TOKEN_SECRET,{expiresIn:'20m'})
    
            existingUser.forgotPasswordResetCode=undefined;
            existingUser.forgotPasswordResetCodeExpresAt=undefined;
    
            await existingUser.save();

            return{
                resetToken
            }
}

export const resetPasswordService=async (userData)=>{
    const {resetToken,newPassword}=userData;
    const decode=jwt.verify(resetToken,process.env.TOKEN_SECRET)    
      const existingUser=await User.findById(decode.userId);
      if(!existingUser){
        throw createCustomError(404,'user not found');
      }
      
      const hashNewPassword=await passwordHash(newPassword,12);
      existingUser.password=hashNewPassword;
      
    await existingUser.save();

}
