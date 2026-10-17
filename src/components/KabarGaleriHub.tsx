'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArticleRecord, KabarGaleriSettings } from '@/lib/db';
import { getYouTubeEmbedUrl } from '@/components/OfficialTrailerSection';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  FileText,
  Newspaper,
  Megaphone,
  Camera,
  Play,
  Download,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Film,
  Sparkles,
  Share2,
  Check,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface KabarGaleriHubProps {
  initialArticles?: ArticleRecord[];
  kabarGaleriSettings?: KabarGaleriSettings;
}

export default function KabarGaleriHub({
  initialArticles = [],
  kabarGaleriSettings,
}: KabarGaleriHubProps) {
  const [activeTab, setActiveTab] = useState<
    'kabar-film' | 'press-release' | 'media-coverage' | 'galeri-foto' | 'galeri-video'
  >('kabar-film');

  // Real-time client state for articles so reset/delete dummy reflects immediately
  const [articles, setArticles] = useState<ArticleRecord[]>(initialArticles);

  useEffect(() => {
    fetch('/api/articles?publishedOnly=true', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.articles)) {
          setArticles(data.articles);
        }
      })
      .catch(() => {});
  }, []);

  // Video Modal
  const [activeVideo, setActiveVideo] = useState<{ title: string; url: string } | null>(null);

  // Photo Lightbox Modal
  const [activeAlbum, setActiveAlbum] = useState<ArticleRecord | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Articles classification
  const featuredArticle = articles.find(a => a.featured) || (articles.length > 0 ? articles[0] : null);

  const kabarFilmArticles = articles.filter(
    a => a.category === 'Kabar Film' && a.id !== featuredArticle?.id
  );

  const pressReleaseArticles = articles.filter(
    a => a.category === 'Press Release'
  );

  const mediaCoverageArticles = articles.filter(
    a => a.category === 'Media Coverage'
  );

  const photoAlbums = articles.filter(
    a => a.category === 'Galeri Foto'
  );

  const videoArticles = articles.filter(
    a => a.category === 'Galeri Video'
  );

  // Dynamic Hero values from settings or featured article
  const isDefaultDummyTitle =
    kabarGaleriSettings?.heroTitle === 'PIYE TO KIH? Resmi Rilis Official Poster & Trailer';

  const heroCoverImage =
    featuredArticle?.coverImage ||
    kabarGaleriSettings?.heroCoverImage ||
    '/kabar-galeri-hero.jpg';

  const heroQuote =
    kabarGaleriSettings?.heroQuote ||
    '“Tentang kita, yang selalu mencari jalan pulang.”';

  const heroBadge =
    kabarGaleriSettings?.heroTaglineBadge ||
    'KABAR & GALERI';

  const heroTitle =
    featuredArticle?.title ||
    (!isDefaultDummyTitle && kabarGaleriSettings?.heroTitle
      ? kabarGaleriSettings.heroTitle
      : 'Kabar & Galeri Resmi Film PIYE TO KIH?');

  const heroExcerpt =
    featuredArticle?.summary ||
    (!isDefaultDummyTitle && kabarGaleriSettings?.heroExcerpt
      ? kabarGaleriSettings.heroExcerpt
      : 'Pusat informasi resmi penayangan bioskop film PIYE TO KIH?: liputan roadshow, galeri foto, video cuplikan, dan siaran pers resmi.');

  const heroCtaLink = featuredArticle?.slug
    ? `/kabar-galeri/${featuredArticle.slug}`
    : kabarGaleriSettings?.heroCtaLink && kabarGaleriSettings.heroCtaLink !== '/kabar-galeri'
    ? kabarGaleriSettings.heroCtaLink
    : '/#roadshow';

  const heroCtaText = featuredArticle
    ? (kabarGaleriSettings?.heroCtaText || 'Baca Selengkapnya')
    : 'Lihat Jadwal Roadshow';

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 antialiased">
      {/* 1. CINEMATIC HERO SPOTLIGHT / FEATURED STORY */}
      <section className="relative w-full h-[380px] sm:h-[460px] lg:h-[500px] overflow-hidden bg-slate-950">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url(${heroCoverImage})`,
          }}
        />

        {/* Gradient Overlays matching mock */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        {/* Top-Right Cinematic Tagline Quote */}
        {heroQuote && (
          <div className="absolute top-6 sm:top-10 right-6 sm:right-12 max-w-xs sm:max-w-sm text-right pointer-events-none hidden sm:block">
            <p className="font-serif italic text-amber-200/90 text-sm sm:text-base lg:text-lg drop-shadow-md leading-relaxed whitespace-pre-line">
              {heroQuote}
            </p>
          </div>
        )}

        {/* Hero Left Content Overlay */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-8 flex flex-col justify-end pb-8 sm:pb-12">
          <div className="max-w-2xl space-y-3">
            <span className="inline-block text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-amber-400">
              {heroBadge}
            </span>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-xl">
              {heroTitle}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200/90 line-clamp-3 leading-relaxed max-w-xl font-normal">
              {heroExcerpt}
            </p>

            <div className="pt-2">
              <Link
                href={heroCtaLink}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-transform active:scale-95"
              >
                <span>{heroCtaText}</span>
                <span>➔</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY NAVIGATION STRIP (WHITE/CREAM HORIZONTAL BAR) */}
      <nav className="sticky top-16 z-30 bg-[#FAF8F5] border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center space-x-2 sm:space-x-8 overflow-x-auto scrollbar-none py-1">
            {/* 1. Kabar Film */}
            <button
              onClick={() => setActiveTab('kabar-film')}
              className={`flex items-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'kabar-film'
                  ? 'border-amber-600 text-amber-900 font-extrabold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Kabar Film</span>
            </button>

            {/* 2. Press Release */}
            <button
              onClick={() => setActiveTab('press-release')}
              className={`flex items-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'press-release'
                  ? 'border-amber-600 text-amber-900 font-extrabold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Newspaper className="w-4 h-4 text-slate-500" />
              <span>Press Release</span>
            </button>

            {/* 3. Media Coverage */}
            <button
              onClick={() => setActiveTab('media-coverage')}
              className={`flex items-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'media-coverage'
                  ? 'border-amber-600 text-amber-900 font-extrabold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Megaphone className="w-4 h-4 text-slate-500" />
              <span>Media Coverage</span>
            </button>

            {/* 4. Galeri Foto */}
            <button
              onClick={() => setActiveTab('galeri-foto')}
              className={`flex items-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'galeri-foto'
                  ? 'border-amber-600 text-amber-900 font-extrabold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-4 h-4 text-slate-500" />
              <span>Galeri Foto</span>
            </button>

            {/* 5. Galeri Video */}
            <button
              onClick={() => setActiveTab('galeri-video')}
              className={`flex items-center gap-2 py-3.5 px-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'galeri-video'
                  ? 'border-amber-600 text-amber-900 font-extrabold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Play className="w-4 h-4 text-slate-500" />
              <span>Galeri Video</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 3. MAIN CONTENT BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-12">
        {/* ==================== TAB 1: KABAR FILM (DEFAULT) ==================== */}
        {activeTab === 'kabar-film' && (
          <div className="space-y-12">
            {/* Top Grid: Kabar Film (75%) + Media Center Card (25%) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Kabar Film 4 Cards */}
              <div className="lg:col-span-9 space-y-4">
                <div className="flex items-end justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Kabar Film
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Berita terbaru seputar film PIYE TO KIH?
                    </p>
                  </div>
                  <Link
                    href="/kabar-galeri"
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 transition flex items-center gap-1"
                  >
                    <span>Lihat Semua Berita</span>
                    <span>➔</span>
                  </Link>
                </div>

                {/* 4 Cards in 1 Row / Responsive Grid */}
                {kabarFilmArticles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {kabarFilmArticles.slice(0, 4).map(article => (
                      <Link
                        key={article.id}
                        href={`/kabar-galeri/${article.slug}`}
                        className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                      >
                        <div>
                          {/* Thumbnail with Badge */}
                          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow">
                              {article.tag || article.cityTag || 'BERITA'}
                            </span>
                          </div>

                          {/* Title & Metadata */}
                          <div className="p-3.5 space-y-2">
                            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                              {article.title}
                            </h3>

                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>
                                {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                              {article.summary}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                      <FileText className="w-5 h-5" />
                    </div>
                    <p className="font-extrabold text-xs sm:text-sm text-slate-800">Belum ada artikel kabar yang diterbitkan</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">Rilis berita dan pengumuman resmi film akan segera hadir di sini.</p>
                  </div>
                )}
              </div>

              {/* Right Column: Media Center Card (25%) */}
              <div className="lg:col-span-3">
                <Link
                  href="/media"
                  className="group relative rounded-2xl overflow-hidden bg-[#0F141C] text-white p-6 shadow-xl border border-slate-800 hover:border-amber-500/50 flex flex-col justify-between min-h-[300px] transition-all block cursor-pointer"
                >
                  {/* Subtle Background Pattern */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('/kabar-galeri/media-center-card.jpg')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0F141C]/80 to-transparent" />

                  <div className="relative z-10 space-y-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-amber-300 border border-white/10">
                      UNTUK MEDIA &amp; PERS
                    </span>

                    <h3 className="text-xl font-black tracking-tight text-white uppercase group-hover:text-amber-400 transition-colors">
                      Media Center
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Unduh materi resmi untuk media &amp; pers, seperti press kit, foto, logo, dan materi promosi lainnya.
                    </p>
                  </div>

                  <div className="relative z-10 pt-6">
                    <span className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 group-hover:from-amber-400 group-hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition">
                      <span>Buka Media Center</span>
                      <span className="group-hover:translate-x-1 transition-transform">➔</span>
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Bottom Row: Galeri Foto & Galeri Video Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              {/* Left Side: Galeri Foto (45%) */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-end justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-amber-600" />
                      <span>Galeri Foto</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Momen-momen spesial dari perjalanan film PIYE TO KIH?
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('galeri-foto')}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 transition flex items-center gap-1"
                  >
                    <span>Lihat Semua Foto</span>
                    <span>➔</span>
                  </button>
                </div>

                {/* 3 Photo Album Cards */}
                {photoAlbums.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {photoAlbums.slice(0, 3).map((album, idx) => (
                      <div
                        key={album.id || idx}
                        onClick={() => {
                          setActiveAlbum(album);
                          setLightboxIndex(0);
                        }}
                        className="group cursor-pointer relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm hover:shadow-md"
                      >
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                        <div className="absolute bottom-2 left-2 right-2 space-y-0.5">
                          <span className="block text-[10px] sm:text-xs font-black text-white truncate leading-tight">
                            {album.title}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-300">
                            <Camera className="w-2.5 h-2.5" />
                            <span>{album.photoCount || (album.galleryImages ? album.galleryImages.length : 1)} Foto</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-1 shadow-sm">
                    <Camera className="w-6 h-6 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">Belum ada album foto tersimpan</p>
                  </div>
                )}
              </div>

              {/* Right Side: Galeri Video (55%) */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-end justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Play className="w-5 h-5 text-amber-600 fill-amber-600" />
                      <span>Galeri Video</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tonton video terbaru seputar film PIYE TO KIH?
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('galeri-video')}
                    className="text-xs font-bold text-amber-700 hover:text-amber-900 transition flex items-center gap-1"
                  >
                    <span>Lihat Semua Video</span>
                    <span>➔</span>
                  </button>
                </div>

                {/* 4 Video Cards */}
                {videoArticles.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {videoArticles.slice(0, 4).map(video => (
                      <div
                        key={video.id}
                        onClick={() =>
                          setActiveVideo({
                            title: video.title,
                            url: video.videoUrl || 'https://www.youtube.com/watch?v=kYJv8Pj328Q',
                          })
                        }
                        className="group cursor-pointer bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                      >
                        {/* Video Thumbnail */}
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                          <img
                            src={video.coverImage}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition" />

                          {/* Play Icon */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-black/60 border border-white/40 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-black transition shadow-lg">
                              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                            </div>
                          </div>

                          {/* Duration */}
                          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono font-bold text-white">
                            {video.videoDuration || '2:24'}
                          </span>
                        </div>

                        <div className="p-2">
                          <span className="block text-[11px] font-bold text-slate-900 group-hover:text-amber-600 line-clamp-1 leading-snug">
                            {video.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-1 shadow-sm">
                    <Play className="w-6 h-6 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">Belum ada video arsip tersimpan</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: PRESS RELEASE ==================== */}
        {activeTab === 'press-release' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Newspaper className="w-6 h-6 text-amber-600" />
                  <span>Siaran Pers Resmi (Press Release)</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Pernyataan resmi Miracle Pictures untuk rekan media, wartawan, dan pers nasional.
                </p>
              </div>

              <Link
                href="/media"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
              >
                <span>Buka Press Kit Media Center</span>
                <span>➔</span>
              </Link>
            </div>

            {pressReleaseArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pressReleaseArticles.map(pr => (
                  <div
                    key={pr.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 border border-red-200">
                        PRESS RELEASE
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(pr.publishedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug hover:text-amber-600 transition">
                      <Link href={`/kabar-galeri/${pr.slug}`}>{pr.title}</Link>
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {pr.summary}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link
                        href={`/kabar-galeri/${pr.slug}`}
                        className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1"
                      >
                        <span>Baca Siaran Pers Lengkap</span>
                        <span>➔</span>
                      </Link>

                      {pr.pdfUrl && (
                        <a
                          href={pr.pdfUrl}
                          download
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh PDF</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Newspaper className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">Belum Ada Siaran Pers Resmi</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Siaran pers dan materi rilis resmi akan diterbitkan segera oleh Miracle Pictures.</p>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 3: MEDIA COVERAGE ==================== */}
        {activeTab === 'media-coverage' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-amber-600" />
                <span>Media Coverage &amp; Ulasan Publik</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Kumpulan liputan, wawancara, podcast, dan ulasan film PIYE TO KIH? dari berbagai media terpercaya.
              </p>
            </div>

            {mediaCoverageArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mediaCoverageArticles.map(mc => (
                  <div
                    key={mc.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                          {mc.mediaName || 'Media Nasional'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {mc.tag || 'LIPUTAN'}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2">
                        {mc.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {mc.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {new Date(mc.publishedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>

                      {mc.externalUrl && (
                        <a
                          href={mc.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-800 transition"
                        >
                          <span>Lihat Liputan</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Megaphone className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">Belum Ada Liputan Media Terdaftar</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Liputan dan pemberitaan media massa mengenai film akan diperbarui secara berkala.</p>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 4: GALERI FOTO ==================== */}
        {activeTab === 'galeri-foto' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Camera className="w-6 h-6 text-amber-600" />
                <span>Dokumentasi Album Foto</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Koleksi foto resmi kemeriahan roadshow, konferensi pers, dan penayangan perdana film PIYE TO KIH?.
              </p>
            </div>

            {photoAlbums.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photoAlbums.map((album, idx) => (
                  <div
                    key={album.id || idx}
                    onClick={() => {
                      setActiveAlbum(album);
                      setLightboxIndex(0);
                    }}
                    className="group cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-white/10 text-white text-[11px] font-bold inline-flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-amber-400" />
                        <span>{album.photoCount || (album.galleryImages ? album.galleryImages.length : 1)} Foto</span>
                      </span>

                      {album.location && (
                        <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                          {album.location}
                        </span>
                      )}
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-amber-600 transition">
                        {album.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {album.summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">Belum Ada Album Foto Tersimpan</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Dokumentasi foto resmi akan diunggah dan dapat dilihat langsung di sini.</p>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 5: GALERI VIDEO ==================== */}
        {activeTab === 'galeri-video' && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Play className="w-6 h-6 text-amber-600 fill-amber-600" />
                <span>Pustaka Video Resmi</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Koleksi video trailer, video musik OST, rekaman di balik layar, dan rekap antusiasme penonton roadshow.
              </p>
            </div>

            {videoArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {videoArticles.map(video => (
                  <div
                    key={video.id}
                    onClick={() =>
                      setActiveVideo({
                        title: video.title,
                        url: video.videoUrl || 'https://www.youtube.com/watch?v=kYJv8Pj328Q',
                      })
                    }
                    className="group cursor-pointer bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <img
                        src={video.coverImage}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center group-hover:scale-110 shadow-xl transition">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>

                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-white">
                        {video.videoDuration || '2:24'}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">
                        {video.tag || 'VIDEO'}
                      </span>
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 group-hover:text-amber-600 line-clamp-2 leading-snug">
                        {video.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Play className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">Belum Ada Video Tersimpan</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">Trailer, video musik, dan rekaman behind the scenes akan segera ditambahkan.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================== LIGHTBOX MODAL UNTUK ALBUM FOTO ==================== */}
      {activeAlbum && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md animate-in fade-in">
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-3">
            <div>
              <h3 className="font-black text-sm sm:text-base">{activeAlbum.title}</h3>
              <p className="text-xs text-slate-400">
                Foto {lightboxIndex + 1} dari{' '}
                {activeAlbum.galleryImages?.length || 1}
              </p>
            </div>
            <button
              onClick={() => setActiveAlbum(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Center Image with Prev / Next */}
          <div className="relative flex-1 flex items-center justify-center my-4">
            <button
              onClick={() =>
                setLightboxIndex(prev =>
                  prev > 0 ? prev - 1 : (activeAlbum.galleryImages?.length || 1) - 1
                )
              }
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition border border-white/10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={
                activeAlbum.galleryImages?.[lightboxIndex] ||
                activeAlbum.coverImage
              }
              alt={activeAlbum.title}
              className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            <button
              onClick={() =>
                setLightboxIndex(prev =>
                  prev < (activeAlbum.galleryImages?.length || 1) - 1 ? prev + 1 : 0
                )
              }
              className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition border border-white/10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
            {(activeAlbum.galleryImages || [activeAlbum.coverImage]).map(
              (img, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition ${
                    lightboxIndex === idx ? 'border-amber-500 scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* ==================== VIDEO PLAYER MODAL ==================== */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
              <span className="font-bold text-sm truncate">{activeVideo.title}</span>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embed Video */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.url, true, false)}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
