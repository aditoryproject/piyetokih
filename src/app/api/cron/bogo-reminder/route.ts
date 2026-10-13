import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const db = getDb();
    const tixidUrl = db.settings.bogoCinemaLinks?.tixid || 'https://www.tix.id';
    const mtixUrl = db.settings.bogoCinemaLinks?.xxi || 'https://m.21cineplex.com';

    const pendingList = db.bogoReminders.filter(r => r.reminderStatus !== 'sent');

    if (pendingList.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Tidak ada antrean reminder yang belum dikirim.',
        count: 0,
      });
    }

    let successCount = 0;
    let failCount = 0;

    // Transporter if SMTP configured
    let transporter: any = null;
    if (db.settings.smtpHost && db.settings.smtpUser && db.settings.smtpPass) {
      try {
        transporter = nodemailer.createTransport({
          host: db.settings.smtpHost,
          port: db.settings.smtpPort || 465,
          secure: (db.settings.smtpPort || 465) === 465,
          auth: {
            user: db.settings.smtpUser,
            pass: db.settings.smtpPass,
          },
        });
      } catch (e) {
        console.error('[Blast Transporter Init Error]:', e);
      }
    }

    for (const rem of pendingList) {
      try {
        // 1. Send WhatsApp Blast
        if (db.settings.wahnotifApiKey) {
          let cleanPhone = rem.phone.replace(/[^0-9]/g, '');
          if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);

          const blastMessage = `🎬 *WAR TIKET PRESALE BUY 1 GET 1 RESMI DIBUKA HARI INI!* 🎬

Halo *${rem.name}*, 
Tiket Presale Buy 1 Get 1 Film komedi nasional *"PIYE TO KIH?"* sudah resmi dapat dibeli sekarang untuk penayangan perdana *19 November 2026*!

🎟️ *PILIH LINK PEMBELIAN ANDA SEBELUM KUOTA HABIS:*

1️⃣ *TIX ID (Kuota 1.000 Tiket):*
${tixidUrl}

2️⃣ *M-TIX CINEMA XXI (Kuota 500 Tiket):*
${mtixUrl}

📍 *Rencana Menonton:* Kota ${rem.city}
⚠️ *PERINGATAN:* Kuota promo Buy 1 Get 1 sangat terbatas dan dapat habis sewaktu-waktu. Klik link di atas sekarang dan amankan nomor kursi bioskop Anda! 🍿🎉

_Miracle Pictures - Piye Toh Kih Official_`;

          await fetch('https://api.wahnotif.com/api/send-message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${db.settings.wahnotifApiKey}`,
            },
            body: JSON.stringify({
              number: cleanPhone,
              phone: cleanPhone,
              message: blastMessage,
            }),
          });
          rem.whatsappSentAt = new Date().toISOString();
        }

        // 2. Send Email Blast
        if (transporter && rem.email) {
          const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#0b0f17; color:#ffffff; font-family:sans-serif; padding:20px;">
  <div style="max-width:540px; margin:0 auto; background:#131b2a; border:2px solid rgba(250,204,21,0.5); border-radius:24px; padding:28px; text-align:center;">
    <div style="font-size:11px; font-weight:bold; color:#facc15; letter-spacing:2px; text-transform:uppercase;">MIRACLE PICTURES PRESENTS</div>
    <h1 style="color:#ffffff; margin:8px 0; font-size:24px;">PIYE TO KIH? THE MOVIE</h1>
    <div style="background:linear-gradient(90deg, rgba(239,68,68,0.2) 0%, rgba(245,158,11,0.2) 100%); border:1px solid rgba(245,158,11,0.5); border-radius:14px; padding:14px; margin:16px 0;">
      <div style="font-size:14px; font-weight:900; color:#fef08a;">🔥 WAR PRESALE BUY 1 GET 1 RESMI DIBUKA!</div>
      <div style="font-size:11px; color:#e2e8f0; margin-top:4px;">Halo <b>${rem.name}</b>, amankan kursi bioskop Anda sekarang di Kota <b>${rem.city}</b>!</div>
    </div>
    <p style="font-size:12px; color:#cbd5e1; line-height:1.6; text-align:left;">
      Penjualan tiket Presale Buy 1 Get 1 khusus penayangan perdana <b>19 November 2026</b> telah resmi dibuka hari ini. Segera beli tiket Anda melalui dua pilihan aplikasi resmi di bawah ini:
    </p>

    <!-- Tombol 1: TIX ID -->
    <a href="${tixidUrl}" style="display:block; background:#10B981; color:#000000; font-weight:900; font-size:13px; text-decoration:none; padding:12px 18px; border-radius:12px; margin-bottom:10px;" target="_blank">
      🎟️ BELI TIKET DI TIX ID (KUOTA 1.000 TIKET) ➔
    </a>

    <!-- Tombol 2: M-TIX -->
    <a href="${mtixUrl}" style="display:block; background:#F59E0B; color:#000000; font-weight:900; font-size:13px; text-decoration:none; padding:12px 18px; border-radius:12px; margin-bottom:14px;" target="_blank">
      🎟️ BELI TIKET DI M-TIX XXI (KUOTA 500 TIKET) ➔
    </a>

    <p style="font-size:11px; color:#94a3b8; line-height:1.5;">
      ⚠️ Kuota sangat terbatas dan akan otomatis ditutup jika sudah habis.
    </p>
    <div style="font-size:10px; color:#64748b; margin-top:20px; border-top:1px solid rgba(255,255,255,0.1); padding-top:12px;">
      © 2026 Miracle Pictures. All Rights Reserved.
    </div>
  </div>
</body>
</html>`;

          await transporter.sendMail({
            from: db.settings.smtpFrom || 'Miracle Pictures <ticket@piyetokihfilm.com>',
            to: rem.email,
            subject: '🔥 Tiket Presale Buy 1 Get 1 Film PIYE TO KIH? Resmi Dibuka Hari Ini!',
            html: emailHtml,
          });
          rem.emailSentAt = new Date().toISOString();
        }

        rem.reminderStatus = 'sent';
        successCount++;
      } catch (err) {
        console.error(`[Blast Failed for ${rem.phone}]:`, err);
        rem.reminderStatus = 'failed';
        failCount++;
      }
    }

    saveDb(db);

    return NextResponse.json({
      success: true,
      message: `Blast reminder selesai! Terkirim: ${successCount}, Gagal: ${failCount}`,
      successCount,
      failCount,
      totalProcessed: pendingList.length,
    });
  } catch (err: any) {
    console.error('[Blast Reminder Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memproses blast reminder.' },
      { status: 500 }
    );
  }
}

// GET can also be invoked by a cron job checking date 15 November
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const authKey = url.searchParams.get('key');
  const now = new Date();
  
  // Optional check: auto-fire if Nov 15 or query param trigger
  return POST(req);
}
