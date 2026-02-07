import React, { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import StudentPortal from "./pages/StudentPortal";
import AdminPortal from "./pages/AdminPortal";
import DepartmentPortal from "./pages/DepartmentPortal";

function App() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [token, setToken] = useState(() => localStorage.getItem("docflow_token"));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("docflow_user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    document.body.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("docflow_token", newToken);
    localStorage.setItem("docflow_user", JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("docflow_token");
    localStorage.removeItem("docflow_user");
  };

  const portalLabel = () => {
    if (!user) return "";
    if (user.role === "student") return "Student Portal";
    if (user.role === "admin") return "Admin Portal";
    if (user.role === "department") {
      const dept = user.department
        ? user.department.charAt(0).toUpperCase() + user.department.slice(1)
        : "Department";
      return `${dept} Department Portal`;
    }
    return "";
  };

  const renderPortal = () => {
    if (!user) return null;
    if (user.role === "student") return <StudentPortal token={token} />;
    if (user.role === "admin") return <AdminPortal token={token} />;
    if (user.role === "department") return <DepartmentPortal token={token} user={user} />;
    return <p>Unknown role.</p>;
  };

  return (
    <div className="app">
      <div className="top-bar">
        <div>
          <h1>DocFlow</h1>
          <p className="subtitle">
            {token && user ? portalLabel() : "Smart Document Approval & Tracking System"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="theme-toggle" onClick={() => setDark((d) => !d)} title="Toggle theme">
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          {token && user && (
            <button
              className="btn btn-reject"
              onClick={handleLogout}
              style={{ padding: "6px 16px", fontSize: "0.82rem" }}
            >
              Logout ({user.username})
            </button>
          )}
        </div>
      </div>

      {!token || !user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        renderPortal()
      )}
    </div>
  );
}

export default App;
