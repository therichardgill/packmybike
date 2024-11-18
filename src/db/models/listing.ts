import { z } from 'zod';
import db from '../schema';

export const listingSchema = z.object({
  id: z.number().optional(),
  userId: z.string(),
  bagId: z.number(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  price: z.number().positive(),
  image: z.string().optional(),
  available: z.boolean(),
  featured: z.boolean(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number(),
  upvotes: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Listing = z.infer<typeof listingSchema>;

export const ListingModel = {
  create: db.prepare(`
    INSERT INTO listings (
      userId, bagId, title, description, location,
      price, image, available, featured, reviewCount,
      upvotes, createdAt, updatedAt
    ) VALUES (
      @userId, @bagId, @title, @description, @location,
      @price, @image, @available, @featured, @reviewCount,
      @upvotes, @createdAt, @updatedAt
    )
  `),

  findById: db.prepare(`
    SELECT l.*, u.name as ownerName, b.model as bagModel
    FROM listings l
    JOIN users u ON l.userId = u.id
    JOIN bags b ON l.bagId = b.id
    WHERE l.id = ?
  `),

  updateById: db.prepare(`
    UPDATE listings SET
      title = @title,
      description = @description,
      location = @location,
      price = @price,
      image = @image,
      available = @available,
      featured = @featured,
      updatedAt = @updatedAt
    WHERE id = @id
  `),

  deleteById: db.prepare('DELETE FROM listings WHERE id = ?'),

  listAll: db.prepare(`
    SELECT l.*, u.name as ownerName, b.model as bagModel
    FROM listings l
    JOIN users u ON l.userId = u.id
    JOIN bags b ON l.bagId = b.id
    ORDER BY l.createdAt DESC
  `),

  listByUser: db.prepare(`
    SELECT l.*, u.name as ownerName, b.model as bagModel
    FROM listings l
    JOIN users u ON l.userId = u.id
    JOIN bags b ON l.bagId = b.id
    WHERE l.userId = ?
    ORDER BY l.createdAt DESC
  `),

  listFeatured: db.prepare(`
    SELECT l.*, u.name as ownerName, b.model as bagModel
    FROM listings l
    JOIN users u ON l.userId = u.id
    JOIN bags b ON l.bagId = b.id
    WHERE l.featured = 1
    ORDER BY l.rating DESC, l.reviewCount DESC
    LIMIT ?
  `),

  searchByLocation: db.prepare(`
    SELECT l.*, u.name as ownerName, b.model as bagModel
    FROM listings l
    JOIN users u ON l.userId = u.id
    JOIN bags b ON l.bagId = b.id
    WHERE l.location LIKE ?
    ORDER BY l.rating DESC, l.reviewCount DESC
  `),

  updateRating: db.prepare(`
    UPDATE listings
    SET rating = (
      SELECT AVG(rating)
      FROM reviews
      WHERE listingId = @listingId
    ),
    reviewCount = (
      SELECT COUNT(*)
      FROM reviews
      WHERE listingId = @listingId
    )
    WHERE id = @listingId
  `),
};