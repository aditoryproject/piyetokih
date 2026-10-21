import React from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getDb, getEffectiveCities } from '@/lib/db';
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

export const revalidate = 60;

export default async function HomePage() {
  let isAdmin = false;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    const session = await verifySessionToken(token);
    isAdmin = Boolean(session?.valid);
  } catch {}

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
      {/* 1. CINEMATIC HERO SPOTLIGHT SECTION (COMPACT & PROPORTIONAL) */}
      <section className="relative pt-8 sm:pt-12 pb-12 px-4 sm:px-6 overflow-hidden text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Miracle Pictures Studio Logo */}
          <div className="mb-2">
            <img
              src="/logo-miracle-pictures.webp"
              alt="Miracle Pictures"
              width={256}
              height={61}
              fetchPriority="high"
              decoding="sync"
              className="w-28 sm:w-32 h-auto object-contain mx-auto drop-shadow-md"
            />
            <p className="text-[10px] sm:text-[11px] font-black tracking-[0.35em] text-amber-400/90 uppercase mt-1.5">
              MEMPERSEMBAHKAN
            </p>
          </div>

          {/* Compact Cinematic Movie Logotype Header */}
          <div className="flex flex-col items-center justify-center my-1 sm:my-2">
            <h1 className="sr-only">PIYE TO KIH? THE MOVIE</h1>
            <img
              src="/logo-ptk.webp"
              alt="Logo Resmi Film PIYE TO KIH? THE MOVIE"
              width={480}
              height={302}
              fetchPriority="high"
              decoding="sync"
              className="w-48 sm:w-60 md:w-72 max-w-full h-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)] hover:scale-[1.02] transition-transform duration-300"
            />
          </div>

          {/* SUTRADARA TEXT */}
          <p className="text-[11px] sm:text-xs font-black tracking-[0.25em] uppercase text-slate-300 mt-1 mb-1">
            KARYA SUTRADARA <span className="text-white">ITO MAVIN</span>
          </p>

          {/* BERANGKAT KE BIOSKOP 19 NOVEMBER 2026 */}
          <div className="my-3 text-center">
            <span className="text-xs sm:text-base md:text-lg text-white font-extrabold uppercase tracking-[0.25em] block leading-tight">
              BERANGKAT KE BIOSKOP
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-emerald-400 block tracking-widest mt-1 drop-shadow-[0_4px_25px_rgba(52,211,153,0.35)]">
              19 NOVEMBER 2026
            </span>
            {/* LSF 13+ SENSOR RATING BADGE */}
            {(movieSettings?.showLsfBadge ?? true) && (
              <div className="inline-flex items-center gap-2 mt-2.5 px-3 py-0.5 rounded-full bg-slate-900/90 border border-red-500/30 shadow-lg shadow-red-950/20">
                <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-black text-[10px] tracking-wider uppercase">
                  {movieSettings?.lsfRatingText || '13+'}
                </span>
                <span className="text-[11px] font-bold text-slate-300 tracking-wide uppercase">
                  Lulus Sensor LSF • 13+
                </span>
              </div>
            )}
          </div>

          {/* CREDIT TITLE IMAGE (DI HERO SESUAI HALAMAN 2) */}
          <div className="my-2 max-w-xl sm:max-w-2xl w-full flex justify-center">
            <img
              src="/credit-title.webp"
              alt="Billing Block Credit Title PIYE TO KIH?"
              width={1024}
              height={144}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-contain opacity-90 hover:opacity-100 transition-opacity drop-shadow-md"
            />
          </div>

          {/* DUAL CTA BUTTONS SESUAI REVISI SUTRADARA (HALAMAN 4) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-3 w-full sm:w-auto">
            <a
              href="#presale"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all duration-200 active:scale-95"
            >
              <span>PRESALE &amp; BELI 1 GRATIS 1</span>
            </a>
            <a
              href="#roadshow"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white border border-white/10 font-bold text-xs uppercase tracking-wider shadow-lg transition-all duration-200 active:scale-95"
            >
              <span>JADWAL ROADSHOW &amp; NONTON DULUAN</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. SINOPSIS & KISAH FILM */}
      <MovieStorySection movieSettings={movieSettings || undefined} />

      {/* 3. OFFICIAL TEASER TRAILER PLAYER (DIPINDAHKAN KE BAWAH SINOPSIS SESUAI HALAMAN 5) */}
      <OfficialTrailerSection movieSettings={movieSettings || undefined} />

      {/* 4. PRESALE BUY 1 GET 1 (BOGO) SECTION DENGAN KUOTA & REMINDER */}
      <PresaleBogoSection initialCinemaLinks={db.settings.bogoCinemaLinks} />

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
      <RoadshowSection initialCities={getEffectiveCities(db)} />

      {/* 8. KABAR & DOKUMENTASI TERKINI */}
      <ArticlesSection initialArticles={(db.articles || []).filter(a => a.published)} />

      {/* 9. FOOTER RESMI */}
      <Footer initialSocialLinks={db.settings.socialLinks} />
    </div>
  );
}
