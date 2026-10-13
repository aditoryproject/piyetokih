import type { Metadata } from 'next';
import './globals.css';
import MetaPixelTracker from '@/components/MetaPixelTracker';
import Link from 'next/link';
import { Film, Ticket } from 'lucide-react';

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
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center text-black font-black shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <span className="block font-black text-sm tracking-wider text-white">
                  PIYE TO KIH?
                </span>
                <span className="text-[10px] text-gold-400 font-medium tracking-widest uppercase">
                  MIRACLE PICTURES
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/#roadshow"
                className="hidden sm:inline-flex px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 font-semibold text-xs transition"
              >
                Roadshow 17 Kota
              </Link>
              <Link
                href="/artikel"
                className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-amber-300 hover:bg-white/5 font-semibold text-xs transition"
              >
                Kabar & Galeri
              </Link>
              <Link
                href="/#war"
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition active:scale-95"
              >
                Klaim E-Voucher
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-screen">{children}</main>

        {/* Minimal Footer */}
        <footer className="border-t border-white/10 bg-black/90 py-8 px-4 text-center text-xs text-gray-500">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400">
              PIYE TO KIH? THE MOVIE • Miracle Pictures
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a
                href="https://www.instagram.com/piyetokihfilm.official/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-400 transition"
              >
                @piyetokihfilm.official
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
