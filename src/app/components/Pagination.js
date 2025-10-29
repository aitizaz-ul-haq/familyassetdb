"use client";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  
  // Always show first page
  pages.push(1);
  
  // Show pages around current page
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    pages.push(i);
  }
  
  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }
  
  // Remove duplicates and sort
  const uniquePages = [...new Set(pages)].sort((a, b) => a - b);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "0.5rem",
      marginTop: "2rem",
      flexWrap: "wrap"
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: "0.5rem 1rem",
          background: currentPage === 1 ? "#ccc" : "#7FC6A4",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          fontWeight: "600",
          fontSize: "0.9rem"
        }}
      >
        ← Previous
      </button>

      {uniquePages.map((page, idx) => {
        // Show ellipsis if gap
        const showEllipsisBefore = idx > 0 && uniquePages[idx - 1] !== page - 1;
        
        return (
          <div key={page} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {showEllipsisBefore && <span style={{ color: "#666" }}>...</span>}
            <button
              onClick={() => onPageChange(page)}
              style={{
                padding: "0.5rem 0.75rem",
                background: currentPage === page ? "#667eea" : "white",
                color: currentPage === page ? "white" : "#333",
                border: `2px solid ${currentPage === page ? "#667eea" : "#ddd"}`,
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: currentPage === page ? "700" : "500",
                fontSize: "0.9rem",
                minWidth: "40px"
              }}
            >
              {page}
            </button>
          </div>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: "0.5rem 1rem",
          background: currentPage === totalPages ? "#ccc" : "#7FC6A4",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          fontWeight: "600",
          fontSize: "0.9rem"
        }}
      >
        Next →
      </button>

      <span style={{
        marginLeft: "1rem",
        color: "#666",
        fontSize: "0.9rem"
      }}>
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
}
