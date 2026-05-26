import { User } from "../models/userModel.js"
import { createCustomError } from "../utils/createError.js";

export const isActiveUser=async(req,res,next)=>{
    const {userId}=req.user;
    try{
        const existingUser=await User.findById(userId);
        if(!existingUser || !existingUser.isActive){
            return next(createCustomError(401,'Access revoked,Your account has been deactivated'));
        }

        next();
    }catch(err){
        next(err);
    }
};