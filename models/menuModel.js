import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    restaurantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Restaurant",
        required:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        min:[0,'Price cannot be negative']
    },
    category:{
        type:String,
        required:true,
        enum:["starter","Main course","Dessert","Beverage","Sides"]
    },
    isAvailable:{
        type:Boolean,
        default:true
    }   

},{
    timestamps:true
});

export const Product=mongoose.model("Product",productSchema);