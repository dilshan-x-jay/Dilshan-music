
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Song, Artist } from '../types';

const WORKER_URL = 'https://cloudwave-music-handler.dilshan-music.workers.dev';

interface MusicContextType {
  songs: Song[];
  artists: Artist[];
  addSong: (songData: Omit<Song, 'id'>) => Promise<void>;
  addArtist: (artistData: Omit<Artist, 'id'>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [songsRes, artistsRes] = await Promise.all([
        fetch(`${WORKER_URL}/api/songs`),
        fetch(`${WORKER_URL}/api/artists`)
      ]);
      
      if (!songsRes.ok || !artistsRes.ok) throw new Error('Failed to fetch library');
      
      const songsData = await songsRes.json();
      const artistsData = await artistsRes.json();
      
      const mappedSongs = Array.isArray(songsData) ? songsData.map((s: any) => ({
        id: s.id?.toString(),
        title: s.title,
        artist: s.artist,
        artistId: s.artistId?.toString() || s.artist_id?.toString() || '',
        album: s.album || '',
        genre: s.genre || 'Pop',
        // LOGIC FIX: Explicitly check for 'year' key from D1 results
        year: s.year !== undefined && s.year !== null ? s.year.toString() : '',
        description: s.description || '',
        lyrics: s.lyrics || '',
        bpm: s.bpm || 120,
        key: s.song_key || s.key || '',
        albumArtUrl: s.albumArtUrl,
        downloadUrl: s.downloadUrl,
        youtubeUrl: s.youtubeUrl || ''
      })) : [];

      const mappedArtists = Array.isArray(artistsData) ? artistsData.map((a: any) => ({
        ...a,
        id: a.id?.toString()
      })) : [];

      setSongs(mappedSongs);
      setArtists(mappedArtists);
      setError(null);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addSong = async (songData: Omit<Song, 'id'>) => {
    const response = await fetch(`${WORKER_URL}/api/songs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Auth-Key': 'dilshanchanushka@123' 
      },
      body: JSON.stringify(songData)
    });
    if (!response.ok) throw new Error('Failed to save song');
    await fetchData();
  };

  const addArtist = async (artistData: Omit<Artist, 'id'>) => {
    const response = await fetch(`${WORKER_URL}/api/artists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Auth-Key': 'dilshanchanushka@123' 
      },
      body: JSON.stringify(artistData)
    });
    if (!response.ok) throw new Error('Failed to save artist');
    await fetchData();
  };

  return (
    <MusicContext.Provider value={{ songs, artists, addSong, addArtist, isLoading, error, refreshData: fetchData }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicLibrary = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusicLibrary must be used within a MusicProvider');
  }
  return context;
};
