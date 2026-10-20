import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, generateVoucherSerial, LeadRecord, BogoReminderRecord } from '@/lib/db';
import { sendVoucherEmail } from '@/lib/email';
import { CITIES_DATA, isCityRoadshowExpired } from '@/lib/cities';
import {
  MASTER_ROADSHOW_STOPS,
  MASTER_MOVIE_FACTS,
  FAST_TRACK_TICKET_LINKS,
  MAS_KIDI_PANTUN,
  MAS_KIDI_JOKES
} from '@/lib/bot-knowledge';
import {
  WAHNOTIF_TOOL_ROADSHOW_SCHEMA,
  WAHNOTIF_TOOL_TICKETS_SCHEMA,
  WAHNOTIF_TOOL_MOVIE_SCHEMA,
  WAHNOTIF_TOOL_VOUCHER_SCHEMA,
  WAHNOTIF_ALL_TOOLS
} from '@/lib/wahnotif';

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
    message: 'Master Webhook API Piye Toh Kih siap digunakan untuk Wahnotif AI Assistant (Multi-Tools: Jadwal Roadshow, Link Tiket Presale/BOGO, Info Film/Cast/OST, Klaim Voucher).',
    name: 'piye_to_kih_master_assistant',
    title: 'Master AI Webhook Piye Toh Kih (Jadwal, Cast, Tiket, Voucher & Persona)',
    description: 'Master webhook terintegrasi yang menyediakan data lengkap jadwal roadshow 17 kota, roster cast pemain, link langsung beli tiket bioskop (XXI, TIX ID, CGV, Cinepolis), promo Buy 1 Get 1, fakta resmi film, serta penerbitan voucher fisik & pengingat prioritas.',
    url: `${effectiveOrigin}/api/webhook/wahnotif`,
    webhook_url: `${effectiveOrigin}/api/webhook/wahnotif`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Top-level schema compatible with single-tool or multi-tool Wahnotif parsers
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          description: "Aksi atau tool yang dipanggil: 'get_roadshow_schedule', 'get_ticket_links', 'get_movie_info', atau 'claim_war_voucher'",
        },
        city: {
          type: 'string',
          description: 'Nama kota penonton (contoh: Semarang, Yogyakarta, Solo, Surabaya, Malang, Bandung, Jakarta, dll.)',
        },
        name: {
          type: 'string',
          description: 'Nama lengkap calon penonton (untuk klaim voucher / pendaftaran reminder)',
        },
        phone: {
          type: 'string',
          description: 'Nomor WhatsApp calon penonton (format: 08xx atau 62xx)',
        },
        email: {
          type: 'string',
          description: 'Alamat email aktif calon penonton (opsional)',
        },
        topic: {
          type: 'string',
          description: "Topik info film jika action='get_movie_info': 'synopsis', 'cast', 'soundtrack', 'cinemas', atau 'all'",
        },
        type: {
          type: 'string',
          description: "Jenis pendaftaran voucher: 'bogo' untuk Pengingat Promo Buy 1 Get 1, atau 'roadshow' untuk voucher fisik booth mall 17 kota aktif.",
        },
      },
    },
    // Multi-Tools definition array for Wahnotif Custom AI Tools
    tools: [
      {
        name: 'get_roadshow_schedule',
        description: 'Mengambil jadwal rundown lengkap per kota, jam acara (sekolah, kampus, radio, mall, bioskop), lokasi penukaran voucher fisik, dan roster cast pemain yang hadir.',
        url: `${effectiveOrigin}/api/webhook/roadshow`,
        method: 'POST',
        parameters: WAHNOTIF_TOOL_ROADSHOW_SCHEMA.parameters
      },
      {
        name: 'get_ticket_links',
        description: 'Mengambil link langsung pembelian tiket resmi bioskop (Cinema XXI/M-TIX, TIX ID, CGV, Cinepolis) serta status presale dan promo Buy 1 Get 1 (BOGO) agar calon penonton tidak perlu mencari manual di aplikasi.',
        url: `${effectiveOrigin}/api/webhook/tickets`,
        method: 'POST',
        parameters: WAHNOTIF_TOOL_TICKETS_SCHEMA.parameters
      },
      {
        name: 'get_movie_info',
        description: 'Mengambil fakta resmi film PIYE TO KIH?: sinopsis resmi, arti judul, daftar cast pemain & perannya, 4 OST ciptaan Lek Dahlan beserta link YouTube, tanggal rilis serentak 19 Nov 2026, dan daftar 25 bioskop mitra.',
        url: `${effectiveOrigin}/api/webhook/movie-info`,
        method: 'POST',
        parameters: WAHNOTIF_TOOL_MOVIE_SCHEMA.parameters
      },
      {
        name: 'claim_war_voucher',
        description: 'Mendaftarkan calon penonton untuk Pengingat Promo Buy 1 Get 1 (Expired/Non-Roadshow) atau Voucher Fisik Roadshow (17 Kota Aktif) serta mengirim link tiket langsung.',
        url: `${effectiveOrigin}/api/webhook/voucher`,
        method: 'POST',
        parameters: WAHNOTIF_TOOL_VOUCHER_SCHEMA.parameters
      }
    ],
    endpoints: {
      master_all_in_one: `${effectiveOrigin}/api/webhook/wahnotif`,
      roadshow_schedule: `${effectiveOrigin}/api/webhook/roadshow`,
      ticket_links_bogo: `${effectiveOrigin}/api/webhook/tickets`,
      movie_facts_cast_ost: `${effectiveOrigin}/api/webhook/movie-info`,
      voucher_claims_leads: `${effectiveOrigin}/api/webhook/voucher`,
      ai_brain_full_knowledge: `${effectiveOrigin}/api/webhook/ai-brain`,
    }
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
    const body = await req.json().catch(() => ({}));
    console.log('[Wahnotif Master Webhook Inbound]:', JSON.stringify(body));

    const args = body.arguments || body.parameters || body;

    // Detect action or tool name
    const action = String(
      body.action ||
      args.action ||
      body.tool_name ||
      body.name ||
      args.tool ||
      ''
    ).toLowerCase();

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

    const randomPantun = MAS_KIDI_PANTUN[Math.floor(Math.random() * MAS_KIDI_PANTUN.length)];
    const randomJoke = MAS_KIDI_JOKES[Math.floor(Math.random() * MAS_KIDI_JOKES.length)];

    const queryText = String(args.query || args.message || args.text || '').toLowerCase();
    const cityParam = String(args.city || args.kota || '').toLowerCase().trim();

    // =========================================================================
    // SUB-ROUTER 1: ROADSHOW & JADWAL PER KOTA
    // =========================================================================
    const isRoadshowAction =
      action.includes('roadshow') ||
      action.includes('jadwal') ||
      action.includes('schedule') ||
      (cityParam && (queryText.includes('jadwal') || queryText.includes('kapan') || queryText.includes('pemain') || queryText.includes('cast')));

    if (isRoadshowAction && cityParam) {
      let matchedSlug = Object.keys(MASTER_ROADSHOW_STOPS).find(slug => {
        const data = MASTER_ROADSHOW_STOPS[slug];
        const name = data.cityName.toLowerCase();
        return (
          cityParam === slug ||
          cityParam === name ||
          cityParam.includes(slug) ||
          cityParam.includes(name) ||
          slug.includes(cityParam) ||
          name.includes(cityParam)
        );
      });

      if (!matchedSlug) {
        if (cityParam.includes('jogja')) matchedSlug = 'yogyakarta';
        else if (cityParam.includes('solo')) matchedSlug = 'solo';
        else if (cityParam.includes('batu')) matchedSlug = 'malang';
      }

      if (matchedSlug) {
        const cityData = MASTER_ROADSHOW_STOPS[matchedSlug];
        const isExpired = isCityRoadshowExpired(cityData.dateStr, {
          cityName: cityData.cityName,
          manualExpiredCities: db.settings.expiredRoadshowCities || [],
        });

        if (isExpired) {
          return NextResponse.json({
            status: 'success',
            success: true,
            action: 'roadshow_expired',
            cityName: cityData.cityName,
            dateStr: cityData.dateStr,
            replyMessage: `Halo warga ${cityData.cityName} bolo kencengku! Piye kabare? 😄\n${randomPantun}\n\nMaaf banget lur, sesi roadshow temu pemain dan booth voucher fisik di ${cityData.cityName} kemarin (${cityData.dateStr}) sudah selesai ya lur!\n\n🍿 *TAPI OJO CILIK ATI! MUKIDI WAE SING BEDA ALAM WANI BERJUANG, MOSOK SAMPEAN NONTON WAE PUTUS ASA?* 😂\nSampean tetap bisa nonton film PIYE TO KIH? serentak mulai *19 NOVEMBER 2026* di bioskop ${cityData.cityName} dengan *PROMO BUY 1 GET 1 (BOGO)*!\n\n🎟️ *LINK LANGSUNG BELI TIKET & PROMO (TINGGAL KLIK):*\n• Cinema XXI (M-TIX): ${xxiLink}\n• TIX ID: ${tixidLink}\n• CGV: ${cgvLink}\n• Cinépolis: ${cinepolisLink}\n\nBiar gak kehabisan kuota pas presale dibuka, sini Mas Kidi amankan nomor sampean di Pengingat Prioritas WA. Boleh sebutkan Nama Lengkap sampean ya lur! ✨`
          }, { status: 200, headers: corsHeaders });
        }

        const scheduleFormatted = cityData.scheduleItems
          .map(item => `• *${item.time}*: ${item.activity} @ ${item.venue}`)
          .join('\n');

        return NextResponse.json({
          status: 'success',
          success: true,
          action: 'get_roadshow_schedule',
          cityName: cityData.cityName,
          dateStr: cityData.dateStr,
          roster: cityData.rosterActual,
          leadSpeaker: cityData.leadSpeaker,
          schedule: cityData.scheduleItems,
          replyMessage: `🎬 *JADWAL RESMI ROADSHOW PIYE TO KIH? — KOTA ${cityData.cityName.toUpperCase()}* 🎬\n\nHalo warga ${cityData.cityName} bolo asikku! Piye kabare? 😄\n${randomPantun}\n\nRombongan film PIYE TO KIH? bakal hadir di kotamu pada:\n📅 *Tanggal:* ${cityData.dateStr}\n👥 *Pemain yang Hadir:* ${cityData.rosterActual.join(', ')}\n\n📋 *RUNDOWN JADWAL KEGIATAN:*\n${scheduleFormatted}\n\n📍 *BOOTH PENUKARAN VOUCHER FISIK RP10.000:*\n${cityData.boothMall ? `• ${cityData.boothMall.venue} (${cityData.boothMall.floor}) jam ${cityData.boothMall.time}` : '• Mengikuti pengumuman resmi di booth.'}\n\n🎟️ *LINK LANGSUNG TIKET BIOSKOP:*\n• Cinema XXI: ${xxiLink}\n• TIX ID: ${tixidLink}\n• Info Lengkap: ${siteOrigin}\n\nMau sekalian Mas Kidi amankan Kode Booking voucher fisik potongan Rp10.000 buat diambil di booth mall lur? Boleh infokan Nama Lengkap & Nomor WhatsApp sampean ya! 🍿✨`
        }, { status: 200, headers: corsHeaders });
      }
    }

    // =========================================================================
    // SUB-ROUTER 2: TICKET LINKS & BUY 1 GET 1
    // =========================================================================
    const isTicketAction =
      action.includes('ticket') ||
      action.includes('tiket') ||
      action.includes('presale') ||
      action.includes('bogo') ||
      action.includes('promo') ||
      queryText.includes('beli tiket') ||
      queryText.includes('link tiket') ||
      queryText.includes('promo buy 1 get 1');

    if (isTicketAction && !args.phone) {
      return NextResponse.json({
        status: 'success',
        success: true,
        action: 'get_ticket_links',
        ticketLinks: { xxi: xxiLink, tixid: tixidLink, cgv: cgvLink, cinepolis: cinepolisLink, website: siteOrigin },
        replyMessage: `Halo bolo asik! Piye kabare? Pas banget lur! 😄\n${randomPantun}\n\n${randomJoke}\n\n🎟️ *LINK LANGSUNG BELI TIKET & PROMO RESMI (TINGGAL KLIK LUR):*\nBiar gak repot buka aplikasi bioskop lalu nyari-nyari manual, ini Mas Kidi kasih link langsungnya:\n• *Cinema XXI (M-TIX):* ${xxiLink}\n• *TIX ID:* ${tixidLink}\n• *CGV Cinemas:* ${cgvLink}\n• *Cinépolis:* ${cinepolisLink}\n• *Website & Info Lengkap:* ${siteOrigin}\n\n🎁 *INFO PROMO BUY 1 GET 1 (BOGO):*\nKuota promo: 1.000 tiket di TIX ID dan 500 tiket di M-TIX (XXI) penayangan serentak 19 November 2026.\nBiar gak kehabisan kuota pas dibuka, mau Mas Kidi amankan slot Notifikasi Pengingat Prioritas H-1 via WA? Cukup infokan Nama Lengkap & Kota sampean ya lur! 🍿✨`
      }, { status: 200, headers: corsHeaders });
    }

    // =========================================================================
    // SUB-ROUTER 3: MOVIE FACTS, CAST, OST, SYNOPSIS
    // =========================================================================
    const isMovieInfoAction =
      action.includes('movie') ||
      action.includes('film') ||
      action.includes('sinopsis') ||
      action.includes('cast') ||
      action.includes('pemain') ||
      action.includes('ost') ||
      action.includes('soundtrack');

    if (isMovieInfoAction) {
      const topic = String(args.topic || queryText || 'all').toLowerCase();
      let infoContent = '';

      if (topic.includes('sinopsis') || topic.includes('cerita')) {
        infoContent = `📖 *SINOPSIS RESMI PIYE TO KIH? THE MOVIE:*\n${MASTER_MOVIE_FACTS.synopsis}\n\n🎯 *Positioning:* "${MASTER_MOVIE_FACTS.tagline}"\n${MASTER_MOVIE_FACTS.notHorrorExplanation}`;
      } else if (topic.includes('cast') || topic.includes('pemain')) {
        const castList = MASTER_MOVIE_FACTS.castMembers
          .map(c => `• *${c.name}* sebagai *${c.character}* — ${c.desc}`)
          .join('\n');
        infoContent = `👥 *DAFTAR PEMAIN & KARAKTER RESMI:*\n${castList}`;
      } else if (topic.includes('ost') || topic.includes('soundtrack') || topic.includes('lagu')) {
        const ostList = MASTER_MOVIE_FACTS.soundtracks
          .map((s, idx) => `${idx + 1}. *"${s.title}"* — Ciptaan ${s.creator} (Vokal: ${s.singer})\n   Nuansa: ${s.mood}`)
          .join('\n\n');
        infoContent = `🎵 *4 ORIGINAL SOUNDTRACK RESMI (Lek Dahlan):*\n${ostList}\n\n📺 *Tonton Video Klip Resmi di YouTube:* ${MASTER_MOVIE_FACTS.ostYoutubeChannel}`;
      } else {
        infoContent = `🎬 *MASTER FACTS FILM PIYE TO KIH?*
• *Sutradara:* ${MASTER_MOVIE_FACTS.director} | *Penulis:* ${MASTER_MOVIE_FACTS.screenwriters}
• *Tayang Serentak:* 19 NOVEMBER 2026 di Bioskop Seluruh Indonesia
• *Durasi:* ${MASTER_MOVIE_FACTS.runtime} | *Rating:* ${MASTER_MOVIE_FACTS.ageRating}
• *Genre:* ${MASTER_MOVIE_FACTS.genre}
• *Positioning:* "${MASTER_MOVIE_FACTS.tagline}"
• *Pemain Utama:* Heri Chandra (Mukidi), Dara Sarasvati (Sukma), Sutrisno Agung (Gendut), Eko Dunung (Penyok), Pak No, Bunga, Marwoto.`;
      }

      return NextResponse.json({
        status: 'success',
        success: true,
        action: 'get_movie_info',
        replyMessage: `Halo bolo asik! Piye kabare? 😄\n${randomPantun}\n\n${infoContent}\n\n🎟️ *Link Langsung Tiket Bioskop:* ${xxiLink}\nAda lagi info seputar film atau tiket yang pengin kamu tanyakan lur? 🍿`
      }, { status: 200, headers: corsHeaders });
    }

    // =========================================================================
    // SUB-ROUTER 4: LEAD REGISTRATION / VOUCHER CLAIM (DEFAULT / FALLBACK)
    // =========================================================================
    // Extract lead attributes
    const name = args.name || args.customer_name || args.sender_name || body.push_name || 'Bolo Piye To Kih';
    const phone = args.phone || args.number || body.number || body.sender || body.from || '';
    const email = args.email || (phone ? `${String(phone).replace(/[^0-9]/g, '')}@whatsapp.user` : 'user@whatsapp.user');
    const cityLocation = args.city || args.kota || args.cityLocation || 'Nasional';

    if (!phone) {
      return NextResponse.json({
        status: 'success',
        success: true,
        action: 'welcome_prompt',
        replyMessage: `Halo bolo asik! Piye kabare? Mas Kidi siap bantu informasi seputar film komedi keluarga nasional "PIYE TO KIH? THE MOVIE" persembahan MIRACLE Pictures! 😄\n${randomPantun}\n\n${randomJoke}\n\nFilm PIYE TO KIH? tayang serentak 19 NOVEMBER 2026 di bioskop seluruh Indonesia!\n🎟️ *Link Beli Tiket Langsung:* ${xxiLink} (Cinema XXI) | ${tixidLink} (TIX ID)\n\nSampean mau cek jadwal roadshow kotamu, info pemain, atau daftar pengingat promo Buy 1 Get 1 lur? 🍿`
      }, { status: 200, headers: corsHeaders });
    }

    const cleanPhone = String(phone).replace(/[^0-9]/g, '');
    const normalizedCity = String(cityLocation).toLowerCase().trim();

    // Check if the city is one of the 17 Roadshow Cities
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

    // Check if roadshow city is EXPIRED
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

    // SCENARIO 4A: EXPIRED ROADSHOW CITY OR NON-ROADSHOW CITY -> BOGO REMINDER
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
          replyMessage: `🎬 *ROADSHOW ${roadshowCity.name.toUpperCase()} SUDAH SELESAI — NOMOR KAMU DIALIHKAN KE PENGINGAT BUY 1 GET 1!* 🎬\n\nHalo *${name}*, bolo asikku! Piye kabare? 😄\n${randomPantun}\n\nKarena tanggal roadshow ${roadshowCity.name} kemarin (${roadshowCity.dateStr}) sudah terlaksana, penukaran kode booking ke voucher fisik di booth mall sudah selesai ya lur.\n\n🍿 *TAPI OJO CILIK ATI LUR! MUKIDI WAE SING BEDA ALAM WANI BERJUANG, MOSOK SAMPEAN PUTUS ASA?* 😂\nSampean tetap bisa nonton film PIYE TO KIH? serentak mulai *19 NOVEMBER 2026* di seluruh bioskop ${roadshowCity.name} dengan *PROMO BUY 1 GET 1 (BOGO)*!\n\n🎟️ *LINK LANGSUNG BELI TIKET & PROMO (TINGGAL KLIK LUR):*\n• Cinema XXI (M-TIX): ${xxiLink}\n• TIX ID: ${tixidLink}\n• CGV Cinemas: ${cgvLink}\n• Cinépolis: ${cinepolisLink}\n• Info Lengkap: ${siteOrigin}\n\n📌 *Status:* Nomor kamu (${phone}) sudah *RESMI DIAMANKAN di Pengingat Prioritas BOGO*. Nanti begitu kuota presale dibuka, kami langsung japri via WA! Ajak ayang atau kawan tongkrongan ya lur! ✨`
        }, { status: 200, headers: corsHeaders });
      }

      // Non-roadshow city (Bandung, Jakarta, Medan, dll)
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

    // SCENARIO 4B: ACTIVE ROADSHOW CITY -> GENERATE VOUCHER CODE
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
    console.error('[Wahnotif Webhook Error]:', err);
    return NextResponse.json(
      { status: 'error', success: false, error: err.message || 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
