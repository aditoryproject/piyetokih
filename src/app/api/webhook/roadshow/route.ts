import { NextRequest, NextResponse } from 'next/server';
import { MASTER_ROADSHOW_STOPS, FAST_TRACK_TICKET_LINKS } from '@/lib/bot-knowledge';
import { CITIES_DATA, isCityRoadshowExpired, cleanVenueToMallName, getCityCinemaTicketLinks, getCityByNameOrSlug } from '@/lib/cities';
import { getDb } from '@/lib/db';
import { WAHNOTIF_TOOL_ROADSHOW_SCHEMA, buildLiveWebsiteBotConfig } from '@/lib/wahnotif';
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

  return NextResponse.json({
    status: 'active',
    success: true,
    webhook_name: 'Webhook Jadwal & Roster Cast Roadshow 17 Kota',
    endpoint: `${effectiveOrigin}/api/webhook/roadshow`,
    description: 'Mengambil jadwal rundown lengkap per kota, jam acara (sekolah, kampus, radio, meet & greet mall, bioskop greeting / nonton duluan), lokasi penukaran voucher fisik Rp10.000, serta roster pemain/cast yang hadir di kota tersebut.',
    tool_schema: WAHNOTIF_TOOL_ROADSHOW_SCHEMA,
    available_cities: Object.keys(MASTER_ROADSHOW_STOPS).map(slug => ({
      slug,
      name: MASTER_ROADSHOW_STOPS[slug].cityName,
      date: MASTER_ROADSHOW_STOPS[slug].dateStr,
      leadSpeaker: MASTER_ROADSHOW_STOPS[slug].leadSpeaker,
      roster: MASTER_ROADSHOW_STOPS[slug].rosterActual
    }))
  }, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const args = body.arguments || body.parameters || body;

    const rawCity = args.city || args.kota || args.query || args.message || '';
    const cleanCityStr = String(rawCity).toLowerCase().trim();
    const normalizedCity = cleanCityStr
      .replace(/\bkpn\b/g, 'kapan')
      .replace(/\bdimna\b/g, 'dimana')
      .replace(/\bdmn\b/g, 'dimana')
      .replace(/\bdmana\b/g, 'dimana');

    const db = getDb();
    const manualExpired = db.settings.expiredRoadshowCities || [];
    const liveConfig = buildLiveWebsiteBotConfig(db.settings, FAST_TRACK_TICKET_LINKS.website);
    const { presaleDates, bogoDates, activeLinksText, activeTicketLinks, closingActionText, aiMandatoryInstruction } = liveConfig;

    const senderPhone = String(
      body._wahnotif_phone || body.phone || body.number || body.sender || args._wahnotif_phone || args.phone || args.number || ''
    ).trim();

    // Lookup against the 9 Official Cinema List Flyers (95+ Cities & All Cinema Chains)
    const flyerLookup = lookupNationalCinemaFlyers(normalizedCity || cleanCityStr, FAST_TRACK_TICKET_LINKS.website);
    const isRoadshowModeOff = db.settings.isRoadshowActive === false;

    // If Roadshow Mode is OFF and we found a matching city or cinema chain in the 9 Official Flyers:
    if (isRoadshowModeOff && flyerLookup.found) {
      const flyerLinksBlock = flyerLookup.flyerUrls.map((u, idx) => `🖼️ *Lihat Flyer Daftar Bioskop ${idx + 1}:* ${u}`).join('\n');

      // Auto-send flyer image directly to user's WhatsApp if phone is present
      await sendFlyerImageToWhatsAppIfPossible({
        phone: senderPhone,
        imageUrl: flyerLookup.primaryFlyerUrl,
        caption: `🎬 *${flyerLookup.title}*\n\n${flyerLookup.formattedCinemaList}\n\n📅 Tayang Serentak: Mulai *19 NOVEMBER 2026*`,
        apiKey: db.settings.wahnotifApiKey,
      });

      const replyMessage = `Halo bolo asik di *${flyerLookup.cityOrChainName}*! Piye kabare lur? 😄

🎬 *${flyerLookup.title.toUpperCase()}:*
Film komedi keluarga *"PIYE TO KIH? THE MOVIE"* resmi tayang serentak mulai **19 NOVEMBER 2026** di bioskop:
${flyerLookup.formattedCinemaList}

🖼️ *FLYER RESMI DAFTAR BIOSKOP:*
${flyerLinksBlock}

📅 *JADWAL PENTING TIKET & PROMO:*
• **Presale Tiket Dibuka:** ${presaleDates}
• **Promo Buy 1 Get 1 (Nonton Berdua Bayar 1 Tiket):** ${bogoDates}
• **Tayang Serentak di Bioskop:** Mulai 19 November 2026

🎟️ *LINK RESMI PEMBELIAN TIKET (TINGGAL KLIK LUR):*
${activeLinksText}

${closingActionText}`;

      return NextResponse.json({
        success: true,
        important_ai_instruction: `${aiMandatoryInstruction}\n7. WAJIB sebutkan daftar bioskop dari Flyer Resmi berikut: ${flyerLookup.cinemas.map(c => c.name).join(', ')} serta sertakan link flyer: ${flyerLookup.primaryFlyerUrl}`,
        isRoadshowCity: true,
        isExpired: true,
        cityName: flyerLookup.cityOrChainName,
        releaseDate: '19 November 2026',
        presaleDates,
        bogoDates,
        cinemas: flyerLookup.cinemas,
        imageUrl: flyerLookup.primaryFlyerUrl,
        image_url: flyerLookup.primaryFlyerUrl,
        mediaUrl: flyerLookup.primaryFlyerUrl,
        flyerUrls: flyerLookup.flyerUrls,
        ticketLinks: activeTicketLinks,
        replyMessage
      }, { status: 200, headers: corsHeaders });
    }

    // Check first if user is asking for general roadshow list, all cities, or temu cast in general
    const isGeneralCityQuery =
      !normalizedCity ||
      normalizedCity === 'all' ||
      normalizedCity === 'list' ||
      normalizedCity === 'semua' ||
      normalizedCity.includes('mana') ||
      normalizedCity.includes('mna') ||
      normalizedCity.includes('kota') ||
      normalizedCity.includes('bioskop') ||
      normalizedCity.includes('lokasi') ||
      normalizedCity.includes('temu') ||
      normalizedCity.includes('cast') ||
      normalizedCity.includes('jadwal') ||
      normalizedCity.includes('daftar') ||
      normalizedCity.includes('rundown');

    // SCENARIO 0: GENERAL CITIES & CINEMA SCHEDULE INQUIRY (ALL 9 FLYERS)
    const effectiveCity = getCityByNameOrSlug(normalizedCity);
    if (!effectiveCity && isGeneralCityQuery) {
      await sendFlyerImageToWhatsAppIfPossible({
        phone: senderPhone,
        imageUrl: flyerLookup.primaryFlyerUrl,
        caption: `🎬 *Daftar Lengkap Bioskop Penayangan Serentak 19 November 2026 — PIYE TO KIH? THE MOVIE*`,
        apiKey: db.settings.wahnotifApiKey,
      });

      const allFlyersBlock = flyerLookup.flyerUrls.map((u, idx) => `• Flyer ${idx + 1}: ${u}`).join('\n');

      const replyMessage = `Halo bolo asik! Piye kabare? Pas banget lur! 😄

🎬 *DAFTAR LENGKAP BIOSKOP PENAYANGAN SERENTAK 19 NOVEMBER 2026 — "PIYE TO KIH? THE MOVIE":*
${flyerLookup.formattedCinemaList}

🖼️ *LIHAT FLYER RESMI DAFTAR BIOSKOP:*
${allFlyersBlock}

📅 *CATAT TANGGAL PENTINGNYA LUR:*
• **Presale Tiket Dibuka:** ${presaleDates}
• **Promo Buy 1 Get 1 (Beli 1 Gratis 1):** ${bogoDates}
• **Tayang Serentak di Bioskop:** Mulai 19 November 2026

🎟️ *LINK RESMI PEMBELIAN TIKET BIOSKOP (TINGGAL KLIK):*
${activeLinksText}

Sampean rencana nonton di kota mana nih lur? Sebutkan nama kotamu ya, langsung Mas Kidi cekkan nama bioskop & kirimkan flyernya! 🍿✨`;

      return NextResponse.json({
        success: true,
        important_ai_instruction: aiMandatoryInstruction,
        isRoadshowCity: true,
        isGeneralList: true,
        releaseDate: '19 November 2026',
        presaleDates,
        bogoDates,
        imageUrl: flyerLookup.primaryFlyerUrl,
        image_url: flyerLookup.primaryFlyerUrl,
        mediaUrl: flyerLookup.primaryFlyerUrl,
        flyerUrls: flyerLookup.flyerUrls,
        ticketLinks: activeTicketLinks,
        replyMessage
      }, { status: 200, headers: corsHeaders });
    }

    // SCENARIO 1: FIND MATCHING SPECIFIC CITY
    let matchedSlug = effectiveCity?.slug === 'jogja' ? 'yogyakarta' : effectiveCity?.slug;

    if (!matchedSlug) {
      matchedSlug = Object.keys(MASTER_ROADSHOW_STOPS).find(slug => {
        const data = MASTER_ROADSHOW_STOPS[slug];
        const name = data.cityName.toLowerCase();
        return (
          normalizedCity === slug ||
          normalizedCity === name ||
          (normalizedCity.length >= 4 && (normalizedCity.includes(slug) || normalizedCity.includes(name)))
        );
      });
    }

    // Special match checks (e.g. jogja/amplaz -> yogyakarta, solo/paragon -> solo)
    if (!matchedSlug) {
      if (normalizedCity.includes('jogja') || normalizedCity.includes('amplaz') || normalizedCity.includes('ambarrukmo')) matchedSlug = 'yogyakarta';
      else if (normalizedCity.includes('solo') || normalizedCity.includes('paragon')) matchedSlug = 'solo';
      else if (normalizedCity.includes('batu') || normalizedCity.includes('matos')) matchedSlug = 'malang';
      else if (normalizedCity.includes('smg') || normalizedCity.includes('java mall')) matchedSlug = 'semarang';
      else if (normalizedCity.includes('artos')) matchedSlug = 'magelang';
    }

    // If city is outside the 17 cities (e.g. Bandung, Jakarta, Medan, Bali, etc)
    if (!matchedSlug) {
      const cityNameDisplay = rawCity ? String(rawCity).toUpperCase() : 'KOTA KAMU';
      return NextResponse.json({
        success: true,
        important_ai_instruction: aiMandatoryInstruction,
        isRoadshowCity: false,
        cityName: cityNameDisplay,
        releaseDate: '19 November 2026',
        presaleDates,
        bogoDates,
        message: `Film PIYE TO KIH? TAYANG SERENTAK mulai 19 NOVEMBER 2026 di seluruh bioskop ${cityNameDisplay}! Presale dibuka ${presaleDates} & Promo Buy 1 Get 1 pada ${bogoDates}.`,
        ticketLinks: activeTicketLinks,
        replyMessage: `Halo bolo asik di ${cityNameDisplay}! Piye kabare? 😄\n\n🍿 *KABAR GEMBIRA! FILM "PIYE TO KIH? THE MOVIE" TAYANG SERENTAK MULAI 19 NOVEMBER 2026 DI BIOSKOP ${cityNameDisplay}!*\n\n📅 *JADWAL PENTING TIKET & PROMO:*\n• **Presale Tiket Dibuka:** ${presaleDates}\n• **Promo Buy 1 Get 1 (Beli 1 Gratis 1):** ${bogoDates}\n• **Tayang Serentak:** Mulai 19 November 2026\n\n🎟️ *LINK LANGSUNG BELI TIKET BIOSKOP (TINGGAL KLIK):*\n${activeLinksText}\n\n${closingActionText}`
      }, { status: 200, headers: corsHeaders });
    }

    const cityData = MASTER_ROADSHOW_STOPS[matchedSlug];
    const isExpired = isRoadshowModeOff || isCityRoadshowExpired(cityData.dateStr, {
      cityName: cityData.cityName,
      manualExpiredCities: manualExpired,
    });

    // SCENARIO A: POST-ROADSHOW / TAYANG SERENTAK 19 NOVEMBER (DEFAULT CURRENT PHASE)
    if (isExpired) {
      const cityCinemas = getCityCinemaTicketLinks(
        cityData.slug,
        db.settings.roadshowOverrides,
        db.settings.cityLinkOverrides
      );
      const cinemasNameList = cityCinemas.length > 0
        ? cityCinemas.map(c => `• *${c.cinemaName}*`).join('\n')
        : `• *Bioskop jaringan XXI, CGV, & Cinépolis ${cityData.cityName}*`;

      return NextResponse.json({
        success: true,
        important_ai_instruction: aiMandatoryInstruction,
        isRoadshowCity: true,
        isExpired: true,
        cityName: cityData.cityName,
        releaseDate: '19 November 2026',
        presaleDates,
        bogoDates,
        ticketLinks: activeTicketLinks,
        replyMessage: `Halo warga ${cityData.cityName} bolo kencengku! Piye kabare lur? 😄\n\n🎬 *INFO PENAYANGAN BIOSKOP ${cityData.cityName.toUpperCase()} — PIYE TO KIH? THE MOVIE:*\nFilm komedi keluarga *"PIYE TO KIH?"* tayang serentak mulai **19 NOVEMBER 2026** di bioskop kesayangan warga ${cityData.cityName}:\n${cinemasNameList}\n\n📅 *JADWAL PENTING TIKET & PROMO:*\n• **Presale Tiket Dibuka:** ${presaleDates}\n• **Promo Buy 1 Get 1 (Nonton Berdua Bayar 1 Tiket):** ${bogoDates}\n• **Tayang Serentak:** Mulai 19 November 2026\n\n🎟️ *LINK LANGSUNG TIKET & PROMO BIOSKOP (TINGGAL KLIK LUR):*\n${activeLinksText}\n\n${closingActionText}`
      }, { status: 200, headers: corsHeaders });
    }

    // SCENARIO B: ROADSHOW CITY ACTIVE / UPCOMING
    const scheduleFormatted = cityData.scheduleItems
      .map(item => `• *${item.time}*: ${item.activity} @ ${item.venue} [Status: ${item.status}]`)
      .join('\n');

    const rosterFormatted = cityData.rosterActual.join(', ');

    const cityCinemas = getCityCinemaTicketLinks(
      cityData.slug,
      db.settings.roadshowOverrides,
      db.settings.cityLinkOverrides
    );

    let cinemasTicketSection = '';
    if (cityCinemas.length > 0) {
      cinemasTicketSection = `🎟️ *LINK INFORMASI & TIKET PRESALE (SPECIAL SCREENING):*\n` +
        cityCinemas.map(c => {
          const times = c.showTimes.length > 0 ? ` (${c.showTimes.join(', ')})` : '';
          return `• *${c.cinemaName}*${times}:\n  👉 ${c.ticketUrl}`;
        }).join('\n') +
        `\n${activeLinksText}`;
    } else {
      cinemasTicketSection = `🎟️ *LINK INFORMASI & TIKET PRESALE (SPECIAL SCREENING):*\n${activeLinksText}`;
    }

    const replyMessage = `🎬 *JADWAL RESMI ROADSHOW PIYE TO KIH? — KOTA ${cityData.cityName.toUpperCase()}* 🎬

Halo warga ${cityData.cityName} bolo asikku! Piye kabare? 😄

Rombongan film PIYE TO KIH? bakal hadir seru-seruan di kotamu pada:
📅 *Tanggal:* ${cityData.dateStr}
👥 *Pemain yang Hadir:* ${rosterFormatted}
🎤 *Lead Sapaan:* ${cityData.leadSpeaker}

📋 *RUNDOWN JADWAL KEGIATAN:*
${scheduleFormatted}

📍 *LOKASI PENUKARAN VOUCHER (BOOTH ROADSHOW OFFLINE):*
${cityData.boothMall ? `• Acara: *Konter Booth Resmi Roadshow & Meet and Greet*\n• Tempat: *${cleanVenueToMallName(cityData.boothMall.venue)}*\n• Lokasi: *${cleanVenueToMallName(cityData.boothMall.floor)}*\n• Jam: *${cityData.boothMall.time}*` : '• Informasi booth penukaran mengikuti pengumuman resmi di website.'}

🚫 *PERINGATAN PENTING:* DILARANG & TIDAK DILAYANI penukaran voucher di area bioskop maupun kasir bioskop! Penukaran HANYA di booth roadshow meet & greet offline ya lur.

${cinemasTicketSection}

⚠️ *CATATAN PENTING SPECIAL SCREENING:*
• Jam bioskop yang tertera adalah **JAM FILM DIMULAI** sesuai web bioskop. Pastikan masuk studio tepat waktu ya lur!
• Rombongan cast/pemain akan hadir langsung di dalam studio untuk greeting, menyapa penonton, ngobrol santai, dan foto bareng saat film selesai (credit title berlangsung).

🔥 *MAU NONTON DULUAN DI DALAM STUDIO BARENG PEMAIN?*
Kuota kursi Special Screening Nonton Duluan per studio sangat terbatas lur! Baris tengah cepat ludes. Klik link di atas dan amankan tiketmu sekarang ya lur!

Mau sekalian Mas Kidi amankan Kode Booking voucher fisik tebus murah Rp10.000 (berlaku seharga tiket penuh di bioskop tanpa biaya tambahan) buat diambil di konter booth roadshow lur? Boleh infokan Nama Lengkap & Nomor WhatsApp sampean ya! 🍿✨`;

    return NextResponse.json({
      success: true,
      important_ai_instruction: aiMandatoryInstruction,
      isRoadshowCity: true,
      isExpired: false,
      stopNumber: cityData.stopNumber,
      cityName: cityData.cityName,
      dateStr: cityData.dateStr,
      leadSpeaker: cityData.leadSpeaker,
      roster: cityData.rosterActual,
      blockingNote: cityData.blockingNote,
      openingLine: cityData.openingLine,
      endingCtaLine: cityData.endingCtaLine,
      boothMall: cityData.boothMall,
      scheduleItems: cityData.scheduleItems,
      cinemas: cityData.cinemas,
      ticketLinks: activeTicketLinks,
      replyMessage
    }, { status: 200, headers: corsHeaders });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
