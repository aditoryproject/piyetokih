'use client';

import React from 'react';
import { CityRundown } from '@/lib/cities';
import { MapPin } from 'lucide-react';

interface CityRundownSectionProps {
  rundown?: CityRundown;
  cityName: string;
}

export default function CityRundownSection({ rundown, cityName }: CityRundownSectionProps) {
  if (!rundown || !rundown.items || rundown.items.length === 0) {
    return null;
  }

  return (
    <section id="rundown" className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-amber-400">
          JADWAL KESERUAN ROADSHOW
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1 mb-2">
          RUNDOWN ROADSHOW {cityName.toUpperCase()} 🚐💨
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Seharian keliling {cityName} bareng cast PIYE TO KIH?. Cek jadwal dan jangan sampai kelewatan!
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-10">
        {/* Continuous Left Vertical Track Line */}
        <div className="absolute left-[11px] sm:left-[19px] top-6 bottom-6 w-[2px] bg-slate-700/80 -z-0" />

        <div className="space-y-4 sm:space-y-5">
          {rundown.items.map((item, idx) => {
            const isSpecialScreening = item.category === 'Screening';
            const isVoucherBooth = item.isVoucherExchange || item.category === 'Mall & Meet';

            // Determine dot style
            let dotColor = 'bg-slate-900 border-2 border-slate-500';
            let cardBorder = 'border-white/10 bg-[#121620]';
            let badge = null;

            if (isSpecialScreening) {
              dotColor = 'bg-amber-500 border-2 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]';
              cardBorder = 'border-amber-500/50 bg-[#131722] shadow-[0_4px_20px_rgba(245,158,11,0.06)]';
              badge = (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
                  <span>🍿</span>
                  <span>SPECIAL SCREENING</span>
                </span>
              );
            } else if (isVoucherBooth) {
              dotColor = 'bg-emerald-400 border-2 border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.5)]';
              cardBorder = 'border-emerald-500/50 bg-[#111922] shadow-[0_4px_20px_rgba(52,211,153,0.06)]';
              badge = (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                  <span>🎟️</span>
                  <span>BOOTH VOUCHER FISIK</span>
                </span>
              );
            }

            return (
              <div key={idx} className="relative flex items-start group">
                {/* Milestone Node on the line */}
                <div
                  className={`absolute -left-[27px] sm:-left-[35px] top-6 w-3.5 h-3.5 rounded-full ${dotColor} transition-transform group-hover:scale-125 z-10`}
                />

                {/* Event Card */}
                <div className={`w-full rounded-2xl border ${cardBorder} p-5 sm:p-6 transition-all`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs sm:text-sm font-bold text-amber-400">
                      {item.time}
                    </span>
                    {badge && <div className="self-start sm:self-auto">{badge}</div>}
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight mb-1.5">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{item.venue}</span>
                  </div>

                  {item.note && (
                    <p className="text-xs text-slate-400 italic mt-1">
                      &ldquo;{item.note}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
