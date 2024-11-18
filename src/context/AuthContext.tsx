import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { signUp, signIn, signOut, resetPassword, resendVerificationEmail, onAuthChange } from '../lib/auth';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = { id: userSnap.id, ...userSnap.data() } as User;
            
            // Update last login and email verification status
            await setDoc(userRef, {
              lastLogin: serverTimestamp(),
              verifiedEmail: firebaseUser.emailVerified,
              updatedAt: serverTimestamp(),
            }, { merge: true });
            
            setUser(userData);
          } else {
            // Create default user document if it doesn't exist
            const defaultUserData: Omit<User, 'id'> = {
              email: firebaseUser.email!,
              firstName: firebaseUser.displayName?.split(' ')[0] || '',
              lastName: firebaseUser.displayName?.split(' ')[1] || '',
              role: 'user',
              status: 'active',
              listings: [],
              createdAt: new Date(),
              lastLogin: new Date(),
              verifiedEmail: firebaseUser.emailVerified,
              notificationPreferences: {
                email: true,
                sms: false,
              },
            };

            await setDoc(userRef, {
              ...defaultUserData,
              updatedAt: serverTimestamp(),
            });

            setUser({ id: firebaseUser.uid, ...defaultUserData });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const userData = await signUp(email, password, firstName, lastName);
      setUser(userData);
    } catch (error) {
      console.error('Error in sign up:', error);
      throw error;
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const userData = await signIn(email, password);
      setUser(userData);
    } catch (error) {
      console.error('Error in sign in:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error in sign out:', error);
      throw error;
    }
  };

  const handleUpdateUser = async (data: Partial<User>) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setUser(prevUser => prevUser ? { ...prevUser, ...data } : null);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    resetPassword,
    resendVerificationEmail,
    updateUser: handleUpdateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}