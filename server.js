import express from 'express';
import cookieParser from 'cookie-parser';
import {errorHandler} from './middlewares/errorHandler.js';
import { dbConnect } from './config/dbConnect.js';
import {router as authRouter} from './Routes/userRoutes.js';
import {router as restaurantRouter} from './Routes/restaurantRoutes.js'
import {router as orderRouter} from './Routes/orderRoutes.js';
import {router as menuRouter} from './Routes/menuRoutes.js';
import {router as cartRoutes} from './Routes/cartRoutes.js';
import 'dotenv/config';

const app=express();
const PORT= 3500 ;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/',restaurantRouter);
app.use('/api/',orderRouter);
app.use('/api/',menuRouter);
app.use('/api/',cartRoutes);
app.use(errorHandler);

dbConnect().then(()=>{
   app.listen(PORT,()=>{
    console.log(`server started in http://localhost:${PORT}`)
   }) 
})