
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useMusicLibrary } from '../hooks/useMusicLibrary';
import { Artist } from '../types';

interface ArtistsPageProps {
  onSelectArtist: (artist: Artist) => void;
}

const ArtistsPage: React.FC<ArtistsPageProps> = ({ onSelectArtist }) => {
  const { artists, songs, isLoading } = useMusicLibrary();

  if (isLoading) return <div className="text-center py-20 uppercase font-black text-xs text-sp-primary tracking-widest animate-pulse">Discovering Artists...</div>;

  const artistsWithCounts = artists.map(artist => ({
    ...artist,
    songCount: songs.filter(s => s.artistId === artist.id || s.artist === artist.name).length
  }));

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <Helmet>
        <title>Featured Artists | Dilshan Music</title>
        <meta name="description" content="Discover the talented artists behind the high-fidelity tracks on Dilshan Music. Browse bios, discographies, and exclusive releases." />
      </Helmet>

      <header className="mb-10 bg-gray-50 p-8 rounded-3xl border border-gray-100 relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-black mb-2 tracking-tight">All Artists</h1>
          <p className="text-sp-gray text-sm font-bold">
            {artists.length.toLocaleString()} artists available • Curated by SonicPulse
          </p>
        </div>
        <div className="absolute top-1/2 right-8 -translate-y-1/2 w-16 h-1 bg-sp-primary rounded-full opacity-20"></div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {artistsWithCounts.map(artist => (
          <div 
            key={artist.id} 
            onClick={() => onSelectArtist(artist)}
            className="bg-white border border-gray-100 p-5 rounded-3xl hover:border-sp-primary/30 transition-all cursor-pointer group text-center hover:shadow-xl hover:-translate-y-1"
          >
            <div className="relative mb-4 aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-50">
              <img 
                src={artist.imageUrl} 
                alt={artist.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            </div>
            <h3 className="text-black font-black text-sm truncate px-2 mb-1">{artist.name}</h3>
            <p className="text-sp-gray text-[10px] font-black uppercase tracking-wider">{artist.songCount} songs</p>
          </div>
        ))}
      </div>

      {artists.length === 0 && (
        <div className="text-center py-32 border border-dashed border-gray-200 rounded-3xl">
          <p className="text-sp-gray font-black uppercase tracking-widest text-xs">No artists found in the database.</p>
        </div>
      )}
    </div>
  );
};

export default ArtistsPage;
