import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.discussion.deleteMany({});
  await prisma.lead.deleteMany({});

  // Base at local noon to keep relative dates stable across timezones.
  const base = new Date();
  base.setHours(12, 0, 0, 0);
  const at = (dayOffset: number, hour: number, minute = 0) => {
    const d = new Date(base);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  const overdueFollowUp = at(-2, 9, 30);
  const todayFollowUp = at(0, 15, 0);
  const tomorrowFollowUp = at(1, 11, 0);
  const plusThreeFollowUp = at(3, 16, 15);

  // 1) Today follow-up (pinned)
  const lead1 = await prisma.lead.create({
    data: {
      name: 'Aarav Mehta',
      company: 'TechCorp',
      phone: '123-456-7890',
      status: 'New',
      followUpAt: todayFollowUp,
    },
  });
  await prisma.discussion.createMany({
    data: [
      {
        leadId: lead1.id,
        note: 'Initial outreach completed over email. Contact confirmed interest in workflow automation and asked for a short discovery call this week.',
        createdAt: at(-1, 10, 20),
      },
      {
        leadId: lead1.id,
        note: 'Shared a short product overview and scheduled discovery for this afternoon.',
        followUpAt: todayFollowUp,
        createdAt: at(0, 9, 10),
      },
    ],
  });

  // 2) Overdue follow-up
  const lead2 = await prisma.lead.create({
    data: {
      name: 'Bob Jones',
      company: 'DesignWorks',
      phone: '555-341-9012',
      status: 'Contacted',
      followUpAt: overdueFollowUp,
    },
  });
  await prisma.discussion.createMany({
    data: [
      {
        leadId: lead2.id,
        note: 'Spoke with operations manager. They are reviewing internal priorities before moving to a technical demo.',
        createdAt: at(-4, 14, 5),
      },
      {
        leadId: lead2.id,
        note: 'Follow-up call missed due to procurement meeting delay. Need to reconnect and confirm revised timeline.',
        followUpAt: overdueFollowUp,
        createdAt: at(-2, 16, 45),
      },
    ],
  });

  // 3) Tomorrow follow-up
  const lead3 = await prisma.lead.create({
    data: {
      name: 'Charlie Brown',
      company: 'Northwind Labs',
      phone: '555-212-7788',
      status: 'Qualified',
      followUpAt: tomorrowFollowUp,
    },
  });
  await prisma.discussion.createMany({
    data: [
      {
        leadId: lead3.id,
        note: 'Discovery call completed. Team wants pricing clarification for 20 users and onboarding expectations.',
        createdAt: at(-1, 15, 35),
      },
      {
        leadId: lead3.id,
        note: 'Prepared pricing breakdown and queued follow-up for tomorrow morning.',
        followUpAt: tomorrowFollowUp,
        createdAt: at(0, 13, 15),
      },
    ],
  });

  // 4) No follow-up set
  const lead4 = await prisma.lead.create({
    data: {
      name: 'Diana Prince',
      company: 'Themyscira Inc',
      phone: '555-667-1024',
      status: 'ProposalSent',
      followUpAt: null,
    },
  });
  await prisma.discussion.createMany({
    data: [
      {
        leadId: lead4.id,
        note: 'Proposal shared with procurement and finance stakeholders. They requested a revised payment schedule and an updated onboarding timeline before final sign-off.',
        createdAt: at(-3, 11, 0),
      },
      {
        leadId: lead4.id,
        note: 'Sent revised commercial terms and awaiting consolidated stakeholder feedback.',
        createdAt: at(-1, 17, 40),
      },
    ],
  });

  // 5) Future follow-up
  const lead5 = await prisma.lead.create({
    data: {
      name: 'Bruce Wayne',
      company: 'Wayne Enterprises',
      phone: '555-908-3344',
      status: 'Won',
      followUpAt: plusThreeFollowUp,
    },
  });
  await prisma.discussion.createMany({
    data: [
      {
        leadId: lead5.id,
        note: 'Contract finalized and onboarding kickoff completed.',
        createdAt: at(-5, 9, 50),
      },
      {
        leadId: lead5.id,
        note: 'Customer success requested a post-launch health check after initial rollout.',
        followUpAt: plusThreeFollowUp,
        createdAt: at(0, 10, 45),
      },
    ],
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
