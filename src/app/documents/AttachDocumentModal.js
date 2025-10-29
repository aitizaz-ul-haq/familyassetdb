"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AttachDocumentModal({ onClose }) {
  const router = useRouter();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    assetId: "",
    documentLabel: "",
    documentUrl: "",
    docType: "ownership",
    notes: ""
  });

  // Fetch all assets
  useEffect(() => {
    fetch("/api/assets")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched assets for dropdown:", data.length);
        setAssets(data);
      })
      .catch(err => {
        console.error("Error fetching assets:", err);
        setError("Failed to load assets");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.assetId || !formData.documentLabel || !formData.documentUrl) {
      setError("Please fill in all required fields (Asset, Document Name, URL)");
      return;
    }

    setLoading(true);
    console.log("Submitting document attachment:", formData);

    try {
      const response = await fetch("/api/documents/attach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: formData.assetId,
          document: {
            label: formData.documentLabel,
            fileUrl: formData.documentUrl,
            docType: formData.docType,
            notes: formData.notes
          }
        })
      });

      const result = await response.json();
      console.log("Server response:", result);

      if (response.ok) {
        alert(`✅ Document "${formData.documentLabel}" attached successfully to "${result.assetTitle}"!`);
        router.refresh();
        onClose();
      } else {
        setError(result.error || "Failed to attach document");
        console.error("Server error:", result);
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Network error: " + error.message);
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
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem"
    }}>
      <div style={{
        background: "white",
        borderRadius: "8px",
        maxWidth: "600px",
        width: "100%",
        padding: "2rem",
        maxHeight: "90vh",
        overflowY: "auto"
      }}>
        <h2 style={{ marginTop: 0, color: "#6D7692" }}>📎 Attach Document to Asset</h2>
        
        {error && (
          <div style={{
            padding: "1rem",
            background: "#ffebee",
            color: "#c62828",
            borderRadius: "4px",
            marginBottom: "1rem",
            fontSize: "0.9rem"
          }}>
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {/* Select Asset */}
            <div>
              <label className="label">Select Asset *</label>
              <select
                value={formData.assetId}
                onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                required
                style={{ border: "1px solid #7FC6A4", width: "100%", padding: "0.75rem" }}
              >
                <option value="">-- Choose an asset --</option>
                {assets.map(asset => (
                  <option key={asset._id} value={asset._id}>
                    {asset.title} ({asset.assetType?.replace(/_/g, " ")})
                  </option>
                ))}
              </select>
              <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.25rem" }}>
                {assets.length} assets available
              </p>
            </div>

            {/* Document Label */}
            <div>
              <label className="label">Document Name/Label *</label>
              <input
                type="text"
                value={formData.documentLabel}
                onChange={(e) => setFormData({ ...formData, documentLabel: e.target.value })}
                placeholder="e.g., Registry Deed, Sale Agreement, Property Photo"
                required
                style={{ border: "1px solid #7FC6A4", width: "100%", padding: "0.75rem" }}
              />
            </div>

            {/* Document URL */}
            <div>
              <label className="label">Document URL (Google Drive / Imgur) *</label>
              <input
                type="url"
                value={formData.documentUrl}
                onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
                placeholder="https://drive.google.com/file/d/..."
                required
                style={{ border: "1px solid #7FC6A4", width: "100%", padding: "0.75rem" }}
              />
              <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.25rem" }}>
                ✓ Upload to Google Drive or Imgur<br/>
                ✓ Set sharing to "Anyone with link can view"<br/>
                ✓ Paste the share link here
              </p>
            </div>

            {/* Document Type */}
            <div>
              <label className="label">Document Type</label>
              <select
                value={formData.docType}
                onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                style={{ border: "1px solid #7FC6A4", width: "100%", padding: "0.75rem" }}
              >
                <option value="ownership">Ownership Document</option>
                <option value="mutation">Mutation Document</option>
                <option value="tax">Tax Document</option>
                <option value="map">Map/Survey</option>
                <option value="legal">Legal Document</option>
                <option value="photo">Photo</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="label">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes about this document..."
                rows={3}
                style={{ border: "1px solid #7FC6A4", width: "100%", padding: "0.75rem" }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: "0.75rem",
                background: loading ? "#ccc" : "#7FC6A4",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "1rem",
                fontWeight: "500"
              }}
            >
              {loading ? "Saving..." : "📎 Attach Document"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: "0.75rem",
                background: "#ef5350",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "1rem"
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
