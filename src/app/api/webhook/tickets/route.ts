import { NextRequest, NextResponse } from 'next/server';
import { FAST_TRACK_TICKET_LINKS, MAS_KIDI_JOKES } from '@/lib/bot-knowledge';
import { getCityCinemaTicketLinks, getCityByNameOrSlug } from '@/lib/cities';
import { getDb } from '@/lib/db';
import { WAHNOTIF_TOOL_TICKETS_SCHEMA, buildLiveWebsiteBotConfig } from '@/lib/wahnotif';
import { lookupNationalCinemaFlyers, sendFlyerImageToWhatsAppIfPossible } from '@/lib/cinema-flyers';

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
  const liveConfig = buildLiveWebsiteBotConfig(db.settings, effectiveOrigin);

  return NextResponse.json({
    status: 'active',
    success: true,
    webhook_name: 'Webhook Link Tiket Bioskop, Presale & Buy 1 Get 1 (Live Website Sync)',
    endpoint: `${effectiveOrigin}/api/webhook/tickets`,
    description: 'Menyediakan link resmi pembelian tiket bioskop langsung yang sedang AKTIF (ON) di website (M-TIX XXI, TIX ID, dll.) beserta jadwal Presale & Buy 1 Get 1 real-time sesuai pengaturan Admin Website.',
    important_ai_instruction: liveConfig.aiMandatoryInstruction,
    tool_schema: WAHNOTIF_TOOL_TICKETS_SCHEMA,
    ticket_links: liveConfig.activeTicketLinks,
    promo_bogo: {
      isBogoActive: db.settings.isBogoActive !== false,
      presaleDates: liveConfig.presaleDates,
      bogoPromoDates: liveConfig.bogoDates,
      showTixidButton: liveConfig.showTixid,
      showMtixButton: liveConfig.showMtix,
      isReminderFormActive: liveConfig.isReminderFormActive,
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
    const liveConfig = buildLiveWebsiteBotConfig(db.settings, FAST_TRACK_TICKET_LINKS.website);
    const { presaleDates, bogoDates, activeLinksText, activeTicketLinks, closingActionText, showTixid } = liveConfig;

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

    const randomJoke = MAS_KIDI_JOKES[Math.floor(Math.random() * MAS_KIDI_JOKES.length)];

    let cinemaCityNote = '';
    let cityLinkNote = '';
    let cityCinemasList = '';
    let matchedCityName = '';

    const senderPhone = String(
      body._wahnotif_phone || body.phone || body.number || body.sender || args._wahnotif_phone || args.phone || args.number || ''
    ).trim();

    const flyerLookup = lookupNationalCinemaFlyers(
      `${requestedCity} ${requestedChain !== 'all' ? requestedChain : ''} ${queryText}`.trim(),
      FAST_TRACK_TICKET_LINKS.website
    );

    if (flyerLookup.found) {
      matchedCityName = flyerLookup.cityOrChainName;
      cityCinemasList = flyerLookup.formattedCinemaList;
      const flyerLinks = flyerLookup.flyerUrls.map((u, idx) => `🖼️ *Flyer Daftar Bioskop ${idx + 1}:* ${u}`).join('\n');
      cinemaCityNote = `\n\n🍿 *${flyerLookup.title}:*\n${cityCinemasList}\n${flyerLinks}`;

      await sendFlyerImageToWhatsAppIfPossible({
        phone: senderPhone,
        imageUrl: flyerLookup.primaryFlyerUrl,
        caption: `🎬 *${flyerLookup.title}*\n\n${flyerLookup.formattedCinemaList}`,
        apiKey: db.settings.wahnotifApiKey,
      });
    } else {
      const effectiveCity = getCityByNameOrSlug(requestedCity || queryText);
      if (effectiveCity) {
        matchedCityName = effectiveCity.name;
        const cityCinemas = getCityCinemaTicketLinks(
          effectiveCity.slug,
          db.settings.roadshowOverrides,
          db.settings.cityLinkOverrides
        );
        if (cityCinemas.length > 0) {
          cityCinemasList = cityCinemas.map(c => `• *${c.cinemaName}*`).join('\n');
          cinemaCityNote = `\n\n🍿 *Daftar Bioskop di ${effectiveCity.name}:*\n` + cityCinemasList;
        }
        const cityOverride = db.settings.cityLinkOverrides?.[effectiveCity.slug] || (effectiveCity.slug === 'jogja' ? db.settings.cityLinkOverrides?.['yogyakarta'] : undefined);
        if (cityOverride) {
          cityLinkNote = `\n• *Link Khusus ${effectiveCity.name}:* ${cityOverride}`;
        }
      }
    }

    const tixidScheduleNote = !showTixid
      ? `\n*(Catatan: Khusus pembelian promo di aplikasi TIX ID baru dibuka pada ${bogoDates}, sedangkan sekarang sampean sudah bisa langsung beli tiket lewat link resmi di atas lur!)*`
      : '';

    let replyMessage = '';

    if (isPriceInquiry) {
      replyMessage = `Halo bolo asik! Piye kabare? Pas banget lur! 😄

🍿 *RENTANG PERKIRAAN HARGA TIKET (HTM) FILM "PIYE TO KIH?":*
Untuk harga tiket nonton di bioskop pada penayangan serentak mulai **19 November 2026**, rentang perkiraannya ada di kisaran **Rp 30.000 sampai Rp 50.000** per tiket lur!
*(Besaran harga tiket ditentukan oleh pihak jaringan bioskop seperti XXI, CGV, Cinépolis, Platinum, NSC, Sam's Studio, Golden Theater menyesuaikan kota/lokasi dan hari tayang weekday atau weekend).*

📅 *JADWAL RESMI SESUAI WEBSITE:*
• **Presale Tiket Dibuka:** ${presaleDates}
• **Promo Buy 1 Get 1 (Nonton Berdua Bayar 1 Tiket):** ${bogoDates}
• **Tayang Serentak Nasional:** Mulai **19 NOVEMBER 2026**

🎟️ *LINK RESMI CEK HARGA & BELI TIKET SEKARANG (TINGGAL KLIK):*
${activeLinksText}${cityLinkNote}${cinemaCityNote}${tixidScheduleNote}

${closingActionText}`;

    } else if (isSpecialScreeningOrPresale || isBogoInquiry) {
      replyMessage = `Halo bolo asik! Piye kabare? Pas banget lur! 😄

🎬 *JADWAL RESMI PRESALE & PROMO BUY 1 GET 1 "PIYE TO KIH? THE MOVIE":* 🎬
• **Presale Tiket Dibuka:** ${presaleDates}
• **Promo Buy 1 Get 1 (Nonton Berdua Bayar 1 Tiket):** ${bogoDates}
• **Tayang Serentak Nasional di Bioskop:** Mulai **19 NOVEMBER 2026**

🎟️ *LINK LANGSUNG PEMBELIAN TIKET RESMI (TINGGAL KLIK):*
${activeLinksText}${cityLinkNote}${cinemaCityNote}${tixidScheduleNote}

${closingActionText}`;

    } else {
      replyMessage = `Halo bolo asik! Piye kabare? Pas banget lur! 😄

${randomJoke}

🎬 *JADWAL TAYANG SERENTAK & TIKET PRESALE "PIYE TO KIH? THE MOVIE":*
• **Presale Tiket Dibuka:** ${presaleDates}
• **Promo Buy 1 Get 1 (Beli 1 Gratis 1):** ${bogoDates}
• **Tayang Serentak Nasional di Bioskop:** Mulai **19 NOVEMBER 2026**

🎟️ *LINK LANGSUNG PEMBELIAN TIKET RESMI (TINGGAL KLIK LUR):*
${activeLinksText}${cityLinkNote}${cinemaCityNote}${tixidScheduleNote}

${closingActionText}`;
    }

    return NextResponse.json({
      success: true,
      important_ai_instruction: flyerLookup.found
        ? `${liveConfig.aiMandatoryInstruction}\n7. WAJIB sebutkan daftar bioskop dari Flyer Resmi berikut: ${flyerLookup.cinemas.map(c => c.name).join(', ')} serta sertakan link flyer: ${flyerLookup.primaryFlyerUrl}`
        : liveConfig.aiMandatoryInstruction,
      ticketLinks: activeTicketLinks,
      presaleDates,
      bogoPromoDates: bogoDates,
      showTixidButton: liveConfig.showTixid,
      showMtixButton: liveConfig.showMtix,
      isReminderFormActive: liveConfig.isReminderFormActive,
      requestedCity: matchedCityName || requestedCity || 'Nasional',
      requestedChain,
      cinemas: flyerLookup.found ? flyerLookup.cinemas : undefined,
      imageUrl: flyerLookup.primaryFlyerUrl,
      image_url: flyerLookup.primaryFlyerUrl,
      mediaUrl: flyerLookup.primaryFlyerUrl,
      flyerUrls: flyerLookup.flyerUrls,
      action: isPriceInquiry ? 'ticket_price_info' : 'get_ticket_links',
      estimatedPriceRange: isPriceInquiry ? 'Rp 30.000 – Rp 50.000' : undefined,
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
