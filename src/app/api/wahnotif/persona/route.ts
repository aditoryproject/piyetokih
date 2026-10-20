import { NextResponse } from 'next/server';
import { getWahnotifPersona, WAHNOTIF_TOOL_SCHEMA, WAHNOTIF_ALL_TOOLS } from '@/lib/wahnotif';
import { CITIES_DATA, isCityRoadshowExpired } from '@/lib/cities';
import { MASTER_ROADSHOW_STOPS, MASTER_MOVIE_FACTS, FAST_TRACK_TICKET_LINKS } from '@/lib/bot-knowledge';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDb();
  const validityText = db.settings.voucherValidDatesText || '19 - 20 November 2026';
  const manualExpired = db.settings.expiredRoadshowCities || [];

  const ticketLinks = {
    default: db.settings.bogoDefaultTicketLink || FAST_TRACK_TICKET_LINKS.xxi,
    xxi: db.settings.bogoCinemaLinks?.xxi || FAST_TRACK_TICKET_LINKS.xxi,
    tixid: db.settings.bogoCinemaLinks?.tixid || FAST_TRACK_TICKET_LINKS.tixid,
    cgv: db.settings.bogoCinemaLinks?.cgv || FAST_TRACK_TICKET_LINKS.cgv,
    cinepolis: db.settings.bogoCinemaLinks?.cinepolis || FAST_TRACK_TICKET_LINKS.cinepolis,
    website: FAST_TRACK_TICKET_LINKS.website,
  };

  const dynamicPersona = getWahnotifPersona(ticketLinks);

  return NextResponse.json({
    success: true,
    status: 'active',
    lastUpdated: new Date().toISOString(),
    persona: dynamicPersona,
    ticketLinks,
    toolSchema: WAHNOTIF_TOOL_SCHEMA,
    allTools: WAHNOTIF_ALL_TOOLS,
    masterFacts: MASTER_MOVIE_FACTS,
    webhooks: {
      masterAllInOne: 'https://piyetokihfilm.com/api/webhook/wahnotif',
      roadshowSchedule: 'https://piyetokihfilm.com/api/webhook/roadshow',
      ticketLinks: 'https://piyetokihfilm.com/api/webhook/tickets',
      movieInfo: 'https://piyetokihfilm.com/api/webhook/movie-info',
      voucherClaims: 'https://piyetokihfilm.com/api/webhook/voucher',
      aiBrain: 'https://piyetokihfilm.com/api/webhook/ai-brain',
    },
    citiesCount: CITIES_DATA.length,
    cities: CITIES_DATA.map(c => {
      const isExpired = isCityRoadshowExpired(c.dateStr, {
        cityName: c.name,
        manualExpiredCities: manualExpired,
      });

      const stopDetail = MASTER_ROADSHOW_STOPS[c.slug];

      return {
        name: c.name,
        slug: c.slug,
        dateStr: c.dateStr,
        province: c.province,
        isExpired,
        roadshowStatus: isExpired ? 'EXPIRED_REDIRECT_TO_BOGO' : 'ACTIVE_ROADSHOW',
        leadSpeaker: stopDetail?.leadSpeaker || null,
        rosterActual: stopDetail?.rosterActual || [],
        boothVenue: isExpired ? null : (stopDetail?.boothMall?.venue || c.boothInfo?.venue || null),
        boothFloor: isExpired ? null : (stopDetail?.boothMall?.floor || c.boothInfo?.floor || null),
        boothTime: isExpired ? null : (stopDetail?.boothMall?.time || c.boothInfo?.timeStr || null),
        cinemas: c.cinemas.map(cin => cin.name),
      };
    }),
  });
}
