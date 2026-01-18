
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMusicLibrary } from '../hooks/useMusicLibrary';
import { UserProfile } from '../types';
import { 
  ChevronLeftIcon, 
  UserIcon, 
  MaleIcon, 
  FemaleIcon, 
  SettingsIcon, 
  HeartFilledIcon, 
  ChartIcon, 
  BellIcon,
  LogoutIcon,
  UploadIcon
} from './icons';
import { auth } from '../firebaseConfig';

type AccountTab = 'profile' | 'security' | 'stats';

const AccountPage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { songs } = useMusicLibrary();
  const [activeTab, setActiveTab] = useState<AccountTab>('profile');
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const env = (import.meta as any).env;
  const workerUrl = env.VITE_WORKER_URL;
  const uploadSecret = env.VITE_UPLOAD_SECRET;

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setGender(profile.gender || 'other');
    }
  }, [profile]);

  const uploadToR2 = async (file: File) => {
    if (!workerUrl) throw new Error("Worker URL not configured.");
    const key = `profiles/${profile?.uid}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const res = await fetch(`${workerUrl}/${encodeURIComponent(key)}`, {
      method: 'PUT',
      body: file,
      headers: { 'X-Custom-Auth-Key': uploadSecret, 'Content-Type': file.type },
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    setIsPhotoUploading(true);
    setMessage('Uploading photo...');
    try {
      const photoUrl = await uploadToR2(file);
      await updateProfile({ photoUrl });
      setMessage('Profile photo updated.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Photo upload failed.');
    } finally {
      setIsPhotoUploading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setMessage('');
      try {
          await updateProfile({ displayName, gender });
          setMessage('Identity synced successfully.');
          setTimeout(() => setMessage(''), 3000);
      } catch (error) {
          setMessage('Sync failed. Try again.');
      } finally {
          setIsLoading(false);
      }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const likedCount = profile?.likedSongs?.length || 0;
  
  const ProfileAvatar = () => {
    if (profile?.photoUrl) {
      return <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />;
    }
    if (gender === 'male') return <MaleIcon className="w-full h-full text-sp-primary" />;
    if (gender === 'female') return <FemaleIcon className="w-full h-full text-sp-pink" />;
    return <UserIcon className="w-full h-full text-sp-gray" />;
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto pb-32 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-[10px] font-black uppercase tracking-[0.3em] text-sp-light-gray hover:text-black mb-4 transition-all"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back to Home
          </button>
          <h1 className="text-5xl font-black text-black tracking-tighter leading-none">Account Center</h1>
          <p className="text-sp-gray font-bold text-sm mt-2">Manage your global Dilshan Music credentials</p>
        </div>
        
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          {(['profile', 'security', 'stats'] as AccountTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-sp-light-gray hover:text-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-black rounded-[3rem] p-8 text-white relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sp-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-32 h-32 bg-white/10 rounded-full mb-6 backdrop-blur-md border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-700 overflow-hidden flex items-center justify-center">
                  <ProfileAvatar />
                  {isPhotoUploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-sp-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-6 right-0 bg-sp-primary text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform border-4 border-black"
                >
                  <UploadIcon className="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <h2 className="text-2xl font-black tracking-tight truncate w-full px-4">{profile?.displayName}</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sp-primary mb-8">{profile?.role} Verified</p>
              
              <div className="w-full space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-white/40">Network Status</span>
                  <span className="text-green-400 flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-white/40">Account ID</span>
                  <span className="text-white/80 tabular-nums">#{profile?.uid.slice(0, 8)}</span>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="mt-10 w-full py-4 rounded-2xl border border-white/20 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all"
              >
                Terminate Session
              </button>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 p-8 rounded-[2.5rem]">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-sp-light-gray mb-6">Quick Actions</h4>
            <div className="space-y-3">
              <button onClick={() => navigate('/liked')} className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-sp-primary transition-all group">
                <span className="text-xs font-black text-black">Access Vault</span>
                <HeartFilledIcon className="w-4 h-4 text-sp-primary group-hover:scale-125 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-black transition-all group">
                <span className="text-xs font-black text-black">Cloud Settings</span>
                <SettingsIcon className="w-4 h-4 text-sp-gray group-hover:rotate-90 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white border border-gray-100 rounded-[3rem] p-8 md:p-12 shadow-sm min-h-[500px]">
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="text-2xl font-black text-black tracking-tight">Personal Identity</h3>
                  <p className="text-sm text-sp-gray font-medium">How you appear to other explorers in the pulse.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-sp-light-gray">Display Name</label>
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:ring-2 focus:ring-sp-primary/20 focus:bg-white outline-none transition-all font-bold text-black"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-sp-light-gray">Avatar Mood</label>
                    <select 
                      value={gender} 
                      onChange={e => setGender(e.target.value as any)} 
                      className="w-full bg-gray-50 border border-gray-100 p-5 rounded-2xl focus:ring-2 focus:ring-sp-primary/20 focus:bg-white outline-none transition-all font-black text-[10px] uppercase tracking-widest text-black appearance-none"
                    >
                      <option value="male">Masculine</option>
                      <option value="female">Feminine</option>
                      <option value="other">Neutral</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-sp-light-gray">Bio / Production Notes</label>
                  <textarea 
                    placeholder="Tell the community about your musical taste..."
                    className="w-full bg-gray-50 border border-gray-100 p-6 rounded-3xl h-32 focus:ring-2 focus:ring-sp-primary/20 focus:bg-white outline-none transition-all font-medium text-sp-gray resize-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-sp-primary">{message}</p>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-black text-white font-black py-5 px-10 rounded-2xl hover:bg-sp-primary disabled:opacity-50 transition-all uppercase text-[10px] tracking-[0.3em] shadow-xl"
                  >
                    {isLoading ? 'Updating Cloud...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="space-y-12">
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="text-2xl font-black text-black tracking-tight">Encryption & Security</h3>
                  <p className="text-sm text-sp-gray font-medium">Protecting your data and cloud identity.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-sp-light-gray mb-1">Security Level</p>
                    <div className="flex items-center gap-2">
                       <span className="text-xl font-black text-black">A+ Verified</span>
                       <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-4 bg-sp-primary rounded-full"></div>)}
                       </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <p className="text-[9px] font-black uppercase tracking-widest text-sp-light-gray mb-1">Last Authorized</p>
                    <p className="text-xl font-black text-black">Today, 14:22</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-sp-light-gray">Active Authorizations</h4>
                  <div className="divide-y divide-gray-100">
                    {[
                      { device: 'Web Browser (Chrome)', loc: 'Colombo, LK', time: 'Active Now' },
                      { device: 'Mobile Application', loc: 'Kandy, LK', time: '2 days ago' }
                    ].map((session, i) => (
                      <div key={i} className="py-4 flex justify-between items-center">
                        <div>
                          <p className="text-xs font-black text-black">{session.device}</p>
                          <p className="text-[10px] font-bold text-sp-light-gray">{session.loc}</p>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 rounded-full">{session.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/reset-password')}
                  className="w-full py-5 bg-gray-50 text-black font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-black hover:text-white transition-all border border-gray-100"
                >
                  Change Password Link
                </button>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-12">
                <div className="border-b border-gray-100 pb-6">
                  <h3 className="text-2xl font-black text-black tracking-tight">Sonic Insights</h3>
                  <p className="text-sm text-sp-gray font-medium">Your sonic footprint across the platform.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-sp-primary/5 p-8 rounded-[2.5rem] border border-sp-primary/10">
                    <ChartIcon className="w-6 h-6 text-sp-primary mb-4" />
                    <p className="text-3xl font-black text-black leading-none">{likedCount}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-sp-gray mt-1">Saved Assets</p>
                  </div>
                  <div className="bg-sp-pink/5 p-8 rounded-[2.5rem] border border-sp-pink/10">
                    <BellIcon className="w-6 h-6 text-sp-pink mb-4" />
                    <p className="text-3xl font-black text-black leading-none">0</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-sp-gray mt-1">Notifications</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-sp-light-gray mb-6">Genre Affinity</h4>
                  <div className="space-y-5">
                    {[
                      { name: 'Pop', val: '80%' },
                      { name: 'Electronic', val: '45%' },
                      { name: 'Hip Hop', val: '20%' }
                    ].map((g, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span>{g.name}</span>
                          <span>{g.val}</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                           <div className="h-full bg-black rounded-full" style={{ width: g.val }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;