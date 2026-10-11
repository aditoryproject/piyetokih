import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import {
  Calendar,
  MapPin,
  Clock,
  User,
  ArrowLeft,
  Share2,
  Camera,
  Ticket,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const article = (db.articles || []).find(a => a.slug === slug);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan - Miracle Pictures',
    };
  }

  return {
    title: `${article.seoTitle || article.title} | Miracle Pictures`,
    description: article.seoDescription || article.summary,
    keywords: `Film Piye To Kih, Roadshow ${article.cityTag || ''}, ${article.title}, Miracle Pictures`,
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `https://piyetokihfilm.com/artikel/${article.slug}`,
      siteName: 'Miracle Pictures',
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: [article.coverImage],
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const db = getDb();
  const article = (db.articles || []).find(a => a.slug === slug);

  if (!article) {
    notFound();
  }

  // Related articles (exclude current)
  const relatedArticles = (db.articles || [])
    .filter(a => a.slug !== slug && a.isPublished)
    .slice(0, 2);

  // Schema.org Structured Data for Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: [article.coverImage, ...(article.galleryImages || [])],
    datePublished: `${article.publishedAt}T08:00:00+07:00`,
    dateModified: `${article.publishedAt}T08:00:00+07:00`,
    author: {
      '@type': 'Organization',
      name: article.author || 'Miracle Pictures',
      url: 'https://piyetokihfilm.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Miracle Pictures',
      logo: {
        '@type': 'ImageObject',
        url: 'https://piyetokihfilm.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://piyetokihfilm.com/artikel/${article.slug}`,
    },
  };

  return (
    <article className="relative min-h-screen py-10 px-4 sm:px-6">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[450px] bg-gradient-to-b from-red-600/10 via-amber-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-amber-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Semua Kabar Roadshow</span>
          </Link>

          <span className="text-[11px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full uppercase">
            {article.category}
          </span>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight mb-4">
            {article.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pb-6 border-b border-white/10">
            {article.cityTag && (
              <span className="inline-flex items-center gap-1 font-bold text-amber-400 bg-black/60 px-2.5 py-1 rounded-lg border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{article.cityTag}</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1 text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{article.publishedAt}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime || '3 menit baca'}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-gray-400">
              <User className="w-3.5 h-3.5" />
              <span>{article.author}</span>
            </span>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-8 aspect-[16/10] bg-black/80">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Summary Lead */}
        <p className="text-base sm:text-lg font-medium text-amber-200/90 leading-relaxed mb-8 p-4 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500">
          {article.summary}
        </p>

        {/* Main Body Content */}
        <div className="prose prose-invert max-w-none space-y-5 text-gray-200 text-sm sm:text-base leading-relaxed mb-12">
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* PHOTO GALLERY SECTION */}
        {article.galleryImages && article.galleryImages.length > 0 && (
          <div className="my-12 p-6 sm:p-8 bg-black/50 border border-white/10 rounded-3xl">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Camera className="w-4 h-4 text-amber-400" />
              <span>GALERI FOTO DOKUMENTASI RESMI</span>
            </div>
            <h3 className="text-xl font-black text-white mb-6">
              Dokumentasi Foto {article.cityTag ? `di ${article.cityTag}` : 'Kegiatan'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {article.galleryImages.map((imgUrl, imgIdx) => (
                <div
                  key={imgIdx}
                  className="rounded-2xl overflow-hidden border border-white/10 aspect-[4/3] bg-black/60 group relative"
                >
                  <img
                    src={imgUrl}
                    alt={`${article.title} - Foto ${imgIdx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Foto #{imgIdx + 1} Miracle Pictures
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CALL TO ACTION VOUCHER BANNER */}
        <div className="my-12 text-center p-8 bg-gradient-to-r from-red-950/60 via-amber-950/50 to-red-950/60 border border-amber-500/40 rounded-3xl shadow-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider mb-3">
            KLAIM E-VOUCHER NONTON RESMI
          </span>
          <h3 className="text-2xl font-black text-white mb-2">
            Mau Ikut Nobar & Tawa Bareng di Bioskop?
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto mb-6">
            Amankan kuota e-voucher resmi Anda sekarang sebelum habis! Voucher dapat ditukarkan di bioskop kesayangan Anda saat periode penayangan film.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/#top"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold text-xs transition shadow-lg"
            >
              <Ticket className="w-4 h-4" />
              <span>Klaim E-Voucher Sekarang</span>
            </Link>
            <Link
              href="/#roadshow"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/10"
            >
              <span>Jadwal Roadshow 17 Kota</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* RELATED ARTICLES */}
        {relatedArticles.length > 0 && (
          <div className="pt-8 border-t border-white/10">
            <h4 className="text-lg font-black text-white mb-4">
              Kabar Roadshow Lainnya
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/artikel/${rel.slug}`}
                  className="bg-black/40 border border-white/10 hover:border-amber-500/40 rounded-2xl p-4 flex gap-3 transition group"
                >
                  <img
                    src={rel.coverImage}
                    alt={rel.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-bold text-amber-400 block mb-1">
                      {rel.cityTag || rel.category}
                    </span>
                    <h5 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                      {rel.title}
                    </h5>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
