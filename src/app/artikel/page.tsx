import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getDb } from '@/lib/db';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  Newspaper,
  Camera,
  Film,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kabar & Galeri Foto Roadshow Film PIYE TO KIH? - Miracle Pictures',
  description: 'Liputan dokumentasi kemeriahan tur roadshow, nobar perdana, temu sapa (Meet & Greet) para pemain film PIYE TO KIH di 17 kota bioskop mitra.',
  keywords: 'Roadshow Piye To Kih, Foto Nobar Piye To Kih, Meet and Greet Piye To Kih, Miracle Pictures, Film Bioskop Indonesia',
  openGraph: {
    title: 'Kabar & Galeri Foto Roadshow Film PIYE TO KIH?',
    description: 'Dokumentasi keseruan roadshow dan nobar para pemain film komedi drama PIYE TO KIH di 17 kota.',
    images: ['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80'],
  },
};

export default function ArticlesPage() {
  const db = getDb();
  const articles = (db.articles || []).filter(a => a.isPublished);

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[450px] bg-gradient-to-b from-amber-600/15 via-red-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-amber-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda Utama</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-gold-400 text-xs font-bold tracking-widest uppercase mb-4">
            <Newspaper className="w-3.5 h-3.5" />
            <span>KABAR RESMI & DOKUMENTASI MEDIA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight mb-4">
            LIPUTAN ROADSHOW & <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              GALERI FOTO RESMI
            </span>
          </h1>

          <p className="text-sm text-gray-300 leading-relaxed">
            Ikuti perjalanan tur roadshow film komedi drama "PIYE TO KIH?" di 17 kota. Simak cerita keseruan, antusiasme penonton, dan foto eksklusif bersama para pemain.
          </p>
        </div>

        {/* Articles List */}
        {articles.length === 0 ? (
          <div className="text-center py-20 bg-black/40 rounded-3xl border border-white/10">
            <p className="text-gray-400 text-sm">Belum ada artikel yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider shadow">
                      {article.category}
                    </span>

                    {article.cityTag && (
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{article.cityTag}</span>
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
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

                    <h2 className="text-base font-black text-white group-hover:text-amber-300 transition-colors line-clamp-2 mb-2 leading-snug">
                      <Link href={`/artikel/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                {/* Footer link */}
                <div className="px-5 pb-5 pt-1">
                  <Link
                    href={`/artikel/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors group-hover:translate-x-1 transition-transform"
                  >
                    <span>Baca Selengkapnya & Lihat Galeri</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
