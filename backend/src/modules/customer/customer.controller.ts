import { Request, Response, NextFunction } from 'express';
import * as customerService from './customer.service';
import { AppError } from '../../utils/errors';

export const lookupCustomerByPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { phone } = req.query as { phone: string };

    if (!phone?.trim()) {
      throw new AppError( 400, 4005, 'Phone query parameter is required and cannot be empty' );
    }

    const customer = await customerService.findByPhone(phone.trim());

    if (!customer) {
      throw new AppError( 404, 4004, 'No customer found with the provided phone number' );
    }

    res.json({
      success: true,
      data: {
        id: String(customer.id),
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
    });
  } catch (err) {
    next(err);
  }
};
