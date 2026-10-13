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

    // Ensure voucher URL never points to localhost in sent emails
    const cleanVoucherUrl = (!voucherUrl || voucherUrl.includes('localhost') || voucherUrl.includes('127.0.0.1'))
      ? `https://piyetokihfilm.com/voucher/${serialNumber}`
      : voucherUrl;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>E-Voucher Resmi Piye To Kih</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #070A0F; color: #ffffff; margin: 0; padding: 20px; }
        .card { max-width: 520px; margin: 0 auto; background: linear-gradient(180deg, #161D2B 0%, #0E131E 100%); border: 2px solid #D97706; border-radius: 24px; overflow: hidden; padding: 28px 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.6); position: relative; }
        .header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px; margin-bottom: 20px; }
        .logo-text { font-size: 11px; letter-spacing: 2.5px; color: #F59E0B; font-weight: 800; text-transform: uppercase; }
        .title { font-size: 28px; font-weight: 900; color: #ffffff; margin: 6px 0 2px; letter-spacing: -0.5px; }
        .subtitle { font-size: 12px; color: #FBBF24; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        .notice-box { background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 14px; padding: 14px 16px; margin: 18px 0; text-align: center; }
        .info-grid { width: 100%; border-collapse: separate; border-spacing: 8px 0; margin: 16px 0; }
        .info-cell { background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 14px; }
        .serial-box { background: #070A0F; border: 2px dashed #F59E0B; border-radius: 16px; text-align: center; padding: 18px; margin: 18px 0; }
        .serial-code { font-family: 'Courier New', Courier, monospace; font-size: 26px; font-weight: 900; color: #FCD34D; letter-spacing: 4px; }
        .validity-tag { background: #3B1219; border: 1px solid #DC2626; color: #FCA5A5; font-size: 12px; font-weight: bold; padding: 12px 16px; border-radius: 12px; margin-top: 16px; text-align: center; }
        .btn { display: block; text-align: center; background: linear-gradient(90deg, #DC2626 0%, #EA580C 50%, #D97706 100%); color: #ffffff !important; text-decoration: none; font-weight: 900; font-size: 15px; padding: 16px 20px; border-radius: 14px; margin: 24px 0 12px; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4); }
        .footer { text-align: center; font-size: 11px; color: #64748B; margin-top: 24px; border-top: 1px solid #1E293B; padding-top: 16px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="card">
        <!-- HEADER -->
        <div class="header">
          <div class="logo-text">MIRACLE PICTURES PRESENTS</div>
          <div class="title">PIYE TO KIH?</div>
          <div class="subtitle">OFFICIAL E-VOUCHER TIKET NONTON</div>
        </div>

        <p style="font-size: 14px; color: #E2E8F0; line-height: 1.6; margin: 0 0 16px;">
          Halo <b>${name}</b>, klaim voucher nonton resmi film <i>Piye Toh Kih</i> kamu telah berhasil! Simpan email ini sebagai bukti kepemilikan voucher resmi.
        </p>

        <!-- INFO PENUKARAN -->
        <div class="notice-box">
          <div style="font-size: 10px; color: #F59E0B; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">PENUKARAN DI BIOSKOP</div>
          <div style="font-size: 16px; font-weight: 900; color: #FDE68A; margin: 4px 0;">DAPAT DITUKARKAN DI BIOSKOP KESAYANGAN ANDA</div>
          <div style="font-size: 11px; color: #CBD5E1;">Tunjukkan tautan e-voucher digital ini langsung ke kasir loket bioskop mitra.</div>
        </div>

        <!-- STAMP & PENERIMA ROW -->
        <table style="width: 100%; margin: 16px 0; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top; width: 62%;">
              <div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 14px; margin-bottom: 8px;">
                <div style="font-size: 9px; font-weight: 800; color: #94A3B8; text-transform: uppercase;">NAMA PENERIMA</div>
                <div style="font-size: 14px; font-weight: 900; color: #FFFFFF; margin-top: 2px;">${name}</div>
              </div>
              <div style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px 14px;">
                <div style="font-size: 9px; font-weight: 800; color: #94A3B8; text-transform: uppercase;">KOTA DOMISILI</div>
                <div style="font-size: 13px; font-weight: 800; color: #FBBF24; margin-top: 2px;">${city}</div>
              </div>
            </td>
            <td style="vertical-align: middle; text-align: center; width: 38%; padding-left: 12px;">
              <!-- OFFICIAL VERIFIED STAMP (SAMA PERSIS SEPERTI DI TIKET PDF) -->
              <div style="display: inline-block; width: 100px; height: 100px; border: 3px dashed #EF4444; border-radius: 50%; padding: 6px; text-align: center; background-color: rgba(239, 68, 68, 0.08); box-sizing: border-box;">
                <div style="font-size: 8px; font-weight: 900; letter-spacing: 1.5px; color: #F87171; text-transform: uppercase; margin-top: 6px;">★ OFFICIAL ★</div>
                <div style="font-size: 13px; font-weight: 900; color: #EF4444; letter-spacing: 0.5px; margin: 2px 0;">VERIFIED</div>
                <div style="font-size: 7px; font-weight: 800; letter-spacing: 1px; color: #FCA5A5; text-transform: uppercase;">MIRACLE PICTURES</div>
                <div style="height: 1px; background-color: #EF4444; margin: 3px auto; width: 45px;"></div>
                <div style="font-size: 7.5px; font-weight: 800; color: #FECACA;">PIYE TO KIH</div>
              </div>
            </td>
          </tr>
        </table>

        <!-- BARCODE & SERIAL SECTION -->
        <div class="serial-box">
          <div style="font-size: 10px; color: #94A3B8; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px;">KODE SERIAL PENUKARAN RESMI</div>
          
          <!-- Barcode Visual Mock -->
          <div style="background: #ffffff; padding: 10px 18px; border-radius: 6px; display: inline-block; margin-bottom: 10px;">
            <table style="border-collapse: collapse; margin: 0 auto; height: 36px;">
              <tr>
                <td style="width: 4px; background: #000;"></td><td style="width: 2px;"></td>
                <td style="width: 2px; background: #000;"></td><td style="width: 3px;"></td>
                <td style="width: 6px; background: #000;"></td><td style="width: 1px;"></td>
                <td style="width: 3px; background: #000;"></td><td style="width: 4px;"></td>
                <td style="width: 5px; background: #000;"></td><td style="width: 2px;"></td>
                <td style="width: 2px; background: #000;"></td><td style="width: 4px;"></td>
                <td style="width: 6px; background: #000;"></td><td style="width: 2px;"></td>
                <td style="width: 4px; background: #000;"></td><td style="width: 3px;"></td>
                <td style="width: 5px; background: #000;"></td><td style="width: 2px;"></td>
                <td style="width: 3px; background: #000;"></td><td style="width: 4px;"></td>
                <td style="width: 6px; background: #000;"></td><td style="width: 1px;"></td>
                <td style="width: 4px; background: #000;"></td><td style="width: 3px;"></td>
                <td style="width: 2px; background: #000;"></td><td style="width: 2px;"></td>
                <td style="width: 5px; background: #000;"></td>
              </tr>
            </table>
          </div>

          <div class="serial-code">${serialNumber}</div>
        </div>

        <!-- MASA BERLAKU -->
        <div class="validity-tag">
          ⚠️ <b>MASA BERLAKU PENUKARAN DI BIOSKOP:</b><br>
          <span style="font-size: 14px; color: #FFFFFF; font-weight: 900; display: inline-block; margin-top: 4px;">${validity}</span>
        </div>

        <p style="font-size: 12px; color: #94A3B8; line-height: 1.6; margin-top: 18px; text-align: left;">
          📌 <b>PETUNJUK PENUKARAN DI KASIR BIOSKOP:</b><br>
          Voucher dapat ditukarkan di bioskop kesayangan Anda. Cukup tunjukkan tautan e-voucher digital ber-barcode melalui tombol di bawah ini ke kasir loket bioskop mitra saat hendak menonton pada periode penayangan di atas. Tidak perlu dicetak kertas!
        </p>

        <!-- CTA BUTTON KE DOMAIN RESMI -->
        <a href="${cleanVoucherUrl}" class="btn" target="_blank">
          🎟️ BUKA & SIMPAN E-VOUCHER DIGITAL
        </a>
        <div style="text-align: center; font-size: 11px; color: #94A3B8; margin-top: -4px;">
          Tautan resmi: <a href="${cleanVoucherUrl}" style="color: #FBBF24; text-decoration: underline;">${cleanVoucherUrl}</a>
        </div>

        <div class="footer">
          ✅ <b>TERVERIFIKASI RESMI OLEH MIRACLE PICTURES</b><br>
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
