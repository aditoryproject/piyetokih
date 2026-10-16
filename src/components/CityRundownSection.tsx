'use client';

import React from 'react';
import { CityRundown } from '@/lib/cities';
import {
  Clock,
  MapPin,
  Ticket,
  Sparkles,
  Film,
  Radio,
  GraduationCap,
  School,
  Users,
  ChevronDown,
} from 'lucide-react';

interface CityRundownSectionProps {
  rundown?: CityRundown;
  cityName: string;
}

export default function CityRundownSection({ rundown, cityName }: CityRundownSectionProps) {
  if (!rundown || !rundown.items || rundown.items.length === 0) {
    return null;
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Sekolah':
        return <School className="w-3.5 h-3.5 text-blue-400" />;
      case 'Kampus':
        return <GraduationCap className="w-3.5 h-3.5 text-purple-400" />;
      case 'Radio':
        return <Radio className="w-3.5 h-3.5 text-pink-400" />;
      case 'Screening':
        return <Film className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Mall & Meet':
        return <Users className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Sekolah':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Kampus':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Radio':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      case 'Screening':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Mall & Meet':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <section className="my-8 max-w-3xl mx-auto px-4 text-left">
      <div className="rounded-3xl border border-amber-500/30 bg-[#0E131F]/90 backdrop-blur-md p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-black tracking-widest text-amber-400 uppercase mb-1.5">
              <Clock className="w-3 h-3" />
              <span>RUNDOWN ROADSHOW KOTA {cityName.toUpperCase()}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
              Jadwal &amp; Lokasi Acara
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {rundown.date} • Temui langsung para pemain &amp; sutradara
            </p>
          </div>

          <div className="sm:text-right">
            <span className="inline-block px-3 py-1 rounded-xl bg-slate-900 border border-slate-700/80 text-[11px] font-bold text-slate-300">
              📍 6 Titik Lokasi
            </span>
          </div>
        </div>

        {/* Highlight Banner: Informasi Penukaran Voucher */}
        {rundown.voucherExchangeInfo && (
          <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shrink-0 mt-0.5">
                <Ticket className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wide flex items-center gap-2">
                  <span>Informasi Titik Penukaran Voucher</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[9px] font-bold uppercase">
                    PENTING
                  </span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {rundown.voucherExchangeInfo}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Items */}
        <div className="space-y-3">
          {rundown.items.map((item, idx) => {
            const isHighlight = item.isVoucherExchange || item.category === 'Screening';

            return (
              <div
                key={idx}
                className={`group rounded-2xl p-3.5 sm:p-4 border transition-all ${
                  item.isVoucherExchange
                    ? 'bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-950/20'
                    : isHighlight
                    ? 'bg-slate-900/90 border-slate-700/80 hover:border-slate-600'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {/* Left: Time and Category */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs font-black text-white tracking-wide">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{item.time}</span>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getCategoryBadgeClass(
                        item.category
                      )}`}
                    >
                      {getCategoryIcon(item.category)}
                      <span>{item.category}</span>
                    </span>
                    {item.isVoucherExchange && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm animate-pulse">
                        ★ Titik Booth Voucher
                      </span>
                    )}
                  </div>
                </div>

                {/* Content: Title & Venue */}
                <div className="mt-2.5 space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-medium">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-red-400" />
                    <span>{item.venue}</span>
                  </div>
                  {item.note && (
                    <p className="text-[11px] text-slate-400 pl-5 leading-relaxed">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick CTA inside Rundown */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 text-[11px]">
            Sudah punya kode klaim? Amankan kuota voucher atau pesan tiket bioskop di bawah:
          </span>
          <div className="flex items-center gap-2">
            <a
              href="#form-voucher"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider transition active:scale-95 shadow-sm"
            >
              <span>Klaim Voucher</span>
              <ChevronDown className="w-3 h-3" />
            </a>
            <a
              href="#bioskop"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] uppercase tracking-wider transition"
            >
              <span>Pilih Bioskop</span>
              <ChevronDown className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
