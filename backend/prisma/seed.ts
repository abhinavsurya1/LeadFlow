import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.discussion.deleteMany({});
  await prisma.lead.deleteMany({});

  const today = new Date();
  today.setHours(12, 0, 0, 0); // Normalize to noon to avoid timezone shift issues
  
  // 1. Pinned today (New)
  const lead1 = await prisma.lead.create({
    data: {
      name: 'Alice Smith',
      company: 'TechCorp',
      phone: '123-456-7890',
      status: 'New',
      followUpAt: today
    }
  });

  // 2. Overdue (Contacted)
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lead2 = await prisma.lead.create({
    data: {
      name: 'Bob Jones',
      company: 'DesignWorks',
      status: 'Contacted',
      followUpAt: yesterday
    }
  });

  // 3. Follow up tomorrow (Qualified)
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const lead3 = await prisma.lead.create({
    data: {
      name: 'Charlie Brown',
      status: 'Qualified',
      followUpAt: tomorrow
    }
  });

  // 4. No follow up (ProposalSent)
  const lead4 = await prisma.lead.create({
    data: {
      name: 'Diana Prince',
      company: 'Themyscira Inc',
      status: 'ProposalSent'
    }
  });

  // 5. Won
  const lead5 = await prisma.lead.create({
    data: {
      name: 'Bruce Wayne',
      company: 'Wayne Enterprises',
      status: 'Won'
    }
  });

  // Add some discussions
  await prisma.discussion.create({
    data: {
      leadId: lead2.id,
      note: 'Tried calling, no answer. Will try again tomorrow.',
      followUpAt: yesterday
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
