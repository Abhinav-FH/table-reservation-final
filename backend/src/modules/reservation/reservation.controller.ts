import { Request, Response, NextFunction } from 'express';
import * as reservationService from './reservation.service';
import { CustomerPayload, AdminPayload } from '../../utils/jwt';
import { listReservationsQuerySchema } from './reservation.schema';

// Customer controllers
export const createReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customerId = BigInt((req.user as CustomerPayload).customerId);
    const result = await reservationService.createReservation(customerId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getMyReservations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customerId = BigInt((req.user as CustomerPayload).customerId);
    const query = listReservationsQuerySchema.parse(req.query);
    const result = await reservationService.getMyReservations(customerId, query);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getReservationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customerId = BigInt((req.user as CustomerPayload).customerId);
    const result = await reservationService.getReservationById(BigInt(req.params.id), customerId);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const updateReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customerId = BigInt((req.user as CustomerPayload).customerId);
    const result = await reservationService.updateReservation(BigInt(req.params.id), customerId, req.body);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const cancelReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const customerId = BigInt((req.user as CustomerPayload).customerId);
    const result = await reservationService.cancelReservation(BigInt(req.params.id), customerId);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { restaurantId, date, guestCount } = req.query;
    const result = await reservationService.getAvailability(
      BigInt(restaurantId as string),
      date as string,
      Number(guestCount)
    );
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

// Admin controllers
export const adminCreateReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = BigInt((req.user as AdminPayload).adminId);
    const result = await reservationService.adminCreateReservation(adminId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const adminGetReservations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = BigInt((req.user as AdminPayload).adminId);
    const query = listReservationsQuerySchema.parse(req.query);
    const result = await reservationService.adminGetReservations(adminId, query);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const adminGetReservationById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await reservationService.getReservationById(BigInt(req.params.id));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const adminUpdateReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = BigInt((req.user as AdminPayload).adminId);
    const result = await reservationService.adminUpdateReservation(BigInt(req.params.id), adminId, req.body);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const adminUpdateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = BigInt((req.user as AdminPayload).adminId);
    const result = await reservationService.adminUpdateStatus(BigInt(req.params.id), adminId, req.body);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const adminDeleteReservation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = BigInt((req.user as AdminPayload).adminId);
    const result = await reservationService.adminDeleteReservation(BigInt(req.params.id), adminId);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};
