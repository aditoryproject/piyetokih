'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  X,
  Film,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  FlyerKey,
  NationalCitySchedule,
  NATIONAL_CINEMA_FLYER_DATA,
} from '@/lib/cinema-flyers';

interface CinemaFlyersGalleryProps {
  instagramUrl?: string;
  ticketUrl?: string;
  flyerLinks?: Partial<Record<FlyerKey, string>>;
  citiesData?: NationalCitySchedule[];
}

const CHAIN_FILTERS = [
  { id: 'ALL', label: 'Semua Jaringan' },
  { id: 'Cinema XXI', label: 'Cinema XXI' },
  { id: 'CGV Cinemas', label: 'CGV' },
  { id: 'Cinépolis', label: 'Cinépolis' },
  { id: "Sam's Studios", label: "Sam's Studios" },
  { id: 'NSC', label: 'NSC' },
  { id: 'Platinum Cineplex', label: 'Platinum' },
];

export default function CinemaFlyersGallery({
  instagramUrl = 'https://www.instagram.com/piyetokihfilm.official/',
  ticketUrl = 'https://m.21cineplex.com',
  flyerLinks = {},
  citiesData = NATIONAL_CINEMA_FLYER_DATA,
}: CinemaFlyersGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState('ALL');

  const getFlyerTicketUrl = (key: FlyerKey): string | null => {
    const custom = (flyerLinks?.[key] || '').trim();
    return custom || null;
  };

  const filteredCities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return citiesData.map((city) => {
      const cinemasByChain =
        selectedChain === 'ALL'
          ? city.cinemas
          : city.cinemas.filter((c) =>
              c.chain.toLowerCase().includes(selectedChain.toLowerCase())
            );

      if (cinemasByChain.length === 0) return null;

      if (!q) {
        return { ...city, cinemas: cinemasByChain };
      }

      const cityMatches =
        city.displayName.toLowerCase().includes(q) ||
        city.provinceOrRegion.toLowerCase().includes(q) ||
        city.aliases.some((a) => a.toLowerCase().includes(q));

      if (cityMatches) {
        return { ...city, cinemas: cinemasByChain };
      }

      const matchingCinemas = cinemasByChain.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.chain.toLowerCase().includes(q)
      );

      if (matchingCinemas.length > 0) {
        return { ...city, cinemas: matchingCinemas };
      }

      return null;
    }).filter((item): item is NonNullable<typeof item> => item !== null);
  }, [searchQuery, selectedChain, citiesData]);

  const totalCinemasShown = useMemo(
    () => filteredCities.reduce((acc, c) => acc + c.cinemas.length, 0),
    [filteredCities]
  );

  return (
    <div className="space-y-8">
      {/* Search Bar & Chain Filter */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kota, provinsi, atau nama bioskop (contoh: Bandung, Jakarta, Ciwalk, Tegal, Kediri)..."
            className="w-full pl-12 pr-10 py-4 rounded-2xl bg-[#131722] border border-white/15 focus:border-amber-400 text-white placeholder:text-slate-400 text-sm outline-none shadow-xl transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Hapus pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Chain Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CHAIN_FILTERS.map((chain) => {
            const active = selectedChain === chain.id;
            return (
              <button
                key={chain.id}
                type="button"
                onClick={() => setSelectedChain(chain.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition border ${
                  active
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-[#121620] text-slate-300 border-white/10 hover:border-amber-400/50 hover:text-white'
                }`}
              >
                {chain.label}
              </button>
            );
          })}
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Menampilkan <strong className="text-amber-400">{filteredCities.length}</strong> kota &amp;{' '}
            <strong className="text-white">{totalCinemasShown}</strong> bioskop
          </span>
          <span className="text-emerald-400 font-semibold">
            Tayang Serentak 19 Nov 2026
          </span>
        </div>
      </div>

      {/* City & Cinema List Grid */}
      {filteredCities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCities.map((city) => (
            <div
              key={city.cityKey}
              className="rounded-2xl bg-[#121620] border border-white/10 hover:border-amber-400/40 p-5 flex flex-col justify-between gap-3 shadow-lg transition"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-1.5 text-amber-400 font-black text-sm uppercase tracking-wide">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{city.displayName}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {city.provinceOrRegion}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 shrink-0">
                    {city.cinemas.length} Bioskop
                  </span>
                </div>

                <ul className="mt-3 space-y-2">
                  {city.cinemas.map((cin, i) => {
                    const ticketHref = getFlyerTicketUrl(cin.flyerKey);
                    return (
                      <li
                        key={i}
                        className="flex items-center justify-between gap-2 text-xs bg-white/[0.02] border border-white/[0.06] rounded-xl px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">
                            {cin.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {cin.chain}
                          </p>
                        </div>
                        {ticketHref && (
                          <a
                            href={ticketHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shrink-0 transition"
                          >
                            <span>Tiket</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-xl mx-auto rounded-3xl bg-[#121620] border border-white/10 p-8 text-center space-y-3 shadow-xl">
          <p className="text-base font-black text-white">
            Kota atau bioskop &quot;{searchQuery}&quot; belum ditemukan di daftar rilis awal.
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tidak menutup kemungkinan film <strong className="text-white">PIYE TO KIH?</strong> bakal menyusul tayang di kotamu! Pantengin terus update penambahan kota &amp; bioskop terbaru di Instagram resmi kami.
          </p>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-amber-500 text-white font-black text-xs shadow-lg hover:opacity-95 transition"
          >
            <span>Pantau Instagram @piyetokihfilm.official</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Bottom CTA for Unlisted Cities */}
      <div className="rounded-3xl bg-gradient-to-br from-[#161B28] to-[#0E1118] border border-amber-500/25 p-6 sm:p-8 text-center space-y-3 shadow-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kotamu Belum Ada di Daftar?</span>
        </div>
        <h3 className="text-lg sm:text-2xl font-black text-white">
          Tidak Menutup Kemungkinan Tayang di Kotamu!
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Daftar bioskop terus berkembang! Pantengin terus pengumuman penambahan kota &amp; jaringan bioskop terbaru di Instagram resmi kami, atau langsung amankan tiket yang sudah tersedia.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            <span>Follow Instagram Resmi</span>
          </a>
          <a
            href={ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg transition"
          >
            <Film className="w-4 h-4" />
            <span>Beli Tiket Sekarang</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
