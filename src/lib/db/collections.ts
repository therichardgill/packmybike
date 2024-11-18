import { collection } from 'firebase/firestore';
import { db } from '../firebase';

// Collection references
export const usersCollection = collection(db, 'users');
export const bagsCollection = collection(db, 'bags');
export const brandsCollection = collection(db, 'brands');
export const listingsCollection = collection(db, 'listings');
export const reviewsCollection = collection(db, 'reviews');
export const bookingsCollection = collection(db, 'bookings');
export const shortUrlsCollection = collection(db, 'shortUrls');