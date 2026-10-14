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

  // Social Media Links (Editable via Dashboard)
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    facebook?: string; // fanspage
    youtube?: string;
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



export const DEFAULT_ARTICLES: ArticleRecord[] = [
  {
    id: 'art-featured',
    slug: 'resmi-rilis-official-poster-trailer-perdana',
    title: 'PIYE TO KIH? Resmi Rilis Official Poster & Trailer',
    summary: 'Film PIYE TO KIH? akhirnya merilis official poster dan trailer perdana yang memperlihatkan kisah penuh makna tentang persahabatan, keluarga, dan pencarian jati diri di tanah Jawa.',
    content: `Film drama komedi layar lebar **PIYE TO KIH?** persembahan Miracle Pictures akhirnya secara resmi merilis official poster dan trailer perdananya menjelang penayangan serentak di bioskop seluruh Indonesia pada 19 November 2026.

Trailer berdurasi 2 menit 24 detik tersebut menyajikan paduan hangat antara gelak tawa khas sketsa komedi Jawa, dinamika persahabatan sejati, serta konflik emosional mendalam saat seorang pemuda berusaha mencari makna kata pulang setelah mengalami patah hati terberat dalam hidupnya.

Disutradarai dengan sentuhan sinematik berlatar keindahan lanskap pedesaan hingga hiruk pikuk kota di Jawa Tengah dan Jawa Timur, PIYE TO KIH? menghadirkan ensemble cast penuh warna termasuk para punggawa Woko Channel (Pak No, Ganden, Mukidi, Penyok), aktris berbakat Dara Sarasvati, dan deretan talenta lokal yang memperkuat autentisitas budaya setempat.

"Melalui film ini, kami ingin merangkul seluruh penonton dengan cerita yang sangat dekat dengan keseharian kita. Bukan sekadar komedi yang menghibur, tapi juga pelukan hangat bagi siapa pun yang sedang berjuang menemukan jalan pulang," ungkap sang sutradara dalam sesi peluncuran trailer di Jakarta.

Poster resmi memperlihatkan para tokoh utama duduk bersama di atas bukit memandang panorama kota saat senja keemasan, mencerminkan tagline utama film: *"Tentang kita, yang selalu mencari jalan pulang."*

Saksikan PIYE TO KIH? serentak di seluruh jaringan bioskop Cinema XXI, CGV, Cinepolis, dan bioskop mitra mulai 19 November 2026. Jangan lewatkan promo Presale Buy 1 Get 1 yang akan dibuka mulai 15 hingga 18 November 2026 di platform TIX ID dan M-TIX.`,
    coverImage: '/kabar-galeri-hero.jpg',
    galleryImages: [
      '/kabar-galeri-hero.jpg',
      '/kabar-galeri/kabar-semarang.jpg',
      '/kabar-galeri/foto-press-conf.jpg',
    ],
    category: 'Kabar Film',
    tag: 'TRAILER',
    tags: ['TRAILER', 'POSTER', 'PREMIERE'],
    featured: true,
    author: 'Miracle Pictures',
    publishedAt: '2026-10-14',
    readTime: '3 menit baca',
    isPublished: true,
    seoTitle: 'PIYE TO KIH? Resmi Rilis Official Poster & Trailer - Miracle Pictures',
    seoDescription: 'Official poster dan trailer film PIYE TO KIH resmi dirilis. Simak kisah penuh tawa dan kehangatan persahabatan yang tayang 19 November di bioskop.',
  },
  {
    id: 'art-1',
    slug: 'piye-to-kih-mulai-roadshow-dari-semarang',
    title: 'PIYE TO KIH? Mulai Roadshow dari Semarang',
    summary: 'Antusiasme luar biasa mewarnai roadshow perdana film PIYE TO KIH? di Semarang. Ribuan penonton hadir menyambut para pemain dan sutradara dengan hangat.',
    content: `Rangkaian tur roadshow dan sesi temu sapa (Meet & Greet) film PIYE TO KIH? resmi dimulai dengan kota Semarang sebagai destinasi pembuka.

Ribuan penggemar dan pecinta film memadati atrium mall dan bioskop mitra sejak siang hari untuk menyapa langsung jajaran pemeran utama. Gelak tawa dan teriakan antusias menggema saat para pemain berbagi cerita seru dan pengalaman lucu selama proses syuting berlangsung.

"Semarang luar biasa! Energi dan kehangatan sambutan sedulur-sedulur di sini menjadi suntikan semangat luar biasa bagi seluruh tim menjelang penayangan perdana 19 November nanti," tutur salah satu pemeran.

Selain sesi tanya jawab eksklusif, acara ini juga dimeriahkan dengan pembagian merchandise resmi serta penukaran kode verifikasi voucher roadshow di booth Miracle Pictures.`,
    coverImage: '/kabar-galeri/kabar-semarang.jpg',
    galleryImages: [
      '/kabar-galeri/kabar-semarang.jpg',
      '/kabar-galeri/foto-roadshow-semarang.jpg',
    ],
    category: 'Kabar Film',
    tag: 'ROADSHOW',
    tags: ['ROADSHOW', 'SEMARANG', 'MEET & GREET'],
    cityTag: 'Semarang',
    author: 'Tim Media Miracle Pictures',
    publishedAt: '2026-10-12',
    readTime: '3 menit baca',
    isPublished: true,
  },
  {
    id: 'art-2',
    slug: 'soundtrack-sigaran-nyowo-resmi-dirilis',
    title: 'Soundtrack Sigaran Nyowo Resmi Dirilis',
    summary: 'Lagu tema film PIYE TO KIH? yang berjudul "Sigaran Nyowo" kini resmi dirilis di seluruh platform musik digital menemani perjalanan emosional penonton.',
    content: `Menyambut peluncuran film di layar lebar, original soundtrack (OST) resmi bertajuk **"Sigaran Nyowo"** kini telah dapat dinikmati di berbagai platform streaming musik digital seperti Spotify, Apple Music, dan YouTube Music.

Lagu bernuansa akustik pop-folk berbalut lirik bahasa Jawa yang puitis ini merefleksikan kedalaman rasa rindu, ketegaran hati, dan pengorbanan demi orang-orang tercinta.

Lagu ini diperdengarkan pada adegan-adegan penting dalam film, memberikan dimensi rasa yang mendalam dan memperkuat ikatan batin antara karakter dan penonton.`,
    coverImage: '/kabar-galeri/kabar-soundtrack.jpg',
    galleryImages: [
      '/kabar-galeri/kabar-soundtrack.jpg',
      '/kabar-galeri/video-soundtrack.jpg',
    ],
    category: 'Kabar Film',
    tag: 'SOUNDTRACK',
    tags: ['SOUNDTRACK', 'MUSIK', 'SIGARAN NYOWO'],
    author: 'Tim Musik Miracle Pictures',
    publishedAt: '2026-10-05',
    readTime: '2 menit baca',
    isPublished: true,
  },
  {
    id: 'art-3',
    slug: 'home-premiere-kediri-digelar-6-november',
    title: 'Home Premiere Kediri Digelar 6 November',
    summary: 'Kota Kediri menjadi lokasi istimewa untuk home premiere film PIYE TO KIH? Doa, dukungan, dan harapan besar menyertai penayangan istimewa ini.',
    content: `Sebagai tanah kelahiran cerita dan ruang bertumbuhnya para talenta Woko Channel, Kota Kediri dipilih secara khusus sebagai tuan rumah penayangan Home Premiere film PIYE TO KIH? pada 6 November 2026.

Acara istimewa ini dirancang sebagai bentuk apresiasi dan penghormatan kepada keluarga, kerabat, serta masyarakat Kediri yang telah memberikan dukungan tanpa henti sejak awal mula perjalanan mereka.

"Kediri adalah rumah, tempat di mana akar cerita kami bermula. Membawa karya ini pertama kali ke hadapan sedulur di Kediri adalah momen sakral dan penuh haru bagi kami semua," ujar perwakilan tim produksi.`,
    coverImage: '/kabar-galeri/kabar-kediri.jpg',
    galleryImages: [
      '/kabar-galeri/kabar-kediri.jpg',
      '/kabar-galeri/foto-home-premiere.jpg',
    ],
    category: 'Kabar Film',
    tag: 'PREMIERE',
    tags: ['PREMIERE', 'KEDIRI', 'SPECIAL'],
    cityTag: 'Kediri',
    author: 'Tim Media Miracle Pictures',
    publishedAt: '2026-09-28',
    readTime: '3 menit baca',
    isPublished: true,
  },
  {
    id: 'art-4',
    slug: 'special-screening-magelang-disambut-antusias',
    title: 'Special Screening Magelang Disambut Antusias',
    summary: 'Penonton Magelang memberikan respons positif dalam special screening film PIYE TO KIH? yang berlangsung meriah di bioskop mitra.',
    content: `Penayangan khusus (Special Screening) terbatas film PIYE TO KIH? di Magelang sukses mengundang tawa sekaligus haru ratusan penonton yang berkesempatan menyaksikan cuplikan film lebih awal.

Ruang bioskop dipenuhi gelak tawa sepanjang pemutaran, dengan tepuk tangan meriah membahana saat film usai. Dalam sesi diskusi setelah penayangan, para penonton memuji keseimbangan cerita yang berhasil memadukan humor segar dan pesan moral yang menyentuh.`,
    coverImage: '/kabar-galeri/kabar-magelang.jpg',
    galleryImages: [
      '/kabar-galeri/kabar-magelang.jpg',
    ],
    category: 'Kabar Film',
    tag: 'SCREENING',
    tags: ['SCREENING', 'MAGELANG', 'BIOSKOP'],
    cityTag: 'Magelang',
    author: 'Tim Media Miracle Pictures',
    publishedAt: '2026-09-21',
    readTime: '2 menit baca',
    isPublished: true,
  },
  {
    id: 'pr-1',
    slug: 'press-release-rilis-official-poster-dan-trailer-jelang-19-november',
    title: 'PIYE TO KIH? Rilis Official Poster dan Trailer Jelang Penayangan Serentak 19 November',
    summary: 'Siaran Pers Resmi: Miracle Pictures mengumumkan peluncuran trailer utama dan materi promosi resmi film komedi drama PIYE TO KIH? yang siap tayang di bioskop seluruh Indonesia.',
    content: `**SIARAN PERS RESMI - UNTUK SEGERA DISIARKAN**

**JAKARTA, 13 OKTOBER 2026** – Rumah produksi Miracle Pictures hari ini secara resmi meluncurkan materi promosi utama berupa Official Poster dan Trailer perdana film layar lebar *"PIYE TO KIH?"*. Film ini dijadwalkan tayang serentak di bioskop seluruh Indonesia mulai 19 November 2026.

Film ini merupakan persembahan karya anak negeri yang mengangkat nuansa lokal Jawa dengan penceritaan modern yang hangat, sarat humor, serta relevan bagi seluruh keluarga Indonesia.

**Aset Media & Unduhan Resmi:**
Materi siaran pers lengkap beserta foto resolusi tinggi, poster resmi, video trailer, dan lembar fakta (fact sheet) dapat diunduh melalui Media Center resmi pada tautan [Media Center](/media).

**Kontak Media:**
Tim Hubungan Masyarakat Miracle Pictures
Email: press@piyetokihfilm.com | WhatsApp: +62 822-1234-5678
Website: piyetokihfilm.com`,
    coverImage: '/kabar-galeri-hero.jpg',
    galleryImages: ['/kabar-galeri-hero.jpg'],
    category: 'Press Release',
    tag: 'PRESS RELEASE',
    pdfUrl: '/docs/press-release-piyetokih-official.pdf',
    author: 'Divisi Humas & Media Miracle Pictures',
    publishedAt: '2026-10-13',
    readTime: '2 menit baca',
    isPublished: true,
  },
  {
    id: 'mc-1',
    slug: 'kompas-film-piye-to-kih-angkat-realitas-komedi',
    title: 'Film \'PIYE TO KIH?\': Angkat Realitas Komedi & Nilai Kekeluargaan Tanah Jawa',
    summary: 'Ulasan mendalam media nasional mengenai nilai kultural dan kesegaran humor Woko Channel dalam debut layar lebar yang dinanti publik.',
    content: `Liputan media eksternal dari Kompas.com yang membahas kekuatan narasi dan kehangatan komedi dalam film PIYE TO KIH?. Silakan baca liputan lengkap langsung pada portal Kompas.`,
    coverImage: '/kabar-galeri/kabar-semarang.jpg',
    galleryImages: ['/kabar-galeri/kabar-semarang.jpg'],
    category: 'Media Coverage',
    tag: 'ARTICLE',
    mediaName: 'Kompas.com',
    externalUrl: 'https://www.kompas.com',
    author: 'Redaksi Kompas',
    publishedAt: '2026-10-10',
    isPublished: true,
  },
  {
    id: 'mc-2',
    slug: 'detik-trailer-piye-to-kih-tembus-trending',
    title: 'Trailer PIYE TO KIH? Tembus Trending: Kisah Sukma & Mukidi Bikin Penasaran',
    summary: 'Antusiasme warganet membludak menyaksikan trailer perdana, mencetak rekor interaksi di berbagai kanal media sosial.',
    content: `Liputan media eksternal dari Detik Hot mengenai respons positif masyarakat terhadap peluncuran trailer resmi PIYE TO KIH?.`,
    coverImage: '/kabar-galeri/kabar-soundtrack.jpg',
    galleryImages: ['/kabar-galeri/kabar-soundtrack.jpg'],
    category: 'Media Coverage',
    tag: 'REVIEW',
    mediaName: 'Detik Hot',
    externalUrl: 'https://hot.detik.com',
    author: 'Detik Hot Newsroom',
    publishedAt: '2026-10-08',
    isPublished: true,
  },
  {
    id: 'mc-3',
    slug: 'cnn-wawancara-eksklusif-cast-piye-to-kih',
    title: 'Wawancara Eksklusif Cast PIYE TO KIH?: Dari Sketsa Komedi ke Layar Lebar',
    summary: 'Bincang eksklusif bersama sutradara dan pemeran utama mengenai transformasi kreatif dan tantangan produksi sinematik berskala nasional.',
    content: `Liputan wawancara mendalam di studio CNN Indonesia TV bersama para pemeran utama film PIYE TO KIH?.`,
    coverImage: '/kabar-galeri/foto-press-conf.jpg',
    galleryImages: ['/kabar-galeri/foto-press-conf.jpg'],
    category: 'Media Coverage',
    tag: 'TV / INTERVIEW',
    mediaName: 'CNN Indonesia',
    externalUrl: 'https://www.cnnindonesia.com',
    author: 'CNN Indonesia TV',
    publishedAt: '2026-10-04',
    isPublished: true,
  },
  {
    id: 'album-1',
    slug: 'press-conference-jakarta',
    title: 'Press Conference Jakarta',
    summary: 'Momen konferensi pers resmi peluncuran film PIYE TO KIH? bersama jajaran sutradara, produser, dan seluruh pemeran.',
    content: `Dokumentasi foto lengkap konferensi pers resmi film PIYE TO KIH? yang dihadiri puluhan jurnalis nasional di Jakarta.`,
    coverImage: '/kabar-galeri/foto-press-conf.jpg',
    galleryImages: [
      '/kabar-galeri/foto-press-conf.jpg',
      '/kabar-galeri-hero.jpg',
      '/kabar-galeri/kabar-semarang.jpg',
    ],
    category: 'Galeri Foto',
    tag: 'PRESS CONFERENCE',
    photoCount: 32,
    location: 'Jakarta',
    author: 'Dokumentasi Miracle Pictures',
    publishedAt: '2026-10-10',
    isPublished: true,
  },
  {
    id: 'album-2',
    slug: 'roadshow-semarang',
    title: 'Roadshow Semarang',
    summary: 'Dokumentasi kehangatan ribuan penonton dalam roadshow Meet and Greet perdana di kota Semarang.',
    content: `Galeri foto eksklusif kemeriahan temu sapa bersama ribuan sedulur di Semarang.`,
    coverImage: '/kabar-galeri/foto-roadshow-semarang.jpg',
    galleryImages: [
      '/kabar-galeri/foto-roadshow-semarang.jpg',
      '/kabar-galeri/kabar-semarang.jpg',
    ],
    category: 'Galeri Foto',
    tag: 'ROADSHOW',
    photoCount: 28,
    location: 'Semarang',
    author: 'Dokumentasi Miracle Pictures',
    publishedAt: '2026-10-12',
    isPublished: true,
  },
  {
    id: 'album-3',
    slug: 'home-premiere-kediri',
    title: 'Home Premiere Kediri',
    summary: 'Momen penuh haru dan tawa dalam penayangan perdana spesial bersama keluarga besar Woko Channel di Kediri.',
    content: `Koleksi foto eksklusif dari malam pemutaran perdana Home Premiere di Kediri.`,
    coverImage: '/kabar-galeri/foto-home-premiere.jpg',
    galleryImages: [
      '/kabar-galeri/foto-home-premiere.jpg',
      '/kabar-galeri/kabar-kediri.jpg',
    ],
    category: 'Galeri Foto',
    tag: 'PREMIERE',
    photoCount: 45,
    location: 'Kediri',
    author: 'Dokumentasi Miracle Pictures',
    publishedAt: '2026-09-28',
    isPublished: true,
  },
  {
    id: 'vid-1',
    slug: 'official-trailer-piye-to-kih',
    title: 'Official Trailer',
    summary: 'Trailer resmi film komedi drama PIYE TO KIH? produksi Miracle Pictures.',
    content: `Saksikan trailer resmi film komedi drama PIYE TO KIH?. Tayang serentak 19 November 2026 di seluruh bioskop Indonesia.`,
    coverImage: '/kabar-galeri/video-trailer.jpg',
    galleryImages: ['/kabar-galeri/video-trailer.jpg'],
    category: 'Galeri Video',
    videoUrl: 'https://www.youtube.com/watch?v=kYJv8Pj328Q',
    videoDuration: '2:24',
    tag: 'TRAILER',
    author: 'Miracle Pictures',
    publishedAt: '2026-10-13',
    isPublished: true,
  },
  {
    id: 'vid-2',
    slug: 'soundtrack-sigaran-nyowo-video',
    title: 'Soundtrack - Sigaran Nyowo',
    summary: 'Official Music Video soundtrack Sigaran Nyowo.',
    content: `Klip musik resmi lagu tema Sigaran Nyowo persembahan Miracle Pictures.`,
    coverImage: '/kabar-galeri/video-soundtrack.jpg',
    galleryImages: ['/kabar-galeri/video-soundtrack.jpg'],
    category: 'Galeri Video',
    videoUrl: 'https://www.youtube.com/watch?v=kYJv8Pj328Q',
    videoDuration: '3:56',
    tag: 'SOUNDTRACK',
    author: 'Miracle Pictures',
    publishedAt: '2026-10-05',
    isPublished: true,
  },
  {
    id: 'vid-3',
    slug: 'behind-the-scenes',
    title: 'Behind The Scenes',
    summary: 'Keseruan dan proses kreatif di balik layar pembuatan film PIYE TO KIH.',
    content: `Melihat lebih dekat keseruan proses syuting di berbagai sudut Jawa bersama jajaran kru dan pemain.`,
    coverImage: '/kabar-galeri/video-bts.jpg',
    galleryImages: ['/kabar-galeri/video-bts.jpg'],
    category: 'Galeri Video',
    videoUrl: 'https://www.youtube.com/watch?v=kYJv8Pj328Q',
    videoDuration: '4:12',
    tag: 'BTS',
    author: 'Miracle Pictures',
    publishedAt: '2026-09-30',
    isPublished: true,
  },
  {
    id: 'vid-4',
    slug: 'roadshow-recap',
    title: 'Roadshow Recap',
    summary: 'Kompilasi keseruan dan antusiasme penonton selama rangkaian tur roadshow.',
    content: `Rangkuman video antusiasme para pecinta film di berbagai kota singgah roadshow.`,
    coverImage: '/kabar-galeri/video-recap.jpg',
    galleryImages: ['/kabar-galeri/video-recap.jpg'],
    category: 'Galeri Video',
    videoUrl: 'https://www.youtube.com/watch?v=kYJv8Pj328Q',
    videoDuration: '5:08',
    tag: 'ROADSHOW',
    author: 'Miracle Pictures',
    publishedAt: '2026-10-12',
    isPublished: true,
  },
];

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

  // Social Media Channels
  socialLinks: {
    instagram: 'https://www.instagram.com/piyetokihfilm.official/',
    tiktok: 'https://www.tiktok.com/@piyetokihfilm.official',
    facebook: 'https://www.facebook.com/piyetokihfilm.official',
    youtube: 'https://www.youtube.com/@piyetokihfilm',
  },
};

