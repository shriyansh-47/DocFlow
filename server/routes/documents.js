const express = require("express");
const store = require("../store");

const router = express.Router();

// GET /api/documents — list all documents (student view)
router.get("/", (req, res) => {
  const docs = store.getAll().map((d) => ({
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

// GET /api/documents/:id — single document detail
router.get("/:id", (req, res) => {
  const doc = store.getById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Document not found" });

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
