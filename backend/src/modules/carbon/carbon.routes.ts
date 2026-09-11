import { Router } from 'express';
import { carbonController } from './carbon.controller.js';
import { requireAuth } from '../../middleware/requireAuth.js';

const router = Router();

router.post('/calculate', requireAuth, carbonController.calculate);
router.get('/:id', carbonController.get);

export const carbonRoutes = router;
