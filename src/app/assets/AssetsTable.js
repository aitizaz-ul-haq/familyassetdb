"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AssetViewModal from "./AssetViewModal";
import AssetEditModal from "./AssetEditModal";

export default function AssetsTable({ assets, cities, statuses, userRole }) {
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [viewingAsset, setViewingAsset] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const typeMatch = filterType === "all" || asset.assetType === filterType;
      const statusMatch = filterStatus === "all" || asset.currentStatus === filterStatus;
      const cityMatch = filterCity === "all" || asset.location.city === filterCity;
      
      return typeMatch && statusMatch && cityMatch;
    });
  }, [assets, filterType, filterStatus, filterCity]);

  const getAssetTypeLabel = (type) => {
    const labels = {
      land_plot: "Land/Plot",
      house: "House",
      apartment: "Apartment",
      vehicle: "Vehicle",
      business_share: "Business",
      other: "Other",
    };
    return labels[type] || type;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "clean":
        return "badge-success";
      case "in_dispute":
        return "badge-danger";
      default:
        return "";
    }
  };

  const handleDelete = async (assetId, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/assets/${assetId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to delete asset");
      }
    } catch (error) {
      alert("Error deleting asset");
    }
  };

  return (
    <>
      <div className="card">
        {/* Filters Section */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "1rem", 
          marginBottom: "1.5rem",
          padding: "1rem",
          background: "#f8f9fa",
          borderRadius: "8px",
        }}>
          <div>
            <label className="label" style={{ marginBottom: "0.5rem" }}>Asset Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="all">All Types</option>
              <option value="land_plot">Land/Plot</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="vehicle">Vehicle</option>
              <option value="business_share">Business</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="label" style={{ marginBottom: "0.5rem" }}>Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="all">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" style={{ marginBottom: "0.5rem" }}>City</label>
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {(filterType !== "all" || filterStatus !== "all" || filterCity !== "all") && (
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                onClick={() => {
                  setFilterType("all");
                  setFilterStatus("all");
                  setFilterCity("all");
                }}
                style={{
                  background: "#ef5350",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: "1rem", color: "#666", fontSize: "0.9rem" }}>
          Showing {filteredAssets.length} of {assets.length} assets
        </div>

        {/* Assets Table */}
        {filteredAssets.length === 0 ? (
          <p style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
            No assets found matching the selected filters.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table-sm table-nowrap">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Owners</th>
                  {userRole === "admin" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset._id}>
                    <td>
                      <Link href={`/assets/${asset._id}`}>
                        {asset.title}
                      </Link>
                    </td>
                    <td>{getAssetTypeLabel(asset.assetType)}</td>
                    <td>
                      {asset.location.city}
                      {asset.location.areaOrSector !== "N/A" && (
                        <span style={{ color: "#666", fontSize: "0.85rem" }}>
                          {" "}• {asset.location.areaOrSector}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(asset.currentStatus)}`}>
                        {asset.currentStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>
                      {asset.owners.map((owner, idx) => (
                        <div key={idx} style={{ fontSize: "0.9rem" }}>
                          {owner.personName} ({owner.percentage}%)
                        </div>
                      ))}
                    </td>
                    {userRole === "admin" && (
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          <button
                            onClick={() => setViewingAsset(asset.fullData)}
                            style={{
                              padding: "0.25rem 0.75rem",
                              background: "#2196F3",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                            }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => setEditingAsset(asset.fullData)}
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
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(asset._id, asset.title)}
                            style={{
                              padding: "0.25rem 0.75rem",
                              background: "#ef5350",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "0.85rem",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewingAsset && (
        <AssetViewModal
          asset={viewingAsset}
          onClose={() => setViewingAsset(null)}
        />
      )}

      {editingAsset && (
        <AssetEditModal
          asset={editingAsset}
          onClose={() => setEditingAsset(null)}
        />
      )}
    </>
  );
}
