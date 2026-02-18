import { z } from 'zod';

export const createReservationSchema = z.object({
  restaurantId: z.string(),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM'),
  guestCount: z.number().int().min(1).max(12),
  specialRequests: z.string().max(500).optional(),
});

export const adminCreateReservationSchema = z.object({
  customerId: z.string(),
  restaurantId: z.string(),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM'),
  guestCount: z.number().int().min(1).max(12),
  tableIds: z.array(z.string()).min(1).max(2),
  specialRequests: z.string().max(500).optional(),
});

export const updateReservationSchema = z.object({
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  guestCount: z.number().int().min(1).max(12).optional(),
  specialRequests: z.string().max(500).optional(),
});

export const adminUpdateReservationSchema = z.object({
  customerId: z.string().optional(),
  reservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  guestCount: z.number().int().min(1).max(12).optional(),
  tableIds: z.array(z.string()).min(1).max(2).optional(),
  specialRequests: z.string().max(500).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'CANCELLED', 'COMPLETED']),
});

export const listReservationsQuerySchema = z.object({
  date: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  tableId: z.string().optional(),
  customerId: z.string().optional(),
  guestName: z.string().optional(),
  page: z.string().default('1').transform(Number),
  limit: z.string().default('20').transform(Number),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type AdminCreateReservationInput = z.infer<typeof adminCreateReservationSchema>;
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
export type AdminUpdateReservationInput = z.infer<typeof adminUpdateReservationSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type ListReservationsQuery = z.infer<typeof listReservationsQuerySchema>;
