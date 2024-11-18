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
  Timestamp
} from 'firebase/firestore';
import { brandsCollection } from './collections';
import type { Brand } from '../../types';

export async function createBrand(brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) {
  const brandRef = doc(brandsCollection);
  const id = brandRef.id;
  const newBrand: Brand = {
    ...brand,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await setDoc(brandRef, newBrand);
  return newBrand;
}

export async function getBrand(id: string) {
  const brandRef = doc(brandsCollection, id);
  const brandSnap = await getDoc(brandRef);
  if (!brandSnap.exists()) return null;
  return { id: brandSnap.id, ...brandSnap.data() } as Brand;
}

export async function updateBrand(id: string, data: Partial<Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>>) {
  const brandRef = doc(brandsCollection, id);
  await updateDoc(brandRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteBrand(id: string) {
  const brandRef = doc(brandsCollection, id);
  await deleteDoc(brandRef);
}

export async function listBrands() {
  const q = query(brandsCollection, orderBy('name', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Brand[];
}

export async function getBrandByName(name: string) {
  const q = query(brandsCollection, where('name', '==', name));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as Brand;
}