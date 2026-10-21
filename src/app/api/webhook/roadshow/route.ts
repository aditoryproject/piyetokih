import { NextRequest, NextResponse } from 'next/server';
import { MASTER_ROADSHOW_STOPS, FAST_TRACK_TICKET_LINKS, MAS_KIDI_PANTUN } from '@/lib/bot-knowledge';
import { isCityRoadshowExpired, cleanVenueToMallName, getCityCinemaTicketLinks } from '@/lib/cities';
import { getDb } from '@/lib/db';
import { WAHNOTIF_TOOL_ROADSHOW_SCHEMA } from '@/lib/wahnotif';

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
    const normalizedCity = String(rawCity).toLowerCase().trim();

    const db = getDb();
    const manualExpired = db.settings.expiredRoadshowCities || [];

    // Find matching city from MASTER_ROADSHOW_STOPS
    let matchedSlug = Object.keys(MASTER_ROADSHOW_STOPS).find(slug => {
      const data = MASTER_ROADSHOW_STOPS[slug];
      const name = data.cityName.toLowerCase();
      return (
        normalizedCity === slug ||
        normalizedCity === name ||
        normalizedCity.includes(slug) ||
        normalizedCity.includes(name) ||
        slug.includes(normalizedCity) ||
        name.includes(normalizedCity)
      );
    });

    // Special match checks (e.g. jogja -> yogyakarta, solo -> surakarta)
    if (!matchedSlug) {
      if (normalizedCity.includes('jogja')) matchedSlug = 'yogyakarta';
      else if (normalizedCity.includes('solo')) matchedSlug = 'solo';
      else if (normalizedCity.includes('batu')) matchedSlug = 'malang';
    }

    const ticketLinks = {
      xxi: db.settings.bogoCinemaLinks?.xxi || FAST_TRACK_TICKET_LINKS.xxi,
      tixid: db.settings.bogoCinemaLinks?.tixid || FAST_TRACK_TICKET_LINKS.tixid,
      cgv: db.settings.bogoCinemaLinks?.cgv || FAST_TRACK_TICKET_LINKS.cgv,
      cinepolis: db.settings.bogoCinemaLinks?.cinepolis || FAST_TRACK_TICKET_LINKS.cinepolis,
      website: FAST_TRACK_TICKET_LINKS.website,
    };

    // If city is NOT in the 17 Roadshow cities (e.g. Bandung, Jakarta, Medan, Bali, etc)
    if (!matchedSlug) {
      const cityNameDisplay = rawCity ? String(rawCity).toUpperCase() : 'KOTA KAMU';
      return NextResponse.json({
        success: true,
        isRoadshowCity: false,
        cityName: cityNameDisplay,
        message: `Rangkaian roadshow temu pemain film PIYE TO KIH? saat ini fokus di 17 kota Jawa Tengah & Jawa Timur. Namun jangan khawatir, pada 19 NOVEMBER 2026 film PIYE TO KIH? TAYANG SERENTAK di seluruh bioskop ${cityNameDisplay} (XXI, CGV, Cinépolis)!`,
        ticketLinks,
        replyMessage: `Halo bolo asik di ${cityNameDisplay}! Piye kabare? 😄\nUntuk rangkaian roadshow temu cast saat ini memang lagi keliling 17 kota Jateng & Jatim lur.\n\n🍿 *TAPI TENANG! TANGGAL 19 NOVEMBER 2026 PIYE TO KIH? TAYANG SERENTAK DI BIOSKOP KOTAMU!*\n\n🎟️ *LINK LANGSUNG BELI TIKET BIOSKOP (TINGGAL KLIK):*\n• Cinema XXI (M-TIX): ${ticketLinks.xxi}\n• TIX ID: ${ticketLinks.tixid}\n• CGV: ${ticketLinks.cgv}\n• Cinépolis: ${ticketLinks.cinepolis}\n\nBakal ada Promo Buy 1 Get 1 (BOGO) juga lho! Mau Mas Kidi daftarkan nomor sampean buat Pengingat Prioritas H-1 via WA? Cukup infokan Nama Lengkap sampean ya lur! ✨`
      }, { status: 200, headers: corsHeaders });
    }

    const cityData = MASTER_ROADSHOW_STOPS[matchedSlug];
    const isExpired = isCityRoadshowExpired(cityData.dateStr, {
      cityName: cityData.cityName,
      manualExpiredCities: manualExpired,
    });

    // Random pantun
    const randomPantun = MAS_KIDI_PANTUN[Math.floor(Math.random() * MAS_KIDI_PANTUN.length)];

    // SCENARIO A: ROADSHOW CITY EXPIRED (Misal Semarang setelah 22 Okt)
    if (isExpired) {
      return NextResponse.json({
        success: true,
        isRoadshowCity: true,
        isExpired: true,
        cityName: cityData.cityName,
        dateStr: cityData.dateStr,
        ticketLinks,
        replyMessage: `Halo warga ${cityData.cityName} bolo kencengku! Piye kabare? 😄\n${randomPantun}\n\nMaaf banget lur, sesi roadshow temu pemain dan booth voucher fisik di ${cityData.cityName} kemarin (${cityData.dateStr}) sudah rampung terlaksana lur! Jadi penukaran voucher fisik di booth mall sudah selesai dan ditutup ya.\n\n🍿 *TAPI OJO CILIK ATI! MUKIDI WAE SING BEDA ALAM WANI BERJUANG, MOSOK SAMPEAN NONTON WAE PUTUS ASA?* 😂\nSampean tetap bisa nonton film PIYE TO KIH? serentak mulai *19 NOVEMBER 2026* di seluruh bioskop ${cityData.cityName} dengan *PROMO BUY 1 GET 1 (BOGO)*!\n\n🎟️ *LINK LANGSUNG BELI TIKET & PROMO (TINGGAL KLIK LUR):*\n• Cinema XXI (M-TIX): ${ticketLinks.xxi}\n• TIX ID: ${ticketLinks.tixid}\n• CGV: ${ticketLinks.cgv}\n• Cinépolis: ${ticketLinks.cinepolis}\n\nBiar gak kehabisan kuota pas presale dibuka, sini Mas Kidi amankan nomor sampean di Pengingat Prioritas WA. Boleh infokan Nama Lengkap sampean ya lur! ✨`
      }, { status: 200, headers: corsHeaders });
    }

    // SCENARIO B: ROADSHOW CITY ACTIVE / UPCOMING
    const scheduleFormatted = cityData.scheduleItems
      .map(item => `• *${item.time}*: ${item.activity} @ ${item.venue} [Status: ${item.status}]`)
      .join('\n');

    const rosterFormatted = cityData.rosterActual.join(', ');

    const cityCinemas = getCityCinemaTicketLinks(cityData.slug, db.settings.roadshowOverrides);
    const cityCinemasText = cityCinemas.length > 0
      ? `\n🎬 *TIKET PRESALE SPECIAL SCREENING BIOSKOP ${cityData.cityName.toUpperCase()}:*\n` +
        cityCinemas.map(c => `• ${c.cinemaName} (${c.showTimes.join(', ')}): ${c.ticketUrl}`).join('\n')
      : '';

    const replyMessage = `🎬 *JADWAL RESMI ROADSHOW PIYE TO KIH? — KOTA ${cityData.cityName.toUpperCase()}* 🎬

Halo warga ${cityData.cityName} bolo asikku! Piye kabare? 😄
${randomPantun}

Rombongan film PIYE TO KIH? bakal hadir seru-seruan di kotamu pada:
📅 *Tanggal:* ${cityData.dateStr}
👥 *Pemain yang Hadir:* ${rosterFormatted}
🎤 *Lead Sapaan:* ${cityData.leadSpeaker}

📋 *RUNDOWN JADWAL KEGIATAN:*
${scheduleFormatted}

📍 *LOKASI PENUKARAN VOUCHER (BOOTH ROADSHOW OFFLINE):*
${cityData.boothMall ? `• Acara: *Konter Booth Resmi Roadshow & Meet and Greet*\n• Tempat: *${cleanVenueToMallName(cityData.boothMall.venue)}*\n• Lokasi: *${cleanVenueToMallName(cityData.boothMall.floor)}*\n• Jam: *${cityData.boothMall.time}*` : '• Informasi booth penukaran mengikuti pengumuman resmi di website.'}

🚫 *PERINGATAN PENTING:* DILARANG & TIDAK DILAYANI penukaran voucher di area bioskop maupun kasir bioskop! Penukaran HANYA di booth roadshow meet & greet offline ya lur.
${cityCinemasText}
🎟️ *LINK TIKET PRESALE & JADWAL KOTA (TINGGAL KLIK):*
• Cek Rundown & Panggung: ${ticketLinks.website}/city/${cityData.slug}
• Cinema XXI (M-TIX): ${ticketLinks.xxi}
• TIX ID: ${ticketLinks.tixid}

🔥 *MAU NONTON DULUAN DI DALAM STUDIO BARENG PEMAIN?*
Kuota kursi Special Screening Nonton Duluan per studio sangat terbatas lur! Baris tengah cepat ludes. Mukidi wae sing beda alam wani berjuang, mosok sampean tuku tiket wae nunda-nunda? 😂 Klik link di atas dan amankan tiketmu sekarang lur!

Mau sekalian Mas Kidi amankan Kode Booking voucher fisik Rp10.000 buat diambil di konter booth roadshow lur? Boleh infokan Nama Lengkap & Nomor WhatsApp sampean ya! 🍿✨`;

    return NextResponse.json({
      success: true,
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
      ticketLinks,
      replyMessage
    }, { status: 200, headers: corsHeaders });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
