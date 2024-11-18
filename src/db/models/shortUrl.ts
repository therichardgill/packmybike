import { z } from 'zod';
import db from '../schema';

export const shortUrlSchema = z.object({
  id: z.number().optional(),
  shortCode: z.string(),
  listingId: z.number(),
  createdAt: z.number(),
  clicks: z.number(),
});

export type ShortUrl = z.infer<typeof shortUrlSchema>;

export const ShortUrlModel = {
  create: db.prepare(`
    INSERT INTO short_urls (
      shortCode, listingId, createdAt, clicks
    ) VALUES (
      @shortCode, @listingId, @createdAt, 0
    )
  `),

  findByCode: db.prepare(`
    SELECT * FROM short_urls
    WHERE shortCode = ?
  `),

  incrementClicks: db.prepare(`
    UPDATE short_urls
    SET clicks = clicks + 1
    WHERE shortCode = ?
  `),

  findByListing: db.prepare(`
    SELECT * FROM short_urls
    WHERE listingId = ?
  `),
};