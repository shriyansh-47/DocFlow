const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { JWT_SECRET } = require("../config");

const router = express.Router();

// Load users from JSON file
function loadUsers() {
  const filePath = path.join(__dirname, "..", "data", "users.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login — authenticate user and return JWT
// Body: { username, password }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const users = loadUsers();
  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase().trim()
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Create JWT token (expires in 8 hours)
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    department: user.department,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      department: user.department,
    },
  });
});

module.exports = router;
