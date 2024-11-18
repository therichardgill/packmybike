import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database(join(process.cwd(), 'bikebag.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create reviews table with proper associations
db.exec(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listingId INTEGER NOT NULL,
    reviewerId TEXT NOT NULL,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT,
    createdAt INTEGER NOT NULL,
    FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewerId) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// Add indexes for performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listingId);
  CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewerId);
`);