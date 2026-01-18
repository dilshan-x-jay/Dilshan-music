
# Cloudflare D1 Database Setup

1. **Go to Cloudflare Dashboard** > Workers & Pages > D1.
2. **Create Database**: Name it `music_db`.
3. **Initialize Table**: Click on your database > Console and run:
```sql
CREATE TABLE songs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  artistId TEXT,
  album TEXT,
  genre TEXT,
  year TEXT,
  description TEXT,
  lyrics TEXT,
  bpm INTEGER,
  song_key TEXT,
  albumArtUrl TEXT,
  downloadUrl TEXT,
  youtubeUrl TEXT
);

CREATE TABLE artists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT,
  imageUrl TEXT,
  description TEXT
);
```

### If you already have the table and are missing the Year column:
Run this command in the console:
```sql
ALTER TABLE songs ADD COLUMN year TEXT;
```

4. **Bind to Worker**: Go to your Worker Settings > Variables > D1 Database Bindings. 
   - Variable name: `DB`
   - Database: `music_db`
5. **Redeploy Worker** with the new code provided in the chat.
