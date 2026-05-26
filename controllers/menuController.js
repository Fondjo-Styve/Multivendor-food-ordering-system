import { Restaurant } from "../models/restaurantModel.js";
import { createCustomError } from "../utils/createError.js";
import { createProductSchema } from "../validators/productValidator.js";
import { Product } from "../models/menuModel.js";
import {User} from '../models/userModel.js';
// create restaurant fooditem
export const createProduct=async(req,res,next)=>{
    const {userId,role}=req.user;
    const {restaurantId}=req.params;

    const{error,value}=createProductSchema.validate(req.body);
    if(error){
        return next(createCustomError(400,error.details[0].message));
    }

    const{name,price,description,category}=value;

    try {
        const existingUser=await User.findById(userId);

        if(!existingUser || !existingUser.isActive){
            return next(createCustomError(401,'User account has been deactivated'));
        }

        const existingRestaurant=await Restaurant.findById(restaurantId);

        if(!existingRestaurant){
            return next(createCustomError(404,'Restaurant does not exist'));
        }

        if(role!=='admin' && existingRestaurant.owner.toString()!==userId){
        return next(createCustomError(403,'You are not authorized to perform this action'));
    }

        const newProduct=await Product.create({
            restaurantId,
            name,
            price,
            description,
            category
        })
 
        return res.status(200)
                  .json({
                    success:true,
                    message:'Product succesfully created',
                    data:{
                        foodItem:newProduct
                    }
                  })

    } catch (err) {
        console.error("error creating product",err);
        next(err);
    }
}
export const getRestaurantMenu=async(req,res,next)=>{
    const {restaurantId}=req.params;
    try {
        const existingRestaurant=await Restaurant.findById(restaurantId);

        if(!existingRestaurant || !existingRestaurant.isActive){
           return next(createCustomError(404,'Restaurant does not exist or is not active'));
        }

        const product =await Product.find({restaurantId,isAvailable:true});

        return res.status(200)
                  .json({
                    success:true,
                    data:{
                        restaurantName:existingRestaurant.name,
                        foodItems:product
                    }
                  })
    } catch (err) {
        console.error(`error getting products ${err}`);
        next(err);
    }
}