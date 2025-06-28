// backend/index.js
const express = require("express");
const path = require("path");
const cors = require("cors");
const Database = require("better-sqlite3");

// Init
const app = express();
const PORT = process.env.PORT || 3000;
const db = new Database(path.join(__dirname, "..", "data", "database.sqlite"));

// Ensure users table exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
  )
`).run();

// Optional: secure admin creds via env
const ADMIN_USER = process.env.ADMIN_USER || "Admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "Pink2222";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// POST /api/login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, error: "Invalid credentials" });
});

// GET /api/users
app.get("/api/users", (req, res) => {
  try {
    const users = db.prepare("SELECT * FROM users").all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Read failed" });
  }
});

// POST /api/users
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ success: false, error: "Missing fields" });

  try {
    db.prepare("INSERT INTO users (name, email) VALUES (?, ?)").run(name, email);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Write failed" });
  }
});

// Serve frontend
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"))
);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));