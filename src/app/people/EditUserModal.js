"use client";

import { useState } from "react";

export default function EditUserModal({ user, onClose }) {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    relationToFamily:
      user.relationToFamily === "N/A" ? "" : user.relationToFamily,
    cnic: user.cnic === "N/A" ? "" : user.cnic,
    status: user.status,
    role: user.role,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to update user");
      }
    } catch (error) {
      alert("Error updating user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "grid",
        placeItems: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem", color: "#6D7692" }}>Edit User</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
              style={{ border: "1px solid #7FC6A4" }}
            />
          </div>

          <div className="form-group">
            <label className="label">Username/Email</label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              style={{ border: "1px solid #7FC6A4" }}
            />
          </div>

          <div className="form-group">
            <label className="label">Relation to Family</label>
            <input
              type="text"
              value={formData.relationToFamily}
              onChange={(e) =>
                setFormData({ ...formData, relationToFamily: e.target.value })
              }
              placeholder="e.g., father, son, daughter"
              style={{ border: "1px solid #7FC6A4" }}
            />
          </div>

          <div className="form-group">
            <label className="label">CNIC</label>
            <input
              type="text"
              value={formData.cnic}
              onChange={(e) =>
                setFormData({ ...formData, cnic: e.target.value })
              }
              placeholder="12345-1234567-1"
              style={{ border: "1px solid #7FC6A4" }}
            />
          </div>

          <div className="form-group">
            <label className="label">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              style={{ border: "1px solid #7FC6A4" }}
            >
              <option value="alive">Alive</option>
              <option value="deceased">Deceased</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              style={{ border: "1px solid #7FC6A4" }}
            >
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                background: "#7FC6A4",
              }}
            >
              {loading ? "Saving..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                background: "#ef5350",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
