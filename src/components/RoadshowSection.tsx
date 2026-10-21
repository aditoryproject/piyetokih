'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CITIES_DATA, CityData } from '@/lib/cities';
import {
  Calendar,
  MapPin,
  Film,
  Users,
  Sparkles,
  Search,
  ArrowRight,
  Gift,
  Ticket,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { trackCityCustomEvent } from '@/lib/pixel';

interface RoadshowSectionProps {
  initialCities?: CityData[];
}

export default function RoadshowSection({ initialCities }: RoadshowSectionProps = {}) {
  const [activeTab, setActiveTab] = useState<'all' | 'jateng' | 'jatim'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const citiesList = initialCities && initialCities.length > 0 ? initialCities : CITIES_DATA;

  const filteredCities = useMemo(() => {
    return citiesList.filter(city => {
      // Region filter
      if (activeTab === 'jateng') {
        const isJateng =
          city.province.toLowerCase().includes('jawa tengah') ||
          city.province.toLowerCase().includes('yogyakarta');
        if (!isJateng) return false;
      } else if (activeTab === 'jatim') {
        if (!city.province.toLowerCase().includes('jawa timur')) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = city.name.toLowerCase().includes(q);
        const matchProvince = city.province.toLowerCase().includes(q);
        const matchCinema = city.cinemas.some(c =>
          c.name.toLowerCase().includes(q) || c.chain.toLowerCase().includes(q)
        );
        return matchName || matchProvince || matchCinema;
      }

      return true;
    });
  }, [activeTab, searchQuery]);

  return (
    <section id="roadshow" className="w-full mt-16 pt-12 border-t border-white/10 relative">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] bg-gradient-to-b from-red-600/10 via-amber-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* HEADER SECTION */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600/20 via-amber-600/20 to-red-600/20 border border-amber-500/40 text-amber-300 text-xs font-black tracking-widest uppercase mb-4 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ROADSHOW 17 KOTA • MULAI 22 OKTOBER</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-4 drop-shadow-md">
            PIYE TO KIH? DATANG KE KOTAMU!
          </h2>

          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
            PIYE TO KIH? tayang serentak 19 November. Tapi buat yang nggak sabar, kamu bisa nonton lebih dulu bareng para cast di Special Screening kota roadshow. Pilih kotamu, cek jadwalnya, dan siap-siap ketemu langsung dengan para cast!
          </p>

          {/* Highlight Banner / Pill */}
          <div className="mt-6 inline-block">
            <div className="px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/25 to-red-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-black tracking-widest uppercase shadow-lg">
              NONTON DULUAN. KETEMU CAST. SERU-SERUAN DI KOTAMU.
            </div>
          </div>
        </div>

        {/* 3 SPECIAL ROADSHOW ACTIVITIES CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {/* Card 1 */}
          <div className="bg-gradient-to-b from-[#182030] to-[#0E1522] border border-amber-500/30 hover:border-amber-500/60 rounded-3xl p-6 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
              Ketemu langsung, ngobrol, dan foto bareng para pemain PIYE TO KIH? saat roadshow mampir ke kotamu. Jangan lewatkan juga keseruannya di radio, sekolah, dan kampus.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-b from-[#182030] to-[#0E1522] border border-red-500/30 hover:border-red-500/60 rounded-3xl p-6 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 mb-4 group-hover:scale-110 transition-transform">
              <Film className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
              Kamu sudah bisa nonton PIYE TO KIH? lebih dulu! Ikutan Special Screening dan nonton bareng para cast sebelum tayang serentak di bioskop.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gradient-to-b from-[#182030] to-[#0E1522] border border-amber-500/30 hover:border-amber-500/60 rounded-3xl p-6 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Gift className="w-6 h-6" />
            </div>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
              Ikutan keseruannya dan bawa pulang berbagai merchandise PIYE TO KIH?, hadiah, serta kejutan spesial yang cuma bisa kamu temukan selama roadshow.
            </p>
          </div>
        </div>

        {/* CONTROLS: TABS & SEARCH */}
        <div className="bg-[#101624] border border-white/10 rounded-2xl p-3 sm:p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Semua Kota (17)
            </button>
            <button
              onClick={() => setActiveTab('jateng')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'jateng'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Jateng & DIY (5)
            </button>
            <button
              onClick={() => setActiveTab('jatim')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'jatim'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Jawa Timur (12)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari kota atau bioskop..."
              className="w-full bg-black/60 border border-white/15 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* CITIES GRID */}
        {filteredCities.length === 0 ? (
          <div className="text-center py-16 bg-black/30 rounded-3xl border border-white/10">
            <p className="text-gray-400 text-sm">Tidak ditemukan kota dengan kata kunci "{searchQuery}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCities.map((city, idx) => (
              <div
                key={city.slug}
                className="bg-gradient-to-b from-[#131B2A] to-[#0A0F18] border border-white/10 hover:border-amber-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              >
                <div>
                  {/* Top Tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-black uppercase">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {city.province}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-300">
                      <Calendar className="w-3 h-3 text-red-400" />
                      {city.dateStr}
                    </span>
                  </div>

                  {/* City Title */}
                  <h4 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors mb-4">
                    {city.name}
                  </h4>
                </div>

                {/* Direct Link to City Page (HANYA BUTTON SESUAI REVISI GAMBAR 4) */}
                <Link
                  href={`/city/${city.slug}`}
                  onClick={() => trackCityCustomEvent(city.name, 'AddToCart', { source: 'main_page_button' })}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 hover:from-amber-500 hover:to-orange-500 border border-amber-500/40 text-amber-300 hover:text-black font-black text-xs transition-all duration-200 shadow-lg group-hover:border-amber-400 group-hover:bg-amber-500 group-hover:text-black text-center"
                >
                  <Ticket className="w-3.5 h-3.5 shrink-0" />
                  <span>Jadwal Kegiatan Meet and Greet di {city.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM CALL TO ACTION FOOTNOTE */}
        <div className="mt-12 text-center p-6 sm:p-8 bg-gradient-to-r from-red-950/40 via-amber-950/30 to-red-950/40 border border-amber-500/30 rounded-3xl">
          <h4 className="text-xl font-black text-white mb-2">
            Kotamu belum masuk jadwal roadshow? Tenang.
          </h4>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto mb-5 leading-relaxed">
            PIYE TO KIH? tetap tayang serentak di bioskop mulai 19 November 2026. Pasang reminder sekarang, dan kami akan kabari kamu saat Presale dan promo Buy 1 Get 1 resmi dibuka.
          </p>
          <a
            href="#presale"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition shadow-lg active:scale-95"
          >
            <Ticket className="w-4 h-4" />
            <span>KABARI AKU SAAT TIKET TERSEDIA</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
