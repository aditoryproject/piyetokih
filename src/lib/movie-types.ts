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
  posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
  backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
  trailerYoutubeUrl: '',
  releaseDateText: '19 November 2026',
  showLsfBadge: false,
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
      bio: 'Pria polos penuh kesialan yang nekat beli rumah tua demi modal nikah, tapi malah kepincut Sukma sang putri alam gaib.',
    },
    {
      id: 'cast-2',
      actorName: 'Dara Sarasvati',
      characterName: 'Sukma',
      badge: 'Gadis Misterius Alam Gaib',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: 'Sosok perempuan cantik jelita penunggu rumah tua yang membuat hati Mukidi klepek-klepek tak berdaya.',
    },
    {
      id: 'cast-3',
      actorName: 'Sutrisno Agung',
      characterName: 'Pak Ndut / Gendut',
      badge: 'Sahabat Sejati • Woko Channel',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      bio: 'Sahabat setia yang selalu curiga dan paling panik melihat kelakuan Mukidi yang kasmaran sendirian.',
    },
    {
      id: 'cast-4',
      actorName: 'Eko Dunung',
      characterName: 'Penyok',
      badge: 'Ahli Klenik Koplak • Woko Channel',
      photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
      bio: 'Rekan konyol Mukidi yang selalu punya seribu teori klenik nyeleneh tapi malah bikin suasana makin kacau.',
    },
  ],
};
