import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getTemplate(key: string, defaultValue: string) {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value || defaultValue;
}

function processTemplate(template: string, name: string, title: string, date: string, location: string | null) {
  return template
    .replace(/\[NAMA\]/g, name)
    .replace(/\[JUDUL\]/g, title)
    .replace(/\[WAKTU\]/g, date)
    .replace(/\[LOKASI\]/g, location || 'Menyusul');
}

export async function sendEmailReminder(email: string, participantName: string, agendaTitle: string, date: string, location: string | null) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('[EMAIL SKIPPED] Missing env');
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

    // We can add email template later if needed, using a basic one for now or the same template logic
    const defaultText = `Halo [NAMA],\n\nIni adalah pesan pengingat untuk agenda Anda berikut ini:\n\nJudul: [JUDUL]\nWaktu: [WAKTU]\nLokasi: [LOKASI]\n\nMohon persiapkan diri Anda.\n\nSalam,\nSekretaris`;
    
    // For simplicity, let's reuse CHAT_TEMPLATE if EMAIL_TEMPLATE is not set, or just use default text.
    const rawTemplate = await getTemplate('EMAIL_TEMPLATE', defaultText);
    const text = processTemplate(rawTemplate, participantName, agendaTitle, date, location);

    const mailOptions = {
      from: `"Agenda Sekretaris" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Pengingat Agenda: ${agendaTitle}`,
      text: text,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
}

export async function sendChatReminder(phone: string, participantName: string, agendaTitle: string, date: string, location: string | null) {
  if (!process.env.FONNTE_TOKEN) {
    console.log('[CHAT SKIPPED] Missing env');
    return false;
  }

  try {
    const defaultMsg = `Halo [NAMA],\n\nIni adalah pesan pengingat untuk agenda Anda berikut ini:\n\n📌 *[JUDUL]*\n⏰ Waktu: [WAKTU]\n📍 Lokasi: [LOKASI]\n\nMohon persiapkan diri Anda. Terima kasih.\n\n_Pesan otomatis dari Sistem Agenda Sekretaris_`;
    const rawTemplate = await getTemplate('CHAT_TEMPLATE', defaultMsg);
    const message = processTemplate(rawTemplate, participantName, agendaTitle, date, location);
    
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
    return result.status === true;
  } catch (error) {
    return false;
  }
}
