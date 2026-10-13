import nodemailer from 'nodemailer';
import { getDb } from './db';

export interface SendVoucherEmailParams {
  name: string;
  email: string;
  serialNumber: string;
  city?: string;
  voucherUrl: string;
  validDatesText?: string;
}

export async function sendVoucherEmail({
  name,
  email,
  serialNumber,
  city = 'Nasional',
  voucherUrl,
  validDatesText,
}: SendVoucherEmailParams) {
  const db = getDb();
  const settings = db.settings;
  const validity = validDatesText || settings.voucherValidDatesText || '19 - 20 November 2026 (Penayangan Perdana)';

  // If SMTP not configured, simulate successful dispatch in logs
  if (!settings.smtpHost || !settings.smtpUser) {
    console.log(`[Email Mock Dispatch] Sent voucher email to: ${email} for ${name} (Serial: ${serialNumber}, Valid: ${validity})`);
    return {
      success: true,
      mode: 'mock',
      message: 'Email berhasil disimulasikan (Konfigurasikan SMTP di Dashboard untuk live delivery)',
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: Number(settings.smtpPort) || 465,
      secure: Number(settings.smtpPort) === 465,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPass,
      },
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0B0F17; color: #ffffff; margin: 0; padding: 20px; }
        .card { max-width: 520px; margin: 0 auto; background: #141B28; border: 1px solid #27354E; border-radius: 20px; overflow: hidden; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { text-align: center; border-bottom: 1px solid #27354E; padding-bottom: 20px; margin-bottom: 24px; }
        .logo-text { font-size: 11px; letter-spacing: 2px; color: #EAB308; font-weight: 800; text-transform: uppercase; }
        .title { font-size: 26px; font-weight: 900; color: #ffffff; margin: 6px 0 0; }
        .serial-box { background: #070A0F; border: 2px dashed #EAB308; border-radius: 14px; text-align: center; padding: 18px; margin: 24px 0; }
        .serial-code { font-family: monospace; font-size: 24px; font-weight: 900; color: #FACC15; letter-spacing: 3px; }
        .validity-tag { background: #3B1219; border: 1px solid #DC2626; color: #F87171; font-size: 12px; font-weight: bold; padding: 8px 12px; border-radius: 10px; margin-top: 14px; text-align: center; }
        .btn { display: block; text-align: center; background: linear-gradient(90deg, #DC2626, #EA580C, #CA8A04); color: #ffffff; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px; border-radius: 12px; margin: 24px 0 12px; }
        .footer { text-align: center; font-size: 11px; color: #64748B; margin-top: 24px; border-top: 1px solid #1E293B; padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo-text">MIRACLE PICTURES PRESENTS</div>
          <div class="title">PIYE TO KIH?</div>
          <div style="font-size: 13px; color: #FACC15; font-weight: 800; margin-top: 4px; letter-spacing: 1px;">E-VOUCHER TIKET NONTON RESMI</div>
        </div>

        <p style="font-size: 15px; color: #E2E8F0; line-height: 1.5;">
          Halo <b>${name}</b>, klaim voucher nonton resmi film <i>Piye Toh Kih</i> kamu telah berhasil! Simpan email ini sebagai bukti kepemilikan voucher resmi.
        </p>

        <div style="background: #1E293B; border-left: 4px solid #EAB308; padding: 14px 18px; margin: 18px 0; border-radius: 8px;">
          <div style="font-size: 11px; color: #94A3B8; font-weight: bold; text-transform: uppercase;">PENUKARAN DI BIOSKOP</div>
          <div style="font-size: 18px; font-weight: 900; color: #FACC15; margin: 4px 0;">DAPAT DITUKARKAN DI BIOSKOP KESAYANGAN ANDA</div>
          <div style="font-size: 12px; color: #CBD5E1; line-height: 1.4;">
            Tunjukkan tautan e-voucher digital ber-barcode ini langsung ke petugas kasir loket bioskop saat hendak menonton film <i>Piye Toh Kih</i>.
          </div>
        </div>

        <div class="serial-box">
          <div style="font-size: 10px; color: #94A3B8; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">NOMOR KODE VOUCHER</div>
          <div class="serial-code">${serialNumber}</div>
          <div style="font-size: 11px; color: #CBD5E1; margin-top: 4px;">Kota Domisili: <b>${city}</b></div>
        </div>

        <div class="validity-tag">
          ⚠️ <b>MASA BERLAKU PENUKARAN DI BIOSKOP:</b><br>
          <span style="font-size: 13px; color: #FEE2E2;">${validity}</span>
        </div>

        <p style="font-size: 12px; color: #94A3B8; line-height: 1.6; margin-top: 18px;">
          📌 <b>PETUNJUK PENUKARAN DI KASIR BIOSKOP:</b><br>
          Voucher dapat ditukarkan di bioskop kesayangan Anda. Cukup tunjukkan tautan e-voucher digital di bawah ini melalui layar HP kamu ke kasir loket bioskop mitra saat hendak menonton pada periode penayangan di atas. Tidak perlu dicetak kertas!
        </p>

        <a href="${voucherUrl}" class="btn">
          BUKA & SIMPAN E-VOUCHER DIGITAL
        </a>

        <div class="footer">
          © ${new Date().getFullYear()} Miracle Pictures. Seluruh hak cipta dilindungi undang-undang.<br>
          Official Instagram: @piyetokihfilm.official
        </div>
      </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: settings.smtpFrom || 'Miracle Pictures <ticket@piyetokihfilm.com>',
      to: email,
      subject: settings.emailSubject || '🎟️ E-Voucher Nonton Resmi Film PIYE TO KIH? - Miracle Pictures',
      html: htmlContent,
    });

    return { success: true, mode: 'live' };
  } catch (err: any) {
    console.error('[SMTP Send Error]:', err);
    return { success: false, error: err.message, mode: 'live' };
  }
}

export async function testSmtpConnection({
  host,
  port,
  user,
  pass,
  from,
  to,
}: {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
}) {
  const transporter = nodemailer.createTransport({
    host,
    port: Number(port) || 465,
    secure: Number(port) === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject: '✅ Tes Koneksi Email Gateway - Miracle Pictures (Piye To Kih)',
    html: `
      <div style="font-family: sans-serif; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #0f172a; margin-top: 0;">Koneksi Email Berhasil!</h2>
        <p style="color: #334155;">Pengaturan SMTP email gateway Anda untuk sistem War Voucher film <b>PIYE TO KIH?</b> telah terhubung dengan sempurna dan siap digunakan untuk pengiriman voucher ke penonton.</p>
        <p style="color: #64748b; font-size: 12px;">Waktu pengujian: ${new Date().toLocaleString('id-ID')}</p>
      </div>
    `,
  });

  return { success: true };
}
