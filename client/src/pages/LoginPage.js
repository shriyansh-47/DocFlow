import React, { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/login`, { username, password });
      if (res.data.success) {
        onLogin(res.data.token, res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="section-card" style={{ maxWidth: 420, width: "100%", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h2 style={{ marginBottom: 4 }}>Welcome to DocFlow</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            Sign in with your credentials to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoFocus
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid var(--border, #ccc)",
                fontSize: "0.95rem",
                background: "var(--card-bg, #fff)",
                color: "var(--text, #222)",
              }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 6,
                border: "1px solid var(--border, #ccc)",
                fontSize: "0.95rem",
                background: "var(--card-bg, #fff)",
                color: "var(--text, #222)",
              }}
            />
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: 14 }}>
              {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: "10px 0", fontSize: "1rem" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
