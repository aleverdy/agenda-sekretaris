import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

import nodemailer from 'nodemailer';

// Fungsi untuk mengirim pengiriman email via Gmail
async function sendEmailReminder(email: string, agendaTitle: string, date: string, location: string | null) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('[EMAIL SKIPPED] Missing GMAIL_USER or GMAIL_APP_PASSWORD in env');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Agenda Sekretaris" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Pengingat H-1: ${agendaTitle}`,
      text: `Halo,\n\nIni adalah pengingat otomatis bahwa Anda memiliki agenda besok:\n\nJudul: ${agendaTitle}\nWaktu: ${date}\nLokasi: ${location || 'Tidak disebutkan'}\n\nMohon persiapkan diri Anda.\n\nSalam,\nSekretaris`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SUCCESS] Sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send to ${email}:`, error);
    return false;
  }
}

// Fungsi untuk mengirim pesan chat (WhatsApp) via Fonnte
async function sendChatReminder(phone: string, agendaTitle: string, date: string, location: string | null) {
  if (!process.env.FONNTE_TOKEN) {
    console.log('[CHAT SKIPPED] Missing FONNTE_TOKEN in env');
    return false;
  }

  try {
    const message = `Halo Bapak/Ibu,\n\nIni adalah pengingat otomatis bahwa besok Anda memiliki agenda berikut:\n\n📌 *${agendaTitle}*\n⏰ Waktu: ${date}\n📍 Lokasi: ${location || 'Menyusul'}\n\nMohon persiapkan diri Anda. Terima kasih.\n\n_Pesan otomatis dari Sistem Agenda Sekretaris_`;
    
    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': process.env.FONNTE_TOKEN
      },
      body: new URLSearchParams({
        target: phone,
        message: message,
      })
    });

    const result = await response.json();
    if (result.status) {
      console.log(`[CHAT SUCCESS] WhatsApp sent to ${phone}`);
      return true;
    } else {
      console.error(`[CHAT ERROR] Fonnte error for ${phone}:`, result.reason);
      return false;
    }
  } catch (error) {
    console.error(`[CHAT ERROR] Failed to send to ${phone}:`, error);
    return false;
  }
}

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
        const participant = ap.participant;
        
        if (participant.email) {
          await sendEmailReminder(participant.email, agenda.title, dateStr, agenda.location);
          emailsSent++;
        }
        
        if (participant.phone) {
          await sendChatReminder(participant.phone, agenda.title, dateStr, agenda.location);
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
