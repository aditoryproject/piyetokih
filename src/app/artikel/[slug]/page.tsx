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
  Download,
  FileText,
  ExternalLink,
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
      title: 'Kabar & Galeri - Miracle Pictures',
    };
  }

  return {
    title: `${article.seoTitle || article.title} | PIYE TO KIH?`,
    description: article.seoDescription || article.summary,
    keywords: `Film Piye To Kih, ${article.category}, ${article.cityTag || ''}, ${article.title}, Miracle Pictures`,
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

  const relatedArticles = (db.articles || [])
    .filter(a => a.slug !== slug && a.isPublished)
    .slice(0, 3);

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
        url: 'https://piyetokihfilm.com/kabar-galeri-hero.jpg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://piyetokihfilm.com/artikel/${article.slug}`,
    },
  };

  return (
    <article className="min-h-screen bg-[#FDFBF7] text-slate-800 py-10 px-4 sm:px-6 antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-200 pb-4">
          <Link
            href="/kabar-galeri"
            className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-amber-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Kabar &amp; Galeri</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
              {article.category}
            </span>
            {article.tag && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                {article.tag}
              </span>
            )}
          </div>
        </div>

        {/* Header Block */}
        <header className="space-y-4">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pb-4 border-b border-slate-200">
            {article.cityTag && (
              <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{article.cityTag}</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </span>

            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.readTime || '3 menit baca'}</span>
            </span>

            <span className="inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.author}</span>
            </span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-[16/10] bg-slate-900">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Summary Lead Block */}
        <div className="p-5 rounded-2xl bg-amber-50/80 border-l-4 border-amber-500 text-sm sm:text-base font-semibold text-amber-950 leading-relaxed">
          {article.summary}
        </div>

        {/* Body Paragraphs */}
        <div className="space-y-5 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Press Release Download Attachment Button if exists */}
        {article.pdfUrl && (
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                LAMPIRAN SIARAN PERS RESMI
              </span>
              <h4 className="font-extrabold text-sm sm:text-base text-white">
                Dokumen Siaran Pers (Format PDF)
              </h4>
            </div>
            <a
              href={article.pdfUrl}
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Siaran Pers</span>
            </a>
          </div>
        )}

        {/* Media Coverage External Source Link */}
        {article.externalUrl && (
          <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                SUMBER PUBLIKASI MEDIA
              </span>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                Baca Liputan Asli di {article.mediaName || 'Media Partner'}
              </h4>
            </div>
            <a
              href={article.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm shrink-0"
            >
              <span>Buka Tautan Asli</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Contextual CTA: Presale BOGO */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
              PRESALE BUY 1 GET 1 (15 - 18 NOV)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Siap Nonton Film PIYE TO KIH? di Bioskop?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Dapatkan tiket nonton berdua hanya bayar 1 tiket untuk penayangan perdana 19 November 2026. Kuota terbatas 1.000 tiket di TIX ID dan 500 tiket di M-TIX!
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/#presale"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition shadow-md active:scale-95"
            >
              <Ticket className="w-4 h-4" />
              <span>Pasang Reminder Presale</span>
            </Link>

            <Link
              href="/#roadshow"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/10"
            >
              <span>Jadwal Roadshow 17 Kota</span>
              <span>➔</span>
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h4 className="text-base font-extrabold text-slate-900">
              Kabar &amp; Galeri Terkait Lainnya
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map(rel => (
                <Link
                  key={rel.id}
                  href={`/kabar-galeri/${rel.slug}`}
                  className="bg-white border border-slate-200 hover:border-amber-400 rounded-xl p-3 space-y-2 shadow-sm transition group"
                >
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-black text-amber-700 uppercase block">
                    {rel.tag || rel.category}
                  </span>
                  <h5 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 line-clamp-2 leading-snug">
                    {rel.title}
                  </h5>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
