/**
 * PIYE TO KIH? THE MOVIE — OFFICIAL BOT KNOWLEDGE BASE & FACTS ENGINE
 * Sumber Data:
 * 1. PIYE_TO_KIH_Wahnotif_AI_Bot_Training_Knowledge_Base_v1_0.docx
 * 2. PIYE_TO_KIH_Roadshow_Flyer_Template_Scripts_v1_1_Mukidi_Dara.docx
 * 3. Master Landing Page Database & Roster Jadwal 17 Kota
 */

export interface RoadshowStopDetails {
  stopNumber: number;
  slug: string;
  cityName: string;
  dateStr: string;
  leadSpeaker: string;
  rosterActual: string[];
  blockingNote: string;
  openingLine: {
    mukidi?: string;
    dara?: string;
    gendut?: string;
    penyok?: string;
    bunga?: string;
  };
  endingCtaLine: {
    mukidi?: string;
    dara?: string;
    gendut?: string;
    penyok?: string;
    bunga?: string;
  };
  scheduleItems: Array<{
    time: string;
    activity: string;
    venue: string;
    status: 'LOCK' | 'Konfirmasi' | 'working' | 'DEALING' | 'CANCEL' | 'Soft Lock';
    type: 'Sekolah' | 'Kampus' | 'Radio' | 'Mall' | 'Bioskop' | 'Special Event';
    isNontonDuluan?: boolean;
    isVoucherExchange?: boolean;
  }>;
  boothMall?: {
    venue: string;
    floor: string;
    time: string;
  };
  cinemas: string[];
  notes?: string;
}

