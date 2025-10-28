"use client";

import { useState, useEffect } from "react";
import PlotAssetForm from "./PlotAssetForm";
import HouseAssetForm from "./HouseAssetForm";
import ApartmentAssetForm from "./ApartmentAssetForm";
import VehicleAssetForm from "./VehicleAssetForm";

export default function AddAssetForm() {
  const [showForm, setShowForm] = useState(false);
  const [people, setPeople] = useState([]);
  const [activeSection, setActiveSection] = useState("basic");
  const [formData, setFormData] = useState({
    assetType: "land_plot",
    title: "",
    nickname: "",
    description: "",
    landUseType: "residential",
    zoningStatus: "",
    possessionStatus: "in_our_possession",
    currentStatus: "clean",
    location: {
      country: "Pakistan",
      city: "",
      tehsil: "",
      district: "",
      mouzaVillage: "",
      areaOrSector: "",
      blockOrPhase: "",
      streetNumber: "",
      plotNumber: "",
      khasraNumber: "",
      fullAddress: "",
      boundaryDescription: "",
      rightOfWayAccess: "",
      nearestLandmark: "",
    },
    dimensions: {
      totalArea: { value: "", unit: "marla" },
      convertedAreaSqFt: "",
      frontWidthFt: "",
      depthFt: "",
      isCornerPlot: false,
      isParkFacing: false,
      isMainRoadFacing: false,
    },
    owners: [{ personId: "", percentage: 100, ownershipType: "legal owner" }],
    acquisitionInfo: {
      acquiredDate: "",
      acquiredFrom: "",
      method: "purchased",
      priceOrValueAtAcquisitionPKR: "",
      paymentMode: "",
      witnesses: [""],
      notes: "",
    },
    mutationAndTitle: {
      registryNumber: "",
      mutationNumber: "",
      fardNumber: "",
      propertyTaxNumber: "",
      landRecordAuthority: "",
      khatooniNumber: "",
      khewatNumber: "",
      jamabandiReference: "",
      isTitleClear: true,
      notes: "",
    },
    valuation: {
      estimatedMarketValuePKR: "",
      estimatedDate: "",
      source: "",
      forcedSaleValuePKR: "",
      notes: "",
    },
    compliance: {
      annualPropertyTaxPKR: "",
      propertyTaxPaidTill: "",
      anyGovernmentNotice: false,
      govtAcquisitionRisk: "none",
      encroachmentRisk: "none",
      plannedRoadWidening: false,
      notes: "",
    },
    possessionDetails: {
      whoPhysicallyControlsLand: "",
      isSomeoneElseSitting: false,
      encroachmentNotes: "",
      boundaryWallBuilt: false,
      gateLocked: false,
    },
    controlInfo: {
      whoHasPhysicalPapers: [{ holderName: "", relation: "", contact: "", notes: "" }],
      whereOriginalPapersAreStored: "",
      digitalCopiesStored: "",
    },
    history: [{ date: "", action: "", details: "", actor: "" }],
    documents: [{ label: "", fileUrl: "", docType: "ownership", issuedBy: "", issueDate: "", notes: "", isCritical: false }],
    flags: {
      inheritanceSensitive: false,
      familyDisputeRisk: "none",
      illegalOccupationRisk: false,
      noteForHeirs: "",
    },
    notesInternal: "",
    tags: [],
  });
  
  const [loading, setLoading] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState(null);

  useEffect(() => {
    if (showForm) {
      fetch("/api/people")
        .then((res) => res.json())
        .then((data) => setPeople(data));
    }
  }, [showForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to add asset");
      }
    } catch (error) {
      alert("Error adding asset");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: "basic", label: "Basic Info" },
    { id: "location", label: "Location" },
    { id: "dimensions", label: "Dimensions" },
    { id: "owners", label: "Ownership" },
    { id: "acquisition", label: "Acquisition" },
    { id: "mutation", label: "Mutation & Title" },
    { id: "valuation", label: "Valuation" },
    { id: "compliance", label: "Compliance" },
    { id: "possession", label: "Possession" },
    { id: "control", label: "Control Info" },
    { id: "history", label: "History" },
    { id: "documents", label: "Documents" },
    { id: "flags", label: "Flags & Notes" },
  ];

  const currentIndex = sections.findIndex(s => s.id === activeSection);
  const isLastSection = currentIndex === sections.length - 1;
  const isFirstSection = currentIndex === 0;

  const handleNext = () => {
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };

  if (!showForm) {
    return (
      <button onClick={() => setShowForm(true)} style={{ marginBottom: "1rem" }}>
        + Add Asset
      </button>
    );
  }

  if (!selectedAssetType) {
    return (
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2>Select Asset Type</h2>
        <p style={{ marginBottom: "1.5rem", color: "#666" }}>Choose the type of asset you want to add</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <button
            onClick={() => setSelectedAssetType("land_plot")}
            style={{ 
              padding: "2rem 1rem",
              background: "#e3f2fd",
              color: "#1976d2",
              fontSize: "1.1rem",
              fontWeight: "600"
            }}
          >
            🏞️ Land / Plot
          </button>
          
          <button
            onClick={() => setSelectedAssetType("house")}
            style={{ 
              padding: "2rem 1rem",
              background: "#f3e5f5",
              color: "#7b1fa2",
              fontSize: "1.1rem",
              fontWeight: "600"
            }}
          >
            🏠 House
          </button>
          
          <button
            onClick={() => setSelectedAssetType("apartment")}
            style={{ 
              padding: "2rem 1rem",
              background: "#fff3e0",
              color: "#e65100",
              fontSize: "1.1rem",
              fontWeight: "600"
            }}
          >
            🏢 Apartment
          </button>
          
          <button
            onClick={() => setSelectedAssetType("vehicle")}
            style={{ 
              padding: "2rem 1rem",
              background: "#e8f5e9",
              color: "#2e7d32",
              fontSize: "1.1rem",
              fontWeight: "600"
            }}
          >
            🚗 Vehicle
          </button>
        </div>
        
        <button
          type="button"
          onClick={() => setShowForm(false)}
          style={{ marginTop: "1.5rem", background: "#ef5350", width: "auto", padding: "0.5rem 1.5rem" }}
        >
          Cancel
        </button>
      </div>
    );
  }

  const renderAssetForm = () => {
    switch (selectedAssetType) {
      case "land_plot":
        return <PlotAssetForm onCancel={() => setSelectedAssetType(null)} />;
      case "house":
        return <HouseAssetForm onCancel={() => setSelectedAssetType(null)} />;
      case "apartment":
        return <ApartmentAssetForm onCancel={() => setSelectedAssetType(null)} />;
      case "vehicle":
        return <VehicleAssetForm onCancel={() => setSelectedAssetType(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      <h2>Add New Asset</h2>
      
      {renderAssetForm()}
    </div>
  );
}