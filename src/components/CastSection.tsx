'use client';

import React, { useEffect, useState } from 'react';
import { Users, Sparkles, Star } from 'lucide-react';
import { MovieCastMember } from '@/lib/movie-types';

const FALLBACK_CAST: MovieCastMember[] = [
  {
    id: 'cast-1',
    actorName: 'Heri Chandra',
    characterName: 'MUKIDI',
    bio: 'Pria pekerja keras yang patah hati berat, bertekad membuktikan kemapanannya dengan nekat membeli rumah tua murah.',
    badge: 'PEMERAN UTAMA • WOKO CHANNEL',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cast-2',
    actorName: 'Dara Sarasvati',
    characterName: 'SUKMA',
    bio: 'Gadis misterius berparas jelita yang tinggal di rumah tua Mukidi, membawa teka-teki dari dimensi alam yang berbeda.',
    badge: 'KARAKTER KUNCI',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cast-3',
    actorName: 'Sutrisno Agung',
    characterName: 'GENDUT',
    bio: 'Sahabat karib Mukidi dari Woko Channel yang paling heboh, curigaan, dan panik saat mengira Mukidi kesambet roh halus.',
    badge: 'WOKO CHANNEL',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cast-4',
    actorName: 'Eko Dunung',
    characterName: 'PENYOK',
    bio: 'Sahabat setia Mukidi yang polos dan berhati lembut. Celetukan khas Jawa Timur-nya selalu memecah suasana tegang jadi tawa.',
    badge: 'WOKO CHANNEL',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
  },
];

interface CastSectionProps {
  castList?: MovieCastMember[];
}

export default function CastSection({ castList: propCast }: CastSectionProps) {
  const [castList, setCastList] = useState<MovieCastMember[]>(propCast || FALLBACK_CAST);

  useEffect(() => {
    if (propCast && propCast.length > 0) {
      setCastList(propCast);
    } else {
      fetch('/api/admin/settings')
        .then(r => r.json())
        .then(data => {
          if (data.settings?.movieSettings?.cast && data.settings.movieSettings.cast.length > 0) {
            setCastList(data.settings.movieSettings.cast);
          }
        })
        .catch(() => {});
    }
  }, [propCast]);
  return (
    <section id="cast" className="relative py-20 px-4 sm:px-6 overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 bg-amber-500/10 blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-black tracking-widest uppercase mb-3 shadow-sm">
            <Users className="w-3.5 h-3.5" />
            <span>OFFICIAL CAST &amp; CHARACTERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            Jajaran Pemain &amp; Karakter <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 bg-clip-text text-transparent">
              FILM &quot;PIYE TO KIH?&quot;
            </span>
          </h2>
        </div>

        {/* Cards Grid: 14 Cast Members in Clean Cinematic Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {castList.map((cast, idx) => (
            <div
              key={cast.id || idx}
              className="bg-gradient-to-b from-[#141b2a] to-[#0a0e17] border border-slate-800/80 hover:border-amber-500/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 group flex flex-col"
            >
              {/* Photo Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
                <img
                  src={cast.photoUrl}
                  alt={`${cast.actorName} - ${cast.characterName}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-transparent to-transparent" />
              </div>

              {/* Actor & Role Details */}
              <div className="p-3.5 text-center flex-1 flex flex-col justify-center">
                <h3 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition-colors tracking-tight">
                  {cast.actorName}
                </h3>
                <span className="text-[11px] sm:text-xs font-semibold text-amber-400/90 mt-0.5 block">
                  {(() => {
                    const raw = cast.characterName || '';
                    if (!raw || raw === 'Pemeran' || raw === 'Pemeran Film') return 'Pemeran Film';
                    const cleaned = raw.replace(/Pak\s*Ndut\s*\/?\s*/gi, '').trim() || 'Gendut';
                    return `sebagai ${cleaned}`;
                  })()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
