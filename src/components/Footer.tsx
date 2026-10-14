'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Film, X, MapPin, ExternalLink, Sparkles, Ticket } from 'lucide-react';
import { CITIES_DATA } from '@/lib/cities';

interface FooterProps {
  socialLinksOverride?: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    youtube?: string;
  };
}

export default function Footer({ socialLinksOverride }: FooterProps) {
  const [socialLinks, setSocialLinks] = useState({
    instagram: 'https://www.instagram.com/piyetokihfilm.official/',
    tiktok: 'https://www.tiktok.com/@piyetokihfilm.official',
    facebook: 'https://www.facebook.com/piyetokihfilm.official',
    youtube: 'https://www.youtube.com/@piyetokihfilm',
  });

  const [activeCinemaModal, setActiveCinemaModal] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        if (data.settings?.socialLinks) {
          setSocialLinks(prev => ({
            ...prev,
            ...data.settings.socialLinks,
          }));
        }
      })
      .catch(() => {});
  }, []);

  // Merge override if passed directly
  const activeSocials = {
    ...socialLinks,
    ...(socialLinksOverride || {}),
  };

  // Cinema Brand Definitions
  const cinemaBrands = [
    {
      id: 'xxi',
      name: 'CINEMA XXI',
      color: 'border-amber-500/40 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20',
      tag: 'Jaringan Bioskop Terbesar',
      description: 'Penayangan serentak di studio Cinema XXI & Premiere di 17 kota roadshow.',
      cinemas: CITIES_DATA.flatMap(city =>
        city.cinemas
          .filter(c => c.chain.toUpperCase().includes('XXI'))
          .map(c => ({ ...c, cityName: city.name, dateStr: city.dateStr, slug: city.slug }))
      ),
    },
    {
      id: 'cgv',
      name: 'CGV CINEMAS',
      color: 'border-red-500/40 text-red-400 bg-red-500/10 hover:bg-red-500/20',
      tag: 'Cultureplex Cinema',
      description: 'Pengalaman menonton komedi seru dengan audio visual terbaik di CGV Cinemas.',
      cinemas: CITIES_DATA.flatMap(city =>
        city.cinemas
          .filter(c => c.chain.toUpperCase().includes('CGV'))
          .map(c => ({ ...c, cityName: city.name, dateStr: city.dateStr, slug: city.slug }))
      ),
    },
    {
      id: 'cinepolis',
      name: 'CINÉPOLIS',
      color: 'border-blue-500/40 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20',
      tag: 'Global Cinema Network',
      description: 'Menghadirkan kenyamanan nobar film Piye To Kih di seluruh studio Cinépolis.',
      cinemas: CITIES_DATA.flatMap(city =>
        city.cinemas
          .filter(c => c.chain.toUpperCase().includes('CINEPOLIS') || c.chain.toUpperCase().includes('CINÉPOLIS'))
          .map(c => ({ ...c, cityName: city.name, dateStr: city.dateStr, slug: city.slug }))
      ),
    },
    {
      id: 'tixid',
      name: 'TIX ID',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20',
      tag: 'Official Ticketing Partner',
      description: 'Pesan tiket bioskop resmi film Piye To Kih secara praktis melalui aplikasi TIX ID.',
      cinemas: [
        {
          name: 'Aplikasi TIX ID (Seluruh Indonesia)',
          chain: 'TIX ID',
          studio: 'Semua Jaringan Partner',
          cityName: 'Nasional (17 Kota)',
          dateStr: 'Mulai 19 November 2026',
          slug: 'semarang',
        },
      ],
    },
  ];

  const currentBrandData = cinemaBrands.find(b => b.id === activeCinemaModal);

  return (
    <footer className="w-full border-t border-white/10 bg-[#070B12] text-slate-300 relative z-20">
      {/* 1. CINEMA PARTNERS BRAND STRIP (PINDAH KE FOOTER SESUAI GAMBAR 1) */}
      <div className="border-b border-white/10 bg-black/60 backdrop-blur-md py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-5 text-center lg:text-left">
          {/* Label Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="text-[11px] text-amber-400 font-black uppercase tracking-widest">
                  27+ LOKASI PENAYANGAN RESMI
                </span>
              </div>
              <span className="text-xs font-bold text-slate-300 block">
                KLIK LOGO BIOSKOP UNTUK MELIHAT DAFTAR LOKASI STUDIO
              </span>
            </div>
          </div>

          {/* Cinema Buttons with Pop-Up Trigger */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {cinemaBrands.map(brand => (
              <button
                key={brand.id}
                type="button"
                onClick={() => setActiveCinemaModal(brand.id)}
                className={`px-4 py-2 rounded-xl border font-black text-xs tracking-wider transition-all duration-200 shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 ${brand.color}`}
              >
                <span>{brand.name}</span>
                <span className="text-[10px] opacity-70">▾</span>
              </button>
            ))}
          </div>

          {/* Social Media Link Pill (Instagram / Utama) */}
          <div className="shrink-0">
            {activeSocials.instagram && (
              <a
                href={activeSocials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 hover:text-amber-300 transition text-xs font-bold shadow-sm"
              >
                <svg className="w-4 h-4 fill-current text-pink-400" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>@piyetokihfilm.official</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT & SOCIAL MEDIA CHANNELS */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left mb-8 pb-8 border-b border-white/5">
          {/* Brand Info */}
          <div>
            <Link href="/" className="inline-block mb-3">
              <img
                src="/logo-ptk.png"
                alt="Logo Film PIYE TO KIH?"
                className="h-10 sm:h-12 w-auto object-contain mx-auto md:mx-0 drop-shadow"
              />
            </Link>
            <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase block mb-1">
              PRODUKSI RESMI LAYAR LEBAR
            </span>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              MIRACLE PICTURES
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Film Bioskop Komedi Nasional <b className="text-slate-200">&quot;PIYE TO KIH? THE MOVIE&quot;</b> karya Sutradara Ito Mavin &amp; Kreator Woko Channel.
            </p>
          </div>

          {/* Quick Roadshow & Voucher Info */}
          <div className="text-center">
            <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase block mb-1">
              TUR ROADSHOW &amp; MEET &amp; GREET
            </span>
            <p className="text-xs text-slate-300">
              17 Kota Jawa Tengah, DIY, &amp; Jawa Timur
            </p>
            <div className="mt-2">
              <Link
                href="/#roadshow"
                className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-bold underline underline-offset-4"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Lihat Jadwal 17 Kota &amp; Klaim Code Verifikasi</span>
              </Link>
            </div>
          </div>

          {/* Social Media Channel Icons (Instagram, TikTok, Fanspage, YouTube) */}
          <div className="flex flex-col items-center md:items-end">
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block mb-2.5">
              OFFICIAL SOCIAL MEDIA
            </span>
            <div className="flex items-center gap-2.5">
              {/* Instagram */}
              {activeSocials.instagram && (
                <a
                  href={activeSocials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Instagram Official"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-pink-600/20 border border-white/10 hover:border-pink-500/50 flex items-center justify-center text-slate-300 hover:text-pink-400 transition transform hover:scale-110 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}

              {/* TikTok */}
              {activeSocials.tiktok && (
                <a
                  href={activeSocials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="TikTok Official"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-cyan-600/20 border border-white/10 hover:border-cyan-500/50 flex items-center justify-center text-slate-300 hover:text-cyan-300 transition transform hover:scale-110 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.16 1.19 2.09 2.38 2.26.89.14 1.82-.09 2.53-.66.59-.44.97-1.12 1.06-1.85.07-1.78.04-3.57.04-5.36V.02h-.27z"/>
                  </svg>
                </a>
              )}

              {/* Facebook / Fanspage */}
              {activeSocials.facebook && (
                <a
                  href={activeSocials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook Fanspage"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/50 flex items-center justify-center text-slate-300 hover:text-blue-400 transition transform hover:scale-110 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}

              {/* YouTube */}
              {activeSocials.youtube && (
                <a
                  href={activeSocials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="YouTube Official"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/50 flex items-center justify-center text-slate-300 hover:text-red-500 transition transform hover:scale-110 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Production Credits */}
        <div className="text-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-extrabold text-slate-300 text-xs tracking-wider">
            <span>PRODUKSI: MIRACLE PICTURES</span>
            <span>•</span>
            <span>SUTRADARA: ITO MAVIN</span>
            <span>•</span>
            <span>PENULIS: ENDIK KOESWOYO</span>
            <span>•</span>
            <span>CAST: HERI CHANDRA • DARA SARASVATI • SUTRISNO AGUNG • EKO DUNUNG</span>
          </div>

          <p className="text-slate-500 text-[11px]">
            © 2026 Miracle Pictures. All Rights Reserved. Film Bioskop Komedi Nasional &quot;PIYE TO KIH?&quot;.
          </p>
        </div>
      </div>

      {/* 3. POP-UP MODAL: DAFTAR LOKASI BIOSKOP PER BRAND */}
      {currentBrandData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0F1626] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl max-h-[85vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => setActiveCinemaModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-4 pr-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentBrandData.tag}</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                Daftar Studio {currentBrandData.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {currentBrandData.description}
              </p>
            </div>

            {/* Cinema List Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 my-2">
              {currentBrandData.cinemas.map((cinema, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-black/50 border border-white/10 hover:border-amber-500/40 transition flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="block text-xs font-black text-white">
                      {cinema.name}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{cinema.cityName}</span>
                      <span>•</span>
                      <span>{cinema.studio}</span>
                    </span>
                  </div>

                  <Link
                    href={`/city/${cinema.slug}`}
                    onClick={() => setActiveCinemaModal(null)}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] transition flex items-center gap-1"
                  >
                    <span>Cek Jadwal</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Modal Footnote */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px]">
                Total 27+ Layar Bioskop di 17 Kota Roadshow
              </span>
              <button
                type="button"
                onClick={() => setActiveCinemaModal(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
