import React from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import ComingSoonView from '@/components/ComingSoonView';
import RoadshowSection from '@/components/RoadshowSection';
import ArticlesSection from '@/components/ArticlesSection';
import OfficialTrailerSection from '@/components/OfficialTrailerSection';
import MovieStorySection from '@/components/MovieStorySection';
import CastSection from '@/components/CastSection';
import PresaleBogoSection from '@/components/PresaleBogoSection';
import Footer from '@/components/Footer';
import { Film, Ticket } from 'lucide-react';

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  const isAdmin = session.valid;

  const db = getDb();
  const isMaintenanceMode = Boolean(db.settings.isMaintenanceMode);

  // Jika Mode Coming Soon aktif dan bukan admin, tampilkan Coming Soon
  if (isMaintenanceMode && !isAdmin) {
    return (
      <ComingSoonView
        headline={db.settings.maintenanceHeadline}
        subtitle={db.settings.maintenanceSubtitle}
        socialLinks={db.settings.socialLinks}
      />
    );
  }

  const movieSettings = db.settings.movieSettings;

  return (
    <div id="top" className="relative overflow-hidden min-h-screen">
      {/* 1. CINEMATIC HERO SPOTLIGHT SECTION (LAYOUT PERSIS HALAMAN 2) */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Miracle Pictures Studio Logo */}
          <div className="mb-2">
            <img
              src="/logo-miracle-pictures.png"
              alt="Miracle Pictures"
              className="w-40 sm:w-48 h-auto object-contain mx-auto drop-shadow-md"
            />
            <p className="text-[11px] sm:text-xs font-black tracking-[0.35em] text-amber-400/90 uppercase mt-2">
              MEMPERSEMBAHKAN
            </p>
          </div>

          {/* Big Cinematic Movie Logotype Header */}
          <div className="flex flex-col items-center justify-center my-2 sm:my-3">
            <h1 className="sr-only">PIYE TO KIH? THE MOVIE</h1>
            <img
              src="/logo-ptk.png"
              alt="Logo Resmi Film PIYE TO KIH? THE MOVIE"
              className="w-72 sm:w-96 md:w-[480px] lg:w-[540px] max-w-full h-auto object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)] filter hover:scale-[1.02] transition-transform duration-300"
            />
          </div>

          {/* SUTRADARA TEXT */}
          <p className="text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-slate-300 mt-2 mb-1">
            KARYA SUTRADARA <span className="text-white">ITO MAVIN</span>
          </p>

          {/* BERANGKAT KE BIOSKOP 19 NOVEMBER 2026 */}
          <div className="my-2 text-center">
            <span className="text-xs sm:text-sm text-white font-extrabold uppercase tracking-[0.25em] block leading-tight">
              BERANGKAT KE BIOSKOP
            </span>
            <span className="text-sm sm:text-lg font-black text-emerald-400 block tracking-widest mt-0.5">
              19 NOVEMBER 2026
            </span>
            {/* LSF 13+ SENSOR RATING BADGE */}
            {(movieSettings?.showLsfBadge ?? true) && (
              <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-slate-900/90 border border-red-500/30 shadow-lg shadow-red-950/20">
                <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[10px] tracking-wider uppercase">
                  {movieSettings?.lsfRatingText || '13+'}
                </span>
                <span className="text-[11px] font-bold text-slate-300 tracking-wide uppercase">
                  Lulus Sensor LSF • 13+
                </span>
              </div>
            )}
          </div>

          {/* CREDIT TITLE IMAGE (DI HERO SESUAI HALAMAN 2) */}
          <div className="my-3 max-w-2xl sm:max-w-3xl w-full flex justify-center">
            <img
              src="/credit-title.png"
              alt="Billing Block Credit Title PIYE TO KIH?"
              className="w-full h-auto object-contain opacity-90 hover:opacity-100 transition-opacity drop-shadow-md"
            />
          </div>

          {/* CTA BUTTON KE BUY 1 GET 1 */}
          <div className="flex justify-center mt-2">
            <a
              href="#presale"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-amber-500/20 transition-all duration-200 active:scale-95"
            >
              <span>PRESALE &amp; BELI 1 GRATIS 1</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. SINOPSIS & KISAH FILM */}
      <MovieStorySection movieSettings={movieSettings || undefined} />

      {/* 3. OFFICIAL TEASER TRAILER PLAYER (DIPINDAHKAN KE BAWAH SINOPSIS SESUAI HALAMAN 5) */}
      <OfficialTrailerSection movieSettings={movieSettings || undefined} />

      {/* 4. PRESALE BUY 1 GET 1 (BOGO) SECTION DENGAN KUOTA & REMINDER */}
      <PresaleBogoSection />

      {/* 5. PEMERAN & KARAKTER RESMI (14 CAST SESUAI HALAMAN 6) */}
      <CastSection castList={movieSettings?.cast} />

      {/* 6. RE-ENGAGEMENT CTA (HALAMAN 7) */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto p-8 sm:p-10 rounded-3xl border border-white/10 bg-[#101217] shadow-2xl space-y-4">
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Kalau Bisa Ketawa Bareng, Kenapa Harus Sendirian?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Jangan sampai nonton sendirian. Ajak teman, keluarga, atau komunitasmu dan bersiap nonton PIYE TO KIH? di bioskop mulai 19 November 2026.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href="#presale"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition active:scale-95"
            >
              <Ticket className="w-4 h-4" />
              <span>Pasang Pengingat Presale &amp; Buy 1 Get 1</span>
            </a>
          </div>
        </div>
      </section>

      {/* 7. ROADSHOW 17 KOTA RESMI (HALAMAN 8 & 9) */}
      <RoadshowSection />

      {/* 8. KABAR & DOKUMENTASI TERKINI */}
      <ArticlesSection />

      {/* 9. FOOTER RESMI (CONTAINER DI ATASNYA SUDAH DIHAPUS SESUAI HALAMAN 9) */}
      <Footer />
    </div>
  );
}
