'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import RoadshowSection from '@/components/RoadshowSection';
import ArticlesSection from '@/components/ArticlesSection';
import OfficialTrailerSection from '@/components/OfficialTrailerSection';
import MovieStorySection from '@/components/MovieStorySection';
import CastSection from '@/components/CastSection';
import PresaleBogoSection from '@/components/PresaleBogoSection';
import Footer from '@/components/Footer';
import { Film, Ticket } from 'lucide-react';

export default function HomePage() {
  const [movieSettings, setMovieSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        if (data.settings?.movieSettings) setMovieSettings(data.settings.movieSettings);
      })
      .catch(() => {});
  }, []);

  return (
    <div id="top" className="relative overflow-hidden min-h-screen">
      {/* 1. CINEMATIC HERO SPOTLIGHT SECTION */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto">
          {/* Film Studio Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-amber-400 text-[11px] font-black tracking-[0.25em] uppercase mb-5 shadow-sm">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>MIRACLE PICTURES MEMPERSEMBAHKAN</span>
          </div>

          {/* Big Cinematic Movie Title */}
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white uppercase drop-shadow-2xl mb-2 leading-none font-sans">
            PIYE TO KIH?
          </h1>
          <div className="text-xs sm:text-sm font-black tracking-[0.3em] uppercase text-amber-400/90 mb-6">
            THE MOVIE • KARYA TERBARU ITO MAVIN
          </div>

          {/* TAYANG PERDANA STRIP */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#121217] border border-white/10 shadow-2xl mb-6">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
              <Film className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[11px] sm:text-xs text-amber-300 font-extrabold uppercase tracking-widest block leading-tight">
                TAYANG PERDANA 19 NOVEMBER 2026
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 block leading-tight mt-0.5">
                SERENTAK DI SELURUH JARINGAN BIOSKOP INDONESIA
              </span>
            </div>
          </div>

          {/* Cinema Network Badges (Theatrical Authenticity) */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            <span className="hover:text-amber-300 transition-colors">CINEMA XXI</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-amber-300 transition-colors">CGV CINEMAS</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-amber-300 transition-colors">CINÉPOLIS</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-amber-300 transition-colors">TIX ID</span>
          </div>
        </div>
      </section>

      {/* 2. SINOPSIS & KISAH FILM (GAMBAR 1: DIPINDAHKAN KE PALING ATAS) */}
      <MovieStorySection movieSettings={movieSettings || undefined} />

      {/* 3. PRESALE BUY 1 GET 1 (BOGO) SECTION DENGAN 2 TOMBOL KUOTA & FORM REMINDER (15-18 NOV) */}
      <PresaleBogoSection />

      {/* 4. OFFICIAL TEASER TRAILER PLAYER (CINEMA EXPERIENCE) */}
      <OfficialTrailerSection movieSettings={movieSettings || undefined} />

      {/* 5. PEMERAN & KARAKTER RESMI (WOKO CHANNEL & DARA SARASVATI) */}
      <CastSection castList={movieSettings?.cast} />

      {/* RE-ENGAGEMENT CTA: Ajakan Elegan ke Roadshow & Presale */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto p-8 sm:p-10 rounded-3xl border border-white/10 bg-[#101217] shadow-2xl space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400">KUOTA TERBATAS BIOSKOP INDONESIA</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Siap Tertawa Bareng Mukidi &amp; Woko Channel?</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Daftarkan diri Anda untuk reminder War Presale Buy 1 Get 1 atau ikuti keseruan Roadshow &amp; Meet and Greet di 17 kota bioskop!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href="#presale"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 transition active:scale-95"
            >
              <Ticket className="w-4 h-4" />
              <span>PASANG REMINDER BUY 1 GET 1</span>
            </a>
            <a
              href="#roadshow"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition active:scale-95"
            >
              <span>JADWAL ROADSHOW 17 KOTA</span>
            </a>
          </div>
        </div>
      </section>

      {/* 7. ROADSHOW 17 KOTA RESMI */}
      <RoadshowSection />

      {/* 8. KABAR & DOKUMENTASI TERKINI */}
      <ArticlesSection />

      {/* THEATRICAL CREDITS BILLING BLOCK (A24 / Warner Bros Grade Authenticity) */}
      <section className="py-12 px-4 border-t border-white/[0.06] bg-[#070709] text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="billing-block text-[9px] sm:text-[10px] text-slate-500 max-w-3xl mx-auto leading-relaxed font-mono">
            MIRACLE PICTURES PRESENTS &quot;PIYE TO KIH? THE MOVIE&quot; STARRING MUKIDI • SENTUN • PAK NO • PAK GALELO • DARA SARASVATI
            <br />
            DIRECTED BY ITO MAVIN • SCREENPLAY BY ENDIK KOESWOYO &amp; ITO MAVIN
            <br />
            EXECUTIVE PRODUCER MIRACLE PICTURES • SOUND DESIGN &amp; AUDIO POST INDONESIA • MUSIC SCORE BY MIRACLE AUDIO
            <br />
            DISTRIBUTED IN INDONESIA TO CINEMA XXI • CGV CINEMAS • CINÉPOLIS • ONLINE TICKETING VIA TIX ID
          </div>
          <p className="text-[10px] text-slate-600 tracking-wider uppercase font-semibold">
            © 2026 PT MIRACLE SINEMA INDONESIA. SELURUH HAK CIPTA DILINDUNGI UNDANG-UNDANG.
          </p>
        </div>
      </section>

      {/* 9. FOOTER RESMI DENGAN MITRA BIOSKOP 27+ LOKASI & SOSMED */}
      <Footer />
    </div>
  );
}
