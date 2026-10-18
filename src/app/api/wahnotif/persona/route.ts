import { NextResponse } from 'next/server';
import { PIYE_TO_KIH_AI_PERSONA, WAHNOTIF_TOOL_SCHEMA } from '@/lib/wahnotif';
import { CITIES_DATA, isCityRoadshowExpired } from '@/lib/cities';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDb();
  const validityText = db.settings.voucherValidDatesText || '19 - 20 November 2026';
  const manualExpired = db.settings.expiredRoadshowCities || [];

  return NextResponse.json({
    success: true,
    status: 'active',
    lastUpdated: new Date().toISOString(),
    persona: {
      botName: PIYE_TO_KIH_AI_PERSONA.botName,
      role: PIYE_TO_KIH_AI_PERSONA.role,
      tone: PIYE_TO_KIH_AI_PERSONA.tone,
      systemPrompt: PIYE_TO_KIH_AI_PERSONA.systemPrompt,
      // 4 Isian Kolom Wahnotif
      konteksBisnis: PIYE_TO_KIH_AI_PERSONA.konteksBisnis,
      teknikClosing: PIYE_TO_KIH_AI_PERSONA.teknikClosing,
      karakterPersona: PIYE_TO_KIH_AI_PERSONA.karakterPersona,
      dataPengetahuanFAQ: PIYE_TO_KIH_AI_PERSONA.dataPengetahuanFAQ,
      sampleDialogs: PIYE_TO_KIH_AI_PERSONA.sampleDialogs,
    },
    toolSchema: WAHNOTIF_TOOL_SCHEMA,
    integration: {
      webhookUrl: 'https://piyetokihfilm.com/api/webhook/wahnotif',
      method: 'POST',
      toolName: 'generate_voucher_presale',
      voucherValidDatesText: validityText,
    },
    citiesCount: CITIES_DATA.length,
    cities: CITIES_DATA.map(c => {
      const isExpired = isCityRoadshowExpired(c.dateStr, {
        cityName: c.name,
        manualExpiredCities: manualExpired,
      });

      return {
        name: c.name,
        slug: c.slug,
        dateStr: c.dateStr,
        province: c.province,
        isExpired,
        roadshowStatus: isExpired ? 'EXPIRED_REDIRECT_TO_BOGO' : 'ACTIVE_ROADSHOW',
        boothVenue: isExpired ? null : (c.boothInfo?.venue || null),
        boothTime: isExpired ? null : (c.boothInfo?.timeStr || null),
        cinemas: c.cinemas.map(cin => cin.name),
      };
    }),
  });
}
