import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    // In local development or if not set, fallback to a default just in case, but prefer env
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validPassword) {
      return NextResponse.json({ success: false, error: 'Sandi ADMIN_PASSWORD belum diatur di Vercel' }, { status: 500 });
    }

    if (password === validPassword) {
      const cookieStore = await cookies();
      cookieStore.set('agenda_admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Sandi salah' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Kesalahan server' }, { status: 500 });
  }
}
