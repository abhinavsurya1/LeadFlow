import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

export const leadsService = {
  async list(status?: string, search?: string) {
    const statusParam = status && status !== 'All' ? status : null;
    const searchParam = search ? search : null;

    const leads = await prisma.$queryRaw`
      SELECT
        l.id,
        l.name,
        l.company,
        l.phone,
        l.status,
        l.follow_up_at AS "followUpAt",
        l.created_at AS "createdAt",
        l.updated_at AS "updatedAt",
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
      WHERE
        (${statusParam}::text IS NULL OR l.status::text = ${statusParam})
        AND (${searchParam}::text IS NULL OR LOWER(l.name) LIKE LOWER('%' || ${searchParam} || '%'))
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
