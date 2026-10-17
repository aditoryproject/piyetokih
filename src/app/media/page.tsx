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

export default function MediaCenterPage() {
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
            PT MIRAKEL SINEMA IMAJI • MEDIA HUB
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
              <div className="p-3 rounded-xl bg-[#171d2b] border border-white/5 space-y-1 text-xs text-slate-300">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>• Teaser Poster (Vertikal)</span>
                  <span className="text-amber-400">Tersedia</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>• Official Main Poster (Vertikal)</span>
                  <span className="text-amber-400">Tersedia</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/official-poster.jpg"
                download="PIYE_TO_KIH_Official_Poster_HiRes.jpg"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs uppercase tracking-wide py-3.5 px-5 rounded-xl shadow-lg transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Poster Hi-Res</span>
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
              <div className="p-3 rounded-xl bg-[#171d2b] border border-white/5 space-y-1 text-xs text-slate-300">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>• PR Utama: Peluncuran Official Trailer</span>
                  <span className="text-amber-400">PDF</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>• PR Roadshow &amp; Special Screening 17 Kota</span>
                  <span className="text-amber-400">PDF</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/PIYE_TO_KIH_Web_Developer_Guide_Kabar_dan_Galeri_v2.pdf"
                download="Press_Release_Resmi_PIYE_TO_KIH_2026.pdf"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1b2230] hover:bg-[#232c3e] border border-white/15 hover:border-amber-400/50 text-white font-black text-xs uppercase tracking-wide py-3.5 px-5 rounded-xl shadow-lg transition active:scale-95"
              >
                <Download className="w-4 h-4 text-amber-400" />
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
              <div className="p-3 rounded-xl bg-[#171d2b] border border-white/5 space-y-1 text-xs text-slate-300 font-mono text-[11px]">
                <div>• PTK_STILL_01_MUKIDI_SUKMA.jpg</div>
                <div>• PTK_STILL_02_SEKAWAN_WOKO.jpg</div>
                <div>• PTK_STILL_03_RUMAH_TUA.jpg</div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/kabar-galeri?tab=galeri-foto"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs uppercase tracking-wide py-3.5 px-5 rounded-xl shadow-lg transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Film Stills</span>
              </Link>
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
              <div className="p-3 rounded-xl bg-[#171d2b] border border-white/5 space-y-1 text-xs text-slate-300">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>• Rehearsal &amp; Table Read Session</span>
                  <span className="text-amber-400">Foto</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>• Sutradara &amp; Crew On Set Action</span>
                  <span className="text-amber-400">Foto</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/kabar-galeri?tab=galeri-foto"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1b2230] hover:bg-[#232c3e] border border-white/15 hover:border-amber-400/50 text-white font-black text-xs uppercase tracking-wide py-3.5 px-5 rounded-xl shadow-lg transition active:scale-95"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Unduh BTS Photos</span>
              </Link>
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
              <div className="p-3 rounded-xl bg-[#171d2b] border border-white/5 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Rumah Produksi:</span>
                  <span className="font-bold text-white">PT Mirakel Sinema Imaji</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sutradara:</span>
                  <span className="font-bold text-white">Ito Mavin</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Tanggal Tayang:</span>
                  <span className="font-bold text-amber-400">19 November 2026</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/#sinopsis"
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
              <div className="p-3 rounded-xl bg-[#171d2b] border border-white/5 space-y-1 text-xs text-slate-300 font-mono text-[11px]">
                <div>• Heri Chandra – Mukidi</div>
                <div>• Sutrisno Agung – Gendut</div>
                <div>• Eko Dunung – Penyok</div>
                <div>• Dara Sarasvati – Sukma</div>
                <div>• Pak Nggalino, Mintul, Bunga, Bu Yeyen, Pak RT, Jotay, Bu Tinah, Bang Sadikin</div>
                <div>• Ito Mavin – Sutradara &amp; Produser</div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/kabar-galeri?tab=galeri-foto"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#1b2230] hover:bg-[#232c3e] border border-white/15 hover:border-amber-400/50 text-white font-black text-xs uppercase tracking-wide py-3.5 px-5 rounded-xl shadow-lg transition active:scale-95"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Unduh Foto Cast &amp; Filmmaker</span>
              </Link>
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
                        href="https://www.youtube.com/@piyetokihfilm"
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
                        href="https://www.youtube.com/@piyetokihfilm"
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
                        href="https://www.youtube.com/@piyetokihfilm"
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
                        href="/logo-ptk.png"
                        download="Logo_PIYE_TO_KIH_Transparan.png"
                        className="text-amber-400 hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh PNG</span>
                      </a>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                      <span>• Logo PT Mirakel Sinema Imaji</span>
                      <a
                        href="/logo-ptk.png"
                        download="Logo_Miracle_Pictures.png"
                        className="text-amber-400 hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh PNG</span>
                      </a>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                      <span>• Title Treatment Film (Typography Lockup)</span>
                      <a
                        href="/logo-ptk.png"
                        download="Title_Treatment_PTK.png"
                        className="text-amber-400 hover:underline font-mono text-[11px] inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh PNG</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://www.youtube.com/@piyetokihfilm"
                target="_blank"
                rel="noopener noreferrer"
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
              href="mailto:press@piyetokihfilm.com"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>press@piyetokihfilm.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
