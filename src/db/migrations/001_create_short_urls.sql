CREATE TABLE IF NOT EXISTS short_urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shortCode TEXT NOT NULL UNIQUE,
  listingId INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  clicks INTEGER DEFAULT 0,
  FOREIGN KEY (listingId) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE INDEX idx_short_urls_code ON short_urls(shortCode);
CREATE INDEX idx_short_urls_listing ON short_urls(listingId);