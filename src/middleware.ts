import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('agenda_admin_session');
  const isAdmin = session?.value === 'true';

  const { pathname } = request.nextUrl;

  // Protect API routes (allow GET, block POST, PUT, DELETE for non-admins)
  // Except for the login/logout routes and the cron routes
  if (pathname.startsWith('/api/') && 
      !pathname.startsWith('/api/auth') && 
      !pathname.startsWith('/api/cron')) {
    
    // If it's a mutating request and not admin, block it
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method) && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized. Admin session required.' }, { status: 401 });
    }
  }

  // Protect Settings page
  if (pathname.startsWith('/settings')) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/settings/:path*',
  ],
};
