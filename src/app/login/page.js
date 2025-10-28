"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-login login-text">
      {/* Top-left heading and description */}
      <div className="login-info">
        <h1>Family Asset Data Base</h1>
        <p>A collection of all mutually owned properties for management and memory</p>
      </div>

      {/* Centered auth form - transparent background */}
      <div className="card auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Username or Email"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          {error && <div style={{ color: "#c62828", marginBottom: "0.75rem" }}>{error}</div>}
          <button type="submit" disabled={loading} className="btn-block">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <a href="#" className="link-black">Forgot password?</a>
      </div>
    </div>
  );
}