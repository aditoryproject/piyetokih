export interface CinemaVenue {
  name: string;
  chain: "XXI" | "Cinepolis" | "CGV" | "Platinum" | "NSC" | "Indie";
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
  category: "Sekolah" | "Kampus" | "Radio" | "Screening" | "Mall & Meet" | "Acara";
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
    "slug": "semarang",
    "name": "Semarang",
    "province": "Jawa Tengah",
    "dateStr": "22 Oktober 2026",
    "boothInfo": {
      "venue": "THE PARK MALL SEMARANG",
      "floor": "Lantai 2 (Area Atrium Depan Eskalator The Park Mall)",
      "timeStr": "16.00 – 17.00 WIB",
      "directions": "Dekat eskalator tengah lantai 2, cari booth oranye dengan spanduk PIYE TO KIH?",
      "exclusiveNotice": "Penukaran voucher fisik resmi hanya berada di The Park Mall Lantai 2 pada jam 16.00–17.00 WIB. DILARANG menukar di kasir bioskop manapun."
    },
    "rundown": {
      "date": "Kamis, 22 Oktober 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi hanya berada di The Park Mall Lantai 2 pada jam 16.00–17.00 WIB. Tunjukkan Kode Booking Anda di booth untuk membayar dan mengambil voucher fisik.",
      "items": [
        {
          "time": "08.00 – 09.00 WIB",
          "category": "Sekolah",
          "title": "MAMPIR KE SEKOLAH",
          "venue": "SMA Negeri 15 Semarang",
          "note": "Sapa pagi & seru-seruan bareng cast film",
          "isVoucherExchange": true
        },
        {
          "time": "10.00 – 12.00 WIB",
          "category": "Kampus",
          "title": "NGOBROL BARENG DI KAMPUS",
          "venue": "UNNES (Universitas Negeri Semarang)",
          "note": "Sharing session perfilman komedi & kreatif di Auditorium Prof. Wuryanto",
          "isVoucherExchange": true
        },
        {
          "time": "14.00 – 15.00 WIB",
          "category": "Radio",
          "title": "INTERVIEW RADIO",
          "venue": "Jateng Radio FM",
          "note": "Live talkshow on-air seputar kisah film & lagu soundtrack"
        },
        {
          "time": "14.30 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST (SESI 1)",
          "venue": "The Park XXI Semarang",
          "note": "Special Screening sesi 1 bersama pemain film (Wajib bertiket)"
        },
        {
          "time": "16.00 – 17.00 WIB",
          "category": "Mall & Meet",
          "title": "MEET & GREET MALL",
          "venue": "The Park Mall Semarang — Lantai 2",
          "note": "seru-seruan dan foto bareng pemain, doorprize, dan bagi-bagi merchandise, booth voucher fisik.",
          "isVoucherExchange": true
        },
        {
          "time": "19.00 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST (SESI 2)",
          "venue": "Cinépolis Java Mall Semarang",
          "note": "Special Screening sesi 2 bersama pemain film (Wajib bertiket)"
        }
      ]
    },
    "cinemas": [
      {
        "name": "THE PARK XXI SEMARANG",
        "chain": "XXI",
        "studio": "Studio 1 Premiere Sound",
        "seats": 180,
        "remainingSeatsText": "±42 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "The Park Mall Semarang Lt. 3, Jl. Madukoro Raya No. 1",
        "showTimes": [
          "14.30 WIB"
        ],
        "ticketUrl": "https://tinyurl.com/mrx93shj"
      },
      {
        "name": "CINÉPOLIS JAVA MALL SEMARANG",
        "chain": "Cinepolis",
        "studio": "Audi 2 Super Screen",
        "seats": 121,
        "remainingSeatsText": "±28 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Java Supermall Lt. 3, Jl. Letjen MT Haryono No. 992-994",
        "showTimes": [
          "19.00 WIB"
        ],
        "ticketUrl": "https://cinepolis.co.id"
      }
    ]
  },
  {
    "slug": "jogja",
    "name": "Yogyakarta",
    "province": "D.I. Yogyakarta",
    "dateStr": "23 Oktober 2026",
    "boothInfo": {
      "venue": "PLAZA AMBARRUKMO YOGYAKARTA",
      "floor": "Ground Floor (Area Atrium Utama)",
      "timeStr": "17.00 – 18.00 WIB",
      "directions": "Cari booth resmi oranye PIYE TO KIH? di Ground Floor Plaza Ambarrukmo depan eskalator utama.",
      "exclusiveNotice": "Penukaran voucher fisik resmi hanya dilayani di booth Plaza Ambarrukmo Ground Floor pada jam 17.00–18.00 WIB. Bioskop XXI adalah tempat penayangan Special Screening khusus penonton bertiket."
    },
    "rundown": {
      "date": "Jumat, 23 Oktober 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi bertempat di Ground Floor Plaza Ambarrukmo pada jam 17.00–18.00 WIB. Tunjukkan Kode Booking Anda di booth untuk mengambil voucher fisik.",
      "items": [
        {
          "time": "10.00 – 11.00 WIB",
          "category": "Radio",
          "title": "INTERVIEW RADIO",
          "venue": "RRI Pro 2 FM Yogyakarta",
          "note": "Live on-air & obrolan santai seputar film komedi Jawa"
        },
        {
          "time": "13.00 – 15.00 WIB",
          "category": "Kampus",
          "title": "NGOBROL BARENG DI KAMPUS",
          "venue": "Universitas AMIKOM Yogyakarta",
          "note": "Sharing session industri kreatif & perfilman",
          "isVoucherExchange": true
        },
        {
          "time": "14.30 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST (SESI 1)",
          "venue": "Plaza Ambarrukmo XXI Jogja",
          "note": "Special Screening sesi 1 bersama pemain film (Wajib bertiket)"
        },
        {
          "time": "17.00 – 18.00 WIB",
          "category": "Mall & Meet",
          "title": "MEET & GREET MALL",
          "venue": "Plaza Ambarrukmo — Ground Floor",
          "note": "Seru-seruan bareng cast, doorprize, games, dan booth penukaran voucher fisik.",
          "isVoucherExchange": true
        },
        {
          "time": "16.30 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST (SESI 2)",
          "venue": "Jogja City Mall XXI",
          "note": "Special Screening sesi 2 greeting ending cast (Wajib bertiket)"
        }
      ]
    },
    "cinemas": [
      {
        "name": "PLAZA AMBARRUKMO XXI JOGJA",
        "chain": "XXI",
        "studio": "Studio 4",
        "seats": 182,
        "remainingSeatsText": "±35 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Plaza Ambarrukmo Lt. 3, Jl. Laksda Adisucipto No. 80",
        "showTimes": [
          "14.30 WIB"
        ],
        "ticketUrl": "https://m.21cineplex.com/id/movies/16PTKH"
      },
      {
        "name": "JOGJA CITY MALL XXI",
        "chain": "XXI",
        "studio": "Studio 4",
        "seats": 149,
        "remainingSeatsText": "±22 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Jogja City Mall Lt. 2, Jl. Magelang Km. 6 No. 18",
        "showTimes": [
          "16.30 WIB"
        ],
        "ticketUrl": "https://m.21cineplex.com/id/movies/16PTKH"
      }
    ]
  },
  {
    "slug": "magelang",
    "name": "Magelang",
    "province": "Jawa Tengah",
    "dateStr": "24 Oktober 2026",
    "boothInfo": {
      "venue": "ARMADA TOWN SQUARE (ARTOS MALL)",
      "floor": "Atrium Utama Artos Mall Magelang",
      "timeStr": "16.00 – 17.00 WIB",
      "directions": "Cari booth oranye resmi PIYE TO KIH? di Atrium Utama Artos Mall Magelang.",
      "exclusiveNotice": "Penukaran voucher fisik resmi bertempat di Atrium Artos Mall Magelang pada jam 16.00–17.00 WIB. Pemegang tiket bioskop The Aloon-Aloon XXI langsung menuju bioskop untuk Special Screening."
    },
    "rundown": {
      "date": "Sabtu, 24 Oktober 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi berada di Atrium Artos Mall Magelang pada jam 16.00–17.00 WIB. Tunjukkan Kode Booking Anda di booth.",
      "items": [
        {
          "time": "11.00 – 12.00 WIB",
          "category": "Radio",
          "title": "INTERVIEW RADIO",
          "venue": "Radio Gemilang FM Pemkot Magelang",
          "note": "Live interview interaktif bersama cast film"
        },
        {
          "time": "13.00 – 15.00 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST (SESI 1)",
          "venue": "Platinum Cineplex Artos Mall Magelang",
          "note": "Special Screening sesi siang bersama cast film (Wajib bertiket)"
        },
        {
          "time": "16.00 – 17.00 WIB",
          "category": "Mall & Meet",
          "title": "MEET & GREET MALL",
          "venue": "Atrium Armada Town Square (Artos Mall)",
          "note": "Meet & greet temu konco, doorprize, foto bersama cast, dan booth voucher fisik.",
          "isVoucherExchange": true
        },
        {
          "time": "16.45 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST (SESI 2)",
          "venue": "The Aloon - Aloon XXI Magelang",
          "note": "Special Screening sesi petang greeting ending cast (Wajib bertiket)"
        }
      ]
    },
    "cinemas": [
      {
        "name": "PLATINUM CINEPLEX ARTOS MALL",
        "chain": "Platinum",
        "studio": "Studio 3",
        "seats": 156,
        "remainingSeatsText": "±40 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Artos Mall Lt. UG, Jl. Mayjen Bambang Soegeng No. 1",
        "showTimes": [
          "13.00 WIB"
        ],
        "ticketUrl": "https://platinumcineplex.co.id"
      },
      {
        "name": "THE ALOON - ALOON XXI MAGELANG",
        "chain": "XXI",
        "studio": "Studio 2",
        "seats": 144,
        "remainingSeatsText": "±30 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Jl. Alun-Alun Utara No. 1, Magelang",
        "showTimes": [
          "16.45 WIB"
        ],
        "ticketUrl": "https://m.21cineplex.com/id/movies/16PTKH"
      }
    ]
  },
  {
    "slug": "solo",
    "name": "Surakarta (Solo)",
    "province": "Jawa Tengah",
    "dateStr": "25 Oktober 2026",
    "boothInfo": {
      "venue": "SOLO PARAGON MALL",
      "floor": "Area Stage Food Factory Solo Paragon Mall",
      "timeStr": "16.00 – 17.00 WIB",
      "directions": "Cari booth oranye PIYE TO KIH? di depan Stage Food Factory Solo Paragon Mall.",
      "exclusiveNotice": "Penukaran voucher fisik resmi berada di Stage Food Factory Solo Paragon Mall jam 16.00–17.00 WIB. Penayangan bioskop malam di Pakuwon Mall Solo Baru khusus tiket nonton duluan."
    },
    "rundown": {
      "date": "Minggu, 25 Oktober 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi berada di Stage Food Factory Solo Paragon Mall pada jam 16.00–17.00 WIB.",
      "items": [
        {
          "time": "06.00 – 09.00 WIB",
          "category": "Acara",
          "title": "SAPA WARGA CFD SOLO",
          "venue": "Car Free Day Jl. Slamet Riyadi Solo",
          "note": "Jalan santai, sapa warga Solo, flash mob, dan bagi merchandise",
          "isVoucherExchange": true
        },
        {
          "time": "11.00 – 12.00 WIB",
          "category": "Radio",
          "title": "INTERVIEW RADIO",
          "venue": "RRI Pro 2 Solo",
          "note": "Live talkshow seru bareng cast film"
        },
        {
          "time": "12.15 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST (SESI 1)",
          "venue": "Solo Paragon XXI",
          "note": "Special Screening sesi siang bersama cast film (Wajib bertiket)"
        },
        {
          "time": "16.00 – 17.00 WIB",
          "category": "Mall & Meet",
          "title": "MEET & GREET MALL",
          "venue": "Stage Food Factory Solo Paragon Mall",
          "note": "Temu konco akbar, doorprize, foto bareng pemain, dan booth voucher fisik.",
          "isVoucherExchange": true
        },
        {
          "time": "19.00 – 20.40 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST (SESI 2)",
          "venue": "Platinum Cineplex Pakuwon Mall Solo Baru",
          "note": "Special Screening sesi malam greeting ending cast (Wajib bertiket)"
        }
      ]
    },
    "cinemas": [
      {
        "name": "SOLO PARAGON XXI",
        "chain": "XXI",
        "studio": "Studio 3",
        "seats": 158,
        "remainingSeatsText": "±38 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Solo Paragon Mall Lt. 1, Jl. Yosodipuro No. 133",
        "showTimes": [
          "12.15 WIB"
        ],
        "ticketUrl": "https://m.21cineplex.com/id/movies/16PTKH"
      },
      {
        "name": "PLATINUM CINEPLEX PAKUWON MALL SOLO BARU",
        "chain": "Platinum",
        "studio": "Studio 2",
        "seats": 160,
        "remainingSeatsText": "±25 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Pakuwon Mall Solo Baru Lt. 2, Sukoharjo",
        "showTimes": [
          "19.00 WIB"
        ],
        "ticketUrl": "https://platinumcineplex.co.id"
      }
    ]
  },
  {
    "slug": "sragen",
    "name": "Sragen",
    "province": "Jawa Tengah",
    "dateStr": "26 Oktober 2026",
    "boothInfo": {
      "venue": "PLAZA ATRIUM SRAGEN",
      "floor": "Area Atrium Utama Plaza Atrium Sragen (Samping Panggung)",
      "timeStr": "15.00 – 17.00 WIB",
      "directions": "Cari booth resmi oranye PIYE TO KIH? di Atrium Utama Plaza Atrium Sragen.",
      "exclusiveNotice": "Penukaran voucher fisik resmi berada di booth Plaza Atrium Sragen pada jam 15.00–17.00 WIB. DILARANG menukar di kasir bioskop."
    },
    "rundown": {
      "date": "Senin, 26 Oktober 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi dilayani di Plaza Atrium Sragen pada jam 15.00–17.00 WIB.",
      "items": [
        {
          "time": "08.00 – 09.00 WIB",
          "category": "Sekolah",
          "title": "MAMPIR KE SEKOLAH",
          "venue": "SMK Citra Medika Sragen / SMA Negeri 1 Sragen",
          "note": "Sapa konco sekolah & seru-seruan bareng cast",
          "isVoucherExchange": true
        },
        {
          "time": "10.00 – 11.00 WIB",
          "category": "Radio",
          "title": "INTERVIEW RADIO",
          "venue": "LPPL Radio Buana Asri Sragen",
          "note": "Live siaran radio & kuis berhadiah tiket"
        },
        {
          "time": "13.00 – 15.00 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST",
          "venue": "Platinum Cineplex Plaza Atrium Sragen",
          "note": "Special Screening penayangan perdana Sragen bersama cast (Wajib bertiket)"
        },
        {
          "time": "15.00 – 17.00 WIB",
          "category": "Mall & Meet",
          "title": "TEMU KONCO & MEET GREET",
          "venue": "Plaza Atrium Sragen — Area Atrium Bioskop Platinum",
          "note": "Temu konco, foto bareng, doorprize merchandise, dan booth voucher fisik.",
          "isVoucherExchange": true
        }
      ]
    },
    "cinemas": [
      {
        "name": "PLATINUM PLAZA ATRIUM SRAGEN",
        "chain": "Platinum",
        "studio": "Studio 2",
        "seats": 203,
        "remainingSeatsText": "±45 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Plaza Atrium Sragen Lt. 2, Jl. Sukowati No. 100",
        "showTimes": [
          "13.00 WIB"
        ],
        "ticketUrl": "https://platinumcineplex.co.id"
      }
    ]
  },
  {
    "slug": "ngawi",
    "name": "Ngawi",
    "province": "Jawa Timur",
    "dateStr": "27 Oktober 2026",
    "boothInfo": {
      "venue": "AREA ROADSHOW NGAWI",
      "floor": "Area Halaman Panggung Acara Roadshow Ngawi",
      "timeStr": "16.00 – 17.00 WIB",
      "directions": "Cari booth resmi oranye PIYE TO KIH? di area panggung acara roadshow Ngawi.",
      "exclusiveNotice": "Penukaran voucher fisik resmi berada di booth acara roadshow Ngawi pada jam 16.00–17.00 WIB. DILARANG menukar di kasir bioskop."
    },
    "rundown": {
      "date": "Selasa, 27 Oktober 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi berada di lobi bioskop NSC Ngawi pada jam 16.00–17.00 WIB.",
      "items": [
        {
          "time": "08.00 – 09.00 WIB",
          "category": "Sekolah",
          "title": "MAMPIR KE SEKOLAH",
          "venue": "SMA Negeri 1 Ngawi",
          "note": "Sapa pagi & kuis receh berhadiah merchandise bareng siswa",
          "isVoucherExchange": true
        },
        {
          "time": "10.00 – 11.00 WIB",
          "category": "Radio",
          "title": "INTERVIEW RADIO",
          "venue": "Radio Bahana Ngawi",
          "note": "Live on-air & obrolan seru roadshow"
        },
        {
          "time": "14.00 – 15.40 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST",
          "venue": "New Star Cineplex (NSC) Ngawi",
          "note": "Special Screening penayangan perdana Ngawi (Wajib bertiket)"
        },
        {
          "time": "16.00 – 17.00 WIB",
          "category": "Mall & Meet",
          "title": "TEMU KONCO & MEET GREET",
          "venue": "Area Lobi Bioskop NSC Ngawi",
          "note": "Temu konco, foto bareng pemain film, dan booth voucher fisik.",
          "isVoucherExchange": true
        },
        {
          "time": "21.00 WIB",
          "category": "Acara",
          "title": "MEET & GREET DENGAN KOMUNITAS",
          "venue": "Perkumpulan Komunitas Camp Ngawi",
          "note": "Kumpul santai komunitas & diskusi film malam hari"
        }
      ]
    },
    "cinemas": [
      {
        "name": "NEW STAR CINEPLEX (NSC) NGAWI",
        "chain": "NSC",
        "studio": "Studio 2",
        "seats": 226,
        "remainingSeatsText": "±50 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Jl. PB Sudirman No. 45, Ngawi",
        "showTimes": [
          "14.00 WIB"
        ],
        "ticketUrl": "https://www.nsc.co.id"
      }
    ]
  },
  {
    "slug": "madiun",
    "name": "Madiun",
    "province": "Jawa Timur",
    "dateStr": "28 Oktober 2026",
    "boothInfo": {
      "venue": "LAWU PLAZA MADIUN",
      "floor": "Atrium Utama Lawu Plaza (Ramayana Madiun)",
      "timeStr": "16.00 – 17.00 WIB",
      "directions": "Cari booth resmi PIYE TO KIH? di Atrium Utama Lawu Plaza Madiun.",
      "exclusiveNotice": "Penukaran voucher fisik resmi sesi sore berada di Atrium Lawu Plaza jam 16.00–17.00 WIB. Bioskop Suncity XXI melayani Special Screening sesi malam."
    },
    "rundown": {
      "date": "Rabu, 28 Oktober 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi dilayani di Atrium Lawu Plaza Madiun pada jam 16.00–17.00 WIB.",
      "items": [
        {
          "time": "08.00 – 09.00 WIB",
          "category": "Sekolah",
          "title": "MAMPIR KE SEKOLAH",
          "venue": "MAN 1 Madiun / SMAN 1 Madiun",
          "note": "Sapa siswa bersama cast film",
          "isVoucherExchange": true
        },
        {
          "time": "10.00 – 11.00 WIB",
          "category": "Kampus",
          "title": "NGOBROL BARENG DI KAMPUS",
          "venue": "Universitas PGRI Madiun / Politeknik Negeri Madiun",
          "note": "Sharing session perfilman komedi & industri kreatif",
          "isVoucherExchange": true
        },
        {
          "time": "11.30 – 12.30 WIB",
          "category": "Radio",
          "title": "INTERVIEW RADIO",
          "venue": "RRI Madiun / Radio Madya FM",
          "note": "Live talkshow on-air seputar film"
        },
        {
          "time": "14.40 – 15.00 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST (SESI 1)",
          "venue": "CGV Lawu Plaza Madiun",
          "note": "Special Screening sesi siang bersama cast (Wajib bertiket)"
        },
        {
          "time": "16.00 – 17.00 WIB",
          "category": "Mall & Meet",
          "title": "MEET & GREET MALL",
          "venue": "Atrium Utama Lawu Plaza (Ramayana)",
          "note": "Temu konco, foto bersama, games & bagi merchandise, dan booth voucher fisik.",
          "isVoucherExchange": true
        },
        {
          "time": "19.00 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST (SESI 2)",
          "venue": "Suncity Madiun XXI",
          "note": "Special Screening sesi malam greeting ending cast (Wajib bertiket)"
        },
        {
          "time": "20.15 – 21.15 WIB",
          "category": "Mall & Meet",
          "title": "TEMU KONCO SUNCITY MALL",
          "venue": "Suncity Mall Madiun",
          "note": "Sapa penggemar malam di Suncity Mall Madiun"
        },
        {
          "time": "21.00 – 22.00 WIB",
          "category": "Acara",
          "title": "TEMU KONCO KOMUNITAS",
          "venue": "Ngrowo Bening Edupark Madiun",
          "note": "Temu konco santai bersama komunitas lokal"
        }
      ]
    },
    "cinemas": [
      {
        "name": "CGV PLAZA LAWU MADIUN",
        "chain": "CGV",
        "studio": "Studio 2",
        "seats": 152,
        "remainingSeatsText": "±30 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Lawu Plaza Lt. 3, Jl. Pahlawan No. 47",
        "showTimes": [
          "14.40 WIB"
        ],
        "ticketUrl": "https://www.cgv.id"
      },
      {
        "name": "SUNCITY MADIUN XXI",
        "chain": "XXI",
        "studio": "Studio 2",
        "seats": 160,
        "remainingSeatsText": "±24 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Suncity Mall Lt. 2, Jl. S. Parman No. 8",
        "showTimes": [
          "19.00 WIB"
        ],
        "ticketUrl": "https://m.21cineplex.com/id/movies/16PTKH"
      }
    ]
  },
  {
    "slug": "ponorogo",
    "name": "Ponorogo",
    "province": "Jawa Timur",
    "dateStr": "29 Oktober 2026",
    "boothInfo": {
      "venue": "PONOROGO CITY CENTER (PCC)",
      "floor": "Area Atrium Utama Ponorogo City Center",
      "timeStr": "17.00 – 18.00 WIB",
      "directions": "Cari booth resmi PIYE TO KIH? di Atrium PCC Mall dekat pintu masuk utama.",
      "exclusiveNotice": "Penukaran voucher fisik resmi berada di Atrium Ponorogo City Center jam 17.00–18.00 WIB."
    },
    "rundown": {
      "date": "Kamis, 29 Oktober 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi bertempat di Atrium Ponorogo City Center jam 17.00–18.00 WIB.",
      "items": [
        {
          "time": "09.00 – 10.00 WIB",
          "category": "Kampus",
          "title": "NGOBROL BARENG DI KAMPUS",
          "venue": "Universitas Muhammadiyah Ponorogo / UIN Ponorogo",
          "note": "Sharing session cerita & komedi lokal",
          "isVoucherExchange": true
        },
        {
          "time": "11.00 – 12.00 WIB",
          "category": "Radio",
          "title": "INTERVIEW RADIO",
          "venue": "Radio Gema Surya FM / Radio Songgolangit Ponorogo",
          "note": "Live interview bareng cast film"
        },
        {
          "time": "15.00 – 17.00 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST",
          "venue": "Cinépolis Ponorogo City Center",
          "note": "Special Screening nonton duluan bersama pemain film (Wajib bertiket)"
        },
        {
          "time": "17.00 – 18.00 WIB",
          "category": "Mall & Meet",
          "title": "MEET & GREET MALL",
          "venue": "Atrium Ponorogo City Center (PCC)",
          "note": "Temu konco, foto bareng pemain, bagi merchandise, dan booth voucher fisik.",
          "isVoucherExchange": true
        }
      ]
    },
    "cinemas": [
      {
        "name": "CINÉPOLIS PONOROGO CITY CENTER",
        "chain": "Cinepolis",
        "studio": "Studio 2",
        "seats": 122,
        "remainingSeatsText": "±30 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Ponorogo City Center Lt. 1, Jl. Ir. H. Juanda No. 19",
        "showTimes": [
          "15.00 WIB"
        ],
        "ticketUrl": "https://cinepolis.co.id"
      }
    ]
  },
  {
    "slug": "nganjuk",
    "name": "Nganjuk",
    "province": "Jawa Timur",
    "dateStr": "30 Oktober 2026",
    "boothInfo": {
      "venue": "LUWES NGANJUK",
      "floor": "Area Atrium Utama Luwes Nganjuk",
      "timeStr": "17.00 – 18.00 WIB",
      "directions": "Cari booth resmi PIYE TO KIH? di Atrium Luwes Nganjuk.",
      "exclusiveNotice": "Penukaran voucher fisik resmi berada di Luwes Nganjuk jam 17.00–18.00 WIB."
    },
    "rundown": {
      "date": "Jumat, 30 Oktober 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi berada di Luwes Nganjuk pada jam 17.00–18.00 WIB.",
      "items": [
        {
          "time": "08.00 – 09.00 WIB",
          "category": "Sekolah",
          "title": "MAMPIR KE SEKOLAH",
          "venue": "SMA Negeri 2 Nganjuk (SMADA) / SMK Digital PSM",
          "note": "Sapa pagi & kuis seru bareng siswa",
          "isVoucherExchange": true
        },
        {
          "time": "11.00 – 12.00 WIB",
          "category": "Kampus",
          "title": "NGOBROL BARENG DI KAMPUS",
          "venue": "Universitas PGRI Mpu Sindok (UMPS Nganjuk)",
          "note": "Sharing session perfilman komedi",
          "isVoucherExchange": true
        },
        {
          "time": "13.00 – 14.00 WIB",
          "category": "Radio",
          "title": "INTERVIEW RADIO",
          "venue": "Radio Cakra Krisna / Radio Joss FM Nganjuk",
          "note": "Live interview on-air bareng sutradara & pemain"
        },
        {
          "time": "15.00 – 17.00 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST",
          "venue": "Sam's Studio Nganjuk",
          "note": "Special Screening sesi sore bersama cast film (Wajib bertiket)"
        },
        {
          "time": "17.00 – 18.00 WIB",
          "category": "Mall & Meet",
          "title": "TEMU KONCO & MEET GREET",
          "venue": "Luwes Nganjuk",
          "note": "Temu konco, foto bersama cast, doorprize, dan booth voucher fisik.",
          "isVoucherExchange": true
        }
      ]
    },
    "cinemas": [
      {
        "name": "SAM'S STUDIO NGANJUK",
        "chain": "Indie",
        "studio": "Studio 1",
        "seats": 107,
        "remainingSeatsText": "±25 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Jl. Ahmad Yani No. 12, Nganjuk",
        "showTimes": [
          "15.00 WIB"
        ],
        "ticketUrl": "https://www.instagram.com/sams.studio/"
      }
    ]
  },
  {
    "slug": "mojokerto",
    "name": "Mojokerto",
    "province": "Jawa Timur",
    "dateStr": "31 Oktober 2026",
    "boothInfo": {
      "venue": "SUNRISE MALL MOJOKERTO",
      "floor": "Area Atrium Utama Sunrise Mall Mojokerto",
      "timeStr": "17.00 – 18.00 WIB",
      "directions": "Cari booth resmi PIYE TO KIH? di Atrium Sunrise Mall Mojokerto.",
      "exclusiveNotice": "Penukaran voucher fisik resmi berada di Sunrise Mall Mojokerto jam 17.00–18.00 WIB."
    },
    "rundown": {
      "date": "Sabtu, 31 Oktober 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi dilayani di Sunrise Mall Mojokerto jam 17.00–18.00 WIB.",
      "items": [
        {
          "time": "08.00 – 09.00 WIB",
          "category": "Sekolah",
          "title": "MAMPIR KE SEKOLAH",
          "venue": "SMKN 2 Mojokerto / SMKN 1 Mojokerto",
          "note": "Sapa pagi & seru-seruan bareng cast film",
          "isVoucherExchange": true
        },
        {
          "time": "11.00 – 12.00 WIB",
          "category": "Kampus",
          "title": "NGOBROL BARENG DI KAMPUS",
          "venue": "Universitas Islam Majapahit (UNIM Mojokerto)",
          "note": "Sharing session komedi & bedah cerita film",
          "isVoucherExchange": true
        },
        {
          "time": "13.00 – 14.00 WIB",
          "category": "Radio",
          "title": "INTERVIEW RADIO",
          "venue": "Radio R FM / Radio Maja FM Mojokerto",
          "note": "Live interview bareng sutradara & pemain"
        },
        {
          "time": "15.00 – 17.00 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST",
          "venue": "CGV Sunrise Mall Mojokerto",
          "note": "Special Screening sesi sore bersama cast (Wajib bertiket)"
        },
        {
          "time": "17.00 – 18.00 WIB",
          "category": "Mall & Meet",
          "title": "MEET & GREET MALL",
          "venue": "Sunrise Mall Mojokerto — Atrium Utama",
          "note": "Temu konco, foto bareng pemain, doorprize, dan booth voucher fisik.",
          "isVoucherExchange": true
        }
      ]
    },
    "cinemas": [
      {
        "name": "CGV SUNRISE MALL MOJOKERTO",
        "chain": "CGV",
        "studio": "Studio 3",
        "seats": 116,
        "remainingSeatsText": "±28 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Sunrise Mall Lt. 2, Jl. Benteng Pancasila No. 9",
        "showTimes": [
          "15.00 WIB"
        ],
        "ticketUrl": "https://www.cgv.id"
      }
    ]
  },
  {
    "slug": "gresik",
    "name": "Gresik",
    "province": "Jawa Timur",
    "dateStr": "1 November 2026",
    "boothInfo": {
      "venue": "GRESSMALL GRESIK",
      "floor": "Area Atrium Utama Gressmall Gresik",
      "timeStr": "17.00 – 18.00 WIB",
      "directions": "Cari booth resmi PIYE TO KIH? di Atrium Gressmall Gresik.",
      "exclusiveNotice": "Penukaran voucher fisik resmi berada di Atrium Gressmall jam 17.00–18.00 WIB."
    },
    "rundown": {
      "date": "Minggu, 1 November 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi berada di Atrium Gressmall jam 17.00–18.00 WIB.",
      "items": [
        {
          "time": "10.00 – 11.00 WIB",
          "category": "Radio",
          "title": "INTERVIEW RADIO",
          "venue": "Radio Suara Giri FM / Radio Suara Gresik",
          "note": "Live on-air & obrolan santai roadshow film"
        },
        {
          "time": "13.00 – 14.00 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST",
          "venue": "Gressmall XXI Gresik",
          "note": "Special Screening sesi siang bersama cast (Wajib bertiket)"
        },
        {
          "time": "17.00 – 18.00 WIB",
          "category": "Mall & Meet",
          "title": "MEET & GREET MALL",
          "venue": "Atrium Utama Gressmall Gresik",
          "note": "Temu konco, foto bareng pemain, doorprize menarik, dan booth voucher fisik.",
          "isVoucherExchange": true
        }
      ]
    },
    "cinemas": [
      {
        "name": "GRESSMALL XXI GRESIK",
        "chain": "XXI",
        "studio": "Studio 2",
        "seats": 165,
        "remainingSeatsText": "±35 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Gressmall Lt. 2, Jl. Sumatera No. 1-5, Gresik",
        "showTimes": [
          "13.00 WIB"
        ],
        "ticketUrl": "https://m.21cineplex.com/id/movies/16PTKH"
      }
    ]
  },
  {
    "slug": "surabaya",
    "name": "Surabaya",
    "province": "Jawa Timur",
    "dateStr": "2 November 2026",
    "boothInfo": {
      "venue": "ROYAL PLAZA SURABAYA",
      "floor": "Area Atrium Utama Royal Plaza Surabaya",
      "timeStr": "16.00 – 17.00 WIB",
      "directions": "Cari booth resmi PIYE TO KIH? di Atrium Royal Plaza Surabaya.",
      "exclusiveNotice": "Penukaran voucher fisik resmi berada di Royal Plaza Surabaya jam 16.00–17.00 WIB."
    },
    "rundown": {
      "date": "Senin, 2 November 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi berada di Royal Plaza Surabaya jam 16.00–17.00 WIB.",
      "items": [
        {
          "time": "08.00 – 09.00 WIB",
          "category": "Acara",
          "title": "TEMU KONCO MEDIA & KOMUNITAS",
          "venue": "Media & Komunitas Sinema Surabaya",
          "note": "Silaturahmi media pers Jawa Timur & komunitas film"
        },
        {
          "time": "10.00 – 11.00 WIB",
          "category": "Acara",
          "title": "PODCAST KHUSUS TV JATIM",
          "venue": "Studio TV Jatim Surabaya",
          "note": "Recording podcast bedah komedi & proses produksi film"
        },
        {
          "time": "13.00 – 14.00 WIB",
          "category": "Radio",
          "title": "INTERVIEW RADIO",
          "venue": "RRI Pro 2 FM Surabaya",
          "note": "Live interview radio bersama para cast film"
        },
        {
          "time": "14.30 – 15.10 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST",
          "venue": "Royal Plaza XXI Surabaya",
          "note": "Special Screening sesi siang bersama cast film (Wajib bertiket)"
        },
        {
          "time": "16.00 – 17.00 WIB",
          "category": "Mall & Meet",
          "title": "MEET & GREET MALL",
          "venue": "Atrium Royal Plaza Surabaya",
          "note": "Temu konco, foto bersama, bagi merchandise, dan booth voucher fisik.",
          "isVoucherExchange": true
        }
      ]
    },
    "cinemas": [
      {
        "name": "ROYAL PLAZA XXI SURABAYA",
        "chain": "XXI",
        "studio": "Studio 3",
        "seats": 162,
        "remainingSeatsText": "±40 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Royal Plaza Lt. 4, Jl. Ahmad Yani No. 16-18",
        "showTimes": [
          "14.30 WIB"
        ],
        "ticketUrl": "https://m.21cineplex.com/id/movies/16PTKH"
      }
    ]
  },
  {
    "slug": "sidoarjo",
    "name": "Sidoarjo",
    "province": "Jawa Timur",
    "dateStr": "3 November 2026",
    "boothInfo": {
      "venue": "SUNCITY MALL SIDOARJO",
      "floor": "Area Atrium Suncity Mall Sidoarjo",
      "timeStr": "15.00 – 16.00 WIB",
      "directions": "Cari booth resmi PIYE TO KIH? di Atrium Suncity Mall Sidoarjo dekat eskalator.",
      "exclusiveNotice": "Penukaran voucher fisik resmi berada di Suncity Mall Sidoarjo jam 15.00–16.00 WIB. Bioskop Ciplaz Sidoarjo XXI khusus Special Screening sesi sore."
    },
    "rundown": {
      "date": "Selasa, 3 November 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi bertempat di Suncity Mall Sidoarjo jam 15.00–16.00 WIB.",
      "items": [
        {
          "time": "06.00 – 09.00 WIB",
          "category": "Acara",
          "title": "SAPA WARGA CFD SIDOARJO",
          "venue": "Alun-Alun Sidoarjo",
          "note": "Sapa pagi warga Sidoarjo bareng para pemain film & bagi merchandise",
          "isVoucherExchange": true
        },
        {
          "time": "13.00 – 14.40 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST (SESI 1)",
          "venue": "Platinum Cineplex Suncity Mall Sidoarjo",
          "note": "Special Screening sesi siang bersama cast film (Wajib bertiket)"
        },
        {
          "time": "15.00 – 16.00 WIB",
          "category": "Mall & Meet",
          "title": "MEET & GREET MALL",
          "venue": "Atrium Suncity Mall Sidoarjo",
          "note": "Temu konco, foto bareng pemain, doorprize, dan booth voucher fisik.",
          "isVoucherExchange": true
        },
        {
          "time": "16.10 – 17.50 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST (SESI 2)",
          "venue": "Ciplaz Sidoarjo XXI",
          "note": "Special Screening sesi sore greeting ending cast (Wajib bertiket)"
        }
      ]
    },
    "cinemas": [
      {
        "name": "PLATINUM CINEPLEX SUNCITY MALL SIDOARJO",
        "chain": "Platinum",
        "studio": "Studio 2",
        "seats": 162,
        "remainingSeatsText": "±34 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Suncity Mall Lt. 3, Jl. Pahlawan No. 1",
        "showTimes": [
          "13.00 WIB"
        ],
        "ticketUrl": "https://platinumcineplex.co.id"
      },
      {
        "name": "CIPLAZ SIDOARJO XXI",
        "chain": "XXI",
        "studio": "Studio 2",
        "seats": 128,
        "remainingSeatsText": "±26 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Ciplaz Sidoarjo Lt. 2, Jl. Diponegoro No. 2",
        "showTimes": [
          "16.10 WIB"
        ],
        "ticketUrl": "https://m.21cineplex.com/id/movies/16PTKH"
      }
    ]
  },
  {
    "slug": "malang",
    "name": "Malang",
    "province": "Jawa Timur",
    "dateStr": "4 November 2026",
    "boothInfo": {
      "venue": "CYBER MALL MALANG",
      "floor": "Area Atrium Utama Cyber Mall Malang",
      "timeStr": "17.00 – 18.00 WIB",
      "directions": "Cari booth resmi PIYE TO KIH? di Atrium Cyber Mall Malang lantai dasar.",
      "exclusiveNotice": "Penukaran voucher fisik resmi berada di Cyber Mall Malang jam 17.00–18.00 WIB."
    },
    "rundown": {
      "date": "Rabu, 4 November 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi berada di Cyber Mall Malang jam 17.00–18.00 WIB.",
      "items": [
        {
          "time": "08.00 – 09.00 WIB",
          "category": "Sekolah",
          "title": "MAMPIR KE SEKOLAH",
          "venue": "SMKN 12 Malang",
          "note": "Sapa pagi & seru-seruan bareng siswa SMK",
          "isVoucherExchange": true
        },
        {
          "time": "11.00 – 12.00 WIB",
          "category": "Kampus",
          "title": "NGOBROL BARENG DI KAMPUS",
          "venue": "Universitas Brawijaya / Univ. Muhammadiyah Malang",
          "note": "Sharing session perfilman komedi bareng mahasiswa",
          "isVoucherExchange": true
        },
        {
          "time": "13.00 – 14.00 WIB",
          "category": "Radio",
          "title": "INTERVIEW RADIO",
          "venue": "RRI Pro 2 FM / Elfara FM Malang",
          "note": "Live on-air & seru-seruan bareng cast film"
        },
        {
          "time": "15.50 – 16.30 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST",
          "venue": "Dieng XXI Malang",
          "note": "Special Screening sesi sore bersama cast film (Wajib bertiket)"
        },
        {
          "time": "17.00 – 18.00 WIB",
          "category": "Mall & Meet",
          "title": "MEET & GREET MALL",
          "venue": "Cyber Mall Malang — Atrium Utama",
          "note": "Temu konco, foto bareng pemain, doorprize, dan booth voucher fisik.",
          "isVoucherExchange": true
        }
      ]
    },
    "cinemas": [
      {
        "name": "DIENG XXI MALANG",
        "chain": "XXI",
        "studio": "Studio 3",
        "seats": 144,
        "remainingSeatsText": "±32 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Cyber Mall Lt. 3, Jl. Raya Langsep No. 2",
        "showTimes": [
          "15.50 WIB"
        ],
        "ticketUrl": "https://m.21cineplex.com/id/movies/16PTKH"
      },
      {
        "name": "CINÉPOLIS MALANG TOWN SQUARE",
        "chain": "Cinepolis",
        "studio": "Studio 2",
        "seats": 126,
        "remainingSeatsText": "±25 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Malang Town Square Lt. 3, Jl. Veteran No. 2",
        "showTimes": [
          "18.00 WIB"
        ],
        "ticketUrl": "https://cinepolis.co.id"
      }
    ]
  },
  {
    "slug": "kediri",
    "name": "Kediri",
    "province": "Jawa Timur",
    "dateStr": "6 November 2026",
    "boothInfo": {
      "venue": "TAMAN BRANTAS & CIPLAZ KEDIRI",
      "floor": "Area Booth Resmi Roadshow Kediri",
      "timeStr": "15.00 – 17.00 WIB",
      "directions": "Cari booth oranye resmi PIYE TO KIH? di area Taman Brantas & Ciplaz Kediri.",
      "exclusiveNotice": "Penukaran voucher fisik resmi berada di booth roadshow Kediri jam 15.00–17.00 WIB. Pukul 19.00 WIB adalah puncak Home Premiere Kediri (All Studio)."
    },
    "rundown": {
      "date": "Jumat, 6 November 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi bertempat di area Taman Brantas / Kediri Mall jam 15.00–17.00 WIB.",
      "items": [
        {
          "time": "08.00 – 10.00 WIB",
          "category": "Acara",
          "title": "PAMITAN ORANG TUA (DOKUMENTER)",
          "venue": "Kediri — Rumah Keluarga Cast",
          "note": "Sesi dokumenter keluarga & doa bersama jelang premiere akbar"
        },
        {
          "time": "10.00 – 11.00 WIB",
          "category": "Kampus",
          "title": "NGOBROL BARENG DI KAMPUS",
          "venue": "Universitas Dian Nuswantoro (Udinus Kediri)",
          "note": "Sharing session bedah cerita film & temu konco kampus",
          "isVoucherExchange": true
        },
        {
          "time": "13.00 – 14.00 WIB",
          "category": "Acara",
          "title": "SARASEHAN BARENG WALIKOTA KEDIRI",
          "venue": "Balaikota Kediri",
          "note": "Silaturahmi kebudayaan & apresiasi film lokal bareng Mbak Walikota"
        },
        {
          "time": "15.00 – 17.00 WIB",
          "category": "Mall & Meet",
          "title": "TEMU KONCO AKBAR KEDIRI",
          "venue": "Taman Brantas / Kediri Mall",
          "note": "Pesta temu konco se-Kediri Raya, doorprize, games, dan booth voucher fisik.",
          "isVoucherExchange": true
        },
        {
          "time": "19.00 – 21.00 WIB",
          "category": "Screening",
          "title": "HOME PREMIERE KEDIRI (ALL STUDIO)",
          "venue": "Ciplaz Kediri XXI (All Studio Show 4)",
          "note": "Penayangan akbar premiere Kediri bersama seluruh cast & kru (Wajib bertiket)"
        }
      ]
    },
    "cinemas": [
      {
        "name": "CIPLAZ KEDIRI XXI",
        "chain": "XXI",
        "studio": "Studio 1 All Studio",
        "seats": 128,
        "remainingSeatsText": "±28 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Ciplaz Kediri Lt. 2, Jl. Hayam Wuruk No. 46",
        "showTimes": [
          "19.00 WIB"
        ],
        "ticketUrl": "https://m.21cineplex.com/id/movies/16PTKH"
      }
    ]
  },
  {
    "slug": "blitar",
    "name": "Blitar",
    "province": "Jawa Timur",
    "dateStr": "8 November 2026",
    "boothInfo": {
      "venue": "BLITAR SQUARE",
      "floor": "Area Atrium Utama Blitar Square",
      "timeStr": "15.00 – 16.00 WIB",
      "directions": "Cari booth resmi PIYE TO KIH? di Atrium Blitar Square lantai dasar.",
      "exclusiveNotice": "Penukaran voucher fisik resmi berada di Blitar Square jam 15.00–16.00 WIB."
    },
    "rundown": {
      "date": "Minggu, 8 November 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi berada di Blitar Square jam 15.00–16.00 WIB.",
      "items": [
        {
          "time": "08.00 – 09.00 WIB",
          "category": "Sekolah",
          "title": "MAMPIR KE SEKOLAH",
          "venue": "SMK Negeri 1 Kota Blitar",
          "note": "Sapa pagi & kuis receh bareng siswa SMK",
          "isVoucherExchange": true
        },
        {
          "time": "10.00 – 11.00 WIB",
          "category": "Kampus",
          "title": "NGOBROL BARENG DI KAMPUS",
          "venue": "Universitas Islam Balitar (UNISBA) / AKN Putra Sang Fajar Blitar",
          "note": "Sharing session perfilman bersama cast film",
          "isVoucherExchange": true
        },
        {
          "time": "12.00 – 13.00 WIB",
          "category": "Radio",
          "title": "INTERVIEW RADIO",
          "venue": "LPPL Radio Mahardhika FM / Radio Patria Blitar",
          "note": "Live interview on-air bareng cast"
        },
        {
          "time": "13.00 – 15.00 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST",
          "venue": "CGV Blitar Square",
          "note": "Special Screening sesi siang bersama cast film (Wajib bertiket)"
        },
        {
          "time": "15.00 – 16.00 WIB",
          "category": "Mall & Meet",
          "title": "MEET & GREET MALL",
          "venue": "Blitar Square — Atrium Utama",
          "note": "Temu konco, foto bareng pemain, doorprize, dan booth voucher fisik.",
          "isVoucherExchange": true
        }
      ]
    },
    "cinemas": [
      {
        "name": "CGV BLITAR SQUARE",
        "chain": "CGV",
        "studio": "Studio 5",
        "seats": 162,
        "remainingSeatsText": "±36 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Blitar Square Lt. 3, Jl. Merdeka No. 6-8",
        "showTimes": [
          "13.00 WIB"
        ],
        "ticketUrl": "https://www.cgv.id"
      }
    ]
  },
  {
    "slug": "tulungagung",
    "name": "Tulungagung",
    "province": "Jawa Timur",
    "dateStr": "8 November 2026",
    "boothInfo": {
      "venue": "AREA ROADSHOW TULUNGAGUNG",
      "floor": "Area Panggung / Booth Acara Roadshow Tulungagung",
      "timeStr": "17.00 – 19.00 WIB",
      "directions": "Cari booth resmi oranye PIYE TO KIH? di area panggung acara roadshow Tulungagung.",
      "exclusiveNotice": "Penukaran voucher fisik resmi berada di booth acara roadshow Tulungagung jam 17.00–19.00 WIB. DILARANG menukar di kasir bioskop."
    },
    "rundown": {
      "date": "Minggu, 8 November 2026",
      "voucherExchangeInfo": "Penukaran voucher fisik resmi bertempat di Golden Theatre Tulungagung jam 17.00–19.00 WIB.",
      "items": [
        {
          "time": "17.00 – 19.00 WIB",
          "category": "Mall & Meet",
          "title": "TEMU KONCO & MEET GREET",
          "venue": "Lobi Bioskop Golden Theatre Tulungagung",
          "note": "Temu konco, foto bersama cast, bagi doorprize merchandise, dan booth voucher fisik.",
          "isVoucherExchange": true
        },
        {
          "time": "18.00 – 20.00 WIB",
          "category": "Screening",
          "title": "NONTON DULUAN + GREETING CAST",
          "venue": "Golden Theatre Tulungagung",
          "note": "Special Screening penayangan penutup roadshow bersama cast film (Wajib bertiket)"
        }
      ]
    },
    "cinemas": [
      {
        "name": "GOLDEN THEATRE TULUNGAGUNG",
        "chain": "Indie",
        "studio": "Studio 2",
        "seats": 202,
        "remainingSeatsText": "±45 kursi tersisa",
        "doorNote": "Pintu teater dibuka 15 mnt sebelumnya",
        "address": "Jl. Ahmad Yani Timur No. 66, Tulungagung",
        "showTimes": [
          "18.00 WIB"
        ],
        "ticketUrl": "https://www.instagram.com/goldentheatretulungagung/"
      }
    ]
  }
];

