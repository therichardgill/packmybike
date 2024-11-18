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
  limit
} from 'firebase/firestore';
import { listingsCollection } from './collections';
import type { Listing } from '../../types';

export async function createListing(listing: Omit<Listing, 'id'>) {
  const listingRef = doc(listingsCollection);
  const id = listingRef.id;
  await setDoc(listingRef, {
    ...listing,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return { ...listing, id };
}

export async function getListing(id: string) {
  const listingRef = doc(listingsCollection, id);
  const listingSnap = await getDoc(listingRef);
  if (!listingSnap.exists()) return null;
  return { id: listingSnap.id, ...listingSnap.data() } as Listing;
}

export async function updateListing(id: string, data: Partial<Listing>) {
  const listingRef = doc(listingsCollection, id);
  await updateDoc(listingRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteListing(id: string) {
  const listingRef = doc(listingsCollection, id);
  await deleteDoc(listingRef);
}

export async function listListings() {
  const q = query(listingsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Listing[];
}

export async function getFeaturedListings(limitCount = 6) {
  const q = query(
    listingsCollection,
    where('featured', '==', true),
    orderBy('rating', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Listing[];
}

export async function searchListings(location: string) {
  // Note: This is a simple implementation. For production, you might want to use
  // a more sophisticated search solution like Algolia or Elasticsearch
  const q = query(
    listingsCollection,
    where('location', '>=', location),
    where('location', '<=', location + '\uf8ff')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Listing[];
}

export async function getListingsByUser(userId: string) {
  const q = query(
    listingsCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Listing[];
}