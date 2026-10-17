import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCityBySlug } from '@/lib/cities';
import { getDb } from '@/lib/db';
import CityChoiceSection from '@/components/CityChoiceSection';
import CityCinemaList from '@/components/CityCinemaList';
import WarVoucherForm from '@/components/WarVoucherForm';
import CityVoucherPickupSection from '@/components/CityVoucherPickupSection';
import MovieStorySection from '@/components/MovieStorySection';
import CityRundownSection from '@/components/CityRundownSection';
import CityFaqSection from '@/components/CityFaqSection';
import CityViewTracker from '@/components/CityViewTracker';
import OfficialTrailerSection from '@/components/OfficialTrailerSection';
import CastSection from '@/components/CastSection';
import Footer from '@/components/Footer';
import { Calendar, ChevronDown, ChevronLeft, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug || '');

  if (!city) {
    return {
      title: 'Kota Tidak Ditemukan | PIYE TO KIH? THE MOVIE',
    };
  }

  const title = `PIYE TO KIH? Roadshow Kota ${city.name} - Jadwal & Penayangan Bioskop`;
  const description = `Jadwal resmi roadshow, temu pemain, dan penayangan film bioskop PIYE TO KIH? di Kota ${city.name} (${city.dateStr}). Cek rundown acara dan amankan tiket presale!`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: `https://piyetokihfilm.com/city/${city.slug}`,
      siteName: 'PIYE TO KIH? THE MOVIE',
      title,
      description,
      images: [
        {
          url: 'https://piyetokihfilm.com/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `PIYE TO KIH? Roadshow Kota ${city.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://piyetokihfilm.com/og-image.jpg'],
    },
  };
}

