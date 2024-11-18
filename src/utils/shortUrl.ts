import { nanoid } from 'nanoid';

// Create a URL-safe alphabet for short URLs (excluding similar looking characters)
const alphabet = '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ';

export const generateShortCode = () => nanoid(8);

export const getShortUrl = (shortCode: string) => {
  const baseUrl = import.meta.env.VITE_SHORT_URL_DOMAIN || window.location.origin;
  return `${baseUrl}/s/${shortCode}`;
};