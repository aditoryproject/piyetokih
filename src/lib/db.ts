import fs from 'fs';
import path from 'path';
import { MovieCastMember, MovieSettings, DEFAULT_MOVIE_SETTINGS } from './movie-types';
export type { MovieCastMember, MovieSettings };
export { DEFAULT_MOVIE_SETTINGS };

export interface LeadRecord {
  id: string;
  serialNumber: string;
  name: string;
  phone: string;
  email: string;
  source: 'web' | 'whatsapp';
  claimedAt: string;
  pdfUrl?: string;
  whatsappStatus: 'sent' | 'pending' | 'failed';
  emailStatus: 'sent' | 'pending' | 'failed';
  cityLocation?: string;
  venueLocation?: string;
}

export interface AppSettings {
  totalQuota: number;
  initialStock: number;
  isWarOpen: boolean;
  countdownTarget: string; // ISO string e.g. "2026-10-22T12:00:00"
  warHeadline: string;
  warSubtitle: string;
  metaPixelId: string;
  tiktokPixelId?: string;
  googleAnalyticsId?: string;
  wahnotifApiKey: string;
  wahnotifSenderNumber: string;
  cityLinkOverrides: Record<string, string>; // city slug -> ticket url

  // Movie Media & Content Configuration (Global Sync)
  movieSettings?: MovieSettings;

  // Email Dispatcher Configuration
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
  emailSubject: string;

  // Premiere Voucher Redemption Timeline Settings
  voucherValidDatesText: string;
  voucherValidStart: string;
  voucherValidEnd: string;
  voucherTermsText: string;

  // Buy One Get One (BOGO) Campaign Configuration
  isBogoActive: boolean;
  bogoHeadline: string;
  bogoSubtitle: string;
  bogoDefaultTicketLink: string;
  bogoCinemaLinks: {
    xxi?: string;
    cgv?: string;
    cinepolis?: string;
    tixid?: string;
  };

  // Maintenance / Coming Soon Mode (Toggleable via Dashboard)
  isMaintenanceMode?: boolean;
  maintenanceHeadline?: string;
  maintenanceSubtitle?: string;

  // Social Media Links (Editable via Dashboard)
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    facebook?: string; // fanspage
    youtube?: string;
  };

  // Kabar & Galeri + Media Center Global Settings
  kabarGaleriSettings?: KabarGaleriSettings;

  // Dashboard Admin Credentials
  adminUsername?: string;
  adminPasswordHash?: string;
  adminPasswordSalt?: string;
}

export interface KabarGaleriSettings {
  heroTaglineBadge?: string;
  heroQuote?: string;
  heroTitle?: string;
  heroExcerpt?: string;
  heroCoverImage?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  mediaCenter?: {
    posterDownloadUrl?: string;
    pressReleasePdfUrl?: string;
    stillsDownloadUrl?: string;
    factSheetPdfUrl?: string;
    prContactEmail?: string;
    prContactPhone?: string;
  };
}

export interface ArticleRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string; // Markdown or paragraphs
  coverImage: string;
  galleryImages: string[];
  cityTag?: string; // e.g. "Solo", "Semarang", "Kediri", "Magelang"
  category: 'Kabar Film' | 'Press Release' | 'Media Coverage' | 'Galeri Foto' | 'Galeri Video' | 'Roadshow' | 'Meet & Greet' | 'Behind The Scene' | string;
  tag?: string; // e.g. "ROADSHOW", "SOUNDTRACK", "PREMIERE", "SCREENING", "TRAILER"
  tags?: string[];
  featured?: boolean;
  ctaText?: string;
  ctaLink?: string;
  pdfUrl?: string; // for Press Release PDF download
  externalUrl?: string; // for Media Coverage source link
  mediaName?: string; // for Media Coverage outlet name
  videoUrl?: string; // for Galeri Video (YouTube)
  videoDuration?: string; // e.g. "2:24"
  photoCount?: number; // for Galeri Foto album
  location?: string;
  author: string;
  publishedAt: string; // e.g. "2026-10-25"
  readTime?: string; // e.g. "3 menit"
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface VisitorLog {
  id: string;
  ip: string;
  city: string;
  platform: string;
  path: string;
  subdomain?: string;
  timestamp: string;
  event?: string;
}

