
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserProfile } from '../types';
import { ChevronLeftIcon, UserIcon, MaleIcon, FemaleIcon, SearchIcon, LogoIcon } from './icons';
import { useNavigate } from 'react-router-dom';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef);
        const querySnapshot = await getDocs(q);
        
        const fetchedUsers: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          // Cast data as UserProfile to avoid 'unknown' type errors
          const data = doc.data() as UserProfile;
          fetchedUsers.push({
            uid: doc.id,
            email: data.email || null,
            displayName: data.displayName || 'Anonymous',
            photoUrl: data.photoUrl,
            gender: data.gender || 'other',
            role: data.role || 'user',
            likedSongs: data.likedSongs || [],
          });
        });
        
        fetchedUsers.sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));
        setUsers(fetchedUsers);
      } catch (error: any) {
        console.error("Error fetching users:", error);
        if (error.code === 'permission-denied') {
          setError("Access Denied: Please ensure your account has 'admin' role in Firestore and rules are updated.");
        } else {
          setError("Failed to sync with identity vault.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [refreshKey]);

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.uid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ProfileAvatar = ({ user, size = "w-10 h-10" }: { user: UserProfile, size?: string }) => {
    if (user.photoUrl) {
      return <img src={user.photoUrl} alt="Profile" className={`${size} object-cover rounded-full border border-gray-100`} />;
    }
    if (user.gender === 'male') return <MaleIcon className={`${size} text-sp-primary p-1 bg-gray-50 rounded-full`} />;
    if (user.gender === 'female') return <FemaleIcon className={`${size} text-sp-pink p-1 bg-gray-50 rounded-full`} />;
    return <UserIcon className={`${size} text-sp-gray p-1 bg-gray-50 rounded-full`} />;
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <button onClick={() => navigate('/admin')} className="flex items-center text-[10px] font-black text-sp-gray hover:text-black uppercase tracking-widest mb-2 transition-colors">
            <ChevronLeftIcon className="w-4 h-4 mr-1" /> Admin Dashboard
          </button>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-black tracking-tight">User Directory</h1>
            <button 
              onClick={() => setRefreshKey(prev => prev + 1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Refresh Data"
            >
              <svg className={`w-4 h-4 text-sp-gray ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <p className="text-sp-gray text-sm font-bold">Total identified assets in cloud vault</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sp-light-gray" />
          <input 
            type="text" 
            placeholder="Search by name, email or UID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-100 py-3 pl-11 pr-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-sp-primary/20 transition-all shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl">
          <div className="w-10 h-10 border-4 border-sp-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-sp-light-gray uppercase tracking-widest text-center">Syncing with Identity Server...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-red-100 rounded-[2.5rem] p-20 text-center shadow-xl">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-black mb-2 uppercase tracking-tight">Security Protocol Violation</h2>
          <p className="text-sp-gray text-sm font-medium mb-6">{error}</p>
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="text-[10px] font-black text-sp-primary uppercase tracking-[0.2em] border-2 border-sp-primary/20 px-8 py-3 rounded-xl hover:bg-sp-primary hover:text-white transition-all"
          >
            Retry Authentication
          </button>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-white border border-gray-100 rounded-[2.5rem] shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-5 text-[10px] font-black text-sp-light-gray uppercase tracking-widest">Profile</th>
                    <th className="px-8 py-5 text-[10px] font-black text-sp-light-gray uppercase tracking-widest">Role</th>
                    <th className="px-8 py-5 text-[10px] font-black text-sp-light-gray uppercase tracking-widest">Likes</th>
                    <th className="px-8 py-5 text-[10px] font-black text-sp-light-gray uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-sp-light-gray uppercase tracking-widest text-right">Identifier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((user) => (
                    <tr key={user.uid} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center space-x-4">
                          <ProfileAvatar user={user} />
                          <div>
                            <p className="text-sm font-black text-black leading-tight">{user.displayName}</p>
                            <p className="text-[11px] text-sp-gray font-medium">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                          user.role === 'admin' ? 'bg-sp-primary/10 text-sp-primary border-sp-primary/20' : 'bg-gray-100 text-sp-gray border-gray-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center text-xs font-bold text-black">
                          <span className="w-2 h-2 bg-sp-pink rounded-full mr-2 opacity-50"></span>
                          {user.likedSongs?.length || 0} Tracks
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-green-500">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                          Verified
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <span className="text-[10px] font-mono text-sp-light-gray opacity-50 bg-gray-100 px-2 py-1 rounded group-hover:opacity-100 transition-opacity">
                          {user.uid.slice(0, 10)}...
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE LIST VIEW */}
          <div className="block md:hidden space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.uid} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm active:scale-[0.98] transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <ProfileAvatar user={user} size="w-12 h-12" />
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-black truncate">{user.displayName}</h3>
                      <p className="text-[11px] text-sp-gray font-medium truncate">{user.email}</p>
                    </div>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                    user.role === 'admin' ? 'bg-sp-primary/10 text-sp-primary border-sp-primary/20' : 'bg-gray-100 text-sp-gray border-gray-200'
                  }`}>
                    {user.role}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-50">
                  <div className="flex items-center text-[9px] font-black text-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-sp-pink rounded-full mr-2"></span>
                    {user.likedSongs?.length || 0} Tracks
                  </div>
                  <div className="flex items-center justify-end text-[9px] font-black uppercase tracking-widest text-green-500">
                    <span className="w-1 h-1 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                    Verified
                  </div>
                </div>
                
                <div className="mt-3 text-[8px] font-mono text-sp-light-gray opacity-40 bg-gray-50 p-2 rounded-lg text-center truncate">
                  {user.uid}
                </div>
              </div>
            ))}
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="py-24 text-center bg-white border border-gray-100 rounded-[2.5rem] shadow-xl">
              <LogoIcon className="w-12 h-12 text-gray-200 mx-auto mb-4 grayscale" />
              <p className="text-sm font-bold text-sp-gray uppercase tracking-widest">No matching explorers found in the pulse directory.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-[10px] font-black text-sp-primary uppercase tracking-widest hover:underline"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-8 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-sp-light-gray">
        <p>© Dilshan Music Admin Infrastructure</p>
        <p className="hidden sm:block">Current Node Count: {users.length}</p>
      </div>
    </div>
  );
};

export default UserManagementPage;
