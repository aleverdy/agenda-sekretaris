import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ error: 'Silakan masukkan parameter phone, contoh: /api/test-wa?phone=08123456789' }, { status: 400 });
  }

  if (!process.env.FONNTE_TOKEN) {
    return NextResponse.json({ error: 'FONNTE_TOKEN belum diatur di Vercel.' }, { status: 500 });
  }

  try {
    const message = `Halo! Ini adalah pesan uji coba dari sistem Agenda Sekretaris Anda.\n\nJika pesan ini masuk, artinya integrasi Fonnte Anda sudah berhasil 100%! 🎉`;
    
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
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Gagal mengirim pesan' }, { status: 500 });
  }
}