/**
 * Membersihkan nama tempat/mall agar TIDAK menyebut nama bioskop (XXI, Cinepolis, CGV, Platinum Cineplex, NSC, dll.)
 * melainkan nama mall / tempat acaranya saja, sesuai aturan ketat agar penonton tidak salah datang ke kasir bioskop.
 */
export function cleanVenueToMallName(venueName?: string): string {
  if (!venueName) return '';
  let cleaned = venueName
    // Hapus kata bioskop & jaringan bioskop
    .replace(/Cinema\s*XXI/gi, 'Mall')
    .replace(/\bXXI\b/gi, 'Mall')
    .replace(/Cinépolis|Cinepolis/gi, '')
    .replace(/\bCGV\b/gi, '')
    .replace(/Platinum\s*Cineplex/gi, '')
    .replace(/\bPlatinum\b/gi, '')
    .replace(/New\s*Star\s*Cineplex|NSC/gi, '')
    .replace(/\bCinema\b/gi, '')
    .replace(/\bBioskop\b/gi, '')
    .replace(/\bCineplex\b/gi, '')
    .replace(/\bMall\s+Mall\b/gi, 'Mall')
    .replace(/\s+/g, ' ')
    .trim();

  // Standarisasi nama tempat / mall resmi
  cleaned = cleaned
    .replace(/^The Park Mall\b/i, 'The Park Mall')
    .replace(/^The Park Semarang/i, 'The Park Mall Semarang')
    .replace(/Java Supermall/i, 'Java Mall Semarang')
    .replace(/^Java Mall/i, 'Java Mall Semarang')
    .replace(/^Solo Paragon/i, 'Solo Paragon Mall')
    .replace(/^Pakuwon Solo Baru/i, 'Pakuwon Mall Solo Baru')
    .replace(/^Plaza Ambarrukmo/i, 'Plaza Ambarrukmo')
    .replace(/^Jogja City Mall/i, 'Jogja City Mall')
    .replace(/^Artos/i, 'Artos Mall Magelang')
    .replace(/^The Aloon\s*-\s*Aloon/i, 'Aloon - Aloon Magelang')
    .replace(/^Plaza Atrium Sragen/i, 'Plaza Atrium Sragen')
    .replace(/^Lawu Plaza/i, 'Lawu Plaza Madiun')
    .replace(/^Suncity Madiun/i, 'Suncity Mall Madiun')
    .replace(/^Ponorogo City Center/i, 'Ponorogo City Center Mall')
    .replace(/^Sunrise Mall/i, 'Sunrise Mall Mojokerto')
    .replace(/^Gressmall/i, 'Gressmall Gresik')
    .replace(/^Pakuwon Mall/i, 'Pakuwon Mall Surabaya')
    .replace(/^Royal Plaza/i, 'Royal Plaza Surabaya')
    .replace(/^Suncity Mall/i, 'Suncity Mall Sidoarjo')
    .replace(/^Ciplaz Sidoarjo/i, 'Ciplaz Sidoarjo')
    .replace(/^Dieng Mall|Dieng Malang/i, 'Cyber Mall Malang')
    .replace(/^Ciplaz Kediri/i, 'Ciplaz Kediri')
    .replace(/^Kediri Mall/i, 'Kediri Mall')
    .replace(/^Blitar Square/i, 'Blitar Square Mall')
    .replace(/\bMall\s+Mall\b/gi, 'Mall')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
}

