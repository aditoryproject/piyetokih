import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getCityBySlug } from '@/lib/cities';
import { getDb } from '@/lib/db';
import CityRundownSection from '@/components/CityRundownSection';
import OfficialTrailerSection from '@/components/OfficialTrailerSection';
import MovieStorySection from '@/components/MovieStorySection';
import CastSection from '@/components/CastSection';
import QuotaProgress from '@/components/QuotaProgress';
import WarVoucherForm from '@/components/WarVoucherForm';
import CityCinemaList from '@/components/CityCinemaList';
import Footer from '@/components/Footer';
import { Calendar, ChevronLeft, MapPin } from 'lucide-react';

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

  return (
    <div className="relative min-h-screen">
      {/* 1. CITY ROADSHOW HERO */}
      <section className="relative pt-10 pb-12 px-4 sm:px-6 overflow-hidden">
        {/* Glow Ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[450px] bg-red-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          {/* Back Link */}
          <div className="mb-6 flex items-center justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Info Film Nasional</span>
            </Link>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black tracking-widest uppercase mb-4 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span>ROADSHOW &amp; PENAYANGAN RESMI FILM BIOSKOP</span>
          </div>

          {/* City Headline with Official Logotype */}
          <div className="flex flex-col items-center justify-center mb-4">
            <h1 className="sr-only">PIYE TO KIH? ROADSHOW KOTA {city.name.toUpperCase()}</h1>
            <img
              src="/logo-ptk.png"
              alt={`Logo Resmi Film PIYE TO KIH? Kota ${city.name}`}
              className="w-56 sm:w-72 md:w-84 max-w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] mx-auto mb-2 filter hover:scale-[1.02] transition-transform duration-300"
            />
            <div className="text-2xl sm:text-5xl font-black uppercase tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              KOTA {city.name.toUpperCase()}
            </div>
            <div className="text-[11px] sm:text-xs font-black tracking-[0.25em] uppercase text-amber-400/90 mt-1.5">
              ROADSHOW &amp; PENAYANGAN RESMI BIOSKOP
            </div>
          </div>

          {/* Date & Location Pill */}
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200 bg-black/60 px-5 py-2 rounded-full border border-white/10 mb-2 shadow-md">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>
              Jadwal Penayangan &amp; Roadshow: <b>{city.dateStr}</b>
            </span>
          </div>

          {/* RUNDOWN & JADWAL VENUE ROADSHOW KOTA */}
          {city.rundown && (
            <CityRundownSection rundown={city.rundown} cityName={city.name} />
          )}
        </div>
      </section>

      {/* 2. SINOPSIS & KISAH FILM */}
      <MovieStorySection movieSettings={movieSettings || undefined} />

      {/* 3. OFFICIAL TEASER TRAILER PLAYER */}
      <OfficialTrailerSection movieSettings={movieSettings || undefined} cityContext={city.name} />

      {/* 4. FORM VOUCHER & KUOTA ROADSHOW PER KOTA */}
      <section id="form-voucher" className="py-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto mb-8">
          <QuotaProgress
            totalQuota={db.settings.totalQuota}
            remainingStock={remainingStock}
            cityName={city.name}
          />
        </div>

        {/* FORM KLAIM CODE VERIFIKASI RESMI KHUSUS KOTA INI */}
        <div className="max-w-xl mx-auto mb-16">
          <WarVoucherForm defaultCity={city.name} />
        </div>

        {/* LIST BIOSKOP DI KOTA INI (PRESALE TICKET DIRECT BUY) */}
        <CityCinemaList
          cityName={city.name}
          slug={city.slug}
          cinemas={city.cinemas}
          customLinks={customLinks}
        />
      </section>

      {/* 5. CAST & PEMERAN WOKO CHANNEL (SERVER RENDERED DARI DATABASE) */}
      <CastSection castList={movieSettings?.cast} />

      {/* 6. FOOTER RESMI DENGAN MITRA BIOSKOP & SOSMED */}
      <Footer />
    </div>
  );
}
