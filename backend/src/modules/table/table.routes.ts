import { Router } from 'express';
import * as tableController from './table.controller';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { validate } from '../../middleware/validate';
import { createTableSchema, updateTableSchema } from './table.schema';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/', tableController.listTables);
router.post('/', validate(createTableSchema), tableController.createTable);
router.patch('/:id', validate(updateTableSchema), tableController.updateTable);
router.delete('/:id', tableController.deleteTable);
router.get('/floor-plan', tableController.getFloorPlan);

export default router;
