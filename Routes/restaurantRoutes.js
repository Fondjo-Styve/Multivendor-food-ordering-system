import express from 'express';
import { identifier } from '../middlewares/identifier.js';
import { authorize } from '../middlewares/authorize.js';
import { deActivateRestaurant,
        getAllRestaurants,
        updateRestaurant } 
        from '../controllers/restaurantController.js';
import { createRestaurant } from '../controllers/restaurantController.js';
import { isActiveUser } from '../middlewares/isActive.js';

export const router=express.Router();

router.post('/admin/restaurants',identifier,isActiveUser,authorize('admin'),createRestaurant);
router.post('/restaurants/:restaurantId',identifier,authorize('owner','admin'),updateRestaurant);
router.post('/restaurants/:restaurantId',identifier,authorize('admin','owner'),deActivateRestaurant);
router.get('/restaurants',getAllRestaurants);





