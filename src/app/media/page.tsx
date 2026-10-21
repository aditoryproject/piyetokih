import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getDb } from '@/lib/db';
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
  Image as ImageIcon,
  Video,
  Layers,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Media Center & Press Kit Resmi - Film PIYE TO KIH? | PT Mirakel Sinema Imaji',
  description:
    'Pusat materi publikasi resmi film PIYE TO KIH? untuk rekan jurnalis dan media: unduh official poster hi-res, siaran pers PDF, production stills, BTS photos, fact sheet, cast headshots, dan brand assets.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function MediaCenterPage() {
  const db = getDb();
  const settings = db.settings.kabarGaleriSettings || {};
  const posterUrl = settings.mediaKitPosterUrl || '/official-poster.jpg';
  const teaserPosterUrl = settings.mediaKitTeaserPosterUrl || posterUrl;
  const mainPosterUrl = settings.mediaKitMainPosterUrl || posterUrl;
  const prPdfUrl = settings.mediaKitPressReleasePdfUrl || '/PIYE_TO_KIH_Web_Developer_Guide_Kabar_dan_Galeri_v2.pdf';
  const stillsUrl = settings.mediaKitStillsZipUrl || '/kabar-galeri?tab=galeri-foto';
  const btsUrl = settings.mediaKitBtsZipUrl || '/kabar-galeri?tab=galeri-foto';
  const factSheetUrl = settings.mediaKitFactSheetPdfUrl || '/#sinopsis';
  const castPhotosUrl = settings.mediaKitCastPhotosUrl || '/kabar-galeri?tab=galeri-foto';

  // Video Assets (Sub-A)
  const videoFirstLookUrl = settings.mediaKitVideoFirstLookUrl || settings.mediaKitTrailerYoutubeUrl || 'https://www.youtube.com/@piyetokihfilm';
  const videoTeaserUrl = settings.mediaKitVideoTeaserUrl || settings.mediaKitTrailerYoutubeUrl || 'https://www.youtube.com/@piyetokihfilm';
  const videoMainTrailerUrl = settings.mediaKitVideoMainTrailerUrl || settings.mediaKitTrailerYoutubeUrl || 'https://www.youtube.com/@piyetokihfilm';
  const trailerUrl = settings.mediaKitTrailerYoutubeUrl || videoMainTrailerUrl || 'https://www.youtube.com/@piyetokihfilm';

  // Logo & Brand Assets (Sub-B)
  const logoPtkUrl = settings.mediaKitLogoPtkUrl || '/logo-ptk.png';
  const logoMiracleUrl = settings.mediaKitLogoMiracleUrl || '/logo-miracle-pictures.png';
  const logoPackUrl = settings.mediaKitLogoPackZipUrl || '/logo-ptk.png';
  const brandAssetsHubUrl = logoPackUrl.startsWith('http') ? logoPackUrl : (trailerUrl || 'https://www.youtube.com/@piyetokihfilm');

  const contactEmail = settings.mediaKitContactEmail || 'pr@miraclepictures.id';
  const contactWa = settings.mediaKitContactWa || '6285220952407';

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 py-12 px-4 sm:px-6 antialiased">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/kabar-galeri"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Kabar &amp; Galeri</span>
          </Link>

          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
            OFFICIAL PRESS KIT • 7 ASSET CONTAINERS
          </span>
        </div>

        {/* Page Header */}
        <div className="space-y-3 text-center sm:text-left">
          <span className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-amber-400 block">
            MIRACLE PICTURES – MEDIA HUB
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
            Media Center &amp; Brand Assets
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Halaman resmi untuk rekan media, jurnalis, pers nasional, dan mitra publikasi. Seluruh materi di bawah ini telah disetujui untuk kebutuhan pemberitaan, liputan, dan materi promosi film <b>PIYE TO KIH?</b> (Tayang Serentak 19 November 2026).
          </p>
        </div>

        {/* 7 DEDICATED MEDIA CONTAINERS PER DIRECTOR'S SPECIFICATION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* =========================================================
              KONTAINER 1: POSTER RESMI HI-RES
              ========================================================= */}
          <div className="bg-[#121620] rounded-3xl border border-white/10 hover:border-amber-500/40 p-6 sm:p-7 space-y-5 shadow-2xl flex flex-col justify-between transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  [ 01 ] VISUAL ASSET
                </span>
                <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  JPG / PNG • 300 DPI
                </span>
              </div>
              <h3 className="font-black text-xl text-white uppercase tracking-tight flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Poster Resmi Hi-Res</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Koleksi lengkap <b>Teaser Poster</b> dan <b>Official Theatrical Poster</b> resolusi tinggi (300 DPI) siap cetak dan tayang di media cetak maupun portal digital.
              </p>

              {/* Daftar Poster (Lingkaran Hijau) */}
              <div className="p-3 rounded-xl bg-[#171d2b] border border-white/5 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>• Teaser Poster (Vertikal)</span>
                  {teaserPosterUrl && teaserPosterUrl !== '#' ? (
                    <a
                      href={teaserPosterUrl}
                      target={teaserPosterUrl.startsWith('http') ? '_blank' : undefined}
                      rel={teaserPosterUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                      download={!teaserPosterUrl.startsWith('http') ? 'Teaser_Poster_Vertikal_HiRes.jpg' : undefined}
                      className="text-amber-400 hover:text-amber-300 hover:underline inline-flex items-center gap-1 font-bold"
                      title="Unduh Teaser Poster (Vertikal)"
                    >
                      <span>Tersedia</span>
                      <Download className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-amber-400">Tersedia</span>
                  )}
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>• Official Main Poster (Vertikal)</span>
                  {mainPosterUrl && mainPosterUrl !== '#' ? (
                    <a
                      href={mainPosterUrl}
                      target={mainPosterUrl.startsWith('http') ? '_blank' : undefined}
                      rel={mainPosterUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                      download={!mainPosterUrl.startsWith('http') ? 'Official_Main_Poster_Vertikal_HiRes.jpg' : undefined}
                      className="text-amber-400 hover:text-amber-300 hover:underline inline-flex items-center gap-1 font-bold"
                      title="Unduh Official Main Poster (Vertikal)"
                    >
                      <span>Tersedia</span>
                      <Download className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-amber-400">Tersedia</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={posterUrl}
                target={posterUrl.startsWith('http') ? '_blank' : undefined}
                rel={posterUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                download={!posterUrl.startsWith('http') ? 'PIYE_TO_KIH_Official_Poster_HiRes.jpg' : undefined}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs uppercase tracking-wide py-3.5 px-5 rounded-xl shadow-lg transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Semua</span>
              </a>
            </div>
          </div>

          {/* =========================================================
              KONTAINER 2: PRESS RELEASE RESMI
              ========================================================= */}
          <div className="bg-[#121620] rounded-3xl border border-white/10 hover:border-amber-500/40 p-6 sm:p-7 space-y-5 shadow-2xl flex flex-col justify-between transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  [ 02 ] DOKUMEN RESMI
                </span>
                <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  PDF FORMAT
                </span>
              </div>
              <h3 className="font-black text-xl text-white uppercase tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Press Release Resmi</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Siaran pers resmi utama peluncuran Official Trailer &amp; Poster, serta rilis pers roadshow, Home Premiere, dan Gala Premiere yang siap dikutip rekan jurnalis.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={prPdfUrl}
                target={prPdfUrl.startsWith('http') ? '_blank' : undefined}
                rel={prPdfUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                download={!prPdfUrl.startsWith('http') ? 'Press_Release_Resmi_PIYE_TO_KIH_2026.pdf' : undefined}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs uppercase tracking-wide py-3.5 px-5 rounded-xl shadow-lg transition active:scale-95"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Unduh Press Release</span>
              </a>
            </div>
          </div>

          {/* =========================================================
              KONTAINER 3: FILM STILLS / ADEGAN RESMI
              ========================================================= */}
          <div className="bg-[#121620] rounded-3xl border border-white/10 hover:border-amber-500/40 p-6 sm:p-7 space-y-5 shadow-2xl flex flex-col justify-between transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  [ 03 ] FOTO ADEGAN RESMI
                </span>
                <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                  NON-SPOILER
                </span>
              </div>
              <h3 className="font-black text-xl text-white uppercase tracking-tight flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Film Stills / Adegan Resmi</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Frame grab still resmi dari adegan film berkualitas tinggi dengan penamaan file terstandar (misalnya <code>PTK_STILL_01_MUKIDI_SUKMA.jpg</code>).
              </p>
            </div>

            <div className="pt-2">
              <a
                href={stillsUrl}
                target={stillsUrl.startsWith('http') ? '_blank' : undefined}
                rel={stillsUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                download={!stillsUrl.startsWith('http') && stillsUrl.endsWith('.zip') ? 'Film_Stills_PIYE_TO_KIH.zip' : undefined}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs uppercase tracking-wide py-3.5 px-5 rounded-xl shadow-lg transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Film Stills</span>
              </a>
            </div>
          </div>

          {/* =========================================================
              KONTAINER 4: BEHIND THE SCENES
              ========================================================= */}
          <div className="bg-[#121620] rounded-3xl border border-white/10 hover:border-amber-500/40 p-6 sm:p-7 space-y-5 shadow-2xl flex flex-col justify-between transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  [ 04 ] DOKUMENTASI PRODUKSI
                </span>
                <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  BTS ARCHIVE
                </span>
              </div>
              <h3 className="font-black text-xl text-white uppercase tracking-tight flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Behind the Scenes</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dokumentasi foto proses syuting, sutradara &amp; crew di set, cast di balik kamera, sesi rehearsal naskah, makeup karakter, pembangunan set rumah tua, dan suasana candid produksi.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={btsUrl}
                target={btsUrl.startsWith('http') ? '_blank' : undefined}
                rel={btsUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                download={!btsUrl.startsWith('http') && btsUrl.endsWith('.zip') ? 'Behind_The_Scenes_PIYE_TO_KIH.zip' : undefined}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs uppercase tracking-wide py-3.5 px-5 rounded-xl shadow-lg transition active:scale-95"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Unduh BTS Photos</span>
              </a>
            </div>
          </div>

          {/* =========================================================
              KONTAINER 5: FACT SHEET & FILM INFO
              ========================================================= */}
          <div className="bg-[#121620] rounded-3xl border border-white/10 hover:border-amber-500/40 p-6 sm:p-7 space-y-5 shadow-2xl flex flex-col justify-between transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  [ 05 ] LEMBAR FAKTA &amp; METADATA
                </span>
                <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  PDF 1–3 HALAMAN
                </span>
              </div>
              <h3 className="font-black text-xl text-white uppercase tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Fact Sheet &amp; Film Info</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rangkuman lengkap judul, tagline, logline, sinopsis pendek dan panjang, genre, durasi, klasifikasi usia (LSF 13+), tanggal tayang serentak, rumah produksi (PT Mirakel Sinema Imaji), sutradara, produser, penulis, dan daftar cast.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={factSheetUrl}
                target={factSheetUrl.startsWith('http') ? '_blank' : undefined}
                rel={factSheetUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                download={!factSheetUrl.startsWith('http') && factSheetUrl.endsWith('.pdf') ? 'Fact_Sheet_PIYE_TO_KIH.pdf' : undefined}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs uppercase tracking-wide py-3.5 px-5 rounded-xl shadow-lg transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Fact Sheet</span>
              </a>
            </div>
          </div>

          {/* =========================================================
              KONTAINER 6: CAST & FILMMAKER PHOTOS
              ========================================================= */}
          <div className="bg-[#121620] rounded-3xl border border-white/10 hover:border-amber-500/40 p-6 sm:p-7 space-y-5 shadow-2xl flex flex-col justify-between transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  [ 06 ] HEADSHOT &amp; POTRET RESMI
                </span>
                <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
                  PORTRAIT
                </span>
              </div>
              <h3 className="font-black text-xl text-white uppercase tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Cast &amp; Filmmaker Photos</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Portrait/headshot resmi cast dan Sutradara dengan format penamaan file <b>&ldquo;Nama asli – Peran di film&rdquo;</b>.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={castPhotosUrl}
                target={castPhotosUrl.startsWith('http') ? '_blank' : undefined}
                rel={castPhotosUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs uppercase tracking-wide py-3.5 px-5 rounded-xl shadow-lg transition active:scale-95"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Unduh Foto Cast &amp; Filmmaker</span>
              </a>
            </div>
          </div>

          {/* =========================================================
              KONTAINER 7: VIDEO & BRAND ASSETS (Full width span)
              ========================================================= */}
          <div className="md:col-span-2 bg-[#121620] rounded-3xl border border-white/10 hover:border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-2xl transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  [ 07 ] MULTIMEDIA &amp; IDENTITAS BRAND
                </span>
                <h3 className="font-black text-2xl text-white uppercase tracking-tight flex items-center gap-2">
                  <Video className="w-6 h-6 text-amber-400 shrink-0" />
                  <span>Video &amp; Brand Assets</span>
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10 self-start sm:self-auto">
                YOUTUBE 4K • PNG TRANSPARENT
              </span>
            </div>

            {/* Split Sub-containers: Video Assets & Logo/Brand Assets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SUB A: VIDEO ASSETS */}
              <div className="p-5 rounded-2xl bg-[#171d2b] border border-white/5 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    SUB-A · VIDEO ASSETS
                  </span>
                  <h4 className="font-bold text-base text-white mb-2">Tautan Video Resmi YouTube</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Akses streaming resolusi 4K untuk penayangan di televisi, video berita online, dan media sosial:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                      <span>• First Look Teaser</span>
                      <a
                        href={videoFirstLookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                      >
                        <span>Tonton YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                      <span>• Official Teaser Trailer</span>
                      <a
                        href={videoTeaserUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                      >
                        <span>Tonton YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                      <span>• Official Main Trailer</span>
                      <a
                        href={videoMainTrailerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                      >
                        <span>Tonton YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* SUB B: LOGO & BRAND ASSETS */}
              <div className="p-5 rounded-2xl bg-[#171d2b] border border-white/5 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    SUB-B · LOGO &amp; BRAND ASSETS
                  </span>
                  <h4 className="font-bold text-base text-white mb-2">Identitas Visual Transparan</h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Aset logo berformat PNG transparan resolusi tinggi untuk overlay video, watermark, dan tata letak grafis media:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                      <span>• Logo Resmi PIYE TO KIH? (PNG Transparan)</span>
                      <a
                        href={logoPtkUrl}
                        target={logoPtkUrl.startsWith('http') ? '_blank' : undefined}
                        rel={logoPtkUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                        download={!logoPtkUrl.startsWith('http') ? 'Logo_PIYE_TO_KIH_Transparan.png' : undefined}
                        className="text-amber-400 hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh PNG</span>
                      </a>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                      <span>• Logo PT Mirakel Sinema Imaji</span>
                      <a
                        href={logoMiracleUrl}
                        target={logoMiracleUrl.startsWith('http') ? '_blank' : undefined}
                        rel={logoMiracleUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                        download={!logoMiracleUrl.startsWith('http') ? 'Logo_Miracle_Pictures.png' : undefined}
                        className="text-amber-400 hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh PNG</span>
                      </a>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                      <span>• Brand Pack Lengkap (ZIP)</span>
                      <a
                        href={logoPackUrl}
                        target={logoPackUrl.startsWith('http') ? '_blank' : undefined}
                        rel={logoPackUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                        download={!logoPackUrl.startsWith('http') && logoPackUrl.endsWith('.zip') ? 'Brand_Assets_Pack.zip' : undefined}
                        className="text-amber-400 hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh Aset Brand</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={brandAssetsHubUrl}
                target={brandAssetsHubUrl.startsWith('http') ? '_blank' : undefined}
                rel={brandAssetsHubUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs uppercase tracking-wide py-4 px-6 rounded-xl shadow-lg transition active:scale-95"
              >
                <span>Buka Video &amp; Brand Assets</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Media Contact Footer */}
        <div className="p-6 rounded-3xl bg-[#141a24] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-black text-sm text-white uppercase tracking-wider">
              Kontak Hubungan Media &amp; Kemitraan Pers
            </h4>
            <p className="text-xs text-slate-400">
              Divisi Humas &amp; Publikasi PT Mirakel Sinema Imaji siap melayani permintaan wawancara, materi eksklusif, dan undangan screening.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{contactEmail}</span>
            </a>
            {contactWa && (
              <a
                href={`https://wa.me/${contactWa.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Media</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
