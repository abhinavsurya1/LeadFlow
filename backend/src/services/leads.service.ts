import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

export const leadsService = {
  async list() {
    const leads = await prisma.$queryRaw`
      SELECT
        l.*,
        d.note AS "lastNote",
        d.created_at AS "lastNoteAt"
      FROM leads l
      LEFT JOIN LATERAL (
        SELECT note, created_at
        FROM discussions
        WHERE lead_id = l.id
        ORDER BY created_at DESC
        LIMIT 1
      ) d ON true
      ORDER BY
        CASE WHEN l.follow_up_at::date = CURRENT_DATE THEN 0 ELSE 1 END ASC,
        CASE WHEN l.follow_up_at::date = CURRENT_DATE THEN l.follow_up_at END ASC,
        l.updated_at DESC
    `;
    return leads;
  },

  async getById(id: string) {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new AppError('Lead not found', 404);
    return lead;
  },

  async create(data: Prisma.LeadCreateInput) {
    return await prisma.lead.create({ data });
  },

  async update(id: string, data: Prisma.LeadUpdateInput) {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new AppError('Lead not found', 404);
    return await prisma.lead.update({ where: { id }, data });
  },

  async delete(id: string) {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new AppError('Lead not found', 404);
    await prisma.lead.delete({ where: { id } });
  }
};
