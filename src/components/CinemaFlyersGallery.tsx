'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Film,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  FLYER_PATHS,
  FlyerKey,
  NATIONAL_CINEMA_FLYER_DATA,
} from '@/lib/cinema-flyers';

interface FlyerMeta {
  key: FlyerKey;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
}

const FLYER_CARDS: FlyerMeta[] = [
  {
    key: 'XXI_1',
    title: 'Cinema XXI — Bagian 1',
    subtitle: 'Jabodetabek, Bandung, Bogor, Depok, Tangerang, Cilegon, Bekasi, Cirebon, Semarang, Pekalongan, Jogja, Solo, Klaten',
    badge: 'CINEMA XXI (1)',
    image: FLYER_PATHS.XXI_1,
  },
  {
    key: 'XXI_2',
    title: 'Cinema XXI — Bagian 2',
    subtitle: 'Surabaya, Sidoarjo, Malang, Kediri, Jember, Gresik, Tuban, Medan, Batam, Lampung, Palembang, Pekanbaru, Jambi, Bengkulu, Samarinda',
    badge: 'CINEMA XXI (2)',
    image: FLYER_PATHS.XXI_2,
  },
  {
    key: 'CGV',
    title: 'CGV Cinemas (11 Kota)',
    subtitle: 'Tegal, Purwokerto, Jogja, Solo, Madiun, Mojokerto, Surabaya, Blitar, Kediri, Jember, Gresik',
    badge: 'CGV CINEMAS',
    image: FLYER_PATHS.CGV,
  },
  {
    key: 'CINEPOLIS',
    title: 'Cinépolis Cinemas (8 Kota)',
    subtitle: 'Bekasi, Tegal, Semarang, Batu Malang, Surabaya, Jember, Medan, Bali',
    badge: 'CINÉPOLIS',
    image: FLYER_PATHS.CINEPOLIS,
  },
  {
    key: 'SAMS',
    title: "Sam's Studios (17 Kota)",
    subtitle: 'Cianjur, Cibadak, Gombong, Indramayu, Kebumen, Klaten, Nganjuk, Pasuruan, Pekalongan, Pemalang, Probolinggo, Salatiga, Solo, Subang, Ungaran, Labuan Bajo',
    badge: "SAM'S STUDIOS",
    image: FLYER_PATHS.SAMS,
  },
  {
    key: 'NSC',
    title: 'New Star Cineplex / NSC (30 Kota)',
    subtitle: 'Purbalingga, Wonosobo, Purworejo, Temanggung, Salatiga, Demak, Kendal, Kudus, Jepara, Pati, Rembang, Cepu, Purwodadi, Pemalang, Tuban, Bojonegoro, Ngawi, Lamongan, Nganjuk, Jombang, Trenggalek, Kepanjen, Pasuruan, Banyuwangi, Sumenep, dll.',
    badge: 'NSC (30 KOTA)',
    image: FLYER_PATHS.NSC,
  },
  {
    key: 'PLATINUM',
    title: 'Platinum Cineplex (18 Kota)',
    subtitle: 'Batang, Baturaja, Berau, Blora, BSD Tangerang, Cibitung Bekasi, Kebumen, Kolaka, Lahat, Magelang, Majenang, Palopo, Pangkalanbun, Sibolga, Sidoarjo, Solo, Batulicin, Sragen',
    badge: 'PLATINUM CINEPLEX',
    image: FLYER_PATHS.PLATINUM,
  },
  {
    key: 'MIX',
    title: 'Bioskop Mitra Nasional Lainnya',
    subtitle: 'Golden Theater, Dakota Cinema, Denpasar Cineplex, Surya Yudha, Gajah Mada, FLIX, BES, MSB, JIG, Planet Cinema, Local Cinema, Kota Cinema Mall (KCM)',
    badge: 'BIOSKOP MITRA',
    image: FLYER_PATHS.MIX,
  },
];

interface CinemaFlyersGalleryProps {
  instagramUrl?: string;
  ticketUrl?: string;
  flyerLinks?: Partial<Record<FlyerKey, string>>;
}

