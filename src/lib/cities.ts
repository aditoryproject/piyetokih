export interface CinemaVenue {
  name: string;
  chain: 'XXI' | 'Cinepolis' | 'CGV' | 'Platinum' | 'NSC' | 'Indie';
  studio: string;
  seats: number;
  showTimes: string[];
  ticketUrl: string; // default cinema ticket booking URL
}

export interface CityData {
  slug: string;
  name: string;
  province: string;
  dateStr: string;
  cinemas: CinemaVenue[];
}

export const CITIES_DATA: CityData[] = [
  {
    slug: 'semarang',
    name: 'Semarang',
    province: 'Jawa Tengah',
    dateStr: '22 Oktober 2026',
    cinemas: [
      {
        name: 'The Park XXI Semarang',
        chain: 'XXI',
        studio: 'Studio 3',
        seats: 180,
        showTimes: ['15:30 WIB'],
        ticketUrl: 'https://m.21cineplex.com/gui.schedule.php?cinema_id=SMGTPRK',
      },
      {
        name: 'Cinépolis Java Mall Semarang',
        chain: 'Cinepolis',
        studio: 'Studio 4',
        seats: 121,
        showTimes: ['18:00 - 19:40 WIB'],
        ticketUrl: 'https://cinepolis.co.id',
      },
    ],
  },
  {
    slug: 'jogja',
    name: 'Yogyakarta',
    province: 'D.I. Yogyakarta',
    dateStr: '23 Oktober 2026',
    cinemas: [
      {
        name: 'Plaza Ambarrukmo XXI Jogja',
        chain: 'XXI',
        studio: 'Studio 4',
        seats: 182,
        showTimes: ['15:45 - 16:35 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
      {
        name: 'Jogja City Mall XXI',
        chain: 'XXI',
        studio: 'Studio 4',
        seats: 149,
        showTimes: ['18:00 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
    ],
  },
  {
    slug: 'magelang',
    name: 'Magelang',
    province: 'Jawa Tengah',
    dateStr: '24 Oktober 2026',
    cinemas: [
      {
        name: 'Platinum Cineplex Artos Mall Magelang',
        chain: 'Platinum',
        studio: 'Studio 3',
        seats: 156,
        showTimes: ['13:00 - 15:00 WIB'],
        ticketUrl: 'https://platinumcineplex.co.id',
      },
      {
        name: 'The Aloon - Aloon XXI Magelang',
        chain: 'XXI',
        studio: 'Studio 2',
        seats: 144,
        showTimes: ['18:00 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
    ],
  },
  {
    slug: 'solo',
    name: 'Surakarta (Solo)',
    province: 'Jawa Tengah',
    dateStr: '25 Oktober 2026',
    cinemas: [
      {
        name: 'Solo Paragon XXI',
        chain: 'XXI',
        studio: 'Studio 3',
        seats: 158,
        showTimes: ['13:15 - 14:45 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
      {
        name: 'Platinum Cineplex Pakuwon Mall Solo Baru',
        chain: 'Platinum',
        studio: 'Studio 2',
        seats: 160,
        showTimes: ['19:00 - 20:40 WIB'],
        ticketUrl: 'https://platinumcineplex.co.id',
      },
    ],
  },
  {
    slug: 'sragen',
    name: 'Sragen',
    province: 'Jawa Tengah',
    dateStr: '26 Oktober 2026',
    cinemas: [
      {
        name: 'Platinum Plaza Atrium Sragen',
        chain: 'Platinum',
        studio: 'Studio 2',
        seats: 203,
        showTimes: ['13:00 - 15:00 WIB'],
        ticketUrl: 'https://platinumcineplex.co.id',
      },
    ],
  },
  {
    slug: 'ngawi',
    name: 'Ngawi',
    province: 'Jawa Timur',
    dateStr: '27 Oktober 2026',
    cinemas: [
      {
        name: 'New Star Cineplex (NSC) Ngawi',
        chain: 'NSC',
        studio: 'Studio 2',
        seats: 226,
        showTimes: ['14:00 - 15:40 WIB'],
        ticketUrl: 'https://www.nsc.co.id',
      },
    ],
  },
  {
    slug: 'madiun',
    name: 'Madiun',
    province: 'Jawa Timur',
    dateStr: '28 Oktober 2026',
    cinemas: [
      {
        name: 'CGV Plaza Lawu Madiun',
        chain: 'CGV',
        studio: 'Studio 2',
        seats: 152,
        showTimes: ['15:00 - 16:40 WIB'],
        ticketUrl: 'https://www.cgv.id',
      },
      {
        name: 'Suncity Madiun XXI',
        chain: 'XXI',
        studio: 'Studio 2',
        seats: 160,
        showTimes: ['18:45 - 20:15 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
    ],
  },
  {
    slug: 'ponorogo',
    name: 'Ponorogo',
    province: 'Jawa Timur',
    dateStr: '29 Oktober 2026',
    cinemas: [
      {
        name: 'Cinépolis Ponorogo City Center',
        chain: 'Cinepolis',
        studio: 'Studio 2',
        seats: 122,
        showTimes: ['15:00 - 17:00 WIB'],
        ticketUrl: 'https://cinepolis.co.id',
      },
    ],
  },
  {
    slug: 'nganjuk',
    name: 'Nganjuk',
    province: 'Jawa Timur',
    dateStr: '30 Oktober 2026',
    cinemas: [
      {
        name: "Sam's Studio Nganjuk",
        chain: 'Indie',
        studio: 'Studio 1',
        seats: 107,
        showTimes: ['15:00 - 17:00 WIB'],
        ticketUrl: 'https://www.instagram.com/sams.studio/',
      },
    ],
  },
  {
    slug: 'mojokerto',
    name: 'Mojokerto',
    province: 'Jawa Timur',
    dateStr: '31 Oktober 2026',
    cinemas: [
      {
        name: 'CGV Sunrise Mall Mojokerto',
        chain: 'CGV',
        studio: 'Studio 3',
        seats: 116,
        showTimes: ['15:00 - 17:00 WIB'],
        ticketUrl: 'https://www.cgv.id',
      },
    ],
  },
  {
    slug: 'gresik',
    name: 'Gresik',
    province: 'Jawa Timur',
    dateStr: '1 November 2026',
    cinemas: [
      {
        name: 'Gressmall XXI Gresik',
        chain: 'XXI',
        studio: 'Studio 2',
        seats: 165,
        showTimes: ['13:00 - 14:00 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
    ],
  },
  {
    slug: 'surabaya',
    name: 'Surabaya',
    province: 'Jawa Timur',
    dateStr: '2 November 2026',
    cinemas: [
      {
        name: 'Royal Plaza XXI Surabaya',
        chain: 'XXI',
        studio: 'Studio 3',
        seats: 162,
        showTimes: ['14:30 - 15:10 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
    ],
  },
  {
    slug: 'sidoarjo',
    name: 'Sidoarjo',
    province: 'Jawa Timur',
    dateStr: '3 November 2026',
    cinemas: [
      {
        name: 'Platinum Cineplex Suncity Mall Sidoarjo',
        chain: 'Platinum',
        studio: 'Studio 2',
        seats: 162,
        showTimes: ['13:00 - 14:40 WIB'],
        ticketUrl: 'https://platinumcineplex.co.id',
      },
      {
        name: 'Ciplaz Sidoarjo XXI',
        chain: 'XXI',
        studio: 'Studio 2',
        seats: 128,
        showTimes: ['16:10 - 17:50 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
    ],
  },
  {
    slug: 'malang',
    name: 'Malang',
    province: 'Jawa Timur',
    dateStr: '4 November 2026',
    cinemas: [
      {
        name: 'Dieng XXI Malang',
        chain: 'XXI',
        studio: 'Studio 3',
        seats: 144,
        showTimes: ['15:50 - 16:30 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
      {
        name: 'Cinépolis Malang Town Square (Matos)',
        chain: 'Cinepolis',
        studio: 'Studio 2',
        seats: 126,
        showTimes: ['18:00 WIB'],
        ticketUrl: 'https://cinepolis.co.id',
      },
    ],
  },
  {
    slug: 'kediri',
    name: 'Kediri',
    province: 'Jawa Timur',
    dateStr: '6 November 2026',
    cinemas: [
      {
        name: 'Ciplaz Kediri XXI',
        chain: 'XXI',
        studio: 'Studio 1',
        seats: 128,
        showTimes: ['19:00 - 21:00 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
    ],
  },
  {
    slug: 'blitar',
    name: 'Blitar',
    province: 'Jawa Timur',
    dateStr: '7 November 2026',
    cinemas: [
      {
        name: 'CGV Blitar Square',
        chain: 'CGV',
        studio: 'Studio 5',
        seats: 162,
        showTimes: ['13:00 - 15:00 WIB'],
        ticketUrl: 'https://www.cgv.id',
      },
    ],
  },
  {
    slug: 'tulungagung',
    name: 'Tulungagung',
    province: 'Jawa Timur',
    dateStr: '8 November 2026',
    cinemas: [
      {
        name: 'Golden Theatre Tulungagung',
        chain: 'Indie',
        studio: 'Studio 2',
        seats: 202,
        showTimes: ['18:00 - 20:00 WIB'],
        ticketUrl: 'https://www.instagram.com/goldentheatretulungagung/',
      },
    ],
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  return CITIES_DATA.find(c => c.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized);
}
