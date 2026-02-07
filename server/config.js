const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME_TYPES = [
  "text/plain",
  "application/pdf",
];
const ALLOWED_EXTENSIONS = [".txt", ".pdf"];

// ── JWT Secret ──
const JWT_SECRET = "docflow_secret_key_2026_x9k7m3";

// ── NLP Classification ──
// Minimum confidence (0–1) for a document to be accepted.
// Below this → rejected as unclassifiable.
const NLP_CONFIDENCE_THRESHOLD = 0.60;

module.exports = { MAX_FILE_SIZE, ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS, JWT_SECRET, NLP_CONFIDENCE_THRESHOLD };
