'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PublicHeaderProps {
  showHeader: boolean;
}

export default function PublicHeader({ showHeader }: PublicHeaderProps) {
  const pathname = usePathname();

  // Jangan pernah render header publik di halaman admin
  if (!showHeader || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group py-1" title="Website Resmi Film PIYE TO KIH? - Miracle Pictures">
          <picture>
            <source srcSet="/logo-ptk.webp" type="image/webp" />
            <img
              src="/logo-ptk.png"
              alt="Logo Resmi Film PIYE TO KIH?"
              width={140}
              height={44}
              fetchPriority="high"
              decoding="async"
              className="h-9 sm:h-11 w-auto max-w-[130px] sm:max-w-[150px] object-contain drop-shadow-md group-hover:scale-105 transition-transform"
            />
          </picture>
          <div className="leading-tight hidden sm:block border-l border-white/15 pl-2.5">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
              Website Resmi Film
            </span>
            <span className="block font-black text-xs sm:text-sm tracking-wider text-white uppercase">
              PIYE TO KIH?
            </span>
          </div>
        </Link>

        {/* Desktop Nav: HALAMAN UTAMA, JADWAL ROADSHOW & NONTON DULUAN, KABAR & GALERI (Uppercase) */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4 text-xs font-bold tracking-wider uppercase">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition"
          >
            HALAMAN UTAMA
          </Link>
          <Link
            href="/#roadshow"
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition"
          >
            JADWAL ROADSHOW &amp; NONTON DULUAN
          </Link>
          <Link
            href="/kabar-galeri"
            className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-amber-300 hover:bg-white/5 transition"
          >
            KABAR &amp; GALERI
          </Link>
        </div>

        {/* Mobile Nav Links (Uppercase) */}
        <div className="flex md:hidden items-center gap-1 text-[11px] font-bold tracking-wider uppercase">
          <Link
            href="/"
            className="px-2 py-1 rounded-lg text-slate-300 hover:text-white"
          >
            HALAMAN UTAMA
          </Link>
          <Link
            href="/#roadshow"
            className="px-2 py-1 rounded-lg text-slate-300 hover:text-white"
          >
            ROADSHOW &amp; NONTON DULUAN
          </Link>
          <Link
            href="/kabar-galeri"
            className="px-2 py-1 rounded-lg text-amber-300"
          >
            KABAR &amp; GALERI
          </Link>
        </div>
      </div>
    </header>
  );
}
