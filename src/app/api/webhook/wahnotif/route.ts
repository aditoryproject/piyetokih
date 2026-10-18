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
    message: 'Webhook API Piye Toh Kih siap digunakan untuk Wahnotif AI Assistant.',
    name: 'generate_voucher_presale',
    tool_name: 'generate_voucher_presale',
    title: 'Registrasi Tiket & Pengingat Promo Piye Toh Kih',
    description: 'Mendaftarkan penonton ke sistem database resmi: (1) Untuk kota roadshow yang tanggalnya sudah terlewat (misal Semarang setelah 22 Oktober 2026), sistem otomatis menolak voucher mall dan mengalihkan penonton ke Pengingat Prioritas Promo Buy 1 Get 1 (BOGO) Bioskop 19 November. (2) Untuk kota non-roadshow (Bandung, Medan, dll), sistem mendaftarkan ke Pengingat Prioritas Promo Buy 1 Get 1 Bioskop 19 November (tanpa kode booth). (3) Untuk 17 kota roadshow aktif yang tanggalnya belum lewat, sistem menerbitkan Kode Booking penukaran voucher fisik di booth mall.',
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
        description: 'Mendaftarkan calon penonton untuk Pengingat Promo Buy 1 Get 1 (Expired/Non-Roadshow) atau Voucher Fisik Roadshow (17 Kota Aktif).',
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
            replyMessage: `🎬 *ROADSHOW ${roadshowCity.name.toUpperCase()} SUDAH SELESAI — NOMOR KAMU DIALIHKAN KE PENGINGAT BUY 1 GET 1!* 🎬\n\nHalo *${name}*,\nSesi roadshow dan penukaran voucher fisik di booth mall ${roadshowCity.name} (${roadshowCity.dateStr}) kemarin sudah selesai ya lur. Karena tanggalnya sudah terlewat, penukaran kode booking ke voucher fisik di booth mall sudah tidak bisa lagi.\n\n🍿 *TAPI JANGAN KHAWATIR! SAMPEAN TETAP BISA NONTON PROMO SPESIAL:*\n• Tanggal Tayang Serentak: *19 NOVEMBER 2026*\n• Lokasi: Seluruh bioskop di Kota ${roadshowCity.name} (XXI, CGV, Cinépolis, dll).\n• Status: *Nomor kamu (${phone}) sudah RESMI TERDAFTAR dalam Pengingat Prioritas Promo BUY 1 GET 1 (BOGO)* untuk penayangan perdana 19-20 November! 🎟️\n\n📌 Begitu penjualan tiket promo presale dibuka di aplikasi bioskop resmi (M-TIX / CGV / TIX ID), sistem WhatsApp kami akan langsung mengirimkan notifikasi pengingat prioritas ke nomor kamu! Sampai jumpa di bioskop lur! ✨`,
            instructions_for_ai: `Sampaikan ucapan terima kasih kepada ${name}. Jelaskan dengan ramah dan empati bahwa sesi roadshow dan penukaran voucher fisik di booth mall Kota ${roadshowCity.name} (${roadshowCity.dateStr}) SUDAH SELESAI / TERLEWAT. Oleh karena itu, penukaran voucher fisik di booth mall sudah tidak tersedia lagi.\n\nPERINGATAN KERAS UNTUK AI (JANGAN SALAH):\n1. JANGAN PERNAH memberikan link voucher atau kode booking penukaran tiket di mall!\n2. JANGAN sebutkan ada booth penukaran di mall lagi, karena acaranya sudah lewat!\n3. Tegaskan bahwa nomornya (${phone}) sudah RESMI DIAMANKAN untuk Pengingat Prioritas Promo BUY 1 GET 1 (BOGO) bioskop mulai penayangan serentak 19 NOVEMBER 2026.\n4. Tiket promo bisa dibeli lewat aplikasi bioskop resmi (M-TIX / CGV / TIX ID) saat penjualan tiket dibuka, dan sistem kami akan mengirimkan pengingat WhatsApp prioritas.`,
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
          replyMessage: `🎬 *PENDAFTARAN PENGINGAT BUY 1 GET 1 BERHASIL!* 🎬\n\nNama: *${name}*\nKota Bioskop: *${cityLocation}*\nNo. WhatsApp: *${phone}*\n\nStatus: *Terdaftar di Notifikasi Prioritas Promo Presale Buy 1 Get 1 (BOGO)* 🍿\n\n📌 *INFORMASI PENAYANGAN RESMI:*\n• Tanggal Tayang Serentak: *19 NOVEMBER 2026*\n• Lokasi: Seluruh bioskop XXI, CGV, Cinépolis, dan mitra bioskop resmi di Kota ${cityLocation}.\n\n⚠️ *PENTING DIBACA:*\n1. Di Kota *${cityLocation}* *TIDAK ADA event roadshow* dan *TIDAK ADA voucher fisik* yang harus ditukar di mall.\n2. Tiket promo Buy 1 Get 1 bisa dibeli langsung melalui aplikasi resmi bioskop (M-TIX / CGV / TIX ID) saat penjualan tiket dibuka.\n3. Sistem WhatsApp kami akan otomatis mengirimkan pesan pengingat ke nomor kamu begitu penjualan presale promo dibuka di kotamu! 🎟️`,
          instructions_for_ai: `Sampaikan ucapan terima kasih kepada ${name}. Konfirmasikan bahwa nomornya (${phone}) sudah RESMI TERDAFTAR dalam sistem Pengingat Prioritas Promo BUY 1 GET 1 untuk penayangan bioskop di Kota ${cityLocation} mulai 19 NOVEMBER 2026.\n\nPERINGATAN KERAS UNTUK AI (JANGAN SALAH):\n1. JANGAN memberikan link voucher atau kode booking penukaran tiket!\n2. JANGAN sebutkan ada booth penukaran voucher fisik di mall!\n3. JANGAN sebutkan ada acara roadshow atau meet & greet di Kota ${cityLocation}, karena di Kota ${cityLocation} TIDAK ADA acara roadshow.\n4. Jelaskan bahwa film tayang serentak mulai 19 NOVEMBER 2026 di bioskop kotanya (XXI/CGV/Cinépolis), dan sistem kami akan mengirimkan pesan pengingat via WhatsApp ke nomor ini saat tiket promo presale dibuka di aplikasi bioskop.`,
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
    const rawOrigin = req.nextUrl.origin || 'https://piyetokihfilm.com';
    const origin = (rawOrigin.includes('localhost') || rawOrigin.includes('127.0.0.1') || rawOrigin.includes('0.0.0.0'))
      ? 'https://piyetokihfilm.com'
      : rawOrigin;

    if (existingLead) {
      serialNumber = existingLead.serialNumber;
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
        replyMessage: `🎬 *KODE BOOKING ROADSHOW RESMI AKTIF!* 🎬\n\nNama: *${name}*\nKota Roadshow: *${matchedCity.name}*\nTanggal Roadshow: *${matchedCity.dateStr}*\nKode Booking: *${serialNumber}*\n\nBuka & simpan link tiket kamu di sini:\n${voucherUrl}\n\n📍 *LOKASI PENUKARAN VOUCHER FISIK RP10.000:*\n• Tempat: *${boothVenue}*\n• Lokasi: *${boothFloor}*\n• Waktu: *${boothTime}*\n\n⚠️ *KETENTUAN:* Kode ini adalah tanda bukti untuk mengambil voucher fisik resmi di booth roadshow mall. Sampai jumpa lur! 🍿`,
        instructions_for_ai: `Sampaikan ucapan selamat kepada ${name}. Infokan bahwa Kode Booking resmi untuk Roadshow Kota ${matchedCity.name} sudah aktif dengan Kode ${serialNumber}. Berikan link tiket ${voucherUrl}. Sampaikan dengan ramah bahwa penukaran voucher fisik resmi Rp10.000 dilakukan di booth resmi ${boothVenue} (${boothFloor}) pada tanggal ${matchedCity.dateStr} jam ${boothTime}.`,
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
