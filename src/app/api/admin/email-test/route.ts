import { NextRequest, NextResponse } from 'next/server';
import { testSmtpConnection } from '@/lib/email';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();
    const settings = db.settings;

    const host = body.host || settings.smtpHost;
    const port = Number(body.port || settings.smtpPort) || 465;
    const user = body.user || settings.smtpUser;
    const pass = body.pass || settings.smtpPass;
    const from = body.from || settings.smtpFrom || 'Miracle Pictures <ticket@piyetokihfilm.com>';
    const to = body.to;

    if (!to) {
      return NextResponse.json(
        { success: false, error: 'Target email penerima uji coba wajib diisi!' },
        { status: 400 }
      );
    }

    if (!host || !user || !pass) {
      return NextResponse.json(
        { success: false, error: 'SMTP Host, Username, dan Password wajib diisi sebelum melakukan pengujian!' },
        { status: 400 }
      );
    }

    await testSmtpConnection({
      host,
      port,
      user,
      pass,
      from,
      to,
    });

    return NextResponse.json({
      success: true,
      message: `Email uji coba berhasil dikirim ke ${to}! Periksa kotak masuk atau spam Anda.`,
    });
  } catch (err: any) {
    console.error('[Email Test Failed]:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Gagal mengirim email uji coba. Periksa host, port, dan kredensial SMTP Anda.',
      },
      { status: 500 }
    );
  }
}
