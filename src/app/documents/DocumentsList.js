"use client";

import { useState } from "react";
import Link from "next/link";
import DocumentViewer from "./DocumentViewer";

export default function DocumentsList({ documents }) {
  const [viewingDoc, setViewingDoc] = useState(null);

  return (
    <>
      <div className="card">
        {documents.length === 0 ? (
          <p>
            No documents uploaded yet. Add documents to assets to see them here.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table-sm table-nowrap">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Format</th>
                  <th>Asset</th>
                  <th>Notes</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      {doc.isCritical && (
                        <span
                          style={{ color: "#d32f2f", marginRight: "0.5rem" }}
                        >
                          ⚠️
                        </span>
                      )}
                      {doc.label}
                    </td>
                    <td>{doc.docType}</td>
                    <td>
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          background: "#f5f5f5",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          textTransform: "uppercase",
                        }}
                      >
                        {doc.fileType}
                      </span>
                    </td>
                    <td>
                      <Link href={`/assets/${doc.assetId}`}>
                        {doc.assetTitle}
                      </Link>
                    </td>
                    <td>{doc.notes || "N/A"}</td>
                    <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => setViewingDoc(doc)}
                          style={{
                            padding: "0.25rem 0.75rem",
                            background: "#7FC6A4",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                          }}
                        >
                          View
                        </button>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: "0.25rem 0.75rem",
                            background: "#2196F3",
                            color: "white",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                            textDecoration: "none",
                            display: "inline-block",
                          }}
                        >
                          Original
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewingDoc && (
        <DocumentViewer
          fileUrl={viewingDoc.fileUrl}
          fileType={viewingDoc.fileType}
          label={viewingDoc.label}
        />
      )}
    </>
  );
}
