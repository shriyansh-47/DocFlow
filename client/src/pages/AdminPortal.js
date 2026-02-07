import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function AdminPortal({ token }) {
  const [pending, setPending] = useState([]);
  const [allDocs, setAllDocs] = useState([]);
  const [reviewData, setReviewData] = useState({});
  const [actionMsg, setActionMsg] = useState(null);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchPending = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/pending`, authHeaders);
      setPending(res.data);
    } catch {
      /* ignore */
    }
  }, [token]);

  const fetchAll = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/admin/all`, authHeaders);
      setAllDocs(res.data);
    } catch {
      /* ignore */
    }
  }, [token]);

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
      }, authHeaders);
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
        <h2>Admin Portal — Final Approval</h2>
        <p>Documents that passed department review arrive here for final approval or rejection.</p>
      </div>

      {actionMsg && (
        <div className={`alert ${actionMsg.type === "error" ? "alert-error" : "alert-success"}`}>
          {actionMsg.text}
        </div>
      )}

      {/* ── Pending Documents (dept-approved, awaiting admin final) ── */}
      <div className="section-card">
        <h3>Pending Final Approval ({pending.length})</h3>
        {pending.length === 0 && (
          <p className="empty-text">No documents pending final approval.</p>
        )}

        {pending.map((doc) => (
          <div className="review-card" key={doc.id}>
            <div className="review-header">
              <strong>{doc.originalName}</strong>
              <span className="review-time">
                Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
              </span>
            </div>

            <p className="admin-note">
              <strong>Department:</strong>{" "}
              <span style={{ textTransform: "capitalize" }}>{doc.department}</span>
              {doc.departmentRemarks && (
                <> — <strong>Dept. Remarks:</strong> {doc.departmentRemarks}</>
              )}
            </p>

            {/* Show file content */}
            <div className="file-content-box">
              <strong>Document Content:</strong>
              <pre>{doc.textContent}</pre>
            </div>

            {/* Prior stages */}
            {doc.stages && doc.stages.length > 0 && (
              <div className="stages-timeline compact">
                <strong>Prior Stages:</strong>
                {doc.stages.map((s, i) => (
                  <div className="stage-item" key={i}>
                    <div className={`stage-dot ${s.status}`} />
                    <div className="stage-info">
                      <span className="stage-name">{s.stage}</span>
                      <span className="stage-time">
                        {" — "}
                        {new Date(s.timestamp).toLocaleString()}
                      </span>
                      {s.remarks && (
                        <div className="stage-remarks">{s.remarks}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Review controls */}
            <div className="review-controls">
              <div className="control-row">
                <label>Remarks:</label>
                <textarea
                  placeholder="Add final review remarks (optional)..."
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
                  Final Approve
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
