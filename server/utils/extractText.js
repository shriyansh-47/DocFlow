const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

/**
 * Extract text content from a file.
 * - .txt  → read directly
 * - .pdf  → convert to text via pdf-parse
 * Returns the plain-text string.
 */
async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".txt") {
    return fs.readFileSync(filePath, "utf-8");
  }

  if (ext === ".pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
  }

  throw new Error(`Unsupported file extension: ${ext}`);
}

module.exports = { extractText };