export default function CinemaFlyersGallery({
  instagramUrl = 'https://www.instagram.com/piyetokihfilm.official/',
  ticketUrl = 'https://m.21cineplex.com',
  flyerLinks = {},
}: CinemaFlyersGalleryProps) {
  const getFlyerTicketUrl = (key: FlyerKey): string | null => {
    const custom = (flyerLinks?.[key] || '').trim();
    return custom || null;
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlyerIdx, setSelectedFlyerIdx] = useState<number | null>(null);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return NATIONAL_CINEMA_FLYER_DATA.filter((city) => {
      const matchCity =
        city.displayName.toLowerCase().includes(q) ||
        city.provinceOrRegion.toLowerCase().includes(q) ||
        city.aliases.some((a) => a.toLowerCase().includes(q));
      const matchCinema = city.cinemas.some(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.chain.toLowerCase().includes(q)
      );
      return matchCity || matchCinema;
    });
  }, [searchQuery]);

  const openFlyerByKey = (key: FlyerKey) => {
    const idx = FLYER_CARDS.findIndex((f) => f.key === key);
    if (idx !== -1) {
      setSelectedFlyerIdx(idx);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedFlyerIdx === null) return;
      if (e.key === 'Escape') {
        setSelectedFlyerIdx(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedFlyerIdx((prev) =>
          prev === null ? null : (prev + 1) % FLYER_CARDS.length
        );
      } else if (e.key === 'ArrowLeft') {
        setSelectedFlyerIdx((prev) =>
          prev === null
            ? null
            : (prev - 1 + FLYER_CARDS.length) % FLYER_CARDS.length
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFlyerIdx]);

  const activeFlyer =
    selectedFlyerIdx !== null ? FLYER_CARDS[selectedFlyerIdx] : null;

  return (
    <div className="space-y-10">
      {/* Search Bar Box */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="w-5 h-5 text-amber-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kota atau nama bioskop (contoh: Bandung, Jakarta, Ciwalk, Tegal, Kediri)..."
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

        {/* Live Search Results */}
        {searchQuery.trim().length > 0 && (
          <div className="mt-4 rounded-2xl bg-[#111520] border border-white/10 p-4 sm:p-5 space-y-3 shadow-2xl">
            {searchResults.length > 0 ? (
              <>
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
                  <span>
                    Ditemukan <strong className="text-amber-400">{searchResults.length}</strong> wilayah cocok untuk &quot;{searchQuery}&quot;
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    Tayang mulai 19 Nov 2026
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                  {searchResults.map((city) => (
                    <div
                      key={city.cityKey}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between gap-2.5"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 text-amber-400 font-black text-xs uppercase tracking-wide">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{city.displayName}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mb-2">
                          {city.provinceOrRegion}
                        </p>
                        <ul className="space-y-1">
                          {city.cinemas.map((cin, i) => (
                            <li
                              key={i}
                              className="text-xs text-slate-200 flex items-center justify-between gap-2"
                            >
                              <span className="font-semibold">• {cin.name}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => openFlyerByKey(cin.flyerKey)}
                                  className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-bold transition"
                                >
                                  Flyer
                                </button>
                                {(flyerLinks?.[cin.flyerKey] || '').trim() && (
                                  <a
                                    href={(flyerLinks?.[cin.flyerKey] || '').trim()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 font-bold transition"
                                  >
                                    Tiket
                                  </a>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-4 space-y-2.5">
                <p className="text-sm font-bold text-slate-200">
                  Kota &quot;{searchQuery}&quot; belum tercantum di daftar flyer rilis awal.
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Tidak menutup kemungkinan film <strong className="text-white">PIYE TO KIH?</strong> bakal menyusul tayang di kotamu! Pantengin terus update bioskop tambahan di Instagram resmi kami.
                </p>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-amber-500 text-white font-bold text-xs shadow-lg hover:opacity-95 transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span>Pantau Instagram @piyetokihfilm.official</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 9 Flyer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {FLYER_CARDS.map((flyer, idx) => (
          <button
            key={flyer.key}
            type="button"
            onClick={() => setSelectedFlyerIdx(idx)}
            className="group text-left rounded-2xl bg-[#121620] border border-white/10 hover:border-amber-400/60 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            <div className="relative aspect-[4/5] w-full bg-slate-950 overflow-hidden">
              <img
                src={flyer.image}
                alt={flyer.title}
                loading={idx < 3 ? 'eager' : 'lazy'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-70 group-hover:opacity-90 transition-opacity" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow">
                  {flyer.badge}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-400 transition">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Klik Perbesar</span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-sm font-black text-white group-hover:text-amber-400 transition">
                  {flyer.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {flyer.subtitle}
                </p>
              </div>
              {getFlyerTicketUrl(flyer.key) && (
                <a
                  href={getFlyerTicketUrl(flyer.key)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider transition shadow"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Beli Tiket ({flyer.badge})</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </button>
        ))}
      </div>

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

      {/* Pop-up Lightbox Modal */}
      {activeFlyer && selectedFlyerIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setSelectedFlyerIdx(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#0F131D] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-white/10 bg-[#141926]">
              <div className="min-w-0 pr-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                  {activeFlyer.badge} ({selectedFlyerIdx + 1} / {FLYER_CARDS.length})
                </span>
                <h4 className="text-sm sm:text-base font-black text-white truncate">
                  {activeFlyer.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFlyerIdx(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white transition shrink-0"
                aria-label="Tutup popup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="relative flex-1 overflow-auto bg-black flex items-center justify-center p-2 sm:p-4">
              <img
                src={activeFlyer.image}
                alt={activeFlyer.title}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />

              {/* Prev Button */}
              <button
                type="button"
                onClick={() =>
                  setSelectedFlyerIdx(
                    (selectedFlyerIdx - 1 + FLYER_CARDS.length) %
                      FLYER_CARDS.length
                  )
                }
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-amber-500 text-white hover:text-slate-950 border border-white/20 transition shadow-xl"
                aria-label="Flyer sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={() =>
                  setSelectedFlyerIdx(
                    (selectedFlyerIdx + 1) % FLYER_CARDS.length
                  )
                }
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/70 hover:bg-amber-500 text-white hover:text-slate-950 border border-white/20 transition shadow-xl"
                aria-label="Flyer berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-6 py-3 border-t border-white/10 bg-[#141926] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <p className="text-slate-300 line-clamp-2 sm:line-clamp-1">
                {activeFlyer.subtitle}
              </p>
              {getFlyerTicketUrl(activeFlyer.key) && (
                <a
                  href={getFlyerTicketUrl(activeFlyer.key)!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 transition"
                >
                  <span>Beli Tiket ({activeFlyer.badge})</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
