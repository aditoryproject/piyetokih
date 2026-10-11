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
    const validityText = db.settings.voucherValidDatesText || '19 - 22 November 2026 (Penayangan Perdana)';
    
    // Check if phone already registered
    const cleanPhone = String(phone).replace(/[^0-9]/g, '');
    const existing = db.leads.find(l => l.phone.replace(/[^0-9]/g, '').endsWith(cleanPhone.slice(-9)));

    let serialNumber = '';
    let voucherUrl = '';
    const origin = req.nextUrl.origin || 'https://piyetokihfilm.com';

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
      replyMessage: `🎬 *E-VOUCHER NONTON RESMI AKTIF!* 🎬\n\nNama: *${name}*\nKota: *${cityLocation}*\nNomor Seri: *${serialNumber}*\n\nBuka & simpan voucher digital resmi kamu di sini:\n${voucherUrl}\n\n⚠️ *MASA BERLAKU DI BIOSKOP:*\n*${validityText}*\n\n📌 *PETUNJUK PENUKARAN:*\nVoucher dapat ditukarkan di bioskop kesayangan Anda saat periode penayangan di atas lur. Cukup tunjukkan barcode di link HP tersebut ke kasir loket bioskop. Tanpa perlu cetak kertas! Sampai jumpa di bioskop! 🍿`,
      instructions_for_ai: `Sampaikan ucapan selamat kepada ${name}. Infokan bahwa voucher resmi nonton film Piye Toh Kih untuk Kota ${cityLocation} sudah aktif dengan Kode Seri ${serialNumber}. Berikan link tiket ${voucherUrl}. Sampaikan dengan ramah bahwa voucher dapat ditukarkan di bioskop kesayangan Anda saat periode penayangan (${validityText}) dengan cukup menunjukkan barcode tiket ke kasir bioskop. Jangan menggunakan embel-embel kata gratis yang berlebihan.`,
    });
  } catch (err: any) {
    console.error('[Wahnotif Webhook Error]:', err);
    return NextResponse.json(
      { status: 'error', success: false, error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
