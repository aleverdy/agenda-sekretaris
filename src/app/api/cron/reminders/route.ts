import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Fungsi untuk mensimulasikan pengiriman email
async function sendEmailReminder(email: string, agendaTitle: string, date: string) {
  console.log(`[EMAIL MOCK] Sending email to ${email} for agenda "${agendaTitle}" on ${date}`);
  // TODO: Integrasi dengan Resend / Nodemailer di sini
  return true;
}

// Fungsi untuk mensimulasikan pengiriman pesan chat (WhatsApp)
async function sendChatReminder(phone: string, agendaTitle: string, date: string) {
  console.log(`[CHAT MOCK] Sending WhatsApp to ${phone} for agenda "${agendaTitle}" on ${date}`);
  // TODO: Integrasi dengan Twilio / Fonnte WhatsApp API di sini
  return true;
}

export async function GET() {
  try {
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
        const participant = ap.participant;
        
        if (participant.email) {
          await sendEmailReminder(participant.email, agenda.title, dateStr);
          emailsSent++;
        }
        
        if (participant.phone) {
          await sendChatReminder(participant.phone, agenda.title, dateStr);
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
