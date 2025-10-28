"use client";

import { useState, useEffect } from "react";

export default function HouseAssetEditForm({ asset, onClose }) {
  const [people, setPeople] = useState([]);
  const [activeSection, setActiveSection] = useState("basic");
  const [formData, setFormData] = useState({
    assetType: "house",
    title: asset.title || "",
    nickname: asset.nickname || "",
    description: asset.description || "",
    houseUsageType: asset.houseUsageType || "residential",
    possessionStatus: asset.possessionStatus || "in_our_possession",
    isPrimaryFamilyResidence: asset.isPrimaryFamilyResidence || false,
    isIncomeGenerating: asset.isIncomeGenerating || false,
    currentStatus: asset.currentStatus || "clean",
    location: {
      country: asset.location?.country || "Pakistan",
      city: asset.location?.city || "",
      tehsil: asset.location?.tehsil || "",
      district: asset.location?.district || "",
      areaOrSector: asset.location?.areaOrSector || "",
      streetNumber: asset.location?.streetNumber || "",
      houseNumber: asset.location?.houseNumber || "",
      fullAddress: asset.location?.fullAddress || "",
      nearestLandmark: asset.location?.nearestLandmark || "",
    },
    structure: {
      landArea: { 
        value: asset.structure?.landArea?.value || "", 
        unit: asset.structure?.landArea?.unit || "marla" 
      },
      coveredAreaSqFt: asset.structure?.coveredAreaSqFt || "",
      floors: asset.structure?.floors || "",
      rooms: asset.structure?.rooms || "",
      bathrooms: asset.structure?.bathrooms || "",
      kitchens: asset.structure?.kitchens || "",
      drawingRooms: asset.structure?.drawingRooms || "",
      lounges: asset.structure?.lounges || "",
      parkingSpots: asset.structure?.parkingSpots || "",
      utilitiesActive: {
        electricity: asset.structure?.utilitiesActive?.electricity !== false,
        gas: asset.structure?.utilitiesActive?.gas !== false,
        water: asset.structure?.utilitiesActive?.water !== false,
        internet: asset.structure?.utilitiesActive?.internet || false,
      },
      conditionSummary: asset.structure?.conditionSummary || "",
      lastRenovationDate: asset.structure?.lastRenovationDate ? new Date(asset.structure.lastRenovationDate).toISOString().split('T')[0] : "",
      lastRenovationNotes: asset.structure?.lastRenovationNotes || "",
    },
    owners: asset.owners?.map(o => ({
      personId: o.personId?._id || o.personId || "",
      percentage: o.percentage || 0,
      ownershipType: o.ownershipType || "legal owner"
    })) || [{ personId: "", percentage: 100, ownershipType: "legal owner" }],
    acquisitionInfo: {
      acquiredDate: asset.acquisitionInfo?.acquiredDate ? new Date(asset.acquisitionInfo.acquiredDate).toISOString().split('T')[0] : "",
      acquiredFrom: asset.acquisitionInfo?.acquiredFrom || "",
      method: asset.acquisitionInfo?.method || "purchased",
      priceOrValueAtAcquisitionPKR: asset.acquisitionInfo?.priceOrValueAtAcquisitionPKR || "",
      paymentMode: asset.acquisitionInfo?.paymentMode || "",
      notes: asset.acquisitionInfo?.notes || "",
    },
    mutationAndTitle: {
      registryNumber: asset.mutationAndTitle?.registryNumber || "",
      mutationNumber: asset.mutationAndTitle?.mutationNumber || "",
      fardNumber: asset.mutationAndTitle?.fardNumber || "",
      propertyTaxNumber: asset.mutationAndTitle?.propertyTaxNumber || "",
      utilityConnections: {
        electricityMeterNumber: asset.mutationAndTitle?.utilityConnections?.electricityMeterNumber || "",
        gasMeterNumber: asset.mutationAndTitle?.utilityConnections?.gasMeterNumber || "",
        waterConnectionRef: asset.mutationAndTitle?.utilityConnections?.waterConnectionRef || "",
      },
      isTitleClear: asset.mutationAndTitle?.isTitleClear !== false,
      notes: asset.mutationAndTitle?.notes || "",
    },
    occupancy: {
      occupiedBy: asset.occupancy?.occupiedBy || "",
      occupantContact: asset.occupancy?.occupantContact || "",
      rentalStatus: asset.occupancy?.rentalStatus || "family_use",
      monthlyRentPKR: asset.occupancy?.monthlyRentPKR || 0,
      utilityBillsPaidBy: asset.occupancy?.utilityBillsPaidBy || "owner",
    },
    valuation: {
      estimatedMarketValuePKR: asset.valuation?.estimatedMarketValuePKR || "",
      estimatedDate: asset.valuation?.estimatedDate ? new Date(asset.valuation.estimatedDate).toISOString().split('T')[0] : "",
      source: asset.valuation?.source || "",
      forcedSaleValuePKR: asset.valuation?.forcedSaleValuePKR || "",
      notes: asset.valuation?.notes || "",
    },
    compliance: {
      annualPropertyTaxPKR: asset.compliance?.annualPropertyTaxPKR || "",
      propertyTaxPaidTill: asset.compliance?.propertyTaxPaidTill ? new Date(asset.compliance.propertyTaxPaidTill).toISOString().split('T')[0] : "",
      anyGovernmentNotice: asset.compliance?.anyGovernmentNotice || false,
      encroachmentRisk: asset.compliance?.encroachmentRisk || "none",
      govtAcquisitionRisk: asset.compliance?.govtAcquisitionRisk || "none",
      notes: asset.compliance?.notes || "",
    },
    controlInfo: {
      whoHasPhysicalKeys: asset.controlInfo?.whoHasPhysicalKeys?.length > 0 
        ? asset.controlInfo.whoHasPhysicalKeys 
        : [{ holderName: "", relation: "", contact: "", notes: "" }],
      whoHasPhysicalPapers: asset.controlInfo?.whoHasPhysicalPapers?.length > 0 
        ? asset.controlInfo.whoHasPhysicalPapers 
        : [{ holderName: "", relation: "", contact: "", notes: "" }],
      whereOriginalPapersAreStored: asset.controlInfo?.whereOriginalPapersAreStored || "",
      digitalCopiesStored: asset.controlInfo?.digitalCopiesStored || "",
    },
    history: asset.history?.map(h => ({
      date: h.date ? new Date(h.date).toISOString().split('T')[0] : "",
      action: h.action || "",
      details: h.details || "",
      actor: h.actor || ""
    })) || [{ date: "", action: "", details: "", actor: "" }],
    flags: {
      inheritanceSensitive: asset.flags?.inheritanceSensitive || false,
      familyDisputeRisk: asset.flags?.familyDisputeRisk || "none",
      noteForHeirs: asset.flags?.noteForHeirs || "",
    },
    notesInternal: asset.notesInternal || "",
    tags: asset.tags || [],
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setPeople(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/assets/${asset._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        window.location.reload();
      } else {
        alert("Failed to update asset");
      }
    } catch (error) {
      alert("Error updating asset");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: "basic", label: "Basic Info" },
    { id: "location", label: "Location" },
    { id: "structure", label: "Structure" },
    { id: "owners", label: "Ownership" },
    { id: "acquisition", label: "Acquisition" },
    { id: "mutation", label: "Mutation & Title" },
    { id: "occupancy", label: "Occupancy" },
    { id: "valuation", label: "Valuation" },
    { id: "compliance", label: "Compliance" },
    { id: "control", label: "Control Info" },
    { id: "history", label: "History" },
    { id: "flags", label: "Flags & Notes" },
  ];

  const currentIndex = sections.findIndex(s => s.id === activeSection);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 9999,
      overflowY: "auto",
      padding: "1rem",
    }}>
      <div style={{
        background: "white",
        borderRadius: "8px",
        maxWidth: "900px",
        width: "100%",
        margin: "2rem auto",
        padding: "2rem",
      }}>
        <h2>Edit House Asset</h2>
        
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
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
              <div>
                <label className="label">Nickname</label>
                <input
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">House Usage Type</label>
                  <select
                    value={formData.houseUsageType}
                    onChange={(e) => setFormData({ ...formData, houseUsageType: e.target.value })}
                    style={{ border: "1px solid #7FC6A4" }}
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="mixed">Mixed Use</option>
                  </select>
                </div>
                <div>
                  <label className="label">Possession Status</label>
                  <select
                    value={formData.possessionStatus}
                    onChange={(e) => setFormData({ ...formData, possessionStatus: e.target.value })}
                    style={{ border: "1px solid #7FC6A4" }}
                  >
                    <option value="in_our_possession">In Our Possession</option>
                    <option value="rented_out">Rented Out</option>
                    <option value="disputed">Disputed</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", gap: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    checked={formData.isPrimaryFamilyResidence}
                    onChange={(e) => setFormData({ ...formData, isPrimaryFamilyResidence: e.target.checked })}
                    style={{ width: "auto" }}
                  />
                  <label>Primary Family Residence</label>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    checked={formData.isIncomeGenerating}
                    onChange={(e) => setFormData({ ...formData, isIncomeGenerating: e.target.checked })}
                    style={{ width: "auto" }}
                  />
                  <label>Income Generating</label>
                </div>
              </div>
            </div>
          )}

          {activeSection === "location" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">City</label>
                  <input
                    value={formData.location.city}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">District</label>
                  <input
                    value={formData.location.district}
                    onChange={(e) => setFormData({ ...formData, location: { ...formData.location, district: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div>
                <label className="label">Full Address</label>
                <textarea
                  value={formData.location.fullAddress}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, fullAddress: e.target.value }})}
                  rows="2"
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
            </div>
          )}

          {activeSection === "structure" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <h3>Structure Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Land Area</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="number"
                      value={formData.structure.landArea.value}
                      onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, landArea: { ...formData.structure.landArea, value: e.target.value }}})}
                      style={{ border: "1px solid #7FC6A4", width: "70px" }}
                    />
                    <select
                      value={formData.structure.landArea.unit}
                      onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, landArea: { ...formData.structure.landArea, unit: e.target.value }}})}
                      style={{ border: "1px solid #7FC6A4" }}
                    >
                      <option value="marla">Marla</option>
                      <option value="kanal">Kanal</option>
                      <option value="acre">Acre</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Covered Area (Sq Ft)</label>
                  <input
                    type="number"
                    value={formData.structure.coveredAreaSqFt}
                    onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, coveredAreaSqFt: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Floors</label>
                  <input
                    type="number"
                    value={formData.structure.floors}
                    onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, floors: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">Rooms</label>
                  <input
                    type="number"
                    value={formData.structure.rooms}
                    onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, rooms: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.structure.bathrooms}
                    onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, bathrooms: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">Kitchens</label>
                  <input
                    type="number"
                    value={formData.structure.kitchens}
                    onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, kitchens: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Drawing Rooms</label>
                  <input
                    type="number"
                    value={formData.structure.drawingRooms}
                    onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, drawingRooms: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">Lounges</label>
                  <input
                    type="number"
                    value={formData.structure.lounges}
                    onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, lounges: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Parking Spots</label>
                  <input
                    type="number"
                    value={formData.structure.parkingSpots}
                    onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, parkingSpots: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">Utilities Active</label>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="checkbox"
                        checked={formData.structure.utilitiesActive.electricity}
                        onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, utilitiesActive: { ...formData.structure.utilitiesActive, electricity: e.target.checked }}})}
                        style={{ width: "auto" }}
                      />
                      <label>Electricity</label>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="checkbox"
                        checked={formData.structure.utilitiesActive.gas}
                        onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, utilitiesActive: { ...formData.structure.utilitiesActive, gas: e.target.checked }}})}
                        style={{ width: "auto" }}
                      />
                      <label>Gas</label>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="checkbox"
                        checked={formData.structure.utilitiesActive.water}
                        onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, utilitiesActive: { ...formData.structure.utilitiesActive, water: e.target.checked }}})}
                        style={{ width: "auto" }}
                      />
                      <label>Water</label>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <input
                        type="checkbox"
                        checked={formData.structure.utilitiesActive.internet}
                        onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, utilitiesActive: { ...formData.structure.utilitiesActive, internet: e.target.checked }}})}
                        style={{ width: "auto" }}
                      />
                      <label>Internet</label>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="label">Condition Summary</label>
                <textarea
                  value={formData.structure.conditionSummary}
                  onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, conditionSummary: e.target.value }})}
                  rows="2"
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
              <div>
                <label className="label">Last Renovation Date</label>
                <input
                  type="date"
                  value={formData.structure.lastRenovationDate}
                  onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, lastRenovationDate: e.target.value }})}
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
              <div>
                <label className="label">Last Renovation Notes</label>
                <textarea
                  value={formData.structure.lastRenovationNotes}
                  onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, lastRenovationNotes: e.target.value }})}
                  rows="2"
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
            </div>
          )}

          {activeSection === "owners" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <h3>Ownership Details</h3>
              {formData.owners.map((owner, idx) => (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr", gap: "0.5rem", padding: "1rem", border: "1px solid #7FC6A4", borderRadius: "4px" }}>
                  <select
                    value={owner.personId}
                    onChange={(e) => {
                      const newOwners = [...formData.owners];
                      newOwners[idx].personId = e.target.value;
                      setFormData({ ...formData, owners: newOwners });
                    }}
                    required
                    style={{ border: "1px solid #7FC6A4" }}
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
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                  <input
                    placeholder="Ownership Type"
                    value={owner.ownershipType}
                    onChange={(e) => {
                      const newOwners = [...formData.owners];
                      newOwners[idx].ownershipType = e.target.value;
                      setFormData({ ...formData, owners: newOwners });
                    }}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              ))}
            </div>
          )}

          {activeSection === "acquisition" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <h3>Acquisition Information</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Acquired Date</label>
                  <input
                    type="date"
                    value={formData.acquisitionInfo.acquiredDate}
                    onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, acquiredDate: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">Acquired From</label>
                  <input
                    value={formData.acquisitionInfo.acquiredFrom}
                    onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, acquiredFrom: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Method</label>
                  <select
                    value={formData.acquisitionInfo.method}
                    onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, method: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  >
                    <option value="purchased">Purchased</option>
                    <option value="inheritance">Inheritance</option>
                    <option value="gift">Gift</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Price/Value at Acquisition (PKR)</label>
                  <input
                    type="number"
                    value={formData.acquisitionInfo.priceOrValueAtAcquisitionPKR}
                    onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, priceOrValueAtAcquisitionPKR: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div>
                <label className="label">Payment Mode</label>
                <input
                  value={formData.acquisitionInfo.paymentMode}
                  onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, paymentMode: e.target.value }})}
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
              <div>
                <label className="label">Notes</label>
                <textarea
                  value={formData.acquisitionInfo.notes}
                  onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, notes: e.target.value }})}
                  rows="2"
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
            </div>
          )}

          {activeSection === "mutation" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <h3>Mutation & Title Information</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Registry Number</label>
                  <input
                    value={formData.mutationAndTitle.registryNumber}
                    onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, registryNumber: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">Mutation Number</label>
                  <input
                    value={formData.mutationAndTitle.mutationNumber}
                    onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, mutationNumber: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Fard Number</label>
                  <input
                    value={formData.mutationAndTitle.fardNumber}
                    onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, fardNumber: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">Property Tax Number</label>
                  <input
                    value={formData.mutationAndTitle.propertyTaxNumber}
                    onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, propertyTaxNumber: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Electricity Meter Number</label>
                  <input
                    value={formData.mutationAndTitle.utilityConnections.electricityMeterNumber}
                    onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, utilityConnections: { ...formData.mutationAndTitle.utilityConnections, electricityMeterNumber: e.target.value }}})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">Gas Meter Number</label>
                  <input
                    value={formData.mutationAndTitle.utilityConnections.gasMeterNumber}
                    onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, utilityConnections: { ...formData.mutationAndTitle.utilityConnections, gasMeterNumber: e.target.value }}})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div>
                <label className="label">Water Connection Ref</label>
                <input
                  value={formData.mutationAndTitle.utilityConnections.waterConnectionRef}
                  onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, utilityConnections: { ...formData.mutationAndTitle.utilityConnections, waterConnectionRef: e.target.value }}})}
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input
                  type="checkbox"
                  checked={formData.mutationAndTitle.isTitleClear}
                  onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, isTitleClear: e.target.checked }})}
                  style={{ width: "auto" }}
                />
                <label>Title is Clear</label>
              </div>
              <div>
                <label className="label">Notes</label>
                <textarea
                  value={formData.mutationAndTitle.notes}
                  onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, notes: e.target.value }})}
                  rows="2"
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
            </div>
          )}

          {activeSection === "occupancy" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <h3>Occupancy Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Occupied By</label>
                  <input
                    value={formData.occupancy.occupiedBy}
                    onChange={(e) => setFormData({ ...formData, occupancy: { ...formData.occupancy, occupiedBy: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">Occupant Contact</label>
                  <input
                    value={formData.occupancy.occupantContact}
                    onChange={(e) => setFormData({ ...formData, occupancy: { ...formData.occupancy, occupantContact: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Rental Status</label>
                  <select
                    value={formData.occupancy.rentalStatus}
                    onChange={(e) => setFormData({ ...formData, occupancy: { ...formData.occupancy, rentalStatus: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  >
                    <option value="family_use">Family Use</option>
                    <option value="rented">Rented</option>
                    <option value="vacant">Vacant</option>
                  </select>
                </div>
                <div>
                  <label className="label">Monthly Rent (PKR)</label>
                  <input
                    type="number"
                    value={formData.occupancy.monthlyRentPKR}
                    onChange={(e) => setFormData({ ...formData, occupancy: { ...formData.occupancy, monthlyRentPKR: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div>
                <label className="label">Utility Bills Paid By</label>
                <select
                  value={formData.occupancy.utilityBillsPaidBy}
                  onChange={(e) => setFormData({ ...formData, occupancy: { ...formData.occupancy, utilityBillsPaidBy: e.target.value }})}
                  style={{ border: "1px solid #7FC6A4" }}
                >
                  <option value="owner">Owner</option>
                  <option value="tenant">Tenant</option>
                </select>
              </div>
            </div>
          )}

          {activeSection === "valuation" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <h3>Valuation Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Estimated Market Value (PKR)</label>
                  <input
                    type="number"
                    value={formData.valuation.estimatedMarketValuePKR}
                    onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, estimatedMarketValuePKR: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">Estimated Date</label>
                  <input
                    type="date"
                    value={formData.valuation.estimatedDate}
                    onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, estimatedDate: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Source</label>
                  <input
                    value={formData.valuation.source}
                    onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, source: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">Forced Sale Value (PKR)</label>
                  <input
                    type="number"
                    value={formData.valuation.forcedSaleValuePKR}
                    onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, forcedSaleValuePKR: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div>
                <label className="label">Notes</label>
                <textarea
                  value={formData.valuation.notes}
                  onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, notes: e.target.value }})}
                  rows="2"
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
            </div>
          )}

          {activeSection === "compliance" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <h3>Compliance Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Annual Property Tax (PKR)</label>
                  <input
                    type="number"
                    value={formData.compliance.annualPropertyTaxPKR}
                    onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, annualPropertyTaxPKR: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
                <div>
                  <label className="label">Property Tax Paid Till</label>
                  <input
                    type="date"
                    value={formData.compliance.propertyTaxPaidTill}
                    onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, propertyTaxPaidTill: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input
                  type="checkbox"
                  checked={formData.compliance.anyGovernmentNotice}
                  onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, anyGovernmentNotice: e.target.checked }})}
                  style={{ width: "auto" }}
                />
                <label>Any Government Notice?</label>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Encroachment Risk</label>
                  <select
                    value={formData.compliance.encroachmentRisk}
                    onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, encroachmentRisk: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  >
                    <option value="none">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="label">Govt Acquisition Risk</label>
                  <select
                    value={formData.compliance.govtAcquisitionRisk}
                    onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, govtAcquisitionRisk: e.target.value }})}
                    style={{ border: "1px solid #7FC6A4" }}
                  >
                    <option value="none">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Notes</label>
                <textarea
                  value={formData.compliance.notes}
                  onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, notes: e.target.value }})}
                  rows="2"
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
            </div>
          )}

          {activeSection === "control" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <h3>Control Information</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Who has Physical Keys</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {formData.controlInfo.whoHasPhysicalKeys.map((keyHolder, idx) => (
                      <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", padding: "0.5rem", border: "1px solid #7FC6A4", borderRadius: "4px" }}>
                        <input
                          value={keyHolder.holderName}
                          onChange={(e) => {
                            const newKeys = [...formData.controlInfo.whoHasPhysicalKeys];
                            newKeys[idx].holderName = e.target.value;
                            setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalKeys: newKeys }});
                          }}
                          placeholder="Holder Name"
                          style={{ border: "1px solid #7FC6A4" }}
                        />
                        <input
                          value={keyHolder.relation}
                          onChange={(e) => {
                            const newKeys = [...formData.controlInfo.whoHasPhysicalKeys];
                            newKeys[idx].relation = e.target.value;
                            setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalKeys: newKeys }});
                          }}
                          placeholder="Relation"
                          style={{ border: "1px solid #7FC6A4" }}
                        />
                        <input
                          value={keyHolder.contact}
                          onChange={(e) => {
                            const newKeys = [...formData.controlInfo.whoHasPhysicalKeys];
                            newKeys[idx].contact = e.target.value;
                            setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalKeys: newKeys }});
                          }}
                          placeholder="Contact"
                          style={{ border: "1px solid #7FC6A4" }}
                        />
                        <textarea
                          value={keyHolder.notes}
                          onChange={(e) => {
                            const newKeys = [...formData.controlInfo.whoHasPhysicalKeys];
                            newKeys[idx].notes = e.target.value;
                            setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalKeys: newKeys }});
                          }}
                          placeholder="Notes"
                          rows="2"
                          style={{ border: "1px solid #7FC6A4" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Who has Physical Papers</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {formData.controlInfo.whoHasPhysicalPapers.map((paperHolder, idx) => (
                      <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", padding: "0.5rem", border: "1px solid #7FC6A4", borderRadius: "4px" }}>
                        <input
                          value={paperHolder.holderName}
                          onChange={(e) => {
                            const newPapers = [...formData.controlInfo.whoHasPhysicalPapers];
                            newPapers[idx].holderName = e.target.value;
                            setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalPapers: newPapers }});
                          }}
                          placeholder="Holder Name"
                          style={{ border: "1px solid #7FC6A4" }}
                        />
                        <input
                          value={paperHolder.relation}
                          onChange={(e) => {
                            const newPapers = [...formData.controlInfo.whoHasPhysicalPapers];
                            newPapers[idx].relation = e.target.value;
                            setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalPapers: newPapers }});
                          }}
                          placeholder="Relation"
                          style={{ border: "1px solid #7FC6A4" }}
                        />
                        <input
                          value={paperHolder.contact}
                          onChange={(e) => {
                            const newPapers = [...formData.controlInfo.whoHasPhysicalPapers];
                            newPapers[idx].contact = e.target.value;
                            setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalPapers: newPapers }});
                          }}
                          placeholder="Contact"
                          style={{ border: "1px solid #7FC6A4" }}
                        />
                        <textarea
                          value={paperHolder.notes}
                          onChange={(e) => {
                            const newPapers = [...formData.controlInfo.whoHasPhysicalPapers];
                            newPapers[idx].notes = e.target.value;
                            setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalPapers: newPapers }});
                          }}
                          placeholder="Notes"
                          rows="2"
                          style={{ border: "1px solid #7FC6A4" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="label">Where Original Papers are Stored</label>
                <input
                  value={formData.controlInfo.whereOriginalPapersAreStored}
                  onChange={(e) => setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whereOriginalPapersAreStored: e.target.value }})}
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
              <div>
                <label className="label">Digital Copies Stored</label>
                <input
                  value={formData.controlInfo.digitalCopiesStored}
                  onChange={(e) => setFormData({ ...formData, controlInfo: { ...formData.controlInfo, digitalCopiesStored: e.target.value }})}
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
            </div>
          )}

          {activeSection === "history" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <h3>History</h3>
              {formData.history.map((event, idx) => (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "0.5rem", padding: "1rem", border: "1px solid #7FC6A4", borderRadius: "4px" }}>
                  <input
                    type="date"
                    value={event.date}
                    onChange={(e) => {
                      const newHistory = [...formData.history];
                      newHistory[idx].date = e.target.value;
                      setFormData({ ...formData, history: newHistory });
                    }}
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                  <input
                    value={event.action}
                    onChange={(e) => {
                      const newHistory = [...formData.history];
                      newHistory[idx].action = e.target.value;
                      setFormData({ ...formData, history: newHistory });
                    }}
                    placeholder="Action"
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                  <textarea
                    value={event.details}
                    onChange={(e) => {
                      const newHistory = [...formData.history];
                      newHistory[idx].details = e.target.value;
                      setFormData({ ...formData, history: newHistory });
                    }}
                    placeholder="Details"
                    rows="2"
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                  <input
                    value={event.actor}
                    onChange={(e) => {
                      const newHistory = [...formData.history];
                      newHistory[idx].actor = e.target.value;
                      setFormData({ ...formData, history: newHistory });
                    }}
                    placeholder="Actor"
                    style={{ border: "1px solid #7FC6A4" }}
                  />
                </div>
              ))}
            </div>
          )}

          {activeSection === "flags" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <h3>Flags & Notes</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input
                  type="checkbox"
                  checked={formData.flags.inheritanceSensitive}
                  onChange={(e) => setFormData({ ...formData, flags: { ...formData.flags, inheritanceSensitive: e.target.checked }})}
                  style={{ width: "auto" }}
                />
                <label>Inheritance Sensitive</label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input
                  type="checkbox"
                  checked={formData.flags.familyDisputeRisk === "high"}
                  onChange={(e) => setFormData({ ...formData, flags: { ...formData.flags, familyDisputeRisk: e.target.checked ? "high" : "none" }})}
                  style={{ width: "auto" }}
                />
                <label>Family Dispute Risk: High</label>
              </div>
              <div>
                <label className="label">Note for Heirs</label>
                <textarea
                  value={formData.flags.noteForHeirs}
                  onChange={(e) => setFormData({ ...formData, flags: { ...formData.flags, noteForHeirs: e.target.value }})}
                  rows="2"
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
              <div>
                <label className="label">Internal Notes</label>
                <textarea
                  value={formData.notesInternal}
                  onChange={(e) => setFormData({ ...formData, notesInternal: e.target.value })}
                  rows="2"
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
              <div>
                <label className="label">Tags</label>
                <input
                  value={formData.tags.join(", ")}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map(tag => tag.trim()) })}
                  placeholder="Comma separated"
                  style={{ border: "1px solid #7FC6A4" }}
                />
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {currentIndex > 0 && (
                <button type="button" onClick={() => setActiveSection(sections[currentIndex - 1].id)} style={{ width: "auto", padding: "0.5rem 1.5rem" }}>
                  Previous
                </button>
              )}
              <button type="button" onClick={onClose} style={{ width: "auto", padding: "0.5rem 1.5rem", background: "#ef5350" }}>
                Cancel
              </button>
            </div>
            {currentIndex === sections.length - 1 ? (
              <button type="submit" disabled={loading} style={{ width: "auto", padding: "0.5rem 1.5rem", background: "#7FC6A4" }}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            ) : (
              <button type="button" onClick={() => setActiveSection(sections[currentIndex + 1].id)} style={{ width: "auto", padding: "0.5rem 1.5rem" }}>
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
