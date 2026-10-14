import type { Metadata } from 'next';
import './globals.css';
import MetaPixelTracker from '@/components/MetaPixelTracker';
import Link from 'next/link';
import { Film } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PIYE TO KIH? - Official Movie & War Voucher',
  description: 'Landing page resmi film komedi bioskop Piye Toh Kih oleh Miracle Pictures. Klaim War Voucher spesial penayangan bioskop!',
  keywords: 'Piye To Kih, Miracle Pictures, Film Bioskop, War Voucher, Tiket Bioskop',
  referrer: 'strict-origin-when-cross-origin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased bg-[#0B0F17] text-white selection:bg-gold-500 selection:text-black">
        <MetaPixelTracker />

        {/* Cinematic Clean Header */}
        <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group py-1" title="PIYE TO KIH? THE MOVIE - Miracle Pictures">
              <img
                src="/logo-ptk.png"
                alt="Logo Resmi Film PIYE TO KIH?"
                className="h-9 sm:h-11 w-auto max-w-[140px] sm:max-w-[170px] object-contain drop-shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="leading-tight hidden sm:block border-l border-white/15 pl-2.5">
                <span className="block font-black text-[11px] tracking-wider text-white uppercase">
                  THE MOVIE
                </span>
                <span className="text-[9px] text-amber-400 font-bold tracking-widest uppercase block">
                  MIRACLE PICTURES
                </span>
              </div>
            </Link>

            {/* Desktop Nav: Only Home, Jadwal Roadshow, Kabar & Galeri */}
            <div className="hidden md:flex items-center gap-1.5 lg:gap-3">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-xs sm:text-sm transition"
              >
                Home
              </Link>
              <Link
                href="/#roadshow"
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-xs sm:text-sm transition"
              >
                Jadwal Roadshow
              </Link>
              <Link
                href="/kabar-galeri"
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-amber-300 hover:bg-white/5 font-semibold text-xs sm:text-sm transition"
              >
                Kabar &amp; Galeri
              </Link>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex md:hidden items-center gap-1">
              <Link
                href="/"
                className="px-2 py-1 rounded-lg text-slate-300 hover:text-white font-semibold text-xs"
              >
                Home
              </Link>
              <Link
                href="/#roadshow"
                className="px-2 py-1 rounded-lg text-slate-300 hover:text-white font-semibold text-xs"
              >
                Jadwal Roadshow
              </Link>
              <Link
                href="/kabar-galeri"
                className="px-2 py-1 rounded-lg text-amber-300 font-semibold text-xs"
              >
                Kabar &amp; Galeri
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
