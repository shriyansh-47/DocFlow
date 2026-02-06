const express = require("express");
const store = require("../store");

const router = express.Router();

// Supported departments
const DEPARTMENTS = ["admissions", "scholarship", "internship"];

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/department/pending/:dept — documents awaiting this department
// ─────────────────────────────────────────────────────────────────────────────
router.get("/pending/:dept", (req, res) => {
  const dept = req.params.dept.toLowerCase().trim();

  const docs = store
    .getAll()
    .filter(
      (d) =>
        d.currentStatus === "pending_department" &&
        d.department === dept
    )
    .map((d) => ({
      id: d.id,
      originalName: d.originalName,
      uploadedAt: d.uploadedAt,
      textContent: d.textContent,
      currentStatus: d.currentStatus,
      department: d.department,
      extracted: d.extracted,
      adminRemarks: d.adminRemarks,
      stages: d.stages,
    }));

  res.json(docs);
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/department/all/:dept — all documents that belong to this department
// ─────────────────────────────────────────────────────────────────────────────
router.get("/all/:dept", (req, res) => {
  const dept = req.params.dept.toLowerCase().trim();

  const docs = store
    .getAll()
    .filter((d) => d.department === dept)
    .map((d) => ({
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
// POST /api/department/review/:id — department approves or rejects
// Body: { action: "approve" | "reject", remarks: "..." }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/review/:id", (req, res) => {
  const doc = store.getById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Document not found" });

  if (doc.currentStatus !== "pending_department") {
    return res.status(400).json({
      message: `Document is not pending department review. Current status: ${doc.currentStatus}`,
    });
  }

  const { action, remarks } = req.body;

  if (!action || !["approve", "reject"].includes(action)) {
    return res
      .status(400)
      .json({ message: 'action must be "approve" or "reject"' });
  }

  const deptLabel = doc.department.charAt(0).toUpperCase() + doc.department.slice(1);

  if (action === "reject") {
    const stageEntry = {
      stage: `department-${doc.department}`,
      status: "rejected",
      remarks: remarks || `Rejected by ${deptLabel} department.`,
      timestamp: new Date().toISOString(),
    };

    store.updateDocument(doc.id, {
      currentStatus: "rejected",
      finalStatus: "rejected",
      finalMessage: `${deptLabel} Department rejected: ${remarks || "No remarks provided."}`,
      departmentRemarks: remarks || `Rejected by ${deptLabel} department.`,
      stages: [...doc.stages, stageEntry],
    });

    return res.json({
      message: `Document rejected by ${deptLabel} department.`,
      id: doc.id,
    });
  }

  // APPROVE → forward to admin for final approval
  const stageEntry = {
    stage: `department-${doc.department}`,
    status: "approved",
    remarks: remarks || `Approved by ${deptLabel} department. Forwarding to admin for final approval.`,
    timestamp: new Date().toISOString(),
  };

  store.updateDocument(doc.id, {
    currentStatus: "pending_admin",
    departmentRemarks: remarks || `Approved by ${deptLabel} department.`,
    stages: [...doc.stages, stageEntry],
  });

  return res.json({
    message: `Document approved by ${deptLabel} department. Forwarded to admin for final approval.`,
    id: doc.id,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/department/list — list of supported departments
// ─────────────────────────────────────────────────────────────────────────────
router.get("/list", (req, res) => {
  res.json(DEPARTMENTS.map((d) => ({ key: d, label: d.charAt(0).toUpperCase() + d.slice(1) })));
});

module.exports = router;