export const MASTER_ROADSHOW_STOPS: Record<string, RoadshowStopDetails> = {
  semarang: {
    stopNumber: 1,
    slug: 'semarang',
    cityName: 'Semarang',
    dateStr: '22 Oktober 2026',
    leadSpeaker: 'Mukidi + Dara Sarasvati',
    rosterActual: [
      'Mukidi (Heri Chandra)',
      'Gendut (Sutrisno Agung)',
      'Penyok (Eko Dunung)',
      'Pak No (Wiyono)',
      'Mintul (Rizka Oktavia)',
      'Dara Sarasvati (Sukma)',
      'Gabriella Desta (Bunga)',
      'Ibu Gundul'
    ],
    blockingNote: 'Mukidi dan Dara Sarasvati berada di depan/tengah. Cast lain yang hadir berdiri di belakang/samping.',
    openingLine: {
      mukidi: 'SEMARANG, KITA BAKAL DATANG!',
      dara: 'Siap ketemu dan seru-seruan bareng kita?'
    },
    endingCtaLine: {
      mukidi: 'Semarang, ketemu kita ya!',
      dara: 'Jadwal lengkap, lokasi kegiatan, dan info Nonton Duluan, langsung klik link di bio!'
    },
    boothMall: {
      venue: 'The Park Mall Semarang',
      floor: 'Lantai 2 (Area Atrium Depan Eskalator The Park Mall)',
      time: '16.00 – 17.00 WIB'
    },
    scheduleItems: [
      { time: '08.00 - 09.00 WIB', activity: 'Mampir ke Sekolah', venue: 'SMA Negeri 15 Semarang', status: 'LOCK', type: 'Sekolah' },
      { time: '10.00 - 12.00 WIB', activity: 'Ngobrol Bareng Kampus', venue: 'UNNES / Auditorium Prof. Wuryanto', status: 'LOCK', type: 'Kampus' },
      { time: '14.00 - 15.00 WIB', activity: 'Live Interview On-Air', venue: 'Jateng Radio', status: 'LOCK', type: 'Radio' },
      { time: '15.30 WIB', activity: 'Nonton Duluan & Greeting Ending', venue: 'The Park XXI Semarang', status: 'Konfirmasi', type: 'Bioskop', isNontonDuluan: true },
      { time: '16.00 - 17.00 WIB', activity: 'Meet & Greet Mall & Penukaran Voucher Fisik', venue: 'The Park Mall Semarang (2nd Floor)', status: 'LOCK', type: 'Mall', isVoucherExchange: true },
      { time: '19.00 - 20.40 WIB', activity: 'Nonton Duluan & Greeting Ending', venue: 'Java Mall Cinepolis', status: 'Konfirmasi', type: 'Bioskop', isNontonDuluan: true }
    ],
    cinemas: ['The Park XXI', 'Cinepolis Java Mall']
  },

  yogyakarta: {
    stopNumber: 2,
    slug: 'yogyakarta',
    cityName: 'Yogyakarta',
    dateStr: '23 Oktober 2026',
    leadSpeaker: 'Mukidi + Dara Sarasvati',
    rosterActual: [
      'Mukidi (Heri Chandra)',
      'Pak No (Wiyono)',
      'Dara Sarasvati (Sukma)',
      'Gabriella Desta (Bunga)',
      'Marwoto (Pak Gino)',
      'Ibu Gundul'
    ],
    blockingNote: 'Mukidi dan Dara Sarasvati di depan/tengah; cast lain supporting visual.',
    openingLine: {
      mukidi: 'JOGJA, KITA MAU KETEMU KALIAN!',
      dara: 'Siap seru-seruan bareng PIYE TO KIH?'
    },
    endingCtaLine: {
      mukidi: 'Jogja, sampai ketemu!',
      dara: 'Cek jadwal lengkap, lokasi kegiatan, dan Nonton Duluan lewat link di bio!'
    },
    boothMall: {
      venue: 'Plaza Ambarrukmo (Ambarrukmo Plaza)',
      floor: 'Ground Floor (GF)',
      time: '17.00 – 18.00 WIB'
    },
    scheduleItems: [
      { time: '10.00 - 11.00 WIB', activity: 'Live Talkshow Radio', venue: 'RRI Pro 2 Yogyakarta', status: 'LOCK', type: 'Radio' },
      { time: '13.00 - 15.00 WIB', activity: 'Campus Roadshow & Sharing', venue: 'AMIKOM Yogyakarta', status: 'LOCK', type: 'Kampus' },
      { time: '15.45 - 16.35 WIB', activity: 'Nonton Duluan & Greeting Ending', venue: 'Ambarrukmo XXI', status: 'Konfirmasi', type: 'Bioskop', isNontonDuluan: true },
      { time: '17.00 - 18.00 WIB', activity: 'Meet & Greet Mall & Penukaran Voucher Fisik', venue: 'Plaza Ambarrukmo (Ground Floor)', status: 'LOCK', type: 'Mall', isVoucherExchange: true },
      { time: '18.30 - 19.00 WIB', activity: 'Greeting Ending Penonton', venue: 'Jogja City XXI', status: 'LOCK', type: 'Bioskop', isNontonDuluan: true }
    ],
    cinemas: ['Ambarrukmo XXI', 'Jogja City XXI', 'CGV Pakuwon Mall Jogja']
  },

  magelang: {
    stopNumber: 3,
    slug: 'magelang',
    cityName: 'Magelang',
    dateStr: '24 Oktober 2026',
    leadSpeaker: 'Mukidi + Dara Sarasvati',
    rosterActual: [
      'Mukidi (Heri Chandra)',
      'Pak No (Wiyono)',
      'Dara Sarasvati (Sukma)',
      'Gabriella Desta (Bunga)',
      'Ibu Gundul'
    ],
    blockingNote: 'Mukidi dan Dara Sarasvati front-center.',
    openingLine: {
      mukidi: 'MAGELANG, KITA DATANG!',
      dara: 'Dan kamu bisa ketemu kita langsung di kotamu!'
    },
    endingCtaLine: {
      mukidi: 'Magelang, sampai ketemu!',
      dara: 'Jadwal lengkap, lokasi kegiatan, dan Nonton Duluan bisa langsung dicek lewat link di bio!'
    },
    boothMall: {
      venue: 'Armada Town Square (Artos Mall) Magelang',
      floor: 'Atrium Mall Depan Bioskop Platinum',
      time: '16.00 – 17.00 WIB'
    },
    scheduleItems: [
      { time: '13.00 - 15.00 WIB', activity: 'Special Screening Nonton Duluan Bareng Cast', venue: 'Platinum Cineplex Artos Mall', status: 'LOCK', type: 'Bioskop', isNontonDuluan: true },
      { time: '16.00 - 17.00 WIB', activity: 'Meet & Greet & Booth Penukaran Voucher', venue: 'Atrium Armada Town Square / Artos Mall', status: 'working', type: 'Mall', isVoucherExchange: true },
      { time: '18.00 - 18.30 WIB', activity: 'Greeting Ending Cast', venue: 'The Aloon-Aloon XXI Magelang', status: 'LOCK', type: 'Bioskop' }
    ],
    cinemas: ['Platinum Cineplex Artos Mall', 'The Aloon-Aloon XXI']
  },

  solo: {
    stopNumber: 4,
    slug: 'solo',
    cityName: 'Solo (Surakarta)',
    dateStr: '25 Oktober 2026',
    leadSpeaker: 'Mukidi + Gendut + Penyok',
    rosterActual: [
      'Mukidi (Heri Chandra)',
      'Gendut (Sutrisno Agung)',
      'Penyok (Eko Dunung)',
      'Mintul (Rizka Oktavia)',
      'Gabriella Desta (Bunga)',
      'Ibu Gundul'
    ],
    blockingNote: 'Trio WOKO (Mukidi, Gendut, Penyok) di depan memimpin sapaan.',
    openingLine: {
      mukidi: 'SOLO, KALI INI KITA KETEMU LANGSUNG!',
      gendut: 'Siap ketemu kita?',
      penyok: 'Sampai ketemu!'
    },
    endingCtaLine: {
      mukidi: 'Solo, sampai ketemu!',
      gendut: 'Klik link di bio buat cek jadwal lengkap dan Nonton Duluan!'
    },
    boothMall: {
      venue: 'Solo Paragon Mall',
      floor: 'Stage Food Factory',
      time: '16.00 – 17.00 WIB'
    },
    scheduleItems: [
      { time: '06.00 - 09.00 WIB', activity: 'Seru-seruan Bareng Warga di CFD', venue: 'Car Free Day Jl. Slamet Riyadi', status: 'working', type: 'Special Event' },
      { time: '11.00 - 12.00 WIB', activity: 'Interview Radio', venue: 'RRI Solo', status: 'working', type: 'Radio' },
      { time: '13.15 - 14.45 WIB', activity: 'Greeting Ending & Nonton Duluan', venue: 'Solo Paragon XXI', status: 'Konfirmasi', type: 'Bioskop', isNontonDuluan: true },
      { time: '16.00 - 17.00 WIB', activity: 'Meet & Greet Mall & Penukaran Voucher Fisik', venue: 'Stage Food Factory Solo Paragon Mall', status: 'LOCK', type: 'Mall', isVoucherExchange: true },
      { time: '19.00 - 20.40 WIB', activity: 'Special Screening & Nonton Duluan Sesi Malam', venue: 'Platinum Cineplex Pakuwon Mall Solo Baru', status: 'LOCK', type: 'Bioskop', isNontonDuluan: true }
    ],
    cinemas: ['Solo Paragon XXI', 'Platinum Pakuwon Mall Solo Baru', 'The Park Solo XXI']
  },

  sragen: {
    stopNumber: 5,
    slug: 'sragen',
    cityName: 'Sragen',
    dateStr: '26 Oktober 2026',
    leadSpeaker: 'Mukidi + Gendut + Penyok',
    rosterActual: ['Mukidi (Heri Chandra)', 'Penyok (Eko Dunung)', 'Gendut (Sutrisno Agung)', 'Gabriella Desta (Bunga)'],
    blockingNote: 'Trio Mukidi, Gendut, Penyok memimpin sapaan.',
    openingLine: {
      mukidi: 'SRAGEN, SIAP-SIAP! KITA BAKAL DATANG!',
      gendut: 'Siap ketemu kita?',
      penyok: 'Sampai ketemu!'
    },
    endingCtaLine: {
      mukidi: 'Sragen, ketemu kita ya!',
      penyok: 'Cek jadwal dan info Nonton Duluan lewat link di bio!'
    },
    boothMall: {
      venue: 'Plaza Atrium Sragen',
      floor: 'Area Atrium Utama Plaza Atrium Sragen (Samping Panggung)',
      time: '15.00 – 17.00 WIB'
    },
    scheduleItems: [
      { time: '08.00 - 09.00 WIB', activity: 'Temu Konco Sekolah', venue: 'SMK Citra Medika Sragen', status: 'working', type: 'Sekolah' },
      { time: '10.00 - 11.00 WIB', activity: 'Live Radio Talkshow', venue: 'LPPL Radio Buana Asri', status: 'working', type: 'Radio' },
      { time: '13.00 - 15.00 WIB', activity: 'Nonton Duluan Bareng Pemain', venue: 'Platinum Cineplex Plaza Atrium Sragen', status: 'LOCK', type: 'Bioskop', isNontonDuluan: true },
      { time: '15.00 - 17.00 WIB', activity: 'Temu Konco & Penukaran Voucher Fisik', venue: 'Area Parkir Bawah Bioskop Platinum Sragen', status: 'working', type: 'Mall', isVoucherExchange: true }
    ],
    cinemas: ['Platinum Cineplex Plaza Atrium Sragen']
  },

  ngawi: {
    stopNumber: 6,
    slug: 'ngawi',
    cityName: 'Ngawi',
    dateStr: '27 Oktober 2026',
    leadSpeaker: 'Mukidi + Gendut + Bunga',
    rosterActual: ['Mukidi (Heri Chandra)', 'Gendut (Sutrisno Agung)', 'Pak No (Wiyono)', 'Mintul (Rizka Oktavia)', 'Gabriella Desta (Bunga)'],
    blockingNote: 'Mukidi, Gendut, dan Bunga memimpin sapaan.',
    openingLine: {
      mukidi: 'NGAWI, SEKARANG GILIRAN KITA KETEMU!',
      gendut: 'Siap ketemu kita?',
      bunga: 'Sampai ketemu!'
    },
    endingCtaLine: {
      mukidi: 'Ngawi, sampai ketemu!',
      bunga: 'Cek jadwal lengkap dan Nonton Duluan lewat link di bio!'
    },
    boothMall: {
      venue: 'Area Roadshow Ngawi',
      floor: 'Area Halaman Depan Panggung Acara Ngawi',
      time: '15.00 – 17.00 WIB'
    },
    scheduleItems: [
      { time: '08.00 - 09.00 WIB', activity: 'Temu Konco Sekolah', venue: 'SMA Negeri 1 Ngawi', status: 'working', type: 'Sekolah' },
      { time: '10.00 - 11.00 WIB', activity: 'Live Radio Talkshow', venue: 'Radio Bahana Ngawi', status: 'working', type: 'Radio' },
      { time: '14.00 - 15.40 WIB', activity: 'Nonton Duluan & Greeting Ending', venue: 'NSC Ngawi (New Star Cineplex)', status: 'Konfirmasi', type: 'Bioskop', isNontonDuluan: true },
      { time: '16.00 - 17.00 WIB', activity: 'Temu Penggemar & Penukaran Voucher', venue: 'Area Bioskop NSC Ngawi', status: 'Konfirmasi', type: 'Mall', isVoucherExchange: true }
    ],
    cinemas: ['NSC Ngawi']
  },

  madiun: {
    stopNumber: 7,
    slug: 'madiun',
    cityName: 'Madiun',
    dateStr: '28 Oktober 2026',
    leadSpeaker: 'Mukidi + Gendut + Penyok',
    rosterActual: ['Mukidi (Heri Chandra)', 'Penyok (Eko Dunung)', 'Gendut (Sutrisno Agung)', 'Mintul (Rizka Oktavia)', 'Pak No (Wiyono)', 'Gabriella Desta (Bunga)'],
    blockingNote: 'Trio WOKO memimpin panggung.',
    openingLine: {
      mukidi: 'MADIUN, KITA BAKAL SERU-SERUAN BARENG!',
      gendut: 'Siap ketemu kita?',
      penyok: 'Sampai ketemu!'
    },
    endingCtaLine: {
      mukidi: 'Madiun, sampai ketemu ya!',
      penyok: 'Jadwal lengkap, lokasi kegiatan, dan Nonton Duluan klik link di bio!'
    },
    boothMall: {
      venue: 'Lawu Plaza Madiun',
      floor: 'Atrium Mall Lantai Dasar',
      time: '16.00 – 17.00 WIB'
    },
    scheduleItems: [
      { time: '08.00 - 09.00 WIB', activity: 'Temu Konco Sekolah', venue: 'MAN 1 Madiun', status: 'DEALING', type: 'Sekolah' },
      { time: '10.00 - 11.00 WIB', activity: 'Campus Roadshow', venue: 'Universitas PGRI Madiun', status: 'working', type: 'Kampus' },
      { time: '11.30 - 12.30 WIB', activity: 'Live Radio Talkshow', venue: 'RRI Madiun', status: 'working', type: 'Radio' },
      { time: '14.40 - 15.00 WIB', activity: 'Greeting Ending Penonton', venue: 'CGV Lawu Plaza Madiun', status: 'Konfirmasi', type: 'Bioskop' },
      { time: '16.00 - 17.00 WIB', activity: 'Meet & Greet Mall & Penukaran Voucher', venue: 'Atrium Lawu Plaza Madiun', status: 'LOCK', type: 'Mall', isVoucherExchange: true },
      { time: '18.45 - 20.15 WIB', activity: 'Nonton Duluan Sesi Malam', venue: 'Suncity Madiun XXI', status: 'Konfirmasi', type: 'Bioskop', isNontonDuluan: true },
      { time: '20.15 - 21.15 WIB', activity: 'Temu Warga Madiun', venue: 'Suncity Mall Madiun', status: 'Soft Lock', type: 'Mall' }
    ],
    cinemas: ['CGV Lawu Plaza', 'Suncity Madiun XXI', 'Plaza Madiun XXI']
  },

  ponorogo: {
    stopNumber: 8,
    slug: 'ponorogo',
    cityName: 'Ponorogo',
    dateStr: '29 Oktober 2026',
    leadSpeaker: 'Mukidi + Gendut + Bunga',
    rosterActual: ['Mukidi (Heri Chandra)', 'Gendut (Sutrisno Agung)', 'Pak No (Wiyono)', 'Gabriella Desta (Bunga)'],
    blockingNote: 'Mukidi, Gendut, dan Bunga memimpin.',
    openingLine: {
      mukidi: 'PONOROGO, PIYE TO KIH? MAU MAMPIR!',
      gendut: 'Siap ketemu kita?',
      bunga: 'Sampai ketemu!'
    },
    endingCtaLine: {
      mukidi: 'Ponorogo, ketemu kita ya!',
      bunga: 'Cek jadwal dan info Nonton Duluan lewat link di bio!'
    },
    boothMall: {
      venue: 'Ponorogo City Center (PCC)',
      floor: 'Atrium Depan Bioskop Cinepolis',
      time: '16.30 – 18.00 WIB'
    },
    scheduleItems: [
      { time: '09.00 - 10.00 WIB', activity: 'Campus Visit', venue: 'Universitas Muhammadiyah Ponorogo', status: 'working', type: 'Kampus' },
      { time: '11.00 - 12.00 WIB', activity: 'Live Radio On-Air', venue: 'Gema Surya FM Ponorogo', status: 'working', type: 'Radio' },
      { time: '15.00 - 17.00 WIB', activity: 'Nonton Duluan Bareng Pemain', venue: 'Cinepolis Ponorogo City Center', status: 'Konfirmasi', type: 'Bioskop', isNontonDuluan: true },
      { time: '17.00 - 18.00 WIB', activity: 'Meet & Greet & Penukaran Voucher Fisik', venue: 'Ponorogo City Center Mall', status: 'working', type: 'Mall', isVoucherExchange: true }
    ],
    cinemas: ['Cinepolis Ponorogo City Center']
  },

  nganjuk: {
    stopNumber: 9,
    slug: 'nganjuk',
    cityName: 'Nganjuk',
    dateStr: '30 Oktober 2026',
    leadSpeaker: 'Mukidi + Gendut + Penyok',
    rosterActual: ['Mukidi (Heri Chandra)', 'Gendut (Sutrisno Agung)', 'Penyok (Eko Dunung)', 'Pak No (Wiyono)', 'Mintul (Rizka Oktavia)', 'Gabriella Desta (Bunga)'],
    blockingNote: 'Rombongan WOKO siap seru-seruan di Nganjuk.',
    openingLine: {
      mukidi: 'NGANJUK, TUNGGU KITA YA!',
      gendut: 'Siap ketemu kita?',
      penyok: 'Sampai ketemu!'
    },
    endingCtaLine: {
      mukidi: 'Nganjuk, sampai ketemu!',
      penyok: 'Jadwal lengkap dan info Nonton Duluan klik link di bio!'
    },
    boothMall: {
      venue: 'Luwes Mall Nganjuk / Sam Studio',
      floor: 'Area Depan Bioskop / Atrium',
      time: '16.30 – 18.00 WIB'
    },
    scheduleItems: [
      { time: '08.00 - 09.00 WIB', activity: 'School Visit', venue: 'SMA Negeri 2 Nganjuk (SMADA)', status: 'working', type: 'Sekolah' },
      { time: '11.00 - 12.00 WIB', activity: 'Campus Sharing', venue: 'Universitas PGRI Mpu Sindok (UMPS)', status: 'working', type: 'Kampus' },
      { time: '13.00 - 14.00 WIB', activity: 'Talkshow Radio', venue: 'Radio Cakra Krisna Nganjuk', status: 'working', type: 'Radio' },
      { time: '15.00 - 17.00 WIB', activity: 'Special Screening Nonton Duluan', venue: "Sam's Studio Nganjuk", status: 'LOCK', type: 'Bioskop', isNontonDuluan: true },
      { time: '17.00 - 18.00 WIB', activity: 'Temu Konco & Penukaran Voucher Fisik', venue: 'Luwes Nganjuk', status: 'working', type: 'Mall', isVoucherExchange: true }
    ],
    cinemas: ["Sam's Studio Nganjuk"]
  },

  mojokerto: {
    stopNumber: 10,
    slug: 'mojokerto',
    cityName: 'Mojokerto',
    dateStr: '31 Oktober 2026',
    leadSpeaker: 'Mukidi + Gendut + Bunga',
    rosterActual: ['Mukidi (Heri Chandra)', 'Gendut (Sutrisno Agung)', 'Pak No (Wiyono)', 'Gabriella Desta (Bunga)'],
    blockingNote: 'Mukidi, Gendut, dan Bunga memimpin.',
    openingLine: {
      mukidi: 'MOJOKERTO, KITA DATANG!',
      gendut: 'Siap ketemu kita?',
      bunga: 'Sampai ketemu!'
    },
    endingCtaLine: {
      mukidi: 'Mojokerto, sampai ketemu!',
      bunga: 'Cek jadwal lengkap, lokasi kegiatan, dan Nonton Duluan lewat link di bio!'
    },
    boothMall: {
      venue: 'Sunrise Mall Mojokerto',
      floor: 'Atrium Mall Depan CGV',
      time: '16.30 – 18.00 WIB'
    },
    scheduleItems: [
      { time: '08.00 - 09.00 WIB', activity: 'School Visit', venue: 'SMKN 2 Mojokerto', status: 'working', type: 'Sekolah' },
      { time: '11.00 - 12.00 WIB', activity: 'Campus Visit', venue: 'Universitas Islam Majapahit (UNIM)', status: 'working', type: 'Kampus' },
      { time: '13.00 - 14.00 WIB', activity: 'Live Radio On-Air', venue: 'Radio R FM Mojokerto', status: 'working', type: 'Radio' },
      { time: '15.00 - 17.00 WIB', activity: 'Nonton Duluan Bersama Cast', venue: 'CGV Sunrise Mall Mojokerto', status: 'LOCK', type: 'Bioskop', isNontonDuluan: true },
      { time: '17.00 - 18.00 WIB', activity: 'Temu Konco & Penukaran Voucher Fisik', venue: 'Sunrise Mall Mojokerto', status: 'LOCK', type: 'Mall', isVoucherExchange: true }
    ],
    cinemas: ['CGV Sunrise Mall Mojokerto']
  },

  gresik: {
    stopNumber: 11,
    slug: 'gresik',
    cityName: 'Gresik',
    dateStr: '1 November 2026',
    leadSpeaker: 'Mukidi + Gendut + Penyok',
    rosterActual: ['Mukidi (Heri Chandra)', 'Gendut (Sutrisno Agung)', 'Penyok (Eko Dunung)', 'Pak No (Wiyono)', 'Gabriella Desta (Bunga)'],
    blockingNote: 'Trio WOKO memimpin.',
    openingLine: {
      mukidi: 'GRESIK, KITA MAU KETEMU KALIAN!',
      gendut: 'Siap ketemu kita?',
      penyok: 'Sampai ketemu!'
    },
    endingCtaLine: {
      mukidi: 'Gresik, ketemu kita ya!',
      penyok: 'Jadwal lengkap dan info Nonton Duluan klik link di bio!'
    },
    boothMall: {
      venue: 'Gressmall Gresik',
      floor: 'Atrium Mall',
      time: '16.30 – 18.00 WIB'
    },
    scheduleItems: [
      { time: '10.00 - 11.00 WIB', activity: 'Live Radio Talkshow', venue: 'Suara Giri FM Gresik', status: 'working', type: 'Radio' },
      { time: '13.00 - 14.00 WIB', activity: 'Nonton Duluan & Greeting Ending', venue: 'Gressmall XXI Gresik', status: 'Konfirmasi', type: 'Bioskop', isNontonDuluan: true },
      { time: '17.00 - 18.00 WIB', activity: 'Temu Konco Mall & Penukaran Voucher', venue: 'Gressmall Gresik', status: 'LOCK', type: 'Mall', isVoucherExchange: true }
    ],
    cinemas: ['Gressmall XXI', 'Icon Mall CGV Gresik']
  },

  surabaya: {
    stopNumber: 12,
    slug: 'surabaya',
    cityName: 'Surabaya',
    dateStr: '2 November 2026',
    leadSpeaker: 'Mukidi + Dara Sarasvati',
    rosterActual: ['Mukidi (Heri Chandra)', 'Gendut (Sutrisno Agung)', 'Penyok (Eko Dunung)', 'Dara Sarasvati (Sukma)', 'Gabriella Desta (Bunga)'],
    blockingNote: 'Mukidi dan Dara Sarasvati di depan/tengah; Gendut, Penyok, Bunga supporting visual.',
    openingLine: {
      mukidi: 'SURABAYA, GILIRAN KITA KETEMU!',
      dara: 'PIYE TO KIH? datang ke kotamu!'
    },
    endingCtaLine: {
      mukidi: 'Surabaya, ketemu kita ya!',
      dara: 'Jadwal lengkap, lokasi kegiatan, dan Nonton Duluan klik link di bio!'
    },
    boothMall: {
      venue: 'Royal Plaza Surabaya / Pakuwon Mall',
      floor: 'Atrium Utama',
      time: '16.00 – 17.30 WIB'
    },
    scheduleItems: [
      { time: '08.00 - 11.00 WIB', activity: 'Temu Konco Komunitas & Pelajar', venue: 'Surabaya Timur / Pusat', status: 'working', type: 'Sekolah' },
      { time: '13.00 - 14.00 WIB', activity: 'Live Talkshow Radio', venue: 'RRI Pro 2 Surabaya', status: 'working', type: 'Radio' },
      { time: '14.30 - 15.10 WIB', activity: 'Greeting Ending Nonton Duluan', venue: 'Pakuwon Mall XXI / Royal XXI', status: 'Konfirmasi', type: 'Bioskop', isNontonDuluan: true },
      { time: '16.00 - 17.00 WIB', activity: 'Temu Konco & Penukaran Voucher Fisik', venue: 'Pakuwon Mall / Royal Plaza Surabaya', status: 'working', type: 'Mall', isVoucherExchange: true },
      { time: 'Malam WIB', activity: 'Shooting Podcast TV Jatim', venue: 'Studio TV Jatim Surabaya', status: 'Konfirmasi', type: 'Special Event' }
    ],
    cinemas: ['Pakuwon Mall XXI', 'Royal Plaza XXI', 'Tunjungan Plaza XXI', 'Marvell City CGV']
  },

  sidoarjo: {
    stopNumber: 13,
    slug: 'sidoarjo',
    cityName: 'Sidoarjo',
    dateStr: '3 November 2026',
    leadSpeaker: 'Mukidi + Dara Sarasvati',
    rosterActual: ['Mukidi (Heri Chandra)', 'Gendut (Sutrisno Agung)', 'Penyok (Eko Dunung)', 'Dara Sarasvati (Sukma)', 'Gabriella Desta (Bunga)', 'Lorenzo Gibbs (Jotay)'],
    blockingNote: 'Mukidi dan Dara Sarasvati memimpin; cast lain supporting visual.',
    openingLine: {
      mukidi: 'SIDOARJO, KITA BAKAL DATANG!',
      dara: 'Siap ketemu dan seru-seruan bareng kita?'
    },
    endingCtaLine: {
      mukidi: 'Sidoarjo, ketemu kita ya!',
      dara: 'Jadwal lengkap, lokasi kegiatan, dan Nonton Duluan klik link di bio!'
    },
    boothMall: {
      venue: 'Suncity Mall Sidoarjo',
      floor: 'Atrium Mall Depan Bioskop Platinum',
      time: '15.00 – 16.30 WIB'
    },
    scheduleItems: [
      { time: '06.00 - 09.00 WIB', activity: 'Grebek Seru CFD', venue: 'CFD Alun-alun Sidoarjo', status: 'working', type: 'Special Event' },
      { time: '13.00 - 14.40 WIB', activity: 'Nonton Duluan Sesi Siang', venue: 'Platinum Cineplex Suncity Mall', status: 'LOCK', type: 'Bioskop', isNontonDuluan: true },
      { time: '15.00 - 16.00 WIB', activity: 'Temu Konco & Penukaran Voucher Fisik', venue: 'Suncity Mall Sidoarjo', status: 'working', type: 'Mall', isVoucherExchange: true },
      { time: '16.10 - 17.50 WIB', activity: 'Nonton Duluan Sesi Sore', venue: 'Ciplaz Sidoarjo XXI', status: 'Konfirmasi', type: 'Bioskop', isNontonDuluan: true }
    ],
    cinemas: ['Ciplaz Sidoarjo XXI', 'Platinum Cineplex Suncity Mall']
  },

  malang: {
    stopNumber: 14,
    slug: 'malang',
    cityName: 'Malang & Batu',
    dateStr: '4 November 2026',
    leadSpeaker: 'Mukidi + Dara Sarasvati',
    rosterActual: ['Mukidi (Heri Chandra)', 'Gendut (Sutrisno Agung)', 'Penyok (Eko Dunung)', 'Dara Sarasvati (Sukma)', 'Gabriella Desta (Bunga)', 'Lorenzo Gibbs (Jotay)'],
    blockingNote: 'Mukidi dan Dara Sarasvati memimpin.',
    openingLine: {
      mukidi: 'MALANG DAN BATU, KITA DATANG!',
      dara: 'Siap ketemu langsung bareng pemain PIYE TO KIH?'
    },
    endingCtaLine: {
      mukidi: 'Malang dan Batu, sampai ketemu!',
      dara: 'Cek jadwal lengkap, lokasi kegiatan, dan Nonton Duluan lewat link di bio!'
    },
    boothMall: {
      venue: 'Cyber Mall Malang',
      floor: 'Atrium Utama',
      time: '16.30 – 18.00 WIB'
    },
    scheduleItems: [
      { time: '08.00 - 09.00 WIB', activity: 'School Visit', venue: 'SMKN 12 Malang', status: 'working', type: 'Sekolah' },
      { time: '11.00 - 12.00 WIB', activity: 'Campus Roadshow', venue: 'Universitas Brawijaya / Univ Muhammadiyah Malang', status: 'working', type: 'Kampus' },
      { time: '13.00 - 14.00 WIB', activity: 'Live Radio On-Air', venue: 'RRI Pro 2 Malang / Elfara FM', status: 'working', type: 'Radio' },
      { time: '15.50 - 16.30 WIB', activity: 'Nonton Duluan & Greeting Ending', venue: 'Dieng XXI Malang', status: 'LOCK', type: 'Bioskop', isNontonDuluan: true },
      { time: '17.00 - 18.00 WIB', activity: 'Temu Konco & Penukaran Voucher Fisik', venue: 'Cyber Mall Malang', status: 'LOCK', type: 'Mall', isVoucherExchange: true }
    ],
    cinemas: ['Dieng XXI', 'Matos Cinepolis', 'Araya XXI', 'Transmart MX Mall XXI']
  },

  kediri: {
    stopNumber: 15,
    slug: 'kediri',
    cityName: 'Kediri',
    dateStr: '5 – 7 November 2026',
    leadSpeaker: 'Mukidi + Dara Sarasvati',
    rosterActual: [
      'Mukidi (Heri Chandra)',
      'Gendut (Sutrisno Agung)',
      'Penyok (Eko Dunung)',
      'Pak No (Wiyono)',
      'Mintul (Rizka Oktavia)',
      'Dara Sarasvati (Sukma)',
      'Gabriella Desta (Bunga)',
      'Lorenzo Gibbs (Jotay)',
      'Devina Aureel',
      'TJ Ruth (Bu Yeyen)',
      'Marwoto (Pak Gino)',
      'Ibnu Gundul (Pak RT)'
    ],
    blockingNote: 'KEDIRI KITA PULANG! Momen paling emosional dan puncak perayaan di tanah kelahiran WOKO!',
    openingLine: {
      mukidi: 'KEDIRI, KITA PULANG!',
      dara: 'Dan perjalanan kita di rumah baru dimulai.'
    },
    endingCtaLine: {
      mukidi: 'Kediri, ini rumah kita!',
      dara: 'Semua informasi rangkaian Kediri dari Home Premiere sampai Nonton Duluan, cek link di bio!'
    },
    boothMall: {
      venue: 'Kediri Mall CGV / Golden Theater / Ciplaz Kediri',
      floor: 'Lantai 1 Atrium',
      time: '15.00 – 17.30 WIB'
    },
    scheduleItems: [
      { time: '5 Nov (10.00 - 11.00 WIB)', activity: 'Campus Visit Udinus Kediri & Warung Brader', venue: 'Universitas Dian Nuswantoro Kediri', status: 'working', type: 'Kampus' },
      { time: '6 Nov (08.00 - 10.00 WIB)', activity: 'Pamitan Sungkem Orang Tua & Kru', venue: 'Kediri (Dokumenter Spesial)', status: 'working', type: 'Special Event' },
      { time: '6 Nov (13.00 - 14.00 WIB)', activity: 'Sarasehan Budaya & Walikota', venue: 'Balai Kota Kediri', status: 'working', type: 'Special Event' },
      { time: '6 Nov (15.00 - 17.00 WIB)', activity: 'Pesta Temu Konco Rakyat Kediri', venue: 'Taman Brantas Kediri', status: 'working', type: 'Mall', isVoucherExchange: true },
      { time: '6 Nov (19.00 - 21.00 WIB)', activity: 'HOME PREMIERE PIYE TO KIH? (All Studio Show 4)', venue: 'Ciplaz Kediri XXI / Kediri Mall CGV', status: 'LOCK', type: 'Bioskop', isNontonDuluan: true },
      { time: '7 Nov (13.00 - 14.00 WIB)', activity: 'Nonton Duluan Sesi 1', venue: 'Kediri XXI', status: 'LOCK', type: 'Bioskop', isNontonDuluan: true },
      { time: '7 Nov (16.30 - 17.30 WIB)', activity: 'Nonton Duluan Sesi 2', venue: 'Golden Theater Kediri', status: 'LOCK', type: 'Bioskop', isNontonDuluan: true },
      { time: '7 Nov (18.40 - 19.40 WIB)', activity: 'Nonton Duluan Sesi 3', venue: 'Kediri Mall CGV', status: 'LOCK', type: 'Bioskop', isNontonDuluan: true }
    ],
    cinemas: ['Kediri XXI', 'Golden Theater Kediri', 'Kediri Mall CGV']
  },

  blitar: {
    stopNumber: 16,
    slug: 'blitar',
    cityName: 'Blitar & Tulungagung',
    dateStr: '8 November 2026',
    leadSpeaker: 'Mukidi + Gendut + Penyok',
    rosterActual: ['Mukidi (Heri Chandra)', 'Gendut (Sutrisno Agung)', 'Penyok (Eko Dunung)', 'Pak No (Wiyono)', 'Mintul (Rizka Oktavia)'],
    blockingNote: 'Trio WOKO bersama Pak No dan Mintul menutup rangkaian roadshow.',
    openingLine: {
      mukidi: 'BLITAR & TULUNGAGUNG, KITA DATANG!',
      gendut: 'Siap ketemu kita?',
      penyok: 'Sampai ketemu!'
    },
    endingCtaLine: {
      mukidi: 'Blitar dan Tulungagung, sampai ketemu di bioskop!',
      penyok: 'Jadwal lengkap, lokasi kegiatan, dan Nonton Duluan cek link di bio!'
    },
    boothMall: {
      venue: 'Blitar Square CGV & Golden Theatre Tulungagung',
      floor: 'Atrium Mall Depan Bioskop',
      time: '15.00 – 17.00 WIB'
    },
    scheduleItems: [
      { time: '08.00 - 09.00 WIB', activity: 'School Visit', venue: 'SMK Negeri 1 Kota Blitar', status: 'working', type: 'Sekolah' },
      { time: '10.00 - 11.00 WIB', activity: 'Campus Visit', venue: 'UNISBA Blitar / AKN Putra Sang Fajar', status: 'working', type: 'Kampus' },
      { time: '12.00 - 13.00 WIB', activity: 'Live Radio Talkshow', venue: 'LPPL Radio Mahardhika FM Blitar', status: 'working', type: 'Radio' },
      { time: '13.00 - 15.00 WIB', activity: 'Nonton Duluan CGV Blitar Square', venue: 'CGV Blitar Square', status: 'working', type: 'Bioskop', isNontonDuluan: true },
      { time: '15.00 - 16.00 WIB', activity: 'Temu Konco & Penukaran Voucher Fisik Blitar', venue: 'Blitar Square Mall', status: 'working', type: 'Mall', isVoucherExchange: true },
      { time: '18.00 - 20.00 WIB', activity: 'Temu Konco & Nonton Duluan Tulungagung', venue: 'Golden Theatre Tulungagung', status: 'working', type: 'Bioskop', isNontonDuluan: true }
    ],
    cinemas: ['CGV Blitar Square', 'Golden Theatre Tulungagung']
  },

  tulungagung: {
    stopNumber: 17,
    slug: 'tulungagung',
    cityName: 'Tulungagung',
    dateStr: '8 November 2026',
    leadSpeaker: 'Mukidi + Gendut + Penyok',
    rosterActual: ['Mukidi (Heri Chandra)', 'Gendut (Sutrisno Agung)', 'Penyok (Eko Dunung)', 'Pak No (Wiyono)', 'Mintul (Rizka Oktavia)'],
    blockingNote: 'Bersama Blitar di hari terakhir roadshow 8 November.',
    openingLine: {
      mukidi: 'TULUNGAGUNG, KITA MAU KETEMU KALIAN!',
      gendut: 'Siap ketemu kita?',
      penyok: 'Sampai ketemu!'
    },
    endingCtaLine: {
      mukidi: 'Tulungagung, sampai ketemu di Golden Theatre!',
      penyok: 'Cek info Nonton Duluan lewat link di bio!'
    },
    boothMall: {
      venue: 'Area Roadshow Tulungagung',
      floor: 'Area Booth Panggung Acara Roadshow Tulungagung',
      time: '18.00 – 20.00 WIB'
    },
    scheduleItems: [
      { time: '18.00 - 20.00 WIB', activity: 'Temu Konco & Special Screening Nonton Duluan', venue: 'Golden Theatre Tulungagung', status: 'working', type: 'Bioskop', isNontonDuluan: true }
    ],
    cinemas: ['Golden Theatre Tulungagung']
  }
};

