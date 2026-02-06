const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME_TYPES = [
  "text/plain",
  "application/pdf",
];
const ALLOWED_EXTENSIONS = [".txt", ".pdf"];

module.exports = { MAX_FILE_SIZE, ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS };
