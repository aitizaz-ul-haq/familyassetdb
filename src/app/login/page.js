"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: forgotUsername }),
      });

      const data = await res.json();

      if (res.ok) {
        setForgotMessage("Password reset request sent to administrator. You will be contacted shortly.");
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotUsername("");
          setForgotMessage("");
        }, 3000);
      } else {
        setForgotMessage(data.error || "Failed to send request");
      }
    } catch {
      setForgotMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f7fa", // Same as dashboard background
      padding: "1rem"
    }}>
      <div style={{
        background: "white",
        padding: "2.5rem",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h1 style={{
          textAlign: "center",
          marginBottom: "0.5rem",
          color: "#2c3e50",
          fontSize: "1.4rem", // Reduced font size
          whiteSpace: "nowrap"
        }}>
          🏢 Family Asset Registry
        </h1>
        <p style={{
          textAlign: "center",
          color: "#6D7692",
          marginBottom: "2rem",
          fontSize: "0.95rem"
        }}>
          Sign in to access your dashboard
        </p>
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
        <a 
          href="#" 
          className="link-black"
          onClick={(e) => {
            e.preventDefault();
            setShowForgotPassword(true);
          }}
        >
          Forgot password?
        </a>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "grid",
          placeItems: "center",
          zIndex: 1000,
        }}>
          <div className="card" style={{ maxWidth: 400, width: "90%", background: "white" }}>
            <h2>Forgot Password</h2>
            <p style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "#666" }}>
              Enter your username. The administrator will be notified to reset your password.
            </p>
            <form onSubmit={handleForgotPassword}>
              <div className="form-group">
                <input
                  type="text"
                  value={forgotUsername}
                  onChange={(e) => setForgotUsername(e.target.value)}
                  required
                  placeholder="Username"
                />
              </div>
              {forgotMessage && (
                <div style={{ 
                  color: forgotMessage.includes("sent") ? "#2e7d32" : "#c62828", 
                  marginBottom: "0.75rem",
                  fontSize: "0.9rem"
                }}>
                  {forgotMessage}
                </div>
              )}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Request"}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotUsername("");
                    setForgotMessage("");
                  }}
                  style={{ background: "#999" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}