export const MASTER_MOVIE_FACTS = {
  title: 'PIYE TO KIH?',
  tagline: 'BEDA ALAM. BEDA AGAMA PULA.',
  signatureQuote: 'Udah beda alam, beda agama pula… piye to kih?',
  productionCompany: 'PT Mirakel Sinema Imaji (MIRACLE Pictures)',
  executiveProducers: 'MIRACLE Pictures Executive Team',
  director: 'Ito Mavin',
  screenwriters: 'Endik Koeswoyo & Ito Mavin',
  releaseDate: '19 November 2026',
  releaseScope: 'Penayangan Serentak di Seluruh Bioskop Indonesia',
  runtime: '±110 menit',
  ageRating: '13+ (LSF Indonesia, Ramah Remaja & Keluarga)',
  genre: 'Drama dengan elemen supranatural dan sentuhan komedi',
  exhibitorGenre: 'Drama, Komedi',
  notHorrorExplanation: 'Bukan film horor jumpscare atau teror! Ada elemen supranatural berupa arwah Sukma, tetapi fokus utamanya adalah drama cinta, persahabatan, kekeluargaan, dan transformasi diri Mukidi yang dikemas hangat dengan komedi khas.',
  synopsis: `Mukidi nekat membeli rumah tua murah demi membuktikan dirinya sudah mapan dan siap menikah. Namun rencananya berantakan seketika saat hubungannya kandas, dan ia justru bertemu Sukma—perempuan misterius cantik dari alam yang berbeda. Dari pertemuan yang penuh kepolosan dan kekacauan itu, tumbuh rasa kedekatan yang tak pernah Mukidi duga sebelumnya. Masalahnya semakin pelik: bukan hanya dunia mereka yang berbeda, keyakinan mereka pun tak sama! Bersama dua sahabat sejatinya, Gendut dan Penyok, Mukidi terseret dalam pusaran kisah cinta tak masuk akal, kekacauan persahabatan, dan misteri yang membuatnya berkali-kali garuk kepala sambil mengeluh: "Piye to kih?"`,
  titleMeaning: `Ungkapan bahasa Jawa yang secara spontan bermakna "Gimana sih ini?" atau "Ini bagaimana ceritanya?". Merupakan reaksi spontan ketika seseorang menghadapi situasi rumit di luar dugaan, merefleksikan nasib Mukidi saat menghadapi urusan cinta, keluarga, kegagalan, dan jodoh beda alam!`,
  thematicEssence: 'Cinta, persahabatan sejati, kejujuran pada diri sendiri, keberanian bangkit dari kegagalan, dan esensi memantaskan diri (berani mengakui kekurangan dan belajar menjadi manusia yang lebih baik).',
  castMembers: [
    { name: 'Heri Chandra', character: 'Mukidi', desc: 'Tokoh utama pemuda desa yang lugu, penuh tekad, menghadapi cinta tak biasa dan ujian kedewasaan.' },
    { name: 'Dara Sarasvati', character: 'Sukma', desc: 'Perempuan misterius dan anggun dari alam berbeda yang membawa dinamika cinta supranatural.' },
    { name: 'Sutrisno Agung', character: 'Gendut', desc: 'Sahabat setia Mukidi, ceria, humoris, pilar komedi persahabatan WOKO.' },
    { name: 'Eko Dunung', character: 'Penyok', desc: 'Sahabat konyol Mukidi, ceplas-ceplos, setia kawan dalam suka maupun duka.' },
    { name: 'Wiyono', character: 'Pak Nggalino / Pak No', desc: 'Sosok tetua yang sarat nostalgia komedi khas pedesaan.' },
    { name: 'Rizka Oktavia', character: 'Mintul', desc: 'Karakter ensemble yang mewarnai interaksi sosial pedesaan.' },
    { name: 'Gabriella Desta', character: 'Bunga', desc: 'Sosok penting di masa lalu Mukidi; bagian dari setup perjalanan kedewasaannya.' },
    { name: 'TJ Ruth', character: 'Bu Yeyen', desc: 'Membangun kehangatan sosial dan kelucuan interaksi warga.' },
    { name: 'Ibnu Gundul', character: 'Pak RT', desc: 'Pamong desa yang selalu terjebak dalam kehebohan warga.' },
    { name: 'Lorenzo Gibz', character: 'Jotay', desc: 'Kontras sosial dalam dinamika pergaulan pemuda masa kini.' },
    { name: 'Ivonne Dahler', character: 'Bu Tinah', desc: 'Jangkar emosional keluarga dan kasih sayang seorang ibu.' },
    { name: 'Marwoto', character: 'Pak Gino', desc: 'Suara kebijaksanaan tentang tanggung jawab hidup dan memantaskan diri.' },
    { name: 'Yono Bakrie', character: 'Bang Sadikin', desc: 'Kejutan komedi pendukung yang segar dan mengocok perut.' }
  ],
  soundtracks: [
    { title: 'Sigaran Nyowo', creator: 'Lek Dahlan', singer: 'Lek Dahlan', mood: 'Kedekatan, romansa, rasa falling in love beda alam' },
    { title: 'Kelangan', creator: 'Lek Dahlan', singer: 'Lek Dahlan', mood: 'Rasa kehilangan yang mendalam dan perpisahan' },
    { title: 'Gemati', creator: 'Lek Dahlan', singer: 'Lek Dahlan', mood: 'Ketulusan kasih, perhatian, dan ikatan batin' },
    { title: 'Piye To Kih?', creator: 'Lek Dahlan', singer: 'Mukidi, Gendut & Penyok', mood: 'Persahabatan, kekonyolan, dan lagu kebangsaan kegalauan tongkrongan' }
  ],
  ostYoutubeChannel: 'https://www.youtube.com/@MIRACLEPICTURES',
  premiereMilestones: {
    homePremiere: { date: '6 November 2026', city: 'Kediri', venue: 'Ciplaz Kediri XXI / Kediri Mall CGV', note: 'Homecoming kebanggaan Kediri tanah kelahiran WOKO Channel' },
    galaPremiere: { date: '12 November 2026', city: 'Jakarta', venue: 'Bioskop Pusat Jakarta', note: 'Premiere Nasional dihadiri selebriti, pers media nasional, & kreator' },
    nationalRelease: { date: '19 November 2026', scope: 'Serentak Seluruh Bioskop Indonesia' }
  },
  partnerCinemas: [
    'Cinema XXI (M-TIX)',
    'CGV Cinemas',
    'Cinépolis',
    'Platinum Cineplex',
    'NSC (New Star Cineplex)',
    'Dakota Cinema',
    'Rajawali Cinema Purwokerto',
    'Golden Theater (Kediri & Tulungagung)',
    'Denpasar Cineplex Bali',
    'Planet Cinema Bone',
    'LTD 9',
    'MSB Cinema',
    'BES Cinema Metro',
    'BES Pangkal Pinang',
    'Mopic Cinemas',
    'Moviemax',
    'Gajahmada Cinema',
    'Hollywood Cinema',
    'JIG Cinema',
    "Sam's Studio Nganjuk",
    'FLIX Cinema',
    'Kota Cinema Mall (KCM)',
    'Local Cinema',
    'Suryayudha Cinema'
  ],
  movieplexStatus: 'UNCONFIRMED (Dilarang mengumumkan tayang di Movieplex sampai ada rilis resmi dari tim distribusi)'
};

