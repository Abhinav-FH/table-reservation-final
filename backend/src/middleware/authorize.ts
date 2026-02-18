import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCodes } from '../utils/errors';

export const authorize = (...roles: ('customer' | 'admin')[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(403, ErrorCodes.FORBIDDEN, 'Insufficient permissions');
    }
    next();
  };
};