export const CITY_ALIASES: Record<string, string> = {
  // Yogyakarta / Jogja & Venues
  'jogja': 'jogja',
  'yogyakarta': 'jogja',
  'yogya': 'jogja',
  'yk': 'jogja',
  'amplaz': 'jogja',
  'ambarrukmo': 'jogja',
  'plaza ambarrukmo': 'jogja',
  'jcm': 'jogja',
  'jogja city mall': 'jogja',
  'pakuwon jogja': 'jogja',
  'hartono': 'jogja',

  // Solo / Surakarta & Venues
  'solo': 'solo',
  'surakarta': 'solo',
  'paragon solo': 'solo',
  'solo paragon': 'solo',
  'the park solo': 'solo',
  'the park solo baru': 'solo',
  'pakuwon solo': 'solo',
  'pakuwon mall solo': 'solo',
  'platinum solo': 'solo',

  // Semarang & Venues
  'semarang': 'semarang',
  'smg': 'semarang',
  'the park semarang': 'semarang',
  'the park smg': 'semarang',
  'java mall': 'semarang',
  'cinepolis java mall': 'semarang',
  'paragon semarang': 'semarang',
  'pollux paragon': 'semarang',
  'citraland semarang': 'semarang',

  // Magelang & Venues
  'magelang': 'magelang',
  'mgl': 'magelang',
  'artos': 'magelang',
  'artos mall': 'magelang',
  'armada town square': 'magelang',
  'the aloon aloon': 'magelang',

  // Purwokerto & Venues
  'purwokerto': 'purwokerto',
  'pwt': 'purwokerto',
  'rita supermall': 'purwokerto',
  'rajawali': 'purwokerto',
  'rajawali cinema': 'purwokerto',

  // Tegal & Venues
  'tegal': 'tegal',
  'pacific mall': 'tegal',
  'transmart tegal': 'tegal',

  // Pekalongan & Venues
  'pekalongan': 'pekalongan',
  'pekalongan square': 'pekalongan',
  'transmart pekalongan': 'pekalongan',

  // Salatiga & Venues
  'salatiga': 'salatiga',
  'mall salatiga': 'salatiga',

  // Kudus & Venues
  'kudus': 'kudus',
  'kudus extension': 'kudus',
  'kudus extension mall': 'kudus',

  // Cilacap & Venues
  'cilacap': 'cilacap',
  'sami jaya': 'cilacap',
  'dakota cilacap': 'cilacap',

  // Cirebon & Venues
  'cirebon': 'cirebon',
  'csb': 'cirebon',
  'csb mall': 'cirebon',
  'grage mall': 'cirebon',

  // Tasikmalaya & Venues
  'tasik': 'tasikmalaya',
  'tasikmalaya': 'tasikmalaya',
  'asia plaza': 'tasikmalaya',
  'transmart tasik': 'tasikmalaya',

  // Surabaya & Venues
  'surabaya': 'surabaya',
  'sby': 'surabaya',
  'tunjungan': 'surabaya',
  'tunjungan plaza': 'surabaya',
  'royal plaza': 'surabaya',
  'pakuwon surabaya': 'surabaya',
  'ciputra world': 'surabaya',

  // Malang & Batu & Venues
  'malang': 'malang',
  'mlg': 'malang',
  'batu': 'malang',
  'kotabatu': 'malang',
  'matos': 'malang',
  'malang town square': 'malang',
  'dieng': 'malang',
  'dieng xxi': 'malang',
  'cyber mall': 'malang',
  'araya': 'malang',

  // Sidoarjo & Venues
  'sidoarjo': 'sidoarjo',
  'sda': 'sidoarjo',
  'suncity': 'sidoarjo',
  'suncity mall': 'sidoarjo',
  'ciplaz sidoarjo': 'sidoarjo',

  // Jember & Venues
  'jember': 'jember',
  'jbr': 'jember',
  'lippo jember': 'jember',
  'lippo plaza jember': 'jember',
  'roxo': 'jember',

  // Kediri & Venues
  'kediri': 'kediri',
  'kdr': 'kediri',
  'ciplaz kediri': 'kediri',
  'golden theater': 'kediri',
  'kediri mall': 'kediri',

  // Blitar & Tulungagung
  'blitar': 'blitar',
  'blitar square': 'blitar',
  'tulungagung': 'tulungagung',
  'golden tulungagung': 'tulungagung',

  // Madiun, Gresik, Sragen, Ponorogo, Ngawi, Nganjuk, Mojokerto
  'madiun': 'madiun',
  'plaza madiun': 'madiun',
  'lawu plaza': 'madiun',
  'gresik': 'gresik',
  'icon mall': 'gresik',
  'gresik mall': 'gresik',
  'sragen': 'sragen',
  'ponorogo': 'ponorogo',
  'pcc': 'ponorogo',
  'ponorogo city center': 'ponorogo',
  'ngawi': 'ngawi',
  'nganjuk': 'nganjuk',
  'mojokerto': 'mojokerto',
};

