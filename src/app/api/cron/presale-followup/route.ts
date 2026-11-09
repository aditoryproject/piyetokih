import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { FAST_TRACK_TICKET_LINKS } from '@/lib/bot-knowledge';
import { getCityCinemaTicketLinks } from '@/lib/cities';

interface BackgroundJobState {
  isRunning: boolean;
  startedAt: string | null;
  totalTarget: number;
  processed: number;
  sent: number;
  failed: number;
  currentBatch: number;
  statusMessage: string;
  shouldCancel: boolean;
}

const bgJob: BackgroundJobState = {
  isRunning: false,
  startedAt: null,
  totalTarget: 0,
  processed: 0,
  sent: 0,
  failed: 0,
  currentBatch: 1,
  statusMessage: 'Idle',
  shouldCancel: false,
};

const GREETING_VARIATIONS = [
  'Halo bolo asik',
  'Halo lur',
  'Piye kabare bolo asik',
  'Halo sedulur',
  'Sugeng rahayu bolo asik',
];

const PANTUN_VARIATIONS = [
  'Mangan getuk nang kutha Salatiga, tuku tiket presale ben atine bungah! 🍿',
  'Tuku mendoan anget nang pinggir dalan, ayo amankan kursi bioskop bareng konco tenanan! 🎬',
  'Ngombe dawet ayu karo mangan klepon, film Piye To Kih siap bikin ngakak satu stadion! 😄',
  'Mlaku-mlaku sore nang alun-alun kutha, nonton berdua cukup bayar siji tiket wae lho! 🎟️',
];

