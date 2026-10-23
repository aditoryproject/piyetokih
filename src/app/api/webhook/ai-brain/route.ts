import { NextRequest, NextResponse } from 'next/server';
import {
  MASTER_MOVIE_FACTS,
  MASTER_ROADSHOW_STOPS,
  FAST_TRACK_TICKET_LINKS,
  MAS_KIDI_JOKES
} from '@/lib/bot-knowledge';
import { getWahnotifPersona, WAHNOTIF_ALL_TOOLS } from '@/lib/wahnotif';
import { getDb } from '@/lib/db';

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
        isSpoiler: true,
        replyMessage: `Waduh lur, kalau yang itu masuk wilayah spoiler rahasia tingkat tinggi 😄\nBiar sensasi emosi, baper, dan lucunya tetap nampol pas nonton bareng kawan tongkrongan, temukan jawabannya langsung di bioskop 19 November 2026 nanti ya lur! 🍿✨\n\nNih link langsung pesan tiketnya: ${FAST_TRACK_TICKET_LINKS.xxi}`
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
        action: 'ticket_price_info',
        estimatedPriceRange: 'Rp 30.000 – Rp 50.000',
        replyMessage: `Halo bolo asik! Piye kabare? Pas banget lur! 😄

🍿 *RENTANG PERKIRAAN HARGA TIKET (HTM) FILM "PIYE TO KIH?":*
Untuk harga tiket nonton di bioskop, rentang perkiraannya ada di kisaran *Rp 30.000 sampai Rp 50.000* per tiket lur!
*(Besaran harga tiket ditentukan oleh pihak jaringan bioskop seperti XXI, CGV, Cinépolis, Platinum, NSC, sesuai kota dan hari tayang weekday atau weekend).*

Buat cek harga pasti di bioskop kotamu sekaligus langsung amankan kursi incaran sampean biar gak kehabisan, ini Mas Kidi kasih link langsung websitenya lur (tinggal klik sesuai yang ada di website):
🎟️ Cinema XXI (M-TIX): ${FAST_TRACK_TICKET_LINKS.xxi}
🎟️ TIX ID: ${FAST_TRACK_TICKET_LINKS.tixid}
🎟️ CGV Cinemas: ${FAST_TRACK_TICKET_LINKS.cgv}
🎟️ Cinépolis: ${FAST_TRACK_TICKET_LINKS.cinepolis}
🎟️ Website Resmi: ${FAST_TRACK_TICKET_LINKS.website}

🔥 *TIPS HEMAT DARI MAS KIDI:*
• Mau Nonton Duluan bareng cast sebelum 19 Nov? Tiket sesi Special Screening sudah bisa dibeli lewat link di atas lur!
• Buat penayangan serentak 19 November, bakal ada promo Buy 1 Get 1 di TIX ID & M-TIX juga lho!

Mukidi wae sing beda alam wani berjuang lur, mosok sampean tuku tiket wae nunda-nunda? 😂
Mau Mas Kidi bantu arahin beli di XXI atau TIX ID lur? 🍿✨`
      }, { status: 200, headers: corsHeaders });
    }

    return NextResponse.json({
      success: true,
      replyMessage: `Halo bolo asik! Piye kabare? Mas Kidi siap bantu informasi film komedi layar lebar PIYE TO KIH? persembahan MIRACLE Pictures! 😄\n\n${randomJoke}\n\nFilm PIYE TO KIH? tayang serentak di seluruh bioskop Indonesia mulai 19 NOVEMBER 2026!\n🎟️ *Link Beli Tiket Langsung:* ${FAST_TRACK_TICKET_LINKS.xxi} (M-TIX) | ${FAST_TRACK_TICKET_LINKS.tixid} (TIX ID)\n\nAda jadwal kota roadshow, voucher tebus murah Rp 10.000, promo Buy 1 Get 1, atau info cast yang pengin kamu tanyakan lur? 🍿`
    }, { status: 200, headers: corsHeaders });

  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', success: false, error: err.message || 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
