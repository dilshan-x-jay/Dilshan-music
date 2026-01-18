
import React from 'react';
import { Artist, Song } from '../types';
import { useMusicLibrary } from '../hooks/useMusicLibrary';
import SongCard from './SongCard';
import { HeartIcon, PlayIcon } from './icons';

interface ArtistDetailsPageProps {
  artist: Artist;
  onSelectSong: (song: Song) => void;
  onPlaySong: (song: Song) => void;
}

const ArtistDetailsPage: React.FC<ArtistDetailsPageProps> = ({ artist, onSelectSong, onPlaySong }) => {
  const { songs } = useMusicLibrary();
  const artistSongs = songs.filter(s => s.artistId === artist.id || s.artist === artist.name);

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 animate-fade-in">
      {/* Artist Profile Banner */}
      <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 mb-10 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm relative overflow-hidden">
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden border border-gray-200 flex-shrink-0 shadow-xl">
          <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black text-black mb-2 tracking-tighter">{artist.name}</h1>
          <p className="text-sp-primary text-lg font-black mb-6 uppercase tracking-wider text-xs">{artist.type}</p>
          
          <div className="flex flex-col mb-4 items-center md:items-start">
            <span className="text-black text-3xl font-black">{artistSongs.length}</span>
            <span className="text-sp-gray text-[10px] font-black uppercase tracking-[0.2em]">Total Songs</span>
          </div>
          
          {artist.description && (
            <p className="text-sp-gray font-medium text-sm max-w-2xl leading-relaxed mt-4">
              {artist.description}
            </p>
          )}
        </div>
      </div>

      {/* Song List Header */}
      <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-black text-black tracking-tight">Discography</h2>
        <p className="text-sp-gray text-[10px] font-black uppercase tracking-widest">{artistSongs.length} tracks</p>
      </div>

      {/* Track Listing */}
      <div className="space-y-3">
        {artistSongs.map((song, idx) => (
          <div 
            key={song.id}
            onClick={() => onSelectSong(song)}
            className="group flex items-center bg-white hover:bg-gray-50 border border-gray-100 p-4 rounded-2xl transition-all cursor-pointer hover:shadow-md"
          >
            <div className="text-sp-light-gray font-black text-xs w-8 hidden md:block">{idx + 1}</div>
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 mr-4 shadow-sm">
              <img src={song.albumArtUrl} alt={song.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-black font-bold text-sm truncate">{song.title}</h4>
              <p className="text-sp-gray text-[11px] font-medium truncate">{song.artist}</p>
            </div>
            <div className="flex items-center gap-4">
               <button 
                 onClick={(e) => { e.stopPropagation(); onPlaySong(song); }}
                 className="p-2 bg-sp-primary/10 text-sp-primary rounded-full md:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sp-primary hover:text-white"
               >
                 <PlayIcon className="w-4 h-4" />
               </button>
               <HeartIcon className="w-5 h-5 text-sp-light-gray group-hover:text-sp-primary transition-colors hidden md:block" />
               <button className="text-sp-light-gray hover:text-black p-2 font-black text-sm">•••</button>
            </div>
          </div>
        ))}
      </div>

      {artistSongs.length === 0 && (
        <div className="text-center py-20 text-sp-gray uppercase font-black text-[10px] tracking-widest border border-dashed border-gray-200 rounded-3xl bg-gray-50">
          No songs found for this artist.
        </div>
      )}
    </div>
  );
};

export default ArtistDetailsPage;
