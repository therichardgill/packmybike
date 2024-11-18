export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface Country {
  code: string;
  name: string;
  currencies: Currency[];
  flag: string;
}

export interface Location {
  country: Country;
  detected: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile?: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  listings: string[];
  createdAt: Date;
  lastLogin: Date;
  updatedAt?: Date;
  verifiedEmail: boolean;
  verifiedMobile?: boolean;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
  };
  address?: {
    street: string;
    unit?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    privacy: 'public' | 'city_only';
  };
}

export interface Brand {
  id: string;
  name: string;
  website: string;
  description: string;
  logo?: string;
  headquarters: string;
  foundedYear: number;
  specialties: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Bag {
  id: string;
  brandId: string;
  model: string;
  protectionLevel: number;
  transportRating: number;
  wheelSize: {
    min: number;
    max: number;
  };
  weight: {
    empty: number;
    maxLoad: number;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  volume: number;
  tsaCompliant: 'Yes' | 'No' | 'Unknown';
  manualUrl?: string;
  packingGuideUrl?: string;
  compatibility: string[];
  securityFeatures: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  id: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    address?: User['address'];
  };
  bagSpecs: Bag;
  pricingSchedule: {
    minimumDays: number;
    dailyRate: number;
    weeklyRate: number;
  };
  deliveryOptions: {
    pickup: boolean;
    dropoff: boolean;
    delivery: boolean;
    deliveryFee?: number;
    deliveryRadius?: number;
    pickupLocation?: string;
  };
  images: string[];
  description: string;
  available: boolean;
  featured: boolean;
  rating: number;
  reviews: number;
  upvotes: number;
  shortCode: string;
  shortUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  listingId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShortUrl {
  id: string;
  shortCode: string;
  listingId: string;
  createdAt: string;
  clicks: number;
}