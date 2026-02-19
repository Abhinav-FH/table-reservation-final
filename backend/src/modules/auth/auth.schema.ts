import { z } from 'zod';

// ✅ Fixed — phone only required when role is customer
export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['customer', 'admin']),
  phone: z.string().optional(),
}).refine(
  (data) => data.role !== 'customer' || (data.phone && data.phone.trim().length > 0),
  {
    message: 'Phone number is required for customers',
    path: ['phone'],
  }
);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  role: z.enum(['customer', 'admin']),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
