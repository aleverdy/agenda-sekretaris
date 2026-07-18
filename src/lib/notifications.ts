import nodemailer from 'nodemailer';

export async function sendEmailReminder(email: string, agendaTitle: string, date: string, location: string | null) {
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
      subject: `Pengingat Agenda: ${agendaTitle}`,
      text: `Halo,\n\nIni adalah pesan pengingat bahwa Anda memiliki agenda berikut:\n\nJudul: ${agendaTitle}\nWaktu: ${date}\nLokasi: ${location || 'Tidak disebutkan'}\n\nMohon persiapkan diri Anda.\n\nSalam,\nSekretaris`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SUCCESS] Sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send to ${email}:`, error);
    return false;
  }
}

export async function sendChatReminder(phone: string, agendaTitle: string, date: string, location: string | null) {
  if (!process.env.FONNTE_TOKEN) {
    console.log('[CHAT SKIPPED] Missing FONNTE_TOKEN in env');
    return false;
  }

  try {
    const message = `Halo Bapak/Ibu,\n\nIni adalah pesan pengingat untuk agenda Anda berikut ini:\n\n📌 *${agendaTitle}*\n⏰ Waktu: ${date}\n📍 Lokasi: ${location || 'Menyusul'}\n\nMohon persiapkan diri Anda. Terima kasih.\n\n_Pesan otomatis dari Sistem Agenda Sekretaris_`;
    
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