export interface BogoReminderRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  registeredAt: string;
  reminderStatus: 'pending' | 'sent' | 'failed';
  whatsappSentAt?: string;
  emailSentAt?: string;
}

export interface DatabaseSchema {
  settings: AppSettings;
  leads: LeadRecord[];
  visitors: VisitorLog[];
  articles: ArticleRecord[];
  bogoReminders: BogoReminderRecord[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const BAK_FILE = path.join(DATA_DIR, 'db.json.bak');
const PERSIST_FILE = path.join(DATA_DIR, 'db.persist.json');

// External persistent storage outside git working tree (immune to git pull/checkout/reset)
const EXTERNAL_DIR = process.env.EXTERNAL_STORAGE_DIR || path.join(process.cwd(), '..', 'miracleweb-storage');
const EXTERNAL_DB_FILE = path.join(EXTERNAL_DIR, 'db.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const EXTERNAL_UPLOADS_DIR = path.join(EXTERNAL_DIR, 'uploads');



export const DEFAULT_ARTICLES: ArticleRecord[] = [];

const DEFAULT_SETTINGS: AppSettings = {
  totalQuota: 500,
  initialStock: 500,
  isWarOpen: true,
  countdownTarget: '2026-10-22T13:00:00+07:00', // Hari H Roadshow
  warHeadline: 'WAR VOUCHER NONTON FILM PIYE TO KIH',
  warSubtitle: 'Klaim e-voucher resmi! Voucher dapat ditukarkan di bioskop kesayangan Anda saat periode penayangan film.',
  metaPixelId: '',
  tiktokPixelId: '',
  googleAnalyticsId: '',
  wahnotifApiKey: '',
  wahnotifSenderNumber: '',
  cityLinkOverrides: {},

  // Global Movie Content Settings
  movieSettings: DEFAULT_MOVIE_SETTINGS,

  // Email Defaults
  smtpHost: '',
  smtpPort: 465,
  smtpUser: '',
  smtpPass: '',
  smtpFrom: 'Miracle Pictures <ticket@piyetokihfilm.com>',
  emailSubject: '🎟️ E-Voucher Nonton Resmi Film PIYE TO KIH? - Miracle Pictures',

  // Premiere Timeline Defaults (Sesuai Operating Handbook v1.1)
  voucherValidDatesText: '19 - 20 November 2026 (Penayangan Perdana)',
  voucherValidStart: '2026-11-19',
  voucherValidEnd: '2026-11-20',
  voucherTermsText: 'Voucher digital ini bukan bukti pembayaran. Untuk penukaran voucher fisik resmi, silakan kunjungi booth di samping acara Roadshow & Meet and Greet di kotamu.',

  // BOGO Promo Defaults
  isBogoActive: true,
  bogoHeadline: 'PROMO BUY 1 GET 1: NONTON BERDUA BAYAR 1 TIKET',
  bogoSubtitle: 'Ajak pasangan, keluarga, atau bestie nonton film PIYE TO KIH di bioskop kesayanganmu!',
  bogoDefaultTicketLink: 'https://m.21cineplex.com',
  bogoCinemaLinks: {
    xxi: 'https://m.21cineplex.com',
    cgv: 'https://www.cgv.id',
    cinepolis: 'https://cinepolis.co.id',
    tixid: 'https://www.tix.id',
  },

  // Mode Maintenance / Coming Soon (Toggleable)
  isMaintenanceMode: true,
  maintenanceHeadline: 'COMING SOON',
  maintenanceSubtitle: 'Website Resmi Film PIYE TO KIH? The Movie sedang mempersiapkan sesuatu yang istimewa. Nantikan jadwal penayangan bioskop dan kejutan spesial!',

  // Social Media Channels
  socialLinks: {
    instagram: 'https://www.instagram.com/piyetokihfilm.official/',
    tiktok: 'https://www.tiktok.com/@piyetokihfilm.official',
    facebook: 'https://www.facebook.com/piyetokihfilm.official',
    youtube: 'https://www.youtube.com/@piyetokihfilm',
  },

  // Kabar & Galeri + Media Center Global Settings
  kabarGaleriSettings: {
    heroTaglineBadge: 'KABAR & GALERI',
    heroQuote: '“Tentang kita, yang selalu mencari jalan pulang.”',
    heroTitle: 'Kabar & Galeri Resmi Film PIYE TO KIH?',
    heroExcerpt: 'Pusat informasi resmi penayangan bioskop film PIYE TO KIH?: liputan roadshow 17 kota, galeri foto, video cuplikan, dan siaran pers.',
    heroCoverImage: '/kabar-galeri-hero.jpg',
    heroCtaText: 'Kunjungi Jadwal Roadshow',
    heroCtaLink: '/#roadshow',
    mediaCenter: {
      posterDownloadUrl: '/kabar-galeri-hero.jpg',
      pressReleasePdfUrl: '#',
      stillsDownloadUrl: '#',
      factSheetPdfUrl: '#',
      prContactEmail: 'press@piyetokihfilm.com',
      prContactPhone: '+62 822-1234-5678',
    },
  },
};

function findLatestUploadedFile(categoryPrefix: string): string | null {
  try {
    const searchDirs = [UPLOADS_DIR, EXTERNAL_UPLOADS_DIR];
    for (const dir of searchDirs) {
      if (fs.existsSync(dir)) {
        const files = fs
          .readdirSync(dir)
          .filter(f => !f.startsWith('.') && (f.startsWith(categoryPrefix) || f.includes(categoryPrefix)))
          .map(f => {
            try {
              const stat = fs.statSync(path.join(dir, f));
              return { name: f, mtime: stat.mtimeMs };
            } catch {
              return { name: f, mtime: 0 };
            }
          })
          .sort((a, b) => b.mtime - a.mtime);

        if (files.length > 0 && files[0].name) {
          return `/uploads/${files[0].name}`;
        }
      }
    }
  } catch {}
  return null;
}

function loadPersistentBackup(): DatabaseSchema | null {
  const candidates = [EXTERNAL_DB_FILE, PERSIST_FILE, BAK_FILE];
  for (const f of candidates) {
    try {
      if (fs.existsSync(f)) {
        const raw = fs.readFileSync(f, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.settings) {
          return parsed as DatabaseSchema;
        }
      }
    } catch {}
  }
  return null;
}

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const backup = loadPersistentBackup();

  let rawDb: any = null;
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      rawDb = JSON.parse(raw);
    } catch {}
  }

