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
  const rawValidity = validDatesText || settings.voucherValidDatesText || '19 - 20 November 2026 (Penayangan Perdana)';
  const validity = rawValidity.replace(/22 November/g, '20 November');
  const todayClaim = new Date().toLocaleDateString('id-ID');

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
        .card { max-width: 440px; margin: 0 auto; background: #0E131E; border: 2px solid rgba(234, 179, 8, 0.45); border-radius: 24px; overflow: hidden; padding: 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.7); position: relative; }
        .header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 14px; margin-bottom: 16px; }
        .logo-text { font-size: 10px; letter-spacing: 2px; color: #FACC15; font-weight: 800; text-transform: uppercase; }
        .title { font-size: 26px; font-weight: 900; color: #ffffff; margin: 4px 0 2px; letter-spacing: -0.5px; }
        .subtitle { font-size: 11px; color: #FDE047; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        .notice-box { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 16px; padding: 12px 14px; margin: 14px 0; text-align: center; }
        .serial-box { background: rgba(0,0,0,0.65); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; text-align: center; padding: 16px; margin: 16px 0; }
        .serial-code { font-family: 'Courier New', Courier, monospace; font-size: 24px; font-weight: 900; color: #FACC15; letter-spacing: 4px; }
        .validity-tag { background: rgba(80, 7, 15, 0.65); border: 1px solid rgba(239, 68, 68, 0.5); border-radius: 14px; padding: 12px 14px; margin-top: 14px; text-align: center; }
        .footer { text-align: center; font-size: 11px; color: #64748B; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px; line-height: 1.6; }
      </style>
    </head>
    <body>
      <div class="card">
        <!-- HEADER KARTU (PERSIS SEPERTI MODAL TIKET WEB) -->
        <div class="header">
          <div class="logo-text">MIRACLE PICTURES PRESENTS</div>
          <div class="title">PIYE TO KIH?</div>
          <div class="subtitle">OFFICIAL E-VOUCHER NONTON</div>
        </div>

        <!-- BADGE PENUKARAN VOUCHER FISIK RESMI -->
        <div class="notice-box">
          <div style="font-size: 9px; color: #F59E0B; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;">PENUKARAN VOUCHER FISIK RESMI</div>
          <div style="font-size: 15px; font-weight: 900; color: #FEF08A; margin: 3px 0;">ROADSHOW &amp; MEET AND GREET DI KOTAMU</div>
          <div style="font-size: 10px; color: #FCA5A5; font-weight: bold; margin-top: 2px;">⚠️ Voucher digital ini BUKAN bukti pembayaran tiket.</div>
          <div style="font-size: 10px; color: #E2E8F0; margin-top: 2px; line-height: 1.4;">Kunjungi booth resmi di samping venue / panggung Meet &amp; Greet di kotamu untuk menukarkan dengan voucher fisik resmi.</div>
        </div>

        <!-- DATA PENERIMA & STEMPEL VERIFIED SEPERTI DI MODAL -->
        <table style="width: 100%; margin: 14px 0; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top; width: 62%;">
              <!-- NAMA PENERIMA VOUCHER -->
              <div style="background: rgba(0,0,0,0.55); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px 14px; margin-bottom: 8px;">
                <div style="font-size: 9px; font-weight: 800; color: #94A3B8; text-transform: uppercase;">NAMA PENERIMA VOUCHER</div>
                <div style="font-size: 15px; font-weight: 900; color: #FFFFFF; margin-top: 2px;">${name}</div>
              </div>
              <!-- KOTA & TANGGAL KLAIM -->
              <table style="width: 100%; border-collapse: separate; border-spacing: 6px 0; margin-left: -6px;">
                <tr>
                  <td style="background: rgba(0,0,0,0.55); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 8px 10px;">
                    <div style="font-size: 8px; font-weight: 800; color: #94A3B8; text-transform: uppercase;">KOTA</div>
                    <div style="font-size: 12px; font-weight: 800; color: #FACC15; margin-top: 2px;">${city}</div>
                  </td>
                  <td style="background: rgba(0,0,0,0.55); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 8px 10px;">
                    <div style="font-size: 8px; font-weight: 800; color: #94A3B8; text-transform: uppercase;">TANGGAL KLAIM</div>
                    <div style="font-size: 11px; font-weight: 700; color: #E2E8F0; margin-top: 2px;">${todayClaim}</div>
                  </td>
                </tr>
              </table>
            </td>
            <td style="vertical-align: middle; text-align: center; width: 38%; padding-left: 10px;">
              <!-- OFFICIAL VERIFIED DIGITAL STAMP (PERSIS TIKET) -->
              <div style="display: inline-block; width: 95px; height: 95px; border: 3px dashed #EF4444; border-radius: 50%; padding: 5px; text-align: center; background-color: rgba(239, 68, 68, 0.1); box-sizing: border-box;">
                <div style="font-size: 7.5px; font-weight: 900; letter-spacing: 1.5px; color: #F87171; text-transform: uppercase; margin-top: 4px;">★ OFFICIAL ★</div>
                <div style="font-size: 12px; font-weight: 900; color: #EF4444; letter-spacing: 0.5px; margin: 2px 0;">VERIFIED</div>
                <div style="font-size: 6.5px; font-weight: 800; letter-spacing: 1px; color: #FCA5A5; text-transform: uppercase;">MIRACLE PICTURES</div>
                <div style="height: 1px; background-color: #EF4444; margin: 2px auto; width: 40px;"></div>
                <div style="font-size: 7px; font-weight: 800; color: #FECACA;">PIYE TO KIH</div>
              </div>
            </td>
          </tr>
        </table>

        <!-- PERFORATION LINE -->
        <div style="border-top: 2px dashed rgba(100, 116, 139, 0.5); margin: 16px 0;"></div>

        <!-- BARCODE & KODE SERIAL SECTION -->
        <div class="serial-box">
          <div style="font-size: 9px; color: #94A3B8; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px;">KODE SERIAL PENUKARAN</div>
          
          <!-- Barcode Visual Mock -->
          <div style="background: #ffffff; padding: 8px 16px; border-radius: 6px; display: inline-block; margin-bottom: 8px;">
            <table style="border-collapse: collapse; margin: 0 auto; height: 34px;">
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

        <!-- MASA BERLAKU & PETUNJUK PENUKARAN DI BOOTH (MERAH GELAP) -->
        <div class="validity-tag">
          <div style="font-size: 9px; font-weight: 900; color: #F87171; letter-spacing: 1px; text-transform: uppercase;">LOKASI PENUKARAN VOUCHER FISIK</div>
          <div style="font-size: 13px; font-weight: 900; color: #FDE047; margin: 3px 0;">Roadshow &amp; Meet and Greet (${validity})</div>
          <div style="font-size: 9.5px; color: #CBD5E1; line-height: 1.4; margin-top: 4px;">
            ⚠️ <b>Voucher digital ini bukan bukti pembayaran tiket.</b> Untuk penukaran voucher fisik resmi, silakan kunjungi booth resmi penukaran di samping panggung / venue Meet &amp; Greet di kotamu.
          </div>
        </div>

        <!-- VERIFIKASI RESMI -->
        <div style="text-align: center; margin-top: 14px; font-size: 10px; font-weight: 800; color: #4ADE80;">
          ✔ TERVERIFIKASI RESMI MIRACLE PICTURES
        </div>

        <!-- TOMBOL DOWNLOAD PDF (TOMBOL KUNING PERSIS MODAL WEB) -->
        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <tr>
            <td style="padding-bottom: 10px;">
              <a href="${cleanVoucherUrl}?download=1" style="display: block; width: 100%; box-sizing: border-box; background: linear-gradient(90deg, #FACC15 0%, #D97706 100%); color: #000000 !important; text-align: center; text-decoration: none; font-weight: 900; font-size: 14px; padding: 14px 18px; border-radius: 14px; box-shadow: 0 4px 15px rgba(250, 204, 21, 0.4);" target="_blank">
                📥 Download PDF Tiket
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <a href="${cleanVoucherUrl}" style="display: block; width: 100%; box-sizing: border-box; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); color: #FFFFFF !important; text-align: center; text-decoration: none; font-weight: 700; font-size: 12px; padding: 11px 16px; border-radius: 12px;" target="_blank">
                🎟️ Tampilkan di Layar HP (Web)
              </a>
            </td>
          </tr>
        </table>

        <div class="footer">
          © ${new Date().getFullYear()} Miracle Pictures. Seluruh hak cipta dilindungi undang-undang.<br>
          Official Instagram: @piyetokihfilm.official
        </div>
      </div>
    </body>
    </html>
    `;

    const baseSubject = settings.emailSubject || '🎟️ E-Voucher Nonton Resmi Film PIYE TO KIH? - Miracle Pictures';
    const emailSubject = baseSubject.includes(serialNumber) ? baseSubject : `${baseSubject} [Kode: ${serialNumber}]`;

    await transporter.sendMail({
      from: settings.smtpFrom || 'Miracle Pictures <ticket@piyetokihfilm.com>',
      to: email,
      subject: emailSubject,
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
