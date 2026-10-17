'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArticleRecord } from '@/lib/db';
import {
  Calendar,
  MapPin,
  Camera,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  Newspaper,
} from 'lucide-react';

export default function ArticlesSection() {
  const [articles, setArticles] = useState<ArticleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/articles?publishedOnly=true')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.articles)) {
          setArticles(data.articles);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && articles.length === 0) {
    return null;
  }

  // Preview articles (take up to 3 for mainpage)
  const displayArticles = articles.slice(0, 3);

  // Collect sample photos for the gallery showcase
  const allGalleryPhotos = articles
    .flatMap(a => a.galleryImages || [])
    .slice(0, 6);

  return (
    <section id="artikel" className="w-full mt-16 pt-12 border-t border-white/10 relative">
      {/* Subtle glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-gradient-to-b from-amber-600/10 via-red-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-amber-600/20 border border-amber-500/40 text-amber-300 text-xs font-black tracking-widest uppercase mb-4 shadow-md">
            <Newspaper className="w-3.5 h-3.5 text-amber-400" />
            <span>KABAR & DOKUMENTASI TERBARU</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-3">
            LIPUTAN ROADSHOW & <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              GALERI FOTO EKSKLUSIF
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Ikuti keseruan nonton bareng di bioskop mitra, hangatnya sesi Meet & Greet bersama para pemain, serta dokumentasi foto resmi dari setiap kota.
          </p>
        </div>

        {/* ARTICLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {displayArticles.map((article) => (
            <article
              key={article.id}
              className="bg-gradient-to-b from-[#141C2C] to-[#0A0E18] border border-white/10 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    loading="lazy"
                    decoding="async"
                    width={480}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider shadow">
                    {article.category}
                  </span>

                  {/* City Tag */}
                  {article.cityTag && (
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{article.cityTag}</span>
                    </span>
                  )}
                </div>

                {/* Article Content Preview */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      {article.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-500" />
                      {article.readTime || '3 menit'}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors line-clamp-2 mb-2 leading-snug">
                    <Link href={`/kabar-galeri/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="px-5 pb-5 pt-1">
                <Link
                  href={`/kabar-galeri/${article.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors group-hover:translate-x-1 transition-transform"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* PHOTO GALLERY STRIP HIGHLIGHT */}
        {allGalleryPhotos.length > 0 && (
          <div className="mb-10 bg-black/40 border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>DOKUMENTASI FOTO ROADSHOW</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Momen Kebersamaan Bersama Penonton
                </h3>
              </div>

              <Link
                href="/kabar-galeri"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition self-start sm:self-auto"
              >
                <span>Lihat Semua Galeri & Kabar</span>
                <ChevronRight className="w-4 h-4 text-amber-400" />
              </Link>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {allGalleryPhotos.map((photo, pIdx) => (
                <div
                  key={pIdx}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-900 border border-white/10 group cursor-pointer"
                >
                  <img
                    src={photo}
                    alt={`Dokumentasi Roadshow ${pIdx + 1}`}
                    loading="lazy"
                    decoding="async"
                    width={200}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-5 h-5 text-white drop-shadow" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW ALL BUTTON */}
        <div className="text-center">
          <Link
            href="/kabar-galeri"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold text-xs transition shadow-lg hover:shadow-amber-500/20 active:scale-95"
          >
            <Newspaper className="w-4 h-4" />
            <span>Lihat Seluruh Kabar & Galeri Film</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