  // If DB_FILE is missing or corrupted, use backup immediately
  if (!rawDb && backup) {
    rawDb = backup;
  }

  const parsed = rawDb || {};
  const backupSettings = backup?.settings;
  const currentSettings = parsed.settings || {};

  // Preserve custom poster: if current is default unsplash or missing, but backup has custom, PRESERVE BACKUP!
  let posterUrl = currentSettings.movieSettings?.posterUrl;
  if (!posterUrl || posterUrl.includes('unsplash.com')) {
    if (backupSettings?.movieSettings?.posterUrl && !backupSettings.movieSettings.posterUrl.includes('unsplash.com')) {
      posterUrl = backupSettings.movieSettings.posterUrl;
    } else {
      // Auto-scan uploaded files in uploads dir
      const detected = findLatestUploadedFile('movie-poster') || findLatestUploadedFile('poster') || findLatestUploadedFile('movie');
      if (detected) posterUrl = detected;
    }
  }

  // Preserve custom backdrop:
  let backdropUrl = currentSettings.movieSettings?.backdropUrl;
  if (!backdropUrl || backdropUrl.includes('unsplash.com')) {
    if (backupSettings?.movieSettings?.backdropUrl && !backupSettings.movieSettings.backdropUrl.includes('unsplash.com')) {
      backdropUrl = backupSettings.movieSettings.backdropUrl;
    } else {
      const detected = findLatestUploadedFile('movie-backdrop') || findLatestUploadedFile('backdrop');
      if (detected) backdropUrl = detected;
    }
  }

  // Preserve custom YouTube trailer:
  let trailerYoutubeUrl = currentSettings.movieSettings?.trailerYoutubeUrl;
  if (!trailerYoutubeUrl && backupSettings?.movieSettings?.trailerYoutubeUrl) {
    trailerYoutubeUrl = backupSettings.movieSettings.trailerYoutubeUrl;
  }

