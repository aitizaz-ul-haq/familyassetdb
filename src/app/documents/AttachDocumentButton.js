"use client";

import { useState } from "react";
import AttachDocumentModal from "./AttachDocumentModal";

export default function AttachDocumentButton({ userRole }) {
  const [showModal, setShowModal] = useState(false);

  // Only admin can attach documents
  if (userRole !== "admin") {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: "0.75rem 1.5rem",
          background: "#7FC6A4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.95rem",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}
      >
        <span>📎</span>
        Attach Document to Asset
      </button>

      {showModal && <AttachDocumentModal onClose={() => setShowModal(false)} />}
    </>
  );
}
