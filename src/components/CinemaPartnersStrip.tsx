'use client';

import React, { useState } from 'react';
import { Film, ChevronDown, ChevronUp, Ticket } from 'lucide-react';

const CINEMA_NETWORKS = [
  'Dakota Cinema',
  'Rajawali Cinema',
  'Golden Theater',
  'Denpasar Cineplex',
  'Planet Cinema Bone',
  'Ltd 9 Cinema',
  'MSB Cinema',
  'BES Cinema Metro',
  'BES Cinema Pangkal Pinang',
  'Mopic Cinemas',
  'Movimax',
  'Gajahmada Cinema',
  'Hollywood Cinema',
  'JIG Cinema',
  'Cinema XXI',
  'CGV Cinemas',
  'Cinépolis',
  "SAM'S Studio",
  'FLIX Cinema',
  'Kota Cinema Mall (KCM)',
  'Platinum Cineplex',
  'New Star Cineplex (NSC)',
  'Movieplex',
  'Local Cinema',
  'Surya Yudha Cinema',
];

const TICKETING_PLATFORMS = [
  { name: 'TIX ID', desc: 'Aplikasi Pembelian Tiket Online' },
  { name: 'M-TIX', desc: 'Aplikasi Resmi Tiket Cinema XXI' },
];

export default function CinemaPartnersStrip() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-y border-white/10 bg-black/60 backdrop-blur-md py-5 px-4">
      <div className="max-w-6xl mx-auto flex flex-col space-y-4">
        {/* Top Summary Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 text-center lg:text-left">
          {/* Left: Premiere Date */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="text-[11px] text-amber-400 font-black uppercase tracking-widest">
                  TAYANG PERDANA 19 NOVEMBER 2026
                </span>
              </div>
              <span className="text-xs font-bold text-slate-300 block">
                SERENTAK DI SELURUH JARINGAN BIOSKOP INDONESIA
              </span>
            </div>
          </div>

          {/* Center: Dropdown Toggle for 25 Cinema Networks */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-400 text-xs font-bold text-amber-300 transition shadow-sm group"
          >
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>25 Jaringan Bioskop Mitra Penayangan</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1">
              {isOpen ? 'Tutup' : 'Lihat (25)'}
              {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </span>
          </button>

          {/* Right: Verified Official Instagram */}
          <div className="shrink-0">
            <a
              href="https://www.instagram.com/piyetokihfilm.official/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-amber-300 transition text-xs font-bold shadow-sm"
            >
              <svg className="w-4 h-4 fill-current text-pink-400" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@piyetokihfilm.official</span>
            </a>
          </div>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-5 rounded-2xl bg-[#0F141C] border border-amber-500/30 shadow-2xl text-left space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* 25 Cinemas */}
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" />
                  <span>Daftar 25 Jaringan Bioskop Mitra Penayangan</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">25 Mitra Jaringan</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-[11px]">
                {CINEMA_NETWORKS.map((cinema, idx) => (
                  <div
                    key={cinema}
                    className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 hover:border-amber-500/30 text-slate-200 flex items-center gap-1.5 transition"
                  >
                    <span className="text-[9px] font-mono font-bold text-amber-400/80 shrink-0">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="truncate font-semibold">{cinema}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ticketing Platforms */}
            <div className="pt-3 border-t border-white/10">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1.5">
                <Ticket className="w-3.5 h-3.5" />
                <span>Platform Pembelian Tiket Resmi</span>
              </span>
              <p className="text-[11px] text-slate-400 mb-2.5">
                Catatan: TIX ID dan M-TIX adalah aplikasi/platform pembelian tiket online resmi, bukan jaringan bioskop fisik.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {TICKETING_PLATFORMS.map(p => (
                  <div
                    key={p.name}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-2"
                  >
                    <span className="font-extrabold text-white">{p.name}</span>
                    <span className="text-[10px] text-emerald-400/80 font-normal">({p.desc})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
