const express = require("express");
const store = require("../store");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/documents — list documents for the logged-in student
router.get("/", authMiddleware, requireRole("student"), (req, res) => {
  const docs = store.getAll().filter((d) => d.userId === req.user.id).map((d) => ({
    id: d.id,
    originalName: d.originalName,
    uploadedAt: d.uploadedAt,
    currentStatus: d.currentStatus,
    finalStatus: d.finalStatus,
    finalMessage: d.finalMessage,
    department: d.department || null,
    extracted: d.extracted,
    stages: d.stages,
    adminRemarks: d.adminRemarks,
    departmentRemarks: d.departmentRemarks,
  }));
  res.json(docs);
});

// DELETE /api/documents/clear — remove all finalized documents for the logged-in student
router.delete("/clear", authMiddleware, requireRole("student"), (req, res) => {
  const allDocs = store.getAll().filter((d) => d.userId === req.user.id);
  const finalized = allDocs.filter(
    (d) => d.finalStatus === "approved" || d.finalStatus === "rejected"
  );
  if (finalized.length === 0) {
    return res.json({ message: "No finalized documents to clear.", cleared: 0 });
  }
  finalized.forEach((d) => store.deleteDocument(d.id));
  return res.json({
    message: `Cleared ${finalized.length} finalized document(s) from history.`,
    cleared: finalized.length,
  });
});

// DELETE /api/documents/:id — remove a single finalized document for the logged-in student
router.delete("/:id", authMiddleware, requireRole("student"), (req, res) => {
  const doc = store.getById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Document not found" });
  if (doc.userId !== req.user.id)
    return res.status(403).json({ message: "Access denied." });
  if (doc.finalStatus !== "approved" && doc.finalStatus !== "rejected") {
    return res.status(400).json({
      message: "Only finalized documents (approved/rejected by admin) can be cleared.",
    });
  }
  store.deleteDocument(doc.id);
  return res.json({ message: "Document cleared from history.", id: doc.id });
});

// GET /api/documents/:id — single document detail (student only sees own docs)
router.get("/:id", authMiddleware, requireRole("student"), (req, res) => {
  const doc = store.getById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Document not found" });
  if (doc.userId !== req.user.id) return res.status(403).json({ message: "Access denied." });

  res.json({
    id: doc.id,
    originalName: doc.originalName,
    uploadedAt: doc.uploadedAt,
    currentStatus: doc.currentStatus,
    finalStatus: doc.finalStatus,
    finalMessage: doc.finalMessage,
    department: doc.department || null,
    extracted: doc.extracted,
    stages: doc.stages,
    adminRemarks: doc.adminRemarks,
    departmentRemarks: doc.departmentRemarks,
  });
});

module.exports = router;
