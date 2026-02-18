import { Router } from 'express';
import * as restaurantController from './restaurant.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { createRestaurantSchema, updateRestaurantSchema } from './restaurant.schema';

const router = Router();

// Customer routes
router.get('/', authenticate, authorize('customer'), restaurantController.listRestaurants);
router.get('/:id', authenticate, authorize('customer'), restaurantController.getRestaurant);

// Admin routes
router.get('/admin/me', authenticate, authorize('admin'), restaurantController.getMyRestaurant);
router.post('/admin', authenticate, authorize('admin'), validate(createRestaurantSchema), restaurantController.createRestaurant);
router.patch('/admin', authenticate, authorize('admin'), validate(updateRestaurantSchema), restaurantController.updateRestaurant);

export default router;
