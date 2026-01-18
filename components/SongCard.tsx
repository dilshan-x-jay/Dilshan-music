
import React from 'react';
import { Song } from '../types';
import { PlayIcon } from './icons';

interface SongCardProps {
  song: Song;
  onSelect: (song: Song) => void;
  onPlay: (song: Song) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onSelect, onPlay }) => {
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay(song);
  };
  
  return (
    <div 
      onClick={() => onSelect(song)}
      className="bg-white rounded-2xl md:rounded-[2rem] group cursor-pointer transition-all duration-300 border border-gray-100 hover:border-sp-primary/20 hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter') onSelect(song); }}
      aria-label={`View details for ${song.title}`}
    >
      {/* MOBILE VIEW: List Layout */}
      <div className="flex md:hidden items-center p-3 sm:p-4 gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <img src={song.albumArtUrl} alt={song.title} className="w-full h-full object-cover rounded-xl shadow-sm" />
          <button 
            onClick={handlePlayClick}
            className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-active:opacity-100 transition-opacity rounded-xl"
          >
            <PlayIcon className="w-6 h-6 text-white fill-white" />
          </button>
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-black font-black text-sm truncate mb-0.5 leading-tight uppercase tracking-tight">{song.title}</h3>
          <p className="text-[11px] text-sp-gray font-bold truncate uppercase tracking-tighter">{song.artist}</p>
          <div className="mt-1">
             <span className="text-[8px] font-black bg-gray-100 px-2 py-0.5 rounded text-sp-light-gray uppercase tracking-widest">{song.genre}</span>
          </div>
        </div>
        <button 
          onClick={handlePlayClick}
          className="p-3 bg-sp-primary/10 text-sp-primary rounded-full"
        >
          <PlayIcon className="w-4 h-4 fill-sp-primary" />
        </button>
      </div>

      {/* DESKTOP VIEW: Grid Layout */}
      <div className="hidden md:block p-4">
        <div className="relative mb-5">
          <div className="relative rounded-[1.5rem] overflow-hidden aspect-square shadow-md">
             <img src={song.albumArtUrl} alt={song.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          </div>
          <button 
            onClick={handlePlayClick}
            className="absolute bottom-3 right-3 w-12 h-12 bg-sp-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-2xl"
          >
            <PlayIcon className="w-6 h-6 text-white fill-white" />
          </button>
        </div>
        <div className="px-1 pb-1">
          <h3 className="text-black font-black text-sm truncate leading-tight mb-1 group-hover:text-sp-primary transition-colors uppercase tracking-tight">{song.title}</h3>
          <p className="text-xs text-sp-gray font-bold truncate uppercase tracking-tighter">{song.artist}</p>
        </div>
      </div>
    </div>
  );
};

export default SongCard;
