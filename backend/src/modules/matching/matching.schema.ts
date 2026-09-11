import { z } from 'zod';

export const matchingQuerySchema = z.object({
  body: z.object({
    materialType: z.string().min(1),
    requiredQuantity: z.number().positive(),
    buyerLocation: z.object({
      longitude: z.number(),
      latitude: z.number(),
    }),
    maxDistanceKm: z.number().positive().default(100),
    maxPricePerUnit: z.number().nonnegative().optional(),
    preferredCondition: z.enum(['new', 'reusable', 'damaged_recyclable', 'clean_scrap']).optional(),
  }),
});
