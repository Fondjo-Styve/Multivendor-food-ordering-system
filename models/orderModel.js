import mongoose from 'mongoose';
const orderSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Restaurant',
        required:true
    },
    items:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{
                type:Number,
                required:true,
                min:[1,'Quantity cannot be less than 1']
            },
            priceAtPurchase:{
                type:Number,
                required:true
            }
        }
    ],
    totalPrice:{
        type:Number,
        required:true,
        default:0
    },
    status:{
        type:String,
        required:true,
        enum:['pending_payment','paid','preparing','deliverred','cancelled'],
        default:'pending_payment'
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export const Order=mongoose.model('Order',orderSchema);