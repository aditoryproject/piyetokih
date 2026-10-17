export interface CinemaVenue {
  name: string;
  chain: 'XXI' | 'Cinepolis' | 'CGV' | 'Platinum' | 'NSC' | 'Indie';
  studio: string;
  seats: number;
  showTimes: string[];
  ticketUrl: string; // default cinema ticket booking URL
  address?: string;
  remainingSeatsText?: string;
  doorNote?: string;
  badgeText?: string;
}

export interface CityRundownItem {
  time: string;
  category: 'Sekolah' | 'Kampus' | 'Radio' | 'Screening' | 'Mall & Meet' | 'Acara';
  title: string;
  venue: string;
  note?: string;
  isVoucherExchange?: boolean;
}

export interface CityRundown {
  date: string;
  voucherExchangeInfo: string;
  items: CityRundownItem[];
}

export interface BoothInfo {
  venue: string;
  floor: string;
  timeStr: string;
  directions?: string;
  exclusiveNotice?: string;
}

export interface CityData {
  slug: string;
  name: string;
  province: string;
  dateStr: string;
  cinemas: CinemaVenue[];
  rundown?: CityRundown;
  boothInfo?: BoothInfo;
}

export const CITIES_DATA: CityData[] = [
  {
    slug: 'semarang',
    name: 'Semarang',
    province: 'Jawa Tengah',
    dateStr: '22 Oktober 2026',
    boothInfo: {
      venue: 'THE PARK MALL SEMARANG',
      floor: 'Lantai 2 (Area Atrium Depan Cinema XXI)',
      timeStr: '16.00 – 17.00 WIB',
      directions: 'Dekat eskalator tengah, cari booth oranye dengan spanduk PIYE TO KIH?',
      exclusiveNotice:
        'Penukaran voucher fisik hanya berada di The Park Mall Lantai 2 pada jam 16.00–17.00 WIB. Bioskop Cinépolis Java Mall bukan tempat pengambilan voucher, melainkan khusus pemegang tiket Special Screening sesi malam.',
    },
    rundown: {
      date: 'Kamis, 22 Oktober 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi hanya berada di The Park Mall Lantai 2 pada jam 16.00–17.00 WIB. Tunjukkan Kode Booking Anda di booth untuk membayar dan mengambil voucher fisik.',
      items: [
        {
          time: '08.00 – 09.00 WIB',
          category: 'Sekolah',
          title: 'MAMPIR KE SEKOLAH',
          venue: 'SMA Negeri 15 Semarang',
          isVoucherExchange: true,
        },
        {
          time: '10.00 – 12.00 WIB',
          category: 'Kampus',
          title: 'NGOBROL BARENG DI KAMPUS',
          venue: 'UNNES (Universitas Negeri Semarang)',
          isVoucherExchange: true,
        },
        {
          time: '14.00 – 15.00 WIB',
          category: 'Radio',
          title: 'INTERVIEW RADIO',
          venue: 'Jateng Radio FM',
        },
        {
          time: '15.30 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST',
          venue: 'The Park XXI Semarang',
          note: 'Special Screening sesi 1 bersama pemain film (Wajib bertiket)',
        },
        {
          time: '16.00 – 17.00 WIB',
          category: 'Mall & Meet',
          title: 'MEET & GREET MALL',
          venue: 'The Park Mall Semarang — Lantai 2',
          note: 'seru-seruan dan foto bareng pemain, doorprize, dan bagi-bagi merchandise, booth voucher fisik.',
          isVoucherExchange: true,
        },
        {
          time: '18.00 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST',
          venue: 'Cinépolis Java Mall Semarang',
          note: 'Special Screening sesi 2 bersama pemain film (Wajib bertiket)',
        },
      ],
    },
    cinemas: [
      {
        name: 'THE PARK XXI SEMARANG',
        chain: 'XXI',
        studio: 'Studio 1 Premiere Sound',
        seats: 180,
        remainingSeatsText: '±42 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'The Park Mall Semarang Lt. 3, Jl. Madukoro Raya No. 1',
        showTimes: ['15.30 WIB'],
        ticketUrl: 'https://tinyurl.com/mrx93shj',
      },
      {
        name: 'CINÉPOLIS JAVA MALL SEMARANG',
        chain: 'Cinepolis',
        studio: 'Audi 2 Super Screen',
        seats: 121,
        remainingSeatsText: '±28 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Java Supermall Lt. 3, Jl. Letjen MT Haryono No. 992-994',
        showTimes: ['18.00 WIB'],
        ticketUrl: 'https://cinepolis.co.id',
      },
    ],
  },
  {
    slug: 'jogja',
    name: 'Yogyakarta',
    province: 'D.I. Yogyakarta',
    dateStr: '23 Oktober 2026',
    boothInfo: {
      venue: 'PLAZA AMBARRUKMO YOGYAKARTA',
      floor: 'Ground Floor (Area Atrium Utama)',
      timeStr: '17.00 – 18.00 WIB',
      directions: 'Cari booth resmi oranye PIYE TO KIH? di Ground Floor Plaza Ambarrukmo.',
      exclusiveNotice:
        'Penukaran voucher fisik resmi hanya dilayani di booth Plaza Ambarrukmo Ground Floor pada jam 17.00–18.00 WIB.',
    },
    rundown: {
      date: 'Jumat, 23 Oktober 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik hanya berada di Ground Floor Plaza Ambarrukmo pada jam 17.00–18.00 WIB.',
      items: [
        {
          time: '08.00 – 09.00 WIB',
          category: 'Sekolah',
          title: 'PIYE TO KIH? MAMPIR KE SEKOLAH',
          venue: 'SMK Negeri 3 Kasihan (SMSR) Yogyakarta',
          note: 'Sapa pagi & seru-seruan bareng cast',
        },
        {
          time: '10.00 – 11.00 WIB',
          category: 'Radio',
          title: 'PIYE TO KIH? NGUDARA',
          venue: 'RRI Pro 2 FM Yogyakarta',
          note: 'Live on-air & obrolan santai film',
        },
        {
          time: '13.00 – 15.00 WIB',
          category: 'Kampus',
          title: 'NGOBROL BARENG DI KAMPUS',
          venue: 'Universitas AMIKOM Yogyakarta',
          note: 'Sharing session industri kreatif & komedi',
        },
        {
          time: '15.45 – 16.35 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST',
          venue: 'Plaza Ambarrukmo XXI Jogja',
          note: 'Special Screening & greeting ending cast (Wajib bertiket)',
        },
        {
          time: '17.00 – 18.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Plaza Ambarrukmo — Ground Floor',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
      ],
    },
    cinemas: [
      {
        name: 'PLAZA AMBARRUKMO XXI JOGJA',
        chain: 'XXI',
        studio: 'Studio 4',
        seats: 182,
        remainingSeatsText: '±35 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Plaza Ambarrukmo Lt. 3, Jl. Laksda Adisucipto No. 80',
        showTimes: ['15.45 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
      {
        name: 'JOGJA CITY MALL XXI',
        chain: 'XXI',
        studio: 'Studio 4',
        seats: 149,
        remainingSeatsText: '±22 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Jogja City Mall Lt. 2, Jl. Magelang Km. 6 No. 18',
        showTimes: ['18.00 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
    ],
  },
  {
    slug: 'magelang',
    name: 'Magelang',
    province: 'Jawa Tengah',
    dateStr: '24 Oktober 2026',
    boothInfo: {
      venue: 'ARMADA TOWN SQUARE (ARTOS MALL)',
      floor: 'Atrium Utama Artos Mall Magelang',
      timeStr: '16.00 – 17.00 WIB',
      directions: 'Cari booth oranye resmi PIYE TO KIH? di Atrium Artos Mall Magelang.',
      exclusiveNotice:
        'Penukaran voucher fisik resmi bertempat di Atrium Artos Mall Magelang pada jam 16.00–17.00 WIB.',
    },
    rundown: {
      date: 'Sabtu, 24 Oktober 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi berada di Atrium Artos Mall Magelang pada jam 16.00–17.00 WIB.',
      items: [
        {
          time: '11.00 – 12.00 WIB',
          category: 'Radio',
          title: 'PIYE TO KIH? NGUDARA',
          venue: 'Radio Gemilang FM Pemkot Magelang',
          note: 'Live interview bersama cast film',
        },
        {
          time: '13.00 – 15.00 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST',
          venue: 'Platinum Cineplex Artos Mall Magelang',
          note: 'Special Screening penayangan duluan (Wajib bertiket)',
        },
        {
          time: '16.00 – 17.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Atrium Utama Armada Town Square (Artos)',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
      ],
    },
    cinemas: [
      {
        name: 'PLATINUM CINEPLEX ARTOS MALL',
        chain: 'Platinum',
        studio: 'Studio 3',
        seats: 156,
        remainingSeatsText: '±40 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Artos Mall Lt. UG, Jl. Mayjen Bambang Soegeng No. 1',
        showTimes: ['13.00 WIB'],
        ticketUrl: 'https://platinumcineplex.co.id',
      },
      {
        name: 'THE ALOON - ALOON XXI MAGELANG',
        chain: 'XXI',
        studio: 'Studio 2',
        seats: 144,
        remainingSeatsText: '±30 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Jl. Alun-Alun Utara No. 1, Magelang',
        showTimes: ['18.00 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
    ],
  },
  {
    slug: 'solo',
    name: 'Surakarta (Solo)',
    province: 'Jawa Tengah',
    dateStr: '25 Oktober 2026',
    boothInfo: {
      venue: 'SOLO PARAGON MALL',
      floor: 'Area Stage Food Factory Solo Paragon Mall',
      timeStr: '16.00 – 17.00 WIB',
      directions: 'Cari booth oranye PIYE TO KIH? di depan Stage Food Factory Solo Paragon Mall.',
      exclusiveNotice:
        'Penukaran voucher fisik hanya berada di Stage Food Factory Solo Paragon Mall pada jam 16.00–17.00 WIB.',
    },
    rundown: {
      date: 'Minggu, 25 Oktober 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi berada di Stage Food Factory Solo Paragon Mall pada jam 16.00–17.00 WIB.',
      items: [
        {
          time: '06.00 – 09.00 WIB',
          category: 'Acara',
          title: 'PIYE TO KIH? SAPA CFD SOLO',
          venue: 'Car Free Day Jl. Slamet Riyadi Solo',
          note: 'Jalan santai, sapa warga & bagi merchandise',
        },
        {
          time: '11.00 – 12.00 WIB',
          category: 'Radio',
          title: 'PIYE TO KIH? NGUDARA',
          venue: 'RRI Pro 2 Solo',
          note: 'Live talkshow seru bareng cast',
        },
        {
          time: '13.15 – 14.45 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST (SESI 1)',
          venue: 'Solo Paragon XXI',
          note: 'Special Screening sesi siang (Wajib bertiket)',
        },
        {
          time: '16.00 – 17.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Stage Food Factory Solo Paragon Mall',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
        {
          time: '19.00 – 20.40 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST (SESI 2)',
          venue: 'Platinum Cineplex Pakuwon Mall Solo Baru',
          note: 'Special Screening sesi malam (Wajib bertiket)',
        },
      ],
    },
    cinemas: [
      {
        name: 'SOLO PARAGON XXI',
        chain: 'XXI',
        studio: 'Studio 3',
        seats: 158,
        remainingSeatsText: '±38 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Solo Paragon Mall Lt. 1, Jl. Yosodipuro No. 133',
        showTimes: ['13.15 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
      {
        name: 'PLATINUM CINEPLEX PAKUWON MALL SOLO BARU',
        chain: 'Platinum',
        studio: 'Studio 2',
        seats: 160,
        remainingSeatsText: '±25 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Pakuwon Mall Solo Baru Lt. 2, Sukoharjo',
        showTimes: ['19.00 WIB'],
        ticketUrl: 'https://platinumcineplex.co.id',
      },
    ],
  },
  {
    slug: 'sragen',
    name: 'Sragen',
    province: 'Jawa Tengah',
    dateStr: '26 Oktober 2026',
    boothInfo: {
      venue: 'PLAZA ATRIUM SRAGEN',
      floor: 'Area Depan Bioskop Platinum Cineplex Sragen',
      timeStr: '15.00 – 17.00 WIB',
      directions: 'Cari booth resmi PIYE TO KIH? di Plaza Atrium Sragen.',
      exclusiveNotice:
        'Penukaran voucher fisik resmi berada di Plaza Atrium Sragen pada jam 15.00–17.00 WIB.',
    },
    rundown: {
      date: 'Senin, 26 Oktober 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi dilayani di Plaza Atrium Sragen pada jam 15.00–17.00 WIB.',
      items: [
        {
          time: '08.00 – 09.00 WIB',
          category: 'Sekolah',
          title: 'PIYE TO KIH? MAMPIR KE SEKOLAH',
          venue: 'SMK Citra Medika Sragen',
          note: 'Sapa konco sekolah bareng cast',
        },
        {
          time: '10.00 – 11.00 WIB',
          category: 'Radio',
          title: 'PIYE TO KIH? NGUDARA',
          venue: 'LPPL Radio Buana Asri Sragen',
          note: 'Live siaran radio & kuis tiket',
        },
        {
          time: '13.00 – 15.00 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST',
          venue: 'Platinum Cineplex Plaza Atrium Sragen',
          note: 'Special Screening penayangan perdana Sragen (Wajib bertiket)',
        },
        {
          time: '15.00 – 17.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Plaza Atrium Sragen',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
      ],
    },
    cinemas: [
      {
        name: 'PLATINUM PLAZA ATRIUM SRAGEN',
        chain: 'Platinum',
        studio: 'Studio 2',
        seats: 203,
        remainingSeatsText: '±45 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Plaza Atrium Sragen Lt. 2, Jl. Sukowati No. 100',
        showTimes: ['13.00 WIB'],
        ticketUrl: 'https://platinumcineplex.co.id',
      },
    ],
  },
  {
    slug: 'ngawi',
    name: 'Ngawi',
    province: 'Jawa Timur',
    dateStr: '27 Oktober 2026',
    boothInfo: {
      venue: 'NEW STAR CINEPLEX (NSC) NGAWI',
      floor: 'Area Lobi Bioskop NSC Ngawi',
      timeStr: '16.00 – 17.00 WIB',
      directions: 'Cari booth resmi PIYE TO KIH? di lobi bioskop NSC Ngawi.',
      exclusiveNotice:
        'Penukaran voucher fisik resmi berada di lobi bioskop NSC Ngawi pada jam 16.00–17.00 WIB.',
    },
    rundown: {
      date: 'Selasa, 27 Oktober 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi berada di lobi bioskop NSC Ngawi pada jam 16.00–17.00 WIB.',
      items: [
        {
          time: '08.00 – 09.00 WIB',
          category: 'Sekolah',
          title: 'PIYE TO KIH? MAMPIR KE SEKOLAH',
          venue: 'SMA Negeri 1 Ngawi',
          note: 'Sapa pagi & kuis receh bareng siswa',
        },
        {
          time: '10.00 – 11.00 WIB',
          category: 'Radio',
          title: 'PIYE TO KIH? NGUDARA',
          venue: 'Radio Bahana Ngawi',
          note: 'Live on-air & bagi-bagi merchandise',
        },
        {
          time: '14.00 – 15.40 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST',
          venue: 'New Star Cineplex (NSC) Ngawi',
          note: 'Special Screening penayangan perdana Ngawi (Wajib bertiket)',
        },
        {
          time: '16.00 – 17.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Area Bioskop NSC Ngawi',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
      ],
    },
    cinemas: [
      {
        name: 'NEW STAR CINEPLEX (NSC) NGAWI',
        chain: 'NSC',
        studio: 'Studio 2',
        seats: 226,
        remainingSeatsText: '±50 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Jl. PB Sudirman No. 45, Ngawi',
        showTimes: ['14.00 WIB'],
        ticketUrl: 'https://www.nsc.co.id',
      },
    ],
  },
  {
    slug: 'madiun',
    name: 'Madiun',
    province: 'Jawa Timur',
    dateStr: '28 Oktober 2026',
    boothInfo: {
      venue: 'LAWU PLAZA MADIUN',
      floor: 'Atrium Utama Lawu Plaza (Ramayana Madiun)',
      timeStr: '16.00 – 17.00 WIB',
      directions: 'Cari booth resmi PIYE TO KIH? di Atrium Lawu Plaza Madiun.',
      exclusiveNotice:
        'Penukaran voucher fisik resmi sesi sore berada di Atrium Lawu Plaza jam 16.00–17.00 WIB.',
    },
    rundown: {
      date: 'Rabu, 28 Oktober 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi dilayani di Atrium Lawu Plaza Madiun pada jam 16.00–17.00 WIB.',
      items: [
        {
          time: '08.00 – 09.00 WIB',
          category: 'Sekolah',
          title: 'PIYE TO KIH? MAMPIR KE SEKOLAH',
          venue: 'MAN 1 Madiun',
          note: 'Sapa siswa bersama cast',
        },
        {
          time: '10.00 – 11.00 WIB',
          category: 'Kampus',
          title: 'NGOBROL BARENG DI KAMPUS',
          venue: 'Universitas PGRI Madiun',
          note: 'Sharing session perfilman komedi',
        },
        {
          time: '11.30 – 12.30 WIB',
          category: 'Radio',
          title: 'PIYE TO KIH? NGUDARA',
          venue: 'RRI Madiun',
          note: 'Live talkshow on-air',
        },
        {
          time: '14.00 – 15.30 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST (SESI 1)',
          venue: 'CGV Lawu Plaza Madiun',
          note: 'Special Screening sesi siang (Wajib bertiket)',
        },
        {
          time: '16.00 – 17.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Atrium Utama Lawu Plaza (Ramayana)',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
        {
          time: '18.45 – 20.15 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST (SESI 2)',
          venue: 'Suncity Mall XXI Madiun',
          note: 'Special Screening sesi malam (Wajib bertiket)',
        },
      ],
    },
    cinemas: [
      {
        name: 'CGV PLAZA LAWU MADIUN',
        chain: 'CGV',
        studio: 'Studio 2',
        seats: 152,
        remainingSeatsText: '±30 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Lawu Plaza Lt. 3, Jl. Pahlawan No. 47',
        showTimes: ['14.00 WIB'],
        ticketUrl: 'https://www.cgv.id',
      },
      {
        name: 'SUNCITY MADIUN XXI',
        chain: 'XXI',
        studio: 'Studio 2',
        seats: 160,
        remainingSeatsText: '±24 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Suncity Mall Lt. 2, Jl. S. Parman No. 8',
        showTimes: ['18.45 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
    ],
  },
  {
    slug: 'ponorogo',
    name: 'Ponorogo',
    province: 'Jawa Timur',
    dateStr: '29 Oktober 2026',
    boothInfo: {
      venue: 'PONOROGO CITY CENTER (PCC)',
      floor: 'Area Atrium Utama Ponorogo City Center',
      timeStr: '17.00 – 18.00 WIB',
      directions: 'Cari booth resmi PIYE TO KIH? di Atrium PCC Mall.',
      exclusiveNotice:
        'Penukaran voucher fisik resmi berada di Atrium Ponorogo City Center jam 17.00–18.00 WIB.',
    },
    rundown: {
      date: 'Kamis, 29 Oktober 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi bertempat di Atrium Ponorogo City Center jam 17.00–18.00 WIB.',
      items: [
        {
          time: '09.00 – 10.00 WIB',
          category: 'Kampus',
          title: 'NGOBROL BARENG DI KAMPUS',
          venue: 'Universitas Muhammadiyah Ponorogo',
          note: 'Sharing session cerita & komedi',
        },
        {
          time: '11.00 – 12.00 WIB',
          category: 'Radio',
          title: 'PIYE TO KIH? NGUDARA',
          venue: 'Radio Gema Surya FM Ponorogo',
          note: 'Live interview bareng cast',
        },
        {
          time: '15.00 – 17.00 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST',
          venue: 'Cinépolis Ponorogo City Center',
          note: 'Special Screening nonton duluan (Wajib bertiket)',
        },
        {
          time: '17.00 – 18.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Atrium Ponorogo City Center',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
      ],
    },
    cinemas: [
      {
        name: 'CINÉPOLIS PONOROGO CITY CENTER',
        chain: 'Cinepolis',
        studio: 'Studio 2',
        seats: 122,
        remainingSeatsText: '±30 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Ponorogo City Center Lt. 1, Jl. Ir. H. Juanda No. 19',
        showTimes: ['15.00 WIB'],
        ticketUrl: 'https://cinepolis.co.id',
      },
    ],
  },
  {
    slug: 'nganjuk',
    name: 'Nganjuk',
    province: 'Jawa Timur',
    dateStr: '30 Oktober 2026',
    boothInfo: {
      venue: 'LUWES NGANJUK',
      floor: 'Area Atrium Luwes Nganjuk',
      timeStr: '17.00 – 18.00 WIB',
      directions: 'Cari booth resmi PIYE TO KIH? di Luwes Nganjuk.',
      exclusiveNotice:
        'Penukaran voucher fisik resmi berada di Luwes Nganjuk jam 17.00–18.00 WIB.',
    },
    rundown: {
      date: 'Jumat, 30 Oktober 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi berada di Luwes Nganjuk pada jam 17.00–18.00 WIB.',
      items: [
        {
          time: '08.00 – 09.00 WIB',
          category: 'Sekolah',
          title: 'PIYE TO KIH? MAMPIR KE SEKOLAH',
          venue: 'SMA Negeri 2 Nganjuk (SMADA)',
          note: 'Sapa pagi & kuis receh bareng siswa',
        },
        {
          time: '11.00 – 12.00 WIB',
          category: 'Kampus',
          title: 'NGOBROL BARENG DI KAMPUS',
          venue: 'Universitas PGRI Mpu Sindok (UMPS)',
          note: 'Sharing session perfilman',
        },
        {
          time: '13.00 – 14.00 WIB',
          category: 'Radio',
          title: 'PIYE TO KIH? NGUDARA',
          venue: 'Radio Cakra Krisna Nganjuk',
          note: 'Live interview on-air',
        },
        {
          time: '15.00 – 17.00 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST',
          venue: "Sam's Studio Nganjuk",
          note: 'Special Screening sesi sore (Wajib bertiket)',
        },
        {
          time: '17.00 – 18.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Luwes Nganjuk',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
      ],
    },
    cinemas: [
      {
        name: "SAM'S STUDIO NGANJUK",
        chain: 'Indie',
        studio: 'Studio 1',
        seats: 107,
        remainingSeatsText: '±25 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Jl. Ahmad Yani No. 12, Nganjuk',
        showTimes: ['15.00 WIB'],
        ticketUrl: 'https://www.instagram.com/sams.studio/',
      },
    ],
  },
  {
    slug: 'mojokerto',
    name: 'Mojokerto',
    province: 'Jawa Timur',
    dateStr: '31 Oktober 2026',
    boothInfo: {
      venue: 'SUNRISE MALL MOJOKERTO',
      floor: 'Area Atrium Sunrise Mall Mojokerto',
      timeStr: '17.00 – 18.00 WIB',
      directions: 'Cari booth resmi PIYE TO KIH? di Atrium Sunrise Mall Mojokerto.',
      exclusiveNotice:
        'Penukaran voucher fisik resmi berada di Sunrise Mall Mojokerto jam 17.00–18.00 WIB.',
    },
    rundown: {
      date: 'Sabtu, 31 Oktober 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi dilayani di Sunrise Mall Mojokerto jam 17.00–18.00 WIB.',
      items: [
        {
          time: '08.00 – 09.00 WIB',
          category: 'Sekolah',
          title: 'PIYE TO KIH? MAMPIR KE SEKOLAH',
          venue: 'SMKN 2 Mojokerto',
          note: 'Sapa pagi & seru-seruan bareng cast',
        },
        {
          time: '11.00 – 12.00 WIB',
          category: 'Kampus',
          title: 'NGOBROL BARENG DI KAMPUS',
          venue: 'Universitas Islam Majapahit (UNIM)',
          note: 'Sharing session komedi & bedah cerita',
        },
        {
          time: '13.00 – 14.00 WIB',
          category: 'Radio',
          title: 'PIYE TO KIH? NGUDARA',
          venue: 'Radio R FM Mojokerto',
          note: 'Live interview bareng sutradara & cast',
        },
        {
          time: '15.00 – 17.00 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST',
          venue: 'CGV Sunrise Mall Mojokerto',
          note: 'Special Screening sesi sore (Wajib bertiket)',
        },
        {
          time: '17.00 – 18.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Sunrise Mall Mojokerto',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
      ],
    },
    cinemas: [
      {
        name: 'CGV SUNRISE MALL MOJOKERTO',
        chain: 'CGV',
        studio: 'Studio 3',
        seats: 116,
        remainingSeatsText: '±28 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Sunrise Mall Lt. 2, Jl. Benteng Pancasila No. 9',
        showTimes: ['15.00 WIB'],
        ticketUrl: 'https://www.cgv.id',
      },
    ],
  },
  {
    slug: 'gresik',
    name: 'Gresik',
    province: 'Jawa Timur',
    dateStr: '1 November 2026',
    boothInfo: {
      venue: 'GRESSMALL GRESIK',
      floor: 'Area Atrium Utama Gressmall Gresik',
      timeStr: '16.00 – 18.00 WIB',
      directions: 'Cari booth resmi PIYE TO KIH? di Atrium Gressmall Gresik.',
      exclusiveNotice:
        'Penukaran voucher fisik resmi berada di Atrium Gressmall jam 16.00–18.00 WIB.',
    },
    rundown: {
      date: 'Minggu, 1 November 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi berada di Atrium Gressmall jam 16.00–18.00 WIB.',
      items: [
        {
          time: '10.00 – 11.00 WIB',
          category: 'Radio',
          title: 'PIYE TO KIH? NGUDARA',
          venue: 'Radio Suara Giri FM Gresik',
          note: 'Live on-air & obrolan santai roadshow',
        },
        {
          time: '13.00 – 14.45 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST',
          venue: 'Gressmall XXI Gresik',
          note: 'Special Screening sesi siang (Wajib bertiket)',
        },
        {
          time: '16.00 – 18.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Atrium Gressmall Gresik',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
      ],
    },
    cinemas: [
      {
        name: 'GRESSMALL XXI GRESIK',
        chain: 'XXI',
        studio: 'Studio 2',
        seats: 165,
        remainingSeatsText: '±35 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Gressmall Lt. 2, Jl. Sumatera No. 1-5, Gresik',
        showTimes: ['13.00 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
    ],
  },
  {
    slug: 'surabaya',
    name: 'Surabaya',
    province: 'Jawa Timur',
    dateStr: '2 November 2026',
    boothInfo: {
      venue: 'ROYAL PLAZA SURABAYA',
      floor: 'Area Atrium Royal Plaza Surabaya',
      timeStr: '16.00 – 17.00 WIB',
      directions: 'Cari booth resmi PIYE TO KIH? di Atrium Royal Plaza Surabaya.',
      exclusiveNotice:
        'Penukaran voucher fisik resmi berada di Royal Plaza Surabaya jam 16.00–17.00 WIB.',
    },
    rundown: {
      date: 'Senin, 2 November 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi berada di Royal Plaza Surabaya jam 16.00–17.00 WIB.',
      items: [
        {
          time: '13.00 – 14.00 WIB',
          category: 'Radio',
          title: 'PIYE TO KIH? NGUDARA',
          venue: 'RRI Pro 2 FM Surabaya',
          note: 'Live interview radio bareng cast',
        },
        {
          time: '14.30 – 15.30 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST',
          venue: 'Royal Plaza XXI Surabaya',
          note: 'Special Screening sesi siang (Wajib bertiket)',
        },
        {
          time: '16.00 – 17.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Atrium Royal Plaza Surabaya',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
      ],
    },
    cinemas: [
      {
        name: 'ROYAL PLAZA XXI SURABAYA',
        chain: 'XXI',
        studio: 'Studio 3',
        seats: 162,
        remainingSeatsText: '±40 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Royal Plaza Lt. 4, Jl. Ahmad Yani No. 16-18',
        showTimes: ['14.30 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
    ],
  },
  {
    slug: 'sidoarjo',
    name: 'Sidoarjo',
    province: 'Jawa Timur',
    dateStr: '3 November 2026',
    boothInfo: {
      venue: 'SUNCITY MALL SIDOARJO',
      floor: 'Area Atrium Suncity Mall Sidoarjo',
      timeStr: '15.00 – 16.00 WIB',
      directions: 'Cari booth resmi PIYE TO KIH? di Atrium Suncity Mall Sidoarjo.',
      exclusiveNotice:
        'Penukaran voucher fisik resmi berada di Suncity Mall Sidoarjo jam 15.00–16.00 WIB.',
    },
    rundown: {
      date: 'Selasa, 3 November 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi bertempat di Suncity Mall Sidoarjo jam 15.00–16.00 WIB.',
      items: [
        {
          time: '06.00 – 09.00 WIB',
          category: 'Acara',
          title: 'PIYE TO KIH? SAPA CFD SIDOARJO',
          venue: 'Alun-Alun Sidoarjo',
          note: 'Sapa pagi warga Sidoarjo bareng pemain',
        },
        {
          time: '13.00 – 14.40 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST (SESI 1)',
          venue: 'Platinum Cineplex Suncity Mall Sidoarjo',
          note: 'Special Screening sesi siang (Wajib bertiket)',
        },
        {
          time: '15.00 – 16.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Atrium Suncity Mall Sidoarjo',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
        {
          time: '16.10 – 17.50 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST (SESI 2)',
          venue: 'Ciplaz Sidoarjo XXI',
          note: 'Special Screening sesi sore (Wajib bertiket)',
        },
      ],
    },
    cinemas: [
      {
        name: 'PLATINUM CINEPLEX SUNCITY MALL SIDOARJO',
        chain: 'Platinum',
        studio: 'Studio 2',
        seats: 162,
        remainingSeatsText: '±34 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Suncity Mall Lt. 3, Jl. Pahlawan No. 1',
        showTimes: ['13.00 WIB'],
        ticketUrl: 'https://platinumcineplex.co.id',
      },
      {
        name: 'CIPLAZ SIDOARJO XXI',
        chain: 'XXI',
        studio: 'Studio 2',
        seats: 128,
        remainingSeatsText: '±26 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Ciplaz Sidoarjo Lt. 2, Jl. Diponegoro No. 2',
        showTimes: ['16.10 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
    ],
  },
  {
    slug: 'malang',
    name: 'Malang',
    province: 'Jawa Timur',
    dateStr: '4 November 2026',
    boothInfo: {
      venue: 'CYBER MALL MALANG',
      floor: 'Area Atrium Cyber Mall Malang',
      timeStr: '17.00 – 18.00 WIB',
      directions: 'Cari booth resmi PIYE TO KIH? di Atrium Cyber Mall Malang.',
      exclusiveNotice:
        'Penukaran voucher fisik resmi berada di Cyber Mall Malang jam 17.00–18.00 WIB.',
    },
    rundown: {
      date: 'Rabu, 4 November 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi berada di Cyber Mall Malang jam 17.00–18.00 WIB.',
      items: [
        {
          time: '11.00 – 12.00 WIB',
          category: 'Kampus',
          title: 'NGOBROL BARENG DI KAMPUS',
          venue: 'Universitas Brawijaya / Univ. Muhammadiyah Malang',
          note: 'Sharing session perfilman komedi',
        },
        {
          time: '13.00 – 14.00 WIB',
          category: 'Radio',
          title: 'PIYE TO KIH? NGUDARA',
          venue: 'RRI Pro 2 FM Malang',
          note: 'Live on-air & seru-seruan bareng cast',
        },
        {
          time: '15.50 – 16.30 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST',
          venue: 'Dieng XXI Malang',
          note: 'Special Screening sesi sore (Wajib bertiket)',
        },
        {
          time: '17.00 – 18.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Cyber Mall Malang',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
      ],
    },
    cinemas: [
      {
        name: 'DIENG XXI MALANG',
        chain: 'XXI',
        studio: 'Studio 3',
        seats: 144,
        remainingSeatsText: '±32 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Cyber Mall Lt. 3, Jl. Raya Langsep No. 2',
        showTimes: ['15.50 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
      {
        name: 'CINÉPOLIS MALANG TOWN SQUARE',
        chain: 'Cinepolis',
        studio: 'Studio 2',
        seats: 126,
        remainingSeatsText: '±25 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Malang Town Square Lt. 3, Jl. Veteran No. 2',
        showTimes: ['18.00 WIB'],
        ticketUrl: 'https://cinepolis.co.id',
      },
    ],
  },
  {
    slug: 'kediri',
    name: 'Kediri',
    province: 'Jawa Timur',
    dateStr: '6 November 2026',
    boothInfo: {
      venue: 'KEDIRI MALL / TAMAN BRANTAS',
      floor: 'Area Booth Resmi Roadshow Kediri',
      timeStr: '15.00 – 17.00 WIB',
      directions: 'Cari booth oranye PIYE TO KIH? di area Kediri Mall / Taman Brantas.',
      exclusiveNotice:
        'Penukaran voucher fisik resmi berada di booth roadshow Kediri jam 15.00–17.00 WIB.',
    },
    rundown: {
      date: 'Jumat, 6 November 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi bertempat di area Kediri Mall / Taman Brantas jam 15.00–17.00 WIB.',
      items: [
        {
          time: '10.00 – 11.00 WIB',
          category: 'Kampus',
          title: 'NGOBROL BARENG DI KAMPUS',
          venue: 'Universitas Dian Nuswantoro (Udinus Kediri)',
          note: 'Sharing session bedah cerita film',
        },
        {
          time: '13.00 – 14.00 WIB',
          category: 'Acara',
          title: 'SARASEHAN BARENG WALIKOTA KEDIRI',
          venue: 'Balaikota Kediri',
          note: 'Silaturahmi & diskusi budaya sinema',
        },
        {
          time: '15.00 – 17.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Taman Brantas / Kediri Mall',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
        {
          time: '19.00 – 21.00 WIB',
          category: 'Screening',
          title: 'HOME PREMIERE KEDIRI (ALL STUDIO)',
          venue: 'Ciplaz Kediri XXI & Golden Theater',
          note: 'Penayangan akbar premiere Kediri (Wajib bertiket)',
        },
      ],
    },
    cinemas: [
      {
        name: 'CIPLAZ KEDIRI XXI',
        chain: 'XXI',
        studio: 'Studio 1',
        seats: 128,
        remainingSeatsText: '±28 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Ciplaz Kediri Lt. 2, Jl. Hayam Wuruk No. 46',
        showTimes: ['19.00 WIB'],
        ticketUrl: 'https://m.21cineplex.com',
      },
    ],
  },
  {
    slug: 'blitar',
    name: 'Blitar',
    province: 'Jawa Timur',
    dateStr: '8 November 2026',
    boothInfo: {
      venue: 'BLITAR SQUARE',
      floor: 'Area Atrium Blitar Square',
      timeStr: '15.00 – 16.00 WIB',
      directions: 'Cari booth resmi PIYE TO KIH? di Atrium Blitar Square.',
      exclusiveNotice:
        'Penukaran voucher fisik resmi berada di Blitar Square jam 15.00–16.00 WIB.',
    },
    rundown: {
      date: 'Minggu, 8 November 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi berada di Blitar Square jam 15.00–16.00 WIB.',
      items: [
        {
          time: '08.00 – 09.00 WIB',
          category: 'Sekolah',
          title: 'PIYE TO KIH? MAMPIR KE SEKOLAH',
          venue: 'SMK Negeri 1 Kota Blitar',
          note: 'Sapa pagi & kuis receh bareng siswa',
        },
        {
          time: '10.00 – 11.00 WIB',
          category: 'Kampus',
          title: 'NGOBROL BARENG DI KAMPUS',
          venue: 'Universitas Islam Balitar (UNISBA Blitar)',
          note: 'Sharing session perfilman bersama cast',
        },
        {
          time: '12.00 – 13.00 WIB',
          category: 'Radio',
          title: 'PIYE TO KIH? NGUDARA',
          venue: 'LPPL Radio Mahardhika FM Blitar',
          note: 'Live interview on-air',
        },
        {
          time: '13.00 – 15.00 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST',
          venue: 'CGV Blitar Square',
          note: 'Special Screening sesi siang (Wajib bertiket)',
        },
        {
          time: '15.00 – 16.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Blitar Square',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
      ],
    },
    cinemas: [
      {
        name: 'CGV BLITAR SQUARE',
        chain: 'CGV',
        studio: 'Studio 5',
        seats: 162,
        remainingSeatsText: '±36 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Blitar Square Lt. 3, Jl. Merdeka No. 6-8',
        showTimes: ['13.00 WIB'],
        ticketUrl: 'https://www.cgv.id',
      },
    ],
  },
  {
    slug: 'tulungagung',
    name: 'Tulungagung',
    province: 'Jawa Timur',
    dateStr: '8 November 2026',
    boothInfo: {
      venue: 'GOLDEN THEATRE TULUNGAGUNG',
      floor: 'Area Lobi Bioskop Golden Theatre',
      timeStr: '17.00 – 19.00 WIB',
      directions: 'Cari booth resmi PIYE TO KIH? di lobi bioskop Golden Theatre Tulungagung.',
      exclusiveNotice:
        'Penukaran voucher fisik resmi berada di Golden Theatre Tulungagung.',
    },
    rundown: {
      date: 'Minggu, 8 November 2026',
      voucherExchangeInfo:
        'Penukaran voucher fisik resmi bertempat di Golden Theatre Tulungagung.',
      items: [
        {
          time: '17.00 – 19.00 WIB',
          category: 'Mall & Meet',
          title: 'TEMU KONCO + BOOTH VOUCHER',
          venue: 'Lobi Golden Theatre Tulungagung',
          note: 'Titik bayar & ambil Voucher Fisik 19–20 Nov',
          isVoucherExchange: true,
        },
        {
          time: '18.00 – 20.00 WIB',
          category: 'Screening',
          title: 'NONTON DULUAN + GREETING CAST',
          venue: 'Golden Theatre Tulungagung',
          note: 'Special Screening penayangan penutup roadshow (Wajib bertiket)',
        },
      ],
    },
    cinemas: [
      {
        name: 'GOLDEN THEATRE TULUNGAGUNG',
        chain: 'Indie',
        studio: 'Studio 2',
        seats: 202,
        remainingSeatsText: '±45 kursi tersisa',
        doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
        address: 'Jl. Ahmad Yani Timur No. 66, Tulungagung',
        showTimes: ['18.00 WIB'],
        ticketUrl: 'https://www.instagram.com/goldentheatretulungagung/',
      },
    ],
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  return CITIES_DATA.find(c => c.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized);
}

export function getCityByNameOrSlug(query?: string): CityData | undefined {
  if (!query) return undefined;
  const q = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  return CITIES_DATA.find(c => {
    const slugNorm = c.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    const nameNorm = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return slugNorm === q || nameNorm === q || q.includes(slugNorm) || slugNorm.includes(q);
  });
}
