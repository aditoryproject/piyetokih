import { NextRequest, NextResponse } from 'next/server';
import { VisitorLog } from '@/lib/db';
import { getVisitors, addVisitorLog, clearVisitorLogs } from '@/lib/visitors-store';

export async function GET() {
  const visitors = getVisitors();
  return NextResponse.json({
    visitors,
    totalVisitors: visitors.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown';
    const host = req.headers.get('host') || 'piyetokihfilm.com';

    let platform = 'Desktop / Lainnya';
    if (/android/i.test(userAgent)) platform = 'Mobile (Android)';
    else if (/iphone|ipad|ipod/i.test(userAgent)) platform = 'Mobile (iOS)';
    else if (/windows/i.test(userAgent)) platform = 'Desktop (Windows)';
    else if (/macintosh|mac os x/i.test(userAgent)) platform = 'Desktop (Mac)';

    let city = body.city || 'Indonesia';
    if (ip.startsWith('114.') || ip.startsWith('182.')) city = 'Semarang / Solo';
    else if (ip.startsWith('103.')) city = 'Yogyakarta / Magelang';
    else if (ip.startsWith('36.')) city = 'Surabaya / Malang';
    else if (ip !== '127.0.0.1') city = 'Jakarta / Jawa';

    const log: VisitorLog = {
      id: `vis-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ip,
      city,
      platform,
      path: body.path || '/',
      subdomain: host.includes('.') ? host.split('.')[0] : 'main',
      timestamp: new Date().toISOString(),
      event: body.event || 'PageView',
    };

    addVisitorLog(log);

    return NextResponse.json({ success: true, log });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    clearVisitorLogs();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
