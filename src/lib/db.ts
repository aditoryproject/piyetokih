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

  // Dashboard Admin Credentials
  adminUsername?: string;
  adminPasswordHash?: string;
  adminPasswordSalt?: string;
}

export interface ArticleRecord {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string; // Markdown or paragraphs
  coverImage: string;
  galleryImages: string[];
  cityTag?: string; // e.g. "Solo", "Semarang", "Yogyakarta", "Surabaya"
  category: 'Roadshow' | 'Meet & Greet' | 'Kabar Film' | 'Behind The Scene';
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

export interface DatabaseSchema {
  settings: AppSettings;
  leads: LeadRecord[];
  visitors: VisitorLog[];
  articles: ArticleRecord[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');



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
  voucherValidDatesText: '19 - 22 November 2026 (Penayangan Perdana)',
  voucherValidStart: '2026-11-19',
  voucherValidEnd: '2026-11-22',
  voucherTermsText: 'Voucher dapat ditukarkan di bioskop kesayangan Anda pada periode penayangan film Piye To Kih.',

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
};

export const DEFAULT_ARTICLES: ArticleRecord[] = [];

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial: DatabaseSchema = {
      settings: DEFAULT_SETTINGS,
      leads: [],
      visitors: [],
      articles: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      settings: {
        ...DEFAULT_SETTINGS,
        ...parsed.settings,
        movieSettings: {
          ...DEFAULT_MOVIE_SETTINGS,
          ...(parsed.settings?.movieSettings || {}),
          cast:
            Array.isArray(parsed.settings?.movieSettings?.cast) &&
            parsed.settings.movieSettings.cast.length > 0
              ? parsed.settings.movieSettings.cast
              : DEFAULT_MOVIE_SETTINGS.cast,
        },
      },
      leads: parsed.leads || [],
      visitors: parsed.visitors || [],
      articles: Array.isArray(parsed.articles) ? parsed.articles : [],
    };
  } catch {
    return {
      settings: DEFAULT_SETTINGS,
      leads: [],
      visitors: [],
      articles: [],
    };
  }
}

export function getDb(): DatabaseSchema {
  return ensureDb();
}

export function saveDb(data: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export function generateVoucherSerial(): string {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 6; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PTK-WAR-${rand}`;
}
