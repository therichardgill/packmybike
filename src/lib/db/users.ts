import { 
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { usersCollection } from './collections';
import type { User } from '../../types';

export async function createUser(user: Omit<User, 'id'> & { id: string }) {
  const userRef = doc(usersCollection, user.id);
  await setDoc(userRef, {
    ...user,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return user;
}

export async function getUser(id: string) {
  const userRef = doc(usersCollection, id);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;
  return { id: userSnap.id, ...userSnap.data() } as User;
}

export async function updateUser(id: string, data: Partial<User>) {
  const userRef = doc(usersCollection, id);
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteUser(id: string) {
  const userRef = doc(usersCollection, id);
  await deleteDoc(userRef);
}

export async function listUsers() {
  const q = query(usersCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as User[];
}

export async function getUserByEmail(email: string) {
  const q = query(usersCollection, where('email', '==', email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as User;
}