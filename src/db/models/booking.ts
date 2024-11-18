import { z } from 'zod';
import db from '../schema';

export const bookingSchema = z.object({
  id: z.number().optional(),
  listingId: z.number(),
  userId: z.string(),
  startDate: z.number(),
  endDate: z.number(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  totalPrice: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Booking = z.infer<typeof bookingSchema>;

export const BookingModel = {
  create: db.prepare(`
    INSERT INTO bookings (
      listingId, userId, startDate, endDate,
      status, totalPrice, createdAt, updatedAt
    ) VALUES (
      @listingId, @userId, @startDate, @endDate,
      @status, @totalPrice, @createdAt, @updatedAt
    )
  `),

  findById: db.prepare(`
    SELECT b.*, l.title as listingTitle, u.name as userName
    FROM bookings b
    JOIN listings l ON b.listingId = l.id
    JOIN users u ON b.userId = u.id
    WHERE b.id = ?
  `),

  updateStatus: db.prepare(`
    UPDATE bookings
    SET status = @status, updatedAt = @updatedAt
    WHERE id = @id
  `),

  listByListing: db.prepare(`
    SELECT b.*, u.name as userName
    FROM bookings b
    JOIN users u ON b.userId = u.id
    WHERE b.listingId = ?
    ORDER BY b.startDate ASC
  `),

  listByUser: db.prepare(`
    SELECT b.*, l.title as listingTitle
    FROM bookings b
    JOIN listings l ON b.listingId = l.id
    WHERE b.userId = ?
    ORDER BY b.startDate DESC
  `),

  checkAvailability: db.prepare(`
    SELECT COUNT(*) as count
    FROM bookings
    WHERE listingId = @listingId
    AND status = 'confirmed'
    AND (
      (startDate BETWEEN @startDate AND @endDate)
      OR (endDate BETWEEN @startDate AND @endDate)
      OR (@startDate BETWEEN startDate AND endDate)
    )
  `),

  deleteById: db.prepare('DELETE FROM bookings WHERE id = ?'),
};