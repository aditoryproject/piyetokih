export interface MovieCastMember {
  id: string;
  actorName: string;
  characterName: string;
  badge: string;
  photoUrl: string;
  bio: string;
}

export interface MovieSettings {
  title: string;
  tagline: string;
  posterUrl: string;
  backdropUrl: string;
  trailerYoutubeUrl: string; // e.g. "https://www.youtube.com/watch?v=..."
  releaseDateText: string;
  showLsfBadge?: boolean;
  lsfRatingText?: string;
  synopsis: string;
  quoteDialog: string;
  director: string;
  writer: string;
  cast: MovieCastMember[];
}

export const DEFAULT_MOVIE_SETTINGS: MovieSettings = {
  title: 'PIYE TO KIH? THE MOVIE',
  tagline: 'Kisah Komedi Horor Layar Lebar Paling Koplak & Menghibur',
  posterUrl: '/official-poster.jpg',
  backdropUrl: '/official-poster.jpg',
  trailerYoutubeUrl: '',
  releaseDateText: '19 November 2026',
  showLsfBadge: true,
  lsfRatingText: 'LSF 13+',
  synopsis: 'Mukidi yang patah hati berniat membuktikan diri dengan nekat membeli rumah tua murah untuk modal menikah. Namun di rumah tua itu, Mukidi justru jatuh cinta pada Sukma—gadis berparas ayu jelita yang ternyata bukan berasal dari dunia manusia. Bersama Pak Ndut (Gendut) dan Penyok, sahabat karibnya dari Woko Channel, petualangan kocak bercampur mistis penuh gelak tawa pun dimulai!',
  quoteDialog: 'Niat ati golek omah murah gawe rabi, malah kepincut prawan ayu sing ora tau saba awan...',
  director: 'Ito Mavin',
  writer: 'Endik Koeswoyo & Ito Mavin',
  cast: [
    {
      id: 'cast-1',
      actorName: 'Heri Chandra',
      characterName: 'Mukidi',
      badge: 'Pemeran Utama • Woko Channel',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      bio: '',
    },
    {
      id: 'cast-2',
      actorName: 'Dara Sarasvati',
      characterName: 'Sukma',
      badge: 'Pemeran Utama',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: '',
    },
    {
      id: 'cast-3',
      actorName: 'Gabriella Desta',
      characterName: 'Pemeran Film',
      badge: 'Pemeran',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      bio: '',
    },
    {
      id: 'cast-4',
      actorName: 'Sutrisno Agung',
      characterName: 'Pak Ndut / Gendut',
      badge: 'Woko Channel',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      bio: '',
    },
    {
      id: 'cast-5',
      actorName: 'Eko Dunung',
      characterName: 'Penyok',
      badge: 'Woko Channel',
      photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
      bio: '',
    },
    {
      id: 'cast-6',
      actorName: 'Davina Aureel',
      characterName: 'Pemeran Film',
      badge: 'Pemeran',
      photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
      bio: '',
    },
    {
      id: 'cast-7',
      actorName: 'TJ Ruth',
      characterName: 'Pemeran Film',
      badge: 'Pemeran',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      bio: '',
    },
    {
      id: 'cast-8',
      actorName: 'Ibnu Gundul',
      characterName: 'Pemeran Film',
      badge: 'Pemeran',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      bio: '',
    },
    {
      id: 'cast-9',
      actorName: 'Yono Bakrie',
      characterName: 'Pemeran Film',
      badge: 'Pemeran',
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      bio: '',
    },
    {
      id: 'cast-10',
      actorName: 'Lorenzo Gibbs',
      characterName: 'Pemeran Film',
      badge: 'Pemeran',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      bio: '',
    },
    {
      id: 'cast-11',
      actorName: 'Ivonne Dahler',
      characterName: 'Pemeran Film',
      badge: 'Pemeran',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      bio: '',
    },
    {
      id: 'cast-12',
      actorName: 'Marwoto',
      characterName: 'Pemeran Film',
      badge: 'Komedian Legendaris',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
      bio: '',
    },
    {
      id: 'cast-13',
      actorName: 'Faisal Wash',
      characterName: 'Pemeran Film',
      badge: 'Pemeran',
      photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80',
      bio: '',
    },
    {
      id: 'cast-14',
      actorName: 'Rizka Octavia',
      characterName: 'Pemeran Film',
      badge: 'Pemeran',
      photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      bio: '',
    },
  ],
};
