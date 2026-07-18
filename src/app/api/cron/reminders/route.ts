import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { sendEmailReminder, sendChatReminder } from '@/lib/notifications';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Cari agenda besok
    const tomorrowStart = new Date();
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const agendas = await prisma.agenda.findMany({
      where: {
        startDate: {
          gte: tomorrowStart,
          lte: tomorrowEnd
        },
        reminderSentAt: null
      },
      include: {
        participants: {
          include: {
            participant: true
          }
        }
      }
    });

    let emailsSent = 0;
    let chatsSent = 0;

    for (const agenda of agendas) {
      const dateStr = agenda.startDate.toLocaleString('id-ID');
      
      for (const ap of agenda.participants) {
        const p = ap.participant;
        
        if (p.email) {
          await sendEmailReminder(p.email, p.name, agenda.title, dateStr, agenda.location);
          emailsSent++;
        }
        
        if (p.phone) {
          await sendChatReminder(p.phone, p.name, agenda.title, dateStr, agenda.location);
          chatsSent++;
        }
      }

      // Tandai bahwa pengingat telah dikirim untuk agenda ini
      await prisma.agenda.update({
        where: { id: agenda.id },
        data: { reminderSentAt: new Date() }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Reminders processed. Emails sent: ${emailsSent}, Chats sent: ${chatsSent}`,
      agendasProcessed: agendas.length
    });

  } catch (error) {
    console.error('Error processing reminders:', error);
    return NextResponse.json({ success: false, error: 'Failed to process reminders' }, { status: 500 });
  }
}
