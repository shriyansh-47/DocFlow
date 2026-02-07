const stringSimilarity = require("string-similarity");

// --- 1. THE CONFIGURATION HUB ---
const DOCUMENT_RULES = {
  internship: {
    mandatory: [
      {
        id: "type",
        label: "Document Title",
        keywords: [
          "certificate of completion",
          "internship completion",
          "to whom it may concern",
          "certificate of legal training",
          "training certificate",
        ],
      },
      {
        id: "authority",
        label: "Authority Signature",
        keywords: [
          "director",
          "manager",
          "mentor",
          "authorized signatory",
          "head of department",
          "advocate",
          "senior counsel",
        ],
      },
    ],
  },
  admissions: {
    mandatory: [
      {
        id: "type",
        label: "Admission Request Title",
        keywords: [
          "admission application",
          "application for admission",
          "request for admission",
          "admission form",
          "admission inquiry",
        ],
      },
      {
        id: "authority",
        label: "Applicant / Institution Reference",
        keywords: [
          "dear sir",
          "dear madam",
          "to the principal",
          "to the registrar",
          "respected sir",
          "admission committee",
          "admissions committee",
          "dear admissions",
        ],
      },
      {
        id: "context",
        label: "Academic Context",
        keywords: [
          "academic year",
          "course name",
          "qualification",
          "percentage",
          "marks obtained",
          "board examination",
          "stream",
          "transcripts",
          "statement of purpose",
          "letters of recommendation",
          "semester",
          "graduate program",
          "undergraduate",
        ],
      },
    ],
  },
  scholarship: {
    mandatory: [
      {
        id: "type",
        label: "Scholarship Title",
        keywords: [
          "scholarship application",
          "financial aid",
          "merit scholarship",
          "income certificate",
          "grant approval",
        ],
      },
      {
        id: "authority",
        label: "Authority Signature",
        keywords: [
          "scholarship committee",
          "dean of student affairs",
          "financial aid officer",
          "ministry of education",
        ],
      },
      {
        id: "context",
        label: "Financial/Merit Context",
        keywords: [
          "annual income",
          "bank account",
          "tuition waiver",
          "fund disbursement",
        ],
      },
    ],
  },
};

// --- 2. SCORE A DOCUMENT AGAINST ONE CATEGORY ---
function scoreCategory(cleanText, rawText, category, config) {
  let score = 0;
  const detected = {};
  const missing = [];
  let keywordHits = 0;

  // Check each mandatory field group
  config.mandatory.forEach((field) => {
    const found = field.keywords.some((keyword) =>
      cleanText.includes(keyword)
    );
    if (found) {
      score += 20;
      detected[field.id] = true;
      keywordHits++;
    } else {
      missing.push(field.label);
    }
  });

  // Date check (bonus points, not category-specific)
  const datePattern =
    /(\d{1,2}[-./]\d{1,2}[-./]\d{2,4})|(\d{1,2}(st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{2,4})/gi;
  const dates = rawText.match(datePattern);
  if (dates && dates.length > 0) {
    score += 10;
    detected.date = dates[0];
  }

  return { category, score, keywordHits, detected, missing };
}

// --- 3. CLASSIFY DOCUMENT (scores against ALL categories, picks best) ---
function classifyDocument(rawText) {
  const cleanText = rawText.toLowerCase().replace(/\s+/g, " ");
  const categories = Object.keys(DOCUMENT_RULES);

  // Score the document against every category
  const results = categories.map((cat) =>
    scoreCategory(cleanText, rawText, cat, DOCUMENT_RULES[cat])
  );

  // Sort by score descending, then by keyword hits descending
  results.sort((a, b) => b.score - a.score || b.keywordHits - a.keywordHits);

  const best = results[0];
  const scores = {};
  results.forEach((r) => (scores[r.category] = r.score));

  // Minimum: at least one keyword hit AND score >= 20
  if (best.keywordHits === 0 || best.score < 20) {
    return {
      category: "none",
      isValid: false,
      scores,
      bestScore: best.score,
      detected: best.detected,
      missing: best.missing,
      failReason:
        "Document could not be classified. It does not contain enough keywords related to admissions, scholarship, or internship.",
    };
  }

  return {
    category: best.category,
    isValid: true,
    scores,
    bestScore: best.score,
    detected: best.detected,
    missing: best.missing,
  };
}

module.exports = { classifyDocument, DOCUMENT_RULES };
