import {addToCartSchema} from '../validators/cartValidator.js';
import {createCustomError} from '../utils/createError.js';
import { Product } from "../models/menuModel.js";
import { Restaurant } from "../models/restaurantModel.js";
import {Cart} from '../models/cartModel.js';

export const addToCart=async (req,res,next)=>{
    const {productId}=req.params;
    const{error,value}=addToCartSchema.validate(req.body);
    if(error){
        return next(createCustomError(400,error.details[0].message));
    }

    const {quantity}=value;
    try {
        // 1. Check product existence and live availability
        const existingProduct=await Product.findById(productId);
        if(!existingProduct || !existingProduct.isAvailable){
            return next(createCustomError(404,'error finding foodItem or fooditem unavailable'));
        }
       
        const existingRestaurant=await Restaurant.findById(existingProduct.restaurantId);
         if(!existingRestaurant || !existingRestaurant.isActive){
            return next(createCustomError(404,'the restaurant is currently closed or inactive'));
        }

        const existingCart=await Cart.findOne({userId:req.user.userId});
        
        // BRANCH A: User does not have an active basket yet
       
        if(!existingCart){
           const totalPrice=existingProduct.price*quantity;
           const newCart=await Cart.create({
            userId:req.user.userId,
            restaurantId:existingProduct.restaurantId,
            items:[{
                productId,
                quantity
            }],
            totalPrice
           });

           return res.status(201)
                     .json({
                        success:true,
                        message:'cart sucesfully created',
                        data:newCart
                     });
        }

        // BRANCH B: User already has a basket saved in MongoDB
        if (existingCart && existingCart.restaurantId.toString() !== existingProduct.restaurantId.toString()) {
            return next(createCustomError(400, "Cannot mix items from different restaurants. Clear your cart first!"));
          }

          let itemFound=false;
          existingCart.items.forEach(item => {
            if(item.productId.toString()===productId.toString()){
                item.quantity += quantity;

                itemFound=true;
            }
          });

          if(!itemFound){
            existingCart.items.push({
                productId,
                quantity
            })
          }

          let calculatedTotalPrice=0;
          for(const item of existingCart.items){
            const productData=await Product.findById(item.productId);

            if(!productData){
                return next(createCustomError(404,'Item not available'));
            }

            const itemTotalPrice=productData.price * item.quantity;
            calculatedTotalPrice += itemTotalPrice;
          }

          existingCart.totalPrice = calculatedTotalPrice;
          const updatedCart=await existingCart.save();

          return res.status(200)
                    .json({
                        success:true,
                        data:updatedCart
                    });

    } catch (err) {
        console.error(`error adding to cart ${err}`);
        next(err);
    }
};

export const viewCart=async (req,res,next)=>{

    const {userId}=req.user;
    try {
        const existingCart=await Cart.findOne({userId}).populate('items.productId');
        if(!existingCart){
            return res.status(200)
                      .json({
                        message:'Your cart is currently empty',
                        data:{
                            "items":[],
                            "totalPrice":0
                        }
                    });
        }

       return res.status(200).json({
        success:true,
        message:'Cart retrieved sucessfully',
        data:existingCart
       })
        
    } catch (err) {
        console.error('error viewing cart',err);
        next(err);
    }
}
