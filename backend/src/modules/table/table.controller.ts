import { Request, Response, NextFunction } from 'express';
import * as tableService from './table.service';
import { AdminPayload } from '../../utils/jwt';

export const createTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = BigInt((req.user as AdminPayload).adminId);
    const result = await tableService.createTable(adminId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const listTables = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = BigInt((req.user as AdminPayload).adminId);
    const result = await tableService.listTables(adminId);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const updateTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = BigInt((req.user as AdminPayload).adminId);
    const tableId = BigInt(req.params.id);
    const result = await tableService.updateTable(adminId, tableId, req.body);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const deleteTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = BigInt((req.user as AdminPayload).adminId);
    const tableId = BigInt(req.params.id);
    const result = await tableService.deleteTable(adminId, tableId);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const getFloorPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = BigInt((req.user as AdminPayload).adminId);
    const date = req.query.date as string | undefined;
    const result = await tableService.getFloorPlan(adminId, date);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};
