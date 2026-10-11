'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getCityBySlug } from '@/lib/cities';
import { trackTicketIntent } from '@/lib/pixel';
import {
  Calendar,
  Clock,
  ExternalLink,
  Film,
  Users,
} from 'lucide-react';

export default function CityRoadshowPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const city = getCityBySlug(slug || '');
  const [customLinks, setCustomLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        if (data.settings?.cityLinkOverrides) {
          setCustomLinks(data.settings.cityLinkOverrides);
        }
      })
      .catch(() => {});
  }, []);

  if (!city) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-black text-white mb-2">Kota Tidak Ditemukan</h2>
        <p className="text-gray-400 text-sm">Jadwal penayangan kota ini belum terdaftar.</p>
      </div>
    );
  }

  const handleTicketClick = (cinemaName: string, url: string) => {
    trackTicketIntent(city.name, cinemaName, url);
  };

  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-6">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[450px] bg-red-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-gold-400 text-xs font-bold tracking-widest uppercase mb-4">
          <Film className="w-3.5 h-3.5" />
          <span>ROADSHOW RESMI FILM BIOSKOP</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-2">
          PIYE TO KIH? <br />
          <span className="bg-gradient-to-r from-gold-400 via-amber-300 to-red-500 bg-clip-text text-transparent">
            KOTA {city.name.toUpperCase()}
          </span>
        </h1>

        <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-200 bg-black/60 px-4 py-1.5 rounded-full border border-white/10 mb-6">
          <Calendar className="w-3.5 h-3.5 text-red-500" />
          <span>Penayangan: {city.dateStr}</span>
        </div>

        {/* Film Poster Visual */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/80 aspect-[16/9] mb-8">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80"
            alt={`Roadshow Piye To Kih ${city.name}`}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold-400 block mb-0.5">
              MIRACLE PICTURES
            </span>
            <p className="text-sm font-black text-white">
              Saksikan Bersama Keluarga & Sahabat di Bioskop
            </p>
          </div>
        </div>

        {/* Cinema List & Direct CTA Buttons */}
        <div className="space-y-4 text-left">
          {city.cinemas.map((cinema, idx) => {
            const overrideKey = `${city.slug}_${idx}`;
            const targetUrl = customLinks[overrideKey] || cinema.ticketUrl;

            return (
              <div
                key={idx}
                className="bg-gradient-to-b from-[#182133] to-[#0E1522] border border-white/15 hover:border-gold-500/40 rounded-2xl p-5 shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded bg-black/70 border border-white/10 text-[10px] font-black text-gold-400 uppercase tracking-wider">
                    {cinema.chain}
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-gray-400" />
                    {cinema.seats} Kursi ({cinema.studio})
                  </span>
                </div>

                <h3 className="text-lg font-black text-white mb-2">
                  {cinema.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-gray-300 mb-4">
                  <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span className="text-gray-400">Jam Tayang:</span>
                  <div className="flex flex-wrap gap-1">
                    {cinema.showTimes.map((st, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-black/60 px-2 py-0.5 rounded font-mono font-bold text-gold-300 text-[11px]"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* THE DIRECT CTA BUTTON */}
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleTicketClick(cinema.name, targetUrl)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-red-600/30 transition-transform active:scale-95 group"
                >
                  <span>BELI TIKET {cinema.chain.toUpperCase()}</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
