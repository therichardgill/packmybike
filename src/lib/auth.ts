import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User } from '../types';

const createUserDocument = async (firebaseUser: FirebaseUser, additionalData?: Partial<User>) => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  
  const userData: Omit<User, 'id'> = {
    email: firebaseUser.email!,
    firstName: additionalData?.firstName || firebaseUser.displayName?.split(' ')[0] || '',
    lastName: additionalData?.lastName || firebaseUser.displayName?.split(' ')[1] || '',
    role: 'user',
    status: 'pending',
    listings: [],
    createdAt: new Date(),
    lastLogin: new Date(),
    verifiedEmail: firebaseUser.emailVerified,
    notificationPreferences: {
      email: true,
      sms: false,
    },
    ...additionalData,
  };

  await setDoc(userRef, {
    ...userData,
    updatedAt: serverTimestamp(),
  });

  return { id: firebaseUser.uid, ...userData };
};

export async function signUp(email: string, password: string, firstName: string, lastName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user: firebaseUser } = userCredential;

    await updateProfile(firebaseUser, {
      displayName: `${firstName} ${lastName}`,
    });

    await sendEmailVerification(firebaseUser);

    const userData = await createUserDocument(firebaseUser, { firstName, lastName });
    return userData;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    
    let userData: User;
    
    if (!userSnap.exists()) {
      // Create user document if it doesn't exist (for legacy users)
      userData = await createUserDocument(firebaseUser);
    } else {
      userData = { id: userSnap.id, ...userSnap.data() } as User;
      
      // Update last login and email verification status
      await setDoc(userRef, {
        lastLogin: serverTimestamp(),
        verifiedEmail: firebaseUser.emailVerified,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }

    return userData;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
}

export async function resendVerificationEmail() {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }
    await sendEmailVerification(currentUser);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}