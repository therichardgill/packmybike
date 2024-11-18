import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { reviewsCollection } from './collections';
import type { Review } from '../../types';

export async function createReview(review: Omit<Review, 'id'>) {
  const reviewRef = doc(reviewsCollection);
  const id = reviewRef.id;
  await setDoc(reviewRef, {
    ...review,
    id,
    createdAt: new Date().toISOString()
  });
  return { ...review, id };
}

export async function getReview(id: string) {
  const reviewRef = doc(reviewsCollection, id);
  const reviewSnap = await getDoc(reviewRef);
  if (!reviewSnap.exists()) return null;
  return { id: reviewSnap.id, ...reviewSnap.data() } as Review;
}

export async function deleteReview(id: string) {
  const reviewRef = doc(reviewsCollection, id);
  await deleteDoc(reviewRef);
}

export async function getListingReviews(listingId: string, limitCount?: number) {
  let q = query(
    reviewsCollection,
    where('listingId', '==', listingId),
    orderBy('createdAt', 'desc')
  );
  
  if (limitCount) {
    q = query(q, limit(limitCount));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];
}

export async function getUserReviews(userId: string) {
  const q = query(
    reviewsCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];
}