'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { trackTicketIntent } from '@/lib/pixel';
import CinemaPartnersStrip from '@/components/CinemaPartnersStrip';
import OfficialTrailerSection from '@/components/OfficialTrailerSection';
import MovieStorySection from '@/components/MovieStorySection';
import CastSection from '@/components/CastSection';
import {
  Film,
  Calendar,
  ExternalLink,
  Users,
  Sparkles,
  Ticket,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  ChevronLeft,
} from 'lucide-react';

interface CinemaPartner {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  color: string;
  defaultUrl: string;
}

const CINEMA_PARTNERS: CinemaPartner[] = [
  {
    id: 'xxi',
    name: 'Cinema XXI / 21 Cineplex',
    tagline: 'Gunakan m.tix atau beli langsung di loket kasir XXI',
    badge: 'M-TIX PARTNER',
    color: 'from-amber-600 to-yellow-500',
    defaultUrl: 'https://m.21cineplex.com',
  },
  {
    id: 'cgv',
    name: 'CGV Cinemas',
    tagline: 'Pesan melalui aplikasi CGV atau loket CGV terdekat',
    badge: 'CGV APP',
    color: 'from-red-600 to-rose-500',
    defaultUrl: 'https://www.cgv.id',
  },
  {
    id: 'cinepolis',
    name: 'Cinépolis Cinemas',
    tagline: 'Tersedia di web Cinépolis & seluruh bioskop mitra',
    badge: 'CINÉPOLIS WEB',
    color: 'from-blue-600 to-indigo-500',
    defaultUrl: 'https://cinepolis.co.id',
  },
  {
    id: 'tixid',
    name: 'TIX ID Official Partner',
    tagline: 'Beli tiket promo online di aplikasi TIX ID',
    badge: 'ONLINE TICKETING',
    color: 'from-emerald-600 to-teal-500',
    defaultUrl: 'https://www.tix.id',
  },
];

