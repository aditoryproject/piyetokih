import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { checkRateLimit, getClientIp, isAttackProbe } from '@/lib/security';

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const pathname = req.nextUrl.pathname;
  const userAgent = req.headers.get('user-agent') || '';
  const clientIp = getClientIp(req.headers);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);

  const forwardNext = () => NextResponse.next({ request: { headers: requestHeaders } });

  // 1. WEB APPLICATION FIREWALL (WAF) - PROBE & SCANNER BLOCKER
  if (isAttackProbe(pathname, userAgent)) {
    return new NextResponse('Access Denied: Malicious probe or unauthorized scanner pattern detected.', {
      status: 403,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // 2. RATE LIMITING & DDOS MITIGATION FOR CRITICAL ENDPOINTS
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    const limit = checkRateLimit(`login:${clientIp}`, 5, 15 * 60 * 1000); // 5 attempts per 15 min
    if (!limit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak percobaan login. Akses dibatasi selama ${limit.resetInSeconds} detik demi keamanan.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(limit.resetInSeconds) },
        }
      );
    }
  }

  // Lead / Voucher / Reminder submission rate limiting (max 10 submissions per 5 min)
  if (
    (pathname === '/api/vouchers/claim' || pathname === '/api/bogo/reminder') &&
    req.method === 'POST'
  ) {
    const limit = checkRateLimit(`lead-submit:${clientIp}`, 10, 5 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Terlalu banyak permintaan dalam waktu singkat. Harap tunggu beberapa saat.',
        },
        {
          status: 429,
          headers: { 'Retry-After': String(limit.resetInSeconds) },
        }
      );
    }
  }

  // Global API DDoS protection (max 120 calls per minute per IP)
  if (pathname.startsWith('/api/')) {
    const globalLimit = checkRateLimit(`global-api:${clientIp}`, 120, 60 * 1000);
    if (!globalLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded: Terlalu banyak permintaan ke server.' },
        {
          status: 429,
          headers: { 'Retry-After': String(globalLimit.resetInSeconds) },
        }
      );
    }
  }

  // 3. ADMIN DASHBOARD ROUTE PROTECTION
  if (pathname === '/admin/login') {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    if (session.valid) {
      const adminUrl = req.nextUrl.clone();
      adminUrl.pathname = '/admin';
      return NextResponse.redirect(adminUrl);
    }
    return forwardNext();
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    if (!session.valid) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
    return forwardNext();
  }

  // 4. ADMIN API ENDPOINT PROTECTION
  if (pathname.startsWith('/api/admin')) {
    if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
      return forwardNext();
    }

    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);

    if (!session.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Sesi login administrator tidak valid atau telah berakhir.' },
        { status: 401 }
      );
    }
    return forwardNext();
  }

  // 5. PROTECT SENSITIVE PUBLIC APIS (Prevent Data Scraping / Unauthorized Actions)
  // BOGO Reminders list (PII protection: phone numbers & emails)
  if (pathname === '/api/bogo/reminder' && req.method === 'GET') {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    if (!session.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Data ini dilindungi oleh otentikasi administrator.' },
        { status: 401 }
      );
    }
  }

  // Visitor Tracking Logs: only admin can view (GET) or reset (DELETE)
  if (pathname === '/api/track' && (req.method === 'GET' || req.method === 'DELETE')) {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    if (!session.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Log visitor hanya dapat diakses oleh administrator.' },
        { status: 401 }
      );
    }
  }

  // Articles Modification: only admin can create, edit, or delete articles
  if (pathname.startsWith('/api/articles') && (req.method === 'POST' || req.method === 'DELETE')) {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    if (!session.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Hanya administrator yang dapat mengubah konten artikel.' },
        { status: 401 }
      );
    }
  }

  // Cron jobs protection
  if (pathname.startsWith('/api/cron/')) {
    const authHeader = req.headers.get('authorization') || '';
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    const cronSecret = process.env.CRON_SECRET || 'miracle-cron-secret-2026';

    const hasValidBearer = authHeader === `Bearer ${cronSecret}`;
    if (!hasValidBearer && !session.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Akses cron dibatasi untuk sistem terverifikasi.' },
        { status: 401 }
      );
    }
  }

  // 6. SUBDOMAIN CITY ROUTING (e.g. solo.piyetokihfilm.com -> /city/solo)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/voucher') ||
    pathname.startsWith('/city') ||
    pathname.startsWith('/artikel') ||
    pathname.startsWith('/kabar-galeri') ||
    pathname.includes('.')
  ) {
    return forwardNext();
  }

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

  return forwardNext();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