  const movieSettings: MovieSettings = {
    ...DEFAULT_MOVIE_SETTINGS,
    ...(backupSettings?.movieSettings || {}),
    ...currentSettings.movieSettings,
    posterUrl: posterUrl || DEFAULT_MOVIE_SETTINGS.posterUrl,
    backdropUrl: backdropUrl || DEFAULT_MOVIE_SETTINGS.backdropUrl,
    trailerYoutubeUrl: trailerYoutubeUrl || '',
    cast:
      Array.isArray(backupSettings?.movieSettings?.cast) && backupSettings.movieSettings.cast.length > 0
        ? backupSettings.movieSettings.cast
        : Array.isArray(currentSettings.movieSettings?.cast) && currentSettings.movieSettings.cast.length > 0
        ? currentSettings.movieSettings.cast
        : DEFAULT_MOVIE_SETTINGS.cast,
  };

  const settings: AppSettings = {
    ...DEFAULT_SETTINGS,
    ...(backupSettings || {}),
    ...currentSettings,
    movieSettings,
    kabarGaleriSettings: {
      ...(DEFAULT_SETTINGS.kabarGaleriSettings || {}),
      ...(backupSettings?.kabarGaleriSettings || {}),
      ...(currentSettings.kabarGaleriSettings || {}),
      mediaCenter: {
        ...(DEFAULT_SETTINGS.kabarGaleriSettings?.mediaCenter || {}),
        ...(backupSettings?.kabarGaleriSettings?.mediaCenter || {}),
        ...(currentSettings.kabarGaleriSettings?.mediaCenter || {}),
      },
    },
  };

  // Auto-migrate legacy 22 November to 20 November
  if (settings.voucherValidDatesText && settings.voucherValidDatesText.includes('22 November')) {
    settings.voucherValidDatesText = settings.voucherValidDatesText.replace(/22 November/g, '20 November');
  }
  if (settings.voucherValidEnd === '2026-11-22') {
    settings.voucherValidEnd = '2026-11-20';
  }
  if (settings.voucherTermsText && settings.voucherTermsText.includes('22 November')) {
    settings.voucherTermsText = settings.voucherTermsText.replace(/22 November/g, '20 November');
  }

  // Merge leads (never lose collected attendee data!)
  let leads = Array.isArray(parsed.leads) ? parsed.leads : [];
  if (Array.isArray(backup?.leads) && backup.leads.length > leads.length) {
    leads = backup.leads;
  }

  // Merge bogo reminders:
  let bogoReminders = Array.isArray(parsed.bogoReminders) ? parsed.bogoReminders : [];
  if (Array.isArray(backup?.bogoReminders) && backup.bogoReminders.length > bogoReminders.length) {
    bogoReminders = backup.bogoReminders;
  }

  // Merge articles:
  let articles = Array.isArray(parsed.articles) ? parsed.articles : [];
  if (Array.isArray(backup?.articles) && backup.articles.length > articles.length) {
    articles = backup.articles;
  }

  // Merge visitors:
  let visitors = Array.isArray(parsed.visitors) ? parsed.visitors : [];
  if (Array.isArray(backup?.visitors) && backup.visitors.length > visitors.length) {
    visitors = backup.visitors;
  }

  const currentDb: DatabaseSchema = {
    settings,
    leads,
    visitors,
    articles,
    bogoReminders,
  };

  // Sync to all backup locations
  saveDb(currentDb);

  return currentDb;
}

export function getDb(): DatabaseSchema {
  return ensureDb();
}

export function saveDb(data: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const payload = JSON.stringify(data, null, 2);

  // 1. Primary DB File
  try {
    fs.writeFileSync(DB_FILE, payload);
  } catch (e) {
    console.error('Error writing DB_FILE:', e);
  }

  // 2. Local Backup File
  try {
    fs.writeFileSync(BAK_FILE, payload);
  } catch {}

  // 3. Local Persist File
  try {
    fs.writeFileSync(PERSIST_FILE, payload);
  } catch {}

  // 4. External Persist File (outside git tree - 100% immune to git pull/checkout/reset!)
  try {
    if (!fs.existsSync(EXTERNAL_DIR)) {
      fs.mkdirSync(EXTERNAL_DIR, { recursive: true });
    }
    fs.writeFileSync(EXTERNAL_DB_FILE, payload);
  } catch {}
}

export function generateVoucherSerial(): string {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PTK-WAR-${rand}`;
}
