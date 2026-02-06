import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StudentPortal from "./pages/StudentPortal";
import AdminPortal from "./pages/AdminPortal";
import DepartmentPortal from "./pages/DepartmentPortal";

function App() {
  return (
    <Router>
      <div className="app">
        <h1>DocFlow</h1>
        <p className="subtitle">Smart Document Approval &amp; Tracking System</p>

        <nav className="nav-bar">
          <Link to="/" className="nav-link">Student Portal</Link>
          <Link to="/admin" className="nav-link">Admin Portal</Link>
          <Link to="/department" className="nav-link">Department Portal</Link>
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
