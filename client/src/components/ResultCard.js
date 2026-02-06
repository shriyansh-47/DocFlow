import React from "react";

function ResultCard({ result }) {
  const { status, message, extracted, stages, departmentRemarks } = result;

  const badgeClass =
    status === "approved"
      ? "approved"
      : status === "rejected"
      ? "rejected"
      : "error";

  return (
    <div className="result-card">
      <h2>Verdict</h2>
      <span className={`badge ${badgeClass}`}>{status}</span>
      <p className="result-message">{message}</p>

      {/* Extracted fields */}
      {extracted && Object.keys(extracted).length > 0 && (
        <div className="extracted-details">
          <h3>Extracted Details</h3>
          <div className="detail-grid">
            {extracted.name && (
              <>
                <span className="label">Name:</span>
                <span className="value">{extracted.name}</span>
              </>
            )}
            {extracted.address && (
              <>
                <span className="label">Address:</span>
                <span className="value">{extracted.address}</span>
              </>
            )}
            {extracted.dob && (
              <>
                <span className="label">Date of Birth:</span>
                <span className="value">{extracted.dob}</span>
              </>
            )}
            {extracted.phone && (
              <>
                <span className="label">Phone No:</span>
                <span className="value">{extracted.phone}</span>
              </>
            )}
            {extracted.field && (
              <>
                <span className="label">Field / Purpose:</span>
                <span className="value">{extracted.field}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Department remarks */}
      {departmentRemarks && (
        <p style={{ fontSize: "0.9rem", color: "#555", marginBottom: 12 }}>
          <strong>Department Remarks:</strong> {departmentRemarks}
        </p>
      )}

      {/* Stages timeline */}
      {stages && stages.length > 0 && (
        <div className="stages-timeline">
          <h3>Approval Stages</h3>
          {stages.map((s, i) => (
            <div className="stage-item" key={i}>
              <div className={`stage-dot ${s.status}`} />
              <div className="stage-info">
                <div className="stage-name">{s.stage}</div>
                <div className="stage-time">
                  {new Date(s.timestamp).toLocaleString()}
                </div>
                {s.remarks && (
                  <div className="stage-remarks">{s.remarks}</div>
                )}
                {s.missing && s.missing.length > 0 && (
                  <div className="stage-remarks">
                    Missing: {s.missing.join(", ")}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResultCard;
