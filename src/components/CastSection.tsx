import React from 'react';
import { Users, Sparkles, Star } from 'lucide-react';

interface CastMember {
  name: string;
  character: string;
  roleDescription: string;
  badge: string;
  image: string;
}

const CAST_MEMBERS: CastMember[] = [
  {
    name: 'Heri Chandra',
    character: 'MUKIDI',
    roleDescription: 'Pria pekerja keras yang patah hati berat, bertekad membuktikan kemapanannya dengan nekat membeli rumah tua murah.',
    badge: 'PEMERAN UTAMA',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Dara Sarasvati',
    character: 'SUKMA',
    roleDescription: 'Gadis misterius berparas jelita yang tinggal di rumah tua Mukidi, membawa teka-teki dari dimensi alam yang berbeda.',
    badge: 'KARAKTER KUNCI',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sutrisno Agung',
    character: 'GENDUT',
    roleDescription: 'Sahabat karib Mukidi dari Woko Channel yang paling heboh, curigaan, dan panik saat mengira Mukidi kesambet roh halus.',
    badge: 'WOKO CHANNEL',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Eko Dunung',
    character: 'PENYOK',
    roleDescription: 'Sahabat setia Mukidi yang polos dan berhati lembut. Celetukan khas Jawa Timur-nya selalu memecah suasana tegang jadi tawa.',
    badge: 'WOKO CHANNEL',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
  },
];

export default function CastSection() {
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
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2 leading-relaxed">
            Reuni akbar tawa para punggawa <b className="text-amber-400">Woko Channel</b> di bioskop bersama aktris berbakat tanah air.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CAST_MEMBERS.map((cast, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-b from-[#141b2a] to-[#0a0e17] border border-slate-800 hover:border-amber-500/40 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Photo Container */}
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-900">
                <img
                  src={cast.image}
                  alt={`${cast.name} sebagai ${cast.character}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-transparent to-transparent" />

                {/* Badge Top Left */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/75 border border-white/20 text-amber-400 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                    {cast.badge}
                  </span>
                </div>

                {/* Character Name Overlay Bottom */}
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    SEBAGAI
                  </span>
                  <h3 className="text-xl font-black text-white tracking-wide">
                    {cast.character}
                  </h3>
                </div>
              </div>

              {/* Actor Details Bottom */}
              <div className="p-4 pt-2 text-left flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="text-sm font-black text-amber-400 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span>{cast.name}</span>
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {cast.roleDescription}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
