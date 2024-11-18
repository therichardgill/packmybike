import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { shortUrlsCollection } from './collections';
import { generateShortCode } from '../../utils/shortUrl';
import type { ShortUrl } from '../../types';

export async function createShortUrl(listingId: string) {
  const shortCode = generateShortCode();
  const shortUrlRef = doc(shortUrlsCollection);
  const shortUrl: ShortUrl = {
    id: shortUrlRef.id,
    shortCode,
    listingId,
    createdAt: new Date().toISOString(),
    clicks: 0
  };
  
  await setDoc(shortUrlRef, shortUrl);
  return shortUrl;
}

export async function getShortUrl(shortCode: string) {
  const q = query(shortUrlsCollection, where('shortCode', '==', shortCode));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  const shortUrl = { id: doc.id, ...doc.data() } as ShortUrl;
  
  // Increment clicks
  await updateDoc(doc.ref, {
    clicks: shortUrl.clicks + 1
  });
  
  return shortUrl;
}

export async function getShortUrlByListing(listingId: string) {
  const q = query(shortUrlsCollection, where('listingId', '==', listingId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ShortUrl;
}