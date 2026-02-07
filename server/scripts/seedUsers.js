/**
 * Seed script — run once to generate data/users.json with hashed passwords.
 * Usage: node scripts/seedUsers.js
 */
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const USERS = [
  { id: 1, username: "student1",          password: "student123",  role: "student",     department: null },
  { id: 2, username: "admissions_head",   password: "admit123",    role: "department",  department: "admissions" },
  { id: 3, username: "scholarship_head",  password: "scholar123",  role: "department",  department: "scholarship" },
  { id: 4, username: "internship_head",   password: "intern123",   role: "department",  department: "internship" },
  { id: 5, username: "admin1",            password: "admin123",    role: "admin",       department: null },
];

async function seed() {
  const hashed = await Promise.all(
    USERS.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, 10),
    }))
  );

  const dataDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(
    path.join(dataDir, "users.json"),
    JSON.stringify(hashed, null, 2)
  );

  console.log("✅ users.json created with", hashed.length, "users:");
  USERS.forEach((u) =>
    console.log(`   ${u.username} / ${u.password}  →  ${u.role}${u.department ? ` (${u.department})` : ""}`)
  );
}

seed().catch(console.error);
