import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentPortal from "./pages/StudentPortal";
import AdminPortal from "./pages/AdminPortal";
import DepartmentPortal from "./pages/DepartmentPortal";

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <Router>
      <div className="app">
        <div className="top-bar">
          <div>
            <h1>DocFlow</h1>
            <p className="subtitle">Smart Document Approval &amp; Tracking System</p>
          </div>
          <button className="theme-toggle" onClick={() => setDark((d) => !d)} title="Toggle theme">
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <Routes>
          <Route path="/" element={<StudentPortal />} />
          <Route path="/portal/ax7admin9k" element={<AdminPortal />} />
          <Route path="/portal/dr3dept8m" element={<DepartmentPortal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
