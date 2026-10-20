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

    const randomPantun = MAS_KIDI_PANTUN[Math.floor(Math.random() * MAS_KIDI_PANTUN.length)];
    const randomJoke = MAS_KIDI_JOKES[Math.floor(Math.random() * MAS_KIDI_JOKES.length)];

    let cinemaCityNote = '';
    if (requestedCity) {
      const slug = requestedCity.toLowerCase().trim();
      const matchedStop = Object.values(MASTER_ROADSHOW_STOPS).find(s =>
        s.cityName.toLowerCase().includes(slug) || slug.includes(s.slug)
      );
      if (matchedStop && matchedStop.cinemas?.length > 0) {
        cinemaCityNote = `\n🍿 *Bioskop Rekomendasi di ${matchedStop.cityName}:* ${matchedStop.cinemas.join(', ')}`;
      }
    }

    const replyMessage = `Halo bolo asik! Piye kabare? Pas banget lur! 😄
${randomPantun}

${randomJoke}

🎟️ *LINK LANGSUNG BELI TIKET & PROMO RESMI (TINGGAL KLIK LUR):*
Biar gak repot scroll atau ngetik nyari manual di aplikasi bioskop, ini Mas Kidi kasih link langsungnya:
• *Cinema XXI (M-TIX):* ${ticketLinks.xxi}
• *TIX ID:* ${ticketLinks.tixid}
• *CGV Cinemas:* ${ticketLinks.cgv}
• *Cinépolis:* ${ticketLinks.cinepolis}
• *Website Resmi & Info Kota:* ${ticketLinks.website}
${cinemaCityNote}

🎁 *INFO PROMO BUY 1 GET 1 (BOGO):*
Kuota promo: *1.000 tiket di TIX ID* dan *500 tiket di M-TIX (XXI)* untuk penayangan mulai 19 November 2026.
Biar gak kehabisan kuota pas dibuka, mau Mas Kidi amankan slot Notifikasi Pengingat Prioritas H-1 via WA? Cukup sebutkan Nama Lengkap & Kota sampean ya lur! 🍿✨`;

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
