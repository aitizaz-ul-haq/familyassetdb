"use client";

import { useState, useEffect } from "react";

export default function PlotAssetEditForm({ asset, onClose }) {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Pre-fill ALL form data
  const [formData, setFormData] = useState({
    title: asset.title || "",
    nickname: asset.nickname || "",
    description: asset.description || "",
    currentStatus: asset.currentStatus || "clean",
    landUseType: asset.landUseType || "residential",
    possessionStatus: asset.possessionStatus || "in_our_possession",
    location: {
      city: asset.location?.city || "",
      district: asset.location?.district || "",
      areaOrSector: asset.location?.areaOrSector || "",
      fullAddress: asset.location?.fullAddress || "",
    },
    dimensions: {
      totalArea: {
        value: asset.dimensions?.totalArea?.value || "",
        unit: asset.dimensions?.totalArea?.unit || "marla",
      },
      convertedAreaSqFt: asset.dimensions?.convertedAreaSqFt || "",
    },
    valuation: {
      estimatedMarketValuePKR: asset.valuation?.estimatedMarketValuePKR || "",
      estimatedDate: asset.valuation?.estimatedDate ? new Date(asset.valuation.estimatedDate).toISOString().split('T')[0] : "",
    },
    notesInternal: asset.notesInternal || "",
  });

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setPeople(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/assets/${asset._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Asset updated successfully!");
        window.location.reload();
      } else {
        alert("Failed to update asset");
      }
    } catch (error) {
      alert("Error updating asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.8)",
      zIndex: 9999,
      overflowY: "auto",
      padding: "2rem 1rem",
    }}>
      <div style={{
        background: "white",
        borderRadius: "8px",
        maxWidth: "800px",
        width: "100%",
        margin: "0 auto 4rem auto",
        padding: "2rem",
      }}>
        <h2 style={{ marginBottom: "1.5rem", color: "#6D7692" }}>Edit Plot Asset</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "2px solid #7FC6A4" }}>
            <h3 style={{ color: "#6D7692", marginBottom: "1rem" }}>Basic Information</h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <label className="label">Title *</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{ border: "2px solid #7FC6A4" }}
                />
              </div>
              <div>
                <label className="label">Nickname</label>
                <input
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  style={{ border: "2px solid #7FC6A4" }}
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  style={{ border: "2px solid #7FC6A4" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Land Use Type</label>
                  <select
                    value={formData.landUseType}
                    onChange={(e) => setFormData({ ...formData, landUseType: e.target.value })}
                    style={{ border: "2px solid #7FC6A4" }}
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="agricultural">Agricultural</option>
                    <option value="industrial">Industrial</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="label">Current Status</label>
                  <select
                    value={formData.currentStatus}
                    onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                    style={{ border: "2px solid #7FC6A4" }}
                  >
                    <option value="clean">Clean</option>
                    <option value="in_dispute">In Dispute</option>
                    <option value="under_transfer">Under Transfer</option>
                    <option value="sold_but_not_cleared">Sold But Not Cleared</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "2px solid #7FC6A4" }}>
            <h3 style={{ color: "#6D7692", marginBottom: "1rem" }}>Location</h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">City</label>
                  <input
                    value={formData.location.city}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value }})}
                    style={{ border: "2px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">District</label>
                  <input
                    value={formData.location.district}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, district: e.target.value }})}
                    style={{ border: "2px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div>
                <label className="label">Area/Sector</label>
                <input
                  value={formData.location.areaOrSector}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, areaOrSector: e.target.value }})}
                  style={{ border: "2px solid #7FC6A4" }}
                />
              </div>
              <div>
                <label className="label">Full Address</label>
                <textarea
                  value={formData.location.fullAddress}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, fullAddress: e.target.value }})}
                  rows="2"
                  style={{ border: "2px solid #7FC6A4" }}
                />
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "2px solid #7FC6A4" }}>
            <h3 style={{ color: "#6D7692", marginBottom: "1rem" }}>Dimensions</h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Total Area</label>
                  <input
                    type="number"
                    value={formData.dimensions.totalArea.value}
                    onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, totalArea: { ...formData.dimensions.totalArea, value: e.target.value }}})}
                    style={{ border: "2px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">Unit</label>
                  <select
                    value={formData.dimensions.totalArea.unit}
                    onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, totalArea: { ...formData.dimensions.totalArea, unit: e.target.value }}})}
                    style={{ border: "2px solid #7FC6A4" }}
                  >
                    <option value="marla">Marla</option>
                    <option value="kanal">Kanal</option>
                    <option value="acre">Acre</option>
                    <option value="sqft">Sq Ft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Converted Area (Sq Ft)</label>
                <input
                  type="number"
                  value={formData.dimensions.convertedAreaSqFt}
                  onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, convertedAreaSqFt: e.target.value }})}
                  style={{ border: "2px solid #7FC6A4" }}
                />
              </div>
            </div>
          </div>

          {/* Valuation */}
          <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "2px solid #7FC6A4" }}>
            <h3 style={{ color: "#6D7692", marginBottom: "1rem" }}>Valuation</h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Estimated Market Value (PKR)</label>
                  <input
                    type="number"
                    value={formData.valuation.estimatedMarketValuePKR}
                    onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, estimatedMarketValuePKR: e.target.value }})}
                    style={{ border: "2px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">Estimated Date</label>
                  <input
                    type="date"
                    value={formData.valuation.estimatedDate}
                    onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, estimatedDate: e.target.value }})}
                    style={{ border: "2px solid #7FC6A4" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", marginBottom: "1rem" }}>Internal Notes</h3>
            <textarea
              value={formData.notesInternal}
              onChange={(e) => setFormData({ ...formData, notesInternal: e.target.value })}
              rows="3"
              style={{ border: "2px solid #7FC6A4", width: "100%" }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", paddingTop: "1rem", borderTop: "2px solid #ddd" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "0.75rem 2rem",
                background: "#ef5350",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0.75rem 2rem",
                background: "#7FC6A4",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
