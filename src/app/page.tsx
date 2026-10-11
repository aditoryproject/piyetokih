'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';
import QuotaProgress from '@/components/QuotaProgress';
import WarVoucherForm from '@/components/WarVoucherForm';
import RoadshowSection from '@/components/RoadshowSection';
import ArticlesSection from '@/components/ArticlesSection';
import { Film } from 'lucide-react';

export default function HomePage() {
  const [totalQuota, setTotalQuota] = useState(500);
  const [remainingStock, setRemainingStock] = useState(482);
  const [countdownTarget, setCountdownTarget] = useState('2026-10-22T13:00:00+07:00');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        if (data.totalQuota) setTotalQuota(data.totalQuota);
        if (data.remainingStock !== undefined) setRemainingStock(data.remainingStock);
        if (data.settings?.countdownTarget) setCountdownTarget(data.settings.countdownTarget);
      })
      .catch(() => {});
  }, []);

  const handleClaimSuccess = (newRemaining: number) => {
    setRemainingStock(newRemaining);
  };

  return (
    <div id="top" className="relative overflow-hidden min-h-screen py-10 px-4 sm:px-6">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-gradient-to-b from-amber-600/15 via-red-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto text-center">
        {/* Quick Link to Roadshow 17 Kota */}
        <div className="mb-5">
          <a
            href="#roadshow"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold transition group shadow-md"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>Jadwal Roadshow & Nobar 17 Kota (22 Okt - 8 Nov 2026)</span>
            <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform font-bold">➔</span>
          </a>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-gold-400 text-xs font-bold tracking-widest uppercase mb-5">
          <Film className="w-3.5 h-3.5" />
          <span>MIRACLE PICTURES PRESENTS</span>
        </div>

        {/* Film Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase drop-shadow-2xl mb-3">
          PIYE TO KIH? <br />
          <span className="bg-gradient-to-r from-gold-400 via-amber-300 to-red-500 bg-clip-text text-transparent">
            THE MOVIE
          </span>
        </h1>

        <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mb-8 leading-relaxed">
          Film komedi drama penuh tawa dan kehangatan keluarga. Amankan War Voucher resmi sekarang — <b className="text-gold-400">voucher dapat ditukarkan di bioskop kesayangan Anda</b> saat periode penayangan!
        </p>

        {/* Poster / Visual Banner */}
        <div className="relative max-w-xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/60 aspect-[16/9] mb-10">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80"
            alt="Piye To Kih Poster"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-0 right-0 text-center px-4">
            <span className="inline-block px-3 py-0.5 rounded-full bg-red-600/90 text-[10px] font-black uppercase tracking-widest text-white mb-1 shadow-md">
              OFFICIAL E-VOUCHER
            </span>
            <p className="text-base sm:text-lg font-black text-amber-300 drop-shadow-md">
              DAPAT DITUKARKAN DI BIOSKOP KESAYANGAN ANDA
            </p>
            <p className="text-[11px] text-gray-300 font-medium">
              Tunjukkan barcode e-voucher digital saat periode penayangan film
            </p>
          </div>
        </div>

        {/* War Voucher Countdown & Stock */}
        <div className="space-y-4 mb-8">
          <CountdownTimer targetDate={countdownTarget} />
          <QuotaProgress totalQuota={totalQuota} remainingStock={remainingStock} />
        </div>

        {/* The Simple War Voucher Form */}
        <div className="mb-4">
          <WarVoucherForm onSuccessClaim={handleClaimSuccess} />
        </div>
      </div>

      {/* ROADSHOW 17 KOTA SECTION */}
      <RoadshowSection />

      {/* ARTIKEL & DOKUMENTASI ROADSHOW */}
      <ArticlesSection />
    </div>
  );
}
