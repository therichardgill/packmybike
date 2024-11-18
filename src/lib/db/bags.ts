import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { bagsCollection } from './collections';
import type { Bag } from '../../types';

const defaultBag: Omit<Bag, 'id' | 'brandId' | 'model'> = {
  protectionLevel: 3,
  transportRating: 3,
  wheelSize: {
    min: 26,
    max: 29,
  },
  weight: {
    empty: 0,
    maxLoad: 0,
  },
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
  },
  volume: 0,
  tsaCompliant: 'Unknown',
  compatibility: [],
  securityFeatures: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function createBag(bag: Omit<Bag, 'id' | 'createdAt' | 'updatedAt'>) {
  const bagRef = doc(bagsCollection);
  const id = bagRef.id;
  const newBag: Bag = {
    ...defaultBag,
    ...bag,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await setDoc(bagRef, newBag);
  return newBag;
}

export async function getBag(id: string) {
  const bagRef = doc(bagsCollection, id);
  const bagSnap = await getDoc(bagRef);
  if (!bagSnap.exists()) return null;
  return { id: bagSnap.id, ...bagSnap.data() } as Bag;
}

export async function updateBag(id: string, data: Partial<Omit<Bag, 'id' | 'createdAt' | 'updatedAt'>>) {
  const bagRef = doc(bagsCollection, id);
  await updateDoc(bagRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteBag(id: string) {
  const bagRef = doc(bagsCollection, id);
  await deleteDoc(bagRef);
}

export async function listBags() {
  const q = query(bagsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ 
    ...defaultBag,
    ...doc.data(),
    id: doc.id,
  })) as Bag[];
}

export async function getBagsByBrand(brandId: string) {
  const q = query(
    bagsCollection,
    where('brandId', '==', brandId),
    orderBy('model', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...defaultBag,
    ...doc.data(),
    id: doc.id,
  })) as Bag[];
}