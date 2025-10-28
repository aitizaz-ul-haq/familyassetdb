"use client";

import { useState } from "react";

export default function AddDocumentForm({ assets }) {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    fileUrl: "",
    docType: "ownership",
    fileType: "pdf",
    issuedBy: "",
    issueDate: "",
    notes: "",
    isCritical: false,
  });
  const [loading, setLoading] = useState(false);

  const filteredAssets = assets.filter(asset => 
    asset.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAsset) {
      alert("Please select an asset first");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          assetId: selectedAsset._id,
        }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to add document");
      }
    } catch (error) {
      alert("Error adding document");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button onClick={() => setShowForm(true)} style={{ marginBottom: "1rem" }}>
        + Add Document
      </button>
    );
  }

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      <h2>Add Document to Asset</h2>

      {!selectedAsset ? (
        <div style={{ marginTop: "1rem" }}>
          <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Step 1: Search & Select Asset</h3>
          <input
            type="text"
            placeholder="Search asset by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          
          <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "4px" }}>
            {filteredAssets.length === 0 ? (
              <div style={{ padding: "1rem", color: "#666" }}>No assets found</div>
            ) : (
              filteredAssets.map((asset) => (
                <div
                  key={asset._id}
                  onClick={() => setSelectedAsset(asset)}
                  style={{
                    padding: "0.75rem 1rem",
                    borderBottom: "1px solid #eee",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f5f5f5"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "white"}
                >
                  {asset.title}
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowForm(false)}
            style={{ marginTop: "1rem", background: "#ef5350", width: "auto", padding: "0.5rem 1.5rem" }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <div style={{ padding: "1rem", background: "#e8f5e9", borderRadius: "4px", marginBottom: "1.5rem" }}>
            <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Selected Asset:</div>
            <div>{selectedAsset.title}</div>
            <button
              type="button"
              onClick={() => setSelectedAsset(null)}
              style={{ 
                marginTop: "0.5rem",
                background: "transparent",
                color: "#7FC6A4",
                border: "1px solid #7FC6A4",
                padding: "0.25rem 0.75rem",
                fontSize: "0.85rem",
                width: "auto"
              }}
            >
              Change Asset
            </button>
          </div>

          <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Step 2: Add Document Details</h3>

          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="label">Document Label *</label>
              <input
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                required
                placeholder="e.g., Registry Deed, Tax Receipt 2025, Site Photos"
              />
            </div>

            <div style={{ padding: "1rem", background: "#e3f2fd", borderRadius: "4px" }}>
              <h4 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>📤 How to Upload Files:</h4>
              <ol style={{ paddingLeft: "1.5rem", lineHeight: "1.8" }}>
                <li>
                  <strong>For Images (JPG/PNG):</strong> Upload to{" "}
                  <a href="https://imgbb.com" target="_blank" style={{ color: "#2196F3" }}>ImgBB.com</a>{" "}
                  (free, no account needed)
                </li>
                <li>
                  <strong>For PDFs:</strong> Upload to Google Drive, set sharing to "Anyone with link can view", copy link
                </li>
                <li>Paste the shareable link below</li>
              </ol>
            </div>

            <div>
              <label className="label">File URL / Link *</label>
              <input
                type="url"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                required
                placeholder="https://i.ibb.co/... or https://drive.google.com/..."
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Document Type</label>
                <select
                  value={formData.docType}
                  onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                >
                  <option value="ownership">Ownership</option>
                  <option value="mutation">Mutation</option>
                  <option value="tax">Tax</option>
                  <option value="map">Map</option>
                  <option value="legal">Legal</option>
                  <option value="photo">Photo</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">File Type</label>
                <select
                  value={formData.fileType}
                  onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                >
                  <option value="pdf">PDF</option>
                  <option value="jpeg">JPEG</option>
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                  <option value="doc">DOC</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Issued By</label>
                <input
                  value={formData.issuedBy}
                  onChange={(e) => setFormData({ ...formData, issuedBy: e.target.value })}
                  placeholder="e.g., Islamabad Registrar Office"
                />
              </div>
              <div>
                <label className="label">Issue Date</label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="2"
                placeholder="Any additional notes about this document"
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={formData.isCritical}
                onChange={(e) => setFormData({ ...formData, isCritical: e.target.checked })}
                style={{ width: "auto" }}
              />
              <label>Mark as Critical Document</label>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <button
                type="submit"
                disabled={loading}
                style={{ width: "auto", padding: "0.5rem 1.5rem" }}
              >
                {loading ? "Attaching..." : "Attach Document to Asset"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedAsset(null);
                }}
                style={{ width: "auto", padding: "0.5rem 1.5rem", background: "#ef5350" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
