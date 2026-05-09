import { z } from 'zod';

export const leadStatusEnum = z.enum([
  'New',
  'Contacted',
  'Qualified',
  'ProposalSent',
  'Won',
  'Lost'
]);

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    company: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    status: leadStatusEnum.optional(),
  }),
});

export const updateLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    company: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    status: leadStatusEnum.optional(),
    followUpAt: z.string().datetime().optional().nullable(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid lead ID format'),
  }),
});
