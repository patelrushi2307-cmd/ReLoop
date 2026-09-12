import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z
    .object({
      materialId: z.string().min(1).optional(),
      listingId: z.string().min(1).optional(),
      quantity: z.number().positive(),
      orderType: z.enum(['free_claim', 'paid_purchase']),
      deliveryNotes: z.string().optional(),
    })
    .refine(
      (value) => Boolean(value.materialId) !== Boolean(value.listingId),
      'Provide exactly one of listingId or materialId'
    ),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['accepted', 'in_transit', 'completed', 'cancelled']),
  }),
});
