'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import QuotaProgress from '@/components/QuotaProgress';
import RoadshowSection from '@/components/RoadshowSection';
import ArticlesSection from '@/components/ArticlesSection';
import OfficialTrailerSection from '@/components/OfficialTrailerSection';
import MovieStorySection from '@/components/MovieStorySection';
import CastSection from '@/components/CastSection';
import Footer from '@/components/Footer';
import { Film, Play, Ticket, Calendar, Sparkles, MapPin, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [totalQuota, setTotalQuota] = useState(500);
  const [remainingStock, setRemainingStock] = useState(500);
  const [countdownTarget, setCountdownTarget] = useState('2026-10-22T13:00:00+07:00');
  const [movieSettings, setMovieSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        if (data.totalQuota) setTotalQuota(data.totalQuota);
        if (data.remainingStock !== undefined) setRemainingStock(data.remainingStock);
        if (data.settings?.countdownTarget) setCountdownTarget(data.settings.countdownTarget);
        if (data.settings?.movieSettings) setMovieSettings(data.settings.movieSettings);
      })
      .catch(() => {});
  }, []);

  return (
    <div id="top" className="relative overflow-hidden min-h-screen">
      {/* 1. CINEMATIC HERO SPOTLIGHT SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Ambient Movie Lighting Behind Hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[550px] bg-gradient-to-b from-amber-600/20 via-red-600/15 to-transparent blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          {/* Quick Announcement Pill */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            <a
              href="#teaser"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition shadow-lg shadow-amber-500/10"
            >
              <Play className="w-3.5 h-3.5 fill-amber-300" />
              <span>Official Teaser Trailer Sudah Rilis</span>
              <span className="text-white">➔</span>
            </a>

            <a
              href="#roadshow"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-bold transition shadow-sm"
            >
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              <span>Jadwal Kegiatan Meet and Greet di Semarang dan 16 Kota Lainnya</span>
            </a>
          </div>

          {/* Film Studio Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-black/60 border border-white/10 text-gold-400 text-xs font-black tracking-widest uppercase mb-4 shadow-md">
            <Film className="w-3.5 h-3.5" />
            <span>MIRACLE PICTURES MEMPERSEMBAHKAN</span>
          </div>

          {/* Big Cinematic Movie Title */}
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white uppercase drop-shadow-2xl mb-4 leading-none">
            PIYE TO KIH? <br />
            <span className="bg-gradient-to-r from-gold-400 via-amber-300 to-red-500 bg-clip-text text-transparent">
              THE MOVIE
            </span>
          </h1>

          {/* TAYANG PERDANA STRIP (DARI GAMBAR 3, DI BAWAH JUDUL HEADLINE, TANPA LSF) */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-black/70 border border-amber-500/30 backdrop-blur-md mb-4 shadow-xl">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold shrink-0">
              <Film className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[11px] sm:text-xs text-amber-400 font-black uppercase tracking-widest block leading-tight">
                TAYANG PERDANA 19 NOVEMBER 2026
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 block leading-tight">
                SERENTAK DI SELURUH JARINGAN BIOSKOP INDONESIA
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SINOPSIS & KISAH FILM (GAMBAR 1: DIPINDAHKAN KE PALING ATAS) */}
      <MovieStorySection movieSettings={movieSettings || undefined} />

      {/* 3. ROADSHOW & MEET AND GREET CALLOUT (FORM DIALIHKAN PER KOTA) */}
      <section id="war" className="relative py-12 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-transparent via-[#0b101d] to-transparent border-y border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-black tracking-widest uppercase mb-4 shadow-sm">
            <Ticket className="w-3.5 h-3.5" />
            <span>KLAIM CODE VERIFIKASI RESMI PER KOTA</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-3">
            Klaim Code Verifikasi <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              ROADSHOW &amp; MEET AND GREET
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6 leading-relaxed">
            Formulir klaim Code Verifikasi resmi dibuka khusus <b>per kota roadshow</b>. Pilih kotamu pada jadwal di bawah untuk mengklaim Code Verifikasi dan menukarkannya dengan voucher fisik di booth resmi samping panggung Meet and Greet!
          </p>

          {/* Countdown Timer & Stock Bar */}
          <div className="space-y-4 mb-8">
            <CountdownTimer targetDate={countdownTarget} />
            <QuotaProgress totalQuota={totalQuota} remainingStock={remainingStock} />
          </div>

          <a
            href="#roadshow"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/20 transition active:scale-95"
          >
            <Ticket className="w-4 h-4" />
            <span>PILIH KOTAMU &amp; KLAIM CODE VERIFIKASI SEKARANG</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 4. OFFICIAL TEASER TRAILER PLAYER (CINEMA EXPERIENCE) */}
      <OfficialTrailerSection movieSettings={movieSettings || undefined} />

      {/* 5. PEMERAN & KARAKTER RESMI (WOKO CHANNEL & DARA SARASVATI) */}
      <CastSection castList={movieSettings?.cast} />

      {/* RE-ENGAGEMENT CTA: Tombol ajakan klaim bagi penonton yang sudah membaca cerita & cast */}
      <section className="py-12 px-4 text-center bg-gradient-to-b from-transparent to-amber-950/20">
        <div className="max-w-2xl mx-auto p-8 rounded-3xl border border-amber-500/30 bg-black/60 backdrop-blur-xl shadow-2xl space-y-4">
          <p className="text-xs font-black uppercase tracking-widest text-amber-400">JANGAN SAMPAI KEHABISAN KUOTA TIKET</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white">Siap Tertawa Bareng Mukidi &amp; Woko Channel?</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Pilih kotamu pada jadwal roadshow 17 kota dan amankan Code Verifikasi resmi sebelum kuota habis diserbu penonton lain!
          </p>
          <a
            href="#roadshow"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/20 transition active:scale-95"
          >
            <Ticket className="w-4 h-4" />
            <span>PILIH KOTA &amp; KLAIM SEKARANG</span>
          </a>
        </div>
      </section>

      {/* 7. ROADSHOW 17 KOTA RESMI */}
      <RoadshowSection />

      {/* 8. KABAR & DOKUMENTASI TERKINI */}
      <ArticlesSection />

      {/* 9. FOOTER RESMI DENGAN MITRA BIOSKOP 27+ LOKASI & SOSMED LENGKAP */}
      <Footer />
    </div>
  );
}
