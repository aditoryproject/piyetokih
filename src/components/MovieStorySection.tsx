'use client';

import React, { useEffect, useState } from 'react';
import { Film, BookOpen, Quote, Sparkles, CheckCircle2 } from 'lucide-react';
import { MovieSettings, DEFAULT_MOVIE_SETTINGS } from '@/lib/movie-types';

interface MovieStorySectionProps {
  movieSettings?: MovieSettings;
}

export default function MovieStorySection({ movieSettings: propSettings }: MovieStorySectionProps) {
  const [movieSettings, setMovieSettings] = useState<MovieSettings>(propSettings || DEFAULT_MOVIE_SETTINGS);

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

  const initialPoster = movieSettings.posterUrl || '/official-poster.jpg';
  const [currentPoster, setCurrentPoster] = useState(initialPoster);

  useEffect(() => {
    setCurrentPoster(movieSettings.posterUrl || '/official-poster.jpg');
  }, [movieSettings]);

  const directorName = movieSettings.director || 'Ito Mavin';
  const writerName = movieSettings.writer || 'Endik Koeswoyo & Ito Mavin';
  const quoteText = movieSettings.quoteDialog || 'Niat ati golek omah murah gawe rabi, malah kepincut prawan ayu sing ora tau saba awan...';
  const synopsisText = movieSettings.synopsis || DEFAULT_MOVIE_SETTINGS.synopsis;

  return (
    <section id="sinopsis" className="relative py-20 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-transparent via-[#0e1422]/60 to-transparent">
      {/* Decorative Blur Circles */}
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Clean Visual Poster with Sensor Classification Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-black shadow-amber-500/20 group">
              <img
                src={currentPoster}
                alt="Poster Film Piye To Kih Miracle Pictures"
                loading="lazy"
                decoding="async"
                width={600}
                height={900}
                onError={() => {
                  if (currentPoster !== '/official-poster.jpg') {
                    setCurrentPoster('/official-poster.jpg');
                  }
                }}
                className="w-full h-auto min-h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

              {/* Kualifikasi Sensor LSF (Dapat diaktifkan lewat Dashboard jika sudah resmi) */}
              {movieSettings.showLsfBadge && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-lg bg-red-600/90 text-white font-black text-xs tracking-wider uppercase shadow-xl border border-white/20">
                    {movieSettings.lsfRatingText || 'LSF 13+'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: SINOPSIS */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase leading-tight">
                SINOPSIS
              </h2>
            </div>

            {/* Quote Block */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 text-slate-300 text-xs sm:text-sm italic leading-relaxed">
              <Quote className="w-4 h-4 text-amber-400 inline -mt-1 mr-1.5 not-italic" />
              &quot;{quoteText}&quot;
            </div>

            {/* Synopsis Paragraphs */}
            <div className="text-xs sm:text-sm text-slate-300 space-y-3.5 leading-relaxed whitespace-pre-line">
              <p>{synopsisText}</p>
            </div>

            {/* Production Metadata Cards */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Rumah Produksi</span>
                <span className="font-black text-amber-400 text-xs leading-tight block">PT Mirakel Sinema Imaji</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Sutradara</span>
                <span className="font-black text-white text-xs">{directorName}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Penulis Skenario</span>
                <span className="font-black text-white text-xs">{writerName}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Klasifikasi Usia</span>
                <span className="font-black text-red-400 text-xs">{movieSettings.lsfRatingText || 'LSF 13+'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
