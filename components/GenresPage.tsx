
import React from 'react';
import { useMusicLibrary } from '../hooks/useMusicLibrary';
import { useNavigate } from 'react-router-dom';
import { GenreIcon } from './icons';

const GENRE_COLORS: Record<string, string> = {
  'Pop': 'from-pink-500 to-rose-600',
  'Hip Hop': 'from-amber-500 to-orange-600',
  'R&B': 'from-indigo-500 to-blue-600',
  'Rock': 'from-red-500 to-red-700',
  'Electronic': 'from-cyan-500 to-teal-600',
  'Jazz': 'from-emerald-500 to-green-700',
  'Classical': 'from-slate-500 to-slate-700',
  'Reggae': 'from-lime-500 to-green-600',
};

const GenresPage: React.FC = () => {
  const { songs } = useMusicLibrary();
  const navigate = useNavigate();
  
  const genres = Array.from(new Set(songs.map(s => s.genre || 'General')));

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-black tracking-tighter mb-2">Explore Categories</h1>
        <p className="text-sp-gray font-bold">Find your vibe through curated soundscapes</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {genres.map(genre => (
          <div 
            key={genre}
            onClick={() => navigate(`/search?q=${encodeURIComponent(genre)}`)}
            className={`relative h-48 rounded-[2rem] overflow-hidden cursor-pointer group p-8 bg-gradient-to-br ${GENRE_COLORS[genre] || 'from-gray-500 to-gray-700'} shadow-lg hover:scale-[1.03] transition-all`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform">
              <GenreIcon className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between text-white">
              <h3 className="text-2xl font-black tracking-tight">{genre}</h3>
              <p className="text-xs font-black uppercase tracking-widest text-white/70">
                {songs.filter(s => s.genre === genre).length} Master Tracks
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenresPage;
