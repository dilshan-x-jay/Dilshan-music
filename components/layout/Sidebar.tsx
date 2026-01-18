
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { HomeIcon, AdminIcon, LogoIcon, CloseIcon, HeartFilledIcon, UserIcon, UserIcon as ArtistIcon, GenreIcon, MaleIcon, FemaleIcon, LibraryIcon } from '../icons';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user, profile } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon, requiresAuth: false },
    { path: '/genres', label: 'Categories', icon: GenreIcon, requiresAuth: false },
    { path: '/artists', label: 'Artists', icon: ArtistIcon, requiresAuth: false },
    { path: '/liked', label: 'Favourites', icon: HeartFilledIcon, requiresAuth: true },
  ];

  const NavItem: React.FC<{
    path: string;
    label: string;
    icon: React.ElementType;
    requiresAuth: boolean;
  }> = ({ path, label, icon: Icon, requiresAuth }) => {
    const isLocked = requiresAuth && !user;
    const isActive = location.pathname === path;
    
    return (
      <a
        href={isLocked ? '/login' : path}
        className={`flex items-center w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
          isActive ? 'bg-sp-primary text-white shadow-[0_8px_20px_rgba(22,163,74,0.2)]' : 'text-sp-gray hover:text-black hover:bg-gray-50'
        }`}
      >
        <Icon className="w-5 h-5 mr-3" />
        <span>{label}</span>
      </a>
    );
  };

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
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-[45] md:hidden transition-all duration-300 animate-fade-in" 
          onClick={toggleSidebar}
        ></div>
      )}
      
      <aside className={`fixed inset-y-0 left-0 z-[50] flex flex-col w-64 bg-white p-6 space-y-10 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 border-r border-gray-100 shadow-2xl md:shadow-none`}>
        <div className="flex items-center justify-between px-2">
          <a href="/" className="flex items-center space-x-3">
            <div className="bg-sp-primary p-2 rounded-xl shadow-lg">
              <LogoIcon className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-xl font-black text-black tracking-tighter uppercase">Dilshan Music</span>
          </a>
          <button onClick={toggleSidebar} className="md:hidden p-1 text-sp-gray hover:text-black">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
          <div>
            <h3 className="px-4 text-[10px] font-black text-sp-light-gray uppercase tracking-[0.3em] mb-4">Discovery</h3>
            <ul className="space-y-1">
              {navItems.map(item => (
                <li key={item.label}>
                  <NavItem path={item.path} label={item.label} icon={item.icon} requiresAuth={item.requiresAuth} />
                </li>
              ))}
            </ul>
          </div>
          {profile?.role === 'admin' && (
            <div>
              <h3 className="px-4 text-[10px] font-black text-sp-light-gray uppercase tracking-[0.3em] mb-4">Management</h3>
              <ul className="space-y-1">
                <li><NavItem path="/admin" label="Music Manager" icon={AdminIcon} requiresAuth={true} /></li>
                <li><NavItem path="/admin/users" label="User Directory" icon={LibraryIcon} requiresAuth={true} /></li>
              </ul>
            </div>
          )}
        </nav>

        {user ? (
          <a 
            href="/account"
            className="p-4 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center space-x-3 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group flex-shrink-0"
          >
             <div className="bg-white p-1 rounded-full border border-gray-200 shadow-sm group-hover:border-sp-primary transition-colors flex-shrink-0">
                <ProfileAvatar />
             </div>
             <div className="min-w-0">
                <p className="text-xs font-black text-black truncate">{profile?.displayName}</p>
                <p className="text-[10px] text-sp-gray uppercase font-bold tracking-widest">{profile?.role}</p>
             </div>
          </a>
        ) : (
          <a href="/login" className="bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] py-4 rounded-2xl w-full shadow-xl hover:bg-sp-primary hover:scale-105 transition-all text-center block flex-shrink-0">Join Dilshan Music</a>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
