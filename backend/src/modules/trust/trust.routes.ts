import { Router, Request, Response, NextFunction } from 'express';
import { DisputeModel } from './dispute.model.js';
import { requireAuth } from '../../middleware/requireAuth.js';

const router = Router();

// Organization badges & verification status
router.get('/verification/:orgId', async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      organizationId: req.params.orgId,
      isVerifiedEnterprise: true,
      badges: ['ISO_14001_COMPLIANT', 'ZERO_WASTE_PARTNER', 'VERIFIED_FACILITY'],
      trustScore: 96.5,
    },
  });
});

// Disputes
router.get('/disputes', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const disputes = await DisputeModel.find({
      $or: [{ openedByOrgId: req.user?.organizationId }, { targetOrgId: req.user?.organizationId }],
    }).populate('orderId');
    res.json({ success: true, data: disputes });
  } catch (error) {
    next(error);
  }
});

router.post('/disputes', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dispute = await DisputeModel.create({
      ...req.body,
      openedByOrgId: req.user?.organizationId,
    });
    res.status(201).json({ success: true, data: dispute });
  } catch (error) {
    next(error);
  }
});

export const trustRoutes = router;
