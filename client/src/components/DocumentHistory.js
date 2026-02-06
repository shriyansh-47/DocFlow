import React from "react";

function DocumentHistory({ documents }) {
  if (!documents || documents.length === 0) return null;

  return (
    <div className="history-section">
      <h2>Document History</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>#</th>
            <th>File</th>
            <th>Department</th>
            <th>Status</th>
            <th>Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, idx) => (
            <tr key={doc.id}>
              <td>{idx + 1}</td>
              <td>{doc.originalName}</td>
              <td style={{ textTransform: "capitalize" }}>
                {doc.department || "—"}
              </td>
              <td>
                <span
                  className={`badge ${
                    doc.finalStatus === "approved" ? "approved" : "rejected"
                  }`}
                >
                  {doc.finalStatus}
                </span>
              </td>
              <td>{new Date(doc.uploadedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DocumentHistory;
