import { Request, Response, NextFunction } from 'express';
import { carbonService } from './carbon.service.js';
import { CarbonModel } from './carbon.model.js';

export class CarbonController {
  async calculate(req: Request, res: Response, next: NextFunction) {
    try {
      const { entityId, entityType, quantity, extra } = req.body;
      if (!entityId || !entityType || typeof quantity !== 'number') {
        return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'entityId, entityType and quantity are required' } });
      }
      const carbon = await carbonService.calculateAndSave(entityId, entityType, quantity, extra);
      res.status(201).json({ success: true, data: carbon });
    } catch (err) {
      next(err);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const carbon = await CarbonModel.findById(req.params.id);
      if (!carbon) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Carbon record not found' } });
      }
      res.json({ success: true, data: carbon });
    } catch (err) {
      next(err);
    }
  }
}

export const carbonController = new CarbonController();
