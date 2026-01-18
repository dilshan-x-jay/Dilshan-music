
export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArtUrl: string;
  downloadUrl: string;
  genre: string;
  year?: string;
  description: string;
  lyrics: string;
  bpm: number;
  key: string;
  youtubeUrl?: string;
  artistId?: string;
}

export interface Artist {
  id: string;
  name: string;
  type: string; // e.g., Pop Singer, Rapper
  imageUrl: string;
  description: string;
  songCount?: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoUrl?: string;
  gender: 'male' | 'female' | 'other';
  role: 'user' | 'admin';
  likedSongs: string[];
}
