// For now, we'll use localStorage for data persistence
// This can be replaced with a proper backend database later

import type { User, Brand, Listing, Review, Booking } from '../types';

const STORAGE_KEYS = {
  USERS: 'bikebag_users',
  BRANDS: 'bikebag_brands',
  LISTINGS: 'bikebag_listings',
  REVIEWS: 'bikebag_reviews',
  BOOKINGS: 'bikebag_bookings',
};

// Helper functions
const getStorageItem = <T>(key: string, defaultValue: T[]): T[] => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setStorageItem = <T>(key: string, value: T[]): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// User Model
export const UserModel = {
  create: (user: Omit<User, 'id'>) => {
    const users = getStorageItem<User>(STORAGE_KEYS.USERS, []);
    const newUser = { ...user, id: Date.now().toString() };
    users.push(newUser);
    setStorageItem(STORAGE_KEYS.USERS, users);
    return newUser;
  },

  findById: (id: string) => {
    const users = getStorageItem<User>(STORAGE_KEYS.USERS, []);
    return users.find(user => user.id === id);
  },

  findByEmail: (email: string) => {
    const users = getStorageItem<User>(STORAGE_KEYS.USERS, []);
    return users.find(user => user.email === email);
  },

  update: (id: string, data: Partial<User>) => {
    const users = getStorageItem<User>(STORAGE_KEYS.USERS, []);
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...data };
      setStorageItem(STORAGE_KEYS.USERS, users);
      return users[index];
    }
    return null;
  },

  delete: (id: string) => {
    const users = getStorageItem<User>(STORAGE_KEYS.USERS, []);
    const filtered = users.filter(user => user.id !== id);
    setStorageItem(STORAGE_KEYS.USERS, filtered);
  },

  list: () => getStorageItem<User>(STORAGE_KEYS.USERS, []),
};

// Brand Model
export const BrandModel = {
  create: (brand: Omit<Brand, 'id'>) => {
    const brands = getStorageItem<Brand>(STORAGE_KEYS.BRANDS, []);
    const newBrand = { ...brand, id: brands.length + 1 };
    brands.push(newBrand);
    setStorageItem(STORAGE_KEYS.BRANDS, brands);
    return newBrand;
  },

  findById: (id: number) => {
    const brands = getStorageItem<Brand>(STORAGE_KEYS.BRANDS, []);
    return brands.find(brand => brand.id === id);
  },

  update: (id: number, data: Partial<Brand>) => {
    const brands = getStorageItem<Brand>(STORAGE_KEYS.BRANDS, []);
    const index = brands.findIndex(brand => brand.id === id);
    if (index !== -1) {
      brands[index] = { ...brands[index], ...data };
      setStorageItem(STORAGE_KEYS.BRANDS, brands);
      return brands[index];
    }
    return null;
  },

  delete: (id: number) => {
    const brands = getStorageItem<Brand>(STORAGE_KEYS.BRANDS, []);
    const filtered = brands.filter(brand => brand.id !== id);
    setStorageItem(STORAGE_KEYS.BRANDS, filtered);
  },

  list: () => getStorageItem<Brand>(STORAGE_KEYS.BRANDS, []),
};

// Listing Model
export const ListingModel = {
  create: (listing: Omit<Listing, 'id'>) => {
    const listings = getStorageItem<Listing>(STORAGE_KEYS.LISTINGS, []);
    const newListing = { ...listing, id: listings.length + 1 };
    listings.push(newListing);
    setStorageItem(STORAGE_KEYS.LISTINGS, listings);
    return newListing;
  },

  findById: (id: number) => {
    const listings = getStorageItem<Listing>(STORAGE_KEYS.LISTINGS, []);
    return listings.find(listing => listing.id === id);
  },

  update: (id: number, data: Partial<Listing>) => {
    const listings = getStorageItem<Listing>(STORAGE_KEYS.LISTINGS, []);
    const index = listings.findIndex(listing => listing.id === id);
    if (index !== -1) {
      listings[index] = { ...listings[index], ...data };
      setStorageItem(STORAGE_KEYS.LISTINGS, listings);
      return listings[index];
    }
    return null;
  },

  delete: (id: number) => {
    const listings = getStorageItem<Listing>(STORAGE_KEYS.LISTINGS, []);
    const filtered = listings.filter(listing => listing.id !== id);
    setStorageItem(STORAGE_KEYS.LISTINGS, filtered);
  },

  list: () => getStorageItem<Listing>(STORAGE_KEYS.LISTINGS, []),
  
  listFeatured: (limit: number = 6) => {
    const listings = getStorageItem<Listing>(STORAGE_KEYS.LISTINGS, []);
    return listings
      .filter(listing => listing.featured)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },
};

// Review Model
export const ReviewModel = {
  create: (review: Omit<Review, 'id'>) => {
    const reviews = getStorageItem<Review>(STORAGE_KEYS.REVIEWS, []);
    const newReview = { ...review, id: reviews.length + 1 };
    reviews.push(newReview);
    setStorageItem(STORAGE_KEYS.REVIEWS, reviews);
    return newReview;
  },

  findByListing: (listingId: number, limit?: number) => {
    const reviews = getStorageItem<Review>(STORAGE_KEYS.REVIEWS, []);
    let filtered = reviews.filter(review => review.listingId === listingId);
    if (limit) {
      filtered = filtered.slice(0, limit);
    }
    return filtered;
  },

  delete: (id: number) => {
    const reviews = getStorageItem<Review>(STORAGE_KEYS.REVIEWS, []);
    const filtered = reviews.filter(review => review.id !== id);
    setStorageItem(STORAGE_KEYS.REVIEWS, filtered);
  },
};