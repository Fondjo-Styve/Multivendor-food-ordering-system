import mongoose from 'mongoose'
const restaurantModel=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'name is required'],
        lowercase:true
    },
    ownerName:{
        type:String,
        trim:true,
        required:[true,'owner name is required'],
        lowercase:true
    },
    owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:[true,'A restaurant must have an owner']
    },
    address:{
        type:String,
        requiured:[true,'restaurant address is needed'],
        trim:true
    },
    phoneNumber:{
        type:String,
        required:[true,'Restaurant phone is needed'],
        trim:true
    },
    description:{
        type:String,
        trim:true,
        required:[true,"restaurant description is required"],
    },
    cuisineType:{
        type:[String], //An array of strings examle['African food','Fast Food','Traditional']
        trim:true,
        required:[true,'please specify cuisine type']
    },
    isActive:{
        type:Boolean,
        default:true
    }
   },
   {
        timestamps:true
    })

    export const Restaurant=mongoose.model('Restaurant',restaurantModel);