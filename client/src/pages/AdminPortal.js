import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";
const DEPARTMENTS = ["admissions", "scholarship", "internship"];

function AdminPortal() {
  const [pending, setPending] = useState([]);
  const [allDocs, setAllDocs] = useState([]);
  const [reviewData, setReviewData] = useState({}); // { [docId]: { action, remarks, department } }
  const [actionMsg, setActionMsg] = useState(null);

  const fetchPending = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/pending`);
      setPending(res.data);
    } catch {
      /* ignore */
    }
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/all`);
      setAllDocs(res.data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchPending();
    fetchAll();
    const interval = setInterval(() => {
      fetchPending();
      fetchAll();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchPending, fetchAll]);

  const handleFieldChange = (docId, field, value) => {
    setReviewData((prev) => ({
      ...prev,
      [docId]: { ...prev[docId], [field]: value },
    }));
  };

  const handleReview = async (docId, action) => {
    const data = reviewData[docId] || {};

    try {
      const res = await axios.post(`${API}/admin/review/${docId}`, {
        action,
        remarks: data.remarks || "",
        department: data.department || "",
        extracted: null, // admin can add later
      });
      setActionMsg({ type: "success", text: res.data.message });
      fetchPending();
      fetchAll();
    } catch (err) {
      setActionMsg({
        type: "error",
        text: err.response?.data?.message || err.message,
      });
    }
  };

  return (
    <div>
      <div className="portal-header admin">
        <h2>Admin Portal</h2>
        <p>Review uploaded documents, then approve &amp; forward to a department or reject.</p>
      </div>

      {actionMsg && (
        <div className={`alert ${actionMsg.type === "error" ? "alert-error" : "alert-success"}`}>
          {actionMsg.text}
        </div>
      )}

      {/* ── Pending Documents ── */}
      <div className="section-card">
        <h3>Pending Documents ({pending.length})</h3>
        {pending.length === 0 && (
          <p className="empty-text">No documents pending review.</p>
        )}

        {pending.map((doc) => (
          <div className="review-card" key={doc.id}>
            <div className="review-header">
              <strong>{doc.originalName}</strong>
              <span className="review-time">
                Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
              </span>
            </div>

            {/* Show file content */}
            <div className="file-content-box">
              <strong>Document Content:</strong>
              <pre>{doc.textContent}</pre>
            </div>

            {/* Review controls */}
            <div className="review-controls">
              <div className="control-row">
                <label>Forward to Department:</label>
                <select
                  value={reviewData[doc.id]?.department || ""}
                  onChange={(e) =>
                    handleFieldChange(doc.id, "department", e.target.value)
                  }
                >
                  <option value="">-- Select Department --</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d.charAt(0).toUpperCase() + d.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-row">
                <label>Remarks:</label>
                <textarea
                  placeholder="Add remarks (optional)..."
                  value={reviewData[doc.id]?.remarks || ""}
                  onChange={(e) =>
                    handleFieldChange(doc.id, "remarks", e.target.value)
                  }
                  rows={2}
                />
              </div>

              <div className="action-buttons">
                <button
                  className="btn btn-approve"
                  onClick={() => handleReview(doc.id, "approve")}
                >
                  Approve &amp; Forward
                </button>
                <button
                  className="btn btn-reject"
                  onClick={() => handleReview(doc.id, "reject")}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── All Documents (Admin overview) ── */}
      <div className="section-card">
        <h3>All Documents</h3>
        {allDocs.length === 0 && (
          <p className="empty-text">No documents yet.</p>
        )}
        <table className="history-table">
          <thead>
            <tr>
              <th>#</th>
              <th>File</th>
              <th>Status</th>
              <th>Department</th>
              <th>Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {allDocs.map((doc, idx) => (
              <tr key={doc.id}>
                <td>{idx + 1}</td>
                <td>{doc.originalName}</td>
                <td>
                  <span className={`badge ${getBadgeClass(doc.currentStatus)}`}>
                    {formatStatus(doc.currentStatus)}
                  </span>
                </td>
                <td style={{ textTransform: "capitalize" }}>
                  {doc.department || "—"}
                </td>
                <td>{new Date(doc.uploadedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatStatus(s) {
  if (s === "pending_admin") return "Pending Admin";
  if (s === "pending_department") return "Pending Dept.";
  if (s === "approved") return "Approved";
  if (s === "rejected") return "Rejected";
  return s;
}

function getBadgeClass(s) {
  if (s === "approved") return "approved";
  if (s === "rejected") return "rejected";
  return "pending";
}

export default AdminPortal;
