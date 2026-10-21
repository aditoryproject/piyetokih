import { NextRequest, NextResponse } from 'next/server';
import { FAST_TRACK_TICKET_LINKS, MASTER_ROADSHOW_STOPS, MAS_KIDI_PANTUN, MAS_KIDI_JOKES } from '@/lib/bot-knowledge';
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

    const now = new Date();
    const isBogoLive = now >= new Date(2026, 10, 15); // Dibuka 15 Nov 2026

    const randomPantun = MAS_KIDI_PANTUN[Math.floor(Math.random() * MAS_KIDI_PANTUN.length)];
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

    let replyMessage = '';

    if (isSpecialScreeningOrPresale) {
      // 1. High-Conversion Pitch for Nonton Duluan / Presale Special Screening
      const ticketBlock = cityCinemasList
        ? `🎟️ *LINK TIKET PRESALE SPECIAL SCREENING ${matchedCityName.toUpperCase() || 'KOTAMU'} (TINGGAL KLIK):*\n${cityCinemasList}\n• *Cek Rundown & Panggung:* ${ticketLinks.website}${matchedCitySlug ? `/city/${matchedCitySlug}` : ''}\n• *TIX ID:* ${ticketLinks.tixid}`
        : `🎟️ *LINK LANGSUNG BELI TIKET PRESALE / NONTON DULUAN (TINGGAL KLIK):*\n• *Cinema XXI (M-TIX):* ${ticketLinks.xxi}\n• *TIX ID:* ${ticketLinks.tixid}\n• *CGV Cinemas:* ${ticketLinks.cgv}\n• *Cinépolis:* ${ticketLinks.cinepolis}\n• *Website Resmi & Info Kota:* ${ticketLinks.website}${cityLinkNote}${cinemaCityNote}`;

      replyMessage = `Halo bolo asik! Piye kabare? Pas banget lur! 😄
${randomPantun}

🎬 *MAU NONTON DULUAN SEBELUM 19 NOVEMBER? BISA BANGET LUR!* 🎬
Kabar gembira! Sampean GAK PERLU nunggu sampai penayangan reguler 19 November buat nonton film komedi layar lebar *"PIYE TO KIH?"*!

Ada sesi **NONTON DULUAN (SPECIAL SCREENING)** di bioskop rangkaian roadshow bareng langsung rombongan pemain (Mukidi, Sukma, Gendut, Penyok)!

${ticketBlock}

⚠️ *PENTING LUR:* Kuota kursi Nonton Duluan & Presale ini sangat terbatas per studio! Baris tengah cepat penuh lur. Mukidi wae wani berjuang beda alam, mosok sampean tuku tiket wae ragu-ragu? 😂
Langsung klik link di atas dan amankan tiket sampean sekarang sebelum ludes ya lur! Mau Mas Kidi bantu arahin beli di XXI atau TIX ID? 🍿✨`;

    } else if (isBogoInquiry && isBogoLive) {
      // 2. Promo Buy 1 Get 1 on or after 15 Nov 2026 (Live War)
      replyMessage = `Halo bolo asik! Piye kabare? Kabar gembira lur! 😄
${randomPantun}

🔥 *WAR PROMO BUY 1 GET 1 (BOGO) RESMI DIBUKA HARI INI!* 🔥
Tiket promo Buy 1 Get 1 film *"PIYE TO KIH?"* sudah resmi dibuka untuk penayangan perdana 19 November 2026!

🎟️ *LINK LANGSUNG BELI TIKET PROMO BOGO (KLIK SEKARANG SEBELUM KUOTA HABIS):*
• *TIX ID (Kuota 1.000 Tiket):* ${ticketLinks.tixid}
• *Cinema XXI M-TIX (Kuota 500 Tiket):* ${ticketLinks.xxi}
• *CGV Cinemas:* ${ticketLinks.cgv}
• *Cinépolis:* ${ticketLinks.cinepolis}
• *Website Resmi:* ${ticketLinks.website}${cityLinkNote}${cinemaCityNote}

⚠️ Kuota promo sangat terbatas (1.000 di TIX ID & 500 di M-TIX), langsung klik link di atas sekarang juga ya lur ben gak kehabisan kuota! 🍿✨`;

    } else if (isBogoInquiry && !isBogoLive) {
      // 3. Promo Buy 1 Get 1 before 15 Nov 2026: UPSELL PRESALE ROADSHOW DULU!
      replyMessage = `Halo bolo asik! Piye kabare? Pas banget lur! 😄
${randomPantun}

🎟️ *MAU NONTON DULUAN SEKARANG BARENG PEMAIN TANPA PERLU NUNGGU?* 🎟️
Kenapa harus nunggu sampai 19 November kalau sekarang sampean bisa *NONTON DULUAN* bareng rombongan Mukidi, Sukma, Gendut, dan Penyok di sesi *SPECIAL SCREENING ROADSHOW*!
Tiket Presale Nonton Duluan sudah resmi dibuka dan bisa dibeli sekarang lewat link ini:
• *Cinema XXI (M-TIX):* ${ticketLinks.xxi}
• *TIX ID:* ${ticketLinks.tixid}
• *Website Resmi & Jadwal Kota:* ${ticketLinks.website}${cityLinkNote}${cinemaCityNote}
⚠️ *Kursi studio terbatas banget lur, amankan nomor kursi terbaik sampean sekarang sebelum ludes!*

🎁 *INFO PROMO BUY 1 GET 1 (BOGO) PENAYANGAN PERDANA 19 NOVEMBER:*
Kalau sampean tetep mau war promo Buy 1 Get 1 (kuota 1.000 tiket TIX ID & 500 tiket M-TIX), loket baru dibuka pada *15 - 18 November 2026*.
Biar gak kehabisan kuota pas loket dibuka nanti, DAFTAR PENGINGAT PRIORITAS H-1 SEKARANG LUR! Mas Kidi bakal kirim link langsung via WA pas dibuka!
📲 Cukup balas dengan sebutkan *Nama Lengkap & Kota* sampean ya lur! Mau Mas Kidi daftarkan sekarang? 🍿✨`;

    } else {
      // 4. General Ticket Request: UPSELL PRESALE FIRST + HARDSALE CLOSING
      const generalTicketBlock = cityCinemasList
        ? `🎟️ *LINK LANGSUNG BELI TIKET BIOSKOP ${matchedCityName.toUpperCase()} (TINGGAL KLIK LUR):*\n${cityCinemasList}\n• *Cek Rundown & Panggung:* ${ticketLinks.website}${matchedCitySlug ? `/city/${matchedCitySlug}` : ''}\n• *TIX ID:* ${ticketLinks.tixid}`
        : `🎟️ *LINK LANGSUNG BELI TIKET & PRESALE RESMI (TINGGAL KLIK LUR):*\nBiar gak repot buka aplikasi bioskop lalu nyari-nyari manual, ini Mas Kidi kasih link langsungnya:\n• *Cinema XXI (M-TIX):* ${ticketLinks.xxi}\n• *TIX ID:* ${ticketLinks.tixid}\n• *CGV Cinemas:* ${ticketLinks.cgv}\n• *Cinépolis:* ${ticketLinks.cinepolis}\n• *Website Resmi & Info Kota:* ${ticketLinks.website}${cityLinkNote}${cinemaCityNote}`;

      replyMessage = `Halo bolo asik! Piye kabare? Pas banget lur! 😄
${randomPantun}

${randomJoke}

🎬 *MAU NONTON DULUAN SEBELUM 19 NOVEMBER BARENG PEMAIN?*
Gak perlu nunggu sampai penayangan reguler lur! Ada sesi *SPECIAL SCREENING (NONTON DULUAN)* di bioskop kota roadshow bareng rombongan cast (Mukidi, Sukma, Gendut, Penyok)! Tiket presale sudah bisa langsung dibeli sekarang!

${generalTicketBlock}

⚠️ *PENTING LUR:* Kuota kursi studio cepat habis lur! Mukidi wae wani berjuang beda alam, mosok sampean tuku tiket wae nunda-nunda? 😂 Klik link di atas sekarang dan amankan kursimu lur!

🎁 *INFO PROMO BUY 1 GET 1 (BOGO):*
Kuota promo: *1.000 tiket di TIX ID* dan *500 tiket di M-TIX (XXI)* dibuka 15-18 November. Mau Mas Kidi amankan slot Notifikasi Pengingat Prioritas H-1 via WA? Cukup sebutkan Nama Lengkap & Kota sampean ya lur! 🍿✨`;
    }

    return NextResponse.json({
      success: true,
      ticketLinks,
      requestedCity: requestedCity || 'Nasional',
      requestedChain,
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
