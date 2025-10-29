"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DocumentsTable({ assets, initialSearch, userRole }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [viewingAsset, setViewingAsset] = useState(null);
  const [deletingDocId, setDeletingDocId] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (trimmed) {
      router.push(`/documents?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/documents');
    }
    router.refresh(); // Force refresh to re-fetch data
  };

  const clearSearch = () => {
    setSearchTerm("");
    router.push('/documents');
    router.refresh();
  };

  const handleDeleteDocument = async (assetId, docIndex) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    setDeletingDocId(docIndex);

    try {
      const response = await fetch("/api/documents/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: assetId,
          docIndex: docIndex
        })
      });

      if (response.ok) {
        alert("✅ Document deleted successfully!");
        router.refresh();
        setViewingAsset(null);
      } else {
        const result = await response.json();
        alert("❌ Failed to delete: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("❌ Network error: " + error.message);
    } finally {
      setDeletingDocId(null);
    }
  };

  return (
    <>
      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets by name... (e.g., '1 Kanal', 'Sihala', 'Village')"
            style={{
              flex: 1,
              minWidth: "250px",
              padding: "0.75rem",
              border: "1px solid #7FC6A4",
              borderRadius: "4px",
              fontSize: "0.95rem",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0.75rem 1.5rem",
              background: "#7FC6A4",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500",
              whiteSpace: "nowrap"
            }}
          >
            🔍 Search
          </button>
          {initialSearch && (
            <button
              type="button"
              onClick={clearSearch}
              style={{
                padding: "0.75rem 1rem",
                background: "#ef5350",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
                whiteSpace: "nowrap"
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>
      </form>

      {/* Results Info */}
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
          {initialSearch ? (
            <>Showing {assets.length} asset{assets.length !== 1 ? 's' : ''} matching "<strong>{initialSearch}</strong>"</>
          ) : (
            <>Total: {assets.length} asset{assets.length !== 1 ? 's' : ''} with documents</>
          )}
        </p>
      </div>

      {/* Assets Table - 2 Columns: Asset Name | Action */}
      {assets.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ 
                  padding: "0.75rem", 
                  textAlign: "left", 
                  border: "1px solid #ddd", 
                  width: "70%",
                  fontSize: "0.9rem",
                  fontWeight: "600"
                }}>
                  Asset Name
                </th>
                <th style={{ 
                  padding: "0.75rem", 
                  textAlign: "center", 
                  border: "1px solid #ddd", 
                  width: "30%",
                  fontSize: "0.9rem",
                  fontWeight: "600"
                }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ 
                    padding: "0.75rem", 
                    border: "1px solid #ddd",
                    fontSize: "0.95rem"
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      <strong style={{ color: "#333" }}>{asset.title}</strong>
                      <span style={{ fontSize: "0.8rem", color: "#666" }}>
                        📎 {asset.documentCount} document{asset.documentCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </td>
                  <td style={{ 
                    padding: "0.75rem", 
                    border: "1px solid #ddd",
                    textAlign: "center"
                  }}>
                    <button
                      onClick={() => setViewingAsset(asset)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#2196F3",
                        color: "white",
                        borderRadius: "4px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                        whiteSpace: "nowrap"
                      }}
                    >
                      👁️ View Docs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ 
          padding: "3rem", 
          textAlign: "center", 
          color: "#999",
          background: "#f9f9f9",
          borderRadius: "8px"
        }}>
          <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>📎 No Assets Found</p>
          <p style={{ fontSize: "0.9rem" }}>
            {initialSearch 
              ? `No assets with documents matching "${initialSearch}". Try a different search term.`
              : "Use the 'Attach Document to Asset' button above to add documents to assets."}
          </p>
        </div>
      )}

      {/* View Documents Modal */}
      {viewingAsset && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.9)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem"
        }} onClick={() => setViewingAsset(null)}>
          <div style={{
            background: "white",
            borderRadius: "8px",
            maxWidth: "700px",
            width: "100%",
            padding: "2rem",
            maxHeight: "90vh",
            overflowY: "auto"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "2px solid #7FC6A4", paddingBottom: "1rem" }}>
              <h2 style={{ margin: 0, color: "#6D7692" }}>{viewingAsset.title}</h2>
              <button
                onClick={() => setViewingAsset(null)}
                style={{
                  background: "#ef5350",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                ✕ Close
              </button>
            </div>

            <h3 style={{ color: "#666", fontSize: "1rem", marginBottom: "1rem" }}>
              📎 Documents ({viewingAsset.documentCount})
            </h3>

            {viewingAsset.documents.length === 0 ? (
              <p style={{ color: "#999", textAlign: "center", padding: "2rem" }}>
                No documents attached yet.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {viewingAsset.documents.map((doc, idx) => (
                  <div key={idx} style={{
                    padding: "1rem",
                    background: "#f9f9f9",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem"
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#333", marginBottom: "0.25rem" }}>
                        {doc.label}
                      </h4>
                      {doc.docType && (
                        <span style={{ 
                          fontSize: "0.75rem", 
                          color: "#666",
                          background: "#e0e0e0",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "3px"
                        }}>
                          {doc.docType}
                        </span>
                      )}
                      {doc.uploadedAt && (
                        <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.75rem", color: "#999" }}>
                          Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#2196F3",
                          color: "white",
                          borderRadius: "4px",
                          textDecoration: "none",
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap",
                          fontWeight: "500"
                        }}
                      >
                        ↗ Open
                      </a>
                      
                      {/* ONLY ADMIN can delete */}
                      {userRole === "admin" && (
                        <button
                          onClick={() => handleDeleteDocument(viewingAsset._id, idx)}
                          disabled={deletingDocId === idx}
                          style={{
                            padding: "0.5rem 1rem",
                            background: deletingDocId === idx ? "#ccc" : "#ef5350",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: deletingDocId === idx ? "not-allowed" : "pointer",
                            fontSize: "0.85rem",
                            whiteSpace: "nowrap",
                            fontWeight: "500"
                          }}
                        >
                          {deletingDocId === idx ? "Deleting..." : "🗑️ Delete"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Admin Notice */}
            {userRole !== "admin" && viewingAsset.documents.length > 0 && (
              <p style={{ 
                marginTop: "1rem", 
                padding: "0.75rem", 
                background: "#fff3cd", 
                borderRadius: "4px", 
                fontSize: "0.85rem", 
                color: "#856404",
                textAlign: "center"
              }}>
                ℹ️ Only Admin can delete documents
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
