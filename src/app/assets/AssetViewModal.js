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

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 15;
    const leftMargin = 15;
    const pageWidth = 180;
    const lineHeight = 6;

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace = 10) => {
      if (y + requiredSpace > 280) {
        doc.addPage();
        y = 15;
      }
    };

    // Helper to add section header
    const addSection = (title) => {
      checkNewPage(15);
      y += 3;
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(title, leftMargin, y);
      y += lineHeight;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      y += 2;
    };

    // Helper to add field
    const addField = (label, value) => {
      if (!value || value === "N/A" || value === "" || value === "undefined") return;
      checkNewPage(8);
      
      doc.setFont(undefined, 'bold');
      doc.text(label + ":", leftMargin, y);
      doc.setFont(undefined, 'normal');
      
      // Handle long text with wrapping
      const valueStr = String(value);
      const maxWidth = pageWidth - 60;
      const lines = doc.splitTextToSize(valueStr, maxWidth);
      
      let xPos = leftMargin + 55;
      lines.forEach((line, index) => {
        if (index > 0) {
          checkNewPage(8);
          xPos = leftMargin + 55;
        }
        doc.text(line, xPos, y);
        if (index < lines.length - 1) {
          y += lineHeight;
        }
      });
      y += lineHeight;
    };

    // ============ TITLE ============
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    const titleLines = doc.splitTextToSize(asset.title || "Asset Report", pageWidth);
    titleLines.forEach(line => {
      doc.text(line, leftMargin, y);
      y += 8;
    });
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    y += 3;

    // ============ BASIC INFORMATION ============
    addSection("BASIC INFORMATION");
    addField("Asset ID", asset._id);
    addField("Asset Type", asset.assetType?.replace(/_/g, " ").toUpperCase());
    addField("Nickname", asset.nickname);
    addField("Description", asset.description);
    addField("Current Status", asset.currentStatus?.replace(/_/g, " ").toUpperCase());
    
    if (asset.landUseType) addField("Land Use Type", asset.landUseType);
    if (asset.houseUsageType) addField("House Usage Type", asset.houseUsageType);
    if (asset.apartmentUsageType) addField("Apartment Usage Type", asset.apartmentUsageType);
    if (asset.vehicleType) addField("Vehicle Type", asset.vehicleType);
    if (asset.isPrimaryFamilyResidence !== undefined) addField("Primary Residence", asset.isPrimaryFamilyResidence ? "Yes" : "No");
    if (asset.isIncomeGenerating !== undefined) addField("Income Generating", asset.isIncomeGenerating ? "Yes" : "No");

    // ============ LOCATION ============
    if (asset.location) {
      addSection("LOCATION");
      addField("Country", asset.location.country);
      addField("Province", asset.location.province);
      addField("City", asset.location.city);
      addField("District", asset.location.district);
      addField("Tehsil", asset.location.tehsil);
      addField("Area/Sector", asset.location.areaOrSector);
      addField("Society/Project", asset.location.societyOrProject);
      addField("Block/Phase", asset.location.blockOrPhase);
      addField("Street Number", asset.location.streetNumber);
      addField("Plot Number", asset.location.plotNumber);
      addField("House Number", asset.location.houseNumber);
      addField("Apartment Number", asset.location.apartmentNumber);
      addField("Floor Number", asset.location.floorNumber);
      addField("Full Address", asset.location.fullAddress);
      addField("Nearest Landmark", asset.location.nearestLandmark);
      if (asset.location.geoCoordinates?.lat && asset.location.geoCoordinates?.lng) {
        addField("GPS Coordinates", `${asset.location.geoCoordinates.lat}, ${asset.location.geoCoordinates.lng}`);
      }
    }

    // ============ DIMENSIONS (for plots) ============
    if (asset.dimensions) {
      addSection("DIMENSIONS");
      if (asset.dimensions.totalArea) {
        addField("Total Area", `${asset.dimensions.totalArea.value} ${asset.dimensions.totalArea.unit}`);
      }
      addField("Area in Sq Ft", asset.dimensions.convertedAreaSqFt);
      addField("Front Width", asset.dimensions.frontWidthFt ? `${asset.dimensions.frontWidthFt} ft` : null);
      addField("Depth", asset.dimensions.depthFt ? `${asset.dimensions.depthFt} ft` : null);
      if (asset.dimensions.isCornerPlot !== undefined) addField("Corner Plot", asset.dimensions.isCornerPlot ? "Yes" : "No");
      if (asset.dimensions.isParkFacing !== undefined) addField("Park Facing", asset.dimensions.isParkFacing ? "Yes" : "No");
      if (asset.dimensions.isMainRoadFacing !== undefined) addField("Main Road Facing", asset.dimensions.isMainRoadFacing ? "Yes" : "No");
    }

    // ============ STRUCTURE (for houses/apartments) ============
    if (asset.structure) {
      addSection("STRUCTURE DETAILS");
      if (asset.structure.landArea) {
        addField("Land Area", `${asset.structure.landArea.value} ${asset.structure.landArea.unit}`);
      }
      addField("Covered Area", asset.structure.coveredAreaSqFt ? `${asset.structure.coveredAreaSqFt} sq ft` : null);
      addField("Number of Floors", asset.structure.floors);
      addField("Total Rooms", asset.structure.rooms);
      addField("Bedrooms", asset.structure.bedrooms);
      addField("Bathrooms", asset.structure.bathrooms);
      addField("Kitchens", asset.structure.kitchens);
      addField("Drawing Rooms", asset.structure.drawingRooms);
      addField("TV Lounges", asset.structure.tvLounges);
      addField("Store Rooms", asset.structure.storeRooms);
      if (asset.structure.servantQuarters !== undefined) addField("Servant Quarters", asset.structure.servantQuarters ? "Yes" : "No");
      addField("Parking/Garage", asset.structure.garageOrParking);
      addField("Construction Year", asset.structure.constructionYear);
      addField("Condition", asset.structure.conditionSummary);
    }

    // ============ VEHICLE SPECIFICATIONS ============
    if (asset.specs) {
      addSection("VEHICLE SPECIFICATIONS");
      addField("Make", asset.specs.make);
      addField("Model", asset.specs.model);
      addField("Model Year", asset.specs.modelYear);
      addField("Color", asset.specs.color);
      addField("Engine Capacity", asset.specs.engineCapacityCC ? `${asset.specs.engineCapacityCC} CC` : null);
      addField("Fuel Type", asset.specs.fuelType);
      addField("Transmission", asset.specs.transmission);
      addField("Odometer Reading", asset.specs.odometerKm ? `${asset.specs.odometerKm} km` : null);
      addField("Chassis Number", asset.specs.chassisNumber);
      addField("Engine Number", asset.specs.engineNumber);
    }

    // ============ VEHICLE REGISTRATION ============
    if (asset.registration) {
      addSection("VEHICLE REGISTRATION");
      addField("Registration Number", asset.registration.registrationNumber);
      addField("Registration City", asset.registration.registrationCity);
      addField("Registration Date", formatDate(asset.registration.registrationDate));
      addField("Token Tax Paid Till", formatDate(asset.registration.tokenTaxPaidTill));
      addField("Insurance Valid Till", formatDate(asset.registration.insuranceValidTill));
      addField("Fitness Valid Till", formatDate(asset.registration.fitnessValidTill));
    }

    // ============ OWNERSHIP ============
    if (asset.owners && asset.owners.length > 0) {
      addSection("OWNERSHIP");
      asset.owners.forEach((owner, idx) => {
        checkNewPage(10);
        doc.setFont(undefined, 'bold');
        doc.text(`Owner ${idx + 1}:`, leftMargin, y);
        doc.setFont(undefined, 'normal');
        doc.text(`${owner.personName} (${owner.percentage}%)`, leftMargin + 25, y);
        y += lineHeight;
        doc.text(`Type: ${owner.ownershipType || 'N/A'}`, leftMargin + 25, y);
        y += lineHeight + 2;
      });
    }

    // ============ ACQUISITION INFORMATION ============
    if (asset.acquisitionInfo) {
      addSection("ACQUISITION INFORMATION");
      addField("Acquired Date", formatDate(asset.acquisitionInfo.acquiredDate));
      addField("Acquisition Method", asset.acquisitionInfo.method);
      addField("Acquired From", asset.acquisitionInfo.acquiredFrom);
      addField("Purchase Price", formatCurrency(asset.acquisitionInfo.priceOrValueAtAcquisitionPKR));
      addField("Acquisition Notes", asset.acquisitionInfo.notes);
    }

    // ============ VALUATION ============
    if (asset.valuation) {
      addSection("VALUATION");
      addField("Estimated Market Value", formatCurrency(asset.valuation.estimatedMarketValuePKR));
      addField("Valuation Date", formatDate(asset.valuation.estimatedDate));
      addField("Valuation Source", asset.valuation.source);
      addField("Forced Sale Value", formatCurrency(asset.valuation.forcedSaleValuePKR));
      addField("Valuation Notes", asset.valuation.valuationNotes);
    }

    // ============ MUTATION & TITLE ============
    if (asset.mutationAndTitle) {
      addSection("MUTATION & TITLE");
      addField("Registry Number", asset.mutationAndTitle.registryNumber);
      addField("Registry Date", formatDate(asset.mutationAndTitle.registryDate));
      addField("Mutation Number", asset.mutationAndTitle.mutationNumber);
      addField("Mutation Date", formatDate(asset.mutationAndTitle.mutationDate));
      addField("Fard Number", asset.mutationAndTitle.fardNumber);
      addField("Khasra Number", asset.mutationAndTitle.khasraNumber);
      addField("Property Tax Number", asset.mutationAndTitle.propertyTaxNumber);
      if (asset.mutationAndTitle.isTitleClear !== undefined) {
        addField("Title Clear", asset.mutationAndTitle.isTitleClear ? "Yes" : "No");
      }
      addField("Title Notes", asset.mutationAndTitle.titleNotes);
    }

    // ============ COMPLIANCE ============
    if (asset.compliance) {
      addSection("COMPLIANCE");
      addField("Annual Property Tax", formatCurrency(asset.compliance.annualPropertyTaxPKR));
      addField("Property Tax Paid Till", formatDate(asset.compliance.propertyTaxPaidTill));
      addField("Electricity Bill Number", asset.compliance.electricityBillNumber);
      addField("Gas Bill Number", asset.compliance.gasBillNumber);
      addField("Water Bill Number", asset.compliance.waterBillNumber);
      addField("Encroachment Risk", asset.compliance.encroachmentRisk);
      addField("Govt Acquisition Risk", asset.compliance.govtAcquisitionRisk);
    }

    // ============ DISPUTE INFORMATION ============
    if (asset.disputeInfo) {
      addSection("DISPUTE INFORMATION");
      addField("In Dispute", asset.disputeInfo.isInDispute ? "YES" : "NO");
      if (asset.disputeInfo.isInDispute) {
        addField("Dispute Type", asset.disputeInfo.type);
        addField("Started Date", formatDate(asset.disputeInfo.startedDate));
        addField("Details", asset.disputeInfo.details);
        addField("Lawyer Name", asset.disputeInfo.lawyerName);
        addField("Lawyer Phone", asset.disputeInfo.lawyerPhone);
        addField("Case Number", asset.disputeInfo.caseNumber);
        addField("Court Name", asset.disputeInfo.courtName);
        addField("Next Hearing", formatDate(asset.disputeInfo.nextHearingDate));
      }
    }

    // ============ RELATED CONTACTS ============
    if (asset.relatedContacts && asset.relatedContacts.length > 0) {
      addSection("RELATED CONTACTS");
      asset.relatedContacts.forEach((contact, idx) => {
        checkNewPage(20);
        doc.setFont(undefined, 'bold');
        doc.text(`Contact ${idx + 1}: ${contact.name}`, leftMargin, y);
        y += lineHeight;
        doc.setFont(undefined, 'normal');
        doc.text(`Category: ${contact.category.replace(/_/g, " ")}`, leftMargin + 5, y);
        y += lineHeight;
        doc.text(`Phone: ${contact.phoneNumber}`, leftMargin + 5, y);
        y += lineHeight;
        if (contact.email) {
          doc.text(`Email: ${contact.email}`, leftMargin + 5, y);
          y += lineHeight;
        }
        if (contact.cnic) {
          doc.text(`CNIC: ${contact.cnic}`, leftMargin + 5, y);
          y += lineHeight;
        }
        if (contact.address) {
          doc.text(`Address: ${contact.address}`, leftMargin + 5, y);
          y += lineHeight;
        }
        if (contact.notes) {
          const notesLines = doc.splitTextToSize(`Notes: ${contact.notes}`, pageWidth - 20);
          notesLines.forEach(line => {
            checkNewPage(8);
            doc.text(line, leftMargin + 5, y);
            y += lineHeight;
          });
        }
        y += 3;
      });
    }

    // ============ HISTORY ============
    if (asset.history && asset.history.length > 0) {
      addSection("HISTORY TIMELINE");
      asset.history.forEach((entry, idx) => {
        checkNewPage(15);
        doc.setFont(undefined, 'bold');
        doc.text(`${formatDate(entry.date)} - ${entry.action}`, leftMargin, y);
        y += lineHeight;
        doc.setFont(undefined, 'normal');
        if (entry.details) {
          const detailLines = doc.splitTextToSize(entry.details, pageWidth - 20);
          detailLines.forEach(line => {
            checkNewPage(8);
            doc.text(line, leftMargin + 5, y);
            y += lineHeight;
          });
        }
        if (entry.actor) {
          doc.text(`By: ${entry.actor}`, leftMargin + 5, y);
          y += lineHeight;
        }
        y += 2;
      });
    }

    // ============ TAGS ============
    if (asset.tags && asset.tags.length > 0) {
      addSection("TAGS");
      const tagsText = asset.tags.join(", ");
      const tagLines = doc.splitTextToSize(tagsText, pageWidth - 10);
      tagLines.forEach(line => {
        checkNewPage(8);
        doc.text(line, leftMargin, y);
        y += lineHeight;
      });
    }

    // ============ INTERNAL NOTES ============
    if (asset.notesInternal) {
      addSection("INTERNAL NOTES");
      const noteLines = doc.splitTextToSize(asset.notesInternal, pageWidth - 10);
      noteLines.forEach(line => {
        checkNewPage(8);
        doc.text(line, leftMargin, y);
        y += lineHeight;
      });
    }

    // ============ FLAGS ============
    if (asset.flags && (asset.flags.needsAttention || asset.flags.highValue || asset.flags.hasLegalIssues)) {
      addSection("FLAGS");
      if (asset.flags.needsAttention) {
        doc.text("* Needs Attention", leftMargin, y);
        y += lineHeight;
      }
      if (asset.flags.highValue) {
        doc.text("* High Value Asset", leftMargin, y);
        y += lineHeight;
      }
      if (asset.flags.hasLegalIssues) {
        doc.text("* Has Legal Issues", leftMargin, y);
        y += lineHeight;
      }
    }

    // ============ FOOTER ============
    checkNewPage(15);
    y += 10;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, leftMargin, y);
    y += 5;
    doc.text(`Asset ID: ${asset._id}`, leftMargin, y);

    // Save the PDF
    const filename = `${asset.title.replace(/[^a-z0-9]/gi, '_').substring(0, 50)}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  };

  const getGoogleMapsUrl = () => {
    if (asset.location?.geoCoordinates?.lat && asset.location?.geoCoordinates?.lng) {
      return `https://www.google.com/maps?q=${asset.location.geoCoordinates.lat},${asset.location.geoCoordinates.lng}`;
    }
    return null;
  };

  const getEmbedUrl = (url, fileType) => {
    if (!url) return null;
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/d\/([^\/]+)/)?.[1];
      return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
    }
    return url;
  };

  const getFileType = (url, fileType) => {
    if (fileType) return fileType;
    const ext = url?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image';
    if (['pdf'].includes(ext)) return 'pdf';
    return 'other';
  };

  const mapsUrl = getGoogleMapsUrl();

  return (
    <>
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        overflowY: "auto"
      }} onClick={onClose}>
        <div style={{
          background: "white",
          borderRadius: "8px",
          maxWidth: "1000px",
          width: "100%",
          padding: "2rem",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative"
        }} onClick={(e) => e.stopPropagation()}>
          
          {/* Header with Download PDF */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", borderBottom: "2px solid #7FC6A4", paddingBottom: "1rem" }}>
            <h2 style={{ margin: 0, color: "#6D7692" }}>{asset.title}</h2>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={downloadPDF} style={{ background: "#2196F3", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}>
                📥 Download PDF
              </button>
              <button onClick={onClose} style={{ background: "#ef5350", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "4px", cursor: "pointer" }}>
                ✕ Close
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <section style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
              📋 Basic Information
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
              {asset.nickname && (
                <>
                  <strong>Nickname:</strong>
                  <span>{asset.nickname}</span>
                </>
              )}
              
              <strong>Title:</strong>
              <span>{asset.title || "N/A"}</span>
              
              <strong>Asset Type:</strong>
              <span>{asset.assetType?.replace(/_/g, " ") || "N/A"}</span>
              
              {asset.description && (
                <>
                  <strong>Description:</strong>
                  <span>{asset.description}</span>
                </>
              )}
              
              <strong>Current Status:</strong>
              <span style={{ color: asset.currentStatus === "clean" ? "green" : "red" }}>
                {asset.currentStatus?.replace(/_/g, " ") || "N/A"}
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
                  <span>{asset.isPrimaryFamilyResidence ? "Yes" : "No"}</span>
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

          {/* Location */}
          {asset.location && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                📍 Location
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
                <strong>Country:</strong>
                <span>{asset.location.country || "N/A"}</span>
                
                <strong>Province:</strong>
                <span>{asset.location.province || "N/A"}</span>
                
                <strong>City:</strong>
                <span>{asset.location.city || "N/A"}</span>
                
                <strong>District:</strong>
                <span>{asset.location.district || "N/A"}</span>
                
                <strong>Tehsil:</strong>
                <span>{asset.location.tehsil || "N/A"}</span>
                
                <strong>Area/Sector:</strong>
                <span>{asset.location.areaOrSector || "N/A"}</span>
                
                <strong>Society/Project:</strong>
                <span>{asset.location.societyOrProject || "N/A"}</span>
                
                <strong>Block/Phase:</strong>
                <span>{asset.location.blockOrPhase || "N/A"}</span>
                
                <strong>Street Number:</strong>
                <span>{asset.location.streetNumber || "N/A"}</span>
                
                <strong>Plot Number:</strong>
                <span>{asset.location.plotNumber || "N/A"}</span>
                
                <strong>House Number:</strong>
                <span>{asset.location.houseNumber || "N/A"}</span>
                
                <strong>Apartment Number:</strong>
                <span>{asset.location.apartmentNumber || "N/A"}</span>
                
                <strong>Floor Number:</strong>
                <span>{asset.location.floorNumber || "N/A"}</span>
                
                <strong>Full Address:</strong>
                <span>{asset.location.fullAddress || "N/A"}</span>
                
                <strong>Nearest Landmark:</strong>
                <span>{asset.location.nearestLandmark || "N/A"}</span>
                
                {asset.location.geoCoordinates?.lat && asset.location.geoCoordinates?.lng && (
                  <>
                    <strong>Coordinates:</strong>
                    <span>{asset.location.geoCoordinates.lat}, {asset.location.geoCoordinates.lng}</span>
                  </>
                )}
              </div>

              {mapsUrl && (
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  background: "#4CAF50",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontWeight: "600"
                }}>
                  <span style={{ fontSize: "1.2rem" }}>📍</span>
                  <span>Open Location in Google Maps</span>
                  <span style={{ fontSize: "0.9rem" }}>↗</span>
                </a>
              )}
            </section>
          )}

          {/* Dimensions (for plots) */}
          {asset.dimensions && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                📐 Dimensions
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
                {asset.dimensions.totalArea && (
                  <>
                    <strong>Total Area:</strong>
                    <span>{asset.dimensions.totalArea.value} {asset.dimensions.totalArea.unit}</span>
                  </>
                )}
                
                <strong>Area (Sq Ft):</strong>
                <span>{asset.dimensions.convertedAreaSqFt || "N/A"}</span>
                
                <strong>Front Width:</strong>
                <span>{asset.dimensions.frontWidthFt ? `${asset.dimensions.frontWidthFt} ft` : "N/A"}</span>
                
                <strong>Depth:</strong>
                <span>{asset.dimensions.depthFt ? `${asset.dimensions.depthFt} ft` : "N/A"}</span>
                
                <strong>Corner Plot:</strong>
                <span>{asset.dimensions.isCornerPlot !== undefined ? (asset.dimensions.isCornerPlot ? "Yes" : "No") : "N/A"}</span>
                
                <strong>Park Facing:</strong>
                <span>{asset.dimensions.isParkFacing !== undefined ? (asset.dimensions.isParkFacing ? "Yes" : "No") : "N/A"}</span>
                
                <strong>Main Road Facing:</strong>
                <span>{asset.dimensions.isMainRoadFacing !== undefined ? (asset.dimensions.isMainRoadFacing ? "Yes" : "No") : "N/A"}</span>
              </div>
            </section>
          )}

          {/* Structure (for houses/apartments) */}
          {asset.structure && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                🏗️ Structure
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
                {asset.structure.landArea && (
                  <>
                    <strong>Land Area:</strong>
                    <span>{asset.structure.landArea.value} {asset.structure.landArea.unit}</span>
                  </>
                )}
                
                <strong>Covered Area (Sq Ft):</strong>
                <span>{asset.structure.coveredAreaSqFt || "N/A"}</span>
                
                <strong>Floors:</strong>
                <span>{asset.structure.floors || "N/A"}</span>
                
                <strong>Rooms:</strong>
                <span>{asset.structure.rooms || "N/A"}</span>
                
                <strong>Bedrooms:</strong>
                <span>{asset.structure.bedrooms || "N/A"}</span>
                
                <strong>Bathrooms:</strong>
                <span>{asset.structure.bathrooms || "N/A"}</span>
                
                <strong>Kitchens:</strong>
                <span>{asset.structure.kitchens || "N/A"}</span>
                
                <strong>Drawing Rooms:</strong>
                <span>{asset.structure.drawingRooms || "N/A"}</span>
                
                <strong>TV Lounges:</strong>
                <span>{asset.structure.tvLounges || "N/A"}</span>
                
                <strong>Store Rooms:</strong>
                <span>{asset.structure.storeRooms || "N/A"}</span>
                
                <strong>Servant Quarters:</strong>
                <span>{asset.structure.servantQuarters !== undefined ? (asset.structure.servantQuarters ? "Yes" : "No") : "N/A"}</span>
                
                <strong>Garage/Parking:</strong>
                <span>{asset.structure.garageOrParking || "N/A"}</span>
                
                <strong>Construction Year:</strong>
                <span>{asset.structure.constructionYear || "N/A"}</span>
                
                <strong>Condition:</strong>
                <span>{asset.structure.conditionSummary || "N/A"}</span>
              </div>
            </section>
          )}

          {/* Vehicle Specs */}
          {asset.specs && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                🚗 Vehicle Specifications
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
                <strong>Make:</strong>
                <span>{asset.specs.make || "N/A"}</span>
                
                <strong>Model:</strong>
                <span>{asset.specs.model || "N/A"}</span>
                
                <strong>Year:</strong>
                <span>{asset.specs.modelYear || "N/A"}</span>
                
                <strong>Color:</strong>
                <span>{asset.specs.color || "N/A"}</span>
                
                <strong>Engine Capacity:</strong>
                <span>{asset.specs.engineCapacityCC ? `${asset.specs.engineCapacityCC} CC` : "N/A"}</span>
                
                <strong>Fuel Type:</strong>
                <span>{asset.specs.fuelType || "N/A"}</span>
                
                <strong>Transmission:</strong>
                <span>{asset.specs.transmission || "N/A"}</span>
                
                <strong>Odometer (km):</strong>
                <span>{asset.specs.odometerKm || "N/A"}</span>
                
                <strong>Chassis Number:</strong>
                <span>{asset.specs.chassisNumber || "N/A"}</span>
                
                <strong>Engine Number:</strong>
                <span>{asset.specs.engineNumber || "N/A"}</span>
              </div>
            </section>
          )}

          {/* Registration (for vehicles) */}
          {asset.registration && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                📝 Registration
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
                <strong>Registration Number:</strong>
                <span>{asset.registration.registrationNumber || "N/A"}</span>
                
                <strong>Registration City:</strong>
                <span>{asset.registration.registrationCity || "N/A"}</span>
                
                <strong>Registration Date:</strong>
                <span>{formatDate(asset.registration.registrationDate)}</span>
                
                <strong>Token Tax Paid Till:</strong>
                <span>{formatDate(asset.registration.tokenTaxPaidTill)}</span>
                
                <strong>Insurance Valid Till:</strong>
                <span>{formatDate(asset.registration.insuranceValidTill)}</span>
                
                <strong>Fitness Valid Till:</strong>
                <span>{formatDate(asset.registration.fitnessValidTill)}</span>
              </div>
            </section>
          )}

          {/* Ownership */}
          {asset.owners && asset.owners.length > 0 && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                👥 Ownership
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    <th style={{ padding: "0.75rem", border: "1px solid #ddd", textAlign: "left" }}>Owner Name</th>
                    <th style={{ padding: "0.75rem", border: "1px solid #ddd", textAlign: "center" }}>Percentage</th>
                    <th style={{ padding: "0.75rem", border: "1px solid #ddd", textAlign: "left" }}>Ownership Type</th>
                  </tr>
                </thead>
                <tbody>
                  {asset.owners.map((owner, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>{owner.personName}</td>
                      <td style={{ padding: "0.75rem", border: "1px solid #ddd", textAlign: "center" }}>{owner.percentage}%</td>
                      <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>{owner.ownershipType || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Acquisition */}
          {asset.acquisitionInfo && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                💰 Acquisition
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
                <strong>Acquired Date:</strong>
                <span>{formatDate(asset.acquisitionInfo.acquiredDate)}</span>
                
                <strong>Method:</strong>
                <span>{asset.acquisitionInfo.method || "N/A"}</span>
                
                <strong>Acquired From:</strong>
                <span>{asset.acquisitionInfo.acquiredFrom || "N/A"}</span>
                
                <strong>Price at Acquisition:</strong>
                <span>{formatCurrency(asset.acquisitionInfo.priceOrValueAtAcquisitionPKR)}</span>
                
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
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                💵 Valuation
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
                <strong>Market Value:</strong>
                <span>{formatCurrency(asset.valuation.estimatedMarketValuePKR)}</span>
                
                <strong>Estimated Date:</strong>
                <span>{formatDate(asset.valuation.estimatedDate)}</span>
                
                <strong>Source:</strong>
                <span>{asset.valuation.source || "N/A"}</span>
                
                <strong>Forced Sale Value:</strong>
                <span>{formatCurrency(asset.valuation.forcedSaleValuePKR)}</span>
                
                {asset.valuation.valuationNotes && (
                  <>
                    <strong>Notes:</strong>
                    <span>{asset.valuation.valuationNotes}</span>
                  </>
                )}
              </div>
            </section>
          )}

          {/* Mutation & Title */}
          {asset.mutationAndTitle && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                📜 Mutation & Title
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
                <strong>Registry Number:</strong>
                <span>{asset.mutationAndTitle.registryNumber || "N/A"}</span>
                
                <strong>Registry Date:</strong>
                <span>{formatDate(asset.mutationAndTitle.registryDate)}</span>
                
                <strong>Mutation Number:</strong>
                <span>{asset.mutationAndTitle.mutationNumber || "N/A"}</span>
                
                <strong>Mutation Date:</strong>
                <span>{formatDate(asset.mutationAndTitle.mutationDate)}</span>
                
                <strong>Fard Number:</strong>
                <span>{asset.mutationAndTitle.fardNumber || "N/A"}</span>
                
                <strong>Khasra Number:</strong>
                <span>{asset.mutationAndTitle.khasraNumber || "N/A"}</span>
                
                <strong>Property Tax Number:</strong>
                <span>{asset.mutationAndTitle.propertyTaxNumber || "N/A"}</span>
                
                <strong>Title Clear:</strong>
                <span style={{ color: asset.mutationAndTitle.isTitleClear ? "green" : "red" }}>
                  {asset.mutationAndTitle.isTitleClear !== undefined ? (asset.mutationAndTitle.isTitleClear ? "Yes" : "No") : "N/A"}
                </span>
                
                {asset.mutationAndTitle.titleNotes && (
                  <>
                    <strong>Title Notes:</strong>
                    <span>{asset.mutationAndTitle.titleNotes}</span>
                  </>
                )}
              </div>
            </section>
          )}

          {/* Compliance */}
          {asset.compliance && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                ✅ Compliance
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
                <strong>Annual Property Tax:</strong>
                <span>{formatCurrency(asset.compliance.annualPropertyTaxPKR)}</span>
                
                <strong>Tax Paid Till:</strong>
                <span>{formatDate(asset.compliance.propertyTaxPaidTill)}</span>
                
                <strong>Electricity Bill Number:</strong>
                <span>{asset.compliance.electricityBillNumber || "N/A"}</span>
                
                <strong>Gas Bill Number:</strong>
                <span>{asset.compliance.gasBillNumber || "N/A"}</span>
                
                <strong>Water Bill Number:</strong>
                <span>{asset.compliance.waterBillNumber || "N/A"}</span>
                
                <strong>Encroachment Risk:</strong>
                <span>{asset.compliance.encroachmentRisk || "N/A"}</span>
                
                <strong>Govt Acquisition Risk:</strong>
                <span>{asset.compliance.govtAcquisitionRisk || "N/A"}</span>
              </div>
            </section>
          )}

          {/* Dispute Info */}
          {asset.disputeInfo && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                ⚖️ Dispute Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0.75rem", fontSize: "0.95rem" }}>
                <strong>In Dispute:</strong>
                <span style={{ color: asset.disputeInfo.isInDispute ? "red" : "green" }}>
                  {asset.disputeInfo.isInDispute ? "Yes" : "No"}
                </span>
                
                {asset.disputeInfo.isInDispute && (
                  <>
                    <strong>Dispute Type:</strong>
                    <span>{asset.disputeInfo.type || "N/A"}</span>
                    
                    <strong>Started Date:</strong>
                    <span>{formatDate(asset.disputeInfo.startedDate)}</span>
                    
                    <strong>Details:</strong>
                    <span>{asset.disputeInfo.details || "N/A"}</span>
                    
                    <strong>Lawyer Name:</strong>
                    <span>{asset.disputeInfo.lawyerName || "N/A"}</span>
                    
                    <strong>Lawyer Phone:</strong>
                    <span>{asset.disputeInfo.lawyerPhone || "N/A"}</span>
                    
                    <strong>Case Number:</strong>
                    <span>{asset.disputeInfo.caseNumber || "N/A"}</span>
                    
                    <strong>Court Name:</strong>
                    <span>{asset.disputeInfo.courtName || "N/A"}</span>
                    
                    <strong>Next Hearing Date:</strong>
                    <span>{formatDate(asset.disputeInfo.nextHearingDate)}</span>
                  </>
                )}
              </div>
            </section>
          )}

          {/* Related Contacts */}
          {asset.relatedContacts && asset.relatedContacts.length > 0 && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                📞 Related Contacts
              </h3>
              <div style={{ display: "grid", gap: "1rem" }}>
                {asset.relatedContacts.map((contact, idx) => (
                  <div key={idx} style={{ 
                    padding: "1rem", 
                    background: "#f9f9f9", 
                    borderRadius: "6px", 
                    borderLeft: contact.category === "conflict_person" ? "4px solid #f44336" : "4px solid #7FC6A4" 
                  }}>
                    <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "0.5rem", fontSize: "0.95rem" }}>
                      <strong>Category:</strong>
                      <span style={{ 
                        textTransform: "capitalize", 
                        color: contact.category === "conflict_person" ? "#c62828" : "#333",
                        fontWeight: contact.category === "conflict_person" ? "600" : "400"
                      }}>
                        {contact.category === "conflict_person" && "⚠️ "}
                        {contact.category.replace(/_/g, " ")}
                      </span>
                      
                      <strong>Name:</strong>
                      <span>{contact.name}</span>
                      
                      <strong>Phone:</strong>
                      <a href={`tel:${contact.phoneNumber}`} style={{ color: "#2196F3", textDecoration: "none" }}>
                        {contact.phoneNumber}
                      </a>
                      
                      {contact.email && (
                        <>
                          <strong>Email:</strong>
                          <a href={`mailto:${contact.email}`} style={{ color: "#2196F3", textDecoration: "none" }}>
                            {contact.email}
                          </a>
                        </>
                      )}
                      
                      {contact.cnic && (
                        <>
                          <strong>CNIC:</strong>
                          <span>{contact.cnic}</span>
                        </>
                      )}
                      
                      {contact.address && (
                        <>
                          <strong>Address:</strong>
                          <span>{contact.address}</span>
                        </>
                      )}
                      
                      {contact.notes && (
                        <>
                          <strong>Notes:</strong>
                          <span style={{ color: "#666" }}>{contact.notes}</span>
                        </>
                      )}
                      
                      {contact.addedAt && (
                        <>
                          <strong>Added:</strong>
                          <span style={{ fontSize: "0.85rem", color: "#999" }}>
                            {formatDate(contact.addedAt)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Documents */}
          {asset.documents && asset.documents.length > 0 && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                📄 Documents ({asset.documents.length})
              </h3>
              <div style={{ display: "grid", gap: "1rem" }}>
                {asset.documents.map((doc, idx) => (
                  <div key={idx} style={{ padding: "1rem", background: "#f5f5f5", borderRadius: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong>{doc.label}</strong>
                        {doc.docType && <span style={{ marginLeft: "0.5rem", fontSize: "0.85rem", color: "#666" }}>({doc.docType})</span>}
                        {doc.notes && <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", color: "#666" }}>{doc.notes}</p>}
                      </div>
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "0.5rem 1rem", background: "#2196F3", color: "white", textDecoration: "none", borderRadius: "4px", fontSize: "0.85rem" }}>
                        View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* History Timeline */}
          {asset.history && asset.history.length > 0 && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                📜 History Timeline
              </h3>
              <div style={{ borderLeft: "3px solid #7FC6A4", paddingLeft: "1.5rem" }}>
                {asset.history.map((entry, idx) => (
                  <div key={idx} style={{ marginBottom: "1.5rem", position: "relative" }}>
                    <div style={{ position: "absolute", left: "-1.75rem", top: "0.25rem", width: "12px", height: "12px", borderRadius: "50%", background: "#7FC6A4", border: "3px solid white" }}></div>
                    <div style={{ fontSize: "0.85rem", color: "#999", marginBottom: "0.25rem" }}>
                      {formatDate(entry.date)}
                    </div>
                    <div style={{ fontWeight: "600", color: "#333", marginBottom: "0.25rem" }}>
                      {entry.action}
                    </div>
                    {entry.details && <div style={{ fontSize: "0.9rem", color: "#666" }}>{entry.details}</div>}
                    {entry.actor && <div style={{ fontSize: "0.85rem", color: "#999", marginTop: "0.25rem" }}>By: {entry.actor}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          {asset.tags && asset.tags.length > 0 && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                🏷️ Tags
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {asset.tags.map((tag, idx) => (
                  <span key={idx} style={{ padding: "0.4rem 0.8rem", background: "#e3f2fd", color: "#1976d2", borderRadius: "16px", fontSize: "0.85rem", fontWeight: "500" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Internal Notes */}
          {asset.notesInternal && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                📝 Internal Notes
              </h3>
              <p style={{ background: "#fff9e6", padding: "1rem", borderRadius: "4px", color: "#666", margin: 0 }}>
                {asset.notesInternal}
              </p>
            </section>
          )}

          {/* Flags */}
          {asset.flags && Object.values(asset.flags).some(v => v === true) && (
            <section style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#6D7692", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                🚩 Flags
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {asset.flags.needsAttention && (
                  <span style={{ padding: "0.5rem 1rem", background: "#fff3cd", color: "#856404", borderRadius: "4px", fontSize: "0.9rem", fontWeight: "500" }}>
                    ⚠️ Needs Attention
                  </span>
                )}
                {asset.flags.highValue && (
                  <span style={{ padding: "0.5rem 1rem", background: "#d4edda", color: "#155724", borderRadius: "4px", fontSize: "0.9rem", fontWeight: "500" }}>
                    💎 High Value
                  </span>
                )}
                {asset.flags.hasLegalIssues && (
                  <span style={{ padding: "0.5rem 1rem", background: "#f8d7da", color: "#721c24", borderRadius: "4px", fontSize: "0.9rem", fontWeight: "500" }}>
                    ⚖️ Legal Issues
                  </span>
                )}
              </div>
            </section>
          )}

          {/* Timestamps */}
          <section style={{ padding: "1rem", background: "#f9f9f9", borderRadius: "4px", fontSize: "0.85rem", color: "#666" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Created: {formatDate(asset.createdAt)}</span>
              <span>Updated: {formatDate(asset.updatedAt)}</span>
            </div>
          </section>

        </div>
      </div>

      {/* Document Viewer Modal */}
      {viewingDoc && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.95)",
          zIndex: 10001,
          display: "flex",
          flexDirection: "column",
          padding: "1rem"
        }} onClick={() => setViewingDoc(null)}>
          <div style={{ textAlign: "right", marginBottom: "1rem" }}>
            <button onClick={() => setViewingDoc(null)} style={{ padding: "0.5rem 1rem", background: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              ✕ Close
            </button>
          </div>
          <iframe src={getEmbedUrl(viewingDoc.fileUrl, viewingDoc.fileType)} style={{ flex: 1, border: "none", borderRadius: "4px" }} />
        </div>
      )}
    </>
  );
}
