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
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
            OFFICIAL TEASER TRAILER FILM <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              PIYE TO KIH?
            </span>
          </h2>
        </div>

        {/* Cinema Screen Frame Visual */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-black shadow-amber-500/10 group">
          {/* Video Container (16:9 Aspect Ratio) */}
          <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
            {/* Poster Backdrop Image */}
            <img
              src={currentBackdrop}
              alt="Teaser Film Piye To Kih Miracle Pictures"
              loading="lazy"
              decoding="async"
              width={1280}
              height={720}
              onError={() => {
                if (ytThumb && currentBackdrop !== ytThumb) {
                  setCurrentBackdrop(ytThumb);
                } else if (currentBackdrop !== '/kabar-galeri-hero.jpg') {
                  setCurrentBackdrop('/kabar-galeri-hero.jpg');
                }
              }}
              className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700 cursor-pointer"
              onClick={() => setIsPlayingModal(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

            {/* Central Play Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
              <button
                type="button"
                onClick={() => setIsPlayingModal(true)}
                className="pointer-events-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 hover:scale-110 active:scale-95 transition-all duration-300 group/btn"
                aria-label="Putar Teaser Trailer"
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-slate-950 translate-x-1 group-hover/btn:scale-110 transition-transform" />
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
