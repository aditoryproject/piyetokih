import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, BogoReminderRecord } from '@/lib/db';
import { sendWahnotifVoucher } from '@/lib/wahnotif';
import nodemailer from 'nodemailer';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import { sanitizeString, validateHumanSubmission } from '@/lib/security';

export async function GET(req: NextRequest) {
  // Protect PII data: only admin can view registered customer reminders
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  if (!session.valid) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Akses ditolak.' },
      { status: 401 }
    );
  }

  const db = getDb();
  return NextResponse.json({
    totalReminders: db.bogoReminders.length,
    reminders: db.bogoReminders,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Bot & Honeypot Validation
    const humanCheck = validateHumanSubmission(body.website, body._t);
    if (!humanCheck.isHuman) {
      // Silently return success to mislead malicious bots
      return NextResponse.json({
        success: true,
        message: 'Nomor WhatsApp Anda berhasil didaftarkan.',
      });
    }

    const name = sanitizeString(body.name, 100);
    const phone = sanitizeString(body.phone, 30);
    const email = sanitizeString(body.email, 120);
    const city = sanitizeString(body.city, 60);

    if (!name || !phone || !email || !city) {
      return NextResponse.json(
        { success: false, error: 'Semua kolom formulir wajib diisi lengkap.' },
        { status: 400 }
      );
    }

    const cleanPhone = String(phone).replace(/[^0-9]/g, '');
    if (cleanPhone.length < 9) {
      return NextResponse.json(
        { success: false, error: 'Nomor WhatsApp tidak valid.' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Check if already registered
    const existing = db.bogoReminders.find(
      r => r.phone.replace(/[^0-9]/g, '').endsWith(cleanPhone.slice(-9)) || r.email.toLowerCase() === email.toLowerCase()
    );

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        message: 'Nomor WhatsApp atau Email Anda sudah terdaftar dalam antrean reminder Presale Buy 1 Get 1!',
      });
    }

    const newReminder: BogoReminderRecord = {
      id: `rem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: String(name).trim(),
      phone: cleanPhone,
      email: String(email).trim().toLowerCase(),
      city: String(city).trim(),
      registeredAt: new Date().toISOString(),
      reminderStatus: 'pending',
    };

    db.bogoReminders.unshift(newReminder);
    saveDb(db);

    // Send Immediate Registration Confirmation via WhatsApp
    const waMessage = `🔔 *PENDAFTARAN PENGINGAT (REMINDER) WAR PRESALE BERHASIL!* 🔔

Halo *${newReminder.name}*, 
Terima kasih! Nomor WhatsApp Anda sudah resmi terdaftar dalam antrean pengingat *Presale Buy 1 Get 1 Film "PIYE TO KIH?"* untuk Kota *${newReminder.city}*.

📅 *Jadwal Pembukaan War Presale:* 15 - 18 November 2026
🎬 *Tayang Perdana Bioskop:* 19 November 2026
🎟️ *Total Kuota Terbatas:* 
- 1.000 Kuota di TIX ID
- 500 Kuota di M-TIX XXI

Kami akan otomatis mengirimkan pesan pengingat beserta link pembelian langsung ke WhatsApp ini pada *15 November 2026* saat presale dibuka agar Anda tidak kehabisan kuota! 🍿✨

_Miracle Pictures - Official Film "PIYE TO KIH?"_`;

    if (db.settings.wahnotifApiKey) {
      let waTarget = cleanPhone;
      if (waTarget.startsWith('0')) waTarget = '62' + waTarget.slice(1);

      fetch('https://api.wahnotif.com/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${db.settings.wahnotifApiKey}`,
        },
        body: JSON.stringify({
          number: waTarget,
          phone: waTarget,
          message: waMessage,
        }),
      }).catch(err => console.error('[BOGO Reminder WA Error]:', err));
    }

    // Send Immediate Confirmation via Email
    if (db.settings.smtpHost && db.settings.smtpUser && db.settings.smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: db.settings.smtpHost,
          port: db.settings.smtpPort || 465,
          secure: (db.settings.smtpPort || 465) === 465,
          auth: {
            user: db.settings.smtpUser,
            pass: db.settings.smtpPass,
          },
        });

        const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#0b0f17; color:#ffffff; font-family:sans-serif; padding:20px;">
  <div style="max-width:520px; margin:0 auto; background:#131b2a; border:1px solid rgba(250,204,21,0.3); border-radius:20px; padding:24px; text-align:center;">
    <div style="font-size:10px; font-weight:bold; color:#facc15; letter-spacing:2px; text-transform:uppercase;">MIRACLE PICTURES PRESENTS</div>
    <h2 style="color:#ffffff; margin:8px 0;">PIYE TO KIH? THE MOVIE</h2>
    <div style="background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.4); border-radius:12px; padding:12px; margin:16px 0;">
      <div style="font-size:12px; font-weight:bold; color:#f87171;">🔔 PENGINGAT PRESALE BUY 1 GET 1 AKTIF</div>
      <div style="font-size:11px; color:#e2e8f0; margin-top:4px;">Halo <b>${newReminder.name}</b>, Anda terdaftar untuk pengingat Kota <b>${newReminder.city}</b>.</div>
    </div>
    <p style="font-size:12px; color:#cbd5e1; line-height:1.6; text-align:left;">
      War Presale Tiket Buy 1 Get 1 resmi dibuka pada <b>15 - 18 November 2026</b> untuk penayangan perdana <b>19 November 2026</b>.<br/><br/>
      <b>Total Kuota Terbatas:</b><br/>
      • 1.000 Kuota di TIX ID<br/>
      • 500 Kuota di M-TIX XXI<br/><br/>
      Kami akan mengirimkan notifikasi dan link pembelian langsung ke email & WhatsApp Anda tepat saat dibuka pada 15 November 2026!
    </p>
    <div style="font-size:10px; color:#64748b; margin-top:20px; border-top:1px solid rgba(255,255,255,0.1); padding-top:12px;">
      © 2026 Miracle Pictures. All Rights Reserved.
    </div>
  </div>
</body>
</html>`;

        transporter.sendMail({
          from: db.settings.smtpFrom || 'Miracle Pictures <ticket@piyetokihfilm.com>',
          to: newReminder.email,
          subject: '🔔 Pengingat Presale Buy 1 Get 1 Film PIYE TO KIH? - Miracle Pictures',
          html: emailHtml,
        }).catch(err => console.error('[BOGO Reminder Email Error]:', err));
      } catch (e) {
        console.error('[BOGO Transporter Error]:', e);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran reminder berhasil! Kami akan mengingatkan Anda pada 15 November 2026.',
    });
  } catch (err: any) {
    console.error('[BOGO Reminder POST Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memproses pendaftaran reminder.' },
      { status: 500 }
    );
  }
}
