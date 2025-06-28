const sqlite3 = require("sqlite3").verbose();
const dbPath = "/data/database.sqlite";
const sqlite = new sqlite3.Database(dbPath);

// Create `users` table if not exists
sqlite.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL
  )
`);

// Create `mailing_list` table if not exists
sqlite.run(`
  CREATE TABLE IF NOT EXISTS mailing_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    category TEXT NOT NULL
  )
`);