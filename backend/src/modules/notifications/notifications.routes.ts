import { Router, Request, Response, NextFunction } from 'express';
import { notificationsService } from './notifications.service.js';
import { requireAuth } from '../../middleware/requireAuth.js';

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await notificationsService.getForUser(req.user!.userId);
    res.json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/read', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updated = await notificationsService.markAsRead(req.params.id, req.user!.userId);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

export const notificationsRoutes = router;
