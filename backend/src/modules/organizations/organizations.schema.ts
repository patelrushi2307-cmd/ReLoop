import { z } from 'zod';

export const createOrganizationSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    type: z.enum(['manufacturer', 'retailer', 'recycler', 'logistics']),
    contactEmail: z.string().email(),
    phone: z.string().optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().min(1),
      state: z.string().optional(),
      country: z.string().min(1),
      postalCode: z.string().optional(),
    }),
    location: z
      .object({
        type: z.literal('Point').default('Point'),
        coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
      })
      .optional(),
  }),
});
