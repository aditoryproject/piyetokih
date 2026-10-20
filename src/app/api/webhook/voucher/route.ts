import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, generateVoucherSerial, LeadRecord, BogoReminderRecord } from '@/lib/db';
import { sendVoucherEmail } from '@/lib/email';
import { CITIES_DATA, isCityRoadshowExpired } from '@/lib/cities';
import { FAST_TRACK_TICKET_LINKS, MASTER_ROADSHOW_STOPS, MAS_KIDI_PANTUN } from '@/lib/bot-knowledge';
import { WAHNOTIF_TOOL_VOUCHER_SCHEMA } from '@/lib/wahnotif';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin || 'https://piyetokihfilm.com';
  const effectiveOrigin = (origin.includes('localhost') || origin.includes('127.0.0.1'))
    ? 'https://piyetokihfilm.com'
    : origin;

  return NextResponse.json({
    status: 'active',
    success: true,
    webhook_name: 'Webhook Klaim Voucher Fisik Roadshow & Registrasi Leads / BOGO Reminder',
    endpoint: `${effectiveOrigin}/api/webhook/voucher`,
    description: 'Menerbitkan Kode Booking voucher fisik potongan Rp10.000 untuk 17 kota roadshow aktif, atau mendaftarkan calon penonton ke Pengingat Prioritas Promo Buy 1 Get 1 (BOGO) Bioskop 19 November jika kota roadshow sudah expired atau berada di luar 17 kota roadshow.',
    tool_schema: WAHNOTIF_TOOL_VOUCHER_SCHEMA
  }, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const args = body.arguments || body.parameters || body;

    const name = args.name || args.customer_name || args.sender_name || body.push_name || 'Bolo Piye To Kih';
    const phone = args.phone || args.number || body.number || body.sender || body.from || '';
    const email = args.email || (phone ? `${String(phone).replace(/[^0-9]/g, '')}@whatsapp.user` : 'user@whatsapp.user');
    const cityLocation = args.city || args.kota || args.cityLocation || 'Nasional';

    if (!phone) {
      return NextResponse.json(
        { status: 'error', success: false, error: 'Nomor telepon tidak terdeteksi.' },
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanPhone = String(phone).replace(/[^0-9]/g, '');
    const normalizedCity = String(cityLocation).toLowerCase().trim();

    // Find roadshow city
    const roadshowCity = CITIES_DATA.find(c => {
      const cName = c.name.toLowerCase();
      const cSlug = c.slug.toLowerCase();
      return (
        normalizedCity === cName ||
        normalizedCity === cSlug ||
        normalizedCity.includes(cName) ||
        cName.includes(normalizedCity)
      );
    });

    const isExplicitBogo =
      args.type === 'bogo' ||
      args.type === 'reminder' ||
      args.is_bogo === true ||
      args.reminder === true;

    const db = getDb();
    const xxiLink = db.settings.bogoCinemaLinks?.xxi || FAST_TRACK_TICKET_LINKS.xxi;
    const tixidLink = db.settings.bogoCinemaLinks?.tixid || FAST_TRACK_TICKET_LINKS.tixid;
    const cgvLink = db.settings.bogoCinemaLinks?.cgv || FAST_TRACK_TICKET_LINKS.cgv;
    const cinepolisLink = db.settings.bogoCinemaLinks?.cinepolis || FAST_TRACK_TICKET_LINKS.cinepolis;
    const defaultTicketLink = db.settings.bogoDefaultTicketLink || xxiLink;

    const rawOrigin = req.nextUrl?.origin || 'https://piyetokihfilm.com';
    const siteOrigin = (rawOrigin.includes('localhost') || rawOrigin.includes('127.0.0.1'))
      ? 'https://piyetokihfilm.com'
      : rawOrigin;

    const isCityExpired =
      Boolean(roadshowCity) &&
      (
        args.is_expired === true ||
        (db.settings.expiredRoadshowCities || []).some(
          (c: string) => c.toLowerCase().trim() === roadshowCity!.name.toLowerCase().trim()
        ) ||
        isCityRoadshowExpired(roadshowCity!.dateStr, {
          cityName: roadshowCity!.name,
          manualExpiredCities: db.settings.expiredRoadshowCities || []
        })
      );

    const isRoadshowBooking = Boolean(roadshowCity) && !isExplicitBogo && !isCityExpired;
    const randomPantun = MAS_KIDI_PANTUN[Math.floor(Math.random() * MAS_KIDI_PANTUN.length)];

    // CASE 1: EXPIRED ROADSHOW CITY OR NON-ROADSHOW CITY -> BOGO REMINDER
    if (!isRoadshowBooking) {
      const targetCityName = roadshowCity ? roadshowCity.name : String(cityLocation);

      const existingReminder = db.bogoReminders.find(r =>
        r.phone.replace(/[^0-9]/g, '').endsWith(cleanPhone.slice(-9))
      );

      if (!existingReminder) {
        const newReminder: BogoReminderRecord = {
          id: `bogo-wa-${Date.now()}`,
          name: String(name),
          phone: String(phone),
          email: String(email),
          city: targetCityName,
          registeredAt: new Date().toISOString(),
          reminderStatus: 'pending',
          whatsappSentAt: new Date().toISOString(),
        };
        db.bogoReminders.unshift(newReminder);
        saveDb(db);
      }

      if (isCityExpired && roadshowCity) {
        return NextResponse.json({
          status: 'success',
          success: true,
          action: 'bogo_reminder_registered',
          isRoadshowExpired: true,
          name,
          city: roadshowCity.name,
          roadshowDate: roadshowCity.dateStr,
          phone,
          ticketLinks: { xxi: xxiLink, tixid: tixidLink, cgv: cgvLink, cinepolis: cinepolisLink, website: siteOrigin },
          replyMessage: `🎬 *ROADSHOW ${roadshowCity.name.toUpperCase()} SUDAH SELESAI — NOMOR KAMU DIALIHKAN KE PENGINGAT BUY 1 GET 1!* 🎬\n\nHalo *${name}*, bolo asikku! Piye kabare? 😄\n${randomPantun}\n\nKarena tanggal roadshow ${roadshowCity.name} kemarin (${roadshowCity.dateStr}) sudah rampung terlaksana, penukaran voucher fisik di booth mall sudah selesai ya lur.\n\n🍿 *TAPI OJO CILIK ATI! MUKIDI WAE SING BEDA ALAM WANI BERJUANG, MOSOK SAMPEAN PUTUS ASA?* 😂\nSampean tetap bisa nonton film PIYE TO KIH? serentak mulai *19 NOVEMBER 2026* di seluruh bioskop ${roadshowCity.name} dengan *PROMO BUY 1 GET 1 (BOGO)*!\n\n🎟️ *LINK LANGSUNG BELI TIKET & PROMO (TINGGAL KLIK LUR):*\n• Cinema XXI (M-TIX): ${xxiLink}\n• TIX ID: ${tixidLink}\n• CGV Cinemas: ${cgvLink}\n• Cinépolis: ${cinepolisLink}\n• Info Lengkap: ${siteOrigin}\n\n📌 *Status:* Nomor kamu (${phone}) sudah *RESMI DIAMANKAN di Pengingat Prioritas BOGO*. Nanti begitu kuota presale dibuka, kami langsung japri via WA! Ajak ayang atau kawan tongkrongan ya lur! ✨`
        }, { status: 200, headers: corsHeaders });
      }

      // Non-roadshow city
      return NextResponse.json({
        status: 'success',
        success: true,
        action: 'bogo_reminder_registered',
        name,
        city: cityLocation,
        phone,
        ticketLinks: { xxi: xxiLink, tixid: tixidLink, cgv: cgvLink, cinepolis: cinepolisLink, website: siteOrigin },
        replyMessage: `🎬 *PENDAFTARAN PENGINGAT BUY 1 GET 1 BERHASIL!* 🎬\n\nHalo *${name}*, bolo asik dari Kota ${cityLocation}! Piye kabare lur? 😄\n${randomPantun}\n\nUntuk roadshow temu cast saat ini memang lagi keliling 17 kota Jateng-Jatim lur. TAPI TENANG! Tanggal *19 NOVEMBER 2026* film PIYE TO KIH? *TAYANG SERENTAK* di bioskop kesayangan kotamu (XXI, CGV, Cinépolis)!\n\n🎟️ *LINK LANGSUNG BELI TIKET & PROMO (TINGGAL KLIK LUR):*\n• Cinema XXI (M-TIX): ${xxiLink}\n• TIX ID: ${tixidLink}\n• CGV Cinemas: ${cgvLink}\n• Cinépolis: ${cinepolisLink}\n• Info Lengkap: ${siteOrigin}\n\n📌 *Status:* Nomor kamu (${phone}) sudah *RESMI TERDAFTAR dalam Pengingat Prioritas Promo BUY 1 GET 1 (BOGO)*. Nanti pas presale dibuka, kami langsung kirimkan notifikasi WA lur! Sampai ketemu di bioskop! 🍿🎉`
      }, { status: 200, headers: corsHeaders });
    }

    // CASE 2: ACTIVE ROADSHOW CITY -> GENERATE VOUCHER CODE
    const matchedCity = roadshowCity!;
    const validityText = db.settings.voucherValidDatesText || '19 - 20 November 2026 (Penayangan Perdana)';

    const existingLead = db.leads.find(l =>
      l.phone.replace(/[^0-9]/g, '').endsWith(cleanPhone.slice(-9))
    );

    let serialNumber = '';
    let voucherUrl = '';

    if (existingLead) {
      serialNumber = existingLead.serialNumber;
      voucherUrl = `${siteOrigin}/voucher/${serialNumber}`;
    } else {
      serialNumber = generateVoucherSerial();
      voucherUrl = `${siteOrigin}/voucher/${serialNumber}`;

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
        cityLocation: String(matchedCity.name),
      };

      if (email && !email.endsWith('@whatsapp.user') && email.includes('@')) {
        try {
          const emRes = await sendVoucherEmail({
            name: String(name),
            email: String(email),
            serialNumber,
            city: String(matchedCity.name),
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

    // Stop details
    const stopDetails = MASTER_ROADSHOW_STOPS[matchedCity.slug] || {};
    const boothVenue = stopDetails.boothMall?.venue || matchedCity.boothInfo?.venue || `Mall Roadshow Resmi ${matchedCity.name}`;
    const boothFloor = stopDetails.boothMall?.floor || matchedCity.boothInfo?.floor || 'Ground Floor';
    const boothTime = stopDetails.boothMall?.time || matchedCity.boothInfo?.timeStr || '16.00 – 17.00 WIB';

    return NextResponse.json({
      status: 'success',
      success: true,
      action: 'roadshow_voucher_generated',
      name,
      city: matchedCity.name,
      serialNumber,
      voucherUrl,
      boothVenue,
      boothFloor,
      boothTime,
      dateStr: matchedCity.dateStr,
      ticketLinks: { xxi: xxiLink, tixid: tixidLink, cgv: cgvLink, cinepolis: cinepolisLink, website: siteOrigin },
      replyMessage: `🎬 *KODE BOOKING ROADSHOW RESMI AKTIF!* 🎬\n\nHalo *${name}*, bolo nonton Kota ${matchedCity.name}! Mantap tenan lur! 😄\n${randomPantun}\n\n🎟️ *KODE BOOKING KAMU:* ${serialNumber}\n📥 *Buka & Download PDF Tiket:* ${voucherUrl}\n\n📍 *LOKASI PENUKARAN VOUCHER FISIK RP10.000:*\n• Tempat: *${boothVenue}*\n• Lokasi: *${boothFloor}*\n• Waktu: *${boothTime}* (${matchedCity.dateStr})\n\n🎟️ *LINK LANGSUNG BELI TIKET BIOSKOP REGULER / NONTON DULUAN:*\n• Cinema XXI (M-TIX): ${xxiLink}\n• TIX ID: ${tixidLink}\n• Info Lengkap: ${siteOrigin}\n\n⚠️ Tunjukkan kode booking ini ke petugas booth resmi pas hari H roadshow ya lur. Sampai jumpa bareng Mukidi & Sukma! 🍿`
    }, { status: 200, headers: corsHeaders });

  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', success: false, error: err.message || 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