export const FAST_TRACK_TICKET_LINKS = {
  xxi: 'https://m.21cineplex.com/id/movies/16PTKH',
  tixid: 'https://rb.gy/l28pzj',
  cgv: 'https://www.cgv.id',
  cinepolis: 'https://cinepolis.co.id',
  website: 'https://piyetokihfilm.com',
  trailerYoutube: 'https://www.youtube.com/@MIRACLEPICTURES'
};

export const MAS_KIDI_PANTUN = [
  'Mangan getuk nang kutha Salatiga, beda alam beda agama tapi tetep bikin ketawa! 🍿',
  'Tuku klopo menyang Pasar Minggu, nonton Mukidi ben atine gak gampang ngelu! ✨',
  'Iwak teri kecemplung santen, daripada nonton sendiri mending nonton karo pasangan! (Nek ra duwe pasangan ya tetep gas karo kancane lur 😂)',
  'Jalan-jalan menyang Malioboro, mampir tuku bakpia. Nonton Mukidi bareng bolo-bolo, dijamin langsung bahagia! 🎬',
  'Goreng tahu dicocol petis, nonton Mukidi karo Sukma rasane manis romantis! 💖',
  'Sego pecel lawuhe tempe, nonton film komedi ben uripmu tambah rame! 🥳'
];

export const MAS_KIDI_JOKES = [
  'Mukidi wae sing beda alam wani berjuang lur, mosok sampean tuku tiket wae ragu-ragu? Gas lur! 😂',
  'Jarene wong pinter, jodoh kuwi gak bakal kemana-mana. Lha nek Mukidi, jodohne malah nang alam sebelah! Kurang adoh piye to kih? 👻',
  'Urip iki wis abot lur, cicilan numpuk, tugas numpuk. Makane butuh hiburan nonton Piye To Kih ben gak stres!',
  'Nonton film iki bareng ayang auto romantis, nek nonton dewekan auto diancani arwah Sukma... hehehe guyon lur! 😆',
  'Tenang lur, Mas Kidi wonge asik kok, ora galak koyo satpam mall pas nutup pintu keluar.',
  'Udah beda alam, beda agama pula... untung cintanya gak beda frekuensi wifi! 📶'
];
