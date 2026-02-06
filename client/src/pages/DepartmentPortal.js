import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";
const DEPARTMENTS = ["admissions", "scholarship", "internship"];

function DepartmentPortal() {
  const [selectedDept, setSelectedDept] = useState("admissions");
  const [pending, setPending] = useState([]);
  const [allDocs, setAllDocs] = useState([]);
  const [reviewData, setReviewData] = useState({});
  const [actionMsg, setActionMsg] = useState(null);

  const fetchPending = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/department/pending/${selectedDept}`);
      setPending(res.data);
    } catch {
      /* ignore */
    }
  }, [selectedDept]);

  const fetchAll = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/department/all/${selectedDept}`);
      setAllDocs(res.data);
    } catch {
      /* ignore */
    }
  }, [selectedDept]);

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
      const res = await axios.post(`${API}/department/review/${docId}`, {
        action,
        remarks: data.remarks || "",
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

  const deptLabel =
    selectedDept.charAt(0).toUpperCase() + selectedDept.slice(1);

  return (
    <div>
      <div className="portal-header department">
        <h2>Department Portal</h2>
        <p>
          Review documents auto-routed from students. Approve to forward to admin
          for final approval, or reject.
        </p>
      </div>

      {/* Department selector */}
      <div className="section-card">
        <div className="control-row">
          <label><strong>Select Department:</strong></label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="dept-select"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionMsg && (
        <div
          className={`alert ${actionMsg.type === "error" ? "alert-error" : "alert-success"}`}
        >
          {actionMsg.text}
        </div>
      )}

      {/* ── Pending Documents ── */}
      <div className="section-card">
        <h3>
          Pending for {deptLabel} Department ({pending.length})
        </h3>
        {pending.length === 0 && (
          <p className="empty-text">
            No documents pending for {deptLabel} department.
          </p>
        )}

        {pending.map((doc) => (
          <div className="review-card" key={doc.id}>
            <div className="review-header">
              <strong>{doc.originalName}</strong>
              <span className="review-time">
                Uploaded: {new Date(doc.uploadedAt).toLocaleString()}
              </span>
            </div>

            {doc.adminRemarks && (
              <p className="admin-note">
                <strong>Admin Remarks:</strong> {doc.adminRemarks}
              </p>
            )}

            {/* Show file content */}
            <div className="file-content-box">
              <strong>Document Content:</strong>
              <pre>{doc.textContent}</pre>
            </div>

            {/* Stage history so far */}
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
                  placeholder="Add department review remarks..."
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
                  Approve
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

      {/* ── All Documents for this Dept ── */}
      <div className="section-card">
        <h3>{deptLabel} — All Documents</h3>
        {allDocs.length === 0 && (
          <p className="empty-text">No documents for this department yet.</p>
        )}
        <table className="history-table">
          <thead>
            <tr>
              <th>#</th>
              <th>File</th>
              <th>Status</th>
              <th>Uploaded</th>
            </tr>
          </thead>
          <tbody>
            {allDocs.map((doc, idx) => (
              <tr key={doc.id}>
                <td>{idx + 1}</td>
                <td>{doc.originalName}</td>
                <td>
                  <span
                    className={`badge ${
                      doc.finalStatus === "approved"
                        ? "approved"
                        : doc.finalStatus === "rejected"
                        ? "rejected"
                        : "pending"
                    }`}
                  >
                    {doc.currentStatus === "pending_department"
                      ? "Pending Review"
                      : doc.finalStatus === "approved"
                      ? "Approved"
                      : "Rejected"}
                  </span>
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

export default DepartmentPortal;
