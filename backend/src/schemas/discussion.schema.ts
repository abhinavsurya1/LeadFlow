import { z } from 'zod';

export const createDiscussionSchema = z.object({
  body: z.object({
    note: z.string().min(1, 'Note cannot be empty'),
    followUpAt: z.string().datetime().optional().nullable(),
  }),
  params: z.object({
    leadId: z.string().uuid('Invalid lead ID format'),
  }),
});
