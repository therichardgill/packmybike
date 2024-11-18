const sqlite3 = require('@vscode/sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../bikebag.db');

const db = new sqlite3.Database(DB_PATH);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Review Model
const ReviewModel = {
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

module.exports = {
  ReviewModel,
  db,
  // Re-export other models
  ...require('./models/user'),
  ...require('./models/brand'),
  ...require('./models/bag'),
  ...require('./models/listing'),
  ...require('./models/booking')
};