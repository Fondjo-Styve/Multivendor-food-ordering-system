import mongoose from 'mongoose';
import { Restaurant } from "../models/restaurantModel.js";
import { User } from "../models/userModel.js";
import { createCustomError } from "../utils/createError.js";
import {mongoIdSchema,createRestaurantSchema,
        updateRestaurantSchema} from '../validators/adminValidator.js';
import { passwordHash } from "../utils/hashing.js";

export const createRestaurant = async (req,res,next)=>{

    const {error,value}=createRestaurantSchema.validate(req.body);
    if(error){
        return next(createCustomError(400,error.details[0].message));
    }

    const {ownerName,name,temporaryPassword,address,phoneNumber,email,description,cuisineType}=value;
    try {

        const existingUser=await User.findOne({email}).select('+role')
        if(existingUser){
            return next(createCustomError(409,'email already in use select another email address'));
        }
        
        const hashedPassword=await passwordHash(temporaryPassword,12); 

        const newOwner=await User.create({
            name:ownerName,
            email,
            password:hashedPassword,
            role:'owner'
        });
        const newRestaurant = await Restaurant.create({
          email,
          ownerName,
          name,
          address,
          phoneNumber,
          email,
          description,
          cuisineType,
          owner:newOwner._id
    });
    
    return res.status(201)
              .json({
                success:true,
                message:'Restaurant created sucessfully',
                data:{
                    restaurant:newRestaurant,
                    credentials:{
                        email:newOwner.email,
                        temporaryPassword:temporaryPassword
                    }
                }
              })
    } catch (err) {
        console.error(err);
        next(err);
    }
};

export const updateRestaurant=async (req,res,next)=>{
    const restaurantId=req.params;
    const {role,userId}=req.user;
    const {error,value}=updateRestaurantSchema.validate(req.body);
    if(error){
        return next(createCustomError(400,error.details[0].message));
    }
    
    try {
        const existingRestaurant=await Restaurant.findById(restaurantId);
        if(!existingRestaurant){
            return next(createCustomError(404,'Restaurant does not exist'));
        }

        if(role!=='admin' && existingRestaurant.owner.toString()!==userId){
            return next(createCustomError(403,'you are not allowed to update this retaurant details'));
        }

        Object.assign(existingRestaurant,value);
        const updatedRestaurant=await existingRestaurant.save();

        return res.status(200)
                  .json({
                    success:true,
                    message:'restaurant details successfully updated',
                    data:updatedRestaurant
                  })
    } catch (err) {
        console.error(err);
        next(err);
    }
}

// deactivating the restaurant and the owners account;
export const deActivateRestaurant=async(req,res,next)=>{
   const {userId,role}=req.user;
   const {error,value}=mongoIdSchema.validate(req.params)
   if(error){
    return next(createCustomError(400,error.details[0].message));
   }

   const {restaurantId}=value;

   try {
    
    const existingRestaurant=await Restaurant.findById(restaurantId);
    if(!existingRestaurant){
        return next(createCustomError(404,'Restaurant does not exist'));
    }
    
    if(role!=='admin' && existingRestaurant.owner.toString()!==userId){
        return next(createCustomError(403,'You are not authorized to perform this action'));
    }

     existingRestaurant.isActive=false;
     await existingRestaurant.save();

     await User.findOneAndUpdate(existingRestaurant.owner,{isActive:false});

    return res.status(200)
              .json({
                success:true,
                message:'restaurant sucesfully deleted',
                data:{
                    restaurantId:existingRestaurant._id,
                    status:'Deactivated'
                }
              })
   } catch (err) {
    console.error(err)
    next(err);
   }
}

export const getAllRestaurants=async (req,res,next)=>{

    try {
        // only fetch restaurants where isAcctive is true
        const activeRestaurants=await Restaurant.find({isActive:true})
        .sort({createdAt:-1}) ;//getting all newest restaurants first

        return res.status(200)
                  .json({
                    success:true,
                    count:activeRestaurants.length,
                    data:activeRestaurants
                  })
    } catch (err) {
        console.error('error getting restaurant',err);
        next(err);
    }
}

