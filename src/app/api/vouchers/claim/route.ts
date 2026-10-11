import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, generateVoucherSerial, LeadRecord } from '@/lib/db';
import { sendWahnotifVoucher } from '@/lib/wahnotif';
import { sendVoucherEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, cityLocation } = body;

    if (!name || !phone || !email) {
      return NextResponse.json(
        { success: false, error: 'Nama, Nomor WhatsApp, dan Email wajib diisi!' },
        { status: 400 }
      );
    }

    const db = getDb();

    if (!db.settings.isWarOpen) {
      return NextResponse.json(
        { success: false, error: 'War Voucher saat ini sedang ditutup.' },
        { status: 400 }
      );
    }

    const currentClaimed = db.leads.length;
    if (currentClaimed >= db.settings.totalQuota) {
      return NextResponse.json(
        { success: false, error: 'Maaf lur! Kuota War Voucher sudah habis terjual!' },
        { status: 400 }
      );
    }

    // Generate unique serial & ID
    const serialNumber = generateVoucherSerial();
    const leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    
    // Construct public voucher link
    const origin = req.nextUrl.origin || 'https://piyetokihfilm.com';
    const voucherUrl = `${origin}/voucher/${serialNumber}`;

    // Detect city location from request or geolocation headers
    let detectedCity = cityLocation;
    if (!detectedCity || detectedCity === 'Nasional') {
      const cfCity = req.headers.get('cf-ipcity');
      const forwarded = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || '';
      const ip = forwarded.split(',')[0].trim();

      if (cfCity) {
        detectedCity = cfCity;
      } else if (ip.startsWith('182.') || ip.startsWith('114.')) {
        detectedCity = 'Semarang';
      } else if (ip.startsWith('103.') || ip.startsWith('125.')) {
        detectedCity = 'Surabaya';
      } else {
        detectedCity = 'Nasional';
      }
    }

    // Send WhatsApp notification via Wahnotif API
    const waResult = await sendWahnotifVoucher({
      phone,
      name,
      serialNumber,
      voucherUrl,
      apiKey: db.settings.wahnotifApiKey,
      senderNumber: db.settings.wahnotifSenderNumber,
    });

    // Send Email notification
    let emailStatus: 'sent' | 'pending' | 'failed' = 'pending';
    try {
      const emailResult = await sendVoucherEmail({
        name,
        email,
        serialNumber,
        city: detectedCity,
        voucherUrl,
        validDatesText: db.settings.voucherValidDatesText,
      });
      emailStatus = emailResult.success ? 'sent' : 'failed';
    } catch (e) {
      console.error('[Email Dispatch Warning]:', e);
      emailStatus = 'failed';
    }

    const newLead: LeadRecord = {
      id: leadId,
      serialNumber,
      name,
      phone,
      email,
      source: 'web',
      claimedAt: new Date().toISOString(),
      pdfUrl: voucherUrl,
      whatsappStatus: waResult.success ? 'sent' : 'failed',
      emailStatus,
      cityLocation: detectedCity,
    };

    db.leads.unshift(newLead);
    saveDb(db);

    const remainingStock = Math.max(0, db.settings.totalQuota - db.leads.length);

    return NextResponse.json({
      success: true,
      lead: newLead,
      serialNumber,
      voucherUrl,
      validityText: db.settings.voucherValidDatesText || '19 - 22 November 2026 (Penayangan Perdana)',
      remainingStock,
      totalQuota: db.settings.totalQuota,
      message: 'Voucher berhasil diklaim!',
    });
  } catch (err: any) {
    console.error('Error in claim voucher:', err);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan pada sistem. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
