import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Download,
  FileText,
  Camera,
  Play,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Film,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Media Center & Press Kit Resmi - Film PIYE TO KIH? | Miracle Pictures',
  description:
    'Pusat materi publikasi resmi film PIYE TO KIH? untuk rekan jurnalis dan media: unduh official poster hi-res, siaran pers PDF, production stills, sinopsis, dan fact sheet.',
};

export default function MediaCenterPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 py-12 px-4 sm:px-6 antialiased">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <Link
            href="/kabar-galeri"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-700 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Kabar &amp; Galeri</span>
          </Link>

          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900 text-white">
            OFFICIAL PRESS KIT
          </span>
        </div>

        {/* Page Header */}
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-700 block">
            MIRACLE PICTURES MEDIA HUB
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Media Center &amp; Press Assets
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Halaman khusus rekan media, jurnalis, dan pers nasional untuk mengunduh materi publikasi resmi yang telah disetujui menjelang penayangan bioskop 19 November 2026.
          </p>
        </div>

        {/* Downloadable Assets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* 1. Official Movie Poster */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-700 uppercase">Visual Asset</span>
                <span className="text-[10px] text-slate-400 font-mono">JPG • 300 DPI</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Official Movie Poster (Hi-Res)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Poster resmi peluncuran film format vertikal resolusi tinggi untuk kebutuhan cetak dan publikasi digital.
              </p>
            </div>
            <a
              href="/kabar-galeri-hero.jpg"
              download="PIYE_TO_KIH_Official_Poster_HiRes.jpg"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Unduh Poster Hi-Res</span>
            </a>
          </div>

          {/* 2. Official Press Release PDF */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-700 uppercase">Dokumen Resmi</span>
                <span className="text-[10px] text-slate-400 font-mono">PDF • Format Siar</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Siaran Pers Resmi Peluncuran (PDF)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Naskah lengkap rilis pers resmi, kutipan narasumber sutradara &amp; produser, serta jadwal roadshow.
              </p>
            </div>
            <a
              href="/PIYE_TO_KIH_Web_Developer_Guide_Kabar_dan_Galeri_v2.pdf"
              download="Press_Release_Resmi_PIYE_TO_KIH_2026.pdf"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Unduh Siaran Pers (PDF)</span>
            </a>
          </div>

          {/* 3. Production Stills & Cast Publicity Photos */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-700 uppercase">Foto Adegan &amp; Cast</span>
                <span className="text-[10px] text-slate-400 font-mono">Album Pilihan</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Production Stills &amp; Cast Portraits
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Foto adegan film berkualitas tinggi serta potret resmi seluruh jajaran pemeran Woko Channel &amp; Dara Sarasvati.
              </p>
            </div>
            <Link
              href="/kabar-galeri?tab=galeri-foto"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span>Jelajahi Galeri Foto</span>
            </Link>
          </div>

          {/* 4. Fact Sheet & Data Produksi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-700 uppercase">Data Film</span>
                <span className="text-[10px] text-slate-400 font-mono">Fact Sheet</span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Fact Sheet &amp; Sinopsis Lengkap
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Rangkuman detail produksi: runtime, genre, rumah produksi Miracle Pictures, dan penayangan 19 November 2026.
              </p>
            </div>
            <Link
              href="/#sinopsis"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-200"
            >
              <span>Lihat Detail Sinopsis</span>
              <span>➔</span>
            </Link>
          </div>
        </div>

        {/* Fact Sheet Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Film className="w-4 h-4 text-amber-600" />
            <span>Lembar Fakta Produksi (Fact Sheet)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Judul Resmi</span>
              <span className="font-black text-slate-900">PIYE TO KIH? THE MOVIE</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Rumah Produksi</span>
              <span className="font-black text-slate-900">Miracle Pictures</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Tanggal Rilis Serentak</span>
              <span className="font-black text-amber-700">19 November 2026</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Genre</span>
              <span className="font-black text-slate-900">Komedi, Drama, Keluarga</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
              <span className="text-slate-400 uppercase font-bold text-[10px] block">Pemeran Utama</span>
              <span className="font-bold text-slate-800">
                Punggawa Woko Channel (Pak No, Ganden, Mukidi, Penyok), Dara Sarasvati, &amp; Ensemble Cast Jawa
              </span>
            </div>
          </div>
        </div>

        {/* Media Contact Information Box */}
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-black text-sm text-amber-950">
              Kontak Hubungan Media &amp; Kemitraan Pers
            </h4>
            <p className="text-xs text-amber-800">
              Untuk permintaan wawancara, peliputan khusus, dan konfirmasi undangan screening.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <a
              href="mailto:press@piyetokihfilm.com"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-950 hover:bg-amber-100 transition shadow-sm"
            >
              <Mail className="w-3.5 h-3.5 text-amber-600" />
              <span>press@piyetokihfilm.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
