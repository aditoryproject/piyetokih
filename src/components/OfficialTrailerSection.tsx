'use client';

import React, { useState, useEffect } from 'react';
import { Play, Volume2, VolumeX, Film, Sparkles, X } from 'lucide-react';
import { MovieSettings } from '@/lib/movie-types';

export function getYouTubeId(urlOrId?: string): string | null {
  if (!urlOrId || !urlOrId.trim()) return null;
  const trimmed = urlOrId.trim();
  const matchWatch = trimmed.match(/[?&]v=([^&]+)/);
  if (matchWatch && matchWatch[1]) return matchWatch[1];
  const matchShort = trimmed.match(/youtu\.be\/([^?&]+)/);
  if (matchShort && matchShort[1]) return matchShort[1];
  const matchShorts = trimmed.match(/youtube\.com\/shorts\/([^?&]+)/);
  if (matchShorts && matchShorts[1]) return matchShorts[1];
  const matchEmbed = trimmed.match(/youtube\.com\/embed\/([^?&]+)/);
  if (matchEmbed && matchEmbed[1]) return matchEmbed[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

export function getYouTubeEmbedUrl(urlOrId?: string, autoplay = true, muted = false): string {
  if (!urlOrId || !urlOrId.trim()) {
    return `https://www.youtube.com/embed?listType=search&list=Piye+To+Kih+Official+Teaser+Trailer+Cinema+21&autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&rel=0`;
  }
  const trimmed = urlOrId.trim();
  if (trimmed.includes('youtube.com/embed/')) {
    const clean = trimmed.split('?')[0];
    return `${clean}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&rel=0`;
  }
  const matchWatch = trimmed.match(/[?&]v=([^&]+)/);
  if (matchWatch && matchWatch[1]) {
    return `https://www.youtube.com/embed/${matchWatch[1]}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&rel=0`;
  }
  const matchShort = trimmed.match(/youtu\.be\/([^?&]+)/);
  if (matchShort && matchShort[1]) {
    return `https://www.youtube.com/embed/${matchShort[1]}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&rel=0`;
  }
  const matchShorts = trimmed.match(/youtube\.com\/shorts\/([^?&]+)/);
  if (matchShorts && matchShorts[1]) {
    return `https://www.youtube.com/embed/${matchShorts[1]}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&rel=0`;
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&rel=0`;
  }
  return trimmed;
}

interface OfficialTrailerSectionProps {
  movieSettings?: MovieSettings;
  cityContext?: string;
}

export default function OfficialTrailerSection({ movieSettings: propSettings, cityContext }: OfficialTrailerSectionProps) {
  const [movieSettings, setMovieSettings] = useState<MovieSettings | undefined>(propSettings);
  const [isPlayingModal, setIsPlayingModal] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const rawTrailerUrl = movieSettings?.trailerYoutubeUrl || '';
  const ytId = getYouTubeId(rawTrailerUrl);
  const ytThumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '';
  const initialBackdrop = movieSettings?.backdropUrl || ytThumb || movieSettings?.posterUrl || '/kabar-galeri-hero.jpg';
  const [currentBackdrop, setCurrentBackdrop] = useState(initialBackdrop);

  useEffect(() => {
    if (propSettings) {
      setMovieSettings(propSettings);
    } else {
      fetch('/api/admin/settings')
        .then(r => r.json())
        .then(data => {
          if (data.settings?.movieSettings) {
            setMovieSettings(data.settings.movieSettings);
          }
        })
        .catch(() => {});
    }
  }, [propSettings]);

  useEffect(() => {
    const updatedYtId = getYouTubeId(movieSettings?.trailerYoutubeUrl || '');
    const updatedYtThumb = updatedYtId ? `https://img.youtube.com/vi/${updatedYtId}/hqdefault.jpg` : '';
    setCurrentBackdrop(movieSettings?.backdropUrl || updatedYtThumb || movieSettings?.posterUrl || '/kabar-galeri-hero.jpg');
  }, [movieSettings]);

  const YOUTUBE_EMBED_URL = getYouTubeEmbedUrl(rawTrailerUrl, true, isMuted);

  return (
    <section id="teaser" className="relative py-16 px-4 sm:px-6 overflow-hidden">
      {/* Ambient Lighting & Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[450px] bg-gradient-to-r from-red-600/15 via-amber-600/20 to-orange-600/15 blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black tracking-widest uppercase mb-3 shadow-lg shadow-amber-500/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXCLUSIVE FIRST LOOK • TEASER RESMI</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Saksikan Teaser Cuplikan Resmi <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              FILM &quot;PIYE TO KIH?&quot;
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mt-2 leading-relaxed">
            Diproduksi oleh <b className="text-white">Miracle Pictures</b>. Menampilkan kolaborasi tawa legendaris <b className="text-amber-400">Woko Channel</b> (Mukidi, Gendut, Penyok) bersama Dara Sarasvati di layar lebar bioskop!
          </p>
        </div>

        {/* Cinema Screen Frame Visual */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-black shadow-amber-500/10 group">
          {/* Top Cinema Curved Header Bar */}
          <div className="bg-[#0c1017] border-b border-white/10 px-6 py-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                CINEMA SCREEN 1 • 4K DOLBY ATMOS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-600/30 text-[10px] font-black uppercase tracking-wider">
                LSF 13+
              </span>
              <span className="text-slate-400 text-[11px] font-bold">19 NOVEMBER 2026 DI BIOSKOP</span>
            </div>
          </div>

          {/* Video Container (16:9 Aspect Ratio) */}
          <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
            {/* Poster Backdrop Image */}
            <img
              src={currentBackdrop}
              alt="Teaser Film Piye To Kih Miracle Pictures"
              onError={() => {
                if (ytThumb && currentBackdrop !== ytThumb) {
                  setCurrentBackdrop(ytThumb);
                } else if (currentBackdrop !== '/kabar-galeri-hero.jpg') {
                  setCurrentBackdrop('/kabar-galeri-hero.jpg');
                }
              }}
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Central Play Badge & Call To Action */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <button
                type="button"
                onClick={() => setIsPlayingModal(true)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 hover:scale-110 active:scale-95 transition-all duration-300 group/btn mb-4"
                aria-label="Putar Teaser Trailer"
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950 translate-x-1 group-hover/btn:scale-110 transition-transform" />
              </button>

              <span className="inline-block px-3 py-1 rounded-full bg-black/70 border border-white/20 text-amber-300 text-xs sm:text-sm font-black tracking-wide uppercase backdrop-blur-md mb-1 shadow-lg">
                KLIK UNTUK NONTON TEASER RESMI
              </span>
              <p className="text-white text-xs sm:text-sm font-semibold max-w-md drop-shadow-md">
                &quot;Mukidi patah hati, nekat tuku omah, lha kok ana Sukma seka alam liya... Piye to kih?!&quot;
              </p>
            </div>

            {/* Bottom Floating Bar */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-400" />
                <span className="font-bold">Official Teaser Trailer (Cinema XXI &amp; CGV)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPlayingModal(true)}
                className="text-amber-400 hover:text-amber-300 font-extrabold flex items-center gap-1 transition"
              >
                <span>Buka Layar Penuh</span> ➔
              </button>
            </div>
          </div>
        </div>

        {/* Video Player Modal Popup */}
        {isPlayingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-500/20">
              {/* Modal Header */}
              <div className="px-5 py-3.5 bg-slate-900/90 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-black text-white uppercase tracking-wider">
                    Official Teaser Trailer • PIYE TO KIH? (Miracle Pictures)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlayingModal(false)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Responsive Iframe Container */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={YOUTUBE_EMBED_URL}
                  title="Official Teaser Trailer Piye To Kih Miracle Pictures"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Modal Footer Note */}
              <div className="p-4 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 border-t border-white/10">
                <div>
                  <span className="text-amber-400 font-bold">Jadwal Tayang: 19 November 2026</span>
                  <span className="hidden sm:inline"> • Tayang serentak di bioskop seluruh Indonesia.</span>
                </div>
                <a
                  href="#war"
                  onClick={() => setIsPlayingModal(false)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md transition"
                >
                  <span>Klaim War Voucher Nonton</span> 🎟️
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
