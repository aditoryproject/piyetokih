import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const db = getDb();
  const searchParams = req.nextUrl.searchParams;
  const search = searchParams.get('search')?.toLowerCase() || '';
  const source = searchParams.get('source') || '';
  const city = searchParams.get('city') || '';

  // Calculate city breakdown ONLY across existing leads
  const cityBreakdown: Record<string, number> = {};
  const citySet = new Set<string>();

  db.leads.forEach(l => {
    const rawCity = l.cityLocation ? l.cityLocation.trim() : '';
    if (rawCity) {
      cityBreakdown[rawCity] = (cityBreakdown[rawCity] || 0) + 1;
      citySet.add(rawCity);
    }
  });

  let filtered = [...db.leads];

  if (search) {
    filtered = filtered.filter(
      l =>
        l.name.toLowerCase().includes(search) ||
        l.phone.includes(search) ||
        l.email.toLowerCase().includes(search) ||
        l.serialNumber.toLowerCase().includes(search)
    );
  }

  if (source && source !== 'all') {
    filtered = filtered.filter(l => l.source === source);
  }

  if (city && city !== 'all') {
    filtered = filtered.filter(l => (l.cityLocation || '').toLowerCase() === city.toLowerCase());
  }

  return NextResponse.json({
    leads: filtered,
    total: filtered.length,
    totalAll: db.leads.length,
    remainingStock: Math.max(0, db.settings.totalQuota - db.leads.length),
    cityBreakdown,
    // Only return cities that have actual form submissions
    availableCities: Array.from(citySet).sort((a, b) => a.localeCompare(b)),
  });
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const db = getDb();
    db.leads = db.leads.filter(l => l.id !== id && l.serialNumber !== id);
    saveDb(db);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
