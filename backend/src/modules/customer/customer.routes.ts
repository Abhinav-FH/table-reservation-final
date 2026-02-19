import { Router } from 'express';
import * as customerController from './customer.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';

const router = Router();

// Admin lookup customer by phone
router.get(
  '/lookup',
  authenticate,
  authorize('admin'),
  customerController.lookupCustomerByPhone
);

export default router;
