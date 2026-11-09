import { NextRequest, NextResponse } from 'next/server';
import { FAST_TRACK_TICKET_LINKS, MASTER_ROADSHOW_STOPS, MAS_KIDI_JOKES } from '@/lib/bot-knowledge';
import { getCityCinemaTicketLinks, getCityByNameOrSlug } from '@/lib/cities';
import { getDb } from '@/lib/db';
import { WAHNOTIF_TOOL_TICKETS_SCHEMA } from '@/lib/wahnotif';

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

  const db = getDb();
  const ticketLinks = {
    xxi: db.settings.bogoCinemaLinks?.xxi || FAST_TRACK_TICKET_LINKS.xxi,
    tixid: db.settings.bogoCinemaLinks?.tixid || FAST_TRACK_TICKET_LINKS.tixid,
    cgv: db.settings.bogoCinemaLinks?.cgv || FAST_TRACK_TICKET_LINKS.cgv,
    cinepolis: db.settings.bogoCinemaLinks?.cinepolis || FAST_TRACK_TICKET_LINKS.cinepolis,
    website: FAST_TRACK_TICKET_LINKS.website,
  };

  return NextResponse.json({
    status: 'active',
    success: true,
    webhook_name: 'Webhook Link Tiket Bioskop, Presale & Buy 1 Get 1 (Fast-Track Direct Links)',
    endpoint: `${effectiveOrigin}/api/webhook/tickets`,
    description: 'Menyediakan link resmi pembelian tiket bioskop langsung per platform (XXI M-TIX, TIX ID, CGV, Cinepolis) agar calon penonton tidak perlu mencari manual di aplikasi, serta status promo Buy 1 Get 1.',
    tool_schema: WAHNOTIF_TOOL_TICKETS_SCHEMA,
    ticket_links: ticketLinks,
    promo_bogo: {
      status: 'UPCOMING_PRESALE',
      allocation: '1.000 Tiket di TIX ID & 500 Tiket di M-TIX (XXI)',
      tagline: 'Nonton berdua, bayarnya cukup 1 tiket!',
      releaseDate: '19 November 2026'
    }
  }, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const args = body.arguments || body.parameters || body;

    const requestedCity = args.city || args.kota || '';
    const requestedChain = String(args.cinema_chain || args.bioskop || 'all').toLowerCase();

    const db = getDb();
    const ticketLinks = {
      xxi: db.settings.bogoCinemaLinks?.xxi || FAST_TRACK_TICKET_LINKS.xxi,
      tixid: db.settings.bogoCinemaLinks?.tixid || FAST_TRACK_TICKET_LINKS.tixid,
      cgv: db.settings.bogoCinemaLinks?.cgv || FAST_TRACK_TICKET_LINKS.cgv,
      cinepolis: db.settings.bogoCinemaLinks?.cinepolis || FAST_TRACK_TICKET_LINKS.cinepolis,
      website: FAST_TRACK_TICKET_LINKS.website,
    };

    const queryText = String(
      args.query ||
      args.message ||
      args.text ||
      args.prompt ||
      body.query ||
      body.message ||
      ''
    ).toLowerCase();

    const isSpecialScreeningOrPresale =
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
      queryText.includes('bogo') ||
      queryText.includes('buy 1 get 1') ||
      queryText.includes('beli 1 gratis 1') ||
      queryText.includes('gratis') ||
      queryText.includes('promo') ||
      args.type === 'bogo';

    const isPriceInquiry =
      queryText.includes('harga') ||
      queryText.includes('harganya') ||
      queryText.includes('htm') ||
      queryText.includes('biaya') ||
      queryText.includes('tarif') ||
      queryText.includes('berapaan') ||
      queryText.includes('berapa tiket') ||
      queryText.includes('berapa harga') ||
      (queryText.includes('berapa') && (queryText.includes('tiket') || queryText.includes('nonton') || queryText.includes('bayar')));

    const now = new Date();
    const isBogoLive = now >= new Date(2026, 10, 15); // Dibuka 15 Nov 2026

    const randomJoke = MAS_KIDI_JOKES[Math.floor(Math.random() * MAS_KIDI_JOKES.length)];

    let cinemaCityNote = '';
    let cityLinkNote = '';
    let cityCinemasList = '';
    let matchedCityName = '';
    let matchedCitySlug = '';

    const effectiveCity = getCityByNameOrSlug(requestedCity || queryText);
    if (effectiveCity) {
      matchedCityName = effectiveCity.name;
      matchedCitySlug = effectiveCity.slug;
      const cityCinemas = getCityCinemaTicketLinks(
        effectiveCity.slug,
        db.settings.roadshowOverrides,
        db.settings.cityLinkOverrides
      );
      if (cityCinemas.length > 0) {
        cityCinemasList = cityCinemas.map(c => {
          const times = c.showTimes.length > 0 ? ` (${c.showTimes.join(', ')})` : '';
          return `• *${c.cinemaName}*${times}:\n  👉 ${c.ticketUrl}`;
        }).join('\n');
        cinemaCityNote = `\n🍿 *Bioskop Khusus di ${effectiveCity.name}:*\n` + cityCinemasList;
      }
      const cityOverride = db.settings.cityLinkOverrides?.[effectiveCity.slug] || (effectiveCity.slug === 'jogja' ? db.settings.cityLinkOverrides?.['yogyakarta'] : undefined);
      if (cityOverride) {
        cityLinkNote = `\n🎟️ *Link Khusus Tiket ${effectiveCity.name}:* ${cityOverride}`;
      }
    }

    const presaleDates = db.settings.bogoPresaleDatesText || '12-18 November 2026';
    const bogoDates = db.settings.bogoPromoDatesText || '19-20 November 2026';

    let replyMessage = '';

    if (isPriceInquiry) {
      // 0. Ticket Price (HTM) Inquiry: Estimated Rp 30.000 - Rp 50.000 + Landing Page Links
      const priceTicketBlock = cityCinemasList
        ? `🎟️ *LINK CEK HARGA PASTI & BELI TIKET BIOSKOP ${matchedCityName.toUpperCase() || 'KOTAMU'} (TINGGAL KLIK):*\n${cityCinemasList}\n• *TIX ID:* ${ticketLinks.tixid}\n• *Website Resmi:* ${ticketLinks.website}`
        : `🎟️ *LINK LANGSUNG CEK HARGA & BELI TIKET BIOSKOP (TINGGAL KLIK):*\n• *Cinema XXI (M-TIX):* ${ticketLinks.xxi}\n• *TIX ID:* ${ticketLinks.tixid}\n• *CGV Cinemas:* ${ticketLinks.cgv}\n• *Cinépolis:* ${ticketLinks.cinepolis}\n• *Website Resmi & Info Kota:* ${ticketLinks.website}${cityLinkNote}${cinemaCityNote}`;

      replyMessage = `Halo bolo asik! Piye kabare? Pas banget lur! 😄

🍿 *RENTANG PERKIRAAN HARGA TIKET (HTM) FILM "PIYE TO KIH?":*
Untuk harga tiket nonton di bioskop pada penayangan serentak mulai **19 November 2026**, rentang perkiraannya ada di kisaran **Rp 30.000 sampai Rp 50.000** per tiket lur!
*(Besaran harga tiket ditentukan oleh pihak jaringan bioskop seperti XXI, CGV, Cinépolis, Platinum, NSC, Sam's Studio, Golden Theater menyesuaikan kota/lokasi dan hari tayang weekday atau weekend).*

Buat cek harga tiket pasti di bioskop kotamu sekaligus langsung amankan kursi incaran sampean biar gak kehabisan, ini Mas Kidi kasih tautan resmi bioskopnya lur:
${priceTicketBlock}

🔥 *TIPS HEMAT DARI MAS KIDI:*
• *Tiket Presale (${presaleDates}):* Amankan kursi tengah paling wenak lebih awal sebelum antrean penuh!
• *Promo Buy 1 Get 1 (${bogoDates}):* Beli 1 tiket harga reguler, gratis 1 tiket tambahan di TIX ID (1.000 kuota) & M-TIX XXI (500 kuota)! Mau Mas Kidi amankan slot Pengingat Prioritas WA? Cukup infokan Nama Lengkap & Kota sampean ya lur!

Langsung klik link di atas buat amankan kursi favorit sampean ya lur! 🍿✨`;

    } else if (isSpecialScreeningOrPresale) {
      // 1. Presale Inquiry (12-18 November 2026) for 19 November Release
      const ticketBlock = cityCinemasList
        ? `🎟️ *LINK TIKET PRESALE BIOSKOP ${matchedCityName.toUpperCase() || 'KOTAMU'} (TINGGAL KLIK):*\n${cityCinemasList}\n• *TIX ID:* ${ticketLinks.tixid}\n• *Website Resmi:* ${ticketLinks.website}`
        : `🎟️ *LINK LANGSUNG BELI TIKET PRESALE RESMI (TINGGAL KLIK):*\n• *Cinema XXI (M-TIX):* ${ticketLinks.xxi}\n• *TIX ID:* ${ticketLinks.tixid}\n• *CGV Cinemas:* ${ticketLinks.cgv}\n• *Cinépolis:* ${ticketLinks.cinepolis}\n• *Website Resmi & Info Kota:* ${ticketLinks.website}${cityLinkNote}${cinemaCityNote}`;

      replyMessage = `Halo bolo asik! Piye kabare? Pas banget lur! 😄

🎬 *JADWAL TIKET PRESALE & TAYANG SERENTAK "PIYE TO KIH? THE MOVIE":* 🎬
• **Presale Tiket Dibuka:** ${presaleDates}
• **Promo Buy 1 Get 1 (Beli 1 Gratis 1):** ${bogoDates} (Kuota 1.000 tiket di TIX ID & 500 tiket di M-TIX XXI!)
• **Tayang Serentak Nasional di Bioskop:** Mulai **19 NOVEMBER 2026**

${ticketBlock}

📲 Biar sampean langsung dikirimi notifikasi WA begitu loket Presale (${presaleDates}) & Promo Buy 1 Get 1 dibuka, mau Mas Kidi daftarkan nomor sampean ke **Pengingat Prioritas WA**? Cukup balas sebutkan **Nama Lengkap & Kota** sampean ya lur! 🍿✨`;

    } else if (isBogoInquiry && isBogoLive) {
      // 2. Promo Buy 1 Get 1 Live
      replyMessage = `Halo bolo asik! Piye kabare? Kabar gembira lur! 😄

🔥 *WAR PROMO BUY 1 GET 1 (BOGO) RESMI DIBUKA!* 🔥
Tiket promo Buy 1 Get 1 film *"PIYE TO KIH?"* sudah resmi dibuka untuk penayangan perdana **${bogoDates}**!

🎟️ *LINK LANGSUNG BELI TIKET PROMO BOGO (KLIK SEKARANG SEBELUM KUOTA HABIS):*
• *TIX ID (Kuota 1.000 Tiket):* ${ticketLinks.tixid}
• *Cinema XXI M-TIX (Kuota 500 Tiket):* ${ticketLinks.xxi}
• *CGV Cinemas:* ${ticketLinks.cgv}
• *Cinépolis:* ${ticketLinks.cinepolis}
• *Website Resmi:* ${ticketLinks.website}${cityLinkNote}${cinemaCityNote}

⚠️ Kuota promo sangat terbatas (1.000 di TIX ID & 500 di M-TIX), langsung klik link di atas sekarang juga ya lur ben gak kehabisan kuota! 🍿✨`;

    } else if (isBogoInquiry && !isBogoLive) {
      // 3. Promo Buy 1 Get 1 & Presale Info
      replyMessage = `Halo bolo asik! Piye kabare? Pas banget lur! 😄

🎁 *JADWAL RESMI PRESALE & PROMO BUY 1 GET 1 (BOGO):*
• **Presale Tiket Dibuka:** ${presaleDates}
• **Promo Buy 1 Get 1 (Nonton Berdua Bayar 1 Tiket):** ${bogoDates} (Kuota 1.000 tiket di TIX ID & 500 tiket di M-TIX XXI!)
• **Tayang Serentak di Bioskop:** Mulai **19 NOVEMBER 2026**

🎟️ *LINK LOKET TIKET BIOSKOP RESMI:*
• *Cinema XXI (M-TIX):* ${ticketLinks.xxi}
• *TIX ID:* ${ticketLinks.tixid}
• *Website Resmi & Info Kota:* ${ticketLinks.website}${cityLinkNote}${cinemaCityNote}

📲 Biar gak kehabisan kuota pas loket Presale (${presaleDates}) & Promo Buy 1 Get 1 dibuka nanti, DAFTAR PENGINGAT PRIORITAS WA SEKARANG LUR! Mas Kidi bakal japri link langsung via WA pas dibuka!
Cukup balas dengan sebutkan *Nama Lengkap & Kota* sampean ya lur! Mau Mas Kidi daftarkan sekarang? 🍿✨`;

    } else {
      // 4. General Ticket Request
      const generalTicketBlock = cityCinemasList
        ? `🎟️ *LINK LANGSUNG BELI TIKET BIOSKOP ${matchedCityName.toUpperCase()} (TINGGAL KLIK LUR):*\n${cityCinemasList}\n• *TIX ID:* ${ticketLinks.tixid}\n• *Website Resmi:* ${ticketLinks.website}`
        : `🎟️ *LINK LANGSUNG BELI TIKET & PRESALE RESMI (TINGGAL KLIK LUR):*\n• *Cinema XXI (M-TIX):* ${ticketLinks.xxi}\n• *TIX ID:* ${ticketLinks.tixid}\n• *CGV Cinemas:* ${ticketLinks.cgv}\n• *Cinépolis:* ${ticketLinks.cinepolis}\n• *Website Resmi & Info Kota:* ${ticketLinks.website}${cityLinkNote}${cinemaCityNote}`;

      replyMessage = `Halo bolo asik! Piye kabare? Pas banget lur! 😄

${randomJoke}

🎬 *JADWAL TAYANG SERENTAK & TIKET PRESALE "PIYE TO KIH? THE MOVIE":*
• **Presale Tiket Dibuka:** ${presaleDates}
• **Promo Buy 1 Get 1 (BOGO):** ${bogoDates} (Kuota 1.000 tiket di TIX ID & 500 tiket di M-TIX XXI)
• **Tayang Serentak Nasional di Bioskop:** Mulai **19 NOVEMBER 2026**

${generalTicketBlock}

📲 Mau Mas Kidi amankan nomor sampean di **Pengingat Prioritas WA** biar langsung dijapri saat loket Presale (${presaleDates}) & Promo Buy 1 Get 1 dibuka? Cukup sebutkan **Nama Lengkap & Kota** sampean ya lur! 🍿✨`;
    }

    return NextResponse.json({
      success: true,
      ticketLinks,
      requestedCity: requestedCity || 'Nasional',
      requestedChain,
      action: isPriceInquiry ? 'ticket_price_info' : 'get_ticket_links',
      estimatedPriceRange: isPriceInquiry ? 'Rp 30.000 – Rp 50.000' : undefined,
      promoBogoAllocation: '1.000 Tiket di TIX ID & 500 Tiket di M-TIX',
      nationalReleaseDate: '19 November 2026',
      replyMessage
    }, { status: 200, headers: corsHeaders });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
