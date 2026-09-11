import { Router } from 'express';
import { matchingController } from './matching.controller.js';
import { validate } from '../../middleware/validate.js';
import { matchingQuerySchema } from './matching.schema.js';
import { requireAuth } from '../../middleware/requireAuth.js';

const router = Router();

router.post('/recommendations', requireAuth, validate(matchingQuerySchema), matchingController.recommend);

export const matchingRoutes = router;
