import sqlite3 from '@vscode/sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '../../bikebag.db');

const db = new sqlite3.Database(DB_PATH);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Review Model
export const ReviewModel = {
  create: db.prepare(`
    INSERT INTO reviews (listingId, userId, rating, comment, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `),

  findById: db.prepare(`
    SELECT r.*, u.name as userName
    FROM reviews r
    JOIN users u ON r.userId = u.id
    WHERE r.id = ?
  `),

  findByListingAndReviewer: db.prepare(`
    SELECT * FROM reviews
    WHERE listingId = ? AND userId = ?
  `),

  listByListing: db.prepare(`
    SELECT r.*, u.name as userName
    FROM reviews r
    JOIN users u ON r.userId = u.id
    WHERE r.listingId = ?
    ORDER BY r.createdAt DESC
    LIMIT ?
  `),

  deleteById: db.prepare('DELETE FROM reviews WHERE id = ?'),
};

// Re-export other models
export * from './models/user';
export * from './models/brand';
export * from './models/bag';
export * from './models/listing';
export * from './models/booking';