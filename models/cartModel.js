import mongoose from 'mongoose';
const cartItemSchema=new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:[1,'You must add atleast one item to the cart'],
        default:1
    }
});

export const cartSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        unique:true
    },
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Restaurant',
        required:true
    },
    items:[cartItemSchema],
    totalPrice:{
        type:Number,
        required:true,
        default:0
    }
},{timestamps:true});

export const Cart=mongoose.model('Cart',cartSchema);