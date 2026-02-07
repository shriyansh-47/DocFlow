const express = require("express");
const { PASSKEYS } = require("../config");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/verify — Verify a passkey for admin or department access
// Body: { role: "admin" | "department", passkey: "...", department?: "admissions" | ... }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/verify", (req, res) => {
  const { role, passkey, department } = req.body;

  if (!role || !passkey) {
    return res.status(400).json({ success: false, message: "Role and passkey are required." });
  }

  if (role === "admin") {
    if (passkey === PASSKEYS.admin) {
      return res.json({ success: true, message: "Admin access granted." });
    }
    return res.status(401).json({ success: false, message: "Invalid admin passkey." });
  }

  if (role === "department") {
    if (!department) {
      return res.status(400).json({ success: false, message: "Department name is required." });
    }

    const deptKey = department.toLowerCase().trim();
    const expectedPasskey = PASSKEYS.department[deptKey];

    if (!expectedPasskey) {
      return res.status(400).json({ success: false, message: `Unknown department: ${department}` });
    }

    if (passkey === expectedPasskey) {
      return res.json({ success: true, message: `${department} department access granted.` });
    }
    return res.status(401).json({ success: false, message: "Invalid department passkey." });
  }

  return res.status(400).json({ success: false, message: `Unknown role: ${role}` });
});

module.exports = router;
