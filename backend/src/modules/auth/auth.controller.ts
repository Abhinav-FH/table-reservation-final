import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { RegisterInput, LoginInput, RefreshInput, LogoutInput } from './auth.schema';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.register(req.body as RegisterInput);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.login(req.body as LoginInput);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.refresh(req.body as RefreshInput);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await authService.logout(req.body as LogoutInput);
    res.status(200).json({ success: true, data: { message: 'Logged out successfully' } });
  } catch (err) {
    next(err);
  }
};
