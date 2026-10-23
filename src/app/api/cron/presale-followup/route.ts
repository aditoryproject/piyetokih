import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { FAST_TRACK_TICKET_LINKS, MASTER_ROADSHOW_STOPS } from '@/lib/bot-knowledge';
import { getCityCinemaTicketLinks } from '@/lib/cities';

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const cityQuery = (req.nextUrl.searchParams.get('city') || 'all').toLowerCase().trim();
    const targetQuery = (req.nextUrl.searchParams.get('target') || 'all').toLowerCase();
    const stageQuery = Number(req.nextUrl.searchParams.get('stage') || 1);

    const isCityEligible = (cityVal?: string) => {
      if (!cityQuery || cityQuery === 'all') return true;
      if (!cityVal) return false;
      const c = cityVal.toLowerCase().trim();
      return c === cityQuery || c.includes(cityQuery) || cityQuery.includes(c);
    };

    const isPendingFollowup = (item: { presaleFollowupStatus?: string; presaleFollowupResponse?: string }) => {
      if (item.presaleFollowupStatus === 'responded') return false;
      if (item.presaleFollowupResponse === 'bought' || item.presaleFollowupResponse === 'declined' || item.presaleFollowupResponse === 'oke') return false;
      return item.presaleFollowupStatus !== 'sent';
    };

    const eligibleLeads = db.leads.filter(l => isCityEligible(l.cityLocation) && isPendingFollowup(l));
    const eligibleReminders = db.bogoReminders.filter(r => isCityEligible(r.city) && isPendingFollowup(r));

    let sampleCity = cityQuery !== 'all' ? cityQuery : 'Semarang';
    const cityCinemas = getCityCinemaTicketLinks(
      sampleCity,
      db.settings.roadshowOverrides,
      db.settings.cityLinkOverrides
    );

    const defaultXxi = db.settings.bogoCinemaLinks?.xxi || FAST_TRACK_TICKET_LINKS.xxi;
    const defaultTixid = db.settings.bogoCinemaLinks?.tixid || FAST_TRACK_TICKET_LINKS.tixid;

    let cinemaLinksText = `• *Cinema XXI (M-TIX):* ${defaultXxi}\n• *TIX ID:* ${defaultTixid}`;
    if (cityCinemas.length > 0) {
      cinemaLinksText = cityCinemas
        .map(cin => `• *${cin.cinemaName}* (${cin.showTimes.join(', ')}):\n  👉 ${cin.ticketUrl}`)
        .join('\n') + `\n• *TIX ID:* ${defaultTixid}`;
    }

    let sampleMessage = '';
    if (stageQuery === 2) {
      sampleMessage = `🎬 *WADUH BOLO ASIK BUDI DI ${sampleCity.toUpperCase()}!* 🎬\n\nMangan getuk nang kutha Salatiga, tuku tiket presale ben atine bungah! 🍿\n\nKabar darurat santai lur: Kursi studio sesi *NONTON DULUAN (SPECIAL SCREENING)* bareng rombongan cast (Mukidi, Sukma, Gendut, Penyok) di bioskop kotamu *SUDAH MAKIN MENIPIS LUR!* 😱\n\nMukidi wae sing beda alam wani berjuang lur, mosok sampean tuku tiket wae nunda-nunda? Keburu kehabisan kursi tengah sing paling wenak! 😂\n\n🎟️ *LINK LANGSUNG AMANKAN TIKETMU (TINGGAL KLIK):*\n${cinemaLinksText}\n• Cek Rundown Lengkap: https://piyetokihfilm.com\n\nOjo nganti pas kanca-kancamu wis pamer foto bareng Mukidi & Sukma di dalam studio, sampean mung iso ndelok story IG-ne lur!\nSampean udah berhasil checkout belum nih? Mau Mas Kidi bantu arahin? 🍿✨\n\n_Miracle Pictures - Piye To Kih The Movie_`;
    } else if (stageQuery === 3) {
      sampleMessage = `🎬 *KONFIRMASI TERAKHIR DARI MAS KIDI NIH LUR!* 🎬\n\nHalo lur *Budi* di *${sampleCity}*! 😄\nMangan getuk nang kutha Salatiga, tuku tiket presale ben atine bungah! 🍿\n\nRombongan film *PIYE TO KIH?* sebentar lagi hadir seru-seruan di kotamu!\nBiar Mas Kidi dan tim bisa data kursi dengan rapi:\n👉 Sampean jadi ikut nonton duluan bareng rombongan artis di bioskop kotamu gak lur?\n\n🎟️ *Link Tiket Langsung:* \n${cinemaLinksText}\n\nBoleh balas singkat ya lur:\nKetik *SUDAH* (kalau sudah punya tiket), *MAU* (kalau mau dibantu linknya), atau *SKIP* (kalau belum sempat ikut sesi ini).\nSuwun sanget ya lur! 🙏🍿\n\n_Miracle Pictures - Piye To Kih The Movie_`;
    } else {
      sampleMessage = `🎬 *MAS KIDI NINGGALIN PESAN PENTING NIH LUR!* 🎬\n\nHalo bolo asik *Budi* di Kota *${sampleCity}*! Piye kabare? 😄\nMangan getuk nang kutha Salatiga, tuku tiket presale ben atine bungah! 🍿\n\nMas Kidi cuma mau ngingetin santai: Tiket Presale sesi *SPECIAL SCREENING (NONTON DULUAN)* bareng langsung rombongan Mukidi, Sukma, Gendut, dan Penyok di bioskop kotamu kursinya *SUDAH MAKIN MENIPIS LUR!* 😱\n\nMukidi wae sing beda alam wani berjuang lur, mosok sampean nonton wae nunda-nunda? Keburu kehabisan kursi tengah sing enak! 😂\n\n🎟️ *KLIK LINK PEMBELIAN SEKARANG SEBELUM LUDES:*\n${cinemaLinksText}\n• *Jadwal & Info Lengkap:* https://piyetokihfilm.com\n\n⚠️ *PENTING:* Kuota kursi terbatas per studio! Gas checkout sekarang juga ya lur ben gak gigit jari pas kanca-kancane wis pamer foto bareng rombongan pemain! 🍿✨\n\n_Miracle Pictures - Piye To Kih The Movie_`;
    }

    return NextResponse.json({
      success: true,
      cityFilter: cityQuery,
      targetFilter: targetQuery,
      stage: stageQuery,
      pendingLeadsCount: eligibleLeads.length,
      pendingRemindersCount: eligibleReminders.length,
      totalPendingFollowup: (targetQuery === 'leads' ? eligibleLeads.length : targetQuery === 'reminders' ? eligibleReminders.length : eligibleLeads.length + eligibleReminders.length),
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
    const targetCity = (body.city || body.targetCity || 'all').toLowerCase().trim();
    const stage = Number(body.stage || 1); // 1: Soft Nudge, 2: Urgensi Menipis, 3: Konfirmasi Final
    const delaySeconds = typeof body.delaySeconds === 'number' ? Math.max(0, body.delaySeconds) : 6;
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

    const isCityEligible = (cityVal?: string) => {
      if (!targetCity || targetCity === 'all') return true;
      if (!cityVal) return false;
      const c = cityVal.toLowerCase().trim();
      return c === targetCity || c.includes(targetCity) || targetCity.includes(c);
    };

    const isContactEligible = (record: { presaleFollowupStatus?: string; presaleFollowupResponse?: string }) => {
      if (forceResend) return true;
      // If contact already responded or bought or declined, DO NOT spam them!
      if (record.presaleFollowupStatus === 'responded') return false;
      if (record.presaleFollowupResponse === 'bought' || record.presaleFollowupResponse === 'declined' || record.presaleFollowupResponse === 'oke') return false;
      return record.presaleFollowupStatus !== 'sent';
    };

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
        if (isCityEligible(lead.cityLocation) && isContactEligible(lead)) {
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
        if (isCityEligible(rem.city) && isContactEligible(rem)) {
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
        message: targetCity !== 'all' 
          ? `Tidak ada antrean kontak di Kota ${targetCity.toUpperCase()} yang membutuhkan follow-up presale (atau seluruh kontak sudah merespons/membeli).`
          : 'Tidak ada antrean kontak yang membutuhkan follow-up presale (atau seluruh kontak sudah merespons/membeli).',
        totalProcessed: 0,
        sentCount: 0,
        failCount: 0,
      });
    }

    let sentCount = 0;
    let failCount = 0;

    for (let i = 0; i < processList.length; i++) {
      const c = processList[i];
      let cleanPhone = c.phone.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
      if (cleanPhone.length < 9) {
        failCount++;
        continue;
      }

      // Safe anti-spam delay between sends (with 0-2s natural human jitter)
      if (delaySeconds > 0 && i > 0) {
        const jitter = Math.floor(Math.random() * 2000);
        await new Promise(resolve => setTimeout(resolve, (delaySeconds * 1000) + jitter));
      }

      // Check city cinemas or override
      const citySlug = c.city.toLowerCase().trim();
      const cityCinemas = getCityCinemaTicketLinks(
        citySlug,
        db.settings.roadshowOverrides,
        db.settings.cityLinkOverrides
      );
      const cityOverride = db.settings.cityLinkOverrides?.[citySlug];

      let cinemaLinksText = `• *Cinema XXI (M-TIX):* ${defaultXxi}\n• *TIX ID:* ${defaultTixid}`;
      if (cityCinemas.length > 0) {
        cinemaLinksText = cityCinemas
          .map(cin => `• *${cin.cinemaName}* (${cin.showTimes.join(', ')}):\n  👉 ${cin.ticketUrl}`)
          .join('\n') + `\n• *TIX ID:* ${defaultTixid}`;
      } else if (cityOverride) {
        cinemaLinksText = `• *Link Khusus Tiket ${c.city}:* ${cityOverride}\n` + cinemaLinksText;
      }

      let message = '';
      if (stage === 2) {
        message = `🎬 *WADUH BOLO ASIK ${c.name.toUpperCase()} DI ${c.city.toUpperCase()}!* 🎬\n\nKabar darurat santai lur: Kursi studio sesi *NONTON DULUAN (SPECIAL SCREENING)* bareng rombongan cast (Mukidi, Sukma, Gendut, Penyok) di bioskop kotamu *SUDAH MAKIN MENIPIS LUR!* 😱\n\nMukidi wae sing beda alam wani berjuang lur, mosok sampean tuku tiket wae nunda-nunda? Keburu kehabisan kursi tengah sing paling wenak! 😂\n\n🎟️ *LINK LANGSUNG AMANKAN TIKETMU (TINGGAL KLIK):*\n${cinemaLinksText}\n• Cek Rundown Lengkap: https://piyetokihfilm.com\n\nOjo nganti pas kanca-kancamu wis pamer foto bareng Mukidi & Sukma di dalam studio, sampean mung iso ndelok story IG-ne lur!\nSampean udah berhasil checkout belum nih? Mau Mas Kidi bantu arahin? 🍿✨\n\n_Miracle Pictures - Piye To Kih The Movie_`;
      } else if (stage === 3) {
        message = `🎬 *KONFIRMASI TERAKHIR DARI MAS KIDI NIH LUR!* 🎬\n\nHalo lur *${c.name}* di *${c.city}*! 😄\n\nRombongan film *PIYE TO KIH?* sebentar lagi mendarat di kotamu!\nBiar Mas Kidi dan tim bisa data kursi dengan rapi:\n👉 Sampean jadi ikut nonton duluan bareng rombongan artis di bioskop kotamu gak lur?\n\n🎟️ *Link Tiket Langsung:* \n${cinemaLinksText}\n\nBoleh balas singkat ya lur:\nKetik *SUDAH* (kalau sudah punya tiket), *MAU* (kalau mau dibantu linknya), atau *SKIP* (kalau belum sempat ikut sesi ini).\nSuwun sanget ya lur! 🙏🍿\n\n_Miracle Pictures - Piye To Kih The Movie_`;
      } else {
        // Stage 1 (Soft Nudge & Cek Tiket)
        message = `🎬 *MAS KIDI NINGGALIN PESAN PENTING NIH LUR!* 🎬\n\nHalo bolo asik *${c.name}* di Kota *${c.city}*! Piye kabare? 😄\n\nMas Kidi cuma mau ngingetin santai: Tiket Presale sesi *SPECIAL SCREENING (NONTON DULUAN)* bareng langsung rombongan Mukidi, Sukma, Gendut, dan Penyok di bioskop kotamu kursinya *SUDAH MAKIN MENIPIS LUR!* 😱\n\nMukidi wae sing beda alam wani berjuang lur, mosok sampean nonton wae nunda-nunda? Keburu kehabisan kursi tengah sing enak! 😂\n\n🎟️ *KLIK LINK PEMBELIAN SEKARANG SEBELUM LUDES:*\n${cinemaLinksText}\n• *Jadwal & Info Lengkap:* https://piyetokihfilm.com\n\n⚠️ *PENTING:* Kuota kursi terbatas per studio! Gas checkout sekarang juga ya lur ben gak gigit jari pas kanca-kancane wis pamer foto bareng rombongan pemain! 🍿✨\n\n_Miracle Pictures - Piye To Kih The Movie_`;
      }

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
              leadRec.presaleFollowupStage = stage;
              leadRec.presaleFollowupSentAt = new Date().toISOString();
            }
          } else {
            const remRec = db.bogoReminders.find(r => r.id === c.id);
            if (remRec) {
              remRec.presaleFollowupStatus = 'sent';
              remRec.presaleFollowupStage = stage;
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
      message: `Follow-up Presale Roadshow (Stage ${stage}) selesai! Berhasil terkirim: ${sentCount}, Gagal: ${failCount}`,
      totalProcessed: processList.length,
      sentCount,
      failCount,
      stage,
      city: targetCity,
      delaySecondsUsed: delaySeconds,
    });
  } catch (err: any) {
    console.error('[Presale Followup Route Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memproses follow-up presale.' },
      { status: 500 }
    );
  }
}
