'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getCityBySlug } from '@/lib/cities';
import { trackTicketIntent } from '@/lib/pixel';
import CinemaPartnersStrip from '@/components/CinemaPartnersStrip';
import OfficialTrailerSection from '@/components/OfficialTrailerSection';
import MovieStorySection from '@/components/MovieStorySection';
import CastSection from '@/components/CastSection';
import WarVoucherForm from '@/components/WarVoucherForm';
import {
  Calendar,
  Clock,
  ExternalLink,
  Film,
  Users,
  MapPin,
  Ticket,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';

export default function CityRoadshowPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const city = getCityBySlug(slug || '');
  const [customLinks, setCustomLinks] = useState<Record<string, string>>({});
  const [movieSettings, setMovieSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        if (data.settings?.cityLinkOverrides) {
          setCustomLinks(data.settings.cityLinkOverrides);
        }
        if (data.settings?.movieSettings) {
          setMovieSettings(data.settings.movieSettings);
        }
      })
      .catch(() => {});
  }, []);

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

  const handleTicketClick = (cinemaName: string, url: string) => {
    trackTicketIntent(city.name, cinemaName, url);
  };

  const posterImage =
    movieSettings?.posterUrl ||
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="relative min-h-screen">
      {/* 1. CINEMA STRIP TOP */}
      <CinemaPartnersStrip />

      {/* 2. CITY ROADSHOW HERO */}
      <section className="relative pt-10 pb-16 px-4 sm:px-6 overflow-hidden">
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
            <span>ROADSHOW RESMI FILM BIOSKOP</span>
          </div>

          {/* City Headline */}
          <h1 className="text-3xl sm:text-6xl font-black text-white uppercase tracking-tight mb-3">
            PIYE TO KIH? <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              KOTA {city.name.toUpperCase()}
            </span>
          </h1>

          {/* Date & Location Pill */}
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-200 bg-black/60 px-5 py-2 rounded-full border border-white/10 mb-8 shadow-md">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Jadwal Penayangan &amp; Roadshow: <b>{city.dateStr}</b></span>
          </div>

          {/* City Poster Visual with Floating Badge */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-black aspect-[16/9] max-w-3xl mx-auto mb-12 group shadow-amber-500/10">
            <img
              src={posterImage}
              alt={`Official Poster Roadshow Piye To Kih Kota ${city.name}`}
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-5 left-0 right-0 px-4 text-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 block mb-1">
                MIRACLE PICTURES PRESENTS
              </span>
              <p className="text-base sm:text-2xl font-black text-white drop-shadow-md">
                Tayang di Bioskop Mitra Kota {city.name}
              </p>
            </div>
          </div>

          {/* 3. LIST BIOSKOP DI KOTA INI */}
          <div className="max-w-2xl mx-auto text-left mb-16">
            <div className="text-center mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">PILIHAN BIOSKOP</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">Daftar Bioskop &amp; Jam Tayang</h2>
              <p className="text-xs text-slate-400 mt-1">Pilih bioskop di {city.name} untuk memesan tiket nonton sekarang.</p>
            </div>

            <div className="space-y-4">
              {city.cinemas.map((cinema, idx) => {
                const overrideKey = `${city.slug}_${idx}`;
                const targetUrl = customLinks[overrideKey] || cinema.ticketUrl;

                return (
                  <div
                    key={idx}
                    className="bg-gradient-to-b from-[#182133] to-[#0E1522] border border-white/15 hover:border-amber-500/40 rounded-3xl p-6 shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-3 py-1 rounded-lg bg-black/70 border border-white/10 text-xs font-black text-amber-400 uppercase tracking-wider">
                        {cinema.chain}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{cinema.seats} Kursi ({cinema.studio})</span>
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white mb-2">
                      {cinema.name}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-300 mb-5 flex-wrap">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-slate-400">Jam Tayang:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {cinema.showTimes.map((st, sIdx) => (
                          <span
                            key={sIdx}
                            className="bg-black/60 px-2.5 py-1 rounded-md font-mono font-bold text-amber-300 text-xs border border-white/10"
                          >
                            {st}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Direct CTA Button with Pixel AddToCart */}
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleTicketClick(cinema.name, targetUrl)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 hover:text-white font-black text-sm py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/20 transition-all active:scale-95 group"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>BELI TIKET {cinema.chain.toUpperCase()}</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. WAR VOUCHER FORM UNTUK KOTA INI */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#0b101d] via-[#121927] to-transparent border-y border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-black tracking-widest uppercase mb-4 shadow-sm">
            <Ticket className="w-3.5 h-3.5" />
            <span>KLAIM VOUCHER KOTA {city.name.toUpperCase()}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2">
            Amankan Kuota E-Voucher Nonton
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-8">
            Klaim voucher nonton resmi untuk penayangan di {city.name}. E-Voucher langsung dikirimkan ke WhatsApp &amp; Email Anda.
          </p>

          <div className="max-w-xl mx-auto">
            <WarVoucherForm />
          </div>
        </div>
      </section>

      {/* 5. OFFICIAL TEASER TRAILER PLAYER (GLOBAL INHERITANCE) */}
      <OfficialTrailerSection movieSettings={movieSettings || undefined} cityContext={city.name} />

      {/* 6. SINOPSIS & KISAH FILM (GLOBAL INHERITANCE) */}
      <MovieStorySection movieSettings={movieSettings || undefined} />

      {/* 7. CAST & PEMERAN WOKO CHANNEL (GLOBAL INHERITANCE) */}
      <CastSection castList={movieSettings?.cast} />

      {/* 8. FOOTER CREDITS */}
      <section className="py-12 px-4 border-t border-white/10 text-center text-xs text-slate-400 bg-black/80">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-slate-500 text-[11px]">
            © 2026 Miracle Pictures. Roadshow Resmi Film Bioskop &quot;PIYE TO KIH?&quot; Kota {city.name}.
          </p>
          <div className="flex items-center justify-center gap-4 pt-1">
            <Link href="/" className="text-amber-400 hover:text-amber-300 font-bold">
              Lihat Seluruh Jadwal 17 Kota ➔
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
