// backend/index.js
const express = require("express");
const path    = require("path");
const cors    = require("cors");
const { Deta }= require("deta");

// init
const app  = express();
const PORT = process.env.PORT || 3000;
const deta = Deta(process.env.DETA_PROJECT_KEY);
const db   = deta.Base("users");    // “users” bucket

// optional: secure admin creds via env
const ADMIN_USER = process.env.ADMIN_USER || "Admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "Pink2222";

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// POST /api/login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username===ADMIN_USER && password===ADMIN_PASS)
    return res.json({ success: true });
  res.status(401).json({ success: false, error:"Invalid credentials" });
});

// GET /api/users
app.get("/api/users", async (req, res) => {
  try {
    const { items } = await db.fetch();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error:"Read failed" });
  }
});

// POST /api/users
app.post("/api/users", async (req, res) => {
  try {
    await db.put(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error:"Write failed" });
  }
});

// serve frontend
app.get("*", (req,res) => 
  res.sendFile(path.join(__dirname, "..","frontend","dist","index.html"))
);

app.listen(PORT, ()=> 
  console.log(`🚀 Running on port ${PORT}`)
);