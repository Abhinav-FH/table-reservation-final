import { z } from 'zod';

export const createRestaurantSchema = z.object({
  name: z.string().min(2).max(100),
  address: z.string().min(5).max(255),
  gridRows: z.number().int().min(1).max(10),
  gridCols: z.number().int().min(1).max(10),
});

export const updateRestaurantSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  address: z.string().min(5).max(255).optional(),
  gridRows: z.number().int().min(1).max(10).optional(),
  gridCols: z.number().int().min(1).max(10).optional(),
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
