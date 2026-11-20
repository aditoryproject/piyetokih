import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MapPin, Film } from 'lucide-react';
import { getDb } from '@/lib/db';
import CinemaFlyersGallery from '@/components/CinemaFlyersGallery';
import { FAST_TRACK_TICKET_LINKS } from '@/lib/bot-knowledge';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Lokasi Bioskop Tayang (19 November 2026)',
  description:
    'Daftar lengkap lokasi bioskop penayangan serentak film komedi PIYE TO KIH? THE MOVIE mulai 19 November 2026 di Cinema XXI, CGV, Cinépolis, Sam\'s Studios, NSC, Platinum Cineplex, dan bioskop mitra seluruh Indonesia.',
};

export default function LokasiBioskopPage() {
  const db = getDb();
  const instagramUrl =
    db.settings.socialLinks?.instagram ||
    'https://www.instagram.com/piyetokihfilm.official/';
  const ticketUrl =
    db.settings.bogoCinemaLinks?.xxi ||
    db.settings.bogoDefaultTicketLink ||
    FAST_TRACK_TICKET_LINKS.xxi;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white py-10 sm:py-14 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Top Breadcrumb / Back */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Utama</span>
          </Link>
          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] sm:text-xs font-black uppercase tracking-wider">
            Tayang Serentak 19 November 2026
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-black uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" />
            <span>Daftar Resmi Bioskop Seluruh Indonesia</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Lokasi Bioskop <span className="text-amber-400">PIYE TO KIH?</span>
          </h1>
          <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
            Cari kota atau nama bioskop yang menayangkan film{' '}
            <strong className="text-white">PIYE TO KIH? THE MOVIE</strong> mulai{' '}
            <strong className="text-emerald-400">19 November 2026</strong> di seluruh Indonesia.
          </p>
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>
              XXI • CGV • Cinépolis • Sam&apos;s Studios • NSC • Platinum Cineplex • Bioskop Mitra Nasional
            </span>
          </div>
        </div>

        {/* Interactive Search + City & Cinema List */}
        <CinemaFlyersGallery
          instagramUrl={instagramUrl}
          ticketUrl={ticketUrl}
          flyerLinks={db.settings.flyerLinks}
        />
      </div>
    </div>
  );
}
