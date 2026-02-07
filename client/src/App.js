import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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

        <nav className="nav-bar">
          <Link to="/" className="nav-link">Student Portal</Link>
          <Link to="/department" className="nav-link">Department Portal</Link>
          <Link to="/admin" className="nav-link">Admin Portal</Link>
        </nav>

        <Routes>
          <Route path="/" element={<StudentPortal />} />
          <Route path="/admin" element={<AdminPortal />} />
          <Route path="/department" element={<DepartmentPortal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
