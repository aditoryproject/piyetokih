import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, VisitorLog } from '@/lib/db';

export async function GET() {
  const db = getDb();
  return NextResponse.json({
    visitors: db.visitors.slice(0, 50),
    totalVisitors: db.visitors.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const forwarded = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || '127.0.0.1';
    const ip = forwarded.split(',')[0].trim();
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    let platform = 'Desktop';
    if (/android/i.test(userAgent)) platform = 'Mobile (Android)';
    else if (/iphone|ipad|ipod/i.test(userAgent)) platform = 'Mobile (iOS)';
    else if (/mobile/i.test(userAgent)) platform = 'Mobile';
    else if (/macintosh/i.test(userAgent)) platform = 'Desktop (Mac)';
    else if (/windows/i.test(userAgent)) platform = 'Desktop (Windows)';

    // Quick mock geo-resolver for indonesian cities or CF-IPCity header
    const cfCity = req.headers.get('cf-ipcity');
    let detectedCity = cfCity || 'Jakarta / Jawa';
    if (ip.startsWith('182.') || ip.startsWith('114.')) detectedCity = 'Semarang / Solo';
    if (ip.startsWith('103.') || ip.startsWith('125.')) detectedCity = 'Surabaya / Sidoarjo';

    const db = getDb();
    const log: VisitorLog = {
      id: `vis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ip: ip === '::1' ? '127.0.0.1 (Localhost)' : ip,
      city: detectedCity,
      platform,
      path: body.path || '/',
      subdomain: body.subdomain || '',
      timestamp: new Date().toISOString(),
      event: body.event || 'PageView',
    };

    db.visitors.unshift(log);
    // keep max 500 visitors logs
    if (db.visitors.length > 500) {
      db.visitors = db.visitors.slice(0, 500);
    }
    saveDb(db);

    return NextResponse.json({ success: true, log });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
