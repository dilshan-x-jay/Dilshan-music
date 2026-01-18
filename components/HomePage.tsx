
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useMusicLibrary } from '../hooks/useMusicLibrary';
import { Song } from '../types';
import SongCard from './SongCard';
import { PlayIcon, LibraryIcon, ChevronLeftIcon } from './icons';

interface HomePageProps {
  onSelectSong: (song: Song) => void;
  onPlaySong: (song: Song) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onSelectSong, onPlaySong }) => {
  const { songs, isLoading } = useMusicLibrary();
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  if (isLoading) return null;

  const seoTitle = "Dilshan Music | Discover & Download High-Fidelity Tracks";
  const seoDescription = "Stream and download the latest high-quality music from independent artists. Experience audiophile-grade audio curated by Dilshan Chanushka.";

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-sp-gray text-center p-6">
        <Helmet>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
        </Helmet>
        <p className="text-lg font-bold text-black mb-1">Library is currently empty.</p>
        <p className="text-sm font-medium">Add some tracks in the Admin Portal!</p>
      </div>
    );
  }

  const trendingSong = songs[0];

  const albums = songs.reduce((acc, song) => {
    if (song.album && song.album.trim() !== '') {
      if (!acc[song.album]) acc[song.album] = [];
      acc[song.album].push(song);
    }
    return acc;
  }, {} as Record<string, Song[]>);

  const songsByGenre = songs.reduce((acc, song) => {
    const genre = song.genre || 'General';
    if (!acc[genre]) acc[genre] = [];
    acc[genre].push(song);
    return acc;
  }, {} as Record<string, Song[]>);

  const songsByYear = songs.reduce((acc, song) => {
    const year = song.year || 'Legacy';
    if (!acc[year]) acc[year] = [];
    acc[year].push(song);
    return acc;
  }, {} as Record<string, Song[]>);

  const sortedYears = Object.keys(songsByYear).sort((a, b) => b.localeCompare(a));

  if (selectedAlbum && albums[selectedAlbum]) {
    const albumSongs = albums[selectedAlbum];
    const mainTrack = albumSongs[0];

    return (
      <div className="animate-fade-in space-y-12 max-w-7xl mx-auto pb-24 px-2 sm:px-0">
        <Helmet>
          <title>{`${selectedAlbum} by ${mainTrack.artist} | Dilshan Music`}</title>
          <meta name="description" content={`Explore the full album ${selectedAlbum} by ${mainTrack.artist}. Stream and download high-quality tracks from the archive.`} />
        </Helmet>
        <button 
          onClick={() => setSelectedAlbum(null)}
          className="flex items-center text-[10px] font-black text-sp-gray hover:text-black uppercase tracking-widest transition-colors mb-6 group"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Archive
        </button>

        <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex-shrink-0 group">
            <div className="absolute inset-0 bg-black rounded-[2.5rem] translate-x-4 -translate-y-3 opacity-5"></div>
            <img 
              src={mainTrack.albumArtUrl} 
              alt={selectedAlbum} 
              className="relative w-full h-full object-cover rounded-[2.5rem] shadow-2xl border border-gray-100 z-10 transition-transform group-hover:scale-[1.02]" 
            />
          </div>
          <div className="text-center lg:text-left space-y-4 flex-1">
            <div>
              <p className="text-[11px] font-black text-sp-primary uppercase tracking-[0.4em] mb-2">Collection Archive</p>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-black tracking-tighter leading-none mb-1 uppercase">{selectedAlbum}</h1>
              <p className="text-xl sm:text-2xl font-bold text-sp-gray uppercase tracking-tighter">{mainTrack.artist}</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button 
                onClick={() => onPlaySong(mainTrack)}
                className="bg-black text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-sp-primary transition-all shadow-xl"
              >
                <PlayIcon className="w-4 h-4 fill-white" /> Play Album
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[3rem] p-4 sm:p-10 shadow-sm space-y-2">
          {albumSongs.map((song, index) => (
            <div 
              key={song.id}
              onClick={() => onSelectSong(song)}
              className="group flex items-center hover:bg-gray-50 p-3 sm:p-4 rounded-2xl transition-all cursor-pointer"
            >
              <span className="w-8 sm:w-10 text-[11px] font-black text-sp-light-gray tabular-nums">{(index + 1).toString().padStart(2, '0')}</span>
              <div className="w-12 h-12 rounded-xl overflow-hidden mr-4 sm:mr-5 shadow-sm border border-gray-100">
                <img src={song.albumArtUrl} alt={song.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-sm sm:text-base font-black text-black truncate uppercase">{song.title}</h4>
                <p className="text-[11px] sm:text-xs font-bold text-sp-gray truncate uppercase">{song.artist}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onPlaySong(song); }} className="p-3 bg-sp-primary/10 text-sp-primary rounded-full"><PlayIcon className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-fade-in max-w-7xl mx-auto pb-24 px-2 sm:px-0">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={window.location.origin} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {trendingSong && (
        <div className="relative rounded-[2.5rem] overflow-hidden h-[300px] md:h-[350px] w-full group shadow-2xl border border-gray-100 mx-auto">
          <img src={trendingSong.albumArtUrl} alt={trendingSong.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[0.9] mb-3 tracking-tighter uppercase">{trendingSong.title}</h1>
            <p className="text-lg md:text-xl font-bold text-white/70 mb-8 uppercase tracking-wide">{trendingSong.artist}</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button onClick={() => onPlaySong(trendingSong)} className="bg-sp-primary hover:bg-sp-secondary text-white font-black py-4 px-10 rounded-2xl transition-all uppercase text-xs tracking-widest flex items-center justify-center shadow-lg"><PlayIcon className="w-4 h-4 mr-3 fill-white" /> Start Listening</button>
            </div>
          </div>
        </div>
      )}

      {Object.keys(albums).length > 0 && (
        <section className="px-2 md:px-0">
          <h2 className="text-2xl md:text-3xl font-black text-black tracking-tighter flex items-center mb-10 border-b pb-5 uppercase"><LibraryIcon className="w-8 h-8 mr-4 text-sp-primary" /> Album Archive</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(albums).map(([albumName, albumSongs]) => (
              <div key={albumName} className="bg-white border border-gray-100 rounded-[2.5rem] p-5 shadow-sm hover:shadow-2xl transition-all group flex items-center gap-6 cursor-pointer" onClick={() => setSelectedAlbum(albumName)}>
                <img src={albumSongs[0].albumArtUrl} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-2xl shadow-xl" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-black text-black truncate mb-1 uppercase tracking-tight">{albumName}</h3>
                  <p className="text-xs font-bold text-sp-gray truncate mb-3 uppercase">{albumSongs[0].artist}</p>
                  <span className="text-[9px] font-black bg-gray-50 text-sp-light-gray px-3 py-1.5 rounded-full uppercase tracking-widest border border-gray-100">{albumSongs.length} Tracks</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {sortedYears.map(year => (
         <section key={year} className="px-2 md:px-0">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-5">
            <h2 className="text-2xl md:text-3xl font-black text-black tracking-tighter flex items-center uppercase"><span className="w-1.5 h-8 bg-black mr-4 rounded-full shadow-sm"></span> Classics of {year}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 md:gap-10">
            {songsByYear[year].map(song => (
              <SongCard key={song.id} song={song} onSelect={onSelectSong} onPlay={onPlaySong} />
            ))}
          </div>
        </section>
      ))}

      {Object.entries(songsByGenre).map(([genre, genreSongs]) => (
         <section key={genre} className="px-2 md:px-0">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-5">
            <h2 className="text-2xl md:text-3xl font-black text-black tracking-tighter flex items-center uppercase"><span className="w-1.5 h-8 bg-sp-primary mr-4 rounded-full shadow-sm"></span> {genre}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6 md:gap-10">
            {genreSongs.map(song => (
              <SongCard key={song.id} song={song} onSelect={onSelectSong} onPlay={onPlaySong} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default HomePage;
