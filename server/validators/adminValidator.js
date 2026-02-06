/**
 * Admin-level validation:
 *   1. File type & size already checked by multer (prior step).
 *   2. Parse the text content and look for required fields:
 *        - Name
 *        - Address
 *        - Date of Birth (DOB)
 *        - Phone Number
 *        - Field / Purpose of submission
 *
 * Returns { valid: boolean, missing: string[], extracted: {} }
 */

function adminValidate(textContent) {
  const lines = textContent.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const lower = textContent.toLowerCase();

  const extracted = {};
  const missing = [];

  // --- Name ---
  const nameLine = lines.find(
    (l) =>
      /^name\s*[:\-]/i.test(l)
  );
  if (nameLine) {
    extracted.name = nameLine.replace(/^name\s*[:\-]\s*/i, "").trim();
  }
  if (!extracted.name) missing.push("Name");

  // --- Address ---
  const addressLine = lines.find(
    (l) => /^address\s*[:\-]/i.test(l)
  );
  if (addressLine) {
    extracted.address = addressLine.replace(/^address\s*[:\-]\s*/i, "").trim();
  }
  if (!extracted.address) missing.push("Address");

  // --- Date of Birth ---
  const dobLine = lines.find(
    (l) =>
      /^(dob|date\s*of\s*birth)\s*[:\-]/i.test(l)
  );
  if (dobLine) {
    extracted.dob = dobLine
      .replace(/^(dob|date\s*of\s*birth)\s*[:\-]\s*/i, "")
      .trim();
  }
  if (!extracted.dob) missing.push("Date of Birth");

  // --- Phone Number ---
  const phoneLine = lines.find(
    (l) =>
      /^(phone|phone\s*no|phone\s*number|mobile|contact)\s*[:\-]/i.test(l)
  );
  if (phoneLine) {
    extracted.phone = phoneLine
      .replace(
        /^(phone|phone\s*no|phone\s*number|mobile|contact)\s*[:\-]\s*/i,
        ""
      )
      .trim();
  }
  if (!extracted.phone) missing.push("Phone Number");

  // --- Field / Purpose ---
  const fieldLine = lines.find(
    (l) =>
      /^(field|purpose|department|applying\s*for|submission\s*for)\s*[:\-]/i.test(
        l
      )
  );
  if (fieldLine) {
    extracted.field = fieldLine
      .replace(
        /^(field|purpose|department|applying\s*for|submission\s*for)\s*[:\-]\s*/i,
        ""
      )
      .trim();
  }
  if (!extracted.field) missing.push("Field / Purpose");

  return {
    valid: missing.length === 0,
    missing,
    extracted,
  };
}

module.exports = { adminValidate };
