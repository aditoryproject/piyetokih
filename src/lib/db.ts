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
  metaPixelId: '123456789012345',
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

export const DEFAULT_ARTICLES: ArticleRecord[] = [
  {
    id: 'art-solo-paragon-roadshow',
    slug: 'keseruan-roadshow-solo-paragon-xxi-meet-and-greet',
    title: 'Keseruan Nobar Perdana & Meet The Cast PIYE TO KIH di Solo Paragon XXI',
    summary: 'Suasana riuh penuh tawa menyelimuti Studio 3 Solo Paragon XXI. Ratusan penonton antusias berfoto dan berbincang hangat dengan para pemain film komedi nasional persembahan Miracle Pictures.',
    content: `Solo menjadi salah satu kota pertama yang disambangi oleh tim promosi dan jajaran pemain film "PIYE TO KIH?". Bertempat di Solo Paragon XXI, acara nonton bareng dan Meet & Greet berhasil menyedot animo luar biasa dari masyarakat Kota Bengawan.

Sejak pukul 14.00 WIB, lobi bioskop sudah dipadati para penggemar dan penonton setia yang telah mengamankan tiket presale. Tawa lepas terdengar berkali-kali di dalam studio selama pemutaran film komedi drama keluarga ini berlangsung.

Setelah sesi nonton bareng selesai, para pemain langsung hadir menyapa penonton di dalam studio untuk sesi tanya jawab (Q&A) yang hangat dan penuh canda. Para penonton juga berkesempatan mendapatkan merchandise official dan berfoto bersama di backdrop resmi Miracle Pictures.

"Kami sangat terharu dengan sambutan guyub dan hangat warga Solo. Rasanya energi positif dan tawa penonton di sini menjadi suntikan semangat luar biasa untuk melanjutkan tur roadshow ke kota-kota berikutnya," ungkap salah satu pemain utama saat ditemui di lobi bioskop.`,
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    ],
    cityTag: 'Surakarta (Solo)',
    category: 'Meet & Greet',
    author: 'Tim Media Miracle Pictures',
    publishedAt: '2026-10-25',
    readTime: '3 menit baca',
    isPublished: true,
    seoTitle: 'Keseruan Roadshow Film PIYE TO KIH di Solo Paragon XXI',
    seoDescription: 'Liputan dokumentasi kemeriahan nobar dan Meet The Cast film komedi bioskop PIYE TO KIH di Solo Paragon XXI bersama Miracle Pictures.',
  },
  {
    id: 'art-semarang-the-park-xxi',
    slug: 'tiket-ludes-sambutan-hangat-semarang-film-piye-to-kih',
    title: 'Studio Penuh! Sambutan Hangat Warga Semarang Nobar Film PIYE TO KIH',
    summary: 'The Park XXI Semarang dipadati penonton film komedi drama keluarga PIYE TO KIH. Simak dokumentasi galeri foto keseruan dan antusiasme pengunjung di sini.',
    content: `Kemeriahan tur roadshow film "PIYE TO KIH?" berlanjut di Kota Semarang. Digelar di The Park XXI dan Cinépolis Java Mall, antusiasme penonton Semarang terbukti sangat tinggi hingga kursi studio terisi penuh.

Film karya Miracle Pictures ini dinilai sangat dekat dengan keseharian keluarga Indonesia, dibalut komedi cerdas yang menghibur berbagai kalangan umur mulai dari remaja hingga orang tua.

Banyak penonton mengaku sangat puas dan terhibur. Sesi foto bareng di photo booth resmi Miracle Pictures dipadati antrean yang ingin mengabadikan momen bersama poster film bertanda tangan.`,
    coverImage: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=800&q=80',
    ],
    cityTag: 'Semarang',
    category: 'Roadshow',
    author: 'Tim Promosi Miracle Pictures',
    publishedAt: '2026-10-22',
    readTime: '2 menit baca',
    isPublished: true,
    seoTitle: 'Keseruan Roadshow Film PIYE TO KIH di Semarang',
    seoDescription: 'Dokumentasi nobar film bioskop PIYE TO KIH di The Park XXI Semarang. Cek foto keseruan dan jadwal penayangan kota berikutnya.',
  },
  {
    id: 'art-jogja-ambarrukmo-xxi',
    slug: 'tawa-pecah-di-yogyakarta-roadshow-film-piye-to-kih',
    title: 'Tawa Pecah di Yogyakarta! Roadshow & Diskusi Film Bersama Komunitas',
    summary: 'Plaza Ambarrukmo XXI Jogja menjadi saksi pecahnya tawa penonton saat menyaksikan komedi drama PIYE TO KIH. Simak liputan selengkapnya.',
    content: `Yogyakarta selalu punya tempat istimewa bagi perfilman nasional. Roadshow film "PIYE TO KIH?" di Plaza Ambarrukmo XXI dan Jogja City Mall disambut meriah oleh komunitas pecinta film, mahasiswa, dan keluarga.

Kehangatan cerita yang disajikan sukses mengundang gelak tawa sekaligus momen haru. Seusai pemutaran, tim sutradara dan pemeran menyempatkan diri untuk berdiskusi santai mengenai proses kreatif di balik layar pembuatan film.

Roadshow ini sekaligus menandai komitmen Miracle Pictures dalam menghadirkan tontonan layar lebar yang berkualitas, segar, dan sarat nilai kekeluargaan.`,
    coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=800&q=80',
    ],
    cityTag: 'Yogyakarta',
    category: 'Roadshow',
    author: 'Redaksi Miracle Pictures',
    publishedAt: '2026-10-23',
    readTime: '3 menit baca',
    isPublished: true,
    seoTitle: 'Keseruan Roadshow Film PIYE TO KIH di Yogyakarta',
    seoDescription: 'Liputan kemeriahan pemutaran dan diskusi film komedi drama PIYE TO KIH di Yogyakarta bersama Miracle Pictures.',
  },
];

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial: DatabaseSchema = {
      settings: DEFAULT_SETTINGS,
      leads: [
        {
          id: 'lead-sample-1',
          serialNumber: 'PTK-WAR-849201',
          name: 'Budi Santoso',
          phone: '081234567890',
          email: 'budi@example.com',
          source: 'web',
          claimedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
          whatsappStatus: 'sent',
          emailStatus: 'sent',
          cityLocation: 'Solo',
        },
        {
          id: 'lead-sample-2',
          serialNumber: 'PTK-WAR-958102',
          name: 'Rina Wulandari',
          phone: '085712348899',
          email: 'rina@example.com',
          source: 'whatsapp',
          claimedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          whatsappStatus: 'sent',
          emailStatus: 'sent',
          cityLocation: 'Semarang',
        },
      ],
      visitors: [
        {
          id: 'vis-1',
          ip: '182.253.110.12',
          city: 'Surakarta (Solo)',
          platform: 'Mobile / Android',
          path: '/city/solo',
          subdomain: 'solo',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          event: 'TicketIntent',
        },
        {
          id: 'vis-2',
          ip: '114.124.201.55',
          city: 'Semarang',
          platform: 'Mobile / iOS',
          path: '/',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          event: 'PageView',
        },
      ],
      articles: DEFAULT_ARTICLES,
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
      articles: Array.isArray(parsed.articles) && parsed.articles.length > 0 ? parsed.articles : DEFAULT_ARTICLES,
    };
  } catch {
    return {
      settings: DEFAULT_SETTINGS,
      leads: [],
      visitors: [],
      articles: DEFAULT_ARTICLES,
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
