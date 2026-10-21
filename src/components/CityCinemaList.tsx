'use client';

import React from 'react';
import { CinemaVenue } from '@/lib/cities';
import { trackTicketIntent } from '@/lib/pixel';
import { Calendar, Clock, MapPin, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';

interface CityCinemaListProps {
  cityName: string;
  slug: string;
  cinemas: CinemaVenue[];
  customLinks: Record<string, string>;
  dateStr?: string;
}

export default function CityCinemaList({
  cityName,
  slug,
  cinemas,
  customLinks,
  dateStr = '22 Oktober 2026',
}: CityCinemaListProps) {
  const handleTicketClick = (cinemaName: string, url: string) => {
    trackTicketIntent(cityName, cinemaName, url);
  };

  return (
    <section id="pilihan-bioskop" className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-amber-400">
          PILIHAN LOKASI NONTON DULUAN
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mt-1 mb-2">
          PILIH LOKASI NONTON DULUAN!
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Beli tiket sekarang dan nonton duluan di tanggal {dateStr}. Jangan sampai kehabisan, persediaan tiket terbatas!
        </p>
      </div>

      {/* Grid of Cinema Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mb-8">
        {cinemas.map((cinema, idx) => {
          const altSlug = slug === 'jogja' ? 'yogyakarta' : slug === 'yogyakarta' ? 'jogja' : undefined;
          const overrideKey = `${slug}_${idx}`;
          const altKey = altSlug ? `${altSlug}_${idx}` : undefined;
          const targetUrl = customLinks[overrideKey] || (altKey && customLinks[altKey]) || customLinks[slug] || (altSlug && customLinks[altSlug]) || cinema.ticketUrl;

          return (
            <div
              key={idx}
              className="bg-[#121620] border border-white/10 hover:border-amber-500/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all group"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                    SPECIAL SCREENING · GREETING CAST
                  </span>
                  {cinema.remainingSeatsText && (
                    <span className="text-[11px] font-mono font-bold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded border border-white/10">
                      {cinema.remainingSeatsText}
                    </span>
                  )}
                </div>

                {/* Cinema Name & Studio */}
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  {cinema.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-medium mb-5">
                  {cinema.studio}
                </p>

                {/* Info List */}
                <div className="bg-[#161c28] border border-white/5 rounded-2xl p-4 space-y-2.5 mb-6 text-xs sm:text-sm text-slate-200">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-semibold">{dateStr}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <b className="text-amber-300 font-mono text-xs sm:text-sm">
                        {cinema.showTimes.join(', ')}
                      </b>{' '}
                      <span className="text-slate-400 text-xs">
                        ({cinema.doorNote || 'Pintu teater dibuka 15 mnt sebelumnya'})
                      </span>
                    </span>
                  </div>

                  {cinema.address && (
                    <div className="flex items-start gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-xs">{cinema.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                {/* Direct CTA */}
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleTicketClick(cinema.name, targetUrl)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wide py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/15 transition-all active:scale-95 group/btn"
                >
                  <span>
                    NONTON DULUAN DI {cinema.name.toUpperCase()}
                  </span>
                  <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>

                <p className="text-[11px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Kamu akan diarahkan ke platform ticketing resmi.</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Switch Helper Link */}
      <div className="text-center text-xs sm:text-sm text-slate-300 bg-white/5 border border-white/10 rounded-2xl p-4 max-w-xl mx-auto">
        <span>Ingin nonton saat tayang serentak 19–20 November dan mengambil voucher fisik di booth? </span>
        <a
          href="#booking-voucher"
          className="text-amber-400 font-bold hover:underline inline-flex items-center gap-1"
        >
          <span>Booking Voucher di Sini →</span>
        </a>
      </div>
    </section>
  );
}
