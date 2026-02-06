const express = require("express");
const store = require("../store");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/pending — documents approved by department, awaiting admin
// ─────────────────────────────────────────────────────────────────────────────
router.get("/pending", (req, res) => {
  const docs = store
    .getAll()
    .filter((d) => d.currentStatus === "pending_admin")
    .map((d) => ({
      id: d.id,
      originalName: d.originalName,
      uploadedAt: d.uploadedAt,
      textContent: d.textContent,
      currentStatus: d.currentStatus,
      department: d.department,
      departmentRemarks: d.departmentRemarks,
      stages: d.stages,
    }));
  res.json(docs);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/all — all documents (admin overview)
// ─────────────────────────────────────────────────────────────────────────────
router.get("/all", (req, res) => {
  const docs = store.getAll().map((d) => ({
    id: d.id,
    originalName: d.originalName,
    uploadedAt: d.uploadedAt,
    currentStatus: d.currentStatus,
    finalStatus: d.finalStatus,
    department: d.department,
    extracted: d.extracted,
    stages: d.stages,
  }));
  res.json(docs);
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/review/:id — admin gives FINAL approval or rejection
// Body: { action: "approve" | "reject", remarks: "..." }
//
// Documents arrive here AFTER department has approved them.
// ─────────────────────────────────────────────────────────────────────────────
router.post("/review/:id", (req, res) => {
  const doc = store.getById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Document not found" });

  if (doc.currentStatus !== "pending_admin") {
    return res
      .status(400)
      .json({ message: `Document is not pending admin review. Current status: ${doc.currentStatus}` });
  }

  const { action, remarks } = req.body;

  if (!action || !["approve", "reject"].includes(action)) {
    return res
      .status(400)
      .json({ message: 'action must be "approve" or "reject"' });
  }

  const deptLabel = doc.department
    ? doc.department.charAt(0).toUpperCase() + doc.department.slice(1)
    : "Unknown";

  // ── REJECT ──
  if (action === "reject") {
    const stageEntry = {
      stage: "admin-final",
      status: "rejected",
      remarks: remarks || "Rejected by admin (final review).",
      timestamp: new Date().toISOString(),
    };

    store.updateDocument(doc.id, {
      currentStatus: "rejected",
      finalStatus: "rejected",
      finalMessage: `Admin (final review) rejected: ${remarks || "No remarks provided."}`,
      adminRemarks: remarks || "Rejected by admin.",
      stages: [...doc.stages, stageEntry],
    });

    return res.json({ message: "Document rejected by admin.", id: doc.id });
  }

  // ── APPROVE (FINAL) ──
  const stageEntry = {
    stage: "admin-final",
    status: "approved",
    remarks: remarks || "Final approval granted by admin.",
    timestamp: new Date().toISOString(),
  };

  store.updateDocument(doc.id, {
    currentStatus: "approved",
    finalStatus: "approved",
    finalMessage: `Document fully approved! (${deptLabel} Dept + Admin)`,
    adminRemarks: remarks || "Approved.",
    stages: [...doc.stages, stageEntry],
  });

  return res.json({
    message: `Document fully approved (final).`,
    id: doc.id,
  });
});

module.exports = router;
