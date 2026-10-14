'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Film, Lock } from 'lucide-react';

interface ComingSoonViewProps {
  headline?: string;
  subtitle?: string;
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    youtube?: string;
  };
}

export default function ComingSoonView({
  headline = 'COMING SOON',
  subtitle = 'Website Resmi Film PIYE TO KIH? The Movie sedang mempersiapkan sesuatu yang istimewa. Nantikan jadwal roadshow 17 kota, penayangan bioskop, dan kejutan spesial!',
  socialLinks,
}: ComingSoonViewProps) {
  const instagramUrl = socialLinks?.instagram || 'https://www.instagram.com/piyetokihfilm.official/';
  const tiktokUrl = socialLinks?.tiktok || 'https://www.tiktok.com/@piyetokihfilm.official';
  const youtubeUrl = socialLinks?.youtube || 'https://www.youtube.com/@piyetokihfilm';
  const facebookUrl = socialLinks?.facebook || 'https://www.facebook.com/piyetokihfilm.official';

  return (
    <div className="relative min-h-screen bg-[#070A0F] text-white flex flex-col justify-between items-center px-4 py-8 sm:py-12 overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] h-[350px] bg-gradient-to-b from-amber-500/20 via-orange-600/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Tagline */}
      <div className="w-full max-w-4xl flex items-center justify-center pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-slate-300 text-[11px] sm:text-xs font-bold tracking-widest uppercase backdrop-blur-sm shadow-sm">
          <Film className="w-3.5 h-3.5 text-amber-400" />
          <span>MIRACLE PICTURES PRESENTS</span>
          <span className="text-white/30">•</span>
          <span className="text-amber-400">THE MOVIE</span>
        </div>
      </div>

      {/* Main Center Hero */}
      <div className="max-w-3xl mx-auto text-center my-auto py-8 sm:py-12">
        {/* Official 3D Logotype */}
        <div className="mb-6 sm:mb-8 relative inline-block group">
          <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-red-500/20 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition duration-700" />
          <img
            src="/logo-ptk.png"
            alt="Logo Resmi Film PIYE TO KIH?"
            className="relative w-64 sm:w-80 md:w-96 max-w-full h-auto mx-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Coming Soon Headline */}
        <div className="space-y-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black tracking-[0.25em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>KARYA TERBARU ITO MAVIN</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
            {headline}
          </h1>

          <p className="text-xs sm:text-sm md:text-base font-extrabold tracking-[0.2em] text-slate-300 uppercase">
            SEGERA TAYANG DI BIOSKOP SELURUH INDONESIA
          </p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed mb-8">
          {subtitle}
        </p>

        {/* Cinema Network Badges (Authentic Theatrical Feel) */}
        <div className="mb-8">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2.5">
            JARINGAN BIOSKOP MITRA PENAYANGAN RESMI
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300 bg-black/40 border border-white/10 px-5 py-3 rounded-2xl max-w-lg mx-auto">
            <span className="hover:text-amber-300 transition-colors">CINEMA XXI</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-amber-300 transition-colors">CGV CINEMAS</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-amber-300 transition-colors">CINÉPOLIS</span>
            <span className="text-white/20">•</span>
            <span className="hover:text-amber-300 transition-colors">TIX ID</span>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-3">
          <span className="block text-xs font-bold uppercase tracking-widest text-amber-400/90">
            IKUTI UPDATE RESMI &amp; KABAR TERBARU:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-bold transition active:scale-95 shadow-md"
            >
              <svg className="w-4 h-4 fill-pink-400" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Instagram</span>
            </a>
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-bold transition active:scale-95 shadow-md"
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .57.04.84.12V9.32a6.33 6.33 0 0 0-.84-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.82a4.85 4.85 0 0 1-1-.13z" />
              </svg>
              <span>TikTok</span>
            </a>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-bold transition active:scale-95 shadow-md"
            >
              <svg className="w-4 h-4 fill-red-500" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>YouTube</span>
            </a>
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-bold transition active:scale-95 shadow-md"
              >
                <svg className="w-4 h-4 fill-blue-400" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer & Admin Login */}
      <div className="w-full max-w-4xl pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-slate-500">
        <div>
          © 2026 PT Miracle Sinema Indonesia. Seluruh hak cipta dilindungi undang-undang.
        </div>

        {/* Discreet Admin Login */}
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-amber-400 transition font-medium px-2 py-1 rounded"
          title="Akses Administrator"
        >
          <Lock className="w-3 h-3" />
          <span>Login Administrator</span>
        </Link>
      </div>
    </div>
  );
}
