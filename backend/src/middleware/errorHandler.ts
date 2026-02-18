import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 2000,
        message: 'Validation failed',
        details: err.flatten().fieldErrors,
      },
    });
    return;
  }

  // Prisma unique constraint
  if ((err as any).code === 'P2002') {
    res.status(409).json({
      success: false,
      error: {
        code: 1003,
        message: 'A record with that value already exists',
      },
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 5000,
      message: 'Internal server error',
    },
  });
};
