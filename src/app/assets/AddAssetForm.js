"use client";

import { useState, useEffect } from "react";

export default function AddAssetForm() {
  const [showForm, setShowForm] = useState(false);
  const [people, setPeople] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    assetType: "land_plot",
    description: "",
    city: "",
    areaOrSector: "",
    currentStatus: "clean",
    owners: [{ personId: "", percentage: 100 }],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showForm) {
      fetch("/api/people")
        .then((res) => res.json())
        .then((data) => setPeople(data));
    }
  }, [showForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        location: {
          city: formData.city,
          areaOrSector: formData.areaOrSector,
        },
      };

      const response = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to add asset");
      }
    } catch (error) {
      alert("Error adding asset");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button onClick={() => setShowForm(true)} style={{ marginBottom: "1rem" }}>
        + Add Asset
      </button>
    );
  }

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      <h2>Add New Asset</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          <div>
            <label>Title *</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label>Asset Type *</label>
            <select
              value={formData.assetType}
              onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
            >
              <option value="land_plot">Land Plot</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="vehicle">Vehicle</option>
              <option value="business_share">Business Share</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label>City</label>
              <input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label>Area/Sector</label>
              <input
                value={formData.areaOrSector}
                onChange={(e) => setFormData({ ...formData, areaOrSector: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label>Status</label>
            <select
              value={formData.currentStatus}
              onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
            >
              <option value="clean">Clean</option>
              <option value="in_dispute">In Dispute</option>
              <option value="under_transfer">Under Transfer</option>
              <option value="sold_but_not_cleared">Sold But Not Cleared</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label>Owner *</label>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.5rem" }}>
              <select
                value={formData.owners[0].personId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    owners: [{ ...formData.owners[0], personId: e.target.value }],
                  })
                }
                required
              >
                <option value="">Select person</option>
                {people.map((person) => (
                  <option key={person._id} value={person._id}>
                    {person.fullName}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Percentage"
                value={formData.owners[0].percentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    owners: [{ ...formData.owners[0], percentage: Number(e.target.value) }],
                  })
                }
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Asset"}
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