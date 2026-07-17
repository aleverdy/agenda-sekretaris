import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.agendaParticipant.deleteMany();
  await prisma.agenda.deleteMany();
  await prisma.participant.deleteMany();

  // Create Participants
  const dir1 = await prisma.participant.create({
    data: {
      name: 'Bapak Direktur Utama',
      type: 'DIREKSI',
      email: 'dirut@perusahaan.com',
      phone: '081234567890'
    }
  });

  const dir2 = await prisma.participant.create({
    data: {
      name: 'Bapak Direktur Keuangan',
      type: 'DIREKSI',
      email: 'dirkeu@perusahaan.com',
      phone: '081298765432'
    }
  });

  const div1 = await prisma.participant.create({
    data: {
      name: 'Divisi IT',
      type: 'DIVISI',
      email: 'it@perusahaan.com',
      phone: '08111222333'
    }
  });

  // Create Agendas
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(12, 0, 0, 0);

  await prisma.agenda.create({
    data: {
      title: 'Rapat Evaluasi Kinerja',
      description: 'Membahas kinerja Q3 dan target Q4',
      startDate: tomorrow,
      endDate: tomorrowEnd,
      location: 'Ruang Rapat Utama',
      participants: {
        create: [
          { participantId: dir1.id },
          { participantId: dir2.id },
          { participantId: div1.id }
        ]
      }
    }
  });

  console.log('Database has been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
