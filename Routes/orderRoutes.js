import express from 'express';
import { identifier } from '../middlewares/identifier.js';
import { authorize } from '../middlewares/authorize.js';
import { createOrder } from '../controllers/orderController.js';
export const router=express.Router();

router.post('/orders',identifier,authorize('user'),createOrder);