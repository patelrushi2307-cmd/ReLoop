import { Router, Request, Response, NextFunction } from 'express';
import { impactService } from '../../services/impact.service.js';
import { OrderModel } from '../orders/orders.model.js';

const router = Router();

router.get('/organization/:orgId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgId = req.params.orgId;
    const completedOrders = await OrderModel.find({
      $or: [{ buyerOrganizationId: orgId }, { sellerOrganizationId: orgId }],
      status: 'completed',
      isDeleted: false,
    });

    let totalDivertedKg = 0;
    let totalCo2SavedKg = 0;

    for (const order of completedOrders) {
      const metrics = impactService.calculateImpact({
        materialType: 'cardboard', // Baseline placeholder
        quantity: order.quantity,
        unit: order.unit,
      });
      totalDivertedKg += metrics.wasteDivertedKg;
      totalCo2SavedKg += metrics.co2SavedKg;
    }

    res.json({
      success: true,
      data: {
        organizationId: orgId,
        completedTransactions: completedOrders.length,
        wasteDivertedKg: Math.round(totalDivertedKg * 10) / 10,
        co2SavedKg: Math.round(totalCo2SavedKg * 10) / 10,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const impactRoutes = router;
