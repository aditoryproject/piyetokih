'use client';

import React from 'react';
import { ArrowRight, Check, AlertCircle } from 'lucide-react';

interface CityChoiceSectionProps {
  cityName: string;
  dateStr: string;
}

export default function CityChoiceSection({ cityName, dateStr }: CityChoiceSectionProps) {
  const shortDate = `${dateStr.split(' ')[0]} ${dateStr.split(' ')[1]?.slice(0, 3) || ''}`;

  return (
    <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10">
        <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-amber-400">
          DUA PILIHAN NONTON
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 mb-2">
          Pilih Jalur Hiburanmu di {cityName}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Mau nonton duluan bareng cast tanggal {dateStr}, atau amankan voucher untuk tayang serentak?
        </p>
      </div>

      {/* 2 Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* CARD 1: NONTON DULUAN / SPECIAL SCREENING */}
        <div className="bg-[#121620] border border-white/10 hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all">
          <div>
            {/* Tag */}
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-4">
              [ 01 ] SPECIAL SCREENING · ROADSHOW
            </div>

            {/* Headline */}
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-3">
              GAK SABAR NUNGGU 19 NOVEMBER?
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              {cityName} bisa nonton PIYE TO KIH? lebih dulu tanggal {dateStr} lewat Special Screening roadshow.
            </p>

            {/* Checklist */}
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Tayang {dateStr} di {cityName}</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Greeting &amp; temu tawa langsung bareng cast film</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Tiket resmi via XXI / Cinépolis</span>
              </li>
            </ul>
          </div>

          <div>
            <a
              href="#pilihan-bioskop"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wide py-4 px-6 rounded-xl shadow-lg transition-transform active:scale-95"
            >
              <span>PILIH BIOSKOP &amp; BELI TIKET</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-[11px] text-slate-400 text-center mt-3">
              Tiket hanya berlaku untuk bioskop, tanggal, dan jam Special Screening yang dipilih.
            </p>
          </div>
        </div>

        {/* CARD 2: VOUCHER 19-20 NOVEMBER / PENAYANGAN UMUM */}
        <div className="bg-[#121620] border border-white/10 hover:border-amber-500/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all">
          <div>
            {/* Tag */}
            <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 mb-4">
              [ 02 ] VOUCHER FISIK · PENAYANGAN SERENTAK
            </div>

            {/* Headline */}
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-3">
              MAU AMANKAN VOUCHER NONTON?
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
              Booking voucher sekarang, lalu datang ke booth PIYE TO KIH? di kota roadshow untuk melakukan pembayaran dan mengambil voucher fisik.
            </p>

            {/* Checklist */}
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Booking online tanpa bayar sekarang (bebas antre kuota)</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Bayar &amp; ambil Voucher Fisik di booth roadshow ({shortDate})</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Voucher dipakai untuk tayang serentak 19–20 November 2026</span>
              </li>
            </ul>
          </div>

          <div>
            <a
              href="#booking-voucher"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#f1f3f5] hover:bg-white text-slate-900 font-black text-xs sm:text-sm uppercase tracking-wide py-4 px-6 rounded-xl shadow-lg transition-transform active:scale-95"
            >
              <span>DAPATKAN KODE BOOKING</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-[11px] text-amber-400/90 text-center mt-3">
              Kode booking bukan tiket dan bukan bukti pembayaran.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
