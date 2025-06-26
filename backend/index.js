const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const DATA_FILE = path.join("/data", "users.json");

const ADMIN_USER = "Admin";
const ADMIN_PASS = "Pink2222";

function loadUsers() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, "utf8");
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

app.post("/api/signup", (req, res) => {
  const { username, referral } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  const users = loadUsers();
  users.push({ username, referral, date: new Date().toISOString() });
  saveUsers(users);
  res.json({ success: true });
});

app.get("/api/admin/users", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  const [type, credentials] = auth.split(" ");
  if (type !== "Basic") return res.status(401).json({ error: "Unauthorized" });
  const decoded = Buffer.from(credentials, "base64").toString();
  const [user, pass] = decoded.split(":");
  if (user !== ADMIN_USER || pass !== ADMIN_PASS) return res.status(403).json({ error: "Forbidden" });

  const users = loadUsers();
  res.json(users);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
