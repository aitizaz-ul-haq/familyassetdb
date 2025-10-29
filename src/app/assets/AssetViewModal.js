"use client";

import { jsPDF } from "jspdf";
import { useState } from "react";

export default function AssetViewModal({ asset, onClose }) {
  const [viewingDoc, setViewingDoc] = useState(null);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return `PKR ${Number(amount).toLocaleString()}`;
  };

  // Generate precise Google Maps search URL
  const getGoogleMapsUrl = () => {
    if (!asset.location) return null;

    // If we have coordinates, use them for precise location
    if (asset.location.geoCoordinates?.lat && asset.location.geoCoordinates?.lng) {
      return `https://www.google.com/maps/search/?api=1&query=${asset.location.geoCoordinates.lat},${asset.location.geoCoordinates.lng}`;
    }

    // Otherwise, build detailed address query
    const parts = [
      asset.location.plotNumber && `Plot ${asset.location.plotNumber}`,
      asset.location.houseNumber && `House ${asset.location.houseNumber}`,
      asset.location.apartmentNumber && `Apartment ${asset.location.apartmentNumber}`,
      asset.location.streetNumber && `Street ${asset.location.streetNumber}`,
      asset.location.blockOrPhase,
      asset.location.societyOrProject,
      asset.location.areaOrSector,
      asset.location.city,
      asset.location.district,
      asset.location.country,
    ].filter(Boolean);

    if (parts.length === 0) return null;

    // Use the full address if available, otherwise use constructed parts
    const query = asset.location.fullAddress || parts.join(", ");
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    const checkPageBreak = () => {
      if (yPos > pageHeight - margin) {
        doc.addPage();
        yPos = 20;
      }
    };

    const addSectionHeader = (title) => {
      checkPageBreak();
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text(title, margin, yPos);
      yPos += lineHeight + 2;
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
    };

    const addField = (label, value) => {
      if (!value || value === "N/A" || value === "") return;
      checkPageBreak();
      doc.setFont(undefined, "bold");
      doc.text(label + ":", margin, yPos);
      doc.setFont(undefined, "normal");
      doc.text(String(value), margin + 50, yPos);
      yPos += lineHeight;
    };

    // Title
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("ASSET INFORMATION REPORT", margin, yPos);
    yPos += lineHeight + 5;

    // Basic Information
    addSectionHeader("Basic Information");
    addField("Title", asset.title);
    addField("Nickname", asset.nickname);
    addField("Asset Type", asset.assetType?.replace(/_/g, " "));
    addField("Status", asset.currentStatus?.replace(/_/g, " "));
    addField("Description", asset.description);
    yPos += 3;

    // Location
    if (asset.location) {
      addSectionHeader("Location");
      addField("Country", asset.location.country);
      addField("City", asset.location.city);
      addField("District", asset.location.district);
      addField("Area/Sector", asset.location.areaOrSector);
      addField("Full Address", asset.location.fullAddress);
      yPos += 3;
    }

    // Dimensions/Structure/Specs based on type
    if (asset.dimensions) {
      addSectionHeader("Dimensions");
      if (asset.dimensions.totalArea) {
        addField(
          "Total Area",
          `${asset.dimensions.totalArea.value} ${asset.dimensions.totalArea.unit}`
        );
      }
      addField("Area (Sq Ft)", asset.dimensions.convertedAreaSqFt);
      yPos += 3;
    }

    if (asset.structure) {
      addSectionHeader("Structure");
      addField("Covered Area", asset.structure.coveredAreaSqFt ? `${asset.structure.coveredAreaSqFt} sq ft` : null);
      addField("Floors", asset.structure.floors);
      addField("Rooms", asset.structure.rooms || asset.structure.bedrooms);
      addField("Bathrooms", asset.structure.bathrooms);
      yPos += 3;
    }

    if (asset.specs) {
      addSectionHeader("Vehicle Specifications");
      addField("Make", asset.specs.make);
      addField("Model", asset.specs.model);
      addField("Year", asset.specs.modelYear);
      addField("Color", asset.specs.color);
      yPos += 3;
    }

    // Ownership
    if (asset.owners && asset.owners.length > 0) {
      addSectionHeader("Ownership");
      asset.owners.forEach((owner, idx) => {
        checkPageBreak();
        doc.text(
          `${idx + 1}. ${owner.personName || owner.personId?.fullName || "Unknown"} - ${owner.percentage}%`,
          margin,
          yPos
        );
        yPos += lineHeight;
      });
      yPos += 3;
    }

    // Acquisition
    if (asset.acquisitionInfo) {
      addSectionHeader("Acquisition");
      addField("Date", formatDate(asset.acquisitionInfo.acquiredDate));
      addField("Method", asset.acquisitionInfo.method);
      addField("From", asset.acquisitionInfo.acquiredFrom);
      addField("Price", formatCurrency(asset.acquisitionInfo.priceOrValueAtAcquisitionPKR));
      yPos += 3;
    }

    // Valuation
    if (asset.valuation) {
      addSectionHeader("Valuation");
      addField("Market Value", formatCurrency(asset.valuation.estimatedMarketValuePKR));
      addField("Estimated Date", formatDate(asset.valuation.estimatedDate));
      addField("Source", asset.valuation.source);
      yPos += 3;
    }

    // History
    if (asset.history && asset.history.length > 0) {
      addSectionHeader("History Timeline");
      asset.history.forEach((entry) => {
        checkPageBreak();
        doc.setFont(undefined, "bold");
        doc.text(`${formatDate(entry.date)} - ${entry.action}`, margin, yPos);
        yPos += lineHeight;
        if (entry.details) {
          doc.setFont(undefined, "normal");
          const lines = doc.splitTextToSize(entry.details, 170);
          lines.forEach((line) => {
            checkPageBreak();
            doc.text(line, margin + 5, yPos);
            yPos += lineHeight;
          });
        }
        yPos += 2;
      });
    }

    // Related Contacts
    if (asset.relatedContacts && asset.relatedContacts.length > 0) {
      addSectionHeader("Related Contacts");
      asset.relatedContacts.forEach((contact, idx) => {
        checkPageBreak();
        doc.setFont(undefined, "bold");
        doc.text(`${idx + 1}. ${contact.category.replace(/_/g, " ").toUpperCase()}`, margin, yPos);
        yPos += lineHeight;
        doc.setFont(undefined, "normal");
        doc.text(`   Name: ${contact.name}`, margin, yPos);
        yPos += lineHeight;
        doc.text(`   Phone: ${contact.phoneNumber}`, margin, yPos);
        yPos += lineHeight;
        if (contact.notes) {
          doc.text(`   Notes: ${contact.notes}`, margin, yPos);
          yPos += lineHeight;
        }
        yPos += 2;
      });
      yPos += 3;
    }

    // Footer
    doc.setFontSize(8);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);

    const fileName = `${asset.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`;
    doc.save(fileName);
  };

  const mapsUrl = getGoogleMapsUrl();

  // Function to convert Google Drive link to embeddable format
  const getEmbedUrl = (url) => {
    if (!url) return null;
    
    // Google Drive link format: https://drive.google.com/file/d/FILE_ID/view
    // Convert to embed format: https://drive.google.com/file/d/FILE_ID/preview
    if (url.includes('drive.google.com')) {
      // Extract file ID
      const match = url.match(/\/d\/(.*?)(\/|$)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    
    // For direct image URLs (ImgBB, etc.)
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return url;
    }
    
    // Return original URL for PDFs or other direct links
    return url;
  };

  // Determine if URL is an image or PDF
  const getFileType = (url, fileType) => {
    // Check fileType field first
    if (fileType) {
      const normalizedType = fileType.toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(normalizedType)) {
        return 'image';
      }
      if (normalizedType === 'pdf') {
        return 'pdf';
      }
    }
    
    // Check URL
    if (url) {
      if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i) || url.includes('ibb.co') || url.includes('imgur.com')) {
        return 'image';
      }
      if (url.match(/\.pdf$/i) || url.includes('drive.google.com')) {
        return 'pdf';
      }
    }
    
    // Default to PDF for Google Drive
    if (url && url.includes('drive.google.com')) {
      return 'pdf';
    }
    
    return 'unknown';
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 9999,
        overflowY: "auto",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "8px",
          maxWidth: "1000px",
          width: "100%",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        {/* Header with Download PDF and Close buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2rem",
            borderBottom: "2px solid #7FC6A4",
            paddingBottom: "1rem",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#6D7692",
                fontSize: "1.5rem",
              }}
            >
              {asset.title}
            </h2>
            <p
              style={{
                margin: "0.5rem 0 0 0",
                color: "#999",
                fontSize: "0.9rem",
              }}
            >
              {asset.assetType?.replace(/_/g, " ").toUpperCase()} •{" "}
              {asset.currentStatus?.replace(/_/g, " ")}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={downloadPDF}
              style={{
                background: "#2196F3",
                color: "white",
                border: "none",
                padding: "0.5rem 1.5rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>📥</span>
              Download PDF
            </button>
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
        </div>

        {/* Basic Information */}
        <section style={{ marginBottom: "2rem" }}>
          <h3
            style={{
              color: "#6D7692",
              borderBottom: "1px solid #ddd",
              paddingBottom: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            📋 Basic Information
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: "0.75rem",
              fontSize: "0.95rem",
            }}
          >
            {asset.nickname && (
              <>
                <strong>Nickname:</strong>
                <span>{asset.nickname}</span>
              </>
            )}
            {asset.description && (
              <>
                <strong>Description:</strong>
                <span>{asset.description}</span>
              </>
            )}
            <strong>Asset Type:</strong>
            <span>{asset.assetType?.replace(/_/g, " ")}</span>
            <strong>Current Status:</strong>
            <span
              style={{
                color: asset.currentStatus === "clean" ? "green" : "red",
              }}
            >
              {asset.currentStatus?.replace(/_/g, " ")}
            </span>
            {asset.landUseType && (
              <>
                <strong>Land Use:</strong>
                <span>{asset.landUseType}</span>
              </>
            )}
            {asset.houseUsageType && (
              <>
                <strong>House Usage:</strong>
                <span>{asset.houseUsageType}</span>
              </>
            )}
            {asset.apartmentUsageType && (
              <>
                <strong>Apartment Usage:</strong>
                <span>{asset.apartmentUsageType}</span>
              </>
            )}
            {asset.vehicleType && (
              <>
                <strong>Vehicle Type:</strong>
                <span>{asset.vehicleType}</span>
              </>
            )}
            {asset.isPrimaryFamilyResidence !== undefined && (
              <>
                <strong>Primary Residence:</strong>
                <span>
                  {asset.isPrimaryFamilyResidence ? "Yes" : "No"}
                </span>
              </>
            )}
            {asset.isIncomeGenerating !== undefined && (
              <>
                <strong>Income Generating:</strong>
                <span>{asset.isIncomeGenerating ? "Yes" : "No"}</span>
              </>
            )}
          </div>
        </section>

        {/* Location with Google Maps Button Only */}
        {asset.location && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
              📍 Location
            </h3>

            {/* Location Details Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "0.75rem",
                fontSize: "0.95rem",
                marginBottom: "1.5rem",
              }}
            >
              {asset.location.country && (
                <>
                  <strong>Country:</strong>
                  <span>{asset.location.country}</span>
                </>
              )}
              {asset.location.city && (
                <>
                  <strong>City:</strong>
                  <span>{asset.location.city}</span>
                </>
              )}
              {asset.location.district && (
                <>
                  <strong>District:</strong>
                  <span>{asset.location.district}</span>
                </>
              )}
              {asset.location.tehsil && (
                <>
                  <strong>Tehsil:</strong>
                  <span>{asset.location.tehsil}</span>
                </>
              )}
              {asset.location.areaOrSector && (
                <>
                  <strong>Area/Sector:</strong>
                  <span>{asset.location.areaOrSector}</span>
                </>
              )}
              {asset.location.streetNumber && (
                <>
                  <strong>Street:</strong>
                  <span>{asset.location.streetNumber}</span>
                </>
              )}
              {asset.location.plotNumber && (
                <>
                  <strong>Plot #:</strong>
                  <span>{asset.location.plotNumber}</span>
                </>
              )}
              {asset.location.houseNumber && (
                <>
                  <strong>House #:</strong>
                  <span>{asset.location.houseNumber}</span>
                </>
              )}
              {asset.location.societyOrProject && (
                <>
                  <strong>Society/Project:</strong>
                  <span>{asset.location.societyOrProject}</span>
                </>
              )}
              {asset.location.apartmentNumber && (
                <>
                  <strong>Apt #:</strong>
                  <span>{asset.location.apartmentNumber}</span>
                </>
              )}
              {asset.location.fullAddress && (
                <>
                  <strong>Full Address:</strong>
                  <span>{asset.location.fullAddress}</span>
                </>
              )}
              {asset.location.nearestLandmark && (
                <>
                  <strong>Landmark:</strong>
                  <span>{asset.location.nearestLandmark}</span>
                </>
              )}
              {asset.location.geoCoordinates?.lat && asset.location.geoCoordinates?.lng && (
                <>
                  <strong>Coordinates:</strong>
                  <span>{asset.location.geoCoordinates.lat}, {asset.location.geoCoordinates.lng}</span>
                </>
              )}
            </div>

            {/* Open in Google Maps Button */}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  background: "#4285F4",
                  color: "white",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "1rem",
                  fontWeight: "500",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#1a73e8";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#4285F4";
                  e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>📍</span>
                <span>Open Location in Google Maps</span>
                <span style={{ fontSize: "0.9rem" }}>↗</span>
              </a>
            )}

            {!mapsUrl && (
              <div style={{
                padding: "1rem",
                background: "#fff3cd",
                borderRadius: "6px",
                color: "#856404",
                fontSize: "0.9rem",
              }}>
                ⚠️ No location information available for this asset
              </div>
            )}
          </section>
        )}

        {/* Dimensions (Plot) */}
        {asset.dimensions && (
          <section style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                color: "#6D7692",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              📐 Dimensions
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "0.75rem",
                fontSize: "0.95rem",
              }}
            >
              {asset.dimensions.totalArea && (
                <>
                  <strong>Total Area:</strong>
                  <span>
                    {asset.dimensions.totalArea.value}{" "}
                    {asset.dimensions.totalArea.unit}
                  </span>
                </>
              )}
              {asset.dimensions.convertedAreaSqFt && (
                <>
                  <strong>Area (Sq Ft):</strong>
                  <span>{asset.dimensions.convertedAreaSqFt}</span>
                </>
              )}
              {asset.dimensions.frontWidthFt && (
                <>
                  <strong>Front Width:</strong>
                  <span>{asset.dimensions.frontWidthFt} ft</span>
                </>
              )}
              {asset.dimensions.depthFt && (
                <>
                  <strong>Depth:</strong>
                  <span>{asset.dimensions.depthFt} ft</span>
                </>
              )}
              {asset.dimensions.isCornerPlot !== undefined && (
                <>
                  <strong>Corner Plot:</strong>
                  <span>
                    {asset.dimensions.isCornerPlot ? "Yes" : "No"}
                  </span>
                </>
              )}
              {asset.dimensions.isParkFacing !== undefined && (
                <>
                  <strong>Park Facing:</strong>
                  <span>
                    {asset.dimensions.isParkFacing ? "Yes" : "No"}
                  </span>
                </>
              )}
            </div>
          </section>
        )}

        {/* Structure (House/Apartment) */}
        {asset.structure && (
          <section style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                color: "#6D7692",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              🏗️ Structure
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "0.75rem",
                fontSize: "0.95rem",
              }}
            >
              {asset.structure.landArea && (
                <>
                  <strong>Land Area:</strong>
                  <span>
                    {asset.structure.landArea.value}{" "}
                    {asset.structure.landArea.unit}
                  </span>
                </>
              )}
              {asset.structure.coveredAreaSqFt && (
                <>
                  <strong>Covered Area:</strong>
                  <span>{asset.structure.coveredAreaSqFt} sq ft</span>
                </>
              )}
              {asset.structure.floors && (
                <>
                  <strong>Floors:</strong>
                  <span>{asset.structure.floors}</span>
                </>
              )}
              {asset.structure.rooms && (
                <>
                  <strong>Rooms:</strong>
                  <span>{asset.structure.rooms}</span>
                </>
              )}
              {asset.structure.bedrooms && (
                <>
                  <strong>Bedrooms:</strong>
                  <span>{asset.structure.bedrooms}</span>
                </>
              )}
              {asset.structure.bathrooms && (
                <>
                  <strong>Bathrooms:</strong>
                  <span>{asset.structure.bathrooms}</span>
                </>
              )}
              {asset.structure.kitchens && (
                <>
                  <strong>Kitchens:</strong>
                  <span>{asset.structure.kitchens}</span>
                </>
              )}
              {asset.structure.conditionSummary && (
                <>
                  <strong>Condition:</strong>
                  <span>{asset.structure.conditionSummary}</span>
                </>
              )}
            </div>
          </section>
        )}

        {/* Vehicle Specs */}
        {asset.specs && (
          <section style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                color: "#6D7692",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              🚗 Vehicle Specifications
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "0.75rem",
                fontSize: "0.95rem",
              }}
            >
              {asset.specs.make && (
                <>
                  <strong>Make:</strong>
                  <span>{asset.specs.make}</span>
                </>
              )}
              {asset.specs.model && (
                <>
                  <strong>Model:</strong>
                  <span>{asset.specs.model}</span>
                </>
              )}
              {asset.specs.modelYear && (
                <>
                  <strong>Year:</strong>
                  <span>{asset.specs.modelYear}</span>
                </>
              )}
              {asset.specs.color && (
                <>
                  <strong>Color:</strong>
                  <span>{asset.specs.color}</span>
                </>
              )}
              {asset.specs.fuelType && (
                <>
                  <strong>Fuel Type:</strong>
                  <span>{asset.specs.fuelType}</span>
                </>
              )}
              {asset.specs.odometerKm && (
                <>
                  <strong>Odometer:</strong>
                  <span>{asset.specs.odometerKm} km</span>
                </>
              )}
              {asset.specs.chassisNumber && (
                <>
                  <strong>Chassis #:</strong>
                  <span>{asset.specs.chassisNumber}</span>
                </>
              )}
            </div>
          </section>
        )}

        {/* Registration (Vehicle) */}
        {asset.registration && (
          <section style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                color: "#6D7692",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              📝 Registration
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "0.75rem",
                fontSize: "0.95rem",
              }}
            >
              {asset.registration.registrationNumber && (
                <>
                  <strong>Registration #:</strong>
                  <span>{asset.registration.registrationNumber}</span>
                </>
              )}
              {asset.registration.registrationCity && (
                <>
                  <strong>Reg City:</strong>
                  <span>{asset.registration.registrationCity}</span>
                </>
              )}
              {asset.registration.tokenTaxPaidTill && (
                <>
                  <strong>Token Tax Till:</strong>
                  <span>{formatDate(asset.registration.tokenTaxPaidTill)}</span>
                </>
              )}
            </div>
          </section>
        )}

        {/* Ownership */}
        {asset.owners && asset.owners.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                color: "#6D7692",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              👥 Ownership
            </h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.95rem",
              }}
            >
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th
                    style={{
                      padding: "0.5rem",
                      textAlign: "left",
                      border: "1px solid #ddd",
                    }}
                  >
                    Owner
                  </th>
                  <th
                    style={{
                      padding: "0.5rem",
                      textAlign: "left",
                      border: "1px solid #ddd",
                    }}
                  >
                    Share
                  </th>
                  <th
                    style={{
                      padding: "0.5rem",
                      textAlign: "left",
                      border: "1px solid #ddd",
                    }}
                  >
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {asset.owners.map((owner, idx) => (
                  <tr key={idx}>
                    <td
                      style={{
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                      }}
                    >
                      {owner.personId?.fullName || owner.personName || "Unknown"}
                    </td>
                    <td
                      style={{
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                      }}
                    >
                      {owner.percentage}%
                    </td>
                    <td
                      style={{
                        padding: "0.5rem",
                        border: "1px solid #ddd",
                      }}
                    >
                      {owner.ownershipType}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Acquisition */}
        {asset.acquisitionInfo && (
          <section style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                color: "#6D7692",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              💰 Acquisition
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "0.75rem",
                fontSize: "0.95rem",
              }}
            >
              {asset.acquisitionInfo.acquiredDate && (
                <>
                  <strong>Date:</strong>
                  <span>{formatDate(asset.acquisitionInfo.acquiredDate)}</span>
                </>
              )}
              {asset.acquisitionInfo.method && (
                <>
                  <strong>Method:</strong>
                  <span>{asset.acquisitionInfo.method}</span>
                </>
              )}
              {asset.acquisitionInfo.acquiredFrom && (
                <>
                  <strong>From:</strong>
                  <span>{asset.acquisitionInfo.acquiredFrom}</span>
                </>
              )}
              {asset.acquisitionInfo.priceOrValueAtAcquisitionPKR && (
                <>
                  <strong>Price:</strong>
                  <span>
                    {formatCurrency(asset.acquisitionInfo.priceOrValueAtAcquisitionPKR)}
                  </span>
                </>
              )}
              {asset.acquisitionInfo.notes && (
                <>
                  <strong>Notes:</strong>
                  <span>{asset.acquisitionInfo.notes}</span>
                </>
              )}
            </div>
          </section>
        )}

        {/* Valuation */}
        {asset.valuation && (
          <section style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                color: "#6D7692",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              💵 Valuation
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "0.75rem",
                fontSize: "0.95rem",
              }}
            >
              {asset.valuation.estimatedMarketValuePKR && (
                <>
                  <strong>Market Value:</strong>
                  <span>{formatCurrency(asset.valuation.estimatedMarketValuePKR)}</span>
                </>
              )}
              {asset.valuation.estimatedDate && (
                <>
                  <strong>Estimated Date:</strong>
                  <span>{formatDate(asset.valuation.estimatedDate)}</span>
                </>
              )}
              {asset.valuation.source && (
                <>
                  <strong>Source:</strong>
                  <span>{asset.valuation.source}</span>
                </>
              )}
              {asset.valuation.forcedSaleValuePKR && (
                <>
                  <strong>Forced Sale Value:</strong>
                  <span>{formatCurrency(asset.valuation.forcedSaleValuePKR)}</span>
                </>
              )}
            </div>
          </section>
        )}

        {/* Mutation & Title */}
        {asset.mutationAndTitle && (
          <section style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                color: "#6D7692",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              📜 Mutation & Title
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "0.75rem",
                fontSize: "0.95rem",
              }}
            >
              {asset.mutationAndTitle.registryNumber && (
                <>
                  <strong>Registry #:</strong>
                  <span>{asset.mutationAndTitle.registryNumber}</span>
                </>
              )}
              {asset.mutationAndTitle.mutationNumber && (
                <>
                  <strong>Mutation #:</strong>
                  <span>{asset.mutationAndTitle.mutationNumber}</span>
                </>
              )}
              {asset.mutationAndTitle.fardNumber && (
                <>
                  <strong>Fard #:</strong>
                  <span>{asset.mutationAndTitle.fardNumber}</span>
                </>
              )}
              {asset.mutationAndTitle.propertyTaxNumber && (
                <>
                  <strong>Tax #:</strong>
                  <span>{asset.mutationAndTitle.propertyTaxNumber}</span>
                </>
              )}
              {asset.mutationAndTitle.isTitleClear !== undefined && (
                <>
                  <strong>Title Clear:</strong>
                  <span
                    style={{
                      color: asset.mutationAndTitle.isTitleClear ? "green" : "red",
                    }}
                  >
                    {asset.mutationAndTitle.isTitleClear ? "Yes" : "No"}
                  </span>
                </>
              )}
            </div>
          </section>
        )}

        {/* Compliance */}
        {asset.compliance && (
          <section style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                color: "#6D7692",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              ✅ Compliance
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: "0.75rem",
                fontSize: "0.95rem",
              }}
            >
              {asset.compliance.annualPropertyTaxPKR && (
                <>
                  <strong>Annual Tax:</strong>
                  <span>{formatCurrency(asset.compliance.annualPropertyTaxPKR)}</span>
                </>
              )}
              {asset.compliance.propertyTaxPaidTill && (
                <>
                  <strong>Tax Paid Till:</strong>
                  <span>{formatDate(asset.compliance.propertyTaxPaidTill)}</span>
                </>
              )}
              {asset.compliance.encroachmentRisk && (
                <>
                  <strong>Encroachment Risk:</strong>
                  <span>{asset.compliance.encroachmentRisk}</span>
                </>
              )}
              {asset.compliance.govtAcquisitionRisk && (
                <>
                  <strong>Govt Risk:</strong>
                  <span>{asset.compliance.govtAcquisitionRisk}</span>
                </>
              )}
            </div>
          </section>
        )}

        {/* History */}
        {asset.history && asset.history.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                color: "#6D7692",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              📅 History
            </h3>
            {asset.history.map((entry, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "1rem",
                  padding: "0.75rem",
                  background: "#f9f9f9",
                  borderLeft: "3px solid #7FC6A4",
                  fontSize: "0.95rem",
                }}
              >
                <div style={{ fontWeight: "600", color: "#333" }}>
                  {formatDate(entry.date)} - {entry.action}
                </div>
                {entry.details && (
                  <div style={{ marginTop: "0.25rem", color: "#666" }}>
                    {entry.details}
                  </div>
                )}
                {entry.actor && (
                  <div
                    style={{
                      marginTop: "0.25rem",
                      fontSize: "0.85rem",
                      color: "#999",
                    }}
                  >
                    By: {entry.actor}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Tags */}
        {asset.tags && asset.tags.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                color: "#6D7692",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              🏷️ Tags
            </h3>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              {asset.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "0.4rem 0.8rem",
                    background: "#e3f2fd",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    color: "#1976d2",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Internal Notes */}
        {asset.notesInternal && (
          <section style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                color: "#6D7692",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              📝 Internal Notes
            </h3>
            <div
              style={{
                padding: "1rem",
                background: "#fff3cd",
                borderRadius: "4px",
                fontSize: "0.95rem",
              }}
            >
              {asset.notesInternal}
            </div>
          </section>
        )}

        {/* Flags */}
        {asset.flags && (
          <section>
            <h3
              style={{
                color: "#6D7692",
                borderBottom: "1px solid #ddd",
                paddingBottom: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              ⚠️ Flags & Alerts
            </h3>
            <div
              style={{
                display: "grid",
                gap: "0.5rem",
                fontSize: "0.95rem",
              }}
            >
              {asset.flags.inheritanceSensitive && (
                <div
                  style={{
                    padding: "0.5rem",
                    background: "#ffebee",
                    borderLeft: "3px solid #c62828",
                  }}
                >
                  🔴 Inheritance Sensitive
                </div>
              )}
              {asset.flags.familyDisputeRisk && asset.flags.familyDisputeRisk !== "none" && (
                <div
                  style={{
                    padding: "0.5rem",
                    background: "#fff3e0",
                    borderLeft: "3px solid #ff6f00",
                  }}
                >
                  ⚠️ Family Dispute Risk: {asset.flags.familyDisputeRisk}
                </div>
              )}
              {asset.flags.noteForHeirs && (
                <div
                  style={{
                    padding: "0.75rem",
                    background: "#e8f5e9",
                    borderLeft: "3px solid #388e3c",
                    marginTop: "0.5rem",
                  }}
                >
                  <strong>Note for Heirs:</strong> {asset.flags.noteForHeirs}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Related Contacts Section */}
        {asset.relatedContacts && asset.relatedContacts.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
              📞 Related Contacts
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              {asset.relatedContacts.map((contact, idx) => (
                <div key={idx} style={{ padding: "1rem", background: "#f9f9f9", borderRadius: "6px", borderLeft: "4px solid #7FC6A4" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "0.5rem", fontSize: "0.95rem" }}>
                    <strong>Category:</strong>
                    <span style={{ textTransform: "capitalize", color: contact.category === "conflict_person" ? "#c62828" : "#333" }}>
                      {contact.category.replace(/_/g, " ")}
                    </span>
                    <strong>Name:</strong>
                    <span>{contact.name}</span>
                    <strong>Phone:</strong>
                    <a href={`tel:${contact.phoneNumber}`} style={{ color: "#2196F3", textDecoration: "none" }}>
                      {contact.phoneNumber}
                    </a>
                    {contact.notes && (
                      <>
                        <strong>Notes:</strong>
                        <span style={{ color: "#666" }}>{contact.notes}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Documents Section - OPTIMIZED WIDTH */}
        {asset.documents && asset.documents.length > 0 && (
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
              📎 Documents
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {asset.documents.map((doc, idx) => {
                const fileType = getFileType(doc.fileUrl, doc.fileType);
                
                return (
                  <div key={idx} style={{ 
                    padding: "1rem", 
                    background: "#f9f9f9", 
                    borderRadius: "6px", 
                    border: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    maxWidth: "100%",
                    overflow: "hidden"
                  }}>
                    {/* Document Info - 30% width */}
                    <div style={{ 
                      flex: "0 0 30%", 
                      minWidth: 0,
                      maxWidth: "30%"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        {doc.isCritical && <span style={{ color: "#c62828", flexShrink: 0, fontSize: "1rem" }}>⚠️</span>}
                        <h4 style={{ 
                          margin: 0, 
                          color: "#333", 
                          fontSize: "0.9rem", 
                          fontWeight: "600",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }} title={doc.label}>
                          {doc.label}
                        </h4>
                      </div>
                      <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", alignItems: "center" }}>
                        {doc.docType && (
                          <span style={{ 
                            fontSize: "0.7rem", 
                            color: "#666",
                            background: "#e0e0e0",
                            padding: "0.15rem 0.4rem",
                            borderRadius: "3px",
                            whiteSpace: "nowrap"
                          }}>
                            {doc.docType}
                          </span>
                        )}
                        <span style={{
                          fontSize: "0.7rem",
                          color: "white",
                          background: fileType === 'image' ? "#4caf50" : fileType === 'pdf' ? "#f44336" : "#999",
                          padding: "0.15rem 0.4rem",
                          borderRadius: "3px",
                          textTransform: "uppercase",
                          fontWeight: "600",
                          whiteSpace: "nowrap"
                        }}>
                          {fileType === 'image' ? 'IMG' : fileType === 'pdf' ? 'PDF' : 'DOC'}
                        </span>
                      </div>
                    </div>

                    {/* Notes/Date - flexible width */}
                    <div style={{ 
                      flex: "1 1 auto",
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem"
                    }}>
                      {doc.notes && (
                        <p style={{ 
                          margin: "0", 
                          fontSize: "0.8rem", 
                          color: "#666",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }} title={doc.notes}>
                          {doc.notes}
                        </p>
                      )}
                      {doc.uploadedAt && (
                        <p style={{ margin: "0", fontSize: "0.7rem", color: "#999" }}>
                          {formatDate(doc.uploadedAt)}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons - fixed width */}
                    <div style={{ 
                      display: "flex", 
                      gap: "0.5rem",
                      flexShrink: 0
                    }}>
                      <button
                        onClick={() => setViewingDoc(doc)}
                        style={{
                          padding: "0.4rem 0.8rem",
                          background: "#7FC6A4",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          whiteSpace: "nowrap"
                        }}
                      >
                        👁️ View
                      </button>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: "0.4rem 0.8rem",
                          background: "#2196F3",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          textDecoration: "none",
                          fontSize: "0.8rem",
                          fontWeight: "500",
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          display: "inline-block"
                        }}
                      >
                        ↗ Open
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Document Viewer Modal - FIXED */}
        {viewingDoc && (() => {
          const fileType = getFileType(viewingDoc.fileUrl, viewingDoc.fileType);
          
          return (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.95)",
              zIndex: 10000,
              display: "flex",
              flexDirection: "column",
              padding: "1rem",
            }}>
              {/* Viewer Header */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
                color: "white",
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.2rem" }}>{viewingDoc.label}</h3>
                  <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem", color: "#ccc" }}>
                    {viewingDoc.docType} • {fileType === 'image' ? 'IMAGE' : fileType === 'pdf' ? 'PDF' : 'Document'}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <a
                    href={viewingDoc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: "0.5rem 1rem",
                      background: "#2196F3",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      textDecoration: "none",
                      fontSize: "0.9rem",
                    }}
                  >
                    ↗ Open Original
                  </a>
                  <button
                    onClick={() => setViewingDoc(null)}
                    style={{
                      padding: "0.5rem 1.5rem",
                      background: "#ef5350",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Viewer Content */}
              <div style={{
                flex: 1,
                background: "white",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
                {fileType === 'image' ? (
                  // Image viewer
                  <img
                    src={viewingDoc.fileUrl}
                    alt={viewingDoc.label}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : fileType === 'pdf' ? (
                  // PDF viewer (Google Drive embed)
                  <iframe
                    src={getEmbedUrl(viewingDoc.fileUrl)}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                    title={viewingDoc.label}
                  />
                ) : (
                  // Unknown file type
                  <div style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#666"
                  }}>
                    <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>⚠️ Preview not available</p>
                    <p>This file type cannot be previewed.</p>
                    <a
                      href={viewingDoc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        marginTop: "1rem",
                        padding: "0.75rem 1.5rem",
                        background: "#2196F3",
                        color: "white",
                        borderRadius: "4px",
                        textDecoration: "none",
                      }}
                    >
                      Open File in New Tab
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
