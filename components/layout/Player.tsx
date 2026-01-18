
import React, { useState, useRef, useEffect } from 'react';
import { Song } from '../../types';
import MarqueeText from '../common/MarqueeText';
import { PlayIcon, PauseIcon, NextIcon, PrevIcon, HeartIcon, HeartFilledIcon, VolumeIcon, ShuffleIcon, RepeatIcon, CloseIcon } from '../icons';
import { useAuth } from '../../hooks/useAuth';

interface PlayerProps {
  song: Song | null;
  onClose: () => void;
}

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const Player: React.FC<PlayerProps> = ({ song, onClose }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const { profile, toggleLike } = useAuth();

  const isLiked = song ? profile?.likedSongs?.includes(song.id) : false;

  useEffect(() => {
    if (song && audioRef.current) {
      if (audioRef.current.src !== song.downloadUrl) {
         audioRef.current.src = song.downloadUrl;
         setCurrentTime(0);
         setDuration(0);
      }
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => console.error("Playback failed", e));
    } else if (!song && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
    }
  }, [song]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const newTime = (clickPosition / rect.width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (!song) return null;

  return (
    <footer className="bg-white/95 backdrop-blur-xl border-t border-gray-100 h-24 w-full flex-shrink-0 fixed bottom-0 left-0 right-0 z-50 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="hidden"
      />
      <div className="flex items-center justify-between h-full gap-2 sm:gap-4 max-w-7xl mx-auto">
        {/* Track Info */}
        <div className="flex items-center flex-1 md:flex-none md:w-1/4 min-w-0 pr-2">
          <div className="relative flex-shrink-0">
             <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50 group">
                <img src={song.albumArtUrl} alt={song.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
             </div>
          </div>
          <div className="ml-3 sm:ml-4 min-w-0 flex-1">
            <MarqueeText className="font-black text-black text-[13px] sm:text-sm tracking-tight">{song.title}</MarqueeText>
            <MarqueeText className="text-[11px] sm:text-xs text-sp-primary font-bold">{song.artist}</MarqueeText>
          </div>
        </div>

        {/* Player Controls & Waveform Progress */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center md:flex-1 md:w-1/2">
          <div className="flex items-center space-x-3 sm:space-x-8 mb-1">
            <ShuffleIcon className="w-4 h-4 text-sp-light-gray hover:text-black cursor-pointer hidden md:block transition-colors" />
            <PrevIcon className="w-7 h-7 text-sp-light-gray hover:text-black cursor-pointer transition-colors" />
            <button 
              onClick={handlePlayPause} 
              className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-all shadow-xl active:scale-95 hover:bg-sp-primary"
            >
              {isPlaying ? <PauseIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-white" /> : <PlayIcon className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />}
            </button>
            <NextIcon className="w-7 h-7 text-sp-light-gray hover:text-black cursor-pointer transition-colors" />
            <RepeatIcon className="w-4 h-4 text-sp-light-gray hover:text-black cursor-pointer hidden md:block transition-colors" />
          </div>
          
          <div className="flex items-center space-x-3 w-full max-w-lg">
            <span className="text-[9px] font-black text-sp-light-gray w-8 text-right tabular-nums hidden sm:inline">{formatTime(currentTime)}</span>
            <div onClick={handleSeek} className="w-full h-8 flex items-center group cursor-pointer relative">
              {/* Fake Waveform Background */}
              <div className="absolute inset-0 flex items-center justify-between gap-[2px] opacity-20 group-hover:opacity-30 transition-opacity">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-sp-light-gray rounded-full" 
                    style={{ height: `${20 + Math.random() * 60}%` }}
                  />
                ))}
              </div>
              {/* Active Waveform Overlay */}
              <div 
                className="absolute inset-0 flex items-center justify-between gap-[2px] overflow-hidden pointer-events-none transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              >
                {Array.from({ length: 40 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 ${isPlaying ? 'bg-sp-primary' : 'bg-black'} rounded-full`} 
                    style={{ 
                      height: `${20 + Math.random() * 60}%`,
                      animation: isPlaying ? `pulse-bar ${0.5 + Math.random()}s infinite alternate` : 'none'
                    }}
                  />
                ))}
              </div>
            </div>
            <span className="text-[9px] font-black text-sp-light-gray w-8 tabular-nums hidden sm:inline">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Close */}
        <div className="flex items-center justify-end flex-none md:w-1/4 space-x-1 sm:space-x-4">
            <button onClick={() => song && toggleLike(song.id)} className="p-2 text-sp-light-gray hover:text-sp-primary transition-all hidden md:block">
              {isLiked ? <HeartFilledIcon className="w-5 h-5 text-sp-primary" /> : <HeartIcon className="w-5 h-5" />}
            </button>
            <div className="hidden lg:flex items-center space-x-2">
              <VolumeIcon className="w-4 h-4 text-sp-light-gray" />
              <input 
                type="range" 
                min="0" max="1" step="0.01" defaultValue="0.75"
                onChange={e => { if (audioRef.current) audioRef.current.volume = parseFloat(e.target.value) }}
                className="w-20 h-1 bg-gray-100 rounded-full appearance-none cursor-pointer accent-black"
              />
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-sp-light-gray hover:text-black hover:bg-gray-100 transition-all">
                <CloseIcon className="w-5 h-5" />
            </button>
        </div>
      </div>
      <style>{`
        @keyframes pulse-bar {
          from { opacity: 0.6; transform: scaleY(0.8); }
          to { opacity: 1; transform: scaleY(1.2); }
        }
      `}</style>
    </footer>
  );
};

export default Player;