export default async function CityRoadshowPage({ params }: Props) {
  const { slug } = await params;
  const city = getCityBySlug(slug || '');

  if (!city) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-black text-white mb-2">Kota Tidak Ditemukan</h2>
        <p className="text-slate-400 text-sm mb-4">Jadwal penayangan roadshow kota ini belum terdaftar.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Utama</span>
        </Link>
      </div>
    );
  }

  const db = getDb();
  const movieSettings = db.settings.movieSettings;
  const customLinks = db.settings.cityLinkOverrides || {};
  const currentClaimed = db.leads.length;
  const remainingStock = Math.max(0, db.settings.totalQuota - currentClaimed);
  const shortDate = `${city.dateStr.split(' ')[0]} ${city.dateStr.split(' ')[1]?.slice(0, 3) || ''}`;
  const schoolItem = city.rundown?.items?.find((it) => it.category === 'Sekolah');
  const campusItem = city.rundown?.items?.find((it) => it.category === 'Kampus');
  const mallItem = city.rundown?.items?.find((it) => it.category === 'Mall & Meet' || it.isVoucherExchange);

  const venueOptions: string[] = [];
  if (schoolItem) {
    venueOptions.push(`Kunjungan Sekolah: ${schoolItem.venue} (${schoolItem.time})`);
  }
  if (campusItem) {
    venueOptions.push(`Kunjungan Kampus: ${campusItem.venue} (${campusItem.time})`);
  }
  if (city.boothInfo) {
    venueOptions.push(`Mall Roadshow: ${city.boothInfo.venue} — ${city.boothInfo.floor} (${city.boothInfo.timeStr})`);
  } else if (mallItem) {
    venueOptions.push(`Mall Roadshow: ${mallItem.venue} (${mallItem.time})`);
  }
  const defaultVenueStr = venueOptions[0] || (city.boothInfo
    ? `${city.boothInfo.venue} — ${city.boothInfo.floor} (${city.boothInfo.timeStr})`
    : undefined);

  return (
    <div className="relative min-h-screen">
      {/* City Meta Pixel ViewContent Tracker */}
      <CityViewTracker cityName={city.name} slug={city.slug} />

      {/* 1. CITY ROADSHOW HERO (Gambar 1) */}
      <section className="relative pt-10 pb-14 px-4 sm:px-6 overflow-hidden text-center">
        {/* Glow Ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[480px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {/* Back Link */}
          <div className="mb-5">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Kembali ke halaman utama</span>
            </Link>
          </div>

          {/* Official Movie Logo (Compact & Linked) */}
          <div className="mb-4 flex flex-col items-center">
            <Link href="/" title="PIYE TO KIH? THE MOVIE" className="group inline-block">
              <picture>
                <source srcSet="/logo-ptk.webp" type="image/webp" />
                <img
                  src="/logo-ptk.png"
                  alt="Logo Resmi PIYE TO KIH? THE MOVIE"
                  width={320}
                  height={201}
                  fetchPriority="high"
                  decoding="async"
                  className="w-40 sm:w-52 h-auto object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-200"
                />
              </picture>
            </Link>
          </div>

          {/* Category Tag */}
          <div className="text-[11px] sm:text-xs font-black tracking-[0.22em] uppercase text-amber-400 mb-3">
            FILM DRAMA KOMEDI
          </div>

          {/* Big Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase mb-4 leading-tight">
            {city.name.toUpperCase()}, SIAP<br className="hidden sm:inline" /> NONTON DULUAN?
          </h1>

          {/* Subtitle */}
          <div className="text-xs sm:text-base font-semibold text-amber-200/90 mb-3 max-w-2xl leading-relaxed">
            <p>Sebelum tayang serentak 19 November 2026,</p>
            <p>Kamu bisa nonton duluan Film &ldquo;PIYE TO KIH?&rdquo; di Kotamu</p>
          </div>

          {/* Sub-keterangan */}
          <p className="text-xs sm:text-sm text-slate-300 font-medium mb-7">
            Tiket nonton duluan terbatas, buruan beli sebelum kehabisan.
          </p>

          {/* Two CTA Buttons - 2 lines per button */}
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3.5 w-full max-w-lg mb-4">
            <a
              href="#pilihan-bioskop"
              className="flex-1 flex flex-col items-center justify-center bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black py-3.5 px-5 rounded-xl shadow-lg transition-transform active:scale-95 text-center"
            >
              <span className="text-xs sm:text-sm uppercase tracking-wide">BELI TIKET NONTON DULUAN</span>
              <span className="text-[10px] sm:text-[11px] font-semibold opacity-85 mt-0.5">({city.dateStr})</span>
            </a>
            <a
              href="#booking-voucher"
              className="flex-1 flex flex-col items-center justify-center bg-[#141822] hover:bg-[#1a202c] border border-white/15 hover:border-amber-500/40 text-white font-black py-3.5 px-5 rounded-xl transition-all text-center"
            >
              <span className="text-xs sm:text-sm uppercase tracking-wide">BELI VOUCHER TIKET</span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-300/90 mt-0.5">(Berlaku untuk 19-20 November 2026)</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. DUA PILIHAN NONTON (Gambar 2) */}
      <div id="pilihan-nonton">
        <CityChoiceSection cityName={city.name} dateStr={city.dateStr} />
      </div>

      {/* 3. PILIHAN TEMPAT NONTON DULUAN (Gambar 3A) */}
      <CityCinemaList
        cityName={city.name}
        slug={city.slug}
        cinemas={city.cinemas}
        customLinks={customLinks}
        dateStr={city.dateStr}
      />

      {/* 4. FUNNEL B: BOOKING VOUCHER ROADSHOW (Gambar 3B) */}
      <WarVoucherForm
        defaultCity={city.name}
        defaultVenue={defaultVenueStr}
        venueOptions={venueOptions}
        totalQuota={db.settings.totalQuota}
        remainingStock={remainingStock}
      />

      {/* 5. TITIK PENGAMBILAN VOUCHER FISIK (Gambar 4) */}
      <CityVoucherPickupSection
        cityName={city.name}
        dateStr={city.dateStr}
        boothInfo={city.boothInfo}
        schoolVenue={schoolItem ? `${schoolItem.venue} (${schoolItem.time})` : undefined}
        campusVenue={campusItem ? `${campusItem.venue} (${campusItem.time})` : undefined}
      />

      {/* 6. KISAH SEKAWAN (Sinopsis Film) */}
      <MovieStorySection movieSettings={movieSettings || undefined} />

      {/* 7. RUNDOWN ROADSHOW (Gambar 5 - diletakkan di bawah informasi pengambilan & kisah sekawan) */}
      {city.rundown && (
        <CityRundownSection rundown={city.rundown} cityName={city.name} />
      )}

      {/* 8. FAQ SINGKAT ROADSHOW & VOUCHER (Diletakkan di bawah Rundown) */}
      <CityFaqSection />

      {/* 9. OFFICIAL TEASER TRAILER PLAYER */}
      <OfficialTrailerSection movieSettings={movieSettings || undefined} cityContext={city.name} />

      {/* 10. CAST & PEMERAN WOKO CHANNEL */}
      <CastSection castList={movieSettings?.cast} />

      {/* 11. FOOTER RESMI */}
      <Footer />
    </div>
  );
}
