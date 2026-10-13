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

  const posterImg = movieSettings.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80';
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
          {/* Left Column: Visual Poster / Scene Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-black shadow-amber-500/20 group">
              <img
                src={posterImg}
                alt="Sinopsis Film Piye To Kih Miracle Pictures"
                className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Poster Floating Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-red-600/90 text-white font-black text-[10px] tracking-widest uppercase shadow-lg">
                  LAYAR LEBAR 2026
                </span>
              </div>

              {/* Bottom Card Synopsis Highlight */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                  <Film className="w-3.5 h-3.5" />
                  <span>DARI KREATOR WOKO CHANNEL</span>
                </div>
                <p className="text-white text-xs font-semibold leading-relaxed">
                  Perjalanan komedi layar lebar pertama yang menyatukan kelucuan khas Kediri &amp; Jawa Timur dengan drama sinematik berkelas.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Story & Production Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-gold-400 text-xs font-black tracking-widest uppercase shadow-sm">
              <BookOpen className="w-3.5 h-3.5" />
              <span>SINOPSIS RESMI CERITA FILM</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase leading-tight">
              Patah Hati, Beli Rumah Tua, <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
                Lha Kok Ketemu Sukma?!
              </span>
            </h2>

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
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Rumah Produksi</span>
                <span className="font-black text-amber-400 text-xs">Miracle Pictures</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Sutradara</span>
                <span className="font-black text-white text-xs">{directorName}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Penulis Skenario</span>
                <span className="font-black text-white text-xs">{writerName}</span>
              </div>
            </div>

            {/* Quick Link to Presale BOGO */}
            <div className="pt-2">
              <a
                href="#presale"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition"
              >
                <span>Presale Buy 1 Get 1 Bioskop</span>
                <span>➔</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
