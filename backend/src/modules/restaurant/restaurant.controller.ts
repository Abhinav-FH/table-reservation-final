import { Request, Response, NextFunction } from 'express';
import * as restaurantService from './restaurant.service';
import { AdminPayload } from '../../utils/jwt';

export const createRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = BigInt((req.user as AdminPayload).adminId);
    const result = await restaurantService.createRestaurant(adminId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getMyRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = BigInt((req.user as AdminPayload).adminId);
    const result = await restaurantService.getRestaurantByAdmin(adminId);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const updateRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = BigInt((req.user as AdminPayload).adminId);
    const result = await restaurantService.updateRestaurant(adminId, req.body);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const listRestaurants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await restaurantService.listRestaurants();
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await restaurantService.getRestaurant(BigInt(req.params.id));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};
