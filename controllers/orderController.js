import {Cart} from '../models/cartModel.js';
import { Product } from '../models/menuModel.js';
import {createCustomError} from '../utils/createError.js';
import {Order} from '../models/orderModel.js';
import { paymentWebhookschema } from '../validators/orderValidator.js';
export const createOrder=async (req,res,next)=>{
 
    const {userId}=req.user;
    try {
        const existingCart=await Cart.findOne({userId});
        if(!existingCart || existingCart.items.length===0){
            return next(createCustomError(400,'Your shopping cart is empty.Add items before checking out'));
        }
        
        const orderItemsSnapshot=[];
        let calculatedTotalPrice=0;
        for(const item of existingCart.items){
            const existingProduct=await Product.findById(item.productId);

            if(!existingProduct){
                return next(createCustomError(404,'food item no longer available plase update your cart'));
            }

            calculatedTotalPrice += existingProduct.price * item.quantity;
            orderItemsSnapshot.push({
                productId:item.productId,
                quantity:item.quantity,
                priceAtPurchase:existingProduct.price
            });
        }

        const newOrder=await Order.create({
            userId,
            restaurantId:existingCart.restaurantId,
            items:orderItemsSnapshot,
            totalPrice:calculatedTotalPrice,
            status:'pending_payment'
        });
      
        return res.status(201).json({
            success:true,
            message:'order successfully created awaiting payment',
            data:newOrder
        })
    } catch (err) {
        console.error('error creating order',err);
        next(err);
    }
}

export const paymentWebhook=async(req,res,next)=>{
    const {userId}=req.user;
    const {error,value}=paymentWebhookschema.validate(req.body);
    if(error){
        return next(createCustomError(400,error.details[0].message));
    }
    const{payment_ref,status}=value;
    const orderId=payment_ref;
    try {
        
        const existingOrder=await Order.findById(orderId);
        if(!existingOrder){
            return next(createCustomError(404,'order does not exist'));
        }
         
        if(status =="success"){
            existingOrder.status='paid';
            await existingOrder.save();

            await Cart.findOneAndDelete({userId:exxistingOrder.userId});
        }else{

            existingOrder.status='canceled';
            await existingOrder.save();
        }

        return res.status(200).json({
            success:true,
            message:`Webhook processed. Order status updated to ${existingOrder.status}`
        });

    } catch (err) {
        console.error(`monetbil webHook error ${err}`);
        next(err);
    }
};