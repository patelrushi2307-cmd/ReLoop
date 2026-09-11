import { Request, Response, NextFunction } from 'express';
import { organizationsService } from './organizations.service.js';

export class OrganizationsController {
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const org = await organizationsService.getById(req.params.id);
      if (!org) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Organization not found', fields: {} },
        });
        return;
      }
      res.json({ success: true, data: org });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const org = await organizationsService.create(req.body);
      res.status(201).json({ success: true, data: org });
    } catch (error) {
      next(error);
    }
  }

  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgs = await organizationsService.list();
      res.json({ success: true, data: orgs });
    } catch (error) {
      next(error);
    }
  }
}

export const organizationsController = new OrganizationsController();
