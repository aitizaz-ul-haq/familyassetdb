"use client";

import { useState, useEffect } from "react";

export default function PlotAssetForm({ onCancel }) {
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

  useEffect(() => {
    // Fetch users for ownership dropdown
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setPeople(data));
  }, []);

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

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      <h2>Add New Plot Asset</h2>
      
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", marginBottom: "1.5rem", overflowX: "auto", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem" }}>
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            style={{
              background: activeSection === section.id ? "#7FC6A4" : "#f5f5f5",
              color: activeSection === section.id ? "white" : "#333",
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              whiteSpace: "nowrap",
              width: "auto",
            }}
          >
            {section.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {activeSection === "basic" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="label">Title *</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g., 10 Marla Residential Plot, Street 4, Shams Colony H-13 Islamabad"
              />
            </div>
            <div>
              <label className="label">Nickname</label>
              <input
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                placeholder="e.g., H-13 Plot"
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                placeholder="Empty residential plot, boundary wall on 3 sides..."
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Land Use Type</label>
                <select
                  value={formData.landUseType}
                  onChange={(e) => setFormData({ ...formData, landUseType: e.target.value })}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="agricultural">Agricultural</option>
                  <option value="industrial">Industrial</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div>
                <label className="label">Possession Status</label>
                <select
                  value={formData.possessionStatus}
                  onChange={(e) => setFormData({ ...formData, possessionStatus: e.target.value })}
                >
                  <option value="in_our_possession">In Our Possession</option>
                  <option value="disputed">Disputed</option>
                  <option value="rented_out">Rented Out</option>
                  <option value="under_litigation">Under Litigation</option>
                  <option value="encroached">Encroached</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Current Status</label>
              <select
                value={formData.currentStatus}
                onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
              >
                <option value="clean">Clean</option>
                <option value="in_dispute">In Dispute</option>
                <option value="under_transfer">Under Transfer</option>
                <option value="sold_but_not_cleared">Sold But Not Cleared</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
        )}

        {activeSection === "location" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="label">City *</label>
              <input
                value={formData.location.city}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })}
                required
                placeholder="e.g., Islamabad"
              />
            </div>
            <div>
              <label className="label">Tehsil</label>
              <input
                value={formData.location.tehsil}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, tehsil: e.target.value } })}
                placeholder="e.g., Shams Colony"
              />
            </div>
            <div>
              <label className="label">District</label>
              <input
                value={formData.location.district}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, district: e.target.value } })}
                placeholder="e.g., Islamabad"
              />
            </div>
            <div>
              <label className="label">Mouza/Village</label>
              <input
                value={formData.location.mouzaVillage}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, mouzaVillage: e.target.value } })}
                placeholder="e.g., Shamsabad"
              />
            </div>
            <div>
              <label className="label">Area/Sector</label>
              <input
                value={formData.location.areaOrSector}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, areaOrSector: e.target.value } })}
                placeholder="e.g., G-13"
              />
            </div>
            <div>
              <label className="label">Block/Phase</label>
              <input
                value={formData.location.blockOrPhase}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, blockOrPhase: e.target.value } })}
                placeholder="e.g., Block A"
              />
            </div>
            <div>
              <label className="label">Street Number</label>
              <input
                value={formData.location.streetNumber}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, streetNumber: e.target.value } })}
                placeholder="e.g., 4"
              />
            </div>
            <div>
              <label className="label">Plot Number</label>
              <input
                value={formData.location.plotNumber}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, plotNumber: e.target.value } })}
                placeholder="e.g., 12"
              />
            </div>
            <div>
              <label className="label">Khasra Number</label>
              <input
                value={formData.location.khasraNumber}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, khasraNumber: e.target.value } })}
                placeholder="e.g., 123"
              />
            </div>
            <div>
              <label className="label">Full Address</label>
              <textarea
                value={formData.location.fullAddress}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, fullAddress: e.target.value } })}
                rows="3"
                placeholder="e.g., 10 Marla Residential Plot, Street 4, Shams Colony H-13 Islamabad"
              />
            </div>
            <div>
              <label className="label">Boundary Description</label>
              <textarea
                value={formData.location.boundaryDescription}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, boundaryDescription: e.target.value } })}
                rows="2"
                placeholder="e.g., Bounded on the North by Street 4, on the South by Plot 13..."
              />
            </div>
            <div>
              <label className="label">Right of Way Access</label>
              <input
                value={formData.location.rightOfWayAccess}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, rightOfWayAccess: e.target.value } })}
                placeholder="e.g., 20 feet wide"
              />
            </div>
            <div>
              <label className="label">Nearest Landmark</label>
              <input
                value={formData.location.nearestLandmark}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, nearestLandmark: e.target.value } })}
                placeholder="e.g., Near Faisal Mosque"
              />
            </div>
          </div>
        )}

        {activeSection === "dimensions" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="label">Total Area (Marla) *</label>
              <input
                type="number"
                value={formData.dimensions.totalArea.value}
                onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, totalArea: { ...formData.dimensions.totalArea, value: e.target.value } } })}
                required
                placeholder="e.g., 10"
                min="0"
              />
            </div>
            <div>
              <label className="label">Converted Area (Sq Ft)</label>
              <input
                type="number"
                value={formData.dimensions.convertedAreaSqFt}
                onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, convertedAreaSqFt: e.target.value } })}
                placeholder="e.g., 272.25"
                min="0"
              />
            </div>
            <div>
              <label className="label">Front Width (ft)</label>
              <input
                type="number"
                value={formData.dimensions.frontWidthFt}
                onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, frontWidthFt: e.target.value } })}
                placeholder="e.g., 30"
                min="0"
              />
            </div>
            <div>
              <label className="label">Depth (ft)</label>
              <input
                type="number"
                value={formData.dimensions.depthFt}
                onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, depthFt: e.target.value } })}
                placeholder="e.g., 60"
                min="0"
              />
            </div>
            <div>
              <label className="label">Is Corner Plot?</label>
              <select
                value={formData.dimensions.isCornerPlot ? "yes" : "no"}
                onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, isCornerPlot: e.target.value === "yes" } })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="label">Is Park Facing?</label>
              <select
                value={formData.dimensions.isParkFacing ? "yes" : "no"}
                onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, isParkFacing: e.target.value === "yes" } })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="label">Is Main Road Facing?</label>
              <select
                value={formData.dimensions.isMainRoadFacing ? "yes" : "no"}
                onChange={(e) => setFormData({ ...formData, dimensions: { ...formData.dimensions, isMainRoadFacing: e.target.value === "yes" } })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        )}

        {activeSection === "owners" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Ownership Details</h3>
            {formData.owners.map((owner, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr", gap: "0.5rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
                <select
                  value={owner.personId}
                  onChange={(e) => {
                    const newOwners = [...formData.owners];
                    newOwners[idx].personId = e.target.value;
                    setFormData({ ...formData, owners: newOwners });
                  }}
                  required
                >
                  <option value="">Select owner</option>
                  {people.map((person) => (
                    <option key={person._id} value={person._id}>
                      {person.fullName} ({person.relationToFamily}) - {person.status}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Percentage"
                  value={owner.percentage}
                  onChange={(e) => {
                    const newOwners = [...formData.owners];
                    newOwners[idx].percentage = Number(e.target.value);
                    setFormData({ ...formData, owners: newOwners });
                  }}
                  required
                />
                <input
                  placeholder="Ownership Type"
                  value={owner.ownershipType}
                  onChange={(e) => {
                    const newOwners = [...formData.owners];
                    newOwners[idx].ownershipType = e.target.value;
                    setFormData({ ...formData, owners: newOwners });
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, owners: [...formData.owners, { personId: "", percentage: 0, ownershipType: "legal owner" }]})}
              style={{ background: "#6AB090", width: "auto", padding: "0.5rem 1rem" }}
            >
              + Add Another Owner
            </button>
          </div>
        )}

        {activeSection === "acquisition" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="label">Acquired Date</label>
              <input
                type="date"
                value={formData.acquisitionInfo.acquiredDate}
                onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, acquiredDate: e.target.value } })}
              />
            </div>
            <div>
              <label className="label">Acquired From</label>
              <input
                value={formData.acquisitionInfo.acquiredFrom}
                onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, acquiredFrom: e.target.value } })}
                placeholder="e.g., John Doe"
              />
            </div>
            <div>
              <label className="label">Method</label>
              <select
                value={formData.acquisitionInfo.method}
                onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, method: e.target.value } })}
              >
                <option value="purchased">Purchased</option>
                <option value="inheritance">Inheritance</option>
                <option value="gift">Gift</option>
                <option value="exchange">Exchange</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="label">Price/Value at Acquisition (PKR)</label>
              <input
                type="number"
                value={formData.acquisitionInfo.priceOrValueAtAcquisitionPKR}
                onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, priceOrValueAtAcquisitionPKR: e.target.value } })}
                placeholder="e.g., 500000"
                min="0"
              />
            </div>
            <div>
              <label className="label">Payment Mode</label>
              <input
                value={formData.acquisitionInfo.paymentMode}
                onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, paymentMode: e.target.value } })}
                placeholder="e.g., Bank Transfer"
              />
            </div>
            <div>
              <label className="label">Witnesses</label>
              <input
                value={formData.acquisitionInfo.witnesses.join(", ")}
                onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, witnesses: e.target.value.split(",").map(w => w.trim()) } })}
                placeholder="e.g., Witness 1, Witness 2"
              />
            </div>
            <div>
              <label className="label">Notes</label>
              <textarea
                value={formData.acquisitionInfo.notes}
                onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, notes: e.target.value } })}
                rows="2"
                placeholder="Any additional notes about the acquisition..."
              />
            </div>
          </div>
        )}

        {activeSection === "mutation" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="label">Registry Number</label>
              <input
                value={formData.mutationAndTitle.registryNumber}
                onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, registryNumber: e.target.value } })}
                placeholder="e.g., 12345"
              />
            </div>
            <div>
              <label className="label">Mutation Number</label>
              <input
                value={formData.mutationAndTitle.mutationNumber}
                onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, mutationNumber: e.target.value } })}
                placeholder="e.g., 67890"
              />
            </div>
            <div>
              <label className="label">Fard Number</label>
              <input
                value={formData.mutationAndTitle.fardNumber}
                onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, fardNumber: e.target.value } })}
                placeholder="e.g., 54321"
              />
            </div>
            <div>
              <label className="label">Property Tax Number</label>
              <input
                value={formData.mutationAndTitle.propertyTaxNumber}
                onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, propertyTaxNumber: e.target.value } })}
                placeholder="e.g., 98765"
              />
            </div>
            <div>
              <label className="label">Land Record Authority</label>
              <input
                value={formData.mutationAndTitle.landRecordAuthority}
                onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, landRecordAuthority: e.target.value } })}
                placeholder="e.g., CDA, LDA, KDA"
              />
            </div>
            <div>
              <label className="label">Khatooni Number</label>
              <input
                value={formData.mutationAndTitle.khatooniNumber}
                onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, khatooniNumber: e.target.value } })}
                placeholder="e.g., 112233"
              />
            </div>
            <div>
              <label className="label">Khewat Number</label>
              <input
                value={formData.mutationAndTitle.khewatNumber}
                onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, khewatNumber: e.target.value } })}
                placeholder="e.g., 445566"
              />
            </div>
            <div>
              <label className="label">Jamabandi Reference</label>
              <input
                value={formData.mutationAndTitle.jamabandiReference}
                onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, jamabandiReference: e.target.value } })}
                placeholder="e.g., 778899"
              />
            </div>
            <div>
              <label className="label">Is Title Clear?</label>
              <select
                value={formData.mutationAndTitle.isTitleClear ? "yes" : "no"}
                onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, isTitleClear: e.target.value === "yes" } })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="label">Notes</label>
              <textarea
                value={formData.mutationAndTitle.notes}
                onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, notes: e.target.value } })}
                rows="2"
                placeholder="Any additional notes about the mutation and title..."
              />
            </div>
          </div>
        )}

        {activeSection === "valuation" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="label">Estimated Market Value (PKR)</label>
              <input
                type="number"
                value={formData.valuation.estimatedMarketValuePKR}
                onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, estimatedMarketValuePKR: e.target.value } })}
                placeholder="e.g., 600000"
                min="0"
              />
            </div>
            <div>
              <label className="label">Estimated Date</label>
              <input
                type="date"
                value={formData.valuation.estimatedDate}
                onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, estimatedDate: e.target.value } })}
              />
            </div>
            <div>
              <label className="label">Source</label>
              <input
                value={formData.valuation.source}
                onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, source: e.target.value } })}
                placeholder="e.g., Market Analysis, Appraisal Report"
              />
            </div>
            <div>
              <label className="label">Forced Sale Value (PKR)</label>
              <input
                type="number"
                value={formData.valuation.forcedSaleValuePKR}
                onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, forcedSaleValuePKR: e.target.value } })}
                placeholder="e.g., 550000"
                min="0"
              />
            </div>
            <div>
              <label className="label">Notes</label>
              <textarea
                value={formData.valuation.notes}
                onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, notes: e.target.value } })}
                rows="2"
                placeholder="Any additional notes about the valuation..."
              />
            </div>
          </div>
        )}

        {activeSection === "compliance" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="label">Annual Property Tax (PKR)</label>
              <input
                type="number"
                value={formData.compliance.annualPropertyTaxPKR}
                onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, annualPropertyTaxPKR: e.target.value } })}
                placeholder="e.g., 12000"
                min="0"
              />
            </div>
            <div>
              <label className="label">Property Tax Paid Till</label>
              <input
                type="date"
                value={formData.compliance.propertyTaxPaidTill}
                onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, propertyTaxPaidTill: e.target.value } })}
              />
            </div>
            <div>
              <label className="label">Any Government Notice?</label>
              <select
                value={formData.compliance.anyGovernmentNotice ? "yes" : "no"}
                onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, anyGovernmentNotice: e.target.value === "yes" } })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="label">Government Acquisition Risk</label>
              <select
                value={formData.compliance.govtAcquisitionRisk}
                onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, govtAcquisitionRisk: e.target.value } })}
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="label">Encroachment Risk</label>
              <select
                value={formData.compliance.encroachmentRisk}
                onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, encroachmentRisk: e.target.value } })}
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="label">Planned Road Widening?</label>
              <select
                value={formData.compliance.plannedRoadWidening ? "yes" : "no"}
                onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, plannedRoadWidening: e.target.value === "yes" } })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="label">Notes</label>
              <textarea
                value={formData.compliance.notes}
                onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, notes: e.target.value } })}
                rows="2"
                placeholder="Any additional notes about compliance..."
              />
            </div>
          </div>
        )}

        {activeSection === "possession" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="label">Who Physically Controls Land?</label>
              <input
                value={formData.possessionDetails.whoPhysicallyControlsLand}
                onChange={(e) => setFormData({ ...formData, possessionDetails: { ...formData.possessionDetails, whoPhysicallyControlsLand: e.target.value } })}
                placeholder="e.g., Muhammad Ali"
              />
            </div>
            <div>
              <label className="label">Is Someone Else Sitting?</label>
              <select
                value={formData.possessionDetails.isSomeoneElseSitting ? "yes" : "no"}
                onChange={(e) => setFormData({ ...formData, possessionDetails: { ...formData.possessionDetails, isSomeoneElseSitting: e.target.value === "yes" } })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="label">Encroachment Notes</label>
              <textarea
                value={formData.possessionDetails.encroachmentNotes}
                onChange={(e) => setFormData({ ...formData, possessionDetails: { ...formData.possessionDetails, encroachmentNotes: e.target.value } })}
                rows="2"
                placeholder="e.g., Encroached by neighbor from the north"
              />
            </div>
            <div>
              <label className="label">Boundary Wall Built?</label>
              <select
                value={formData.possessionDetails.boundaryWallBuilt ? "yes" : "no"}
                onChange={(e) => setFormData({ ...formData, possessionDetails: { ...formData.possessionDetails, boundaryWallBuilt: e.target.value === "yes" } })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="label">Gate Locked?</label>
              <select
                value={formData.possessionDetails.gateLocked ? "yes" : "no"}
                onChange={(e) => setFormData({ ...formData, possessionDetails: { ...formData.possessionDetails, gateLocked: e.target.value === "yes" } })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
        )}

        {activeSection === "control" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="label">Who Has Physical Papers?</label>
              <input
                value={formData.controlInfo.whoHasPhysicalPapers[0].holderName}
                onChange={(e) => setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalPapers: [{ ...formData.controlInfo.whoHasPhysicalPapers[0], holderName: e.target.value }] } })}
                placeholder="e.g., Muhammad Ali"
              />
            </div>
            <div>
              <label className="label">Relation</label>
              <input
                value={formData.controlInfo.whoHasPhysicalPapers[0].relation}
                onChange={(e) => setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalPapers: [{ ...formData.controlInfo.whoHasPhysicalPapers[0], relation: e.target.value }] } })}
                placeholder="e.g., Son"
              />
            </div>
            <div>
              <label className="label">Contact</label>
              <input
                value={formData.controlInfo.whoHasPhysicalPapers[0].contact}
                onChange={(e) => setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalPapers: [{ ...formData.controlInfo.whoHasPhysicalPapers[0], contact: e.target.value }] } })}
                placeholder="e.g., 0301-2345678"
              />
            </div>
            <div>
              <label className="label">Notes</label>
              <textarea
                value={formData.controlInfo.whoHasPhysicalPapers[0].notes}
                onChange={(e) => setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalPapers: [{ ...formData.controlInfo.whoHasPhysicalPapers[0], notes: e.target.value }] } })}
                rows="2"
                placeholder="e.g., Original papers with son, keep in safe custody"
              />
            </div>
            <div>
              <label className="label">Where Original Papers Are Stored?</label>
              <input
                value={formData.controlInfo.whereOriginalPapersAreStored}
                onChange={(e) => setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whereOriginalPapersAreStored: e.target.value } })}
                placeholder="e.g., In bank locker"
              />
            </div>
            <div>
              <label className="label">Digital Copies Stored?</label>
              <input
                value={formData.controlInfo.digitalCopiesStored}
                onChange={(e) => setFormData({ ...formData, controlInfo: { ...formData.controlInfo, digitalCopiesStored: e.target.value } })}
                placeholder="e.g., Google Drive, Dropbox"
              />
            </div>
          </div>
        )}

        {activeSection === "history" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            {formData.history.map((entry, index) => (
              <div key={index} style={{ display: "grid", gap: "0.5rem", border: "1px solid #ddd", padding: "1rem", borderRadius: "0.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label className="label">Date</label>
                    <input
                      type="date"
                      value={entry.date}
                      onChange={(e) => {
                        const newHistory = [...formData.history];
                        newHistory[index].date = e.target.value;
                        setFormData({ ...formData, history: newHistory });
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Action</label>
                    <input
                      value={entry.action}
                      onChange={(e) => {
                        const newHistory = [...formData.history];
                        newHistory[index].action = e.target.value;
                        setFormData({ ...formData, history: newHistory });
                      }}
                      placeholder="e.g., Purchased, Sold, Transferred"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Details</label>
                  <textarea
                    value={entry.details}
                    onChange={(e) => {
                      const newHistory = [...formData.history];
                      newHistory[index].details = e.target.value;
                      setFormData({ ...formData, history: newHistory });
                    }}
                    rows="2"
                    placeholder="e.g., Sold to Mr. X, Purchase agreement details..."
                  />
                </div>
                <div>
                  <label className="label">Actor</label>
                  <input
                    value={entry.actor}
                    onChange={(e) => {
                      const newHistory = [...formData.history];
                      newHistory[index].actor = e.target.value;
                      setFormData({ ...formData, history: newHistory });
                    }}
                    placeholder="e.g., Agent, Lawyer, Self"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newHistory = formData.history.filter((_, i) => i !== index);
                    setFormData({ ...formData, history: newHistory });
                  }}
                  style={{ background: "#ef5350", color: "white", padding: "0.5rem", borderRadius: "0.25rem", border: "none", cursor: "pointer" }}
                >
                  Remove Entry
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, history: [...formData.history, { date: "", action: "", details: "", actor: "" }] })}
              style={{ background: "#7FC6A4", color: "white", padding: "0.5rem 1rem", borderRadius: "0.25rem", border: "none", cursor: "pointer" }}
            >
              Add History Entry
            </button>
          </div>
        )}

        {activeSection === "documents" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="label">Upload Documents</label>
              <input
                type="file"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files.length > 0) {
                    const newDocuments = Array.from(files).map(file => ({
                      name: file.name,
                      size: file.size,
                      type: file.type,
                    }));
                    setFormData({ ...formData, documents: newDocuments });
                  }
                }}
                multiple
              />
            </div>
            <div>
              <label className="label">Document List</label>
              <ul>
                {formData.documents && formData.documents.map((doc, index) => (
                  <li key={index}>{doc.name} ({(doc.size / 1024).toFixed(1)} KB) - {doc.type}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeSection === "flags" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label className="label">Inheritance Sensitive?</label>
              <select
                value={formData.flags.inheritanceSensitive ? "yes" : "no"}
                onChange={(e) => setFormData({ ...formData, flags: { ...formData.flags, inheritanceSensitive: e.target.value === "yes" } })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="label">Family Dispute Risk</label>
              <select
                value={formData.flags.familyDisputeRisk}
                onChange={(e) => setFormData({ ...formData, flags: { ...formData.flags, familyDisputeRisk: e.target.value } })}
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="label">Illegal Occupation Risk?</label>
              <select
                value={formData.flags.illegalOccupationRisk ? "yes" : "no"}
                onChange={(e) => setFormData({ ...formData, flags: { ...formData.flags, illegalOccupationRisk: e.target.value === "yes" } })}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="label">Note for Heirs</label>
              <textarea
                value={formData.flags.noteForHeirs}
                onChange={(e) => setFormData({ ...formData, flags: { ...formData.flags, noteForHeirs: e.target.value } })}
                rows="2"
                placeholder="e.g., This property is to be equally divided among all heirs."
              />
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            {!isFirstSection && (
              <button type="button" onClick={handlePrevious} style={{ width: "auto", padding: "0.5rem 1.5rem" }}>
                Previous
              </button>
            )}
            <button type="button" onClick={onCancel} style={{ width: "auto", padding: "0.5rem 1.5rem", background: "#ef5350" }}>
              Cancel
            </button>
          </div>
          {isLastSection ? (
            <button type="submit" disabled={loading} style={{ width: "auto", padding: "0.5rem 1.5rem" }}>
              {loading ? "Saving..." : "Save Asset"}
            </button>
          ) : (
            <button type="button" onClick={handleNext} style={{ width: "auto", padding: "0.5rem 1.5rem" }}>
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
