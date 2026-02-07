import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import UploadForm from "../components/UploadForm";

const API = "http://localhost:5000/api";

function StudentPortal({ token }) {
  const [uploadMsg, setUploadMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchDocs = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/documents`, authHeaders);
      setDocuments(res.data);
    } catch {
      /* ignore */
    }
  }, [token]);

  useEffect(() => {
    fetchDocs();
    const interval = setInterval(fetchDocs, 5000); // poll every 5s for status updates
    return () => clearInterval(interval);
  }, [fetchDocs]);

  const handleUpload = async (file) => {
    setLoading(true);
    setUploadMsg(null);
    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await axios.post(`${API}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      });
      if (res.data.status === "rejected") {
        setUploadMsg({ status: "error", message: "Please upload Valid Document !!" });
      } else {
        setUploadMsg(res.data);
      }
      fetchDocs();
    } catch (err) {
      setUploadMsg({
        status: "error",
        message: err.response?.data?.message || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const hasFinalized = documents.some(
    (d) => d.finalStatus === "approved" || d.finalStatus === "rejected"
  );

  const clearHistory = async () => {
    try {
      const res = await axios.delete(`${API}/documents/clear`, authHeaders);
      setUploadMsg({ status: "success", message: res.data.message });
      fetchDocs();
    } catch (err) {
      setUploadMsg({
        status: "error",
        message: err.response?.data?.message || err.message,
      });
    }
  };

  const clearSingle = async (docId) => {
    try {
      await axios.delete(`${API}/documents/${docId}`, authHeaders);
      fetchDocs();
    } catch (err) {
      setUploadMsg({
        status: "error",
        message: err.response?.data?.message || err.message,
      });
    }
  };

  const statusLabel = (doc) => {
    if (doc.currentStatus === "pending_department")
      return `Pending ${capitalize(doc.department)} Dept. Review`;
    if (doc.currentStatus === "pending_admin")
      return "Dept. Approved — Pending Admin Final Review";
    if (doc.finalStatus === "approved") return "Fully Approved";
    if (doc.finalStatus === "rejected") return "Rejected";
    return doc.currentStatus;
  };

  const statusClass = (doc) => {
    if (doc.finalStatus === "approved") return "approved";
    if (doc.finalStatus === "rejected") return "rejected";
    return "pending";
  };

  return (
    <div>
      <div className="portal-header student">
        <h2>Student Portal</h2>
        <p>Upload your document and track its approval status in real-time.</p>
      </div>

      <UploadForm onUpload={handleUpload} loading={loading} />

      {uploadMsg && (
        <div className={`alert ${uploadMsg.status === "error" ? "alert-error" : "alert-success"}`}>
          {uploadMsg.message}
        </div>
      )}

      {documents.length > 0 && (
        <div className="section-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>My Documents</h3>
            {hasFinalized && (
              <button
                className="btn btn-clear"
                onClick={clearHistory}
                title="Clear all finalized documents from history"
              >
                Clear Completed History
              </button>
            )}
          </div>
          <table className="history-table">
            <thead>
              <tr>
                <th>#</th>
                <th>File</th>
                <th>Status</th>
                <th>Department</th>
                <th>Uploaded</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, idx) => (
                <tr key={doc.id}>
                  <td>{idx + 1}</td>
                  <td>{doc.originalName}</td>
                  <td>
                    <span className={`badge ${statusClass(doc)}`}>
                      {statusLabel(doc)}
                    </span>
                  </td>
                  <td style={{ textTransform: "capitalize" }}>
                    {doc.department || "—"}
                  </td>
                  <td>{new Date(doc.uploadedAt).toLocaleString()}</td>
                  <td>
                    {(doc.finalStatus === "approved" || doc.finalStatus === "rejected") && (
                      <button
                        className="btn btn-clear-small"
                        onClick={() => clearSingle(doc.id)}
                        title="Remove from history"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Expanded details for each document */}
          {documents.map((doc) => (
            <div key={doc.id} className="doc-detail-card">
              <h4>{doc.originalName}</h4>

              {doc.finalMessage && (
                <p className={`final-message ${statusClass(doc)}`}>
                  {doc.finalMessage}
                </p>
              )}

              {/* Stage timeline */}
              {doc.stages && doc.stages.length > 0 && (
                <div className="stages-timeline">
                  <strong>Approval Timeline:</strong>
                  {doc.stages.map((s, i) => (
                    <div className="stage-item" key={i}>
                      <div className={`stage-dot ${s.status}`} />
                      <div className="stage-info">
                        <span className="stage-name">{s.stage}</span>
                        <span className="stage-time">
                          {" "}
                          — {new Date(s.timestamp).toLocaleString()}
                        </span>
                        {s.remarks && (
                          <div className="stage-remarks">{s.remarks}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function capitalize(s) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default StudentPortal;
