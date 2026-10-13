import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, generateVoucherSerial, LeadRecord } from '@/lib/db';
import { sendVoucherEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[Wahnotif Inbound Payload Received]:', JSON.stringify(body));

    // Support Wahnotif Custom AI Tool parameters (arguments/parameters or flat body)
    const args = body.arguments || body.parameters || body;

    // Extract lead attributes
    const name = args.name || args.customer_name || args.sender_name || body.push_name || 'Penonton Piye Toh Kih';
    const phone = args.phone || args.number || body.number || body.sender || body.from || '';
    const email = args.email || (phone ? `${String(phone).replace(/[^0-9]/g, '')}@whatsapp.user` : 'user@whatsapp.user');
    const cityLocation = args.city || args.kota || args.cityLocation || 'Nasional';

    if (!phone) {
      return NextResponse.json(
        {
          status: 'error',
          success: false,
          error: 'Nomor telepon pengirim tidak terdeteksi dari sesi chat.',
        },
        { status: 400 }
      );
    }

    const db = getDb();
    const validityText = db.settings.voucherValidDatesText || '19 - 20 November 2026 (Penayangan Perdana)';
    
    // Check if phone already registered
    const cleanPhone = String(phone).replace(/[^0-9]/g, '');
    const existing = db.leads.find(l => l.phone.replace(/[^0-9]/g, '').endsWith(cleanPhone.slice(-9)));

    let serialNumber = '';
    let voucherUrl = '';
    const rawOrigin = req.nextUrl.origin || 'https://piyetokihfilm.com';
    const origin = (rawOrigin.includes('localhost') || rawOrigin.includes('127.0.0.1') || rawOrigin.includes('0.0.0.0'))
      ? 'https://piyetokihfilm.com'
      : rawOrigin;

    if (existing) {
      serialNumber = existing.serialNumber;
      voucherUrl = `${origin}/voucher/${serialNumber}`;
    } else {
      serialNumber = generateVoucherSerial();
      voucherUrl = `${origin}/voucher/${serialNumber}`;
      
      const newLead: LeadRecord = {
        id: `lead-wa-${Date.now()}`,
        serialNumber,
        name: String(name),
        phone: String(phone),
        email: String(email),
        source: 'whatsapp',
        claimedAt: new Date().toISOString(),
        pdfUrl: voucherUrl,
        whatsappStatus: 'sent',
        emailStatus: 'pending',
        cityLocation: String(cityLocation),
      };

      // If user provided a real email during chat, send email confirmation
      if (email && !email.endsWith('@whatsapp.user') && email.includes('@')) {
        try {
          const emRes = await sendVoucherEmail({
            name: String(name),
            email: String(email),
            serialNumber,
            city: String(cityLocation),
            voucherUrl,
            validDatesText: validityText,
          });
          newLead.emailStatus = emRes.success ? 'sent' : 'failed';
        } catch (e) {
          console.error('[Wahnotif Email Warning]:', e);
          newLead.emailStatus = 'failed';
        }
      }

      db.leads.unshift(newLead);
      saveDb(db);
    }

    // Response tailored for Wahnotif Custom AI Tool execution and standard webhooks
    return NextResponse.json({
      status: 'success',
      success: true,
      action: 'voucher_generated',
      name,
      city: cityLocation,
      serialNumber,
      voucherUrl,
      validDates: validityText,
      replyMessage: `🎬 *CODE VERIFIKASI RESMI AKTIF!* 🎬\n\nNama: *${name}*\nKota Roadshow: *${cityLocation}*\nCode Verifikasi: *${serialNumber}*\n\nBuka & simpan / download PDF tiket kamu di sini:\n${voucherUrl}\n\n⚠️ *KETENTUAN PENUKARAN VOUCHER FISIK:*\nCode ini BUKAN bukti pembayaran tiket. Penukaran voucher fisik resmi penayangan bioskop dilakukan pada saat Roadshow & Meet and Greet di kotamu.\n📍 Lokasi Penukaran: Kunjungi booth resmi di samping venue/panggung Meet and Greet Kota ${cityLocation}! Sampai jumpa lur! 🍿`,
      instructions_for_ai: `Sampaikan ucapan selamat kepada ${name}. Infokan bahwa Code Verifikasi resmi film Piye Toh Kih untuk Kota ${cityLocation} sudah aktif dengan Code ${serialNumber}. Berikan link tiket ${voucherUrl}. Sampaikan dengan ramah bahwa code ini bukan bukti pembayaran tiket, penukaran voucher fisik resmi dilakukan saat Roadshow & Meet and Greet Kota ${cityLocation} dengan mengunjungi booth resmi di samping venue/panggung Meet and Greet.`,
    });
  } catch (err: any) {
    console.error('[Wahnotif Webhook Error]:', err);
    return NextResponse.json(
      { status: 'error', success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
