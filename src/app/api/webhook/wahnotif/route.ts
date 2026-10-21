import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, generateVoucherSerial, LeadRecord, BogoReminderRecord } from '@/lib/db';
import { sendVoucherEmail } from '@/lib/email';
import { CITIES_DATA, isCityRoadshowExpired, cleanVenueToMallName, getCityCinemaTicketLinks, getCityByNameOrSlug } from '@/lib/cities';
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

async function tryGeminiVisionAnalysis(imageUrl: string, apiKey: string, userQuery?: string): Promise<string | null> {
  try {
    const fetchRes = await fetch(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!fetchRes.ok) return null;
    const arrayBuf = await fetchRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuf).toString('base64');
    const mime = (fetchRes.headers.get('content-type') || 'image/jpeg').split(';')[0];

    const promptText = `Kamu adalah Mas Kidi, asisten resmi & promotor tiket film layar lebar "PIYE TO KIH?" produksi Miracle Pictures.
Karaktermu sangat ramah, medok santai, akrab seperti kawan tongkrongan khas Jawa-Indonesia ('Halo bolo asik!', 'Piye kabare lur?').
Calon penonton mengirimkan gambar/foto/screenshot ini di chat WhatsApp.
Konteks obrolan: "${userQuery || 'Pembelian tiket film PIYE TO KIH?'}".

Tugasmu:
1. Baca dan pahami isi gambar/screenshot ini secara detail (misal: apakah bukti pembayaran M-TIX/TIX ID, barcode tiket, denah kursi bioskop, voucher fisik, jadwal, atau kendala error).
2. Jelaskan maksud gambar ini kepada penonton dengan bahasa Mas Kidi yang akrab dan solutif.
3. Berikan arahan konkret selanjutnya (misal: "tiket sudah sah, tinggal scan 15 menit sebelum tayang", atau "rekomendasi kursi tengah baris C/D", atau solusi kendala).
4. Sisipkan 1 pantun jenaka Mas Kidi di akhir pesan.
Jawab dengan ramah, percaya diri, dan jangan gunakan sapaan Ayah/Bunda/Kakak. Gunakan sapaan lur / bolo asik.`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: promptText },
              {
                inlineData: {
                  mimeType: mime,
                  data: base64
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600
        }
      })
    });

    if (!geminiRes.ok) return null;
    const data = await geminiRes.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || null;
  } catch (err) {
    console.error('[Gemini Vision Analysis Error]:', err);
    return null;
  }
}

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
    title: 'Master AI Webhook Piye Toh Kih (Jadwal, Cast, Harga Tiket, Voucher & Persona)',
    description: 'Master webhook terintegrasi yang menyediakan data lengkap jadwal roadshow 17 kota, roster cast pemain, rentang perkiraan harga tiket (HTM Rp 30.000 - Rp 50.000), link langsung beli tiket bioskop (XXI, TIX ID, CGV, Cinepolis), promo Buy 1 Get 1, fakta resmi film, serta penerbitan voucher fisik & pengingat prioritas.',
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
        query: {
          type: 'string',
          description: 'Pertanyaan atau pesan dari calon penonton (contoh: berapa harga tiketnya, jadwal nonton duluan, dll.)',
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
        description: WAHNOTIF_TOOL_TICKETS_SCHEMA.description,
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
      },
      {
        name: 'contact_partnership_and_team',
        description: 'Menghubungkan calon penonton, komunitas, instansi, atau brand yang ingin berkomunikasi langsung dengan tim partnership & admin Miracle Pictures untuk kolaborasi, nobar (nonton bareng), sponsorship, media partner, meet and greet khusus, atau berbicara dengan admin manusia.',
        url: `${effectiveOrigin}/api/webhook/wahnotif`,
        method: 'POST',
        parameters: {
          type: 'object',
          properties: {
            topic: {
              type: 'string',
              description: "Topik pembicaraan: 'partnership', 'kolaborasi', 'nobar', 'sponsor', 'media', atau 'admin_human'",
            },
            name: {
              type: 'string',
              description: 'Nama penanya atau perwakilan instansi (opsional)',
            },
            message: {
              type: 'string',
              description: 'Pesan atau maksud kolaborasi (opsional)',
            },
          },
        },
      }
    ],
    endpoints: {
      master_all_in_one: `${effectiveOrigin}/api/webhook/wahnotif`,
      roadshow_schedule: `${effectiveOrigin}/api/webhook/roadshow`,
      ticket_links_bogo: `${effectiveOrigin}/api/webhook/tickets`,
      movie_facts_cast_ost: `${effectiveOrigin}/api/webhook/movie-info`,
      voucher_claims_leads: `${effectiveOrigin}/api/webhook/voucher`,
      partnership_collaboration_handover: `${effectiveOrigin}/api/webhook/wahnotif`,
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

    const queryText = String(args.query || args.message || args.text || '').toLowerCase().trim();
    const cityParam = String(args.city || args.kota || '').toLowerCase().trim();

    // =========================================================================
    // SUB-ROUTER -1: DETEKSI JAWABAN AUDIENS DARI FOLLOW-UP (STOPPING FOLLOW-UP)
    // =========================================================================
    const rawSender = String(args.phone || args.number || body.number || body.sender || body.from || '').replace(/[^0-9]/g, '');
    const cleanSender = rawSender.startsWith('0') ? '62' + rawSender.slice(1) : rawSender;

    const isAffirmativeResponse =
      queryText === 'sudah' ||
      queryText.includes('sudah beli') ||
      queryText.includes('udah beli') ||
      queryText.includes('tiket aman') ||
      queryText.includes('dapat tiket') ||
      queryText.includes('sudah punya') ||
      queryText.includes('udah punya') ||
      queryText === 'oke' ||
      queryText === 'siap' ||
      queryText === 'beres' ||
      queryText === 'mau';

    const isNegativeResponse =
      queryText === 'skip' ||
      queryText.includes('gak jadi') ||
      queryText.includes('nggak jadi') ||
      queryText.includes('tidak jadi') ||
      queryText.includes('belum bisa') ||
      queryText.includes('batal') ||
      queryText.includes('skip dulu');

    if ((isAffirmativeResponse || isNegativeResponse) && cleanSender.length >= 8) {
      const matchedLead = db.leads.find(l => {
        const p = l.phone.replace(/[^0-9]/g, '');
        return p.endsWith(cleanSender.slice(-8));
      });
      const matchedReminder = db.bogoReminders.find(r => {
        const p = r.phone.replace(/[^0-9]/g, '');
        return p.endsWith(cleanSender.slice(-8));
      });

      if (matchedLead) {
        matchedLead.presaleFollowupStatus = 'responded';
        matchedLead.presaleFollowupResponse = isAffirmativeResponse ? 'bought' : 'declined';
      }
      if (matchedReminder) {
        matchedReminder.presaleFollowupStatus = 'responded';
        matchedReminder.presaleFollowupResponse = isAffirmativeResponse ? 'bought' : 'declined';
      }
      if (matchedLead || matchedReminder) {
        saveDb(db);
      }

      if (isAffirmativeResponse) {
        return NextResponse.json({
          status: 'success',
          success: true,
          action: 'followup_confirmed_positive',
          replyMessage: `Mantap tenan bolo asikku! 😄🎉\n${randomPantun}\n\nTerima kasih banyak ya lur udah konfirmasi! Mas Kidi dan rombongan artis (Mukidi, Sukma, Gendut, Penyok) udah gak sabar pengen ketemu langsung bareng sampean di bioskop!\n\nJangan lupa datang lebih awal ya lur, biar dapet posisi kursi paling wenak. Sampai jumpa di bioskop! 🍿✨`
        }, { status: 200, headers: corsHeaders });
      } else {
        return NextResponse.json({
          status: 'success',
          success: true,
          action: 'followup_confirmed_negative',
          replyMessage: `Siap bolo asik, gak popo lur santai wae! 😄\n${randomPantun}\n\nTerima kasih ya lur udah konfirmasi ke Mas Kidi. Nanti kalau ada waktu luang, sampean tetep bisa nonton pas penayangan serentak nasional mulai 19 NOVEMBER 2026 di bioskop kotamu ya!\n\nTetep semangat dan sehat selalu bolo kencengku! 🍿🙏`
        }, { status: 200, headers: corsHeaders });
      }
    }

    // =========================================================================
    // SUB-ROUTER 0: HUMAN HANDOVER / PARTNERSHIP / KOLABORASI / NOBAR
    // =========================================================================
    const isPartnershipOrHandover =
      action.includes('human') ||
      action.includes('admin') ||
      action.includes('handoff') ||
      action.includes('handover') ||
      action.includes('eskalasi') ||
      action.includes('partner') ||
      action.includes('collaborat') ||
      queryText.includes('admin') ||
      queryText.includes('manusia') ||
      queryText.includes('orang') ||
      queryText.includes('operator') ||
      queryText.includes('cs manusia') ||
      queryText.includes('bicara sama cs') ||
      queryText.includes('partnership') ||
      queryText.includes('partner') ||
      queryText.includes('kolaborasi') ||
      queryText.includes('kerjasama') ||
      queryText.includes('kerja sama') ||
      queryText.includes('nobar') ||
      queryText.includes('nonton bareng') ||
      queryText.includes('sponsor') ||
      queryText.includes('media partner') ||
      queryText.includes('berkomunikasi langsung') ||
      queryText.includes('bicara langsung') ||
      queryText.includes('hubungi tim') ||
      queryText.includes('kontak admin') ||
      queryText.includes('nomor admin') ||
      queryText.includes('pihak tim');

    if (isPartnershipOrHandover) {
      const isPartnershipQuery =
        queryText.includes('partner') ||
        queryText.includes('kolaborasi') ||
        queryText.includes('kerjasama') ||
        queryText.includes('kerja sama') ||
        queryText.includes('nobar') ||
        queryText.includes('nonton bareng') ||
        queryText.includes('sponsor') ||
        queryText.includes('media partner');

      const replyMsg = isPartnershipQuery
        ? `Siap bolo asik! Mas Kidi sambungkan langsung obrolan ini ke Tim Partnership & Promosi Miracle Pictures ya lur. Tunggu sebentar nggih, tim kami bakal segera balas chat sampean langsung di sini! 🍿✨`
        : `Siap bolo asik! Mas Kidi sambungkan langsung obrolan ini ke Tim Admin Miracle Pictures ya lur. Tunggu sebentar nggih, admin kami bakal segera balas chat sampean langsung di sini! 🍿✨`;

      return NextResponse.json({
        status: 'success',
        success: true,
        action: 'human_handover',
        replyMessage: replyMsg
      }, { status: 200, headers: corsHeaders });
    }

    // =========================================================================
    // SUB-ROUTER 0.5: IMAGE / VISION RECOGNITION (BUKTI TIKET, SEAT MAP, SCREENSHOT)
    // =========================================================================
    const mediaUrl = String(
      args.media_url ||
      args.mediaUrl ||
      args.image_url ||
      args.imageUrl ||
      args.url ||
      body.media_url ||
      body.mediaUrl ||
      body.image_url ||
      body.imageUrl ||
      body.file_url ||
      body.media ||
      body.url ||
      body.payload?.url ||
      body.payload?.media_url ||
      ''
    ).trim();

    const msgType = String(
      body.type ||
      body.message_type ||
      body.media_type ||
      args.type ||
      args.message_type ||
      ''
    ).toLowerCase();

    const isImageMessage =
      action.includes('image') ||
      action.includes('vision') ||
      action.includes('foto') ||
      action.includes('gambar') ||
      msgType === 'image' ||
      msgType.includes('image') ||
      msgType === 'photo' ||
      Boolean(mediaUrl) ||
      queryText.includes('[gambar]') ||
      queryText.includes('[foto]') ||
      queryText.includes('[image]') ||
      queryText.includes('<gambar>') ||
      queryText.includes('<image>') ||
      queryText.startsWith('gambar:') ||
      queryText.startsWith('foto:') ||
      queryText.includes('ini buktinya') ||
      queryText.includes('bukti transfer') ||
      queryText.includes('bukti bayar') ||
      queryText.includes('bukti tiket') ||
      queryText.includes('screenshot') ||
      queryText.includes('ss tiket') ||
      queryText === 'ss' ||
      queryText.startsWith('ss ');

    if (isImageMessage) {
      const geminiApiKey = db.settings.geminiApiKey || process.env.GEMINI_API_KEY || '';
      let visionAnalysisText: string | null = null;

      if (mediaUrl && geminiApiKey) {
        visionAnalysisText = await tryGeminiVisionAnalysis(mediaUrl, geminiApiKey, queryText);
      }

      if (visionAnalysisText) {
        return NextResponse.json({
          status: 'success',
          success: true,
          action: 'image_vision_analysis',
          replyMessage: visionAnalysisText
        }, { status: 200, headers: corsHeaders });
      }

      // Contextual Smart Explanation (Cinema Ticket / Payment / Seat Map)
      const detectedCityForImg = getCityByNameOrSlug(cityParam || queryText);
      const cinemaContextStr = detectedCityForImg?.name
        ? `di ${detectedCityForImg.name}`
        : 'Plaza Ambarrukmo XXI / bioskop kesayanganmu';

      const contextualExplanation = `Halo bolo asik! Siap lur, Mas Kidi terima gambarnya! 😄
${randomPantun}

Mas Kidi bantu jelaskan sesuai konteks gambar/screenshot yang sampean kirim ya lur:

🎟️ *1. JIKA INI BUKTI PEMBAYARAN / E-TICKET / BARCODE (M-TIX / TIX ID):*
• **Status Tiket:** Transaksi sampean sudah **SAH & RESMI TERVERIFIKASI** di sistem bioskop!
• **Cara Masuk Bioskop:** Simpan screenshot barcode tersebut di galeri HP. Nanti pas hari-H, datang 15–30 menit sebelum jam tayang ${cinemaContextStr}.
• **Cetak Tiket:** Langsung scan barcode di mesin Kiosk Mandiri lobi bioskop untuk cetak tiket fisik, atau tunjukkan barcode e-ticket langsung ke petugas pintu studio!

💺 *2. JIKA INI TAMPILAN DENAH KURSI (SEAT MAP):*
• **Rekomendasi Posisi Terbaik:** Mas Kidi saranin pilih kursi di baris tengah (**Baris C atau D, nomor kursi 7 sampai 12**).
• Posisi ini paling wenak di mata, gak kedeketan sama layar dan suara audio surround bioskop terdengar paling mantap! Hindari baris A (paling depan) ya lur biar leher gak pegal. 😂

💳 *3. JIKA INI HALAMAN MENUNGGU PEMBAYARAN (CHECKOUT PENDING):*
• Pastikan selesaikan transfer/e-wallet sebelum batas waktu pembayaran (10–15 menit) habis ya lur, supaya kursi incaran sampean gak otomatis dilepas kembali ke penonton lain.

Ada kendala lain atau ada yang mau ditanyakan lagi seputar tiketnya lur? Mas Kidi siap kawal sampai beres! 🍿✨`;

      return NextResponse.json({
        status: 'success',
        success: true,
        action: 'image_contextual_explanation',
        replyMessage: contextualExplanation
      }, { status: 200, headers: corsHeaders });
    }

    // =========================================================================
    // SUB-ROUTER 1: ROADSHOW & JADWAL 17 KOTA (GENERAL LIST & PER KOTA)
    // =========================================================================
    const detectedCityRes = getCityByNameOrSlug(cityParam || queryText);
    const hasSpecificCity = Boolean(detectedCityRes && !['all', 'list', 'semua'].includes(detectedCityRes.slug));

    const isGeneralCityListQuery =
      queryText.includes('dikota mna') ||
      queryText.includes('dikota mana') ||
      queryText.includes('di kota mana') ||
      queryText.includes('di kota mna') ||
      queryText.includes('kota mana') ||
      queryText.includes('kota mna') ||
      queryText.includes('mana saja') ||
      queryText.includes('mna saaja') ||
      queryText.includes('mana aja') ||
      queryText.includes('mna aja') ||
      queryText.includes('daftar kota') ||
      queryText.includes('semua kota') ||
      queryText.includes('17 kota') ||
      queryText.includes('temu cast') ||
      queryText.includes('meet and greet') ||
      cityParam === 'all' ||
      cityParam === 'list' ||
      cityParam === 'semua';

    const isRoadshowAction =
      action.includes('roadshow') ||
      action.includes('jadwal') ||
      action.includes('schedule') ||
      Boolean(detectedCityRes && (queryText.includes('jadwal') || queryText.includes('kapan') || queryText.includes('pemain') || queryText.includes('cast') || queryText.includes('roadshow') || queryText.includes('jam')));

    // CASE 1A: GENERAL CITY LIST INQUIRY (17 KOTA RESMI SESUAI WEBSITE)
    if (!hasSpecificCity && (isGeneralCityListQuery || isRoadshowAction || action === 'get_roadshow_schedule')) {
      const citiesFormatted = CITIES_DATA.map((c, idx) => {
        const extraNote = c.slug === 'kediri' ? ' — Puncak Home Premiere' : '';
        return `${idx + 1}. 📍 *${c.name}* (${c.dateStr})${extraNote}`;
      }).join('\n');

      const reply = `Halo bolo asik! Piye kabare? Pas banget lur! 😄
${randomPantun}

🎬 *DAFTAR RESMI 17 KOTA ROADSHOW & TEMU CAST PIYE TO KIH? THE MOVIE:*
${citiesFormatted}

🍿 *INFO PENTING BUAT BOLO ASIK:*
Di 17 kota di atas, sampean bisa ikutan sesi **NONTON DULUAN (SPECIAL SCREENING)** di dalam studio bioskop bareng langsung rombongan cast sebelum tayang serentak 19 November lho!

🎟️ *LINK LANGSUNG BELI TIKET PRESALE RESMI (TINGGAL KLIK):*
• Cinema XXI (M-TIX): ${xxiLink}
• TIX ID: ${tixidLink}
• CGV: ${cgvLink}
• Cinépolis: ${cinepolisLink}
• Cek Rundown Lengkap di Web: ${siteOrigin}/#roadshow

Sampean mau cek rundown jadwal jam atau beli tiket di kota mana nih lur? Sebutkan nama kotamu ya! 🍿✨`;

      return NextResponse.json({
        status: 'success',
        success: true,
        action: 'get_roadshow_schedule',
        city: 'all',
        totalCities: CITIES_DATA.length,
        cities: CITIES_DATA.map(c => ({ name: c.name, slug: c.slug, dateStr: c.dateStr })),
        replyMessage: reply
      }, { status: 200, headers: corsHeaders });
    }

    // CASE 1B: NON-ROADSHOW CITIES CHECK (Bandung, Jakarta, Kudus, Salatiga, Klaten, dll)
    const knownNonRoadshowCities = [
      'jakarta', 'bandung', 'medan', 'bali', 'denpasar', 'makassar', 'palembang', 'batam',
      'bekasi', 'bogor', 'depok', 'tangerang', 'kudus', 'salatiga', 'klaten', 'purwokerto',
      'tegal', 'jember', 'lampung'
    ];
    const nonRoadshowMatch = !hasSpecificCity ? knownNonRoadshowCities.find(c => queryText.includes(c) || (cityParam && cityParam.includes(c))) : null;

    if (nonRoadshowMatch) {
      const cityNameDisplay = nonRoadshowMatch.toUpperCase();
      return NextResponse.json({
        status: 'success',
        success: true,
        action: 'roadshow_non_active_city',
        cityName: cityNameDisplay,
        replyMessage: `Halo bolo asik di ${cityNameDisplay}! Piye kabare? 😄\n${randomPantun}\n\nUntuk rangkaian roadshow temu cast saat ini memang lagi keliling 17 kota Jateng & Jatim lur (Semarang, Jogja, Magelang, Solo, Sragen, Ngawi, Madiun, Ponorogo, Nganjuk, Mojokerto, Gresik, Surabaya, Sidoarjo, Malang, Kediri, Blitar, Tulungagung).\n\n🍿 *TAPI TENANG! TANGGAL 19 NOVEMBER 2026 PIYE TO KIH? TAYANG SERENTAK DI BIOSKOP KOTAMU!*\n\n🎟️ *LINK LANGSUNG BELI TIKET BIOSKOP (TINGGAL KLIK):*\n• Cinema XXI (M-TIX): ${xxiLink}\n• TIX ID: ${tixidLink}\n• CGV: ${cgvLink}\n• Cinépolis: ${cinepolisLink}\n\nBakal ada Promo Buy 1 Get 1 (BOGO) juga lho! Mau Mas Kidi daftarkan nomor sampean buat Pengingat Prioritas H-1 via WA? Cukup infokan Nama Lengkap sampean ya lur! ✨`
      }, { status: 200, headers: corsHeaders });
    }

    if (isRoadshowAction && (cityParam || detectedCityRes)) {
      const targetSlug = detectedCityRes?.slug === 'jogja' ? 'yogyakarta' : (detectedCityRes?.slug || cityParam);
      const cityData = MASTER_ROADSHOW_STOPS[targetSlug] || Object.values(MASTER_ROADSHOW_STOPS).find(s =>
        s.cityName.toLowerCase() === targetSlug.toLowerCase() ||
        (detectedCityRes && s.cityName.toLowerCase() === detectedCityRes.name.toLowerCase())
      );

      if (cityData) {
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

        const cityCinemas = getCityCinemaTicketLinks(
          cityData.slug,
          db.settings.roadshowOverrides,
          db.settings.cityLinkOverrides
        );

        let cinemasListText = '';
        if (cityCinemas.length > 0) {
          cinemasListText = cityCinemas.map(c => {
            const times = c.showTimes.length > 0 ? ` (${c.showTimes.join(', ')})` : '';
            return `• *${c.cinemaName}*${times}:\n  👉 ${c.ticketUrl}`;
          }).join('\n');
        } else {
          const directCityLink = db.settings.cityLinkOverrides?.[cityData.slug] || xxiLink;
          cinemasListText = `• Cinema XXI: ${directCityLink}\n• TIX ID: ${tixidLink}`;
        }

        return NextResponse.json({
          status: 'success',
          success: true,
          action: 'get_roadshow_schedule',
          cityName: cityData.cityName,
          dateStr: cityData.dateStr,
          roster: cityData.rosterActual,
          leadSpeaker: cityData.leadSpeaker,
          schedule: cityData.scheduleItems,
          cinemas: cityCinemas,
          replyMessage: `🎬 *JADWAL RESMI ROADSHOW PIYE TO KIH? — KOTA ${cityData.cityName.toUpperCase()}* 🎬\n\nHalo warga ${cityData.cityName} bolo asikku! Piye kabare? 😄\n${randomPantun}\n\nRombongan film PIYE TO KIH? bakal hadir di kotamu pada:\n📅 *Tanggal:* ${cityData.dateStr}\n👥 *Pemain yang Hadir:* ${cityData.rosterActual.join(', ')}\n\n📋 *RUNDOWN JADWAL KEGIATAN:*\n${scheduleFormatted}\n\n📍 *LOKASI PENUKARAN VOUCHER (BOOTH ROADSHOW OFFLINE):*\n• Acara: *Konter Booth Resmi Roadshow & Meet and Greet*\n${cityData.boothMall ? `• Lokasi: *${cityData.boothMall.venue}* (${cityData.boothMall.floor}) jam *${cityData.boothMall.time}*` : '• Jadwal & lokasi mengikuti rundown resmi di website.'}\n\n🚫 *PERINGATAN PENTING:* DILARANG & TIDAK DILAYANI penukaran voucher di area bioskop maupun kasir bioskop! Penukaran HANYA di booth roadshow meet & greet offline ya lur.\n\n🎟️ *LINK INFORMASI & TIKET PRESALE (SPECIAL SCREENING):*\n${cinemasListText}\n• Cek Rundown Lengkap: ${siteOrigin}/city/${cityData.slug}\n• TIX ID: ${tixidLink}\n\nMau sekalian Mas Kidi amankan Kode Booking voucher fisik potongan Rp10.000 buat diambil di konter booth roadshow lur? Boleh infokan Nama Lengkap & Nomor WhatsApp sampean ya! 🍿✨`
        }, { status: 200, headers: corsHeaders });
      }
    }

    // =========================================================================
    // SUB-ROUTER 2: TICKET LINKS, PRESALE, SPECIAL SCREENING & BUY 1 GET 1
    // =========================================================================
    const isSpecialScreeningOrPresale =
      action.includes('presale') ||
      action.includes('screening') ||
      queryText.includes('nonton duluan') ||
      queryText.includes('spesial screening') ||
      queryText.includes('special screening') ||
      queryText.includes('screening') ||
      queryText.includes('presale') ||
      queryText.includes('sebelum 19') ||
      queryText.includes('duluan') ||
      args.type === 'presale' ||
      args.type === 'screening';

    const isBogoInquiry =
      action.includes('bogo') ||
      queryText.includes('bogo') ||
      queryText.includes('buy 1 get 1') ||
      queryText.includes('beli 1 gratis 1') ||
      queryText.includes('tiket gratis') ||
      queryText.includes('promo buy 1 get 1') ||
      args.type === 'bogo';

    const isPriceInquiry =
      action.includes('price') ||
      action.includes('harga') ||
      action.includes('htm') ||
      queryText.includes('harga') ||
      queryText.includes('harganya') ||
      queryText.includes('htm') ||
      queryText.includes('biaya') ||
      queryText.includes('tarif') ||
      queryText.includes('berapaan') ||
      queryText.includes('berapa tiket') ||
      queryText.includes('berapa harga') ||
      (queryText.includes('berapa') && (queryText.includes('tiket') || queryText.includes('nonton') || queryText.includes('bayar')));

    const isTicketAction =
      isSpecialScreeningOrPresale ||
      isBogoInquiry ||
      isPriceInquiry ||
      action.includes('ticket') ||
      action.includes('tiket') ||
      action.includes('promo') ||
      queryText.includes('beli tiket') ||
      queryText.includes('link tiket') ||
      queryText.includes('pesan tiket') ||
      queryText.includes('tiket bioskop');

    if (isTicketAction && !args.phone) {
      const now = new Date();
      const isBogoLive = now >= new Date(2026, 10, 15); // Dibuka 15 Nov 2026

      let cityNote = '';
      let cityOverrideNote = '';
      let cityCinemasList = '';
      let matchedStopName = '';
      let matchedStopSlug = '';

      const detectedTicketCity = getCityByNameOrSlug(cityParam || queryText);
      if (detectedTicketCity) {
        matchedStopName = detectedTicketCity.name;
        matchedStopSlug = detectedTicketCity.slug;
        const cityCinemas = getCityCinemaTicketLinks(
          detectedTicketCity.slug,
          db.settings.roadshowOverrides,
          db.settings.cityLinkOverrides
        );
        if (cityCinemas.length > 0) {
          cityCinemasList = cityCinemas.map(c => {
            const times = c.showTimes.length > 0 ? ` (${c.showTimes.join(', ')})` : '';
            const isQueriedCinema =
              queryText.includes(c.cinemaName.toLowerCase()) ||
              (queryText.includes('amplaz') && c.cinemaName.toLowerCase().includes('ambarrukmo')) ||
              (queryText.includes('jcm') && c.cinemaName.toLowerCase().includes('jogja city')) ||
              (queryText.includes('empire') && c.cinemaName.toLowerCase().includes('empire')) ||
              (queryText.includes('paragon') && c.cinemaName.toLowerCase().includes('paragon')) ||
              (queryText.includes('the park') && c.cinemaName.toLowerCase().includes('the park')) ||
              (queryText.includes('matos') && c.cinemaName.toLowerCase().includes('matos')) ||
              (queryText.includes('artos') && c.cinemaName.toLowerCase().includes('artos'));
            const prefix = isQueriedCinema ? '🔥 ' : '• ';
            return `${prefix}*${c.cinemaName}*${times}:\n  👉 ${c.ticketUrl}`;
          }).join('\n');
          cityNote = `\n🍿 *Bioskop Khusus di ${matchedStopName}:*\n` + cityCinemasList;
        } else if (detectedTicketCity.cinemas?.length > 0) {
          cityNote = `\n🍿 *Bioskop Rekomendasi di ${matchedStopName}:* ${detectedTicketCity.cinemas.map(c => c.name).join(', ')}`;
        }
        const cityOverride = db.settings.cityLinkOverrides?.[detectedTicketCity.slug] || (detectedTicketCity.slug === 'jogja' ? db.settings.cityLinkOverrides?.['yogyakarta'] : undefined);
        if (cityOverride) {
          cityOverrideNote = `\n🎟️ *Link Khusus Tiket ${matchedStopName}:* ${cityOverride}`;
        }
      }

      let ticketReply = '';

      if (isPriceInquiry) {
        // Price / HTM Inquiry: Estimated 30-50k + Direct Links from Landing Page
        const priceTicketBlock = cityCinemasList
          ? `🎟️ *LINK CEK HARGA PASTI & BELI TIKET BIOSKOP ${matchedStopName.toUpperCase() || 'KOTAMU'} (TINGGAL KLIK):*\n${cityCinemasList}\n• *Cek Rundown & Panggung:* ${siteOrigin}${matchedStopSlug ? `/city/${matchedStopSlug}` : ''}\n• *TIX ID:* ${tixidLink}`
          : `🎟️ *LINK LANGSUNG CEK HARGA & BELI TIKET BIOSKOP (TINGGAL KLIK):*\n• *Cinema XXI (M-TIX):* ${xxiLink}\n• *TIX ID:* ${tixidLink}\n• *CGV Cinemas:* ${cgvLink}\n• *Cinépolis:* ${cinepolisLink}\n• *Website Resmi & Jadwal Kota:* ${siteOrigin}${cityOverrideNote}${cityNote}`;

        ticketReply = `Halo bolo asik! Piye kabare? Pas banget lur! 😄
${randomPantun}

🍿 *RENTANG PERKIRAAN HARGA TIKET (HTM) FILM "PIYE TO KIH?":*
Untuk harga tiket nonton di bioskop, rentang perkiraannya ada di kisaran **Rp 30.000 sampai Rp 50.000** per tiket lur!
*(Besaran harga tiket ditentukan oleh pihak jaringan bioskop seperti XXI, CGV, Cinépolis, Platinum, NSC, menyesuaikan kota/lokasi dan hari tayang weekday atau weekend).*

Buat cek harga tiket pasti di bioskop kotamu sekaligus langsung amankan kursi incaran sampean biar gak kehabisan, ini Mas Kidi kasih tautan resmi bioskopnya lur (tinggal klik sesuai yang ada di website):
${priceTicketBlock}

🔥 *TIPS HEMAT DARI MAS KIDI:*
• *Mau Nonton Duluan bareng cast sebelum 19 Nov?* Sesi Special Screening di bioskop kota roadshow sudah bisa dibeli tiket presale-nya sekarang lewat link di atas lur!
• *Promo Buy 1 Get 1 (19 Nov):* Beli 1 tiket harga reguler, gratis 1 tiket tambahan di TIX ID & M-TIX XXI! Mau Mas Kidi amankan slot Pengingat Prioritas H-1 via WA? Cukup infokan Nama & Kota sampean ya lur!

Mukidi wae sing beda alam wani berjuang lur, mosok sampean tuku tiket wae nunda-nunda? 😂
Mau Mas Kidi bantu arahin beli di XXI atau TIX ID lur? 🍿✨`;

      } else if (isSpecialScreeningOrPresale) {
        // High-Conversion Pitch Nonton Duluan / Special Screening Presale
        const ticketSection = cityCinemasList
          ? `🎟️ *LINK TIKET PRESALE SPECIAL SCREENING ${matchedStopName.toUpperCase() || 'KOTAMU'} (TINGGAL KLIK):*\n${cityCinemasList}\n• *Cek Rundown & Panggung:* ${siteOrigin}${matchedStopSlug ? `/city/${matchedStopSlug}` : ''}\n• *TIX ID:* ${tixidLink}`
          : `🎟️ *LINK LANGSUNG BELI TIKET PRESALE / NONTON DULUAN (TINGGAL KLIK):*\n• *Cinema XXI (M-TIX):* ${xxiLink}\n• *TIX ID:* ${tixidLink}\n• *CGV Cinemas:* ${cgvLink}\n• *Cinépolis:* ${cinepolisLink}\n• *Website Resmi & Info Kota:* ${siteOrigin}${cityOverrideNote}${cityNote}`;

        ticketReply = `Halo bolo asik! Piye kabare? Pas banget lur! 😄
${randomPantun}

🎬 *MAU NONTON DULUAN SEBELUM 19 NOVEMBER? BISA BANGET LUR!* 🎬
Kabar gembira! Sampean GAK PERLU nunggu sampai penayangan reguler 19 November buat nonton film komedi layar lebar *"PIYE TO KIH?"*!

Ada sesi **NONTON DULUAN (SPECIAL SCREENING)** di bioskop rangkaian roadshow bareng langsung rombongan pemain (Mukidi, Sukma, Gendut, Penyok)!

${ticketSection}

⚠️ *PENTING LUR:* Kuota kursi Special Screening Nonton Duluan per studio sangat terbatas! Baris tengah cepat ludes lur. Mukidi wae sing beda alam wani berjuang, mosok sampean tuku tiket wae nunda-nunda? 😂
Langsung klik link di atas dan amankan tiket sampean sekarang ya lur! Mau Mas Kidi bantu arahin beli di XXI atau TIX ID? 🍿✨`;

      } else if (isBogoInquiry && isBogoLive) {
        // Promo BOGO on or after 15 Nov 2026
        ticketReply = `Halo bolo asik! Piye kabare? Kabar gembira lur! 😄
${randomPantun}

🔥 *WAR PROMO BUY 1 GET 1 (BOGO) RESMI DIBUKA HARI INI!* 🔥
Tiket promo Buy 1 Get 1 film *"PIYE TO KIH?"* sudah resmi dibuka untuk penayangan perdana 19 November 2026!

🎟️ *LINK LANGSUNG BELI TIKET PROMO BOGO (KLIK SEKARANG SEBELUM KUOTA HABIS):*
• *TIX ID (Kuota 1.000 Tiket):* ${tixidLink}
• *Cinema XXI M-TIX (Kuota 500 Tiket):* ${xxiLink}
• *CGV Cinemas:* ${cgvLink}
• *Cinépolis:* ${cinepolisLink}
• *Website Resmi:* ${siteOrigin}${cityOverrideNote}${cityNote}

⚠️ Kuota promo sangat terbatas (1.000 di TIX ID & 500 di M-TIX), langsung klik link di atas sekarang juga ya lur ben gak kehabisan kuota! Jangan sampai nyesel kehabisan lur! 🍿✨`;

      } else if (isBogoInquiry && !isBogoLive) {
        // Promo BOGO before 15 Nov 2026: UPSELL PRESALE ROADSHOW FIRST, then offer BOGO Reminder!
        const presaleLinksBlock = cityCinemasList
          ? `🎟️ *TIKET PRESALE NONTON DULUAN ${matchedStopName.toUpperCase() || 'KOTAMU'}:*\n${cityCinemasList}\n• *Cek Jadwal Kota:* ${siteOrigin}${matchedStopSlug ? `/city/${matchedStopSlug}` : ''}`
          : `• *Cinema XXI (M-TIX):* ${xxiLink}\n• *TIX ID:* ${tixidLink}\n• *Website Resmi & Jadwal Kota:* ${siteOrigin}${cityOverrideNote}${cityNote}`;

        ticketReply = `Halo bolo asik! Piye kabare? Pas banget lur! 😄
${randomPantun}

🎟️ *MAU NONTON DULUAN SEKARANG BARENG PEMAIN TANPA PERLU NUNGGU?* 🎟️
Kenapa harus nunggu sampai 19 November kalau sekarang sampean bisa *NONTON DULUAN* bareng rombongan Mukidi, Sukma, Gendut, dan Penyok di sesi *SPECIAL SCREENING ROADSHOW*!
Tiket Presale Nonton Duluan sudah resmi dibuka dan bisa dibeli sekarang lewat link ini:
${presaleLinksBlock}
⚠️ *Kursi studio terbatas banget lur, amankan posisi favorit sampean sekarang sebelum ludes!*

🎁 *INFO PROMO BUY 1 GET 1 (BOGO) PENAYANGAN PERDANA 19 NOVEMBER:*
Kalau sampean tetep mau war promo Buy 1 Get 1 (kuota 1.000 tiket TIX ID & 500 tiket M-TIX), loket baru dibuka pada *15 - 18 November 2026*.
Biar gak kehabisan kuota pas loket dibuka nanti, DAFTAR PENGINGAT PRIORITAS H-1 SEKARANG LUR! Mas Kidi bakal kirim link langsung via WA pas dibuka!
📲 Cukup balas dengan sebutkan *Nama Lengkap & Kota* sampean ya lur! Mau Mas Kidi daftarkan sekarang? 🍿✨`;

      } else {
        // General Ticket Inquiry: UPSELL PRESALE FIRST + HARDSALE CLOSING
        const generalLinksBlock = cityCinemasList
          ? `🎟️ *LINK TIKET BIOSKOP ${matchedStopName.toUpperCase() || 'KOTAMU'} (TINGGAL KLIK):*\n${cityCinemasList}\n• *Cinema XXI (M-TIX):* ${xxiLink}\n• *TIX ID:* ${tixidLink}\n• *Website & Info Lengkap:* ${siteOrigin}${matchedStopSlug ? `/city/${matchedStopSlug}` : ''}`
          : `🎟️ *LINK LANGSUNG BELI TIKET & PRESALE RESMI (TINGGAL KLIK LUR):*\nBiar gak repot buka aplikasi bioskop lalu nyari-nyari manual, ini Mas Kidi kasih link langsungnya:\n• *Cinema XXI (M-TIX):* ${xxiLink}\n• *TIX ID:* ${tixidLink}\n• *CGV Cinemas:* ${cgvLink}\n• *Cinépolis:* ${cinepolisLink}\n• *Website & Info Lengkap:* ${siteOrigin}${cityOverrideNote}${cityNote}`;

        ticketReply = `Halo bolo asik! Piye kabare? Pas banget lur! 😄
${randomPantun}

${randomJoke}

🎬 *MAU NONTON DULUAN SEBELUM 19 NOVEMBER BARENG PEMAIN?*
Gak perlu nunggu sampai penayangan reguler lur! Ada sesi *SPECIAL SCREENING (NONTON DULUAN)* di bioskop kota roadshow bareng rombongan cast (Mukidi, Sukma, Gendut, Penyok)! Tiket presale sudah bisa langsung dibeli sekarang!

${generalLinksBlock}

⚠️ *PENTING LUR:* Kuota kursi studio cepat habis lur! Mukidi wae wani berjuang beda alam, mosok sampean tuku tiket wae nunda-nunda? 😂 Klik link di atas sekarang dan amankan kursimu lur!

🎁 *INFO PROMO BUY 1 GET 1 (BOGO):*
Kuota promo: 1.000 tiket di TIX ID & 500 tiket di M-TIX (XXI) dibuka 15-18 November. Mau Mas Kidi amankan nomor sampean di Pengingat Prioritas H-1 via WA? Cukup infokan Nama Lengkap & Kota sampean ya lur! 🍿✨`;
      }

      return NextResponse.json({
        status: 'success',
        success: true,
        action: isPriceInquiry ? 'ticket_price_info' : 'get_ticket_links',
        estimatedPriceRange: isPriceInquiry ? 'Rp 30.000 – Rp 50.000' : undefined,
        ticketLinks: { xxi: xxiLink, tixid: tixidLink, cgv: cgvLink, cinepolis: cinepolisLink, website: siteOrigin },
        replyMessage: ticketReply
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
    const rawVenue = stopDetails.boothMall?.venue || matchedCity.boothInfo?.venue || `Mall Acara Roadshow ${matchedCity.name}`;
    const rawFloor = stopDetails.boothMall?.floor || matchedCity.boothInfo?.floor || 'Area Panggung Meet and Greet';
    const boothVenue = cleanVenueToMallName(rawVenue);
    const boothFloor = cleanVenueToMallName(rawFloor);
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
      replyMessage: `🎬 *KODE BOOKING ROADSHOW RESMI AKTIF!* 🎬\n\nHalo *${name}*, bolo nonton Kota ${matchedCity.name}! Mantap tenan lur! 😄\n${randomPantun}\n\n🎟️ *KODE BOOKING KAMU:* ${serialNumber}\n📥 *Buka & Download PDF Tiket:* ${voucherUrl}\n\n📍 *LOKASI PENUKARAN RESMI (BUKAN BIOSKOP):*\nPenukaran *BUKAN di area bioskop*, melainkan di booth resmi saat acara *Roadshow & Meet and Greet Offline*:\n• Acara: *Roadshow & Meet and Greet Kota ${matchedCity.name}*\n• Tempat: *${boothVenue}*\n• Area: *${boothFloor}*\n• Waktu: *${boothTime}* (${matchedCity.dateStr})\n• Cek Jadwal Lengkap di Web: ${siteOrigin}/city/${matchedCity.slug}\n\n🚫 *PERINGATAN PENTING:* DILARANG & TIDAK DILAYANI penukaran voucher di area bioskop maupun kasir bioskop! Penukaran HANYA di booth roadshow meet & greet offline.\n\n⚠️ Tunjukkan kode booking ini ke petugas booth roadshow offline untuk bayar Rp10.000 & ambil voucher fisik resminya.\n\n🔥 *EITS LUR! MAU NONTON DULUAN SEKARANG DI DALAM STUDIO BARENG PEMAIN?*\nSampean GAK PERLU nunggu sampai 19 November lur! Ada sesi *SPECIAL SCREENING (NONTON DULUAN)* bareng langsung rombongan Mukidi, Sukma, Gendut, dan Penyok di bioskop roadshow! Tiket presale sudah bisa dibeli sekarang lewat link ini:\n• Cinema XXI (M-TIX): ${xxiLink}\n• TIX ID: ${tixidLink}\n⚠️ *Kuota kursi per studio sangat terbatas lur!* Langsung amankan tiket sampean sekarang sebelum ludes ya! 🍿✨`
    }, { status: 200, headers: corsHeaders });

  } catch (err: any) {
    console.error('[Wahnotif Webhook Error]:', err);
    return NextResponse.json(
      { status: 'error', success: false, error: err.message || 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
