
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMusicLibrary } from '../hooks/useMusicLibrary';
import { Song } from '../types';
import SongCard from './SongCard';
import { HeartFilledIcon } from './icons';

interface LikedSongsPageProps {
  onSelectSong: (song: Song) => void;
  onPlaySong: (song: Song) => void;
}

const LikedSongsPage: React.FC<LikedSongsPageProps> = ({ onSelectSong, onPlaySong }) => {
  const { profile } = useAuth();
  const { songs } = useMusicLibrary();

  const likedSongs = songs.filter(song => profile?.likedSongs.includes(song.id));

  return (
    <div className="animate-fade-in max-w-7xl mx-auto">
      <div className="flex items-center space-x-6 mb-10 pb-8 border-b border-gray-100">
        <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-sp-primary to-sp-secondary flex items-center justify-center rounded-2xl shadow-xl">
            <HeartFilledIcon className="w-10 h-10 md:w-14 md:h-14 text-white"/>
        </div>
        <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-sp-primary mb-1">Playlist</p>
            <h1 className="text-3xl md:text-5xl font-black text-black tracking-tighter">Favourites</h1>
            <p className="text-sm text-sp-gray mt-2 font-bold">
              {likedSongs.length} {likedSongs.length === 1 ? 'track' : 'tracks'} saved to your library
            </p>
        </div>
      </div>
      
      {likedSongs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {likedSongs.map(song => (
            <SongCard key={song.id} song={song} onSelect={onSelectSong} onPlay={onPlaySong} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
            <HeartFilledIcon className="w-10 h-10 text-sp-light-gray opacity-20" />
          </div>
          <h2 className="text-xl font-black text-black">Your collection is empty</h2>
          <p className="mt-2 text-sp-gray text-sm font-medium max-w-xs mx-auto">Click the heart icon on any track to save it here for quick access.</p>
        </div>
      )}
    </div>
  );
};

export default LikedSongsPage;
