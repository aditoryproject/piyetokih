import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, BogoReminderRecord } from '@/lib/db';
import { CITIES_DATA } from '@/lib/cities';

function normalizePhone(raw: string): string {
  let digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return '';
  if (digits.startsWith('08')) {
    digits = '62' + digits.slice(1);
  } else if (digits.startsWith('8') && digits.length >= 9 && digits.length <= 13) {
    digits = '62' + digits;
  } else if (digits.startsWith('0062')) {
    digits = digits.slice(2);
  }
  if (!digits.startsWith('62') || digits.length < 10 || digits.length > 16) {
    return '';
  }
  return digits;
}

function cleanContactName(rawName: string, phone: string): string {
  if (!rawName) return 'Bolo Asik';
  const trimmed = rawName.replace(/^["']+|["']+$/g, '').trim();
  if (!trimmed) return 'Bolo Asik';
  // If name is "User 628...", "628...", "+62...", "unknown", etc., use friendly fallback
  const digitsInName = trimmed.replace(/[^0-9]/g, '');
  if (
    /^user\s*\d+/i.test(trimmed) ||
    /^unknown$/i.test(trimmed) ||
    /^tanpa nama$/i.test(trimmed) ||
    digitsInName.length >= 7 ||
    trimmed === phone
  ) {
    return 'Bolo Asik';
  }
  return trimmed;
}

function detectCityFromText(text: string): string {
  if (!text) return 'Nasional';
  const lower = text.toLowerCase();
  for (const c of CITIES_DATA) {
    if (lower.includes(c.name.toLowerCase()) || lower.includes(c.slug.toLowerCase())) {
      return c.name;
    }
  }
  if (lower.includes('jogja') || lower.includes('yogya')) return 'Yogyakarta';
  if (lower.includes('solo') || lower.includes('surakarta')) return 'Solo';
  return 'Nasional';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawText = String(body.rawText || body.csvText || '');
    const defaultCity = String(body.defaultCity || 'Nasional').trim() || 'Nasional';

    if (!rawText.trim()) {
      return NextResponse.json(
        { success: false, error: 'Data CSV atau daftar nomor masih kosong.' },
        { status: 400 }
      );
    }

    const db = getDb();
    const existingPhones = new Set<string>();

    for (const rem of db.bogoReminders) {
      const norm = normalizePhone(rem.phone);
      if (norm) existingPhones.add(norm);
    }
    for (const lead of db.leads) {
      const norm = normalizePhone(lead.phone);
      if (norm) existingPhones.add(norm);
    }

    const lines = rawText
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);

    let totalRead = 0;
    let addedCount = 0;
    let duplicateCount = 0;
    let invalidCount = 0;

    // Detect header column indices if CSV has headers
    let phoneColIdx = -1;
    let nameColIdx = -1;
    let cityColIdx = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Split by comma, semicolon, or tab (handling quoted CSV fields)
      const delimiter = line.includes('\t') ? '\t' : line.includes(';') ? ';' : ',';
      const cols = line
        .split(delimiter)
        .map(c => c.replace(/^["']+|["']+$/g, '').trim());

      // Check if first row is header
      if (i === 0) {
        const lowerCols = cols.map(c => c.toLowerCase());
        const hasHeaderKeyword = lowerCols.some(c =>
          c.includes('phone') ||
          c.includes('nomor') ||
          c.includes('whatsapp') ||
          c.includes('telepon') ||
          c.includes('no hp') ||
          c.includes('no_hp') ||
          c.includes('number') ||
          c.includes('jid')
        );
        if (hasHeaderKeyword) {
          phoneColIdx = lowerCols.findIndex(c =>
            c.includes('phone') ||
            c.includes('nomor') ||
            c.includes('whatsapp') ||
            c.includes('telepon') ||
            c.includes('no hp') ||
            c.includes('no_hp') ||
            c.includes('number') ||
            c.includes('jid')
          );
          nameColIdx = lowerCols.findIndex(c =>
            c.includes('name') ||
            c.includes('nama') ||
            c.includes('pushname') ||
            c.includes('contact') ||
            c.includes('kontak')
          );
          cityColIdx = lowerCols.findIndex(c =>
            c.includes('city') ||
            c.includes('kota') ||
            c.includes('tag') ||
            c.includes('label') ||
            c.includes('notes')
          );
          continue;
        }
      }

      totalRead++;

      let rawPhone = '';
      let rawName = '';
      let rawCity = '';

      if (phoneColIdx >= 0 && cols[phoneColIdx]) {
        rawPhone = cols[phoneColIdx].replace(/@s\.whatsapp\.net|@c\.us/gi, '');
        if (nameColIdx >= 0 && cols[nameColIdx]) rawName = cols[nameColIdx];
        if (cityColIdx >= 0 && cols[cityColIdx]) rawCity = cols[cityColIdx];
      } else {
        // Auto-detect which column contains a valid phone number
        for (let cIdx = 0; cIdx < cols.length; cIdx++) {
          const candidate = cols[cIdx].replace(/@s\.whatsapp\.net|@c\.us/gi, '');
          const normCandidate = normalizePhone(candidate);
          if (normCandidate) {
            rawPhone = candidate;
            // Try to find a name column (first non-phone column with letters)
            for (let nIdx = 0; nIdx < cols.length; nIdx++) {
              if (nIdx !== cIdx && /[a-zA-Z]{2,}/.test(cols[nIdx]) && !cols[nIdx].includes('@')) {
                if (!rawName) rawName = cols[nIdx];
                else if (!rawCity) rawCity = cols[nIdx];
              }
            }
            break;
          }
        }

        // Fallback: regex search phone anywhere in the line
        if (!rawPhone) {
          const phoneMatch = line.match(/(?:\+?62|0)8[0-9\s\-]{7,14}/);
          if (phoneMatch) {
            rawPhone = phoneMatch[0];
            rawName = line.replace(phoneMatch[0], '').replace(/[,;\t|()-]/g, ' ').trim();
          }
        }
      }

      const cleanPhone = normalizePhone(rawPhone);
      if (!cleanPhone) {
        invalidCount++;
        continue;
      }

      if (existingPhones.has(cleanPhone)) {
        duplicateCount++;
        continue;
      }

      existingPhones.add(cleanPhone);

      const finalName = cleanContactName(rawName, cleanPhone);
      const detectedCity = rawCity ? detectCityFromText(rawCity) : detectCityFromText(line);
      const finalCity = detectedCity !== 'Nasional' ? detectedCity : defaultCity;

      const newReminder: BogoReminderRecord = {
        id: `CRM-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: finalName,
        phone: cleanPhone,
        email: '',
        city: finalCity,
        registeredAt: new Date().toISOString(),
        reminderStatus: 'pending',
      };

      db.bogoReminders.unshift(newReminder);
      addedCount++;
    }

    if (addedCount > 0) {
      saveDb(db);
    }

    return NextResponse.json({
      success: true,
      message: `Import selesai! ${addedCount} kontak baru berhasil ditambahkan ke antrean satu pintu (${duplicateCount} kontak dilewati karena sudah terdaftar, ${invalidCount} baris tanpa nomor valid).`,
      totalRead,
      addedCount,
      duplicateCount,
      invalidCount,
      totalRemindersNow: db.bogoReminders.length,
    });
  } catch (err: any) {
    console.error('[Import CRM Error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Gagal mengimpor kontak CRM.' },
      { status: 500 }
    );
  }
}

