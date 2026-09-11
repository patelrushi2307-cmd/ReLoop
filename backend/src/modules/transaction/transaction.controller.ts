import { Request, Response, NextFunction } from 'express';
import { transactionService } from './transaction.service.js';

export class TransactionController {
  /** Start a transaction workflow */
  async start(req: Request, res: Response, next: NextFunction) {
    try {
      const { matchId } = req.body;
      if (!matchId) {
        return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'matchId is required' } });
      }
      const transaction = await transactionService.start(matchId);
      res.status(201).json({ success: true, data: transaction });
    } catch (err) {
      next(err);
    }
  }

  /** Get status of a transaction */
  async status(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const transaction = await transactionService.getStatus(id);
      if (!transaction) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Transaction not found' } });
      }
      res.json({ success: true, data: transaction });
    } catch (err) {
      next(err);
    }
  }
}

export const transactionController = new TransactionController();
