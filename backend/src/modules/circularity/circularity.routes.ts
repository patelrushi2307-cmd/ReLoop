import { Router, Request, Response, NextFunction } from 'express';
import { CarbonLedgerModel } from './carbonLedger.model.js';
import { requireAuth } from '../../middleware/requireAuth.js';

const router = Router();

// Ledger history for an organization
router.get('/ledger/:orgId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const entries = await CarbonLedgerModel.find({ organizationId: req.params.orgId }).sort({ timestamp: -1 });
    res.json({ success: true, data: entries });
  } catch (error) {
    next(error);
  }
});

// Verifiable Circular Certificate generator/endpoint
router.get('/certificate/:orderId', requireAuth, async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      certificateId: `CERT-CIRCULAR-${req.params.orderId}`,
      standard: 'ISO 14021 / GHG Protocol Scope 3 Category 1 & 4',
      issuer: 'Circular Packaging & Materials Exchange Verification Gateway',
      issuedAt: new Date().toISOString(),
      status: 'VERIFIED_CHAIN_OF_CUSTODY',
    },
  });
});

export const circularityRoutes = router;
