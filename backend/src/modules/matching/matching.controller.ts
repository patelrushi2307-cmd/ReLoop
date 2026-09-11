import { Request, Response, NextFunction } from 'express';
import { matchingService } from './matching.service.js';

export class MatchingController {
  async recommend(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recommendations = await matchingService.findMatches(req.body);
      res.json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const matchingController = new MatchingController();
