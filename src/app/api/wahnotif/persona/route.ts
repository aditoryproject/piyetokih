import { NextResponse } from 'next/server';
import { PIYE_TO_KIH_AI_PERSONA, WAHNOTIF_TOOL_SCHEMA } from '@/lib/wahnotif';
import { CITIES_DATA } from '@/lib/cities';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const db = getDb();
  const validityText = db.settings.voucherValidDatesText || '19 - 20 November 2026';

  return NextResponse.json({
    success: true,
    status: 'active',
    lastUpdated: new Date().toISOString(),
    persona: {
      botName: PIYE_TO_KIH_AI_PERSONA.botName,
      role: PIYE_TO_KIH_AI_PERSONA.role,
      tone: PIYE_TO_KIH_AI_PERSONA.tone,
      systemPrompt: PIYE_TO_KIH_AI_PERSONA.systemPrompt,
      sampleDialogs: PIYE_TO_KIH_AI_PERSONA.sampleDialogs,
    },
    toolSchema: WAHNOTIF_TOOL_SCHEMA,
    integration: {
      webhookUrl: 'https://piyetokihfilm.com/api/webhook/wahnotif',
      method: 'POST',
      toolName: 'claim_war_voucher',
      voucherValidDatesText: validityText,
    },
    citiesCount: CITIES_DATA.length,
    cities: CITIES_DATA.map(c => ({
      name: c.name,
      slug: c.slug,
      dateStr: c.dateStr,
      province: c.province,
      boothVenue: c.boothInfo?.venue || null,
      boothTime: c.boothInfo?.timeStr || null,
      cinemas: c.cinemas.map(cin => cin.name),
    })),
  });
}
