const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

const ADMIN_USER = "Admin";
const ADMIN_PASS = "Pink2222";
const DATA_FILE = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

function loadUsers() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

app.get("/api/users", (req, res) => {
  const users = loadUsers();
  res.json(users);
});

app.post("/api/users", (req, res) => {
  const users = loadUsers();
  users.push(req.body);
  saveUsers(users);
  res.json({ success: true });
});

// Catch-all to serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
