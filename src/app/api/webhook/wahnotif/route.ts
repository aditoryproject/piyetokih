import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, generateVoucherSerial, LeadRecord, BogoReminderRecord } from '@/lib/db';
import { sendVoucherEmail } from '@/lib/email';
import { CITIES_DATA, isCityRoadshowExpired } from '@/lib/cities';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

// Handle CORS Preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Handle GET requests (Wahnotif "Tarik Cepat Otomatis dari Link Webhook" & Tool Definition)
export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin || 'https://piyetokihfilm.com';
  const effectiveOrigin = (origin.includes('localhost') || origin.includes('127.0.0.1'))
    ? 'https://piyetokihfilm.com'
    : origin;

  const toolDefinition = {
    status: 'active',
    success: true,
    message: 'Webhook API Piye Toh Kih siap digunakan untuk Wahnotif AI Assistant (Humor, Friendly, Fast-Track Ticket Links).',
    name: 'generate_voucher_presale',
    tool_name: 'generate_voucher_presale',
    title: 'Registrasi Tiket, Promo BOGO & Link Tiket Langsung Piye Toh Kih',
    description: 'Mendaftarkan penonton ke sistem database resmi dan memberikan link langsung pembelian tiket bioskop: (1) Untuk kota roadshow yang tanggalnya sudah terlewat (misal Semarang setelah 22 Oktober 2026), sistem otomatis menolak voucher mall, memberikan link beli tiket bioskop langsung, dan mengalihkan penonton ke Pengingat Prioritas Promo Buy 1 Get 1 (BOGO) Bioskop 19 November. (2) Untuk kota non-roadshow (Bandung, Medan, dll), sistem memberikan link langsung tiket dan mendaftarkan ke Pengingat Promo Buy 1 Get 1. (3) Untuk 17 kota roadshow aktif yang tanggalnya belum lewat, sistem menerbitkan Kode Booking penukaran voucher fisik di booth mall.',
    url: `${effectiveOrigin}/api/webhook/wahnotif`,
    webhook_url: `${effectiveOrigin}/api/webhook/wahnotif`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Nama lengkap calon penonton',
        },
        phone: {
          type: 'string',
          description: 'Nomor WhatsApp calon penonton (format: 08xx atau 62xx)',
        },
        city: {
          type: 'string',
          description: 'Nama kota pilihan penonton (contoh: Bandung, Semarang, Yogyakarta, Solo, Surabaya, Malang, Kudus, Jakarta, Medan, dll.)',
        },
        email: {
          type: 'string',
          description: 'Alamat email aktif calon penonton (opsional)',
        },
        type: {
          type: 'string',
          description: "Jenis pendaftaran: 'bogo' untuk Pengingat Promo Buy 1 Get 1 Bioskop 19 Nov (otomatis jika kota expired/non-roadshow), atau 'roadshow' untuk voucher fisik booth roadshow 17 kota yang masih aktif.",
        },
      },
      required: ['phone', 'city'],
    },
    tools: [
      {
        name: 'generate_voucher_presale',
        description: 'Mendaftarkan calon penonton untuk Pengingat Promo Buy 1 Get 1 (Expired/Non-Roadshow) atau Voucher Fisik Roadshow (17 Kota Aktif) serta mengirim link tiket langsung.',
        url: `${effectiveOrigin}/api/webhook/wahnotif`,
        method: 'POST',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Nama lengkap calon penonton' },
            phone: { type: 'string', description: 'Nomor WhatsApp calon penonton' },
            city: { type: 'string', description: 'Nama kota penonton' },
            email: { type: 'string', description: 'Alamat email aktif (opsional)' },
            type: { type: 'string', description: "Jenis: 'bogo' (reminder BOGO 19 Nov) atau 'roadshow' (voucher fisik mall 17 kota aktif)" },
          },
          required: ['phone', 'city'],
        },
      },
    ],
  };

  return NextResponse.json(toolDefinition, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[Wahnotif Inbound Payload Received]:', JSON.stringify(body));

    // Support Wahnotif Custom AI Tool parameters (arguments/parameters or flat body)
    const args = body.arguments || body.parameters || body;

    // Extract lead attributes
    const name = args.name || args.customer_name || args.sender_name || body.push_name || 'Bolo Piye Toh Kih';
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
        { status: 400, headers: corsHeaders }
      );
    }

    const cleanPhone = String(phone).replace(/[^0-9]/g, '');
    const normalizedCity = String(cityLocation).toLowerCase().trim();

    // 1. Find if the city is one of the 17 Roadshow Cities
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
      args.reminder === true ||
      args.intent === 'bogo' ||
      args.intent === 'reminder';

    const db = getDb();

    // Direct Ticket Links from db.settings
    const xxiLink = db.settings.bogoCinemaLinks?.xxi || 'https://m.21cineplex.com/id/movies/16PTKH';
    const tixidLink = db.settings.bogoCinemaLinks?.tixid || 'https://rb.gy/l28pzj';
    const cgvLink = db.settings.bogoCinemaLinks?.cgv || 'https://www.cgv.id';
    const cinepolisLink = db.settings.bogoCinemaLinks?.cinepolis || 'https://cinepolis.co.id';
    const defaultTicketLink = db.settings.bogoDefaultTicketLink || xxiLink;

    const rawOrigin = req.nextUrl?.origin || 'https://piyetokihfilm.com';
    const siteOrigin = (rawOrigin.includes('localhost') || rawOrigin.includes('127.0.0.1') || rawOrigin.includes('0.0.0.0'))
      ? 'https://piyetokihfilm.com'
      : rawOrigin;

    // 2. Check if the roadshow city is EXPIRED (date has passed or manually marked expired)
    const isCityExpired =
      Boolean(roadshowCity) &&
      (
        args.is_expired === true ||
        args.expired === true ||
        args.past === true ||
        args.sudah_lewat === true ||
        (db.settings.expiredRoadshowCities || []).some(
          (c: string) => c.toLowerCase().trim() === roadshowCity!.name.toLowerCase().trim()
        ) ||
        isCityRoadshowExpired(roadshowCity!.dateStr)
      );

    // A city is a roadshow booking ONLY if it's in CITIES_DATA AND not explicitly a BOGO reminder AND NOT EXPIRED
    const isRoadshowBooking = Boolean(roadshowCity) && !isExplicitBogo && !isCityExpired;

    // =========================================================================
    // SCENARIO 1: NON-ROADSHOW CITY (BANDUNG, MEDAN, BALI, DLL) ATAU KOTA ROADSHOW TERLEWAT (SEMARANG EXPIRED) / REMINDER BOGO
    // =========================================================================
    if (!isRoadshowBooking) {
      const targetCityName = roadshowCity ? roadshowCity.name : String(cityLocation);

      // Check if phone already registered in bogoReminders
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

      // KASUS 1A: KOTA ROADSHOW YANG TANGGALNYA SUDAH TERLEWAT (EXPIRED, MISAL SEMARANG SETELAH 22 OKT)
      if (isCityExpired && roadshowCity) {
        return NextResponse.json(
          {
            status: 'success',
            success: true,
            action: 'bogo_reminder_registered',
            category: 'roadshow_expired_redirect_bogo',
            isRoadshowExpired: true,
            name,
            city: roadshowCity.name,
            roadshowDate: roadshowCity.dateStr,
            phone,
            ticketLinks: {
              xxi: xxiLink,
              tixid: tixidLink,
              cgv: cgvLink,
              cinepolis: cinepolisLink,
              default: defaultTicketLink,
              website: siteOrigin,
            },
            replyMessage: `🎬 *ROADSHOW ${roadshowCity.name.toUpperCase()} SUDAH SELESAI — NOMOR KAMU DIALIHKAN KE PENGINGAT BUY 1 GET 1!* 🎬\n\nHalo *${name}*, bolo asikku! Piye kabare? 😄\nMangan getuk nang Pasar Johar, roadshow Semarang kemarin wes rampung lur! Hehehe...\nKarena tanggalnya kemarin sudah lewat, penukaran kode booking ke voucher fisik di booth mall sudah tidak bisa lagi ya.\n\n🍿 *TAPI OJO CILIK ATI LUR! MUKIDI WAE SING BEDA ALAM WANI BERJUANG, MOSOK SAMPEAN PUTUS ASA?* 😂\nSampean tetap bisa nonton film PIYE TO KIH? serentak mulai *19 NOVEMBER 2026* di seluruh bioskop ${roadshowCity.name} (XXI, Cinépolis, dll) dengan *PROMO BUY 1 GET 1 (BOGO)*!\n\n🎟️ *LINK LANGSUNG BELI TIKET & PROMO (TINGGAL KLIK, GAK REPOT NYARI LUR):*\n• Cinema XXI (M-TIX): ${xxiLink}\n• TIX ID: ${tixidLink}\n• Cinépolis: ${cinepolisLink}\n• Jadwal & Info Lengkap: ${siteOrigin}\n\n📌 *Status:* Nomor kamu (${phone}) sudah *RESMI DIAMANKAN di Pengingat Prioritas BOGO*. Nanti begitu kuota presale dibuka, kami langsung japri via WA! Ajak ayang atau kawan tongkrongan ya lur! ✨`,
            instructions_for_ai: `Jawab dengan gaya super ramah, akrab, humoris khas kawan tongkrongan ('nggak kaku teing'). Jelaskan dengan santai bahwa sesi roadshow dan booth voucher fisik di Kota ${roadshowCity.name} (${roadshowCity.dateStr}) SUDAH SELESAI. JANGAN memberikan kode booking atau booth penukaran di mall lagi! Tegaskan nomornya (${phone}) sudah RESMI DIAMANKAN untuk Pengingat Prioritas Promo BUY 1 GET 1 bioskop serentak 19 NOVEMBER 2026. LANGSUNG BERIKAN LINK PEMBELIAN TIKET INI: Cinema XXI: ${xxiLink} | TIX ID: ${tixidLink} agar penonton tinggal klik dan gak usah repot nyari manual di aplikasi!`,
          },
          { status: 200, headers: corsHeaders }
        );
      }

      // KASUS 1B: KOTA DI LUAR 17 ROADSHOW (BANDUNG, MEDAN, JAKARTA, DLL)
      return NextResponse.json(
        {
          status: 'success',
          success: true,
          action: 'bogo_reminder_registered',
          category: 'pengingat_promo_bogo',
          name,
          city: cityLocation,
          phone,
          ticketLinks: {
            xxi: xxiLink,
            tixid: tixidLink,
            cgv: cgvLink,
            cinepolis: cinepolisLink,
            default: defaultTicketLink,
            website: siteOrigin,
          },
          replyMessage: `🎬 *PENDAFTARAN PENGINGAT BUY 1 GET 1 BERHASIL!* 🎬\n\nHalo *${name}*, bolo asik dari Kota ${cityLocation}! Piye kabare lur? 😄\nTuku klopo menyang Pasar Minggu, nonton Mukidi ben atine gak gampang ngelu! ✨\n\nUntuk roadshow temu cast saat ini memang lagi keliling 17 kota Jateng-Jatim lur. TAPI TENANG! Tanggal *19 NOVEMBER 2026* film PIYE TO KIH? *TAYANG SERENTAK* di bioskop kesayangan kotamu (XXI, CGV, Cinépolis)!\n\n🎟️ *LINK LANGSUNG BELI TIKET & PROMO (TINGGAL KLIK LUR):*\nBiar gak usah repot nyari-nyari di aplikasi bioskop, ini Mas Kidi kasih link langsungnya:\n• Cinema XXI (M-TIX): ${xxiLink}\n• TIX ID: ${tixidLink}\n• CGV Cinemas: ${cgvLink}\n• Cinépolis: ${cinepolisLink}\n• Info Lengkap: ${siteOrigin}\n\n📌 *Status:* Nomor kamu (${phone}) sudah *RESMI TERDAFTAR dalam Pengingat Prioritas Promo BUY 1 GET 1 (BOGO)*. Nanti pas presale dibuka, kami langsung kirimkan notifikasi WA lur! Sampai ketemu di bioskop! 🍿🎉`,
          instructions_for_ai: `Jawab dengan gaya akrab, humoris, guyub, dan friendly. Sampaikan bahwa nomor ${phone} milik ${name} sudah TERDAFTAR RESMI di Pengingat Prioritas Promo BUY 1 GET 1 untuk penayangan bioskop di Kota ${cityLocation} mulai 19 NOVEMBER 2026. JANGAN sebutkan ada booth voucher mall karena di ${cityLocation} tidak ada roadshow. LANGSUNG BERIKAN LINK PEMBELIAN TIKET RESMI: Cinema XXI: ${xxiLink} | TIX ID: ${tixidLink} | CGV: ${cgvLink} | Cinépolis: ${cinepolisLink} agar penonton bisa langsung klik!`,
        },
        { status: 200, headers: corsHeaders }
      );
    }

    // =========================================================================
    // SCENARIO 2: 17 KOTA ROADSHOW AKTIF (SEMARANG, JOGJA, SOLO, KUDUS, SURABAYA, DLL)
    // =========================================================================
    const matchedCity = roadshowCity!;
    const validityText = db.settings.voucherValidDatesText || '19 - 20 November 2026 (Penayangan Perdana)';

    // Check if phone already registered in leads
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

    const boothVenue = matchedCity.boothInfo?.venue || `Mall Roadshow Resmi ${matchedCity.name}`;
    const boothFloor = matchedCity.boothInfo?.floor || 'Ground Floor';
    const boothTime = matchedCity.boothInfo?.timeStr || '16.00 – 18.00 WIB';

    return NextResponse.json(
      {
        status: 'success',
        success: true,
        action: 'roadshow_voucher_generated',
        category: 'voucher_roadshow',
        name,
        city: matchedCity.name,
        serialNumber,
        voucherUrl,
        boothVenue,
        boothFloor,
        boothTime,
        dateStr: matchedCity.dateStr,
        ticketLinks: {
          xxi: xxiLink,
          tixid: tixidLink,
          cgv: cgvLink,
          cinepolis: cinepolisLink,
          default: defaultTicketLink,
          website: siteOrigin,
        },
        replyMessage: `🎬 *KODE BOOKING ROADSHOW RESMI AKTIF!* 🎬\n\nHalo *${name}*, bolo nonton Kota ${matchedCity.name}! Mantap tenan lur! 😄\nMangan getuk nang kutha Salatiga, nonton bareng Mukidi atine lego! 🍿✨\n\n🎟️ *KODE BOOKING KAMU:* ${serialNumber}\n📥 *Buka & Download PDF Tiket:* ${voucherUrl}\n\n📍 *LOKASI PENUKARAN VOUCHER FISIK RP10.000:*\n• Tempat: *${boothVenue}*\n• Lokasi: *${boothFloor}*\n• Waktu: *${boothTime}* (${matchedCity.dateStr})\n\n🎟️ *LINK LANGSUNG BELI TIKET BIOSKOP REGULER / NONTON DULUAN:*\n• Cinema XXI (M-TIX): ${xxiLink}\n• TIX ID: ${tixidLink}\n• Info Lengkap: ${siteOrigin}\n\n⚠️ Tunjukkan kode booking ini ke petugas booth resmi pas hari H roadshow ya lur. Sampai jumpa bareng Mukidi & Sukma! 🍿`,
        instructions_for_ai: `Sampaikan ucapan selamat dengan gaya akrab, santai, dan ceria. Infokan Kode Booking resmi Kota ${matchedCity.name} adalah ${serialNumber} dan link tiket ${voucherUrl}. Infokan penukaran voucher fisik resmi Rp10.000 di booth ${boothVenue} (${boothFloor}) pada ${matchedCity.dateStr} jam ${boothTime}. Jika penonton menanyakan link tiket bioskop reguler/nonton duluan, BERIKAN LANGSUNG: Cinema XXI: ${xxiLink} | TIX ID: ${tixidLink}!`,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (err: any) {
    console.error('[Wahnotif Webhook Error]:', err);
    return NextResponse.json(
      { status: 'error', success: false, error: err.message || 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
