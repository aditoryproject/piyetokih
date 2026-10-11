import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const pathname = req.nextUrl.pathname;

  // 1. ADMIN DASHBOARD AUTHENTICATION PROTECTION
  if (pathname === '/admin/login') {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    // If already logged in, redirect to admin panel
    if (session.valid) {
      const adminUrl = req.nextUrl.clone();
      adminUrl.pathname = '/admin';
      return NextResponse.redirect(adminUrl);
    }
    return NextResponse.next();
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    // If session is invalid or missing, redirect to login page
    if (!session.valid) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. ADMIN API PROTECTION
  if (pathname.startsWith('/api/admin')) {
    // Whitelist public admin routes (login & logout)
    if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
      return NextResponse.next();
    }

    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    if (!session.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Sesi login administrator tidak valid atau telah berakhir.' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 3. Skip static assets, other APIs, and general app pages from subdomain rewrite
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/voucher') ||
    pathname.startsWith('/city') ||
    pathname.startsWith('/artikel') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 4. Wildcard Subdomain City Routing (e.g. solo.piyetokihfilm.com -> /city/solo)
  const hostWithoutPort = hostname.split(':')[0];
  const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostWithoutPort);
  const hostParts = hostWithoutPort.split('.');
  
  if (!isIp && (hostParts.length > 2 || (hostParts.length === 2 && hostParts[1] === 'localhost'))) {
    const subdomain = hostParts[0].toLowerCase();

    if (subdomain !== 'www' && subdomain !== 'app' && subdomain !== 'admin') {
      const url = req.nextUrl.clone();
      url.pathname = `/city/${subdomain}${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