function buildFollowupMessage(params: {
  stage: number;
  name: string;
  city: string;
  tixidUrl: string;
  mtixUrl: string;
  cinemaLinksText: string;
  presaleDatesText: string;
  promoDatesText: string;
  customTemplate?: string;
  variantIndex?: number;
}) {
  const {
    stage,
    name,
    city,
    tixidUrl,
    mtixUrl,
    cinemaLinksText,
    presaleDatesText,
    promoDatesText,
    customTemplate,
    variantIndex = 0,
  } = params;

  const greeting = GREETING_VARIATIONS[variantIndex % GREETING_VARIATIONS.length];
  const pantun = PANTUN_VARIATIONS[variantIndex % PANTUN_VARIATIONS.length];

  if (customTemplate && customTemplate.trim()) {
    return customTemplate
      .replace(/\{nama\}/gi, name)
      .replace(/\{kota\}/gi, city)
      .replace(/\{link_tixid\}/gi, tixidUrl)
      .replace(/\{link_mtix\}/gi, mtixUrl)
      .replace(/\{tanggal_presale\}/gi, presaleDatesText)
      .replace(/\{tanggal_bogo\}/gi, promoDatesText);
  }

  // Stage 4: KHUSUS PEMBUKAAN LINK PRESALE & BUY 1 GET 1 (12 NOVEMBER -> TAYANG 19 NOV)
  if (stage === 4) {
    return `🎬 *KABAR GEMBIRA! LINK TIKET PRESALE & BUY 1 GET 1 RESMI DIBUKA!* 🎬\n\n${greeting} *${name}* di *${city}*! 😄\n${pantun}\n\nSesuai janji Mas Kidi kemarin, hari ini loket pembelian tiket *PRESALE (${presaleDatesText})* & *PROMO BUY 1 GET 1 (${promoDatesText})* untuk penayangan serentak film *PIYE TO KIH? THE MOVIE* (Tayang Perdana *19 November 2026*) sudah *RESMI DIBUKA LUR!* 🎉\n\n🎟️ *PILIH LINK PEMBELIAN RESMI SEBELUM KUOTA PROMO HABIS:*\n• *TIX ID (Promo Buy 1 Get 1):*\n  👉 ${tixidUrl}\n• *Cinema XXI / M-TIX (Promo Buy 1 Get 1):*\n  👉 ${mtixUrl}\n\n⚠️ *PENTING:* Kuota promo *Nonton Berdua Bayar 1 Tiket* sangat terbatas per harinya. Yuk langsung klik link di atas dan amankan kursi tengah favoritmu bareng pasangan, keluarga, atau bestie sekarang juga! 🍿✨\n\nKalau ada kendala pas buka linknya, langsung balas chat ini ya lur, Mas Kidi siap bantu!\n\n_Miracle Pictures - Piye To Kih The Movie_`;
  }

  if (stage === 2) {
    return `🎬 *WADUH BOLO ASIK ${name.toUpperCase()} DI ${city.toUpperCase()}!* 🎬\n\n${pantun}\n\nKabar darurat santai lur: Kuota tiket *PRESALE & PROMO BUY 1 GET 1* film *PIYE TO KIH?* untuk penayangan *19 November 2026* di bioskop kotamu *SUDAH MAKIN MENIPIS LUR!* 😱\n\n🎟️ *LINK LANGSUNG AMANKAN TIKETMU (TINGGAL KLIK):*\n• *TIX ID:* ${tixidUrl}\n• *M-TIX (Cinema XXI):* ${mtixUrl}\n\nOjo nganti kehabisan kuota promonya ya lur! Sampean udah berhasil checkout belum nih? Mau Mas Kidi bantu arahin? 🍿✨\n\n_Miracle Pictures - Piye To Kih The Movie_`;
  }

  if (stage === 3) {
    return `🎬 *KONFIRMASI TERAKHIR DARI MAS KIDI NIH LUR!* 🎬\n\n${greeting} *${name}* di *${city}*! 😄\n${pantun}\n\nPenayangan perdana *PIYE TO KIH? THE MOVIE* tanggal *19 November 2026* sebentar lagi dimulai!\nBiar Mas Kidi bisa bantu cek kuota promo *Buy 1 Get 1* di kotamu:\n👉 Sampean sudah berhasil amankan tiket presale di TIX ID / M-TIX belum lur?\n\n🎟️ *Link Tiket Langsung:*\n• *TIX ID:* ${tixidUrl}\n• *M-TIX XXI:* ${mtixUrl}\n\nBoleh balas singkat ya lur:\nKetik *SUDAH* (kalau sudah punya tiket), *MAU* (kalau mau dibantu linknya), atau *SKIP* (kalau belum sempat).\nSuwun sanget ya lur! 🙏🍿\n\n_Miracle Pictures - Piye To Kih The Movie_`;
  }

  // Stage 1: Soft Nudge & Link Pembelian Presale
  return `🎬 *MAS KIDI NINGGALIN PESAN PENTING NIH LUR!* 🎬\n\n${greeting} *${name}* di Kota *${city}*! 😄\n${pantun}\n\nMas Kidi cuma mau ngingetin santai: Tiket *PRESALE (${presaleDatesText})* & *PROMO BUY 1 GET 1 (${promoDatesText})* untuk penayangan serentak film *PIYE TO KIH?* mulai *19 November 2026* sudah bisa diamankan sekarang lur!\n\n🎟️ *KLIK LINK PEMBELIAN RESMI SEBELUM LUDES:*\n${cinemaLinksText}\n• *TIX ID (Promo BOGO):* ${tixidUrl}\n• *Info Lengkap:* https://piyetokihfilm.com/#presale\n\n⚠️ *PENTING:* Kuota promo terbatas! Gas checkout sekarang juga ya lur ben gak kehabisan kursi favorit! 🍿✨\n\n_Miracle Pictures - Piye To Kih The Movie_`;
}

