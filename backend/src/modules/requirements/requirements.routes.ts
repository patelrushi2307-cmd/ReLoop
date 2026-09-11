import { Router, Request, Response, NextFunction } from 'express';
import { RequirementModel } from './requirements.model.js';
import { requireAuth } from '../../middleware/requireAuth.js';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await RequirementModel.find({ status: 'active' }).populate('organizationId', 'name address');
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requirement = await RequirementModel.create({
      ...req.body,
      organizationId: req.user?.organizationId,
    });
    res.status(201).json({ success: true, data: requirement });
  } catch (error) {
    next(error);
  }
});

export const requirementsRoutes = router;
