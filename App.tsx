
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useSearchParams, useParams, Navigate, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdminPanel from './components/AdminPanel';
import UserManagementPage from './components/UserManagementPage';
import SongDetailsPage from './components/SongDetailsPage';
import SearchResultsPage from './components/SearchResultsPage';
import LoginPage from './components/LoginPage';
import AccountPage from './components/AccountPage';
import LikedSongsPage from './components/LikedSongsPage';
import ArtistsPage from './components/ArtistsPage';
import ArtistDetailsPage from './components/ArtistDetailsPage';
import AboutPage from './components/AboutPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import GenresPage from './components/GenresPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import NotFoundPage from './components/NotFoundPage';
import ScrollToTop from './components/common/ScrollToTop';
import { MusicProvider, useMusicLibrary } from './hooks/useMusicLibrary';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Song, Artist } from './types';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Player from './components/layout/Player';
import Footer from './components/layout/Footer';
import { LogoIcon } from './components/icons';

export const createSlug = (text: string) => {
  if (!text) return 'untitled';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const MainLayout: React.FC = () => {
  const [playingSong, setPlayingSong] = useState<Song | null>(null);
  const { songs, artists, isLoading: musicLoading } = useMusicLibrary();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handlePlaySong = (song: Song) => setPlayingSong(song);
  const handleClosePlayer = () => setPlayingSong(null);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      navigate('/');
    } else {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const navigateToSong = (song: Song) => navigate(`/song/${createSlug(song.title)}`);
  const navigateToArtist = (artist: Artist) => navigate(`/artist/${createSlug(artist.name)}`);

  // Optimized wrapper for instant metadata injection
  const SongDetailsWrapper = () => {
    const { id } = useParams();
    if (musicLoading) return <div className="h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-sp-primary border-t-transparent rounded-full animate-spin"></div></div>;
    const song = songs.find(s => s.id === id || createSlug(s.title) === id);
    if (!song) return <NotFoundPage />;
    return <SongDetailsPage song={song} onPlay={handlePlaySong} />;
  };

  const ArtistDetailsWrapper = () => {
    const { id } = useParams();
    if (musicLoading) return null;
    const artist = artists.find(a => a.id === id || createSlug(a.name) === id);
    return artist ? <ArtistDetailsPage artist={artist} onSelectSong={navigateToSong} onPlaySong={handlePlaySong} /> : <NotFoundPage />;
  };

  const searchQuery = searchParams.get('q') || '';
  const filteredResults = songs.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) || 
      s.artist.toLowerCase().includes(q) || 
      (s.genre && s.genre.toLowerCase() === q) || 
      (s.genre && s.genre.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-white text-sp-gray font-sans flex h-screen overflow-hidden">
      <ScrollToTop />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar onSearch={handleSearch} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-white flex flex-col">
          <div className="flex-grow">
             <div className="p-4 sm:p-6 md:p-8">
                <Routes>
                  <Route path="/" element={<HomePage onSelectSong={navigateToSong} onPlaySong={handlePlaySong} />} />
                  <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><UserManagementPage /></AdminRoute>} />
                  <Route path="/genres" element={<GenresPage />} />
                  <Route path="/song/:id" element={<SongDetailsWrapper />} />
                  <Route path="/artist/:id" element={<ArtistDetailsWrapper />} />
                  <Route path="/artists" element={<ArtistsPage onSelectArtist={navigateToArtist} />} />
                  <Route path="/search" element={<SearchResultsPage query={searchQuery} results={filteredResults} onSelectSong={navigateToSong} onPlaySong={handlePlaySong} />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/liked" element={<LikedSongsPage onSelectSong={navigateToSong} onPlaySong={handlePlaySong} />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/auth/action" element={<ResetPasswordPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsOfServicePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
             </div>
          </div>
          <Footer />
        </main>
      </div>
      <Player song={playingSong} onClose={handleClosePlayer} />
      {isSidebarOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-[45]" onClick={toggleSidebar}></div>}
    </div>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <MusicProvider>
          <AppContent />
        </MusicProvider>
      </AuthProvider>
    </Router>
  );
};

const AppContent: React.FC = () => {
  const { isLoading } = useAuth();
  if (isLoading) return (
    <div className="bg-white h-screen w-screen flex flex-col items-center justify-center animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-sp-primary rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <div className="relative bg-sp-primary p-6 rounded-[2rem] shadow-2xl animate-bounce">
          <LogoIcon className="w-12 h-12 text-white fill-white" />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-black text-black uppercase tracking-tighter mb-1">Dilshan Music</h2>
        <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 bg-sp-primary w-1/3 rounded-full animate-[loading-bar_1.5s_infinite_ease-in-out]"></div>
        </div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-sp-light-gray">Syncing Identity...</p>
      </div>
      <style>{`
        @keyframes loading-bar {
          0% { left: -33%; width: 33%; }
          50% { left: 33%; width: 50%; }
          100% { left: 100%; width: 33%; }
        }
      `}</style>
    </div>
  );
  return <MainLayout />;
};

export default App;
