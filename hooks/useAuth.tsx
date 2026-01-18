
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Fixing imports for Firebase Auth members
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  toggleLike: (songId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Standard modular onAuthStateChanged listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          const userRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'New User',
              gender: 'other',
              role: 'user',
              likedSongs: [],
            };
            await setDoc(userRef, newProfile);
            setProfile(newProfile);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth hydration error:", error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, data);
    setProfile(prev => prev ? { ...prev, ...data } : null);
  };

  const toggleLike = async (songId: string) => {
    if (!user || !profile) return;
    const userRef = doc(db, 'users', user.uid);
    const likedSongs = profile.likedSongs || [];
    const isLiked = likedSongs.includes(songId);

    if (isLiked) {
      await updateDoc(userRef, { likedSongs: arrayRemove(songId) });
      setProfile(prev => prev ? { ...prev, likedSongs: likedSongs.filter(id => id !== songId) } : null);
    } else {
      await updateDoc(userRef, { likedSongs: arrayUnion(songId) });
      setProfile(prev => prev ? { ...prev, likedSongs: [...likedSongs, songId] } : null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, updateProfile, toggleLike }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
