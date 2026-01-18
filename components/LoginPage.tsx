
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { LogoIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import { UserProfile } from '../types';

type FormType = 'login' | 'signup' | 'forgot';

const LoginPage: React.FC = () => {
  const [formType, setFormType] = useState<FormType>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other');
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const genderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genderRef.current && !genderRef.current.contains(event.target as Node)) {
        setIsGenderDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      if (formType === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (formType === 'signup') {
        if (password.length < 6) throw new Error("Password should be at least 6 characters");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const newUserProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          displayName,
          gender,
          role: 'user',
          likedSongs: [],
        };
        await setDoc(doc(db, 'users', user.uid), newUserProfile);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Please check your inbox.');
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  const genderOptions = [
    { value: 'male', label: 'Masculine' },
    { value: 'female', label: 'Feminine' },
    { value: 'other', label: 'Neutral' },
  ];

  const currentGenderLabel = genderOptions.find(o => o.value === gender)?.label || 'Choose Avatar Mood';

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center p-4 font-sans animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sp-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sp-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="w-full max-w-md mx-auto relative z-10 flex flex-col items-center">
            <div className="w-full flex flex-col items-center mb-6 text-center">
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center text-[10px] font-black text-sp-light-gray hover:text-black transition-all uppercase tracking-[0.2em] mb-4 bg-gray-50 px-5 py-2.5 rounded-full border border-gray-100 shadow-sm"
                >
                  <ChevronLeftIcon className="w-4 h-4 mr-1.5" /> Back to Dashboard
                </button>
                
                <div className="bg-sp-primary p-4 rounded-full shadow-xl mb-4 flex items-center justify-center">
                  <LogoIcon className="w-8 h-8 text-white fill-white" />
                </div>
                <h1 className="text-3xl font-black text-black tracking-tighter uppercase mb-0.5 leading-none">Dilshan Music</h1>
                <p className="text-sp-gray font-black text-[9px] uppercase tracking-[0.3em]">Auth System</p>
            </div>

            <div className="w-full bg-white p-6 md:p-8 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-gray-100">
                {error && <p className="bg-red-50 border border-red-100 text-red-600 text-[10px] p-3 rounded-xl mb-4 text-center font-black uppercase tracking-wider">{error}</p>}
                {message && <p className="bg-green-50 border border-green-100 text-green-600 text-[10px] p-3 rounded-xl mb-4 text-center font-black uppercase tracking-wider">{message}</p>}
                
                {formType === 'forgot' ? (
                   <form onSubmit={handlePasswordReset} className="space-y-4">
                      <div className="text-center mb-4">
                        <h2 className="text-lg font-black text-black uppercase tracking-tight">Recover Access</h2>
                        <p className="text-[9px] text-sp-gray font-black uppercase tracking-widest mt-1">Link will be sent to your inbox</p>
                      </div>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required className="w-full bg-gray-50 border border-gray-100 p-3.5 rounded-2xl focus:ring-2 focus:ring-sp-primary/20 focus:bg-white transition-all outline-none text-black font-bold text-sm" />
                      <button type="submit" disabled={isLoading} className="w-full bg-black text-white font-black py-3.5 rounded-2xl hover:bg-sp-primary disabled:opacity-50 transition-all uppercase tracking-[0.2em] text-[10px] shadow-lg">
                          {isLoading ? 'Processing...' : 'Send Recovery Email'}
                      </button>
                      <button type="button" onClick={() => setFormType('login')} className="w-full text-[10px] font-black text-sp-gray uppercase tracking-widest hover:text-black pt-2">Return to Login</button>
                   </form>
                ) : (
                  <form onSubmit={handleAuthAction} className="space-y-4">
                      {formType === 'signup' && (
                          <div className="space-y-3">
                              <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Display Name" required className="w-full bg-gray-50 border border-gray-100 p-3.5 rounded-2xl focus:ring-2 focus:ring-sp-primary/20 focus:bg-white transition-all outline-none text-black font-bold text-sm" />
                              <div className="relative" ref={genderRef}>
                                <button 
                                  type="button" 
                                  onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                                  className="w-full bg-gray-50 border border-gray-100 p-3.5 rounded-2xl focus:ring-2 focus:ring-sp-primary/20 focus:bg-white transition-all outline-none text-sp-gray font-black text-[10px] uppercase tracking-widest text-black appearance-none flex items-center justify-between"
                                >
                                  <span>{currentGenderLabel}</span>
                                  <ChevronRightIcon className={`w-3 h-3 transition-transform duration-300 ${isGenderDropdownOpen ? 'rotate-90' : ''}`} />
                                </button>
                                {isGenderDropdownOpen && (
                                  <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden py-1 animate-fade-in">
                                    {genderOptions.map((opt) => (
                                      <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                          setGender(opt.value as any);
                                          setIsGenderDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ${gender === opt.value ? 'bg-sp-primary text-white' : 'text-sp-gray hover:bg-gray-50'}`}
                                      >
                                        {opt.label}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                          </div>
                      )}
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required className="w-full bg-gray-50 border border-gray-100 p-3.5 rounded-2xl focus:ring-2 focus:ring-sp-primary/20 focus:bg-white transition-all outline-none text-black font-bold text-sm" />
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full bg-gray-50 border border-gray-100 p-3.5 rounded-2xl focus:ring-2 focus:ring-sp-primary/20 focus:bg-white transition-all outline-none text-black font-bold text-sm" />
                      
                      {formType === 'login' && (
                        <div className="flex justify-end">
                          <button type="button" onClick={() => setFormType('forgot')} className="text-[9px] font-black uppercase tracking-widest text-sp-light-gray hover:text-sp-primary transition-colors">Forgot Password?</button>
                        </div>
                      )}

                      <button type="submit" disabled={isLoading} className="w-full bg-sp-primary text-white font-black py-4 rounded-2xl hover:bg-sp-secondary transition-all uppercase tracking-[0.2em] text-[10px] disabled:opacity-50 shadow-xl active:scale-95">
                          {isLoading ? 'Verifying...' : (formType === 'login' ? 'Authorize Login' : 'Create Account')}
                      </button>
                  </form>
                )}
                
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                    <div className="relative flex justify-center text-[8px] uppercase font-black tracking-[0.3em]"><span className="bg-white px-4 text-sp-light-gray">Cloud Access</span></div>
                </div>

                <button onClick={handleGoogleSignIn} disabled={isLoading} className="w-full flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-200 text-black font-black py-3.5 rounded-2xl transition-all shadow-sm text-[10px] uppercase tracking-[0.15em]">
                    <svg className="w-4 h-4 mr-3" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.519-3.356-11.024-7.944l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.574l6.19 5.238C42.021 35.597 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                    Login with Google
                </button>

                <div className="mt-8 text-center">
                    {formType === 'login' ? (
                        <p className="text-[10px] font-bold text-sp-gray uppercase tracking-widest">Need an account? <button type="button" onClick={() => { setFormType('signup'); setError(null); }} className="font-black text-sp-primary hover:underline ml-1">Join Dilshan Music</button></p>
                    ) : (
                         <p className="text-[10px] font-bold text-sp-gray uppercase tracking-widest">Existing user? <button type="button" onClick={() => { setFormType('login'); setError(null); }} className="font-black text-sp-primary hover:underline ml-1">Login to Continue</button></p>
                    )}
                </div>
            </div>
            
            <p className="text-[8px] text-center text-sp-light-gray mt-10 font-black uppercase tracking-[0.4em]">© 2026 DILSHAN MUSIC ENGINEERING. V2.5</p>
        </div>
    </div>
  );
};

export default LoginPage;
