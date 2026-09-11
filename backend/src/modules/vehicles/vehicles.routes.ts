import { Router, Request, Response, NextFunction } from 'express';
import { VehicleModel } from './vehicles.model.js';
import { requireAuth } from '../../middleware/requireAuth.js';

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await VehicleModel.find({ carrierOrganizationId: req.user?.organizationId, isDeleted: false });
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vehicle = await VehicleModel.create({
      ...req.body,
      carrierOrganizationId: req.user?.organizationId,
    });
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    next(error);
  }
});

// Route Consolidation & Backhaul discovery endpoint
router.get('/backhauls', requireAuth, async (_req: Request, res: Response) => {
  // Returns return-haul matching opportunities along transport corridors
  res.json({
    success: true,
    data: [
      {
        backhaulId: 'BH-CH-MK-01',
        originCity: 'Milwaukee',
        destinationCity: 'Chicago',
        availableCapacityPallets: 24,
        opportunity: 'Return trip packaging salvage pickup available with 40% freight reduction',
      },
    ],
  });
});

export const vehiclesRoutes = router;
