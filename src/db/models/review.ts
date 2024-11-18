import { z } from 'zod';
import db from '../schema';

export const reviewSchema = z.object({
  id: z.number().optional(),
  listingId: z.number(),
  userId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.number(),
});

export type Review = z.infer<typeof reviewSchema>;

export const ReviewModel = {
  create: db.prepare(`
    INSERT INTO reviews (
      listingId, userId, rating, comment, createdAt
    ) VALUES (
      @listingId, @userId, @rating, @comment, @createdAt
    )
  `),

  findById: db.prepare(`
    SELECT r.*, u.name as userName
    FROM reviews r
    JOIN users u ON r.userId = u.id
    WHERE r.id = ?
  `),

  listByListing: db.prepare(`
    SELECT r.*, u.name as userName
    FROM reviews r
    JOIN users u ON r.userId = u.id
    WHERE r.listingId = ?
    ORDER BY r.createdAt DESC
  `),

  listByUser: db.prepare(`
    SELECT r.*, l.title as listingTitle
    FROM reviews r
    JOIN listings l ON r.listingId = l.id
    WHERE r.userId = ?
    ORDER BY r.createdAt DESC
  `),

  deleteById: db.prepare('DELETE FROM reviews WHERE id = ?'),
};