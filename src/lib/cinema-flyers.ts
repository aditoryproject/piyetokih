/**
 * Master Database Lokasi Bioskop Penayangan Serentak 19 November 2026
 * Diekstrak 100% akurat dari 9 Flyer Resmi di folder `cinema list flyer/`:
 * 1. PYTK_LIST_XXI_COVER.jpg
 * 2. PYTK_LIST_XXI_1.jpg
 * 3. PYTK_LIST_XXI_2.jpg
 * 4. PYTK_LIST_CGV.jpg
 * 5. PYTK_LIST_CINEPOLIS.jpg
 * 6. PYTK_LIST_SAMS.jpg
 * 7. PYTK_LIST_NSC.jpg
 * 8. PYTK_LIST_PLATINUM.jpg
 * 9. PYTK_LIST_MIX.jpg
 */

export type FlyerKey =
  | 'COVER'
  | 'XXI_1'
  | 'XXI_2'
  | 'CGV'
  | 'CINEPOLIS'
  | 'SAMS'
  | 'NSC'
  | 'PLATINUM'
  | 'MIX';

export const FLYER_PATHS: Record<FlyerKey, string> = {
  COVER: '/flyers/PYTK_LIST_XXI_COVER.jpg',
  XXI_1: '/flyers/PYTK_LIST_XXI_1.jpg',
  XXI_2: '/flyers/PYTK_LIST_XXI_2.jpg',
  CGV: '/flyers/PYTK_LIST_CGV.jpg',
  CINEPOLIS: '/flyers/PYTK_LIST_CINEPOLIS.jpg',
  SAMS: '/flyers/PYTK_LIST_SAMS.jpg',
  NSC: '/flyers/PYTK_LIST_NSC.jpg',
  PLATINUM: '/flyers/PYTK_LIST_PLATINUM.jpg',
  MIX: '/flyers/PYTK_LIST_MIX.jpg',
};

export interface NationalCinemaItem {
  name: string;
  chain: string;
  flyerKey: FlyerKey;
  bookingChannel: string;
}

export interface NationalCitySchedule {
  cityKey: string;
  displayName: string;
  provinceOrRegion: string;
  aliases: string[];
  cinemas: NationalCinemaItem[];
}

