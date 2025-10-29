"use client";

import { jsPDF } from "jspdf";

export default function DownloadPDFButton({ asset }) {
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return `PKR ${Number(amount).toLocaleString()}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Helper to add new page if needed
    const checkPageBreak = () => {
      if (yPos > pageHeight - margin) {
        doc.addPage();
        yPos = 20;
      }
    };

    // Helper to add section header
    const addSectionHeader = (title) => {
      checkPageBreak();
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text(title, margin, yPos);
      yPos += lineHeight + 2;
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
    };

    // Helper to add field
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
      addField("Nearest Landmark", asset.location.nearestLandmark);
      yPos += 3;
    }

    // Dimensions (Plot)
    if (asset.dimensions) {
      addSectionHeader("Dimensions");
      if (asset.dimensions.totalArea) {
        addField("Total Area", `${asset.dimensions.totalArea.value} ${asset.dimensions.totalArea.unit}`);
      }
      addField("Area (Sq Ft)", asset.dimensions.convertedAreaSqFt);
      addField("Front Width", asset.dimensions.frontWidthFt ? `${asset.dimensions.frontWidthFt} ft` : null);
      addField("Depth", asset.dimensions.depthFt ? `${asset.dimensions.depthFt} ft` : null);
      yPos += 3;
    }

    // Structure (House/Apartment)
    if (asset.structure) {
      addSectionHeader("Structure");
      if (asset.structure.landArea) {
        addField("Land Area", `${asset.structure.landArea.value} ${asset.structure.landArea.unit}`);
      }
      addField("Covered Area", asset.structure.coveredAreaSqFt ? `${asset.structure.coveredAreaSqFt} sq ft` : null);
      addField("Floors", asset.structure.floors);
      addField("Rooms", asset.structure.rooms);
      addField("Bedrooms", asset.structure.bedrooms);
      addField("Bathrooms", asset.structure.bathrooms);
      yPos += 3;
    }

    // Vehicle Specs
    if (asset.specs) {
      addSectionHeader("Vehicle Specifications");
      addField("Make", asset.specs.make);
      addField("Model", asset.specs.model);
      addField("Year", asset.specs.modelYear);
      addField("Color", asset.specs.color);
      addField("Fuel Type", asset.specs.fuelType);
      addField("Odometer", asset.specs.odometerKm ? `${asset.specs.odometerKm} km` : null);
      yPos += 3;
    }

    // Registration (Vehicle)
    if (asset.registration) {
      addSectionHeader("Registration");
      addField("Registration #", asset.registration.registrationNumber);
      addField("City", asset.registration.registrationCity);
      addField("Token Tax Till", formatDate(asset.registration.tokenTaxPaidTill));
      yPos += 3;
    }

    // Ownership
    if (asset.owners && asset.owners.length > 0) {
      addSectionHeader("Ownership");
      asset.owners.forEach((owner, idx) => {
        checkPageBreak();
        doc.text(`${idx + 1}. ${owner.personName} - ${owner.percentage}% (${owner.ownershipType})`, margin, yPos);
        yPos += lineHeight;
      });
      yPos += 3;
    }

    // Acquisition
    if (asset.acquisitionInfo) {
      addSectionHeader("Acquisition Information");
      addField("Date", formatDate(asset.acquisitionInfo.acquiredDate));
      addField("Method", asset.acquisitionInfo.method);
      addField("From", asset.acquisitionInfo.acquiredFrom);
      addField("Price", formatCurrency(asset.acquisitionInfo.priceOrValueAtAcquisitionPKR));
      addField("Notes", asset.acquisitionInfo.notes);
      yPos += 3;
    }

    // Valuation
    if (asset.valuation) {
      addSectionHeader("Valuation");
      addField("Market Value", formatCurrency(asset.valuation.estimatedMarketValuePKR));
      addField("Estimated Date", formatDate(asset.valuation.estimatedDate));
      addField("Source", asset.valuation.source);
      addField("Forced Sale Value", formatCurrency(asset.valuation.forcedSaleValuePKR));
      yPos += 3;
    }

    // Mutation & Title
    if (asset.mutationAndTitle) {
      addSectionHeader("Mutation & Title");
      addField("Registry #", asset.mutationAndTitle.registryNumber);
      addField("Mutation #", asset.mutationAndTitle.mutationNumber);
      addField("Property Tax #", asset.mutationAndTitle.propertyTaxNumber);
      addField("Title Clear", asset.mutationAndTitle.isTitleClear ? "Yes" : "No");
      yPos += 3;
    }

    // Compliance
    if (asset.compliance) {
      addSectionHeader("Compliance");
      addField("Annual Tax", formatCurrency(asset.compliance.annualPropertyTaxPKR));
      addField("Tax Paid Till", formatDate(asset.compliance.propertyTaxPaidTill));
      addField("Encroachment Risk", asset.compliance.encroachmentRisk);
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
          doc.text(entry.details, margin + 5, yPos, { maxWidth: 170 });
          yPos += lineHeight;
        }
        yPos += 2;
      });
    }

    // Tags
    if (asset.tags && asset.tags.length > 0) {
      addSectionHeader("Tags");
      doc.text(asset.tags.join(", "), margin, yPos, { maxWidth: 170 });
      yPos += lineHeight + 3;
    }

    // Internal Notes
    if (asset.notesInternal) {
      addSectionHeader("Internal Notes");
      doc.text(asset.notesInternal, margin, yPos, { maxWidth: 170 });
    }

    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, "italic");
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} - Family Asset Registry`,
      margin,
      pageHeight - 10
    );

    // Save PDF
    const fileName = `${asset.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.pdf`;
    doc.save(fileName);
  };

  return (
    <button
      onClick={generatePDF}
      style={{
        padding: "0.75rem 1.5rem",
        background: "#2196F3",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <span>📥</span>
      Download PDF
    </button>
  );
}