function ensureDb(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial: DatabaseSchema = {
      settings: DEFAULT_SETTINGS,
      leads: [],
      visitors: [],
      articles: DEFAULT_ARTICLES,
      bogoReminders: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    const settings: AppSettings = {
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
    };

    // Auto-migrate legacy 22 November to 20 November
    let hasDateUpdate = false;
    if (settings.voucherValidDatesText && settings.voucherValidDatesText.includes('22 November')) {
      settings.voucherValidDatesText = settings.voucherValidDatesText.replace(/22 November/g, '20 November');
      hasDateUpdate = true;
    }
    if (settings.voucherValidEnd === '2026-11-22') {
      settings.voucherValidEnd = '2026-11-20';
      hasDateUpdate = true;
    }
    if (settings.voucherTermsText && settings.voucherTermsText.includes('22 November')) {
      settings.voucherTermsText = settings.voucherTermsText.replace(/22 November/g, '20 November');
      hasDateUpdate = true;
    }

    const articles = Array.isArray(parsed.articles) && parsed.articles.length > 0 ? parsed.articles : DEFAULT_ARTICLES;

    const currentDb: DatabaseSchema = {
      settings,
      leads: parsed.leads || [],
      visitors: parsed.visitors || [],
      articles,
      bogoReminders: Array.isArray(parsed.bogoReminders) ? parsed.bogoReminders : [],
    };

    if (hasDateUpdate || (!Array.isArray(parsed.articles) || parsed.articles.length === 0)) {
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(currentDb, null, 2));
      } catch {}
    }

    return currentDb;
  } catch {
    return {
      settings: DEFAULT_SETTINGS,
      leads: [],
      visitors: [],
      articles: DEFAULT_ARTICLES,
      bogoReminders: [],
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
