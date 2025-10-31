"use client";

import { useState } from "react";

export default function AddPersonForm() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    fatherName: "",
    cnic: "",
    relationToFamily: "",
    status: "alive",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/people", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to add person");
      }
    } catch (error) {
      alert("Error adding person");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        style={{ marginBottom: "1rem" }}
      >
        + Add Person
      </button>
    );
  }

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      <h2>Add New Person</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          <div>
            <label>Full Name *</label>
            <input
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label>Father's Name</label>
            <input
              value={formData.fatherName}
              onChange={(e) =>
                setFormData({ ...formData, fatherName: e.target.value })
              }
            />
          </div>

          <div>
            <label>CNIC</label>
            <input
              value={formData.cnic}
              onChange={(e) =>
                setFormData({ ...formData, cnic: e.target.value })
              }
              placeholder="12345-1234567-1"
            />
          </div>

          <div>
            <label>Relation to Family</label>
            <input
              value={formData.relationToFamily}
              onChange={(e) =>
                setFormData({ ...formData, relationToFamily: e.target.value })
              }
              placeholder="e.g., father, sister, uncle"
            />
          </div>

          <div>
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="alive">Alive</option>
              <option value="deceased">Deceased</option>
            </select>
          </div>

          <div>
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows="3"
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Person"}
            </button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
