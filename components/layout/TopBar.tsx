
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, MenuIcon, LogoutIcon, UserIcon, MaleIcon, FemaleIcon, SettingsIcon } from '../icons';
import MarqueeText from '../common/MarqueeText';
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../hooks/useAuth';

interface TopBarProps {
  onSearch: (query: string) => void;
  toggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSearch, toggleSidebar }) => {
  const [query, setQuery] = useState('');
  const { user, profile } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const placeholderText = "Search artists, albums, or your vibe...";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };
  
  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = '/';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ProfileAvatar = () => {
    if (profile?.photoUrl) {
      return <img src={profile.photoUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />;
    }
    const gender = profile?.gender;
    if (gender === 'male') return <MaleIcon className="w-8 h-8 text-sp-primary" />;
    if (gender === 'female') return <FemaleIcon className="w-8 h-8 text-sp-pink" />;
    return <UserIcon className="w-8 h-8 text-sp-gray" />;
  };

  return (
    <header className="bg-white/80 backdrop-blur-md h-16 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 md:px-8 z-30 border-b border-gray-100">
      <div className="flex-shrink-0">
        <button onClick={toggleSidebar} className="md:hidden p-2 -ml-2 text-sp-gray hover:text-black">
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex justify-center px-4 max-w-2xl">
        <form onSubmit={handleSearchSubmit} className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <SearchIcon className="w-4 h-4 text-sp-gray" />
          </div>
          {!query && (
            <div className="absolute inset-y-0 left-11 right-4 flex items-center overflow-hidden pointer-events-none">
              <MarqueeText className="text-sp-gray text-sm font-medium">{placeholderText}</MarqueeText>
            </div>
          )}
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-full py-2.5 pl-11 pr-4 text-sm text-black border-transparent focus:ring-1 focus:ring-sp-primary/30 focus:bg-white focus:border-sp-primary transition-all outline-none font-bold"
          />
        </form>
      </div>

      <div className="flex items-center flex-shrink-0 relative" ref={dropdownRef}>
        {user ? (
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className={`flex items-center space-x-3 p-1 pl-3 rounded-full cursor-pointer transition-all border ${isDropdownOpen ? 'bg-black text-white border-black shadow-lg scale-105' : 'bg-gray-50 text-black border-transparent hover:border-gray-200'}`}
          >
              <div className="hidden md:block text-right">
                  <p className="text-[10px] font-black leading-tight uppercase tracking-widest">{profile?.displayName || 'User'}</p>
                  <p className={`text-[8px] uppercase leading-tight font-black tracking-[0.2em] ${isDropdownOpen ? 'text-sp-primary' : 'text-sp-gray'}`}>{profile?.role || 'Guest'}</p>
              </div>
              <div className={`p-0.5 rounded-full border shadow-sm flex items-center justify-center transition-colors ${isDropdownOpen ? 'bg-white border-sp-primary' : 'bg-gray-100 border-gray-200'}`}>
                  <ProfileAvatar />
              </div>
          </div>
        ) : (
          <a 
            href="/login"
            className="bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full hover:bg-sp-primary hover:scale-105 transition-all shadow-md active:scale-95"
          >
            Log In
          </a>
        )}

        {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 py-2 border border-gray-100 overflow-hidden animate-fade-in origin-top-right scale-100">
                <div className="px-5 py-4 border-b border-gray-100 mb-1">
                    <p className="text-xs font-black text-black uppercase tracking-tight truncate">{profile?.displayName}</p>
                    <p className="text-[9px] text-sp-light-gray font-bold truncate opacity-80">{profile?.email}</p>
                </div>
                <div className="px-2 py-1 space-y-0.5">
                    <a
                        href="/account"
                        className="flex items-center w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-sp-gray hover:bg-sp-primary/10 hover:text-black rounded-xl transition-all group"
                    >
                        <SettingsIcon className="w-4 h-4 mr-3 text-sp-light-gray group-hover:text-sp-primary transition-colors" /> Manage Profile
                    </a>
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                    >
                        <LogoutIcon className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-600 transition-colors" /> Logout
                    </button>
                </div>
                <div className="bg-gray-50 px-5 py-3 mt-1">
                    <p className="text-[8px] font-black text-sp-light-gray uppercase tracking-[0.3em] text-center">Dilshan Music V3.0 • SECURE</p>
                </div>
            </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