export function getCityBySlug(slug: string): CityData | undefined {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  return CITIES_DATA.find(c => c.slug.toLowerCase().replace(/[^a-z0-9]/g, "") === normalized);
}

export function getCityByNameOrSlug(query?: string): CityData | undefined {
  if (!query) return undefined;
  const rawLower = query.toLowerCase().trim();
  if (['all', 'list', 'semua', 'daftar', 'semuanya', 'kota', 'roadshow', 'jadwal'].includes(rawLower)) return undefined;
  const q = rawLower.replace(/[^a-z0-9]/g, "");
  if (!q || q.length < 3) return undefined;

  // 1. Direct Alias Check
  for (const [alias, targetSlug] of Object.entries(CITY_ALIASES)) {
    const aliasNorm = alias.replace(/[^a-z0-9]/g, "");
    if (q === aliasNorm || (aliasNorm.length >= 4 && (rawLower.includes(alias) || q.includes(aliasNorm)))) {
      const found = CITIES_DATA.find(c => c.slug === targetSlug);
      if (found) return found;
    }
  }

  // 2. Exact or substring match in CITIES_DATA
  const directMatch = CITIES_DATA.find(c => {
    const slugNorm = c.slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    const nameNorm = c.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    return (
      slugNorm === q ||
      nameNorm === q ||
      (q.length >= 4 && (slugNorm.includes(q) || nameNorm.includes(q))) ||
      (slugNorm.length >= 4 && q.includes(slugNorm)) ||
      (nameNorm.length >= 4 && q.includes(nameNorm))
    );
  });
  if (directMatch) return directMatch;

  // 3. Search inside each city's cinemas name and address (requires at least 5 letters and exact word boundary)
  if (rawLower.length < 5) return undefined;
  return CITIES_DATA.find(c => {
    return c.cinemas?.some(cin => {
      const cinName = cin.name.toLowerCase();
      const cinAddr = (cin.address || '').toLowerCase();
      return cinName.includes(rawLower) || (cinAddr.length >= 5 && cinAddr.includes(rawLower));
    });
  });
}

