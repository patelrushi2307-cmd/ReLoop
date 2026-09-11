import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    materialId: z.string().min(1),
    quantity: z.number().positive(),
    orderType: z.enum(['free_claim', 'paid_purchase']),
    deliveryNotes: z.string().optional(),
  }),
});
