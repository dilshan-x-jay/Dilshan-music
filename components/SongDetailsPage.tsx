
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Song } from '../types';
import { PlayIcon, DownloadIcon, HeartIcon, HeartFilledIcon } from './icons';
import { useAuth } from '../hooks/useAuth';

interface SongDetailsPageProps {
  song: Song;
  onPlay: (song: Song) => void;
}

const SongDetailsPage: React.FC<SongDetailsPageProps> = ({ song, onPlay }) => {
  const { user, profile, toggleLike } = useAuth();
  const navigate = useNavigate();
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const isLiked = profile?.likedSongs?.includes(song.id);

  // SEO & Social Configuration
  const siteOrigin = "https://dilshan-music.vercel.app";
  const songSlug = song.title.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  const absoluteShareUrl = `${siteOrigin}/song/${songSlug}`;
  
  const seoTitle = `${song.title} - ${song.artist} | Dilshan Music`;
  const seoDescription = song.description?.slice(0, 160) || `Listen to ${song.title} by ${song.artist} on Dilshan Music.`;
  
  const ogImageUrl = song.albumArtUrl.startsWith('http') 
    ? song.albumArtUrl 
    : `${siteOrigin}${song.albumArtUrl.startsWith('/') ? '' : '/'}${song.albumArtUrl}`;

  // Smart Parser: Split description into "Credits" and "Lyrics"
  const lines = song.description?.split('\n') || [];
  const hasLyrics = lines.length > 3; // If it has many lines, treat as lyrics
  
  // We assume the first 1-2 lines might be credits if they are short
  const creditLines = hasLyrics ? lines.slice(0, 2).filter(l => l.length < 100) : [];
  const lyricLines = hasLyrics ? lines.slice(creditLines.length) : lines;

  const handleLikeClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    toggleLike(song.id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: seoTitle,
        text: seoDescription,
        url: absoluteShareUrl,
      });
    } else {
      navigator.clipboard.writeText(absoluteShareUrl);
      setIsSharing(true);
      setTimeout(() => setIsSharing(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (downloadProgress !== null || isPreparing) return;
    setIsPreparing(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsPreparing(false);
    setDownloadProgress(0);

    try {
      const response = await fetch(song.downloadUrl);
      if (!response.ok) throw new Error('Download failed');
      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;
      const reader = response.body?.getReader();
      if (!reader) throw new Error('ReadableStream not supported');
      
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        if (total) setDownloadProgress(Math.round((loaded / total) * 100));
      }
      
      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${song.title} - ${song.artist} [Dilshan Music].mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      alert('Vault access denied.');
    } finally {
      setDownloadProgress(null);
    }
  };

  return (
    <div className="animate-fade-in text-sp-gray pb-32 px-0 sm:px-4">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:type" content="music.song" />
        <meta property="og:url" content={absoluteShareUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={ogImageUrl} />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[3.5rem] bg-white border border-gray-100 shadow-2xl mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 p-4 sm:p-6 md:p-12 lg:p-20 items-start">
            
            {/* Left Column: Artwork & Actions */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center w-full">
              <div className="relative group w-full max-w-[400px]">
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.15)] transition-all duration-700 group-hover:scale-[1.02] aspect-square bg-gray-50">
                  <img src={song.albumArtUrl} alt={song.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                    <button onClick={() => onPlay(song)} className="bg-sp-primary text-white p-6 rounded-full shadow-2xl scale-125 hover:scale-135 transition-all">
                      <PlayIcon className="w-8 h-8 fill-white" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-[400px] space-y-4 mt-8 md:mt-10 px-2 sm:px-0">
                <button 
                  onClick={handleDownload}
                  disabled={downloadProgress !== null || isPreparing}
                  className={`w-full font-black py-5 rounded-2xl transition-all shadow-xl uppercase text-[10px] tracking-[0.3em] flex items-center justify-center border-2 ${isPreparing || downloadProgress !== null ? 'bg-gray-100 border-gray-200 text-sp-gray' : 'bg-black border-black text-white hover:bg-sp-primary hover:border-sp-primary'}`}
                >
                  {isPreparing ? 'Syncing...' : downloadProgress !== null ? `Downloading ${downloadProgress}%` : <><DownloadIcon className="w-5 h-5 mr-3" /> Get Master MP3</>}
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={handleLikeClick} className={`flex items-center justify-center py-4 rounded-2xl border transition-all font-black text-[9px] uppercase tracking-widest ${isLiked ? 'bg-sp-primary/10 border-sp-primary text-sp-primary' : 'bg-white border-gray-100 text-sp-gray hover:border-black'}`}>
                    {isLiked ? <HeartFilledIcon className="w-4 h-4 mr-2" /> : <HeartIcon className="w-4 h-4 mr-2" />} Liked
                  </button>
                  <button onClick={handleShare} className="bg-white border border-gray-100 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-sp-gray hover:border-black transition-all">
                    {isSharing ? 'Copied' : 'Share'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Details & Smart Description */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
              <div className="space-y-4 mb-8">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  <span className="bg-sp-primary text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{song.genre}</span>
                  {song.year && <span className="bg-black text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">{song.year}</span>}
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black leading-[0.9] tracking-tighter uppercase">{song.title}</h1>
                <p className="text-xl sm:text-2xl md:text-3xl font-black text-sp-primary uppercase tracking-tight">{song.artist}</p>
              </div>

              {/* Stats Bar */}
              <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-gray-100 px-2 sm:px-0">
                {[
                  { label: 'Bitrate', value: '320 KBPS' },
                  { label: 'Year', value: song.year || 'N/A' },
                  { label: 'Format', value: 'MP3' },
                  { label: 'Quality', value: 'High-Fi' }
                ].map((stat, i) => (
                  <div key={i} className="text-center p-3 bg-gray-50/50 rounded-xl border border-gray-50">
                    <p className="text-[8px] font-black uppercase tracking-widest text-sp-light-gray mb-1">{stat.label}</p>
                    <p className="text-sm font-black text-black">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Description & Lyrics Section */}
              <div className="w-full space-y-12 mt-12 px-1 sm:px-0">
                {song.description && (
                  <div className="w-full">
                    {/* Credits Sub-section (if any) */}
                    {creditLines.length > 0 && (
                      <div className="mb-10 text-left">
                         <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-sp-light-gray mb-4">Production Credits</h3>
                         <div className="text-black font-bold text-sm sm:text-base opacity-70 leading-relaxed">
                            {creditLines.join('\n')}
                         </div>
                      </div>
                    )}

                    {/* Main Content Area (Lyrics) */}
                    <section className="bg-gray-50/50 p-8 sm:p-12 md:p-16 rounded-[2.5rem] border border-gray-100 text-center w-full shadow-inner">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-sp-primary mb-10">Song Lyrics</h3>
                      <p className="text-black leading-[2.2] text-lg sm:text-xl md:text-2xl font-semibold whitespace-pre-wrap break-words font-sans selection:bg-sp-primary selection:text-white">
                        {lyricLines.join('\n').trim()}
                      </p>
                      
                      {/* Signature Footer */}
                      <div className="mt-16 pt-8 border-t border-gray-200/50 opacity-20 flex flex-col items-center">
                         <div className="w-10 h-1 bg-black mb-4 rounded-full"></div>
                         <p className="text-[9px] font-black uppercase tracking-widest">Dilshan Music • Master Archive</p>
                      </div>
                    </section>
                  </div>
                )}

                {song.youtubeUrl && (
                  <section className="w-full">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-sp-light-gray mb-6 text-center lg:text-left">Official Visualizer</h3>
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 aspect-video bg-black w-full">
                      <iframe 
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${song.youtubeUrl}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetailsPage;