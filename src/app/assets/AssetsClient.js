"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AssetViewModal from "./AssetViewModal";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 6;

export default function AssetsClient({ assets, userRole }) {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    searchQuery: "",
    assetType: "all",
    status: "all",
    city: "all"
  });

  // Get unique cities for filter dropdown
  const uniqueCities = useMemo(() => {
    const cities = new Set();
    assets.forEach(asset => {
      if (asset.location?.city) cities.add(asset.location.city);
    });
    return Array.from(cities).sort();
  }, [assets]);

  // Filter assets based on current filters
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // Search query filter (matches title, type, location)
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = asset.title?.toLowerCase().includes(query);
        const matchesType = asset.assetType?.toLowerCase().includes(query);
        const matchesCity = asset.location?.city?.toLowerCase().includes(query);
        const matchesArea = asset.location?.areaOrSector?.toLowerCase().includes(query);
        
        if (!matchesTitle && !matchesType && !matchesCity && !matchesArea) {
          return false;
        }
      }

      // Asset type filter
      if (filters.assetType !== "all" && asset.assetType !== filters.assetType) {
        return false;
      }

      // Status filter
      if (filters.status !== "all" && asset.currentStatus !== filters.status) {
        return false;
      }

      // City filter
      if (filters.city !== "all" && asset.location?.city !== filters.city) {
        return false;
      }

      return true;
    });
  }, [assets, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      assetType: "all",
      status: "all",
      city: "all"
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.searchQuery || 
    filters.assetType !== "all" || 
    filters.status !== "all" || 
    filters.city !== "all";

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ margin: 0 }}>🏢 Assets</h1>
        {userRole === "admin" && (
          <Link
            href="/assets/add"
            style={{
              padding: "0.75rem 1.5rem",
              background: "#7FC6A4",
              color: "white",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}
          >
            + Add Asset
          </Link>
        )}
      </div>

      {/* Filters Section */}
      <div className="card" style={{ marginBottom: "1.5rem", padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ margin: 0, color: "#6D7692" }}>🔍 Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                padding: "0.5rem 1rem",
                background: "#ef5350",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.85rem"
              }}
            >
              ✕ Clear All
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
          {/* Search Query */}
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500", color: "#555" }}>
              Search
            </label>
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
              placeholder="Search by title, type, city..."
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #7FC6A4",
                borderRadius: "4px",
                fontSize: "0.9rem"
              }}
            />
          </div>

          {/* Asset Type */}
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500", color: "#555" }}>
              Asset Type
            </label>
            <select
              value={filters.assetType}
              onChange={(e) => handleFilterChange("assetType", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #7FC6A4",
                borderRadius: "4px",
                fontSize: "0.9rem"
              }}
            >
              <option value="all">All Types</option>
              <option value="land_plot">Land / Plot</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="vehicle">Vehicle</option>
              <option value="business_share">Business Share</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500", color: "#555" }}>
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #7FC6A4",
                borderRadius: "4px",
                fontSize: "0.9rem"
              }}
            >
              <option value="all">All Status</option>
              <option value="clean">Clean</option>
              <option value="in_dispute">In Dispute</option>
              <option value="under_transfer">Under Transfer</option>
              <option value="sold_but_not_cleared">Sold But Not Cleared</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: "500", color: "#555" }}>
              City
            </label>
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #7FC6A4",
                borderRadius: "4px",
                fontSize: "0.9rem"
              }}
            >
              <option value="all">All Cities</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#f0f0f0", borderRadius: "4px", fontSize: "0.9rem", color: "#666" }}>
          Showing <strong>{filteredAssets.length}</strong> of <strong>{assets.length}</strong> assets
        </div>
      </div>

      {/* Assets Table */}
      <div className="card">
        {filteredAssets.length > 0 ? (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>
                      Title
                    </th>
                    <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>
                      Type
                    </th>
                    <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>
                      Location
                    </th>
                    <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>
                      Status
                    </th>
                    <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>
                      Owners
                    </th>
                    <th style={{ padding: "0.75rem", textAlign: "center", border: "1px solid #ddd" }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAssets.map((asset) => (
                    <tr key={asset._id}>
                      <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>
                        {asset.title}
                      </td>
                      <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>
                        {asset.assetType?.replace(/_/g, " ")}
                      </td>
                      <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>
                        {asset.location?.city || "N/A"}
                        {asset.location?.areaOrSector && `, ${asset.location.areaOrSector}`}
                      </td>
                      <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>
                        <span
                          style={{
                            color: asset.currentStatus === "clean" ? "green" : "red",
                          }}
                        >
                          {asset.currentStatus?.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>
                        {asset.owners?.length > 0
                          ? asset.owners.map((o) => `${o.personName} (${o.percentage}%)`).join(", ")
                          : <em style={{ color: "#999" }}>No owners specified</em>}
                      </td>
                      <td style={{ padding: "0.75rem", border: "1px solid #ddd", textAlign: "center" }}>
                        <button
                          onClick={() => setSelectedAsset(asset.fullData)}
                          style={{
                            padding: "0.5rem 1rem",
                            background: "#2196F3",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.85rem"
                          }}
                        >
                          View Details
                        </button>
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
            <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>🔍 No assets found</p>
            <p>
              {hasActiveFilters 
                ? "Try adjusting your filters to see more results." 
                : userRole === "admin" 
                  ? "Click 'Add Asset' to create one." 
                  : "No assets available."}
            </p>
          </div>
        )}
      </div>

      {selectedAsset && (
        <AssetViewModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
      )}
    </>
  );
}
