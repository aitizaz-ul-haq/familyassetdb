"use client";

export default function AssetViewModal({ asset, onClose }) {
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return `PKR ${Number(amount).toLocaleString()}`;
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
        maxWidth: "1000px",
        width: "100%",
        margin: "0 auto",
        padding: "2rem",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", borderBottom: "2px solid #7FC6A4", paddingBottom: "1rem" }}>
          <div>
            <h2 style={{ margin: 0, color: "#6D7692", fontSize: "1.5rem" }}>{asset.title}</h2>
            <p style={{ margin: "0.5rem 0 0 0", color: "#999", fontSize: "0.9rem" }}>
              {asset.assetType?.replace(/_/g, " ").toUpperCase()} • {asset.currentStatus?.replace(/_/g, " ")}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#ef5350",
              color: "white",
              border: "none",
              padding: "0.5rem 1.5rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Close
          </button>
        </div>

        {/* Basic Information */}
        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>📋 Basic Information</h3>
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
            {asset.nickname && <><strong>Nickname:</strong><span>{asset.nickname}</span></>}
            {asset.description && <><strong>Description:</strong><span>{asset.description}</span></>}
            <strong>Asset Type:</strong><span>{asset.assetType?.replace(/_/g, " ")}</span>
            <strong>Current Status:</strong><span style={{ color: asset.currentStatus === "clean" ? "green" : "red" }}>{asset.currentStatus?.replace(/_/g, " ")}</span>
            {asset.landUseType && <><strong>Land Use:</strong><span>{asset.landUseType}</span></>}
            {asset.houseUsageType && <><strong>House Usage:</strong><span>{asset.houseUsageType}</span></>}
            {asset.apartmentUsageType && <><strong>Apartment Usage:</strong><span>{asset.apartmentUsageType}</span></>}
            {asset.vehicleType && <><strong>Vehicle Type:</strong><span>{asset.vehicleType}</span></>}
            {asset.isPrimaryFamilyResidence !== undefined && <><strong>Primary Residence:</strong><span>{asset.isPrimaryFamilyResidence ? "Yes" : "No"}</span></>}
            {asset.isIncomeGenerating !== undefined && <><strong>Income Generating:</strong><span>{asset.isIncomeGenerating ? "Yes" : "No"}</span></>}
          </div>
        </section>

        {/* Location */}
        {asset.location && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>📍 Location</h3>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
              {asset.location.country && <><strong>Country:</strong><span>{asset.location.country}</span></>}
              {asset.location.city && <><strong>City:</strong><span>{asset.location.city}</span></>}
              {asset.location.district && <><strong>District:</strong><span>{asset.location.district}</span></>}
              {asset.location.tehsil && <><strong>Tehsil:</strong><span>{asset.location.tehsil}</span></>}
              {asset.location.areaOrSector && <><strong>Area/Sector:</strong><span>{asset.location.areaOrSector}</span></>}
              {asset.location.streetNumber && <><strong>Street:</strong><span>{asset.location.streetNumber}</span></>}
              {asset.location.plotNumber && <><strong>Plot #:</strong><span>{asset.location.plotNumber}</span></>}
              {asset.location.houseNumber && <><strong>House #:</strong><span>{asset.location.houseNumber}</span></>}
              {asset.location.societyOrProject && <><strong>Society/Project:</strong><span>{asset.location.societyOrProject}</span></>}
              {asset.location.apartmentNumber && <><strong>Apt #:</strong><span>{asset.location.apartmentNumber}</span></>}
              {asset.location.fullAddress && <><strong>Full Address:</strong><span>{asset.location.fullAddress}</span></>}
              {asset.location.nearestLandmark && <><strong>Landmark:</strong><span>{asset.location.nearestLandmark}</span></>}
            </div>
          </section>
        )}

        {/* Dimensions (Plot) */}
        {asset.dimensions && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>📐 Dimensions</h3>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
              {asset.dimensions.totalArea && <><strong>Total Area:</strong><span>{asset.dimensions.totalArea.value} {asset.dimensions.totalArea.unit}</span></>}
              {asset.dimensions.convertedAreaSqFt && <><strong>Area (Sq Ft):</strong><span>{asset.dimensions.convertedAreaSqFt}</span></>}
              {asset.dimensions.frontWidthFt && <><strong>Front Width:</strong><span>{asset.dimensions.frontWidthFt} ft</span></>}
              {asset.dimensions.depthFt && <><strong>Depth:</strong><span>{asset.dimensions.depthFt} ft</span></>}
              {asset.dimensions.isCornerPlot !== undefined && <><strong>Corner Plot:</strong><span>{asset.dimensions.isCornerPlot ? "Yes" : "No"}</span></>}
              {asset.dimensions.isParkFacing !== undefined && <><strong>Park Facing:</strong><span>{asset.dimensions.isParkFacing ? "Yes" : "No"}</span></>}
            </div>
          </section>
        )}

        {/* Structure (House/Apartment) */}
        {asset.structure && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>🏗️ Structure</h3>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
              {asset.structure.landArea && <><strong>Land Area:</strong><span>{asset.structure.landArea.value} {asset.structure.landArea.unit}</span></>}
              {asset.structure.coveredAreaSqFt && <><strong>Covered Area:</strong><span>{asset.structure.coveredAreaSqFt} sq ft</span></>}
              {asset.structure.floors && <><strong>Floors:</strong><span>{asset.structure.floors}</span></>}
              {asset.structure.rooms && <><strong>Rooms:</strong><span>{asset.structure.rooms}</span></>}
              {asset.structure.bedrooms && <><strong>Bedrooms:</strong><span>{asset.structure.bedrooms}</span></>}
              {asset.structure.bathrooms && <><strong>Bathrooms:</strong><span>{asset.structure.bathrooms}</span></>}
              {asset.structure.kitchens && <><strong>Kitchens:</strong><span>{asset.structure.kitchens}</span></>}
              {asset.structure.conditionSummary && <><strong>Condition:</strong><span>{asset.structure.conditionSummary}</span></>}
            </div>
          </section>
        )}

        {/* Vehicle Specs */}
        {asset.specs && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>🚗 Vehicle Specifications</h3>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
              {asset.specs.make && <><strong>Make:</strong><span>{asset.specs.make}</span></>}
              {asset.specs.model && <><strong>Model:</strong><span>{asset.specs.model}</span></>}
              {asset.specs.modelYear && <><strong>Year:</strong><span>{asset.specs.modelYear}</span></>}
              {asset.specs.color && <><strong>Color:</strong><span>{asset.specs.color}</span></>}
              {asset.specs.fuelType && <><strong>Fuel Type:</strong><span>{asset.specs.fuelType}</span></>}
              {asset.specs.odometerKm && <><strong>Odometer:</strong><span>{asset.specs.odometerKm} km</span></>}
              {asset.specs.chassisNumber && <><strong>Chassis #:</strong><span>{asset.specs.chassisNumber}</span></>}
            </div>
          </section>
        )}

        {/* Registration (Vehicle) */}
        {asset.registration && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>📝 Registration</h3>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
              {asset.registration.registrationNumber && <><strong>Registration #:</strong><span>{asset.registration.registrationNumber}</span></>}
              {asset.registration.registrationCity && <><strong>Reg City:</strong><span>{asset.registration.registrationCity}</span></>}
              {asset.registration.tokenTaxPaidTill && <><strong>Token Tax Till:</strong><span>{formatDate(asset.registration.tokenTaxPaidTill)}</span></>}
            </div>
          </section>
        )}

        {/* Ownership */}
        {asset.owners && asset.owners.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>👥 Ownership</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Owner</th>
                  <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Share</th>
                  <th style={{ padding: "0.5rem", textAlign: "left", border: "1px solid #ddd" }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {asset.owners.map((owner, idx) => (
                  <tr key={idx}>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{owner.personId?.fullName || owner.personName || "Unknown"}</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{owner.percentage}%</td>
                    <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{owner.ownershipType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Acquisition */}
        {asset.acquisitionInfo && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>💰 Acquisition</h3>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
              {asset.acquisitionInfo.acquiredDate && <><strong>Date:</strong><span>{formatDate(asset.acquisitionInfo.acquiredDate)}</span></>}
              {asset.acquisitionInfo.method && <><strong>Method:</strong><span>{asset.acquisitionInfo.method}</span></>}
              {asset.acquisitionInfo.acquiredFrom && <><strong>From:</strong><span>{asset.acquisitionInfo.acquiredFrom}</span></>}
              {asset.acquisitionInfo.priceOrValueAtAcquisitionPKR && <><strong>Price:</strong><span>{formatCurrency(asset.acquisitionInfo.priceOrValueAtAcquisitionPKR)}</span></>}
              {asset.acquisitionInfo.notes && <><strong>Notes:</strong><span>{asset.acquisitionInfo.notes}</span></>}
            </div>
          </section>
        )}

        {/* Valuation */}
        {asset.valuation && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>💵 Valuation</h3>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
              {asset.valuation.estimatedMarketValuePKR && <><strong>Market Value:</strong><span>{formatCurrency(asset.valuation.estimatedMarketValuePKR)}</span></>}
              {asset.valuation.estimatedDate && <><strong>Estimated Date:</strong><span>{formatDate(asset.valuation.estimatedDate)}</span></>}
              {asset.valuation.source && <><strong>Source:</strong><span>{asset.valuation.source}</span></>}
              {asset.valuation.forcedSaleValuePKR && <><strong>Forced Sale Value:</strong><span>{formatCurrency(asset.valuation.forcedSaleValuePKR)}</span></>}
            </div>
          </section>
        )}

        {/* Mutation & Title */}
        {asset.mutationAndTitle && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>📜 Mutation & Title</h3>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
              {asset.mutationAndTitle.registryNumber && <><strong>Registry #:</strong><span>{asset.mutationAndTitle.registryNumber}</span></>}
              {asset.mutationAndTitle.mutationNumber && <><strong>Mutation #:</strong><span>{asset.mutationAndTitle.mutationNumber}</span></>}
              {asset.mutationAndTitle.fardNumber && <><strong>Fard #:</strong><span>{asset.mutationAndTitle.fardNumber}</span></>}
              {asset.mutationAndTitle.propertyTaxNumber && <><strong>Tax #:</strong><span>{asset.mutationAndTitle.propertyTaxNumber}</span></>}
              {asset.mutationAndTitle.isTitleClear !== undefined && <><strong>Title Clear:</strong><span style={{ color: asset.mutationAndTitle.isTitleClear ? "green" : "red" }}>{asset.mutationAndTitle.isTitleClear ? "Yes" : "No"}</span></>}
            </div>
          </section>
        )}

        {/* Compliance */}
        {asset.compliance && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>✅ Compliance</h3>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
              {asset.compliance.annualPropertyTaxPKR && <><strong>Annual Tax:</strong><span>{formatCurrency(asset.compliance.annualPropertyTaxPKR)}</span></>}
              {asset.compliance.propertyTaxPaidTill && <><strong>Tax Paid Till:</strong><span>{formatDate(asset.compliance.propertyTaxPaidTill)}</span></>}
              {asset.compliance.encroachmentRisk && <><strong>Encroachment Risk:</strong><span>{asset.compliance.encroachmentRisk}</span></>}
              {asset.compliance.govtAcquisitionRisk && <><strong>Govt Risk:</strong><span>{asset.compliance.govtAcquisitionRisk}</span></>}
            </div>
          </section>
        )}

        {/* History */}
        {asset.history && asset.history.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>📅 History</h3>
            {asset.history.map((entry, idx) => (
              <div key={idx} style={{ marginBottom: "1rem", padding: "0.75rem", background: "#f9f9f9", borderLeft: "3px solid #7FC6A4", fontSize: "0.95rem" }}>
                <div style={{ fontWeight: "600", color: "#333" }}>{formatDate(entry.date)} - {entry.action}</div>
                {entry.details && <div style={{ marginTop: "0.25rem", color: "#666" }}>{entry.details}</div>}
                {entry.actor && <div style={{ marginTop: "0.25rem", fontSize: "0.85rem", color: "#999" }}>By: {entry.actor}</div>}
              </div>
            ))}
          </section>
        )}

        {/* Tags */}
        {asset.tags && asset.tags.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>🏷️ Tags</h3>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {asset.tags.map((tag, idx) => (
                <span key={idx} style={{
                  padding: "0.4rem 0.8rem",
                  background: "#e3f2fd",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  color: "#1976d2"
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Internal Notes */}
        {asset.notesInternal && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>📝 Internal Notes</h3>
            <div style={{ padding: "1rem", background: "#fff3cd", borderRadius: "4px", fontSize: "0.95rem" }}>
              {asset.notesInternal}
            </div>
          </section>
        )}

        {/* Flags */}
        {asset.flags && (
          <section>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>⚠️ Flags & Alerts</h3>
            <div style={{ display: "grid", gap: "0.5rem", fontSize: "0.95rem" }}>
              {asset.flags.inheritanceSensitive && <div style={{ padding: "0.5rem", background: "#ffebee", borderLeft: "3px solid #c62828" }}>🔴 Inheritance Sensitive</div>}
              {asset.flags.familyDisputeRisk && asset.flags.familyDisputeRisk !== "none" && <div style={{ padding: "0.5rem", background: "#fff3e0", borderLeft: "3px solid #ff6f00" }}>⚠️ Family Dispute Risk: {asset.flags.familyDisputeRisk}</div>}
              {asset.flags.noteForHeirs && <div style={{ padding: "0.75rem", background: "#e8f5e9", borderLeft: "3px solid #388e3c", marginTop: "0.5rem" }}><strong>Note for Heirs:</strong> {asset.flags.noteForHeirs}</div>}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
