import express from 'express';
import { authorize } from '../middlewares/authorize.js';
import { createProduct } from '../controllers/menuController.js';
import { identifier } from '../middlewares/identifier.js';
import { isActiveUser } from '../middlewares/isActive.js';
import {getRestaurantMenu} from '../controllers/menuController.js';
export const router = express.Router()

router.post('/restaurant/:restaurantId',identifier,isActiveUser,authorize('admin','owner'),createProduct);
router.get('/restaurant/:restaurantId/menu',getRestaurantMenu);