export const NATIONAL_CINEMA_FLYER_DATA: NationalCitySchedule[] = [
  // ================= JABODETABEK, BANTEN & JAWA BARAT =================
  {
    cityKey: 'jakarta',
    displayName: 'Jakarta',
    provinceOrRegion: 'DKI Jakarta',
    aliases: ['jakarta', 'dki jakarta', 'jkt', 'jakpus', 'jaksel', 'jakbar', 'jaktim', 'jakut', 'blok m', 'daan mogot', 'senen', 'cipinang', 'klender', 'pgc', 'cililitan'],
    cinemas: [
      { name: 'Blok M Square 21', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Daan Mogot XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Mal Atrium Senen XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Cipinang XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Ciplaz Klender XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'PGC XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
    ],
  },
  {
    cityKey: 'bandung',
    displayName: 'Bandung',
    provinceOrRegion: 'Jawa Barat',
    aliases: ['bandung', 'bdg', 'ciwalk', 'cihampelas'],
    cinemas: [
      { name: 'Ciwalk XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
    ],
  },
  {
    cityKey: 'bogor',
    displayName: 'Bogor',
    provinceOrRegion: 'Jawa Barat',
    aliases: ['bogor', 'bgr', 'mall btm', 'cibinong', 'ccm'],
    cinemas: [
      { name: 'Mall BTM XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Cibinong City XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
    ],
  },
  {
    cityKey: 'depok',
    displayName: 'Depok',
    provinceOrRegion: 'Jawa Barat',
    aliases: ['depok', 'cinere', 'ciplaz depok'],
    cinemas: [
      { name: 'Ciplaz Depok XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Cinere 21', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
    ],
  },
  {
    cityKey: 'tangerang',
    displayName: 'Tangerang & BSD',
    provinceOrRegion: 'Banten',
    aliases: ['tangerang', 'tangsel', 'bintaro', 'balekota', 'ciledug', 'bsd', 'eastavara'],
    cinemas: [
      { name: 'Plaza Bintaro XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Balekota XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Ciplaz Ciledug XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Platinum BSD Eastavara', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
    ],
  },
  {
    cityKey: 'cilegon',
    displayName: 'Cilegon',
    provinceOrRegion: 'Banten',
    aliases: ['cilegon', 'serang', 'banten'],
    cinemas: [
      { name: 'Transmart Cilegon XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
    ],
  },
  {
    cityKey: 'bekasi',
    displayName: 'Bekasi & Cikarang',
    provinceOrRegion: 'Jawa Barat',
    aliases: ['bekasi', 'cikarang', 'pondok gede', 'mega bekasi', 'chadstone', 'blu plaza', 'meikarta', 'cibitung', 'grand galaxy', 'greenland'],
    cinemas: [
      { name: 'Mega Bekasi XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Pondok Gede XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Chadstone XXI (Cikarang)', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Cinépolis Blu Plaza Bekasi', chain: 'Cinépolis', flyerKey: 'CINEPOLIS', bookingChannel: 'Cinépolis / TIX ID' },
      { name: 'Cinépolis Distrik 1 Meikarta', chain: 'Cinépolis', flyerKey: 'CINEPOLIS', bookingChannel: 'Cinépolis / TIX ID' },
      { name: 'Platinum Cibitung', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
      { name: 'Flix Cinema Grand Galaxy Park', chain: 'Flix Cinema', flyerKey: 'MIX', bookingChannel: 'Flix Cinema / Loket Bioskop' },
      { name: 'KCM Greenland', chain: 'Kota Cinema Mall', flyerKey: 'MIX', bookingChannel: 'Loket KCM' },
    ],
  },
  {
    cityKey: 'cirebon',
    displayName: 'Cirebon',
    provinceOrRegion: 'Jawa Barat',
    aliases: ['cirebon', 'ramayana cirebon'],
    cinemas: [
      { name: 'Ramayana Cirebon XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
    ],
  },
  {
    cityKey: 'cianjur',
    displayName: 'Cianjur',
    provinceOrRegion: 'Jawa Barat',
    aliases: ['cianjur'],
    cinemas: [
      { name: "Sam's Studios Cianjur", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
    ],
  },
  {
    cityKey: 'sukabumi',
    displayName: 'Sukabumi (Cibadak & Jalur)',
    provinceOrRegion: 'Jawa Barat',
    aliases: ['sukabumi', 'cibadak', 'jalur'],
    cinemas: [
      { name: "Sam's Studios Cibadak", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
      { name: "Sam's Studios Jalur", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
    ],
  },
  {
    cityKey: 'indramayu',
    displayName: 'Indramayu',
    provinceOrRegion: 'Jawa Barat',
    aliases: ['indramayu'],
    cinemas: [
      { name: "Sam's Studios Indramayu", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
    ],
  },
  {
    cityKey: 'subang',
    displayName: 'Subang',
    provinceOrRegion: 'Jawa Barat',
    aliases: ['subang'],
    cinemas: [
      { name: "Sam's Studios Subang", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
    ],
  },

  // ================= JAWA TENGAH & DIY =================
  {
    cityKey: 'semarang',
    displayName: 'Semarang & Ungaran',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['semarang', 'smg', 'ungaran', 'mangkang', 'dp mall', 'bsb', 'uptown mall', 'central city', 'java supermal', 'java mall'],
    cinemas: [
      { name: 'DP Mall XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Uptown Mall BSB City XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Central City XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Cinépolis Java Supermal', chain: 'Cinépolis', flyerKey: 'CINEPOLIS', bookingChannel: 'Cinépolis / TIX ID' },
      { name: 'NSC Mangkang', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
      { name: "Sam's Studios Ungaran", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
    ],
  },
  {
    cityKey: 'yogyakarta',
    displayName: 'Yogyakarta (Jogja, Kulonprogo & Wonosari)',
    provinceOrRegion: 'DI Yogyakarta',
    aliases: ['yogyakarta', 'jogja', 'yogya', 'kulonprogo', 'kulon progo', 'wonosari', 'gunungkidul', 'jcm', 'jogja city', 'jwalk', 'maguwo'],
    cinemas: [
      { name: 'Jogja City XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Jwalk Jogja CGV', chain: 'CGV Cinemas', flyerKey: 'CGV', bookingChannel: 'CGV App / Web / TIX ID' },
      { name: 'Transmart Maguwo CGV', chain: 'CGV Cinemas', flyerKey: 'CGV', bookingChannel: 'CGV App / Web / TIX ID' },
      { name: 'NSC Kulonprogo', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
      { name: 'NSC Wonosari', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'solo',
    displayName: 'Solo (Surakarta)',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['solo', 'surakarta', 'grand xxi solo', 'transmart solo', 'platinum solo', 'sams solo'],
    cinemas: [
      { name: 'Grand XXI Solo', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Transmart Solo CGV', chain: 'CGV Cinemas', flyerKey: 'CGV', bookingChannel: 'CGV App / Web / TIX ID' },
      { name: 'Platinum Solo', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
      { name: "Sam's Studios Solo", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
    ],
  },
  {
    cityKey: 'klaten',
    displayName: 'Klaten',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['klaten', 'klatos', 'klaten town square'],
    cinemas: [
      { name: 'Klaten Town Square XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: "Sam's Studios Klaten", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
    ],
  },
  {
    cityKey: 'magelang',
    displayName: 'Magelang',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['magelang', 'artos', 'platinum magelang'],
    cinemas: [
      { name: 'Platinum Magelang', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
    ],
  },
  {
    cityKey: 'sragen',
    displayName: 'Sragen',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['sragen', 'platinum sragen'],
    cinemas: [
      { name: 'Platinum Cineplex Sragen', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
    ],
  },
  {
    cityKey: 'pekalongan',
    displayName: 'Pekalongan',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['pekalongan'],
    cinemas: [
      { name: 'Pekalongan XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: "Sam's Studios Pekalongan", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
    ],
  },
  {
    cityKey: 'tegal',
    displayName: 'Tegal & Slawi',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['tegal', 'slawi', 'pacific mall tegal', 'transmart tegal', 'gajah mada tegal'],
    cinemas: [
      { name: 'Transmart Tegal CGV', chain: 'CGV Cinemas', flyerKey: 'CGV', bookingChannel: 'CGV App / Web / TIX ID' },
      { name: 'Cinépolis Pacific Mall Tegal', chain: 'Cinépolis', flyerKey: 'CINEPOLIS', bookingChannel: 'Cinépolis / TIX ID' },
      { name: 'Gajah Mada Cinema Tegal', chain: 'Gajah Mada Cinema', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
      { name: 'MSB Cinema Slawi (Kab. Tegal)', chain: 'MSB Cinema', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
    ],
  },
  {
    cityKey: 'brebes',
    displayName: 'Brebes (Bulakamba & Bumiayu)',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['brebes', 'bulakamba', 'bumiayu', 'msb cinema'],
    cinemas: [
      { name: 'MSB Cinema Brebes', chain: 'MSB Cinema', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
      { name: 'MSB Cinema Bulakamba (Kab. Brebes)', chain: 'MSB Cinema', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
      { name: 'MSB Cinema Bumiayu (Kab. Brebes)', chain: 'MSB Cinema', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
    ],
  },
  {
    cityKey: 'purwokerto',
    displayName: 'Purwokerto (Banyumas)',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['purwokerto', 'banyumas', 'pwt', 'rita supermall'],
    cinemas: [
      { name: 'Rita Supermall CGV', chain: 'CGV Cinemas', flyerKey: 'CGV', bookingChannel: 'CGV App / Web / TIX ID' },
    ],
  },
  {
    cityKey: 'cilacap',
    displayName: 'Cilacap (Majenang & Kroya)',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['cilacap', 'majenang', 'kroya', 'dakota cilacap', 'sena moviemax'],
    cinemas: [
      { name: 'Platinum Majenang (Cilacap)', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
      { name: 'Dakota Cilacap', chain: 'Dakota Cinema', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
      { name: 'Sena Moviemax Kroya', chain: 'Sena Moviemax', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
    ],
  },
  {
    cityKey: 'kebumen',
    displayName: 'Kebumen & Gombong',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['kebumen', 'gombong'],
    cinemas: [
      { name: 'Platinum Kebumen', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
      { name: "Sam's Studios Kebumen", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
      { name: "Sam's Studios Gombong", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
    ],
  },
  {
    cityKey: 'pemalang',
    displayName: 'Pemalang',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['pemalang'],
    cinemas: [
      { name: "Sam's Studios Pemalang", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
      { name: 'NSC Pemalang', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'salatiga',
    displayName: 'Salatiga',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['salatiga'],
    cinemas: [
      { name: "Sam's Studios Salatiga", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
      { name: 'NSC Salatiga', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'purbalingga',
    displayName: 'Purbalingga',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['purbalingga'],
    cinemas: [
      { name: 'NSC Purbalingga', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'banjarnegara',
    displayName: 'Banjarnegara',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['banjarnegara', 'surya yudha'],
    cinemas: [
      { name: 'Surya Yudha Cineplex Banjarnegara', chain: 'Surya Yudha Cineplex', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
    ],
  },
  {
    cityKey: 'wonosobo',
    displayName: 'Wonosobo',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['wonosobo'],
    cinemas: [
      { name: 'NSC Wonosobo', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'purworejo',
    displayName: 'Purworejo',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['purworejo'],
    cinemas: [
      { name: 'NSC Purworejo', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'temanggung',
    displayName: 'Temanggung',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['temanggung'],
    cinemas: [
      { name: 'NSC Temanggung', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'demak',
    displayName: 'Demak',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['demak'],
    cinemas: [
      { name: 'NSC Demak', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'kendal',
    displayName: 'Kendal',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['kendal'],
    cinemas: [
      { name: 'NSC Kendal', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'batang',
    displayName: 'Batang',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['batang'],
    cinemas: [
      { name: 'Platinum Batang', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
    ],
  },
  {
    cityKey: 'kudus',
    displayName: 'Kudus',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['kudus'],
    cinemas: [
      { name: 'NSC Kudus', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'jepara',
    displayName: 'Jepara',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['jepara'],
    cinemas: [
      { name: 'NSC Jepara', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'pati',
    displayName: 'Pati',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['pati'],
    cinemas: [
      { name: 'NSC Pati', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'rembang',
    displayName: 'Rembang',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['rembang'],
    cinemas: [
      { name: 'NSC Rembang', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'blora',
    displayName: 'Blora & Cepu',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['blora', 'cepu'],
    cinemas: [
      { name: 'Platinum Blora', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
      { name: 'NSC Cepu', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'purwodadi',
    displayName: 'Purwodadi (Grobogan)',
    provinceOrRegion: 'Jawa Tengah',
    aliases: ['purwodadi', 'grobogan', 'jig cinema'],
    cinemas: [
      { name: 'NSC Purwodadi', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
      { name: 'JIG Cinema Purwodadi', chain: 'JIG Cinema', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
    ],
  },

  // ================= JAWA TIMUR =================
  {
    cityKey: 'surabaya',
    displayName: 'Surabaya',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['surabaya', 'sby', 'tunjungan', 'ptc', 'pakuwon', 'royal xxi', 'rungkut', 'bg junction', 'maspion', 'cito', 'city of tomorrow'],
    cinemas: [
      { name: 'Tunjungan 3 XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'PTC XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Royal XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Transmart Rungkut XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'BG Junction CGV', chain: 'CGV Cinemas', flyerKey: 'CGV', bookingChannel: 'CGV App / Web / TIX ID' },
      { name: 'Maspion Square CGV', chain: 'CGV Cinemas', flyerKey: 'CGV', bookingChannel: 'CGV App / Web / TIX ID' },
      { name: 'Cinépolis City of Tomorrow (Cito)', chain: 'Cinépolis', flyerKey: 'CINEPOLIS', bookingChannel: 'Cinépolis / TIX ID' },
    ],
  },
  {
    cityKey: 'sidoarjo',
    displayName: 'Sidoarjo',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['sidoarjo', 'sda', 'ciplaz sidoarjo', 'platinum sidoarjo'],
    cinemas: [
      { name: 'Ciplaz Sidoarjo XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Platinum Sidoarjo', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
    ],
  },
  {
    cityKey: 'gresik',
    displayName: 'Gresik',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['gresik', 'gressmall', 'icon mall gresik'],
    cinemas: [
      { name: 'Gressmall XXI', chain: 'Cinema XXI', flyerKey: 'XXI_2', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Icon Mall Gresik CGV', chain: 'CGV Cinemas', flyerKey: 'CGV', bookingChannel: 'CGV App / Web / TIX ID' },
    ],
  },
  {
    cityKey: 'malang',
    displayName: 'Malang, Batu & Kepanjen',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['malang', 'mlg', 'batu', 'kepanjen', 'araya xxi', 'lippo plaza batu'],
    cinemas: [
      { name: 'Araya XXI Malang', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Cinépolis Lippo Plaza Batu', chain: 'Cinépolis', flyerKey: 'CINEPOLIS', bookingChannel: 'Cinépolis / TIX ID' },
      { name: 'NSC Kepanjen', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'kediri',
    displayName: 'Kediri',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['kediri', 'kediri xxi', 'ciplaz kediri', 'kediri mall', 'golden theater kediri'],
    cinemas: [
      { name: 'Kediri XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Kediri Mall CGV', chain: 'CGV Cinemas', flyerKey: 'CGV', bookingChannel: 'CGV App / Web / TIX ID' },
      { name: 'Golden Theater Kediri', chain: 'Golden Theater', flyerKey: 'MIX', bookingChannel: 'Loket Golden Theater' },
    ],
  },
  {
    cityKey: 'tulungagung',
    displayName: 'Tulungagung',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['tulungagung', 'tulung agung', 'golden theater tulungagung'],
    cinemas: [
      { name: 'Golden Theater Tulungagung', chain: 'Golden Theater', flyerKey: 'MIX', bookingChannel: 'Loket Golden Theater' },
    ],
  },
  {
    cityKey: 'blitar',
    displayName: 'Blitar',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['blitar', 'blitar square'],
    cinemas: [
      { name: 'Blitar Square CGV', chain: 'CGV Cinemas', flyerKey: 'CGV', bookingChannel: 'CGV App / Web / TIX ID' },
    ],
  },
  {
    cityKey: 'madiun',
    displayName: 'Madiun',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['madiun', 'plaza lawu', 'lawu plaza'],
    cinemas: [
      { name: 'Plaza Lawu Madiun CGV', chain: 'CGV Cinemas', flyerKey: 'CGV', bookingChannel: 'CGV App / Web / TIX ID' },
    ],
  },
  {
    cityKey: 'mojokerto',
    displayName: 'Mojokerto',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['mojokerto', 'sunrise mall'],
    cinemas: [
      { name: 'Sunrise Mall CGV', chain: 'CGV Cinemas', flyerKey: 'CGV', bookingChannel: 'CGV App / Web / TIX ID' },
    ],
  },
  {
    cityKey: 'nganjuk',
    displayName: 'Nganjuk',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['nganjuk', 'sams nganjuk', 'nsc nganjuk'],
    cinemas: [
      { name: "Sam's Studios Nganjuk", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
      { name: 'NSC Nganjuk', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'ngawi',
    displayName: 'Ngawi',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['ngawi', 'nsc ngawi'],
    cinemas: [
      { name: 'NSC Ngawi', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'tuban',
    displayName: 'Tuban',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['tuban', 'citimall tuban', 'nsc tuban'],
    cinemas: [
      { name: 'Citimall Tuban XXI', chain: 'Cinema XXI', flyerKey: 'XXI_2', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'NSC Tuban', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'bojonegoro',
    displayName: 'Bojonegoro',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['bojonegoro'],
    cinemas: [
      { name: 'NSC Bojonegoro', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'lamongan',
    displayName: 'Lamongan',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['lamongan'],
    cinemas: [
      { name: 'NSC Lamongan', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'jombang',
    displayName: 'Jombang',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['jombang'],
    cinemas: [
      { name: 'NSC Jombang', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'trenggalek',
    displayName: 'Trenggalek',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['trenggalek'],
    cinemas: [
      { name: 'NSC Trenggalek', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'pasuruan',
    displayName: 'Pasuruan',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['pasuruan'],
    cinemas: [
      { name: "Sam's Studios Pasuruan", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
      { name: 'NSC Pasuruan', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'probolinggo',
    displayName: 'Probolinggo',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['probolinggo'],
    cinemas: [
      { name: "Sam's Studios Probolinggo", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
    ],
  },
  {
    cityKey: 'jember',
    displayName: 'Jember',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['jember', 'transmart jember', 'roxy square jember', 'lippo plaza jember', 'kcm jember'],
    cinemas: [
      { name: 'Transmart Jember XXI', chain: 'Cinema XXI', flyerKey: 'XXI_1', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Roxy Square Jember CGV', chain: 'CGV Cinemas', flyerKey: 'CGV', bookingChannel: 'CGV App / Web / TIX ID' },
      { name: 'Cinépolis Lippo Plaza Jember', chain: 'Cinépolis', flyerKey: 'CINEPOLIS', bookingChannel: 'Cinépolis / TIX ID' },
      { name: 'KCM Jember', chain: 'Kota Cinema Mall', flyerKey: 'MIX', bookingChannel: 'Loket KCM' },
    ],
  },
  {
    cityKey: 'situbondo',
    displayName: 'Situbondo',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['situbondo', 'kcm situbondo'],
    cinemas: [
      { name: 'KCM Situbondo', chain: 'Kota Cinema Mall', flyerKey: 'MIX', bookingChannel: 'Loket KCM' },
    ],
  },
  {
    cityKey: 'banyuwangi',
    displayName: 'Banyuwangi (Genteng & Jajag)',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['banyuwangi', 'bwi', 'genteng', 'jajag'],
    cinemas: [
      { name: 'NSC Banyuwangi', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
      { name: 'NSC Genteng', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
      { name: 'NSC Jajag', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
    ],
  },
  {
    cityKey: 'madura',
    displayName: 'Madura (Sumenep & Pamekasan)',
    provinceOrRegion: 'Jawa Timur',
    aliases: ['sumenep', 'pamekasan', 'madura'],
    cinemas: [
      { name: 'NSC Sumenep', chain: 'New Star Cineplex (NSC)', flyerKey: 'NSC', bookingChannel: 'nsc8.com / Loket NSC' },
      { name: 'KCM Pamekasan', chain: 'Kota Cinema Mall', flyerKey: 'MIX', bookingChannel: 'Loket KCM' },
    ],
  },

  // ================= SUMATERA =================
  {
    cityKey: 'medan',
    displayName: 'Medan',
    provinceOrRegion: 'Sumatera Utara',
    aliases: ['medan', 'suzuya plaza', 'medan fair'],
    cinemas: [
      { name: 'Suzuya Plaza XXI', chain: 'Cinema XXI', flyerKey: 'XXI_2', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Cinépolis Plaza Medan Fair', chain: 'Cinépolis', flyerKey: 'CINEPOLIS', bookingChannel: 'Cinépolis / TIX ID' },
    ],
  },
  {
    cityKey: 'rantauprapat',
    displayName: 'Rantau Prapat',
    provinceOrRegion: 'Sumatera Utara',
    aliases: ['rantau prapat', 'rantauprapat', 'labuhanbatu'],
    cinemas: [
      { name: 'Suzuya Rantau Prapat XXI', chain: 'Cinema XXI', flyerKey: 'XXI_2', bookingChannel: 'M-TIX / TIX ID' },
    ],
  },
  {
    cityKey: 'sibolga',
    displayName: 'Tapanuli Tengah (Pandan Sibolga)',
    provinceOrRegion: 'Sumatera Utara',
    aliases: ['sibolga', 'pandan', 'tapanuli tengah', 'tapteng'],
    cinemas: [
      { name: 'Platinum Pandan Sibolga', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
    ],
  },
  {
    cityKey: 'batam',
    displayName: 'Batam',
    provinceOrRegion: 'Kepulauan Riau',
    aliases: ['batam', 'nagoya hill'],
    cinemas: [
      { name: 'Nagoya Hill Mall XXI', chain: 'Cinema XXI', flyerKey: 'XXI_2', bookingChannel: 'M-TIX / TIX ID' },
    ],
  },
  {
    cityKey: 'pekanbaru',
    displayName: 'Pekanbaru',
    provinceOrRegion: 'Riau',
    aliases: ['pekanbaru', 'pku', 'ska xxi'],
    cinemas: [
      { name: 'SKA XXI Pekanbaru', chain: 'Cinema XXI', flyerKey: 'XXI_2', bookingChannel: 'M-TIX / TIX ID' },
    ],
  },
  {
    cityKey: 'jambi',
    displayName: 'Jambi',
    provinceOrRegion: 'Jambi',
    aliases: ['jambi', 'wtc xxi'],
    cinemas: [
      { name: 'WTC XXI Jambi', chain: 'Cinema XXI', flyerKey: 'XXI_2', bookingChannel: 'M-TIX / TIX ID' },
    ],
  },
  {
    cityKey: 'bengkulu',
    displayName: 'Bengkulu',
    provinceOrRegion: 'Bengkulu',
    aliases: ['bengkulu', 'mega 21'],
    cinemas: [
      { name: 'Mega 21 Bengkulu', chain: 'Cinema XXI', flyerKey: 'XXI_2', bookingChannel: 'M-TIX / TIX ID' },
    ],
  },
  {
    cityKey: 'palembang',
    displayName: 'Palembang, Baturaja & Lahat',
    provinceOrRegion: 'Sumatera Selatan',
    aliases: ['palembang', 'opi mall', 'baturaja', 'ogan komering ulu', 'oku', 'lahat'],
    cinemas: [
      { name: 'OPI Mall XXI Palembang', chain: 'Cinema XXI', flyerKey: 'XXI_2', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'Platinum Baturaja (OKU)', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
      { name: 'Platinum Lahat', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
    ],
  },
  {
    cityKey: 'bangka',
    displayName: 'Bangka Belitung (Pangkal Pinang)',
    provinceOrRegion: 'Bangka Belitung',
    aliases: ['bangka', 'bangka belitung', 'babel', 'pangkal pinang', 'pangkalpinang', 'bes pangkal pinang', 'ltd9'],
    cinemas: [
      { name: 'BES Pangkal Pinang', chain: 'BES Cinema', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
      { name: 'LTD9 Cinema Bangka Belitung', chain: 'LTD9 Cinema', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
    ],
  },
  {
    cityKey: 'lampung',
    displayName: 'Lampung & Metro',
    provinceOrRegion: 'Lampung',
    aliases: ['lampung', 'bandar lampung', 'metro lampung', 'bes metro', 'ciplaz lampung'],
    cinemas: [
      { name: 'Ciplaz Lampung XXI', chain: 'Cinema XXI', flyerKey: 'XXI_2', bookingChannel: 'M-TIX / TIX ID' },
      { name: 'BES Metro Lampung', chain: 'BES Cinema', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
    ],
  },

  // ================= BALI, NTB & NTT =================
  {
    cityKey: 'bali',
    displayName: 'Bali (Denpasar & Sunset Road)',
    provinceOrRegion: 'Bali',
    aliases: ['bali', 'denpasar', 'kuta', 'badung', 'sunset', 'lippo plaza sunset', 'denpasar cineplex'],
    cinemas: [
      { name: 'Cinépolis Lippo Plaza Sunset', chain: 'Cinépolis', flyerKey: 'CINEPOLIS', bookingChannel: 'Cinépolis / TIX ID' },
      { name: 'Denpasar Cineplex Denpasar', chain: 'Denpasar Cineplex', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
    ],
  },
  {
    cityKey: 'mataram',
    displayName: 'Mataram (Lombok)',
    provinceOrRegion: 'Nusa Tenggara Barat',
    aliases: ['mataram', 'lombok', 'ntb', 'local cinema mataram'],
    cinemas: [
      { name: 'Local Cinema Mataram', chain: 'Local Cinema', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
    ],
  },
  {
    cityKey: 'labuanbajo',
    displayName: 'Labuan Bajo',
    provinceOrRegion: 'Nusa Tenggara Timur',
    aliases: ['labuan bajo', 'labuanbajo', 'ntt', 'flores'],
    cinemas: [
      { name: "Sam's Studios Labuan Bajo", chain: "Sam's Studios", flyerKey: 'SAMS', bookingChannel: 'samsstudios.id / TIX ID' },
    ],
  },

  // ================= KALIMANTAN & SULAWESI =================
  {
    cityKey: 'samarinda',
    displayName: 'Samarinda',
    provinceOrRegion: 'Kalimantan Timur',
    aliases: ['samarinda', 'samarinda square'],
    cinemas: [
      { name: 'Samarinda Square XXI', chain: 'Cinema XXI', flyerKey: 'XXI_2', bookingChannel: 'M-TIX / TIX ID' },
    ],
  },
  {
    cityKey: 'berau',
    displayName: 'Berau',
    provinceOrRegion: 'Kalimantan Timur',
    aliases: ['berau', 'tanjung redeb'],
    cinemas: [
      { name: 'Platinum Berau', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
    ],
  },
  {
    cityKey: 'pangkalanbun',
    displayName: 'Kotawaringin Barat (Pangkalanbun)',
    provinceOrRegion: 'Kalimantan Tengah',
    aliases: ['pangkalanbun', 'pangkalan bun', 'kotawaringin barat', 'kobar'],
    cinemas: [
      { name: 'Platinum Pangkalanbun', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
    ],
  },
  {
    cityKey: 'batulicin',
    displayName: 'Tanah Bumbu (Batulicin)',
    provinceOrRegion: 'Kalimantan Selatan',
    aliases: ['batulicin', 'tanah bumbu'],
    cinemas: [
      { name: 'Platinum Batulicin', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
    ],
  },
  {
    cityKey: 'manado',
    displayName: 'Manado',
    provinceOrRegion: 'Sulawesi Utara',
    aliases: ['manado', 'local cinema manado'],
    cinemas: [
      { name: 'Local Cinema Manado', chain: 'Local Cinema', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
    ],
  },
  {
    cityKey: 'palopo',
    displayName: 'Palopo',
    provinceOrRegion: 'Sulawesi Selatan',
    aliases: ['palopo'],
    cinemas: [
      { name: 'Platinum Palopo', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
    ],
  },
  {
    cityKey: 'bone',
    displayName: 'Bone (Watampone)',
    provinceOrRegion: 'Sulawesi Selatan',
    aliases: ['bone', 'watampone', 'planet cinema bone'],
    cinemas: [
      { name: 'Planet Cinema Bone', chain: 'Planet Cinema', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
    ],
  },
  {
    cityKey: 'sengkang',
    displayName: 'Sengkang (Wajo)',
    provinceOrRegion: 'Sulawesi Selatan',
    aliases: ['sengkang', 'wajo', 'dakota sengkang'],
    cinemas: [
      { name: 'Dakota Sengkang', chain: 'Dakota Cinema', flyerKey: 'MIX', bookingChannel: 'Loket Bioskop' },
    ],
  },
  {
    cityKey: 'kolaka',
    displayName: 'Kolaka',
    provinceOrRegion: 'Sulawesi Tenggara',
    aliases: ['kolaka'],
    cinemas: [
      { name: 'Platinum Kolaka', chain: 'Platinum Cineplex', flyerKey: 'PLATINUM', bookingChannel: 'Platinum App / Web' },
    ],
  },
];

export interface FlyerLookupResult {
  found: boolean;
  matchType: 'city' | 'chain' | 'all_flyers';
  title: string;
  cityOrChainName: string;
  cinemas: NationalCinemaItem[];
  flyerUrls: string[];
  primaryFlyerUrl: string;
  formattedCinemaList: string;
}

export function lookupNationalCinemaFlyers(
  rawQuery: string,
  siteOrigin: string = 'https://piyetokihfilm.com',
  customCities?: NationalCitySchedule[]
): FlyerLookupResult {
  const origin = siteOrigin.replace(/\/$/, '');
  const q = String(rawQuery || '').toLowerCase().trim();
  const activeDataset =
    Array.isArray(customCities) && customCities.length > 0
      ? customCities
      : NATIONAL_CINEMA_FLYER_DATA;

  const toFullUrl = (key: FlyerKey) => `${origin}${FLYER_PATHS[key]}`;

  // 1. Check specific city match first
  for (const cityEntry of activeDataset) {
    const matchedAlias = cityEntry.aliases.some(alias => {
      if (q === alias) return true;
      const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(q);
    });

    if (matchedAlias) {
      const uniqueFlyerKeys = Array.from(new Set(cityEntry.cinemas.map(c => c.flyerKey)));
      const flyerUrls = uniqueFlyerKeys.map(toFullUrl);
      const formattedCinemaList = cityEntry.cinemas
        .map(c => `• *${c.name}* (${c.chain})`)
        .join('\n');

      return {
        found: true,
        matchType: 'city',
        title: `Daftar Bioskop Penayangan 19 November 2026 — ${cityEntry.displayName}`,
        cityOrChainName: cityEntry.displayName,
        cinemas: cityEntry.cinemas,
        flyerUrls,
        primaryFlyerUrl: flyerUrls[0] || toFullUrl('COVER'),
        formattedCinemaList,
      };
    }
  }

  // 2. Check specific cinema chain inquiry (e.g. XXI, CGV, Cinepolis, Sam's Studio, NSC, Platinum)
  const chainRules: Array<{
    keywords: string[];
    chainTitle: string;
    flyerKeys: FlyerKey[];
    filterFn: (c: NationalCinemaItem) => boolean;
  }> = [
    {
      keywords: ['sams', "sam's", 'sam studio', 'sams studio'],
      chainTitle: "Sam's Studios (17 Kota)",
      flyerKeys: ['SAMS'],
      filterFn: c => c.flyerKey === 'SAMS',
    },
    {
      keywords: ['nsc', 'new star cineplex'],
      chainTitle: 'New Star Cineplex / NSC (30 Kota Jateng, DIY & Jatim)',
      flyerKeys: ['NSC'],
      filterFn: c => c.flyerKey === 'NSC',
    },
    {
      keywords: ['platinum', 'platinum cineplex'],
      chainTitle: 'Platinum Cineplex (18 Kota)',
      flyerKeys: ['PLATINUM'],
      filterFn: c => c.flyerKey === 'PLATINUM',
    },
    {
      keywords: ['cgv'],
      chainTitle: 'CGV Cinemas (11 Kota)',
      flyerKeys: ['CGV'],
      filterFn: c => c.flyerKey === 'CGV',
    },
    {
      keywords: ['cinepolis', 'cinépolis'],
      chainTitle: 'Cinépolis Cinemas (8 Kota)',
      flyerKeys: ['CINEPOLIS'],
      filterFn: c => c.flyerKey === 'CINEPOLIS',
    },
    {
      keywords: ['xxi', 'cinema 21', 'mtix', 'm-tix', '21 cineplex'],
      chainTitle: 'Cinema XXI (30 Kota Seluruh Indonesia)',
      flyerKeys: ['XXI_1', 'XXI_2'],
      filterFn: c => c.flyerKey === 'XXI_1' || c.flyerKey === 'XXI_2',
    },
    {
      keywords: ['golden', 'dakota', 'kcm', 'kota cinema', 'msb', 'bes cinema', 'surya yudha', 'gajah mada', 'flix', 'ltd9', 'planet cinema', 'local cinema', 'sena moviemax', 'jig cinema'],
      chainTitle: 'Bioskop Mitra & Independen Nasional',
      flyerKeys: ['MIX'],
      filterFn: c => c.flyerKey === 'MIX',
    },
  ];

  for (const rule of chainRules) {
    if (rule.keywords.some(kw => q.includes(kw))) {
      const matchedCinemas: NationalCinemaItem[] = [];
      const lines: string[] = [];

      for (const cityEntry of NATIONAL_CINEMA_FLYER_DATA) {
        const cityFiltered = cityEntry.cinemas.filter(rule.filterFn);
        if (cityFiltered.length > 0) {
          matchedCinemas.push(...cityFiltered);
          lines.push(`📍 *${cityEntry.displayName}:* ${cityFiltered.map(c => c.name).join(', ')}`);
        }
      }

      const flyerUrls = rule.flyerKeys.map(toFullUrl);
      return {
        found: true,
        matchType: 'chain',
        title: `Daftar Bioskop ${rule.chainTitle} — Tayang 19 November 2026`,
        cityOrChainName: rule.chainTitle,
        cinemas: matchedCinemas,
        flyerUrls,
        primaryFlyerUrl: flyerUrls[0],
        formattedCinemaList: lines.join('\n'),
      };
    }
  }

  // 3. Default: All Flyers Overview (95+ Kota Seluruh Indonesia)
  const allFlyerUrls: string[] = [
    toFullUrl('XXI_1'),
    toFullUrl('XXI_2'),
    toFullUrl('CGV'),
    toFullUrl('CINEPOLIS'),
    toFullUrl('SAMS'),
    toFullUrl('NSC'),
    toFullUrl('PLATINUM'),
    toFullUrl('MIX'),
  ];

  const summaryByChain = [
    `• *Cinema XXI (30 Kota):* Jakarta, Bandung, Bogor, Depok, Tangerang, Cilegon, Bekasi, Cikarang, Cirebon, Semarang, Yogyakarta, Klaten, Solo, Pekalongan, Surabaya, Sidoarjo, Malang, Kediri, Jember, Gresik, Tuban, Medan, Rantau Prapat, Batam, Lampung, Palembang, Pekanbaru, Jambi, Bengkulu, Samarinda`,
    `• *CGV Cinemas (11 Kota):* Tegal, Purwokerto, Yogyakarta, Solo, Madiun, Mojokerto, Surabaya, Blitar, Kediri, Jember, Gresik`,
    `• *Cinépolis (8 Kota):* Bekasi, Tegal, Semarang, Batu, Surabaya, Jember, Medan, Bali`,
    `• *Sam's Studios (17 Kota):* Cianjur, Cibadak, Gombong, Indramayu, Jalur, Kebumen, Klaten, Nganjuk, Pasuruan, Pekalongan, Pemalang, Probolinggo, Salatiga, Solo, Subang, Ungaran, Labuan Bajo`,
    `• *NSC - New Star Cineplex (30 Kota):* Purbalingga, Wonosobo, Purworejo, Temanggung, Salatiga, Demak, Mangkang, Kendal, Kudus, Jepara, Pati, Rembang, Cepu, Purwodadi, Pemalang, Kulonprogo, Wonosari, Tuban, Bojonegoro, Ngawi, Lamongan, Nganjuk, Jombang, Trenggalek, Kepanjen, Pasuruan, Genteng, Banyuwangi, Jajag, Sumenep`,
    `• *Platinum Cineplex (18 Kota):* Batang, Baturaja, Berau, Blora, Tangerang BSD, Bekasi Cibitung, Kebumen, Kolaka, Lahat, Magelang, Majenang, Palopo, Pangkalanbun, Sibolga, Sidoarjo, Solo, Batulicin, Sragen`,
    `• *Bioskop Mitra Lainnya:* Golden Theater (Kediri, Tulungagung), Dakota (Cilacap, Sengkang), Denpasar Cineplex (Bali), Surya Yudha (Banjarnegara), Gajah Mada (Tegal), LTD9 (Bangka Belitung), Flix (Bekasi), BES (Pangkal Pinang, Metro Lampung), MSB (Brebes, Bulakamba, Bumiayu, Slawi), JIG (Purwodadi), Planet Cinema (Bone), Local Cinema (Manado, Mataram), Sena Moviemax (Kroya), KCM (Greenland, Situbondo, Jember, Pamekasan)`,
  ].join('\n\n');

  return {
    found: false,
    matchType: 'all_flyers',
    title: 'Daftar Lengkap Bioskop Penayangan Serentak 19 November 2026',
    cityOrChainName: 'Seluruh Indonesia',
    cinemas: [],
    flyerUrls: allFlyerUrls,
    primaryFlyerUrl: toFullUrl('XXI_1'),
    formattedCinemaList: summaryByChain,
  };
}

const KNOWN_UNLISTED_INDONESIAN_CITIES = [
  'banda aceh', 'aceh', 'lhokseumawe', 'binjai', 'pematangsiantar', 'padang', 'bukittinggi',
  'dumai', 'tanjungpinang', 'tanjung pinang', 'lubuklinggau', 'prabumulih', 'garut', 'tasikmalaya',
  'tasik', 'sukabumi', 'karawang', 'purwakarta', 'sumedang', 'kuningan', 'majalengka', 'banjar',
  'pangandaran', 'wonogiri', 'karanganyar', 'boyolali', 'lumajang', 'bondowoso', 'bangkalan',
  'sampang', 'pacitan', 'magetan', 'pontianak', 'singkawang', 'palangkaraya', 'palangka raya',
  'banjarmasin', 'banjarbaru', 'balikpapan', 'bontang', 'tarakan', 'makassar', 'ujung pandang',
  'parepare', 'palu', 'kendari', 'baubau', 'gorontalo', 'mamuju', 'kupang', 'maumere', 'ende',
  'ambon', 'ternate', 'jayapura', 'sorong', 'manokwari', 'timika', 'merauke', 'lombok',
];

const UNLISTED_CITY_STOPWORDS = new Set([
  'mana', 'mna', 'mana aja', 'mana saja', 'bioskop', 'bioskopnya', 'kota', 'kotamu', 'kotaku',
  'indonesia', 'sana', 'sini', 'situ', 'xxi', 'cgv', 'cinepolis', 'nsc', 'platinum', 'sams',
  'tix', 'tix id', 'mtix', 'm-tix', 'website', 'web', 'link', 'promo', 'presale', 'tiket',
  'film', 'tempat', 'daerah', 'lokasi', 'semua', 'seluruh', 'tayang', 'ada', 'belum', 'kapan',
  'nonton', 'bogo', 'buy 1 get 1', 'dalam', 'luar', 'atas', 'bawah', 'studio', 'mall', 'kasir',
]);

function toTitleCaseCity(str: string): string {
  return str
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
}

export function extractRequestedUnlistedCity(cityParam: string, queryText: string): string | null {
  const cleanParam = String(cityParam || '').trim().toLowerCase();
  if (
    cleanParam &&
    !['all', 'list', 'semua', 'nasional', 'indonesia', 'bioskop', 'kota'].includes(cleanParam) &&
    !UNLISTED_CITY_STOPWORDS.has(cleanParam)
  ) {
    return toTitleCaseCity(cleanParam);
  }

  const q = String(queryText || '').toLowerCase().trim();
  if (!q) return null;

  for (const city of KNOWN_UNLISTED_INDONESIAN_CITIES) {
    const regex = new RegExp(`\\b${city.replace(/\s+/g, '\\s+')}\\b`, 'i');
    if (regex.test(q)) {
      return toTitleCaseCity(city);
    }
  }

  const match = q.match(/(?:di|kota|kabupaten|wilayah|daerah)\s+([a-z]{3,18}(?:\s+[a-z]{3,14})?)/i);
  if (match && match[1]) {
    const candidate = match[1]
      .replace(/\b(ada|gak|ga|nggak|tidak|tayang|bioskop|xxi|cgv|ya|kah|dong|lur|mas)\b/gi, '')
      .trim()
      .toLowerCase();
    if (
      candidate.length >= 3 &&
      !UNLISTED_CITY_STOPWORDS.has(candidate) &&
      !candidate.includes('mana')
    ) {
      return toTitleCaseCity(candidate);
    }
  }

  return null;
}

export function buildUnlistedCityInstagramReply(params: {
  cityName: string;
  instagramUrl: string;
  siteOrigin: string;
  presaleDates: string;
  bogoDates: string;
  activeLinksText: string;
}): string {
  const { cityName, instagramUrl, siteOrigin, presaleDates, bogoDates, activeLinksText } = params;
  return `Halo bolo asik dari *${cityName}*! Piye kabare lur? 😄

🙏 *INFO PENAYANGAN KOTA ${cityName.toUpperCase()}:*
Untuk daftar 9 Flyer resmi rilis awal penayangan serentak **19 November 2026**, wilayah *${cityName}* saat ini memang belum tercantum di daftar bioskop rilis awal ya lur.

🔥 *TAPI TENANG LUR, TIDAK MENUTUP KEMUNGKINAN BAKAL TAYANG DI KOTAMU!*
Daftar bioskop & kota masih terus berkembang! Permintaan nonton dari *${cityName}* sudah Mas Kidi catat masuk ke data tim kami agar jadi prioritas pertimbangan ekspansi layar berikutnya! 🙌🍿

📲 *PANTENGIN TERUS INSTAGRAM OFFICIAL PIYE TO KIH?:*
Untuk update penambahan kota & daftar bioskop terbaru setiap harinya, pantengin terus Instagram resmi kami di sini ya lur:
👉 *Instagram Official:* ${instagramUrl}

🖼️ *Cek Juga Daftar Lengkap 9 Flyer Bioskop yang Sudah Tayang:*
👉 ${siteOrigin}/lokasi-bioskop

📅 *JADWAL TIKET & PROMO (JIKA MAU NONTON DI KOTA TERDEKAT):*
• *Presale Tiket Dibuka:* ${presaleDates}
• *Promo Buy 1 Get 1:* ${bogoDates}
${activeLinksText}

Terima kasih semangatnya bolo *${cityName}*! Pantengin terus Instagram resminya ya lur! 🍿✨`;
}

const FLYER_LABEL_MAP: Record<FlyerKey, string> = {
  COVER: 'Daftar Bioskop Tayang',
  XXI_1: 'Cinema XXI (Bagian 1)',
  XXI_2: 'Cinema XXI (Bagian 2)',
  CGV: 'CGV Cinemas',
  CINEPOLIS: 'Cinépolis Cinemas',
  SAMS: "Sam's Studios",
  NSC: 'New Star Cineplex (NSC)',
  PLATINUM: 'Platinum Cineplex',
  MIX: 'Bioskop Mitra Nasional',
};

export function buildFlyerTicketLinksText(
  cinemas: NationalCinemaItem[],
  flyerLinks?: Partial<Record<FlyerKey, string>>
): string {
  if (!flyerLinks || !Array.isArray(cinemas) || cinemas.length === 0) return '';
  const uniqueKeys = Array.from(new Set(cinemas.map((c) => c.flyerKey)));
  const lines: string[] = [];
  for (const key of uniqueKeys) {
    const url = (flyerLinks[key] || '').trim();
    if (url) {
      lines.push(`• *Link Tiket ${FLYER_LABEL_MAP[key] || key}:* ${url}`);
    }
  }
  return lines.join('\n');
}

// Cooldown cache so we don't spam the same WhatsApp number with duplicate flyer images within 45 seconds
const recentFlyerSentCache = new Map<string, number>();

export async function sendFlyerImageToWhatsAppIfPossible(params: {
  phone?: string;
  imageUrl?: string;
  caption?: string;
  apiKey?: string;
}) {
  const { phone, imageUrl, caption, apiKey } = params;
  if (!phone || !imageUrl || !apiKey) return;

  let cleanPhone = String(phone).replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
  if (cleanPhone.length < 9) return;

  const cacheKey = `${cleanPhone}:${imageUrl}`;
  const lastSent = recentFlyerSentCache.get(cacheKey) || 0;
  if (Date.now() - lastSent < 45000) return;
  recentFlyerSentCache.set(cacheKey, Date.now());

  try {
    await fetch('https://app.wahnotif.com/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        number: cleanPhone,
        phone: cleanPhone,
        message: caption || '🎬 Flyer Resmi Daftar Bioskop Penayangan 19 November 2026 — PIYE TO KIH? THE MOVIE',
        imageUrl,
      }),
    });
  } catch (err) {
    console.error('[Flyer Image WhatsApp Send Error]:', err);
  }
}
