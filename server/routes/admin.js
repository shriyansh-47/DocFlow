const express = require("express");
const store = require("../store");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/pending — documents awaiting admin review
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
// POST /api/admin/review/:id — admin approves or rejects a document
// Body: { action: "approve" | "reject", remarks: "...", extracted: {...}, department: "..." }
//
// On approve:  admin must provide extracted info + department to forward to.
// On reject:   admin provides remarks explaining why.
// ─────────────────────────────────────────────────────────────────────────────
router.post("/review/:id", (req, res) => {
  const doc = store.getById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Document not found" });

  if (doc.currentStatus !== "pending_admin") {
    return res
      .status(400)
      .json({ message: `Document is not pending admin review. Current status: ${doc.currentStatus}` });
  }

  const { action, remarks, extracted, department } = req.body;

  if (!action || !["approve", "reject"].includes(action)) {
    return res
      .status(400)
      .json({ message: 'action must be "approve" or "reject"' });
  }

  // ── REJECT ──
  if (action === "reject") {
    const stageEntry = {
      stage: "admin",
      status: "rejected",
      remarks: remarks || "Rejected by admin.",
      timestamp: new Date().toISOString(),
    };

    store.updateDocument(doc.id, {
      currentStatus: "rejected",
      finalStatus: "rejected",
      finalMessage: `Admin rejected: ${remarks || "No remarks provided."}`,
      adminRemarks: remarks || "Rejected by admin.",
      stages: [...doc.stages, stageEntry],
    });

    return res.json({ message: "Document rejected by admin.", id: doc.id });
  }

  // ── APPROVE ──
  if (!department) {
    return res
      .status(400)
      .json({ message: "department is required when approving." });
  }

  const stageEntry = {
    stage: "admin",
    status: "approved",
    remarks: remarks || "Approved by admin. Forwarding to department.",
    extracted: extracted || null,
    timestamp: new Date().toISOString(),
  };

  store.updateDocument(doc.id, {
    currentStatus: "pending_department",
    department: department.toLowerCase().trim(),
    extracted: extracted || null,
    adminRemarks: remarks || "Approved.",
    stages: [...doc.stages, stageEntry],
  });

  return res.json({
    message: `Document approved by admin. Forwarded to ${department} department.`,
    id: doc.id,
  });
});

module.exports = router;
