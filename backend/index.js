const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Use environment variables for login credentials (safer than hardcoding)
const ADMIN_USER = process.env.ADMIN_USER || "Admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "Pink2222";

// Path to the JSON data file
const DATA_FILE = path.join(__dirname, "data.json");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// Utility: Load users from data.json
function loadUsers() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    return [];
  }

  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading data.json:", err);
    return [];
  }
}

// Utility: Save users to data.json
function saveUsers(users) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error("Error writing to data.json:", err);
  }
}

// Routes

// POST /api/login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: "Invalid credentials" });
  }
});

// GET /api/users
app.get("/api/users", (req, res) => {
  const users = loadUsers();
  res.json(users);
});

// POST /api/users
app.post("/api/users", (req, res) => {
  try {
    const users = loadUsers();
    users.push(req.body);
    saveUsers(users);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Could not save user" });
  }
});

// Fallback to frontend for unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});