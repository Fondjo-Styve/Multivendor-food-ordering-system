import jwt from 'jsonwebtoken';
import { createCustomError } from '../utils/createError.js';
export const identifier=(req,res,next)=>{
   let token=req.cookies.Authorization || req.headers.authorization;
   
   if(!token){
    return next(createCustomError(401,'no token found'));
   }
   
   try {
    
     const verifyToken=jwt.verify(token,process.env.TOKEN_SECRET);
     req.user=verifyToken;

     next();
   } catch (err) {
    console.error(err)
    return next(createCustomError(401,'invalid or expired token'));
   }
}