
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMusicLibrary } from '../hooks/useMusicLibrary';
import { Song, Artist } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const GENRE_OPTIONS = [
  'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'EDM', 
  'Dance', 'House', 'Techno', 'Trance', 'Dubstep', 'Reggae', 'Blues', 'Country', 
  'Folk', 'Acoustic', 'Metal', 'Punk', 'Indie', 'Alternative', 'Afrobeat', 
  'Latin', 'World', 'Soundtrack', 'Instrumental', 'Lofi', 'Chill', 'Ambient', 
  'Gospel', 'K-Pop', 'J-Pop'
];

const AdminPanel: React.FC = () => {
  const { addSong, addArtist, artists, refreshData } = useMusicLibrary();
  const [activeTab, setActiveTab] = useState<'song' | 'artist'>('song');
  const navigate = useNavigate();
  
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isArtistDropdownOpen, setIsArtistDropdownOpen] = useState(false);
  const [isCustomGenre, setIsCustomGenre] = useState(false);
  
  const genreRef = useRef<HTMLDivElement>(null);
  const artistRef = useRef<HTMLDivElement>(null);

  const [songForm, setSongForm] = useState<Omit<Song, 'id' | 'downloadUrl' | 'albumArtUrl'>>({
    title: '', artist: '', album: '', genre: 'Pop', year: new Date().getFullYear().toString(), description: '', lyrics: '', bpm: 120, key: '', youtubeUrl: '', artistId: ''
  });
  const [customGenreValue, setCustomGenreValue] = useState('');
  const [songFile, setSongFile] = useState<File | null>(null);
  const [songArt, setSongArt] = useState<File | null>(null);

  const [artistForm, setArtistForm] = useState<Omit<Artist, 'id' | 'imageUrl'>>({
    name: '', type: 'Pop Singer', description: ''
  });
  const [artistPhoto, setArtistPhoto] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Strictly use env variables
  const env = (import.meta as any).env;
  const workerUrl = env.VITE_WORKER_URL;
  const uploadSecret = env.VITE_UPLOAD_SECRET;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genreRef.current && !genreRef.current.contains(event.target as Node)) setIsGenreDropdownOpen(false);
      if (artistRef.current && !artistRef.current.contains(event.target as Node)) setIsArtistDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const uploadToR2 = async (file: File) => {
    if (!workerUrl) throw new Error("Worker URL not configured.");
    const key = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const res = await fetch(`${workerUrl}/${encodeURIComponent(key)}`, {
      method: 'PUT',
      body: file,
      headers: { 'X-Custom-Auth-Key': uploadSecret, 'Content-Type': file.type },
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  const handleArtistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artistPhoto) return setMessage({type:'error', text:'Photo is required'});
    setIsUploading(true);
    try {
      const imageUrl = await uploadToR2(artistPhoto);
      await addArtist({ ...artistForm, imageUrl });
      setMessage({type:'success', text:'Artist profile created!'});
      await refreshData();
      setTimeout(() => navigate('/'), 1800);
    } catch (err: any) {
      setMessage({type:'error', text: err.message});
    } finally { setIsUploading(false); }
  };

  const handleSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songFile || !songArt) return setMessage({type:'error', text:'Audio and Cover are required'});
    if (!songForm.artistId) return setMessage({type:'error', text:'Please select an artist'});
    
    setIsUploading(true);
    try {
      const [downloadUrl, albumArtUrl] = await Promise.all([
        uploadToR2(songFile),
        uploadToR2(songArt)
      ]);
      const finalGenre = isCustomGenre ? customGenreValue : songForm.genre;
      await addSong({ ...songForm, genre: finalGenre, downloadUrl, albumArtUrl });
      setMessage({type:'success', text:'Track published successfully!'});
      await refreshData();
      setTimeout(() => navigate('/'), 1800);
    } catch (err: any) {
      setMessage({type:'error', text: err.message});
    } finally { setIsUploading(false); }
  };

  const selectedArtistObj = artists.find(a => a.id === songForm.artistId);

  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <button onClick={() => navigate('/')} className="flex items-center text-[10px] font-black text-sp-gray hover:text-black uppercase tracking-widest mb-2 transition-all">
            <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back
          </button>
          <h1 className="text-3xl font-black text-black tracking-tight uppercase">Music Manager</h1>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button onClick={() => setActiveTab('song')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'song' ? 'bg-sp-primary text-white' : 'text-sp-gray'}`}>Add Song</button>
          <button onClick={() => setActiveTab('artist')} className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === 'artist' ? 'bg-sp-primary text-white' : 'text-sp-gray'}`}>Add Artist</button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-center border animate-fade-in ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {activeTab === 'artist' ? (
        <form onSubmit={handleArtistSubmit} className="bg-white border border-gray-100 p-6 md:p-10 rounded-3xl shadow-xl space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-sp-light-gray uppercase tracking-widest">Portrait</label>
            <input type="file" accept="image/*" onChange={e => setArtistPhoto(e.target.files?.[0] || null)} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm file:bg-sp-primary file:text-white file:rounded-full file:border-0 file:px-4 file:py-1 file:text-[9px] file:font-black" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input value={artistForm.name} onChange={e => setArtistForm({...artistForm, name: e.target.value})} placeholder="Artist Name" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm outline-none focus:bg-white" required />
            <input value={artistForm.type} onChange={e => setArtistForm({...artistForm, type: e.target.value})} placeholder="Genre / Type" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm outline-none focus:bg-white" required />
          </div>
          <textarea value={artistForm.description} onChange={e => setArtistForm({...artistForm, description: e.target.value})} placeholder="Biography..." rows={4} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm outline-none resize-none focus:bg-white" />
          <button disabled={isUploading} className="w-full bg-black text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-sp-primary transition-all">
            {isUploading ? 'Processing...' : 'Save Artist'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSongSubmit} className="bg-white border border-gray-100 p-6 md:p-10 rounded-3xl shadow-xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-sp-light-gray uppercase tracking-widest">Master MP3</label>
              <input type="file" accept=".mp3" onChange={e => setSongFile(e.target.files?.[0] || null)} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm file:bg-black file:text-white file:rounded-full file:border-0 file:px-4 file:py-1 file:text-[9px]" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-sp-light-gray uppercase tracking-widest">Artwork</label>
              <input type="file" accept="image/*" onChange={e => setSongArt(e.target.files?.[0] || null)} className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm file:bg-black file:text-white file:rounded-full file:border-0 file:px-4 file:py-1 file:text-[9px]" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input value={songForm.title} onChange={e => setSongForm({...songForm, title: e.target.value})} placeholder="Song Title" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm outline-none" required />
            <div className="relative" ref={artistRef}>
              <button type="button" onClick={() => setIsArtistDropdownOpen(!isArtistDropdownOpen)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm font-bold flex items-center justify-between outline-none">
                <div className="flex items-center gap-3">
                  {selectedArtistObj ? (
                    <><img src={selectedArtistObj.imageUrl} className="w-6 h-6 rounded-full object-cover" /><span>{selectedArtistObj.name}</span></>
                  ) : <span className="text-gray-400">Select Artist</span>}
                </div>
                <ChevronRightIcon className={`w-4 h-4 transition-transform ${isArtistDropdownOpen ? 'rotate-90' : ''}`} />
              </button>
              {isArtistDropdownOpen && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto py-2">
                  {artists.map(a => (
                    <button key={a.id} type="button" onClick={() => { setSongForm({...songForm, artistId: a.id, artist: a.name}); setIsArtistDropdownOpen(false); }} className="w-full text-left px-5 py-3 flex items-center gap-4 hover:bg-sp-primary/5">
                      <img src={a.imageUrl} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-xs font-black">{a.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
             <input value={songForm.album} onChange={e => setSongForm({...songForm, album: e.target.value})} placeholder="Album" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm outline-none" />
             <input type="number" value={songForm.year} onChange={e => setSongForm({...songForm, year: e.target.value})} placeholder="Year" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm outline-none" />
             <div className="relative" ref={genreRef}>
                <button type="button" onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm font-bold flex items-center justify-between outline-none">
                  {isCustomGenre ? customGenreValue || 'Custom' : songForm.genre}
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
                {isGenreDropdownOpen && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto py-2">
                    {GENRE_OPTIONS.map(g => (
                      <button key={g} type="button" onClick={() => { setSongForm({...songForm, genre: g}); setIsGenreDropdownOpen(false); setIsCustomGenre(false); }} className="w-full text-left px-5 py-2 text-[10px] font-black uppercase hover:bg-sp-primary/5">{g}</button>
                    ))}
                  </div>
                )}
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-sp-light-gray uppercase tracking-widest">Description & Lyrics</label>
            <textarea value={songForm.description} onChange={e => setSongForm({...songForm, description: e.target.value})} placeholder="Paste Lyrics or Production Notes here..." rows={8} className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm outline-none resize-none focus:bg-white font-sans" />
          </div>

          <input value={songForm.youtubeUrl} onChange={e => setSongForm({...songForm, youtubeUrl: e.target.value})} placeholder="YouTube Video ID" className="w-full bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm outline-none" />

          <button disabled={isUploading} className="w-full bg-sp-primary text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-sp-secondary transition-all">
            {isUploading ? 'Uploading Assets...' : 'Publish Master'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminPanel;