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
                className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 font-semibold text-xs transition"
              >
                Roadshow 17 Kota
              </Link>
              <Link
                href="/artikel"
                className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-amber-300 hover:bg-white/5 font-semibold text-xs transition"
              >
                Kabar &amp; Galeri
              </Link>
              <Link
                href="/#presale"
                className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-extrabold text-xs transition active:scale-95"
              >
                Presale Buy 1 Get 1
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
