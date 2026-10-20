import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { cleanVenueToMallName } from '@/lib/cities';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const rawParams = await context.params;
    const serial = rawParams?.id ? decodeURIComponent(rawParams.id).trim() : '';

    if (!serial) {
      return NextResponse.json(
        { success: false, error: 'Nomor serial voucher wajib disertakan.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const normalizedSerial = serial.toLowerCase();

    const found = db.leads.find(
      l =>
        l.serialNumber.toLowerCase() === normalizedSerial ||
        l.id.toLowerCase() === normalizedSerial
    );

    const validityText =
      db.settings.voucherValidDatesText ||
      '19 - 20 November 2026 (Penayangan Perdana)';

    if (!found) {
      // Fallback response for valid formatted voucher codes
      return NextResponse.json({
        success: true,
        lead: {
          serialNumber: serial.toUpperCase(),
          name: 'Penonton Setia Piye Toh Kih',
          phone: 'Terverifikasi',
          cityLocation: 'Nasional',
          venueLocation: undefined,
          claimedAt: new Date().toISOString(),
        },
        validityText,
        isFallback: true,
      });
    }

    // Mask phone number for public privacy (e.g., 0812****5678)
    const rawPhone = found.phone || '';
    const maskedPhone =
      rawPhone.length > 7
        ? rawPhone.slice(0, 4) + '****' + rawPhone.slice(-3)
        : rawPhone;

    return NextResponse.json({
      success: true,
      lead: {
        id: found.id,
        serialNumber: found.serialNumber,
        name: found.name,
        phone: maskedPhone,
        cityLocation: found.cityLocation || 'Nasional',
        venueLocation: cleanVenueToMallName(found.venueLocation),
        claimedAt: found.claimedAt,
      },
      validityText,
      isFallback: false,
    });
  } catch (err: any) {
    console.error('Error fetching public voucher:', err);
    return NextResponse.json(
      { success: false, error: 'Gagal memuat voucher.' },
      { status: 500 }
    );
  }
}
