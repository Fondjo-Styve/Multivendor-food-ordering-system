import express from 'express';
import { addToCart, viewCart } from '../controllers/cartController.js';
import {identifier} from '../middlewares/identifier.js';
import {authorize} from '../middlewares/authorize.js';

export const router=express.Router();

router.post('/cart/:productId',identifier,authorize('user'),addToCart);
router.get('/cart',identifier,authorize('user'),viewCart);