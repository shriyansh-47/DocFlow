const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME_TYPES = [
  "text/plain",
  "application/pdf",
];
const ALLOWED_EXTENSIONS = [".txt", ".pdf"];

// ── Portal Passkeys ──
// Change these to your desired passkeys
const PASSKEYS = {
  admin: "admin@123",
  department: {
    admissions: "admissions@123",
    scholarship: "scholarship@123",
    internship: "internship@123",
  },
};

module.exports = { MAX_FILE_SIZE, ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS, PASSKEYS };
