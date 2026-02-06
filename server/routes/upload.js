const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { MAX_FILE_SIZE, ALLOWED_EXTENSIONS } = require("../config");
const { extractText } = require("../utils/extractText");
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
// Student uploads a file → saved with status "pending_admin"
// NO automatic validation — admin will review manually.
router.post("/", (req, res) => {
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
      // Extract text so admin can view the content
      const textContent = await extractText(filePath);

      const doc = store.addDocument({
        id: docId,
        originalName: req.file.originalname,
        filePath,
        uploadedAt: new Date().toISOString(),
        textContent,
        currentStatus: "pending_admin",
        department: null,
        stages: [
          {
            stage: "upload",
            status: "submitted",
            timestamp: new Date().toISOString(),
            remarks: "File uploaded successfully. Awaiting admin review.",
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
        status: "pending_admin",
        message:
          "Document uploaded successfully! It is now pending admin review.",
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
