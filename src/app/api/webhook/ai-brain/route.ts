import { NextRequest, NextResponse } from 'next/server';
import {
  MASTER_MOVIE_FACTS,
  MASTER_ROADSHOW_STOPS,
  FAST_TRACK_TICKET_LINKS,
  MAS_KIDI_PANTUN,
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
    pantun_bank: MAS_KIDI_PANTUN,
    jokes_bank: MAS_KIDI_JOKES,
    sample_dialogs: persona.sampleDialogs
  }, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = String(body.query || body.message || body.text || '').toLowerCase();

    const randomPantun = MAS_KIDI_PANTUN[Math.floor(Math.random() * MAS_KIDI_PANTUN.length)];
    const randomJoke = MAS_KIDI_JOKES[Math.floor(Math.random() * MAS_KIDI_JOKES.length)];

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

    // Default friendly assistant response
    return NextResponse.json({
      success: true,
      replyMessage: `Halo bolo asik! Piye kabare? Mas Kidi siap bantu informasi film komedi layar lebar PIYE TO KIH? persembahan MIRACLE Pictures! 😄\n${randomPantun}\n\n${randomJoke}\n\nFilm PIYE TO KIH? tayang serentak di seluruh bioskop Indonesia mulai 19 NOVEMBER 2026!\n🎟️ *Link Beli Tiket Langsung:* ${FAST_TRACK_TICKET_LINKS.xxi} (M-TIX) | ${FAST_TRACK_TICKET_LINKS.tixid} (TIX ID)\n\nAda jadwal kota roadshow, promo Buy 1 Get 1, atau info cast yang pengin kamu tanyakan lur? 🍿`
    }, { status: 200, headers: corsHeaders });

  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', success: false, error: err.message || 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