/**
 * Parse Indonesian date format like "22 Oktober 2026"
 */
export function parseIndonesianDateStr(dateStr: string): Date | null {
  const months: Record<string, number> = {
    januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5,
    juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11
  };
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const month = months[parts[1].toLowerCase()];
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      // 23:59:59 WIB is 16:59:59 UTC
      return new Date(Date.UTC(year, month, day, 16, 59, 59));
    }
  }
  return null;
}

/**
 * Check if a roadshow city date has already passed
 */
export function isCityRoadshowExpired(
  dateStr: string,
  options?: {
    cityName?: string;
    manualExpiredCities?: string[];
    currentTimeMs?: number;
  }
): boolean {
  if (options?.cityName && options?.manualExpiredCities && options.manualExpiredCities.length > 0) {
    const norm = options.cityName.toLowerCase().trim();
    if (options.manualExpiredCities.some(c => c.toLowerCase().trim() === norm)) {
      return true;
    }
  }
  const date = parseIndonesianDateStr(dateStr);
  if (!date) return false;
  const now = options?.currentTimeMs ?? Date.now();
  return now > date.getTime();
}

/**
 * Merge base city data with admin roadshow overrides
 */
export function applyRoadshowOverride(baseCity: CityData, override?: Partial<CityData>): CityData {
  if (!override) return baseCity;
  return {
    ...baseCity,
    ...override,
    cinemas: Array.isArray(override.cinemas) ? override.cinemas : baseCity.cinemas,
    boothInfo: override.boothInfo ? { ...baseCity.boothInfo, ...override.boothInfo } : baseCity.boothInfo,
    rundown: override.rundown
      ? {
          ...baseCity.rundown,
          ...override.rundown,
          items: Array.isArray(override.rundown.items)
            ? override.rundown.items
            : (baseCity.rundown?.items || []),
        }
      : baseCity.rundown,
  };
}

