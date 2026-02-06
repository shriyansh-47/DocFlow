import React, { useRef } from "react";

function UploadForm({ onUpload, loading }) {
  const inputRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = inputRef.current.files[0];
    if (!file) return alert("Please select a file first.");
    onUpload(file);
  };

  return (
    <div className="upload-section">
      <h2>Upload Document</h2>
      <form onSubmit={handleSubmit}>
        <div className="file-input-wrapper">
          <input
            type="file"
            ref={inputRef}
            accept=".txt,.pdf"
            disabled={loading}
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Processing…" : "Submit"}
          </button>
        </div>
      </form>
      <p className="info-text">
        Accepted formats: <strong>.txt</strong>, <strong>.pdf</strong> &nbsp;|&nbsp;
        Max size: <strong>2 MB</strong>
        <br />
        The document must include: <em>Name, Address, DOB, Phone Number, Field/Purpose</em>
      </p>
    </div>
  );
}

export default UploadForm;
