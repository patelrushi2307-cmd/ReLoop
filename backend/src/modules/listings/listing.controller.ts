import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { listingService } from './listing.service.js';
import { ListingStatus } from './listing.model.js';

export const listingUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export class ListingController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.status(201).json({ success: true, data: await listingService.create(req.user!.userId, req.body) }); }
    catch (error) { next(error); }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await listingService.list(req.user?.userId, req.query as never) }); }
    catch (error) { next(error); }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const listing = await listingService.getById(req.user?.userId, req.params.id);
      if (!listing) { res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Listing not found', fields: {} } }); return; }
      res.json({ success: true, data: listing });
    } catch (error) { next(error); }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await listingService.update(req.user!.userId, req.params.id, req.body) }); }
    catch (error) { next(error); }
  }

  async publish(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await listingService.publish(req.user!.userId, req.params.id) }); }
    catch (error) { next(error); }
  }

  async transition(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await listingService.transition(req.user!.userId, req.params.id, req.body.status as ListingStatus) }); }
    catch (error) { next(error); }
  }

  async addMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) { res.status(422).json({ success: false, error: { code: 'MEDIA_REQUIRED', message: 'An image file is required', fields: {} } }); return; }
      res.status(201).json({ success: true, data: await listingService.addMedia(req.user!.userId, req.params.id, req.file) });
    } catch (error) { next(error); }
  }

  async listMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { res.json({ success: true, data: await listingService.getMedia(req.user?.userId, req.params.id) }); }
    catch (error) { next(error); }
  }

  async downloadMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mediaFile = await listingService.getMediaFile(req.user?.userId, req.params.id, req.params.mediaId);
      if (!mediaFile) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Media not found', fields: {} } });
        return;
      }
      res.type(mediaFile.mimeType).send(mediaFile.buffer);
    } catch (error) { next(error); }
  }

  async bulk(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) { res.status(422).json({ success: false, error: { code: 'CSV_REQUIRED', message: 'A CSV file is required', fields: {} } }); return; }
      res.json({ success: true, data: await listingService.bulkImport(req.user!.userId, req.file.buffer) });
    } catch (error) { next(error); }
  }
}

export const listingController = new ListingController();
