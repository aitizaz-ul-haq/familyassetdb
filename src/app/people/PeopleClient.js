"use client";

import { useState } from "react";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 6;

export default function PeopleClient({ people, userRole }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter people
  const filteredPeople = people.filter((person) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      person.fullName?.toLowerCase().includes(query) ||
      person.relationToFamily?.toLowerCase().includes(query) ||
      person.cnic?.toLowerCase().includes(query)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredPeople.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPeople = filteredPeople.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Search Bar */}
      <div style={{ marginBottom: "1.5rem" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search by name, relation, or CNIC..."
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "2px solid #7FC6A4",
            borderRadius: "6px",
            fontSize: "0.95rem",
          }}
        />
      </div>

      {/* Results Count */}
      <p style={{ marginBottom: "1rem", color: "#666", fontSize: "0.9rem" }}>
        Showing {paginatedPeople.length} of {filteredPeople.length} people
      </p>

      {/* People Table */}
      {filteredPeople.length > 0 ? (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      border: "1px solid #ddd",
                    }}
                  >
                    Full Name
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      border: "1px solid #ddd",
                    }}
                  >
                    Relation
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      border: "1px solid #ddd",
                    }}
                  >
                    CNIC
                  </th>
                  <th
                    style={{
                      padding: "0.75rem",
                      textAlign: "left",
                      border: "1px solid #ddd",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedPeople.map((person) => (
                  <tr key={person._id}>
                    <td
                      style={{ padding: "0.75rem", border: "1px solid #ddd" }}
                    >
                      {person.fullName}
                    </td>
                    <td
                      style={{ padding: "0.75rem", border: "1px solid #ddd" }}
                    >
                      {person.relationToFamily || "N/A"}
                    </td>
                    <td
                      style={{ padding: "0.75rem", border: "1px solid #ddd" }}
                    >
                      {person.cnic || "N/A"}
                    </td>
                    <td
                      style={{ padding: "0.75rem", border: "1px solid #ddd" }}
                    >
                      <span
                        style={{
                          color: person.status === "alive" ? "green" : "gray",
                        }}
                      >
                        {person.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>
          <p>No people found matching your search.</p>
        </div>
      )}
    </>
  );
}
