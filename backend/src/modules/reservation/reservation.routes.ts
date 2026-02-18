import { Router } from 'express';
import * as reservationController from './reservation.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import {
  createReservationSchema,
  updateReservationSchema,
  adminCreateReservationSchema,
  adminUpdateReservationSchema,
  updateStatusSchema,
} from './reservation.schema';

const router = Router();

// Customer routes
router.get('/availability', authenticate, authorize('customer'), reservationController.getAvailability);
router.get('/my', authenticate, authorize('customer'), reservationController.getMyReservations);
router.get('/my/:id', authenticate, authorize('customer'), reservationController.getReservationById);
router.post('/my', authenticate, authorize('customer'), validate(createReservationSchema), reservationController.createReservation);
router.patch('/my/:id', authenticate, authorize('customer'), validate(updateReservationSchema), reservationController.updateReservation);
router.delete('/my/:id', authenticate, authorize('customer'), reservationController.cancelReservation);

// Admin routes
router.get('/admin', authenticate, authorize('admin'), reservationController.adminGetReservations);
router.get('/admin/:id', authenticate, authorize('admin'), reservationController.adminGetReservationById);
router.post('/admin', authenticate, authorize('admin'), validate(adminCreateReservationSchema), reservationController.adminCreateReservation);
router.patch('/admin/:id', authenticate, authorize('admin'), validate(adminUpdateReservationSchema), reservationController.adminUpdateReservation);
router.patch('/admin/:id/status', authenticate, authorize('admin'), validate(updateStatusSchema), reservationController.adminUpdateStatus);
router.delete('/admin/:id', authenticate, authorize('admin'), reservationController.adminDeleteReservation);

export default router;