/**
 * Get all cities with roadshow overrides applied
 */
export function getEffectiveCities(overrides?: Record<string, Partial<CityData>>): CityData[] {
  if (!overrides || Object.keys(overrides).length === 0) return CITIES_DATA;
  return CITIES_DATA.map(c => applyRoadshowOverride(c, overrides[c.slug]));
}

/**
 * Get a single city with roadshow overrides applied
 */
export function getEffectiveCity(
  query?: string,
  overrides?: Record<string, Partial<CityData>>
): CityData | undefined {
  if (!query) return undefined;
  const baseCity = getCityByNameOrSlug(query);
  if (!baseCity) return undefined;
  return applyRoadshowOverride(baseCity, overrides?.[baseCity.slug]);
}

export function getCityCinemaTicketLinks(
  query?: string,
  overrides?: Record<string, Partial<CityData>>,
  cityLinkOverrides?: Record<string, string>
): Array<{
  cinemaName: string;
  chain: string;
  showTimes: string[];
  ticketUrl: string;
}> {
  if (!query) return [];
  const city = getEffectiveCity(query, overrides);
  if (!city || !city.cinemas) return [];

  const customLinks = cityLinkOverrides || {};
  const citySlug = city.slug; // e.g. "jogja"
  const altSlug = citySlug === 'jogja' ? 'yogyakarta' : citySlug === 'yogyakarta' ? 'jogja' : undefined;

  const legacyDirectCityLink =
    customLinks[citySlug] ||
    (altSlug && customLinks[altSlug]) ||
    '';

  return city.cinemas
    .map((c, idx) => {
      const primaryKey = `${citySlug}_${idx}`;
      const altKey = altSlug ? `${altSlug}_${idx}` : undefined;

      // Determine default ticket URL by chain if c.ticketUrl is empty or generic homepage
      let defaultChainUrl = c.ticketUrl;
      const lowerUrl = (c.ticketUrl || '').toLowerCase();
      const isGeneric = !lowerUrl || lowerUrl === 'https://m.21cineplex.com' || lowerUrl === 'https://m.21cineplex.com/' || lowerUrl.endsWith('.co.id') || lowerUrl.endsWith('.id');

      if (isGeneric) {
        if (c.chain === 'XXI') {
          defaultChainUrl = 'https://m.21cineplex.com/id/movies/16PTKH';
        } else if (c.chain === 'Cinepolis') {
          defaultChainUrl = 'https://www.cinepolis.co.id/movies/piye-to-kih/b372aa5c-12a5-4440-85bf-e8a91fe1c57e/#';
        } else if (c.chain === 'Platinum') {
          defaultChainUrl = 'https://www.platinumcineplex.co.id/now-showing-booking/482/1/';
        } else {
          defaultChainUrl = 'https://m.21cineplex.com/id/movies/16PTKH';
        }
      }

      const targetUrl =
        customLinks[primaryKey] ||
        (altKey && customLinks[altKey]) ||
        legacyDirectCityLink ||
        defaultChainUrl;

      return {
        cinemaName: c.name,
        chain: c.chain,
        showTimes: c.showTimes || [],
        ticketUrl: targetUrl,
      };
    })
    .filter(c => Boolean(c.ticketUrl && c.ticketUrl.trim().length > 0));
}


