import { z } from 'zod';

export const createTableSchema = z.object({
  label: z.string().min(1).max(20),
  capacity: z.union([z.literal(2), z.literal(4), z.literal(6)]),
  gridRow: z.number().int().min(0).max(9),
  gridCol: z.number().int().min(0).max(9),
});

export const updateTableSchema = z.object({
  label: z.string().min(1).max(20).optional(),
  capacity: z.union([z.literal(2), z.literal(4), z.literal(6)]).optional(),
  isActive: z.boolean().optional(),
});

export type CreateTableInput = z.infer<typeof createTableSchema>;
export type UpdateTableInput = z.infer<typeof updateTableSchema>;
