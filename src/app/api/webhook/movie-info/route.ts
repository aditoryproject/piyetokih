import { NextRequest, NextResponse } from 'next/server';
import { MASTER_MOVIE_FACTS, FAST_TRACK_TICKET_LINKS, MAS_KIDI_PANTUN } from '@/lib/bot-knowledge';
import { WAHNOTIF_TOOL_MOVIE_SCHEMA } from '@/lib/wahnotif';

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
    webhook_name: 'Webhook Informasi Film, Sinopsis, Cast, Soundtrack & Bioskop',
    endpoint: `${effectiveOrigin}/api/webhook/movie-info`,
    description: 'Menyediakan data lengkap dan resmi seputar film PIYE TO KIH?: sinopsis, arti judul, daftar cast/pemain, 4 soundtrack ciptaan Lek Dahlan + YouTube link, milestone premiere, dan daftar 25 bioskop mitra penayangan.',
    tool_schema: WAHNOTIF_TOOL_MOVIE_SCHEMA,
    facts: MASTER_MOVIE_FACTS
  }, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const args = body.arguments || body.parameters || body;
    const topic = String(args.topic || args.query || args.message || 'all').toLowerCase();

    const randomPantun = MAS_KIDI_PANTUN[Math.floor(Math.random() * MAS_KIDI_PANTUN.length)];

    let detailContent = '';

    if (topic.includes('sinopsis') || topic.includes('cerita') || topic.includes('synopsis')) {
      detailContent = `🎬 *SINOPSIS RESMI PIYE TO KIH? THE MOVIE:*\n${MASTER_MOVIE_FACTS.synopsis}\n\n💡 *Arti Judul:* ${MASTER_MOVIE_FACTS.titleMeaning}\n🎯 *Positioning:* "${MASTER_MOVIE_FACTS.tagline}"\n${MASTER_MOVIE_FACTS.notHorrorExplanation}`;
    } else if (topic.includes('cast') || topic.includes('pemain') || topic.includes('aktor')) {
      const castList = MASTER_MOVIE_FACTS.castMembers
        .map(c => `• *${c.name}* sebagai *${c.character}* — ${c.desc}`)
        .join('\n');
      detailContent = `👥 *DAFTAR PEMAIN & KARAKTER RESMI:*\n${castList}`;
    } else if (topic.includes('ost') || topic.includes('soundtrack') || topic.includes('lagu')) {
      const ostList = MASTER_MOVIE_FACTS.soundtracks
        .map((s, idx) => `${idx + 1}. *"${s.title}"* — Ciptaan ${s.creator} (Vokal: ${s.singer})\n   Nuansa: ${s.mood}`)
        .join('\n\n');
      detailContent = `🎵 *4 ORIGINAL SOUNDTRACK RESMI (Ciptaan Lek Dahlan):*\n${ostList}\n\n📺 *Tonton Video Klip Resmi di YouTube:* ${MASTER_MOVIE_FACTS.ostYoutubeChannel}`;
    } else if (topic.includes('bioskop') || topic.includes('cinema')) {
      detailContent = `🏛️ *25 JARINGAN BIOSKOP MITRA PENAYANGAN RESMI:*\n${MASTER_MOVIE_FACTS.partnerCinemas.join(', ')}\n\n⚠️ *Catatan:* ${MASTER_MOVIE_FACTS.movieplexStatus}`;
    } else {
      // Default / ALL
      detailContent = `🎬 *MASTER FACTS FILM PIYE TO KIH?*
• *Judul:* ${MASTER_MOVIE_FACTS.title}
• *Produksi:* ${MASTER_MOVIE_FACTS.productionCompany}
• *Sutradara:* ${MASTER_MOVIE_FACTS.director} | *Penulis:* ${MASTER_MOVIE_FACTS.screenwriters}
• *Tanggal Tayang Serentak:* 19 NOVEMBER 2026 di Bioskop Seluruh Indonesia
• *Durasi:* ${MASTER_MOVIE_FACTS.runtime} | *Rating:* ${MASTER_MOVIE_FACTS.ageRating}
• *Genre:* ${MASTER_MOVIE_FACTS.genre}
• *Positioning:* "${MASTER_MOVIE_FACTS.tagline}"

📖 *SINOPSIS SINGKAT:*
${MASTER_MOVIE_FACTS.synopsis}

👥 *PEMAIN UTAMA:*
Heri Chandra (Mukidi), Dara Sarasvati (Sukma), Sutrisno Agung (Gendut), Eko Dunung (Penyok), Wiyono (Pak No), Gabriella Desta (Bunga), Marwoto (Pak Gino), TJ Ruth, Ibnu Gundul, Lorenzo Gibz.

🎵 *4 SOUNDTRACK (Lek Dahlan):* Sigaran Nyowo, Kelangan, Gemati, Piye To Kih? (Cek YouTube MIRACLE Pictures).`;
    }

    const replyMessage = `Halo bolo asik! Piye kabare? 😄
${randomPantun}

${detailContent}

🎟️ *Link Langsung Tiket Bioskop:*
• Cinema XXI: ${FAST_TRACK_TICKET_LINKS.xxi}
• TIX ID: ${FAST_TRACK_TICKET_LINKS.tixid}
• CGV: ${FAST_TRACK_TICKET_LINKS.cgv}
• Cinépolis: ${FAST_TRACK_TICKET_LINKS.cinepolis}
• Info Lengkap: ${FAST_TRACK_TICKET_LINKS.website}

Ada lagi yang pengin kamu tanyakan seputar film PIYE TO KIH? atau mau Mas Kidi amankan tiketnya lur? 🍿✨`;

    return NextResponse.json({
      success: true,
      topic,
      facts: MASTER_MOVIE_FACTS,
      replyMessage
    }, { status: 200, headers: corsHeaders });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}
