import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { sendEmailReminder, sendChatReminder } from '@/lib/notifications';

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const agenda = await prisma.agenda.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            participant: true
          }
        }
      }
    });

    if (!agenda) {
      return NextResponse.json({ success: false, error: 'Agenda tidak ditemukan' }, { status: 404 });
    }

    const dateStr = new Date(agenda.startDate).toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let successCount = 0;
    
    // Process sending in parallel for all participants
    const promises = agenda.participants.map(async (ap) => {
      const p = ap.participant;
      let sent = false;
      
      if (p.email) {
        const emailSent = await sendEmailReminder(p.email, p.name, agenda.title, dateStr, agenda.location);
        if (emailSent) sent = true;
      }
      
      if (p.phone) {
        const chatSent = await sendChatReminder(p.phone, p.name, agenda.title, dateStr, agenda.location);
        if (chatSent) sent = true;
      }
      
      if (sent) successCount++;
    });

    await Promise.all(promises);

    return NextResponse.json({ 
      success: true, 
      message: `Berhasil mengirim pengingat ke ${successCount} partisipan` 
    });
  } catch (error) {
    console.error('Error sending manual reminder:', error);
    return NextResponse.json({ success: false, error: 'Gagal mengirim pengingat' }, { status: 500 });
  }
}
