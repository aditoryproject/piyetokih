import React from 'react';
import type { Metadata } from 'next';
import { getDb } from '@/lib/db';
import KabarGaleriHub from '@/components/KabarGaleriHub';

export const metadata: Metadata = {
  title: 'Kabar & Galeri Resmi Film PIYE TO KIH? - Miracle Pictures',
  description:
    'Editorial hub resmi film komedi drama PIYE TO KIH?. Ikuti kabar film terbaru, siaran pers resmi, liputan media, serta dokumentasi galeri foto dan video perjalanan menuju bioskop 19 November 2026.',
  keywords:
    'Kabar Film Piye To Kih, Galeri Foto Roadshow, Video Trailer Piye To Kih, Press Release Miracle Pictures, Media Center',
  openGraph: {
    title: 'Kabar & Galeri Resmi Film PIYE TO KIH? - Miracle Pictures',
    description:
      'Pusat informasi resmi perjalanan film PIYE TO KIH?: kabar terkini, galeri foto, video cuplikan, dan siaran pers.',
    images: ['/kabar-galeri-hero.jpg'],
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function KabarGaleriPage() {
  const db = getDb();
  const articles = (db.articles || []).filter(a => a.isPublished);

  return (
    <KabarGaleriHub
      initialArticles={articles}
      kabarGaleriSettings={db.settings.kabarGaleriSettings}
    />
  );
}
