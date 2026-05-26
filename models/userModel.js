import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        trim:true,
        type:String,
        required:[true,'email is required'],
        unique:true,
        lowercase:true
    },
    name:{
        type:String,
        trim:true,
        required:[true,'name is required'],
        lowercase:true
    },
    password:{
        type:String,
        required:[true,'password is required'],
        trim:true,
        select:false
    },
    role:{
        type:String,
        default:'user',
        enum:['user','admin','owner'] //owner refers to restaurant owner
    },
    verified:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:true
    },
    forgotPasswordResetCode:{
        type:String,
        select:false
    },
    forgotPasswordResetCodeExpresAt:{
        type:Date,
    },
    emailVerificationCode:{
        type:String,
        select:false
    },
    emailVerificationCodeExpiresAt:{
        type:Date
    }
},
{
    timestamps:true
});

export const User=mongoose.model('User',userSchema);