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
import { bookingsCollection } from './collections';
import type { Booking } from '../../types';

export async function createBooking(booking: Omit<Booking, 'id'>) {
  const bookingRef = doc(bookingsCollection);
  const id = bookingRef.id;
  const newBooking = {
    ...booking,
    id,
    createdAt: Timestamp.now().toDate().toISOString(),
    updatedAt: Timestamp.now().toDate().toISOString(),
  };
  
  await setDoc(bookingRef, newBooking);
  return newBooking;
}

export async function getBooking(id: string) {
  const bookingRef = doc(bookingsCollection, id);
  const bookingSnap = await getDoc(bookingRef);
  if (!bookingSnap.exists()) return null;
  return { id: bookingSnap.id, ...bookingSnap.data() } as Booking;
}

export async function updateBooking(id: string, data: Partial<Booking>) {
  const bookingRef = doc(bookingsCollection, id);
  await updateDoc(bookingRef, {
    ...data,
    updatedAt: Timestamp.now().toDate().toISOString(),
  });
}

export async function deleteBooking(id: string) {
  const bookingRef = doc(bookingsCollection, id);
  await deleteDoc(bookingRef);
}

export async function listBookings() {
  const q = query(bookingsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
}

export async function getBookingsByUser(userId: string) {
  const q = query(
    bookingsCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
}

export async function getBookingsByListing(listingId: string) {
  const q = query(
    bookingsCollection,
    where('listingId', '==', listingId),
    orderBy('startDate', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Booking[];
}

export async function checkAvailability(listingId: string, startDate: Date, endDate: Date) {
  const q = query(
    bookingsCollection,
    where('listingId', '==', listingId),
    where('status', '==', 'confirmed'),
    where('startDate', '<=', endDate),
    where('endDate', '>=', startDate)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.empty; // Returns true if dates are available
}