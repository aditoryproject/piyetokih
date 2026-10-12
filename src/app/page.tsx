'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import QuotaProgress from '@/components/QuotaProgress';
import WarVoucherForm from '@/components/WarVoucherForm';
import RoadshowSection from '@/components/RoadshowSection';
import ArticlesSection from '@/components/ArticlesSection';
import OfficialTrailerSection from '@/components/OfficialTrailerSection';
import MovieStorySection from '@/components/MovieStorySection';
import CastSection from '@/components/CastSection';
import CinemaPartnersStrip from '@/components/CinemaPartnersStrip';
import { Film, Play, Ticket, Calendar, Sparkles, MapPin } from 'lucide-react';

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

  const handleClaimSuccess = (newRemaining: number) => {
    setRemainingStock(newRemaining);
  };

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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition"
            >
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Jadwal Roadshow 17 Kota</span>
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

          {/* Tagline & Synopsis Teaser */}
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
            Karya Sutradara <b className="text-white">Ito Mavin</b> bersama para bintang legendaris <b className="text-amber-400">Woko Channel</b> (Mukidi, Gendut, Penyok) &amp; Dara Sarasvati. Tayang serentak di bioskop seluruh Indonesia <b className="text-white">19 November 2026</b>!
          </p>

          {/* Hero Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
            <a
              href="#war"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 active:scale-95 transition"
            >
              <Ticket className="w-4 h-4" />
              <span>KLAIM WAR VOUCHER BIOSKOP</span>
            </a>

            <a
              href="#teaser"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm backdrop-blur-md transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>NONTON TEASER TRAILER</span>
            </a>
          </div>

          {/* Featured Poster Visual Banner */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-black aspect-[16/9] max-w-3xl mx-auto shadow-amber-500/10 group">
            <img
              src={movieSettings?.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80'}
              alt="Official Poster Piye To Kih Miracle Pictures"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-5 left-0 right-0 text-center px-4">
              <span className="inline-block px-3 py-1 rounded-full bg-red-600/90 text-[10px] font-black uppercase tracking-widest text-white mb-1.5 shadow-md">
                OFFICIAL CINEMA RELEASE
              </span>
              <p className="text-lg sm:text-2xl font-black text-amber-300 drop-shadow-md">
                TAYANG PERDANA {movieSettings?.releaseDateText?.toUpperCase() || '19 NOVEMBER 2026'}
              </p>
              <p className="text-xs text-slate-300 font-medium">
                Voucher resmi dapat ditukarkan di bioskop kesayangan Anda (Cinema XXI, CGV, Cinépolis)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CINEMA PARTNERS & CERTIFICATION STRIP */}
      <CinemaPartnersStrip />

      {/* 3. WAR VOUCHER CLAIMS & COUNTDOWN (HIGH CONVERSION HERO FORM) */}
      <section id="war" className="relative py-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-transparent via-[#0b101d] to-transparent border-b border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-xs font-black tracking-widest uppercase mb-4 shadow-sm">
            <Ticket className="w-3.5 h-3.5" />
            <span>PROGRAM RESMI WAR VOUCHER NONTON</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-3">
            Klaim E-Voucher Nonton <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              FILM &quot;PIYE TO KIH?&quot;
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
            Dapatkan e-voucher digital resmi dari <b className="text-amber-400">Miracle Pictures</b>. Cukup isi formulir di bawah ini dan e-voucher langsung dikirimkan ke WhatsApp &amp; Email Anda untuk ditukarkan di loket bioskop!
          </p>

          {/* Countdown Timer & Stock Bar */}
          <div className="space-y-4 mb-8">
            <CountdownTimer targetDate={countdownTarget} />
            <QuotaProgress totalQuota={totalQuota} remainingStock={remainingStock} />
          </div>

          {/* War Voucher Form */}
          <div className="mb-6">
            <WarVoucherForm onSuccessClaim={handleClaimSuccess} />
          </div>

          <p className="text-[11px] text-slate-400">
            🔒 Sistem terverifikasi resmi oleh Miracle Pictures • E-Voucher resmi dilengkapi nomor seri unik &amp; barcode anti-duplikasi.
          </p>
        </div>
      </section>

      {/* 4. OFFICIAL TEASER TRAILER PLAYER (CINEMA EXPERIENCE) */}
      <OfficialTrailerSection movieSettings={movieSettings || undefined} />

      {/* 5. SINOPSIS & KISAH FILM */}
      <MovieStorySection movieSettings={movieSettings || undefined} />

      {/* 6. PEMERAN & KARAKTER RESMI (WOKO CHANNEL & DARA SARASVATI) */}
      <CastSection castList={movieSettings?.cast} />

      {/* RE-ENGAGEMENT CTA: Tombol ajakan klaim bagi penonton yang sudah membaca cerita & cast */}
      <section className="py-12 px-4 text-center bg-gradient-to-b from-transparent to-amber-950/20">
        <div className="max-w-2xl mx-auto p-8 rounded-3xl border border-amber-500/30 bg-black/60 backdrop-blur-xl shadow-2xl space-y-4">
          <p className="text-xs font-black uppercase tracking-widest text-amber-400">JANGAN SAMPAI KEHABISAN KUOTA TIKET</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white">Siap Tertawa Bareng Mukidi &amp; Woko Channel?</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Amankan voucher Buy 1 Get 1 sekarang sebelum kuota habis diserbu penonton lain!
          </p>
          <a
            href="#war"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/20 transition active:scale-95"
          >
            <Ticket className="w-4 h-4" />
            <span>KLAIM VOUCHER SEKARANG</span>
          </a>
        </div>
      </section>

      {/* 7. ROADSHOW 17 KOTA RESMI */}
      <RoadshowSection />

      {/* 8. KABAR & DOKUMENTASI TERKINI */}
      <ArticlesSection />

      {/* 9. OFFICIAL FOOTER CREDITS */}
      <section className="py-12 px-4 border-t border-white/10 text-center text-xs text-slate-400 bg-black/80">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-6 font-extrabold text-slate-300 text-xs tracking-wider">
            <span>PRODUKSI: MIRACLE PICTURES</span>
            <span>•</span>
            <span>SUTRADARA: ITO MAVIN</span>
            <span>•</span>
            <span>PENULIS: ENDIK KOESWOYO</span>
            <span>•</span>
            <span>CAST: HERI CHANDRA • DARA SARASVATI • SUTRISNO AGUNG • EKO DUNUNG</span>
          </div>

          <p className="text-slate-500 text-[11px]">
            © 2026 Miracle Pictures. All Rights Reserved. Film Bioskop Komedi Nasional &quot;PIYE TO KIH?&quot;.
          </p>
          <div className="flex items-center justify-center gap-4 pt-1">
            <a
              href="https://www.instagram.com/piyetokihfilm.official/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@piyetokihfilm.official</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
