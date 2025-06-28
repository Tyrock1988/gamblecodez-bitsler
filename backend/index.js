// backend/index.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

// Init
const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join("/data", "database.sqlite");
const db = new sqlite3.Database(dbPath);

// Create tables if not exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS mailing_list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      category TEXT NOT NULL
    )
  `);
});

// Env admin creds
const ADMIN_USER = process.env.ADMIN_USER || "Admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "Pink2222";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// Login route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, error: "Invalid credentials" });
});

// GET all users
app.get("/api/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Read failed" });
    res.json(rows);
  });
});

// Add user
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ success: false, error: "Missing fields" });

  db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], function (err) {
    if (err) return res.status(500).json({ success: false, error: "Write failed" });
    res.json({ success: true, id: this.lastID });
  });
});

// Add mailing list email
app.post("/api/mailing", (req, res) => {
  const { email, category } = req.body;
  if (!email || !category) return res.status(400).json({ success: false, error: "Missing fields" });

  db.run("INSERT INTO mailing_list (email, category) VALUES (?, ?)", [email, category], function (err) {
    if (err) return res.status(500).json({ success: false, error: "Write failed" });
    res.json({ success: true, id: this.lastID });
  });
});

// GET mailing list (optional for admin view)
app.get("/api/mailing", (req, res) => {
  db.all("SELECT * FROM mailing_list", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Read failed" });
    res.json(rows);
  });
});

// Serve frontend
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"))
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});