import { NextRequest, NextResponse } from 'next/server';
import {
  MASTER_MOVIE_FACTS,
  MASTER_ROADSHOW_STOPS,
  FAST_TRACK_TICKET_LINKS,
  MAS_KIDI_JOKES
} from '@/lib/bot-knowledge';
import { getWahnotifPersona, WAHNOTIF_ALL_TOOLS, buildLiveWebsiteBotConfig } from '@/lib/wahnotif';
import { getDb } from '@/lib/db';
import { CITIES_DATA, isCityRoadshowExpired, getCityCinemaTicketLinks, getCityByNameOrSlug } from '@/lib/cities';
import { lookupNationalCinemaFlyers } from '@/lib/cinema-flyers';

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
    cgv: db.settings.bogoCinemaLinks?.cgv || '',
    cinepolis: db.settings.bogoCinemaLinks?.cinepolis || '',
    website: FAST_TRACK_TICKET_LINKS.website,
    presaleDatesText: db.settings.bogoPresaleDatesText || '12 November 2026',
    promoDatesText: db.settings.bogoPromoDatesText || '19-24 November 2026',
    showTixidButton: Boolean(db.settings.showTixidButton),
    showMtixButton: db.settings.showMtixButton !== false,
    isBogoReminderFormActive: Boolean(db.settings.isBogoReminderFormActive),
  };

  const persona = getWahnotifPersona(ticketLinks);

  return NextResponse.json({
    status: 'active',
    success: true,
    webhook_name: 'Webhook Otak AI CS Assistant & Master Knowledge Base',
    endpoint: `${effectiveOrigin}/api/webhook/ai-brain`,
    persona_name: persona.botName,
    role: persona.role,
    tone: persona.tone,
    systemPrompt: persona.systemPrompt,
    wahnotif_setup_boxes: {
      box1_konteksBisnis: persona.konteksBisnis,
      box2_teknikClosing: persona.teknikClosing,
      box3_karakterPersona: persona.karakterPersona,
      box4_dataPengetahuanFAQ: persona.dataPengetahuanFAQ,
    },
    tools_schemas: WAHNOTIF_ALL_TOOLS,
    master_facts: MASTER_MOVIE_FACTS,
    roadshow_17_cities: MASTER_ROADSHOW_STOPS,
    ticket_links: ticketLinks,
    jokes_bank: MAS_KIDI_JOKES,
    sample_dialogs: persona.sampleDialogs
  }, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = String(body.query || body.message || body.text || '').toLowerCase();

    const db = getDb();
    const origin = req.nextUrl.origin || 'https://piyetokihfilm.com';
    const effectiveOrigin = (origin.includes('localhost') || origin.includes('127.0.0.1'))
      ? 'https://piyetokihfilm.com'
      : origin;
    const liveConfig = buildLiveWebsiteBotConfig(db.settings, effectiveOrigin);

    const randomJoke = MAS_KIDI_JOKES[Math.floor(Math.random() * MAS_KIDI_JOKES.length)];

    // Check voucher tebus murah explanation (ANTI-DISKON / ANTI-POTONGAN)
    const isVoucherExplanationQuery =
      query.includes('10k') ||
      query.includes('10.000') ||
      query.includes('10rb') ||
      query.includes('10 ribu') ||
      query.includes('potongan') ||
      query.includes('diskon') ||
      query.includes('tebus murah') ||
      query.includes('tebus voucher') ||
      query.includes('cara kerja voucher') ||
      query.includes('voucher fisik') ||
      query.includes('kode booking');

    if (isVoucherExplanationQuery) {
      return NextResponse.json({
        success: true,
        action: 'voucher_tebus_murah_explained',
        isTebusMurah: true,
        replyMessage: `🎟️ *PROGRAM TEBUS MURAH TIKET BIOSKOP RP 10.000 (BUKAN POTONGAN / DISKON)!* 🎟️

Banyak yang ngira ini potongan harga atau diskon, padahal BUKAN lur! Ini murni program *TEBUS MURAH* tiket bioskop:

1️⃣ *Daftar / Booking Online:*
Sampean daftar online lewat WhatsApp ini atau website untuk dapat *Kode Booking* resmi.

2️⃣ *Tebus Lembaran Voucher Fisik di Booth Mall:*
Bawa kode booking ke *Booth Roadshow Meet & Greet Offline* di mall kota roadshow, lalu *tebus Rp 10.000* untuk mendapatkan lembaran *Voucher Fisik resmi*.

3️⃣ *Nonton di Bioskop Sebesar Harga Tiket Penuh:*
Lembaran voucher fisik itu dibawa ke kasir bioskop yang menayangkan film *PIYE TO KIH?* pada tanggal *19–20 November 2026*. Voucher ini berlaku *SEBESAR HARGA TIKET PENUH* di bioskop tersebut!
👉 *Sampean TIDAK PERLU bayar sisa tiket lagi di kasir bioskop!* (Jadi bukan potongan 10rb lalu bayar 30rb ya lur, itu SALAH BESAR!). Cukup bayar Rp10.000 pas nebus voucher fisik di booth roadshow, dan tiket bioskop sudah milik sampean seutuhnya! 🍿✨

⚠️ *PENTING BANGET LUR:*
• Kode booking di HP *TIDAK BISA* langsung dibawa ke kasir bioskop. Harus ditukarkan dulu jadi lembaran voucher fisik di booth mall roadshow!
• Kasir bioskop hanya menerima *lembaran voucher fisik resmi* saat penayangan 19–20 November 2026.

Mau Mas Kidi amankan Kode Booking voucher kotamu sekarang lur? Sebutkan nama kotamu ya! 😄`
      }, { status: 200, headers: corsHeaders });
    }

    // Check spoiler guardrail
    if (query.includes('ending') || query.includes('mati') || query.includes('arwah') || query.includes('spoiler') || query.includes('sukma')) {
      return NextResponse.json({
        success: true,
        important_ai_instruction: liveConfig.aiMandatoryInstruction,
        isSpoiler: true,
        ticketLinks: liveConfig.activeTicketLinks,
        replyMessage: `Waduh lur, kalau yang itu masuk wilayah spoiler rahasia tingkat tinggi 😄\nBiar sensasi emosi, baper, dan lucunya tetap nampol pas nonton bareng kawan tongkrongan, temukan jawabannya langsung di bioskop 19 November 2026 nanti ya lur! 🍿✨\n\n🎟️ *Link Beli Tiket Resmi:*\n${liveConfig.activeLinksText}`
      }, { status: 200, headers: corsHeaders });
    }

    // Check human / partnership handover
    const isPartnershipQuery =
      query.includes('partnership') ||
      query.includes('partner') ||
      query.includes('kolaborasi') ||
      query.includes('kerjasama') ||
      query.includes('kerja sama') ||
      query.includes('nobar') ||
      query.includes('nonton bareng') ||
      query.includes('sponsor') ||
      query.includes('media partner');

    const isHumanHandover =
      isPartnershipQuery ||
      query.includes('admin') ||
      query.includes('manusia') ||
      query.includes('orang') ||
      query.includes('operator') ||
      query.includes('cs manusia') ||
      query.includes('bicara sama cs') ||
      query.includes('ngomong sama admin') ||
      query.includes('berkomunikasi langsung') ||
      query.includes('bicara langsung') ||
      query.includes('hubungi tim') ||
      query.includes('pihak tim');

    if (isHumanHandover) {
      const replyMsg = isPartnershipQuery
        ? `Siap bolo asik! Mas Kidi sambungkan langsung obrolan ini ke Tim Partnership & Promosi Miracle Pictures ya lur. Tunggu sebentar nggih, tim kami bakal segera balas chat sampean langsung di sini! 🍿✨`
        : `Siap bolo asik! Mas Kidi sambungkan langsung obrolan ini ke Tim Admin Miracle Pictures ya lur. Tunggu sebentar nggih, admin kami bakal segera balas chat sampean langsung di sini! 🍿✨`;

      return NextResponse.json({
        success: true,
        isHumanHandover: true,
        replyMessage: replyMsg
      }, { status: 200, headers: corsHeaders });
    }

    // Check ticket price inquiry
    const isPriceQuery =
      query.includes('harga') ||
      query.includes('harganya') ||
      query.includes('htm') ||
      query.includes('biaya') ||
      query.includes('tarif') ||
      query.includes('berapaan') ||
      query.includes('berapa tiket') ||
      query.includes('berapa harga') ||
      (query.includes('berapa') && (query.includes('tiket') || query.includes('nonton') || query.includes('bayar')));

    if (isPriceQuery) {
      return NextResponse.json({
        success: true,
        important_ai_instruction: liveConfig.aiMandatoryInstruction,
        action: 'ticket_price_info',
        estimatedPriceRange: 'Rp 30.000 – Rp 50.000',
        ticketLinks: liveConfig.activeTicketLinks,
        replyMessage: `Halo bolo asik! Piye kabare? Pas banget lur! 😄

🍿 *RENTANG PERKIRAAN HARGA TIKET (HTM) FILM "PIYE TO KIH?":*
Untuk harga tiket nonton di bioskop mulai 19 November 2026, rentang perkiraannya ada di kisaran *Rp 30.000 sampai Rp 50.000* per tiket lur!
*(Besaran harga tiket ditentukan oleh pihak jaringan bioskop seperti XXI, CGV, Cinépolis, Platinum, NSC, Sam's Studio, Golden Theater sesuai kota dan hari tayang weekday atau weekend).*

📅 *JADWAL RESMI SESUAI WEBSITE:*
• *Presale Tiket Dibuka:* ${liveConfig.presaleDates}
• *Promo Buy 1 Get 1:* ${liveConfig.bogoDates}

🎟️ *LINK LANGSUNG BELI TIKET BIOSKOP (TINGGAL KLIK):*
${liveConfig.activeLinksText}

${liveConfig.closingActionText}`
      }, { status: 200, headers: corsHeaders });
    }

    // Check city / cinema inquiry first (live list, no flyer image)
    const flyerLookup = lookupNationalCinemaFlyers(query, effectiveOrigin, db.settings.nationalCinemaLocations);
    if (flyerLookup.found && db.settings.isRoadshowActive === false) {
      return NextResponse.json({
        success: true,
        important_ai_instruction: `${liveConfig.aiMandatoryInstruction}\n7. WAJIB sebutkan daftar bioskop berikut (TANPA mengirim gambar flyer): ${flyerLookup.cinemas.map(c => c.name).join(', ')} dan di bawahnya WAJIB tulis: "Untuk cek semua lokasi penayangan Piye To Kih?, kunjungi: ${effectiveOrigin}/lokasi-bioskop"`,
        action: 'city_cinema_schedule',
        cityName: flyerLookup.cityOrChainName,
        ticketLinks: liveConfig.activeTicketLinks,
        replyMessage: `Halo bolo asik di *${flyerLookup.cityOrChainName}*! Piye kabare lur? 😄\n\n🎬 *${flyerLookup.title.toUpperCase()}:*\nFilm *"PIYE TO KIH? THE MOVIE"* sedang tayang serentak mulai **19 NOVEMBER 2026** di:\n${flyerLookup.formattedCinemaList}\n\n📍 *Untuk cek semua lokasi penayangan Piye To Kih?, kunjungi:*\n👉 ${effectiveOrigin}/lokasi-bioskop\n\n📅 *JADWAL TIKET & PROMO:*\n• *Presale:* ${liveConfig.presaleDates}\n• *Promo Buy 1 Get 1:* ${liveConfig.bogoDates}\n\n🎟️ *LINK RESMI PEMBELIAN TIKET:*\n${liveConfig.activeLinksText}\n\n${liveConfig.closingActionText}`
      }, { status: 200, headers: corsHeaders });
    }

    // Check roadshow / city inquiry
    const detectedCityRes = getCityByNameOrSlug(query);
    const hasSpecificCity = Boolean(detectedCityRes && !['all', 'list', 'semua'].includes(detectedCityRes.slug));
    const isRoadshowQuery =
      hasSpecificCity ||
      query.includes('roadshow') ||
      query.includes('jadwal') ||
      query.includes('temu pemain') ||
      query.includes('temu cast') ||
      query.includes('meet and greet') ||
      query.includes('di kotaku') ||
      query.includes('kotaku dong') ||
      query.includes('kota mana') ||
      query.includes('mana saja');

    if (isRoadshowQuery) {
      const db = getDb();
      const origin = req.nextUrl.origin || 'https://piyetokihfilm.com';
      const effectiveOrigin = (origin.includes('localhost') || origin.includes('127.0.0.1'))
        ? 'https://piyetokihfilm.com'
        : origin;

      const ticketLinks = {
        xxi: db.settings.bogoCinemaLinks?.xxi || FAST_TRACK_TICKET_LINKS.xxi,
        tixid: db.settings.bogoCinemaLinks?.tixid || FAST_TRACK_TICKET_LINKS.tixid,
        cgv: db.settings.bogoCinemaLinks?.cgv || FAST_TRACK_TICKET_LINKS.cgv,
        cinepolis: db.settings.bogoCinemaLinks?.cinepolis || FAST_TRACK_TICKET_LINKS.cinepolis,
        website: FAST_TRACK_TICKET_LINKS.website,
      };

      if (hasSpecificCity && detectedCityRes) {
        const targetSlug = detectedCityRes.slug === 'jogja' ? 'yogyakarta' : detectedCityRes.slug;
        const cityData = MASTER_ROADSHOW_STOPS[targetSlug] || Object.values(MASTER_ROADSHOW_STOPS).find(s =>
          s.cityName.toLowerCase() === targetSlug.toLowerCase() ||
          s.cityName.toLowerCase() === detectedCityRes.name.toLowerCase()
        );

        if (cityData) {
          const isExpired = isCityRoadshowExpired(cityData.dateStr, {
            cityName: cityData.cityName,
            manualExpiredCities: db.settings.expiredRoadshowCities || [],
          });

          if (isExpired) {
            const cityCinemas = getCityCinemaTicketLinks(
              cityData.slug,
              db.settings.roadshowOverrides,
              db.settings.cityLinkOverrides
            );
            const cinemasNameList = cityCinemas.length > 0
              ? cityCinemas.map(c => c.cinemaName).join(', ')
              : `bioskop jaringan XXI, CGV, & Cinépolis ${cityData.cityName}`;

            return NextResponse.json({
              success: true,
              important_ai_instruction: liveConfig.aiMandatoryInstruction,
              action: 'roadshow_expired',
              isExpired: true,
              cityName: cityData.cityName,
              ticketLinks: liveConfig.activeTicketLinks,
              replyMessage: `Halo warga ${cityData.cityName} bolo kencengku! Piye kabare lur? 😄\n\n🎬 *INFO PENAYANGAN BIOSKOP ${cityData.cityName.toUpperCase()} — PIYE TO KIH? THE MOVIE:*\nFilm komedi *"PIYE TO KIH?"* tayang serentak mulai *19 NOVEMBER 2026* di bioskop ${cityData.cityName} (${cinemasNameList})!\n\n📍 *Untuk cek semua lokasi penayangan Piye To Kih?, kunjungi:*\n👉 ${effectiveOrigin}/lokasi-bioskop\n\n📅 *JADWAL TIKET & PROMO:*\n• *Presale Tiket Dibuka:* ${liveConfig.presaleDates}\n• *Promo Buy 1 Get 1 (BOGO):* ${liveConfig.bogoDates}\n\n🎟️ *LINK LANGSUNG TIKET & PROMO BIOSKOP (TINGGAL KLIK LUR):*\n${liveConfig.activeLinksText}\n\n${liveConfig.closingActionText}`
            }, { status: 200, headers: corsHeaders });
          }

          // Active / upcoming roadshow
          const scheduleFormatted = cityData.scheduleItems
            .map(item => `• *${item.time}*: ${item.activity} @ ${item.venue}`)
            .join('\n');

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
              `\n• Cek Rundown Lengkap: ${effectiveOrigin}/city/${cityData.slug}\n• TIX ID: ${ticketLinks.tixid}`;
          } else {
            cinemasTicketSection = `🎟️ *LINK BELI TIKET PRESALE:* Cinema XXI: ${ticketLinks.xxi} | TIX ID: ${ticketLinks.tixid}`;
          }

          return NextResponse.json({
            success: true,
            action: 'get_roadshow_schedule',
            cityName: cityData.cityName,
            dateStr: cityData.dateStr,
            roster: cityData.rosterActual,
            replyMessage: `🎬 *JADWAL RESMI ROADSHOW PIYE TO KIH? — KOTA ${cityData.cityName.toUpperCase()}* 🎬\n\nHalo warga ${cityData.cityName} bolo asikku! Piye kabare? 😄\n\nRombongan film PIYE TO KIH? bakal hadir di kotamu pada:\n📅 *Tanggal:* ${cityData.dateStr}\n👥 *Pemain yang Hadir:* ${cityData.rosterActual.join(', ')}\n\n📋 *RUNDOWN JADWAL KEGIATAN:*\n${scheduleFormatted}\n\n📍 *LOKASI PENUKARAN VOUCHER (BOOTH ROADSHOW OFFLINE):*\n• Acara: *Konter Booth Resmi Roadshow & Meet and Greet*\n${cityData.boothMall ? `• Lokasi: *${cityData.boothMall.venue}* (${cityData.boothMall.floor}) jam *${cityData.boothMall.time}*` : '• Jadwal & lokasi mengikuti rundown resmi di website.'}\n\n🚫 *PERINGATAN PENTING:* DILARANG & TIDAK DILAYANI penukaran voucher di area bioskop maupun kasir bioskop! Penukaran HANYA di booth roadshow meet & greet offline ya lur.\n\n${cinemasTicketSection}\n\n⚠️ *PENTING LUR:* Jam bioskop di atas adalah JAM FILM DIMULAI sesuai web bioskop. Penonton wajib masuk studio tepat waktu ya! Rombongan cast/pemain akan hadir langsung di studio untuk greeting, menyapa penonton, dan foto bareng saat film selesai (credit title).\n\nMau sekalian Mas Kidi amankan Kode Booking voucher fisik tebus murah Rp10.000 (berlaku seharga tiket penuh di bioskop) buat diambil di konter booth roadshow lur? Boleh infokan Nama Lengkap & Nomor WhatsApp sampean ya! 🍿✨`
          }, { status: 200, headers: corsHeaders });
        }
      }

      // General roadshow list inquiry
      const citiesFormatted = CITIES_DATA.map((c, idx) => {
        const extraNote = c.slug === 'kediri' ? ' — Puncak Home Premiere' : '';
        return `${idx + 1}. 📍 *${c.name}* (${c.dateStr})${extraNote}`;
      }).join('\n');

      return NextResponse.json({
        success: true,
        action: 'roadshow_general_list',
        replyMessage: `Halo bolo asik! Piye kabare? Pas banget lur! 😄\n\nWah mantap tenan semangatmu pengin ketemu Mas Kidi, Mukidi, lan rombongan cast film komedi "PIYE TO KIH? THE MOVIE"!\n\nBiar Mas Kidi cekkan jadwal roadshow, temu pemain, lan info bioskop terdekat, sampean rencana nonton di kota mana nih lur?\n\n🎬 *PILIHAN 17 KOTA ROADSHOW:*\n${citiesFormatted}\n\n🍿 *INFO PENTING BUAT BOLO ASIK:*\nDi 17 kota di atas, sampean bisa ikutan sesi **NONTON DULUAN (SPECIAL SCREENING)** di dalam studio bioskop bareng langsung rombongan cast sebelum tayang serentak 19 November!\n🎟️ Cinema XXI (M-TIX): ${ticketLinks.xxi}\n🎟️ TIX ID: ${ticketLinks.tixid}\n🎟️ CGV: ${ticketLinks.cgv}\n🎟️ Cinépolis: ${ticketLinks.cinepolis}\n🎟️ Cek Rundown Lengkap di Web: ${effectiveOrigin}/#roadshow\n\nSebutkan nama kotamu ya lur (misal: *Solo*, *Semarang*, *Jogja*, *Sragen*, dll), langsung Mas Kidi infokan detail jadwal lengkape! 🍿✨`
      }, { status: 200, headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      important_ai_instruction: liveConfig.aiMandatoryInstruction,
      ticketLinks: liveConfig.activeTicketLinks,
      replyMessage: `Halo bolo asik! Piye kabare? Mas Kidi siap bantu informasi film komedi layar lebar PIYE TO KIH? persembahan MIRACLE Pictures! 😄\n\n${randomJoke}\n\nFilm PIYE TO KIH? tayang serentak di seluruh bioskop Indonesia mulai 19 NOVEMBER 2026!\n• *Presale:* ${liveConfig.presaleDates}\n• *Promo Buy 1 Get 1:* ${liveConfig.bogoDates}\n\n🎟️ *Link Beli Tiket Langsung:*\n${liveConfig.activeLinksText}\n\n${liveConfig.closingActionText}`
    }, { status: 200, headers: corsHeaders });

  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', success: false, error: err.message || 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
