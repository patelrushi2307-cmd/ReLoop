import { Router } from 'express';
import { organizationsController } from './organizations.controller.js';
import { validate } from '../../middleware/validate.js';
import { createOrganizationSchema } from './organizations.schema.js';
import { requireAuth } from '../../middleware/requireAuth.js';

const router = Router();

router.get('/', organizationsController.list);
router.get('/:id', organizationsController.getById);
router.post('/', requireAuth, validate(createOrganizationSchema), organizationsController.create);

export const organizationsRoutes = router;
