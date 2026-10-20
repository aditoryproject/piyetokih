import { NextRequest, NextResponse } from 'next/server';
import { FAST_TRACK_TICKET_LINKS, MASTER_ROADSHOW_STOPS, MAS_KIDI_PANTUN, MAS_KIDI_JOKES } from '@/lib/bot-knowledge';
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
    if (requestedCity) {
      const slug = requestedCity.toLowerCase().trim();
      const matchedStop = Object.values(MASTER_ROADSHOW_STOPS).find(s =>
        s.cityName.toLowerCase().includes(slug) || slug.includes(s.slug)
      );
      if (matchedStop) {
        if (matchedStop.cinemas?.length > 0) {
          cinemaCityNote = `\n🍿 *Bioskop Rekomendasi di ${matchedStop.cityName}:* ${matchedStop.cinemas.join(', ')}`;
        }
        const cityOverride = db.settings.cityLinkOverrides?.[matchedStop.slug];
        if (cityOverride) {
          cityLinkNote = `\n🎟️ *Link Khusus Tiket ${matchedStop.cityName}:* ${cityOverride}`;
        }
      }
    }

    let replyMessage = '';

    if (isSpecialScreeningOrPresale) {
      // 1. High-Conversion Pitch for Nonton Duluan / Presale Special Screening
      replyMessage = `Halo bolo asik! Piye kabare? Pas banget lur! 😄
${randomPantun}

🎬 *MAU NONTON DULUAN SEBELUM 19 NOVEMBER? BISA BANGET LUR!* 🎬
Kabar gembira! Sampean GAK PERLU nunggu sampai penayangan reguler 19 November buat nonton film komedi layar lebar *"PIYE TO KIH?"*!

Ada sesi **NONTON DULUAN (SPECIAL SCREENING)** di bioskop rangkaian roadshow bareng langsung rombongan pemain (Mukidi, Sukma, Gendut, Penyok)!

🎟️ *LINK LANGSUNG BELI TIKET PRESALE / NONTON DULUAN (TINGGAL KLIK):*
• *Cinema XXI (M-TIX):* ${ticketLinks.xxi}
• *TIX ID:* ${ticketLinks.tixid}
• *CGV Cinemas:* ${ticketLinks.cgv}
• *Cinépolis:* ${ticketLinks.cinepolis}
• *Website Resmi & Info Kota:* ${ticketLinks.website}${cityLinkNote}${cinemaCityNote}

⚠️ *PENTING LUR:* Kuota kursi Nonton Duluan & Presale ini sangat terbatas per studio! Saran Mas Kidi, langsung klik link di atas dan amankan tiket sampean sekarang sebelum ludes ya lur ben gak gigit jari! 🍿✨`;

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
      // 3. Promo Buy 1 Get 1 before 15 Nov 2026 (Urge Registration + Offer Presale)
      replyMessage = `Halo bolo asik! Piye kabare? Pas banget lur! 😄
${randomPantun}

🎁 *INFO PROMO BUY 1 GET 1 (BOGO) PENAYANGAN PERDANA 19 NOVEMBER:*
Promo Buy 1 Get 1 film *"PIYE TO KIH?"* menyediakan kuota: *1.000 tiket di TIX ID* dan *500 tiket di Cinema XXI (M-TIX)*!

🗓️ *Jadwal War Tiket Promo:* Loket resmi baru dibuka pada *15 - 18 November 2026*.
Biar gak kehabisan kuota saat loket dibuka nanti, DAFTAR PENGINGAT PRIORITAS H-1 SEKARANG LUR! Mas Kidi bakal kirim link langsung ke WA sampean pas loket dibuka.

📲 *Format Daftar:* Cukup balas dengan sebutkan *Nama Lengkap & Kota* sampean ya lur!

🎟️ *TAPI KALAU PENGEN NONTON DULUAN SEBELUM 19 NOVEMBER:*
Sampean gak perlu nunggu tgl 19, tiket Presale Nonton Duluan (Special Screening) bareng cast di kota roadshow SUDAH BISA DIBELI SEKARANG lur lewat link ini:
• *Cinema XXI (M-TIX):* ${ticketLinks.xxi}
• *TIX ID:* ${ticketLinks.tixid}
• *Website Resmi:* ${ticketLinks.website}${cityLinkNote}${cinemaCityNote}`;

    } else {
      // 4. General Ticket Request: High-Converting Pitch
      replyMessage = `Halo bolo asik! Piye kabare? Pas banget lur! 😄
${randomPantun}

${randomJoke}

🎟️ *LINK LANGSUNG BELI TIKET & PRESALE RESMI (TINGGAL KLIK LUR):*
Biar gak repot buka aplikasi bioskop lalu nyari-nyari manual, ini Mas Kidi kasih link langsungnya:
• *Cinema XXI (M-TIX):* ${ticketLinks.xxi}
• *TIX ID:* ${ticketLinks.tixid}
• *CGV Cinemas:* ${ticketLinks.cgv}
• *Cinépolis:* ${ticketLinks.cinepolis}
• *Website Resmi & Info Kota:* ${ticketLinks.website}${cityLinkNote}${cinemaCityNote}

🎬 *MAU NONTON DULUAN SEBELUM 19 NOV?*
Ada sesi Special Screening Nonton Duluan bareng rombongan cast! Tiket presale sudah bisa langsung dibeli lewat link di atas (kuota kursi terbatas).

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
