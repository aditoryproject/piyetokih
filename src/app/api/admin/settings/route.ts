import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const db = getDb();
  const currentClaimed = db.leads.length;
  const remainingStock = Math.max(0, db.settings.totalQuota - currentClaimed);

  return NextResponse.json({
    settings: db.settings,
    totalQuota: db.settings.totalQuota,
    claimedCount: currentClaimed,
    remainingStock,
    citiesCount: 17,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    if (body.totalQuota !== undefined) db.settings.totalQuota = Number(body.totalQuota);
    if (body.isWarOpen !== undefined) db.settings.isWarOpen = Boolean(body.isWarOpen);
    if (body.isMaintenanceMode !== undefined) db.settings.isMaintenanceMode = Boolean(body.isMaintenanceMode);
    if (body.maintenanceHeadline !== undefined) db.settings.maintenanceHeadline = String(body.maintenanceHeadline);
    if (body.maintenanceSubtitle !== undefined) db.settings.maintenanceSubtitle = String(body.maintenanceSubtitle);
    if (body.countdownTarget) db.settings.countdownTarget = String(body.countdownTarget);
    if (body.metaPixelId !== undefined) db.settings.metaPixelId = String(body.metaPixelId);
    if (body.tiktokPixelId !== undefined) db.settings.tiktokPixelId = String(body.tiktokPixelId);
    if (body.googleAnalyticsId !== undefined) db.settings.googleAnalyticsId = String(body.googleAnalyticsId);
    if (body.wahnotifApiKey !== undefined) db.settings.wahnotifApiKey = String(body.wahnotifApiKey);
    if (body.wahnotifSenderNumber !== undefined) db.settings.wahnotifSenderNumber = String(body.wahnotifSenderNumber);
    if (body.cityLinkOverrides) db.settings.cityLinkOverrides = { ...db.settings.cityLinkOverrides, ...body.cityLinkOverrides };

    // Global Movie Content & Media Settings
    if (body.movieSettings) {
      db.settings.movieSettings = {
        ...(db.settings.movieSettings || {}),
        ...body.movieSettings,
        cast: Array.isArray(body.movieSettings.cast)
          ? body.movieSettings.cast
          : db.settings.movieSettings?.cast || [],
      };
    }

    // SMTP settings
    if (body.smtpHost !== undefined) db.settings.smtpHost = String(body.smtpHost);
    if (body.smtpPort !== undefined) db.settings.smtpPort = Number(body.smtpPort);
    if (body.smtpUser !== undefined) db.settings.smtpUser = String(body.smtpUser);
    if (body.smtpPass !== undefined) db.settings.smtpPass = String(body.smtpPass);
    if (body.smtpFrom !== undefined) db.settings.smtpFrom = String(body.smtpFrom);
    if (body.emailSubject !== undefined) db.settings.emailSubject = String(body.emailSubject);

    // Premiere Voucher Validity settings
    if (body.voucherValidDatesText !== undefined) db.settings.voucherValidDatesText = String(body.voucherValidDatesText);
    if (body.voucherValidStart !== undefined) db.settings.voucherValidStart = String(body.voucherValidStart);
    if (body.voucherValidEnd !== undefined) db.settings.voucherValidEnd = String(body.voucherValidEnd);
    if (body.voucherTermsText !== undefined) db.settings.voucherTermsText = String(body.voucherTermsText);

    // Social Media Links (Editable via Dashboard)
    if (body.socialLinks) {
      db.settings.socialLinks = {
        ...(db.settings.socialLinks || {}),
        ...body.socialLinks,
      };
    }

    // BOGO Promo settings
    if (body.isBogoActive !== undefined) db.settings.isBogoActive = Boolean(body.isBogoActive);
    if (body.bogoHeadline !== undefined) db.settings.bogoHeadline = String(body.bogoHeadline);
    if (body.bogoSubtitle !== undefined) db.settings.bogoSubtitle = String(body.bogoSubtitle);
    if (body.bogoDefaultTicketLink !== undefined) db.settings.bogoDefaultTicketLink = String(body.bogoDefaultTicketLink);
    if (body.bogoCinemaLinks !== undefined) db.settings.bogoCinemaLinks = { ...db.settings.bogoCinemaLinks, ...body.bogoCinemaLinks };

    // Kabar & Galeri + Media Center Global Settings
    if (body.kabarGaleriSettings) {
      db.settings.kabarGaleriSettings = {
        ...(db.settings.kabarGaleriSettings || {}),
        ...body.kabarGaleriSettings,
        mediaCenter: {
          ...(db.settings.kabarGaleriSettings?.mediaCenter || {}),
          ...(body.kabarGaleriSettings?.mediaCenter || {}),
        },
      };
    }

    saveDb(db);
    try {
      revalidatePath('/');
      revalidatePath('/media');
      revalidatePath('/kabar-galeri');
      revalidatePath('/city/[slug]', 'page');
    } catch {}
    return NextResponse.json({ success: true, settings: db.settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
