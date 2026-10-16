'use client';

import React from 'react';
import { CinemaVenue } from '@/lib/cities';
import { trackTicketIntent } from '@/lib/pixel';
import { Clock, ExternalLink, Ticket, Users } from 'lucide-react';

interface CityCinemaListProps {
  cityName: string;
  slug: string;
  cinemas: CinemaVenue[];
  customLinks: Record<string, string>;
}

export default function CityCinemaList({
  cityName,
  slug,
  cinemas,
  customLinks,
}: CityCinemaListProps) {
  const handleTicketClick = (cinemaName: string, url: string) => {
    trackTicketIntent(cityName, cinemaName, url);
  };

  return (
    <div id="bioskop" className="max-w-2xl mx-auto text-left mb-16">
      <div className="text-center mb-8">
        <span className="text-xs font-black uppercase tracking-widest text-amber-400">
          PRESALE TIKET RESMI BIOSKOP
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-white uppercase mt-1">
          Pilih Bioskop di Kota {cityName}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-md mx-auto">
          Pilih bioskop mitra di bawah ini untuk memesan tiket presale resmi dan mengamankan nomor kursi studio Anda sebelum kehabisan.
        </p>
      </div>

      <div className="space-y-4">
        {cinemas.map((cinema, idx) => {
          const overrideKey = `${slug}_${idx}`;
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
                  <span>
                    {cinema.seats} Kursi ({cinema.studio})
                  </span>
                </span>
              </div>

              <h3 className="text-xl font-black text-white mb-2">{cinema.name}</h3>

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
                <span>BELI TIKET PRESALE {cinema.chain.toUpperCase()}</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