export default function BogoPromoPage() {
  const [settings, setSettings] = useState<any>({
    bogoHeadline: 'PROMO BUY 1 GET 1: NONTON BERDUA BAYAR 1 TIKET',
    bogoSubtitle: 'Ajak pasangan, bestie, atau keluarga nonton film komedi drama PIYE TO KIH di bioskop kesayanganmu!',
    bogoDefaultTicketLink: 'https://m.21cineplex.com',
    bogoCinemaLinks: {},
    bogoBannerUrl: '',
    voucherValidDatesText: '19 - 20 November 2026 (Penayangan Perdana)',
    movieSettings: null,
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const handlePartnerClick = (partnerName: string, targetUrl: string) => {
    trackTicketIntent('Nasional', `BOGO - ${partnerName}`, targetUrl);
  };

  const getPartnerUrl = (partnerId: string, fallback: string) => {
    if (settings.bogoCinemaLinks && settings.bogoCinemaLinks[partnerId]) {
      return settings.bogoCinemaLinks[partnerId];
    }
    return settings.bogoDefaultTicketLink || fallback;
  };

  const bannerImage =
    settings.bogoBannerUrl ||
    settings.movieSettings?.posterUrl ||
    settings.movieSettings?.backdropUrl ||
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80';

  const defaultTicketUrl = settings.bogoDefaultTicketLink || 'https://m.21cineplex.com';

  return (
    <div className="relative min-h-screen">
      {/* 1. CINEMA PARTNERS STRIP */}
      <CinemaPartnersStrip />

      {/* 2. BOGO HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 px-4 sm:px-6">
        {/* Background ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[520px] bg-gradient-to-b from-red-600/20 via-amber-600/15 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto text-center">
          {/* Top Switcher Back to Main Page */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Halaman Utama</span>
            </Link>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600/20 to-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-black tracking-widest uppercase mb-4 shadow-lg">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>PROMO SPESIAL NONTON BERDUA</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase drop-shadow-2xl mb-3">
            BUY 1 GET 1 FREE <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              PIYE TO KIH? THE MOVIE
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mb-6 leading-relaxed">
            {settings.bogoSubtitle ||
              'Ajak pasangan, bestie, atau keluarga nonton seru film komedi drama PIYE TO KIH di bioskop! Beli 1 tiket harga reguler, gratis 1 tiket tambahan.'}
          </p>

          {/* Dates Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-200 bg-black/60 px-5 py-2 rounded-full border border-amber-500/30 mb-8 shadow-md">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Periode Promo: {settings.voucherValidDatesText || '19 - 20 November 2026 (Penayangan Perdana)'}</span>
          </div>

          {/* Hero Visual Card (Inherited Poster / Uploaded BOGO Banner) */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-black aspect-[16/9] mb-10 group shadow-amber-500/10">
            <img
              src={bannerImage}
              alt="Promo Buy 1 Get 1 Piye To Kih Miracle Pictures"
              className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
              onError={(e: any) => {
                e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Floating Sticker Effect */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-white/20 uppercase tracking-wider">
              ★ PROMO TERBATAS ★
            </div>

            <div className="absolute bottom-5 left-0 right-0 px-5 text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 block mb-1">
                MIRACLE PICTURES PRESENTS
              </span>
              <p className="text-lg sm:text-2xl font-black text-white drop-shadow-md">
                BELI 1 TIKET, GRATIS 1 TIKET
              </p>
              <p className="text-xs text-gray-300 font-medium mt-0.5">
                Langsung klik bioskop pilihan Anda di bawah untuk mengamankan kursi!
              </p>
            </div>
          </div>

          {/* PRIMARY DIRECT CTA BUTTON */}
          <div className="mb-12">
            <a
              href={defaultTicketUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handlePartnerClick('Primary Direct', defaultTicketUrl)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-base py-4 px-10 rounded-2xl shadow-2xl transition transform active:scale-95"
            >
              <Ticket className="w-5 h-5" />
              <span>BELI TIKET BUY 1 GET 1 BIOSKOP SEKARANG</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
            <span className="block text-[11px] text-gray-400 mt-2 font-medium">
              *Otomatis diarahkan ke sistem ticketing bioskop resmi mitra
            </span>
          </div>

          {/* CINEMA PARTNER CARDS */}
          <div className="text-left mb-12">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-400" />
                <span>Pilih Bioskop Mitra Penayangan:</span>
              </h3>
              <span className="text-[11px] text-gray-400">Klik untuk beli</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {CINEMA_PARTNERS.map(partner => {
                const targetUrl = getPartnerUrl(partner.id, partner.defaultUrl);

                return (
                  <a
                    key={partner.id}
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handlePartnerClick(partner.name, targetUrl)}
                    className="group bg-gradient-to-b from-[#181F30] to-[#0D121F] border border-white/10 hover:border-amber-500/50 rounded-2xl p-4.5 transition-all shadow-lg hover:shadow-amber-500/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-amber-300">
                          {partner.badge}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-400 transition" />
                      </div>

                      <h4 className="text-base font-extrabold text-white group-hover:text-amber-300 transition">
                        {partner.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                        {partner.tagline}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-amber-400">
                      <span>Beli Tiket Promo</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* TERMS & VERIFICATION CARD */}
          <div className="bg-black/50 border border-white/10 rounded-2xl p-5 text-left text-xs text-gray-400 space-y-2 mb-8">
            <div className="flex items-center gap-2 text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ketentuan Promo Buy 1 Get 1 Film Piye To Kih:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-300 text-[11px] leading-relaxed">
              <li>Promo berlaku selama kuota kursi promo masih tersedia pada penayangan perdana.</li>
              <li>Satu transaksi pembelian tiket reguler berhak mendapatkan 1 tiket gratis tambahan di studio yang sama.</li>
              <li>Dapat ditukarkan langsung di loket kasir bioskop mitra atau via aplikasi ticketing mitra resmi.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. OFFICIAL TEASER TRAILER PLAYER (GLOBAL INHERITANCE) */}
      <OfficialTrailerSection movieSettings={settings.movieSettings || undefined} />

      {/* 4. SINOPSIS & KISAH FILM (GLOBAL INHERITANCE) */}
      <MovieStorySection movieSettings={settings.movieSettings || undefined} />

      {/* 5. PEMERAN & KARAKTER RESMI (GLOBAL INHERITANCE) */}
      <CastSection castList={settings.movieSettings?.cast} />

      {/* 6. RE-ENGAGEMENT CTA */}
      <section className="py-12 px-4 text-center bg-gradient-to-b from-transparent to-amber-950/20">
        <div className="max-w-2xl mx-auto p-8 rounded-3xl border border-amber-500/30 bg-black/60 backdrop-blur-xl shadow-2xl space-y-4">
          <p className="text-xs font-black uppercase tracking-widest text-amber-400">PROMO BUY 1 GET 1 BIOSKOP</p>
          <h3 className="text-2xl sm:text-3xl font-black text-white">Jangan Lewatkan Penayangan Perdana!</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Segera amankan tiket promo Anda di bioskop kesayangan sebelum kuota habis.
          </p>
          <a
            href={defaultTicketUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handlePartnerClick('Footer Re-engagement', defaultTicketUrl)}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm tracking-wide shadow-xl shadow-amber-500/20 transition active:scale-95"
          >
            <Ticket className="w-4 h-4" />
            <span>BELI TIKET BUY 1 GET 1 SEKARANG</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
