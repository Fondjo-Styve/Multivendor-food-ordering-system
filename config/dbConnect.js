import mongoose from "mongoose";
import 'dotenv/config';

const MONGODB_URI=process.env.MONGO_DB_URI;
export const dbConnect=async()=>{
    try{
        await mongoose.connect(MONGODB_URI)
        console.log('database connected');
    }catch(error){
        console.error(`database connection error ${error}`);
    }
}