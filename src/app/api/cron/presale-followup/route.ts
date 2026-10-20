import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { FAST_TRACK_TICKET_LINKS, MASTER_ROADSHOW_STOPS, MAS_KIDI_PANTUN } from '@/lib/bot-knowledge';
import { getCityCinemaTicketLinks } from '@/lib/cities';

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const pendingLeads = db.leads.filter(l => l.presaleFollowupStatus !== 'sent');
    const pendingReminders = db.bogoReminders.filter(r => r.presaleFollowupStatus !== 'sent');

    const sampleMessage = `🎬 *MAS KIDI NINGGALIN PESAN PENTING NIH LUR!* 🎬

Halo bolo asik *Budi* di Kota *Semarang*! Piye kabare? 😄
Mangan getuk nang kutha Salatiga, tuku tiket presale ben atine bungah! 🍿

Mas Kidi cuma mau ngingetin: Tiket Presale sesi *SPECIAL SCREENING (NONTON DULUAN)* bareng langsung rombongan Mukidi, Sukma, Gendut, dan Penyok di bioskop kotamu kursinya *SUDAH MAKIN MENIPIS LUR!* 😱

Mukidi wae sing beda alam wani berjuang lur, mosok sampean nonton wae nunda-nunda? Keburu kehabisan kursi tengah sing enak! 😂

🎟️ *KLIK LINK PEMBELIAN SEKARANG SEBELUM LUDES:*
• Cinema XXI (M-TIX): ${db.settings.bogoCinemaLinks?.xxi || FAST_TRACK_TICKET_LINKS.xxi}
• TIX ID: ${db.settings.bogoCinemaLinks?.tixid || FAST_TRACK_TICKET_LINKS.tixid}
• Jadwal & Info Kota: https://piyetokihfilm.com

⚠️ Kuota kursi terbatas per studio! Gas checkout sekarang juga ya lur ben gak gigit jari pas kanca-kancane wis pamer foto bareng rombongan pemain! 🍿✨

_Miracle Pictures - Piye To Kih The Movie_`;

    return NextResponse.json({
      success: true,
      pendingLeadsCount: pendingLeads.length,
      pendingRemindersCount: pendingReminders.length,
      totalPendingFollowup: pendingLeads.length + pendingReminders.length,
      sampleMessagePreview: sampleMessage,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memuat status follow-up' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = getDb();
    const body = await req.json().catch(() => ({}));
    const targetType = body.target || 'all'; // 'all' | 'leads' | 'reminders'
    const limit = typeof body.limit === 'number' ? body.limit : 50;
    const forceResend = Boolean(body.forceResend);

    const apiKey = db.settings.wahnotifApiKey;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Wahnotif API Key belum diisi di Pengaturan Dashboard. Silakan isi terlebih dahulu untuk mengirim WhatsApp live.',
      }, { status: 400 });
    }

    const defaultXxi = db.settings.bogoCinemaLinks?.xxi || FAST_TRACK_TICKET_LINKS.xxi;
    const defaultTixid = db.settings.bogoCinemaLinks?.tixid || FAST_TRACK_TICKET_LINKS.tixid;

    // Collect eligible contacts
    interface FollowupContact {
      id: string;
      name: string;
      phone: string;
      city: string;
      type: 'lead' | 'reminder';
    }

    const contacts: FollowupContact[] = [];

    if (targetType === 'all' || targetType === 'leads') {
      for (const lead of db.leads) {
        if (forceResend || lead.presaleFollowupStatus !== 'sent') {
          contacts.push({
            id: lead.id,
            name: lead.name || 'Bolo Asik',
            phone: lead.phone,
            city: lead.cityLocation || 'Nasional',
            type: 'lead',
          });
        }
      }
    }

    if (targetType === 'all' || targetType === 'reminders') {
      for (const rem of db.bogoReminders) {
        if (forceResend || rem.presaleFollowupStatus !== 'sent') {
          contacts.push({
            id: rem.id,
            name: rem.name || 'Bolo Asik',
            phone: rem.phone,
            city: rem.city || 'Nasional',
            type: 'reminder',
          });
        }
      }
    }

    const processList = contacts.slice(0, limit);

    if (processList.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Tidak ada antrean kontak yang membutuhkan follow-up presale.',
        totalProcessed: 0,
        sentCount: 0,
        failCount: 0,
      });
    }

    let sentCount = 0;
    let failCount = 0;

    for (const c of processList) {
      let cleanPhone = c.phone.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
      if (cleanPhone.length < 9) {
        failCount++;
        continue;
      }

      // Check city cinemas or override
      const citySlug = c.city.toLowerCase().trim();
      const cityCinemas = getCityCinemaTicketLinks(citySlug);
      const cityOverride = db.settings.cityLinkOverrides?.[citySlug];

      let cinemaLinksText = `• *Cinema XXI (M-TIX):* ${defaultXxi}\n• *TIX ID:* ${defaultTixid}`;
      if (cityOverride) {
        cinemaLinksText = `• *Link Khusus Tiket ${c.city}:* ${cityOverride}\n` + cinemaLinksText;
      } else if (cityCinemas.length > 0) {
        cinemaLinksText = `• *Tiket Bioskop ${c.city}:* ${cityCinemas[0].cinemaName} (${cityCinemas[0].showTimes.join(', ')}): ${cityCinemas[0].ticketUrl}\n` + cinemaLinksText;
      }

      const randomPantun = MAS_KIDI_PANTUN[Math.floor(Math.random() * MAS_KIDI_PANTUN.length)];

      const message = `🎬 *MAS KIDI NINGGALIN PESAN PENTING NIH LUR!* 🎬

Halo bolo asik *${c.name}* di Kota *${c.city}*! Piye kabare? 😄
${randomPantun}

Mas Kidi cuma mau ngingetin: Tiket Presale sesi *SPECIAL SCREENING (NONTON DULUAN)* bareng langsung rombongan Mukidi, Sukma, Gendut, dan Penyok di bioskop kotamu kursinya *SUDAH MAKIN MENIPIS LUR!* 😱

Mukidi wae sing beda alam wani berjuang lur, mosok sampean nonton wae nunda-nunda? Keburu kehabisan kursi tengah sing enak! 😂

🎟️ *KLIK LINK PEMBELIAN SEKARANG SEBELUM LUDES:*
${cinemaLinksText}
• *Jadwal & Info Lengkap:* https://piyetokihfilm.com

⚠️ *PENTING:* Kuota kursi terbatas per studio! Gas checkout sekarang juga ya lur ben gak gigit jari pas kanca-kancane wis pamer foto bareng rombongan pemain! 🍿✨

_Miracle Pictures - Piye To Kih The Movie_`;

      try {
        const res = await fetch('https://api.wahnotif.com/api/send-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            number: cleanPhone,
            phone: cleanPhone,
            message,
          }),
        });

        if (res.ok) {
          sentCount++;
          // Update database record status
          if (c.type === 'lead') {
            const leadRec = db.leads.find(l => l.id === c.id);
            if (leadRec) {
              leadRec.presaleFollowupStatus = 'sent';
              leadRec.presaleFollowupSentAt = new Date().toISOString();
            }
          } else {
            const remRec = db.bogoReminders.find(r => r.id === c.id);
            if (remRec) {
              remRec.presaleFollowupStatus = 'sent';
              remRec.presaleFollowupSentAt = new Date().toISOString();
            }
          }
        } else {
          failCount++;
        }
      } catch (e) {
        console.error('[Presale Followup Error for ' + c.phone + ']:', e);
        failCount++;
      }
    }

    saveDb(db);

    return NextResponse.json({
      success: true,
      message: `Follow-up Presale Roadshow selesai! Berhasil terkirim: ${sentCount}, Gagal: ${failCount}`,
      totalProcessed: processList.length,
      sentCount,
      failCount,
    });
  } catch (err: any) {
    console.error('[Presale Followup Route Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memproses follow-up presale.' },
      { status: 500 }
    );
  }
}
