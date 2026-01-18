
import React from 'react';
import { Song } from '../types';
import SongCard from './SongCard';
import { SearchIcon } from './icons';

interface SearchResultsPageProps {
  query: string;
  results: Song[];
  onSelectSong: (song: Song) => void;
  onPlaySong: (song: Song) => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ query, results, onSelectSong, onPlaySong }) => {
  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-2 md:px-0">
      <div className="mb-10 pb-5 border-b border-gray-100">
        <h1 className="text-2xl md:text-4xl font-black text-black tracking-tight leading-none uppercase">
          Results for <span className="text-sp-primary">"{query}"</span>
        </h1>
        <p className="text-[10px] font-black text-sp-light-gray uppercase tracking-widest mt-2">{results.length} tracks discovered</p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 md:gap-10">
          {results.map(song => (
            <SongCard key={song.id} song={song} onSelect={onSelectSong} onPlay={onPlaySong} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-gray-50 rounded-[3rem] border border-gray-100 shadow-inner">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
            <SearchIcon className="w-8 h-8 text-sp-light-gray" />
          </div>
          <h2 className="text-2xl font-black text-black tracking-tight uppercase">No results found for "{query}"</h2>
          <p className="mt-2 text-sp-gray font-medium max-w-md mx-auto">Try searching for something else. Check your spelling or try a different artist, album, or song title.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
