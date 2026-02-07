const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { MAX_FILE_SIZE, ALLOWED_EXTENSIONS } = require("../config");
const { extractText } = require("../utils/extractText");
const { classifyDocument } = require("../validators/documentValidator");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const store = require("../store");

const router = express.Router();

// ── Multer setup ────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(
      new Error(
        `Invalid file type "${ext}". Only .txt and .pdf files are allowed.`
      ),
      false
    );
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

// ── POST /api/upload ────────────────────────────────────────────────────────
// Student uploads → text extracted → auto-routed to department by keywords.
// Flow: Student → Department → Admin (final).
router.post("/", authMiddleware, requireRole("student"), (req, res) => {
  upload.single("document")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        stage: "upload",
        status: "rejected",
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        stage: "upload",
        status: "rejected",
        message: "No file uploaded.",
      });
    }

    const filePath = req.file.path;
    const docId = uuidv4();

    try {
      const textContent = await extractText(filePath);

      // ── CLASSIFY the document using NLP model ──
      const classification = await classifyDocument(textContent);

      if (!classification.isValid || classification.category === "none") {
        // Classification failed — cannot determine document type
        const doc = store.addDocument({
          id: docId,
          userId: req.user.id,
          originalName: req.file.originalname,
          filePath,
          uploadedAt: new Date().toISOString(),
          textContent,
          currentStatus: "rejected",
          department: null,
          stages: [
            {
              stage: "upload",
              status: "submitted",
              timestamp: new Date().toISOString(),
              remarks: "File uploaded successfully.",
            },
            {
              stage: "classification",
              status: "rejected",
              timestamp: new Date().toISOString(),
              remarks: classification.failReason || "Document could not be classified into any category.",
              scores: classification.scores,
            },
          ],
          finalStatus: "rejected",
          finalMessage: classification.failReason || "Document could not be classified. Please upload a document related to admissions, scholarship, or internship.",
          extracted: null,
          adminRemarks: null,
          departmentRemarks: null,
        });

        return res.status(422).json({
          id: docId,
          status: "rejected",
          message: doc.finalMessage,
          classification,
          stages: doc.stages,
        });
      }

      // ── Classification succeeded → route to the classified department ──
      const department = classification.category;
      const deptLabel = department.charAt(0).toUpperCase() + department.slice(1);

      const doc = store.addDocument({
        id: docId,
        userId: req.user.id,
        originalName: req.file.originalname,
        filePath,
        uploadedAt: new Date().toISOString(),
        textContent,
        currentStatus: "pending_department",
        department,
        stages: [
          {
            stage: "upload",
            status: "submitted",
            timestamp: new Date().toISOString(),
            remarks: "File uploaded successfully.",
          },
          {
            stage: "classification",
            status: "passed",
            timestamp: new Date().toISOString(),
            remarks: `Classified as "${deptLabel}" (score: ${classification.bestScore}). Routed to ${deptLabel} Department.`,
            scores: classification.scores,
            detected: classification.detected,
          },
        ],
        finalStatus: null,
        finalMessage: null,
        extracted: null,
        adminRemarks: null,
        departmentRemarks: null,
      });

      return res.status(200).json({
        id: docId,
        status: "pending_department",
        message: `Document classified as "${deptLabel}" and routed to ${deptLabel} Department for review.`,
        department,
        classification,
        stages: doc.stages,
      });
    } catch (error) {
      console.error("Processing error:", error);
      return res.status(500).json({
        stage: "processing",
        status: "error",
        message: error.message,
      });
    }
  });
});

module.exports = router;