export async function GET(req: NextRequest) {
  try {
    const db = getDb();
    const cityQuery = (req.nextUrl.searchParams.get('city') || 'all').toLowerCase().trim();
    const targetQuery = (req.nextUrl.searchParams.get('target') || 'all').toLowerCase();
    const stageQuery = Number(req.nextUrl.searchParams.get('stage') || 4);

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

    const sampleCity = cityQuery !== 'all' ? cityQuery : 'Kediri';
    const cityCinemas = getCityCinemaTicketLinks(
      sampleCity,
      db.settings.roadshowOverrides,
      db.settings.cityLinkOverrides
    );

    const defaultXxi = db.settings.bogoCinemaLinks?.xxi || FAST_TRACK_TICKET_LINKS.xxi;
    const defaultTixid = db.settings.bogoCinemaLinks?.tixid || FAST_TRACK_TICKET_LINKS.tixid;
    const presaleDatesText = db.settings.bogoPresaleDatesText || '12-18 November 2026';
    const promoDatesText = db.settings.bogoPromoDatesText || '19-20 November 2026';

    let cinemaLinksText = `• *Cinema XXI (M-TIX):* ${defaultXxi}`;
    if (cityCinemas.length > 0) {
      cinemaLinksText = cityCinemas
        .map(cin => `• *${cin.cinemaName}* (${cin.showTimes.join(', ')}):\n  👉 ${cin.ticketUrl}`)
        .join('\n');
    }

    const sampleMessage = buildFollowupMessage({
      stage: stageQuery,
      name: 'Budi',
      city: sampleCity,
      tixidUrl: defaultTixid,
      mtixUrl: defaultXxi,
      cinemaLinksText,
      presaleDatesText,
      promoDatesText,
      variantIndex: 0,
    });

    return NextResponse.json({
      success: true,
      cityFilter: cityQuery,
      targetFilter: targetQuery,
      stage: stageQuery,
      pendingLeadsCount: eligibleLeads.length,
      pendingRemindersCount: eligibleReminders.length,
      totalPendingFollowup: (targetQuery === 'leads' ? eligibleLeads.length : targetQuery === 'reminders' ? eligibleReminders.length : eligibleLeads.length + eligibleReminders.length),
      sampleMessagePreview: sampleMessage,
      backgroundJob: bgJob,
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
    const body = await req.json().catch(() => ({}));

    if (body.action === 'stop') {
      bgJob.shouldCancel = true;
      bgJob.statusMessage = 'Dihentikan oleh Admin.';
      return NextResponse.json({ success: true, message: 'Pengiriman background dihentikan.', backgroundJob: bgJob });
    }

    if (bgJob.isRunning) {
      return NextResponse.json({
        success: false,
        error: `Masih ada proses pengiriman Follow-Up yang sedang berjalan di background (${bgJob.processed}/${bgJob.totalTarget} terkirim). Tunggu hingga selesai atau klik Hentikan.`,
        backgroundJob: bgJob,
      }, { status: 409 });
    }

    const db = getDb();
    const targetType = body.target || 'all'; // 'all' | 'leads' | 'reminders'
    const targetCity = (body.city || body.targetCity || 'all').toLowerCase().trim();
    const stage = Number(body.stage || 4); // 4: Pembukaan Link Presale 12 Nov, 1: Soft Nudge, 2: Urgensi, 3: Konfirmasi
    const delaySeconds = typeof body.delaySeconds === 'number' ? Math.max(0, body.delaySeconds) : 20;
    const batchSize = typeof body.batchSize === 'number' ? Math.max(5, body.batchSize) : 25;
    const batchPauseMinutes = typeof body.batchPauseMinutes === 'number' ? Math.max(0, body.batchPauseMinutes) : 10;
    const limit = typeof body.limit === 'number' ? body.limit : 500;
    const forceResend = Boolean(body.forceResend);
    const customTemplate = typeof body.customTemplate === 'string' ? body.customTemplate : '';

    const apiKey = db.settings.wahnotifApiKey;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Wahnotif API Key belum diisi di Pengaturan Dashboard. Silakan isi terlebih dahulu untuk mengirim WhatsApp live.',
      }, { status: 400 });
    }

    const defaultXxi = db.settings.bogoCinemaLinks?.xxi || FAST_TRACK_TICKET_LINKS.xxi;
    const defaultTixid = db.settings.bogoCinemaLinks?.tixid || FAST_TRACK_TICKET_LINKS.tixid;
    const presaleDatesText = db.settings.bogoPresaleDatesText || '12-18 November 2026';
    const promoDatesText = db.settings.bogoPromoDatesText || '19-20 November 2026';

    const isCityEligible = (cityVal?: string) => {
      if (!targetCity || targetCity === 'all') return true;
      if (!cityVal) return false;
      const c = cityVal.toLowerCase().trim();
      return c === targetCity || c.includes(targetCity) || targetCity.includes(c);
    };

    const isContactEligible = (record: { presaleFollowupStatus?: string; presaleFollowupResponse?: string }) => {
      if (forceResend) return true;
      if (record.presaleFollowupStatus === 'responded') return false;
      if (record.presaleFollowupResponse === 'bought' || record.presaleFollowupResponse === 'declined' || record.presaleFollowupResponse === 'oke') return false;
      return record.presaleFollowupStatus !== 'sent';
    };

    interface FollowupContact {
      id: string;
      name: string;
      phone: string;
      city: string;
      type: 'lead' | 'reminder';
    }

    const contacts: FollowupContact[] = [];
    const seenPhones = new Set<string>();

    // Utamakan Pendaftar Reminder BOGO terlebih dahulu, lalu Leads Voucher (tanpa duplikat nomor WA)
    if (targetType === 'all' || targetType === 'reminders') {
      for (const rem of db.bogoReminders) {
        if (isCityEligible(rem.city) && isContactEligible(rem)) {
          let clean = rem.phone.replace(/[^0-9]/g, '');
          if (clean.startsWith('0')) clean = '62' + clean.slice(1);
          if (clean.length >= 9 && !seenPhones.has(clean)) {
            seenPhones.add(clean);
            contacts.push({
              id: rem.id,
              name: rem.name || 'Bolo Asik',
              phone: clean,
              city: rem.city || 'Nasional',
              type: 'reminder',
            });
          }
        }
      }
    }

    if (targetType === 'all' || targetType === 'leads') {
      for (const lead of db.leads) {
        if (isCityEligible(lead.cityLocation) && isContactEligible(lead)) {
          let clean = lead.phone.replace(/[^0-9]/g, '');
          if (clean.startsWith('0')) clean = '62' + clean.slice(1);
          if (clean.length >= 9 && !seenPhones.has(clean)) {
            seenPhones.add(clean);
            contacts.push({
              id: lead.id,
              name: lead.name || 'Bolo Asik',
              phone: clean,
              city: lead.cityLocation || 'Nasional',
              type: 'lead',
            });
          }
        }
      }
    }

    const processList = contacts.slice(0, limit);

    if (processList.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Tidak ada antrean kontak yang membutuhkan follow-up (atau centang opsi "Paksa kirim ulang" jika ingin mengirim ulang ke semua kontak).',
        totalProcessed: 0,
        sentCount: 0,
        failCount: 0,
      });
    }

    // Jika estimasi durasi > 25 detik (karena jeda anti-spam / batch 10-15 menit), jalankan di Background Server agar tidak timeout!
    const runInBackground = processList.length * delaySeconds > 20 || (batchPauseMinutes > 0 && processList.length > batchSize);

    const executeQueue = async () => {
      bgJob.isRunning = true;
      bgJob.startedAt = new Date().toISOString();
      bgJob.totalTarget = processList.length;
      bgJob.processed = 0;
      bgJob.sent = 0;
      bgJob.failed = 0;
      bgJob.currentBatch = 1;
      bgJob.shouldCancel = false;
      bgJob.statusMessage = `Memulai pengiriman ke ${processList.length} kontak...`;

      try {
        for (let i = 0; i < processList.length; i++) {
          if (bgJob.shouldCancel) break;

          // Cek apakah masuk ke gelombang/batch berikutnya dan perlu istirahat 10-15 menit
          if (i > 0 && batchPauseMinutes > 0 && i % batchSize === 0) {
            bgJob.currentBatch = Math.floor(i / batchSize) + 1;
            const pauseMs = batchPauseMinutes * 60 * 1000;
            bgJob.statusMessage = `Istirahat Anti-Spam ${batchPauseMinutes} menit sebelum lanjut ke Gelombang (Batch) #${bgJob.currentBatch}... (${bgJob.sent}/${bgJob.totalTarget} terkirim)`;
            const stepMs = 5000;
            let waited = 0;
            while (waited < pauseMs && !bgJob.shouldCancel) {
              await new Promise(r => setTimeout(r, stepMs));
              waited += stepMs;
            }
            if (bgJob.shouldCancel) break;
          } else if (i > 0 && delaySeconds > 0) {
            const jitter = Math.floor(Math.random() * 4000) + 1000; // 1-5s natural human jitter
            bgJob.statusMessage = `Menunggu jeda aman ${delaySeconds} dtk sebelum mengirim ke kontak #${i + 1} (${processList[i].name})...`;
            await new Promise(resolve => setTimeout(resolve, (delaySeconds * 1000) + jitter));
            if (bgJob.shouldCancel) break;
          }

          const c = processList[i];
          bgJob.statusMessage = `Mengirim WhatsApp ke ${c.name} (${c.city}) [${i + 1}/${processList.length}]...`;

          const currentDb = getDb();
          const citySlug = c.city.toLowerCase().trim();
          const cityCinemas = getCityCinemaTicketLinks(
            citySlug,
            currentDb.settings.roadshowOverrides,
            currentDb.settings.cityLinkOverrides
          );

          let cinemaLinksText = `• *Cinema XXI (M-TIX):* ${defaultXxi}`;
          if (cityCinemas.length > 0) {
            cinemaLinksText = cityCinemas
              .map(cin => `• *${cin.cinemaName}* (${cin.showTimes.join(', ')}):\n  👉 ${cin.ticketUrl}`)
              .join('\n');
          }

          const message = buildFollowupMessage({
            stage,
            name: c.name,
            city: c.city,
            tixidUrl: defaultTixid,
            mtixUrl: defaultXxi,
            cinemaLinksText,
            presaleDatesText,
            promoDatesText,
            customTemplate,
            variantIndex: i,
          });

          try {
            const res = await fetch('https://api.wahnotif.com/api/send-message', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify({
                number: c.phone,
                phone: c.phone,
                message,
              }),
            });

            if (res.ok) {
              bgJob.sent++;
              if (c.type === 'lead') {
                const leadRec = currentDb.leads.find(l => l.id === c.id);
                if (leadRec) {
                  leadRec.presaleFollowupStatus = 'sent';
                  leadRec.presaleFollowupStage = stage;
                  leadRec.presaleFollowupSentAt = new Date().toISOString();
                }
              } else {
                const remRec = currentDb.bogoReminders.find(r => r.id === c.id);
                if (remRec) {
                  remRec.presaleFollowupStatus = 'sent';
                  remRec.presaleFollowupStage = stage;
                  remRec.presaleFollowupSentAt = new Date().toISOString();
                  remRec.reminderStatus = 'sent';
                  remRec.whatsappSentAt = new Date().toISOString();
                }
              }
              saveDb(currentDb);
            } else {
              bgJob.failed++;
            }
          } catch (e) {
            console.error('[Presale Followup Error for ' + c.phone + ']:', e);
            bgJob.failed++;
          }

          bgJob.processed++;
        }
      } finally {
        bgJob.isRunning = false;
        bgJob.statusMessage = bgJob.shouldCancel
          ? `Dihentikan oleh Admin (${bgJob.sent} terkirim, ${bgJob.failed} gagal).`
          : `Selesai! Total ${bgJob.sent} berhasil terkirim dari ${bgJob.totalTarget} kontak.`;
      }
    };

    if (runInBackground) {
      executeQueue();
      return NextResponse.json({
        success: true,
        background: true,
        message: `Pengiriman Follow-Up ke ${processList.length} kontak telah dimulai di background server dengan jeda anti-spam (${delaySeconds} detik/pesan & istirahat ${batchPauseMinutes} menit setiap ${batchSize} nomor). Anda dapat memantau progresnya secara langsung atau menutup halaman ini dengan aman.`,
        totalProcessed: processList.length,
        sentCount: 0,
        failCount: 0,
        backgroundJob: bgJob,
      });
    } else {
      await executeQueue();
      return NextResponse.json({
        success: true,
        background: false,
        message: `Follow-up Presale selesai diproses! Terkirim: ${bgJob.sent}, Gagal: ${bgJob.failed}`,
        totalProcessed: bgJob.processed,
        sentCount: bgJob.sent,
        failCount: bgJob.failed,
        backgroundJob: bgJob,
      });
    }
  } catch (err: any) {
    console.error('[Presale Followup API Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal memproses follow-up presale.' },
      { status: 500 }
    );
  }
}
