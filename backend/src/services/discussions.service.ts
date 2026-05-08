import { prisma } from '../utils/prisma';

export const discussionsService = {
  async listByLead(leadId: string) {
    return await prisma.discussion.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async create(leadId: string, data: { note: string; followUpAt?: string | null }) {
    const { note, followUpAt } = data;
    
    // We use a transaction because we need to insert the discussion AND update the lead's followUpAt atomically.
    const result = await prisma.$transaction(async (tx) => {
      const discussion = await tx.discussion.create({
        data: { leadId, note, followUpAt },
      });
      
      if (followUpAt !== undefined) {
        await tx.lead.update({
          where: { id: leadId },
          data: { followUpAt }, // Prisma @updatedAt handles updated_at automatically
        });
      }
      
      return discussion;
    });
    
    return result;
  }
};
