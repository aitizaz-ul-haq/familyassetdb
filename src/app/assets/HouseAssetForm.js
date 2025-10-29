"use client";

import { useState, useEffect } from "react";

export default function HouseAssetForm({ onCancel }) {
  const [people, setPeople] = useState([]);
  const [activeSection, setActiveSection] = useState("basic");
  const [formData, setFormData] = useState({
    assetType: "house",
    title: "",
    nickname: "",
    description: "",
    houseUsageType: "residential",
    possessionStatus: "in_our_possession",
    isPrimaryFamilyResidence: false,
    isIncomeGenerating: false,
    currentStatus: "clean",
    location: {
      country: "Pakistan",
      city: "",
      tehsil: "",
      district: "",
      areaOrSector: "",
      streetNumber: "",
      houseNumber: "",
      fullAddress: "",
      nearestLandmark: "",
    },
    structure: {
      landArea: { value: "", unit: "marla" },
      coveredAreaSqFt: "",
      floors: "",
      rooms: "",
      bathrooms: "",
      kitchens: "",
      drawingRooms: "",
      lounges: "",
      parkingSpots: "",
      hasSeparatePortions: false,
      portionDetails: [],
      utilitiesActive: {
        electricity: true,
        gas: true,
        water: true,
        internet: false,
      },
      conditionSummary: "",
      lastRenovationDate: "",
      lastRenovationNotes: "",
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
      utilityConnections: {
        electricityMeterNumber: "",
        gasMeterNumber: "",
        waterConnectionRef: "",
      },
      isTitleClear: true,
      notes: "",
    },
    occupancy: {
      occupiedBy: "",
      occupantContact: "",
      rentalStatus: "family_use",
      monthlyRentPKR: 0,
      utilityBillsPaidBy: "owner",
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
      encroachmentRisk: "none",
      govtAcquisitionRisk: "none",
      notes: "",
    },
    controlInfo: {
      whoHasPhysicalKeys: [{ holderName: "", relation: "", contact: "", notes: "" }],
      whoHasPhysicalPapers: [{ holderName: "", relation: "", contact: "", notes: "" }],
      whereOriginalPapersAreStored: "",
      digitalCopiesStored: "",
    },
    history: [{ date: "", action: "", details: "", actor: "" }],
    flags: {
      inheritanceSensitive: false,
      familyDisputeRisk: "none",
      noteForHeirs: "",
    },
    notesInternal: "",
    tags: [],
    relatedContacts: [{ category: "neighbor", name: "", phoneNumber: "", notes: "" }],
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
    { id: "contacts", label: "Related Contacts" },
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
      <h2>Add New House Asset</h2>
      
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
                placeholder="e.g., House #32 Street 4 Shams Colony H-13 Islamabad"
              />
            </div>
            <div>
              <label className="label">Nickname</label>
              <input
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                placeholder="e.g., Family House H-13"
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                placeholder="Double-story house, 5 rooms..."
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">House Usage Type</label>
                <select
                  value={formData.houseUsageType}
                  onChange={(e) => setFormData({ ...formData, houseUsageType: e.target.value })}
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
            {/* ...similar location fields as plot... */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">City</label>
                <input
                  value={formData.location.city}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value }})}
                />
              </div>
              <div>
                <label className="label">District</label>
                <input
                  value={formData.location.district}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, district: e.target.value }})}
                />
              </div>
            </div>
            {/* ...rest of location fields... */}
          </div>
        )}

        {activeSection === "structure" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>House Structure</h3>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Land Area</label>
                <input
                  type="number"
                  value={formData.structure.landArea.value}
                  onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, landArea: { ...formData.structure.landArea, value: e.target.value }}})}
                />
              </div>
              <div>
                <label className="label">Unit</label>
                <select
                  value={formData.structure.landArea.unit}
                  onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, landArea: { ...formData.structure.landArea, unit: e.target.value }}})}
                >
                  <option value="marla">Marla</option>
                  <option value="kanal">Kanal</option>
                  <option value="sqft">Sq Ft</option>
                </select>
              </div>
              <div>
                <label className="label">Covered Area (Sq Ft)</label>
                <input
                  type="number"
                  value={formData.structure.coveredAreaSqFt}
                  onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, coveredAreaSqFt: e.target.value }})}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
              <div>
                <label className="label">Floors</label>
                <input
                  type="number"
                  value={formData.structure.floors}
                  onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, floors: e.target.value }})}
                />
              </div>
              <div>
                <label className="label">Rooms</label>
                <input
                  type="number"
                  value={formData.structure.rooms}
                  onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, rooms: e.target.value }})}
                />
              </div>
              <div>
                <label className="label">Bathrooms</label>
                <input
                  type="number"
                  value={formData.structure.bathrooms}
                  onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, bathrooms: e.target.value }})}
                />
              </div>
              <div>
                <label className="label">Kitchens</label>
                <input
                  type="number"
                  value={formData.structure.kitchens}
                  onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, kitchens: e.target.value }})}
                />
              </div>
            </div>
            {/* ...utilities checkboxes, condition summary, etc... */}
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
            <h3>Acquisition Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Acquired Date</label>
                <input
                  type="date"
                  value={formData.acquisitionInfo.acquiredDate}
                  onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, acquiredDate: e.target.value }})}
                />
              </div>
              <div>
                <label className="label">Acquired From</label>
                <input
                  value={formData.acquisitionInfo.acquiredFrom}
                  onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, acquiredFrom: e.target.value }})}
                  placeholder="Mr. XYZ s/o ABC CNIC..."
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Method</label>
                <select
                  value={formData.acquisitionInfo.method}
                  onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, method: e.target.value }})}
                >
                  <option value="purchased">Purchased</option>
                  <option value="gifted">Gifted</option>
                  <option value="inherited">Inherited</option>
                  <option value="transferred">Transferred</option>
                  <option value="settlement">Settlement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">Price (PKR)</label>
                <input
                  type="number"
                  value={formData.acquisitionInfo.priceOrValueAtAcquisitionPKR}
                  onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, priceOrValueAtAcquisitionPKR: e.target.value }})}
                  placeholder="9500000"
                />
              </div>
            </div>
            <div>
              <label className="label">Payment Mode</label>
              <input
                value={formData.acquisitionInfo.paymentMode}
                onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, paymentMode: e.target.value }})}
                placeholder="e.g., cash+bank, installments"
              />
            </div>
            <div>
              <label className="label">Notes</label>
              <textarea
                value={formData.acquisitionInfo.notes}
                onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, notes: e.target.value }})}
                rows="3"
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
                />
              </div>
              <div>
                <label className="label">Mutation Number</label>
                <input
                  value={formData.mutationAndTitle.mutationNumber}
                  onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, mutationNumber: e.target.value }})}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Fard Number</label>
                <input
                  value={formData.mutationAndTitle.fardNumber}
                  onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, fardNumber: e.target.value }})}
                />
              </div>
              <div>
                <label className="label">Property Tax Number</label>
                <input
                  value={formData.mutationAndTitle.propertyTaxNumber}
                  onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, propertyTaxNumber: e.target.value }})}
                />
              </div>
            </div>
            <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
              <h4 style={{ marginBottom: "0.75rem" }}>Utility Connections</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Electricity Meter</label>
                  <input
                    value={formData.mutationAndTitle.utilityConnections.electricityMeterNumber}
                    onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, utilityConnections: { ...formData.mutationAndTitle.utilityConnections, electricityMeterNumber: e.target.value }}})}
                    placeholder="IESCO-998877"
                  />
                </div>
                <div>
                  <label className="label">Gas Meter</label>
                  <input
                    value={formData.mutationAndTitle.utilityConnections.gasMeterNumber}
                    onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, utilityConnections: { ...formData.mutationAndTitle.utilityConnections, gasMeterNumber: e.target.value }}})}
                    placeholder="SNGPL-112233"
                  />
                </div>
                <div>
                  <label className="label">Water Connection</label>
                  <input
                    value={formData.mutationAndTitle.utilityConnections.waterConnectionRef}
                    onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, utilityConnections: { ...formData.mutationAndTitle.utilityConnections, waterConnectionRef: e.target.value }}})}
                    placeholder="CDA-WTR-4455"
                  />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
                  placeholder="e.g., Uncle + family, Self"
                />
              </div>
              <div>
                <label className="label">Occupant Contact</label>
                <input
                  value={formData.occupancy.occupantContact}
                  onChange={(e) => setFormData({ ...formData, occupancy: { ...formData.occupancy, occupantContact: e.target.value }})}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Rental Status</label>
                <select
                  value={formData.occupancy.rentalStatus}
                  onChange={(e) => setFormData({ ...formData, occupancy: { ...formData.occupancy, rentalStatus: e.target.value }})}
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
                />
              </div>
              <div>
                <label className="label">Utility Bills Paid By</label>
                <select
                  value={formData.occupancy.utilityBillsPaidBy}
                  onChange={(e) => setFormData({ ...formData, occupancy: { ...formData.occupancy, utilityBillsPaidBy: e.target.value }})}
                >
                  <option value="owner">Owner</option>
                  <option value="occupant">Occupant</option>
                  <option value="shared">Shared</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeSection === "valuation" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Valuation</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Estimated Market Value (PKR)</label>
                <input
                  type="number"
                  value={formData.valuation.estimatedMarketValuePKR}
                  onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, estimatedMarketValuePKR: e.target.value }})}
                />
              </div>
              <div>
                <label className="label">Estimated Date</label>
                <input
                  type="date"
                  value={formData.valuation.estimatedDate}
                  onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, estimatedDate: e.target.value }})}
                />
              </div>
            </div>
            <div>
              <label className="label">Source</label>
              <input
                value={formData.valuation.source}
                onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, source: e.target.value }})}
                placeholder="Dealer in I-8 Markaz"
              />
            </div>
            <div>
              <label className="label">Forced Sale Value (PKR)</label>
              <input
                type="number"
                value={formData.valuation.forcedSaleValuePKR}
                onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, forcedSaleValuePKR: e.target.value }})}
              />
            </div>
            <div>
              <label className="label">Notes</label>
              <textarea
                value={formData.valuation.notes}
                onChange={(e) => setFormData({ ...formData, valuation: { ...formData.valuation, notes: e.target.value }})}
                rows="2"
              />
            </div>
          </div>
        )}

        {activeSection === "compliance" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Compliance</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Annual Property Tax (PKR)</label>
                <input
                  type="number"
                  value={formData.compliance.annualPropertyTaxPKR}
                  onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, annualPropertyTaxPKR: e.target.value }})}
                />
              </div>
              <div>
                <label className="label">Tax Paid Till</label>
                <input
                  type="date"
                  value={formData.compliance.propertyTaxPaidTill}
                  onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, propertyTaxPaidTill: e.target.value }})}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Encroachment Risk</label>
                <select
                  value={formData.compliance.encroachmentRisk}
                  onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, encroachmentRisk: e.target.value }})}
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
                >
                  <option value="none">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={formData.compliance.anyGovernmentNotice}
                onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, anyGovernmentNotice: e.target.checked }})}
                style={{ width: "auto" }}
              />
              <label>Any Government Notice</label>
            </div>
            <div>
              <label className="label">Notes</label>
              <textarea
                value={formData.compliance.notes}
                onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, notes: e.target.value }})}
                rows="2"
              />
            </div>
          </div>
        )}

        {activeSection === "control" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Control Information</h3>
            
            <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
              <h4 style={{ marginBottom: "0.75rem" }}>Who Has Physical Keys</h4>
              {formData.controlInfo.whoHasPhysicalKeys.map((keyHolder, idx) => (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label className="label">Holder Name</label>
                    <input
                      value={keyHolder.holderName}
                      onChange={(e) => {
                        const newKeys = [...formData.controlInfo.whoHasPhysicalKeys];
                        newKeys[idx].holderName = e.target.value;
                        setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalKeys: newKeys }});
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Relation</label>
                    <input
                      value={keyHolder.relation}
                      onChange={(e) => {
                        const newKeys = [...formData.controlInfo.whoHasPhysicalKeys];
                        newKeys[idx].relation = e.target.value;
                        setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalKeys: newKeys }});
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Contact</label>
                    <input
                      value={keyHolder.contact}
                      onChange={(e) => {
                        const newKeys = [...formData.controlInfo.whoHasPhysicalKeys];
                        newKeys[idx].contact = e.target.value;
                        setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalKeys: newKeys }});
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Notes</label>
                    <input
                      value={keyHolder.notes}
                      onChange={(e) => {
                        const newKeys = [...formData.controlInfo.whoHasPhysicalKeys];
                        newKeys[idx].notes = e.target.value;
                        setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalKeys: newKeys }});
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
              <h4 style={{ marginBottom: "0.75rem" }}>Who Has Physical Papers</h4>
              {formData.controlInfo.whoHasPhysicalPapers.map((paperHolder, idx) => (
                <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label className="label">Holder Name</label>
                    <input
                      value={paperHolder.holderName}
                      onChange={(e) => {
                        const newPapers = [...formData.controlInfo.whoHasPhysicalPapers];
                        newPapers[idx].holderName = e.target.value;
                        setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalPapers: newPapers }});
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Relation</label>
                    <input
                      value={paperHolder.relation}
                      onChange={(e) => {
                        const newPapers = [...formData.controlInfo.whoHasPhysicalPapers];
                        newPapers[idx].relation = e.target.value;
                        setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalPapers: newPapers }});
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Contact</label>
                    <input
                      value={paperHolder.contact}
                      onChange={(e) => {
                        const newPapers = [...formData.controlInfo.whoHasPhysicalPapers];
                        newPapers[idx].contact = e.target.value;
                        setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalPapers: newPapers }});
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Notes</label>
                    <input
                      value={paperHolder.notes}
                      onChange={(e) => {
                        const newPapers = [...formData.controlInfo.whoHasPhysicalPapers];
                        newPapers[idx].notes = e.target.value;
                        setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whoHasPhysicalPapers: newPapers }});
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="label">Where Original Papers Are Stored</label>
              <input
                value={formData.controlInfo.whereOriginalPapersAreStored}
                onChange={(e) => setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whereOriginalPapersAreStored: e.target.value }})}
                placeholder="Parents' bedroom cabinet, top shelf, brown file"
              />
            </div>
            <div>
              <label className="label">Digital Copies Stored</label>
              <input
                value={formData.controlInfo.digitalCopiesStored}
                onChange={(e) => setFormData({ ...formData, controlInfo: { ...formData.controlInfo, digitalCopiesStored: e.target.value }})}
                placeholder="Google Drive > FamilyAssets > Houses"
              />
            </div>
          </div>
        )}

        {activeSection === "history" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>History Timeline</h3>
            {formData.history.map((entry, idx) => (
              <div key={idx} style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label className="label">Date</label>
                    <input
                      type="date"
                      value={entry.date}
                      onChange={(e) => {
                        const newHistory = [...formData.history];
                        newHistory[idx].date = e.target.value;
                        setFormData({ ...formData, history: newHistory });
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Actor</label>
                    <input
                      value={entry.actor}
                      onChange={(e) => {
                        const newHistory = [...formData.history];
                        newHistory[idx].actor = e.target.value;
                        setFormData({ ...formData, history: newHistory });
                      }}
                      placeholder="Who performed this action"
                    />
                  </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label className="label">Action</label>
                  <input
                    value={entry.action}
                    onChange={(e) => {
                      const newHistory = [...formData.history];
                      newHistory[idx].action = e.target.value;
                      setFormData({ ...formData, history: newHistory });
                    }}
                    placeholder="e.g., acquired, renovation"
                  />
                </div>
                <div>
                  <label className="label">Details</label>
                  <textarea
                    value={entry.details}
                    onChange={(e) => {
                      const newHistory = [...formData.history];
                      newHistory[idx].details = e.target.value;
                      setFormData({ ...formData, history: newHistory });
                    }}
                    rows="2"
                  />
                </div>
                {formData.history.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newHistory = formData.history.filter((_, i) => i !== idx);
                      setFormData({ ...formData, history: newHistory });
                    }}
                    style={{ marginTop: "0.5rem", background: "#ef5350", width: "auto", padding: "0.35rem 1rem", fontSize: "0.85rem" }}
                  >
                    Remove Entry
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, history: [...formData.history, { date: "", action: "", details: "", actor: "" }]})}
              style={{ background: "#6AB090", width: "auto", padding: "0.5rem 1rem" }}
            >
              + Add History Entry
            </button>
          </div>
        )}

        {activeSection === "flags" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Flags & Internal Notes</h3>
            <div style={{ display: "flex", gap: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={formData.flags.inheritanceSensitive}
                  onChange={(e) => setFormData({ ...formData, flags: { ...formData.flags, inheritanceSensitive: e.target.checked }})}
                  style={{ width: "auto" }}
                />
                <label>Inheritance Sensitive</label>
              </div>
            </div>
            <div>
              <label className="label">Family Dispute Risk</label>
              <select
                value={formData.flags.familyDisputeRisk}
                onChange={(e) => setFormData({ ...formData, flags: { ...formData.flags, familyDisputeRisk: e.target.value }})}
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="label">Note for Heirs</label>
              <textarea
                value={formData.flags.noteForHeirs}
                onChange={(e) => setFormData({ ...formData, flags: { ...formData.flags, noteForHeirs: e.target.value }})}
                rows="2"
                placeholder="Important notes for future heirs..."
              />
            </div>
            <div>
              <label className="label">Internal Notes</label>
              <textarea
                value={formData.notesInternal}
                onChange={(e) => setFormData({ ...formData, notesInternal: e.target.value })}
                rows="3"
              />
            </div>
          </div>
        )}

        {activeSection === "contacts" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Related Contacts</h3>
            {formData.relatedContacts.map((contact, idx) => (
              <div key={idx} style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label className="label">Category</label>
                    <input
                      value={contact.category}
                      onChange={(e) => {
                        const newContacts = [...formData.relatedContacts];
                        newContacts[idx].category = e.target.value;
                        setFormData({ ...formData, relatedContacts: newContacts });
                      }}
                      placeholder="e.g., neighbor, relative"
                    />
                  </div>
                  <div>
                    <label className="label">Name</label>
                    <input
                      value={contact.name}
                      onChange={(e) => {
                        const newContacts = [...formData.relatedContacts];
                        newContacts[idx].name = e.target.value;
                        setFormData({ ...formData, relatedContacts: newContacts });
                      }}
                      placeholder="Full name"
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label className="label">Phone Number</label>
                    <input
                      value={contact.phoneNumber}
                      onChange={(e) => {
                        const newContacts = [...formData.relatedContacts];
                        newContacts[idx].phoneNumber = e.target.value;
                        setFormData({ ...formData, relatedContacts: newContacts });
                      }}
                      placeholder="e.g., 0301-2345678"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Notes</label>
                  <textarea
                    value={contact.notes}
                    onChange={(e) => {
                      const newContacts = [...formData.relatedContacts];
                      newContacts[idx].notes = e.target.value;
                      setFormData({ ...formData, relatedContacts: newContacts });
                    }}
                    rows="2"
                    placeholder="Any additional information"
                  />
                </div>
                {formData.relatedContacts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newContacts = formData.relatedContacts.filter((_, i) => i !== idx);
                      setFormData({ ...formData, relatedContacts: newContacts });
                    }}
                    style={{ marginTop: "0.5rem", background: "#ef5350", width: "auto", padding: "0.35rem 1rem", fontSize: "0.85rem" }}
                  >
                    Remove Contact
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, relatedContacts: [...formData.relatedContacts, { category: "neighbor", name: "", phoneNumber: "", notes: "" }]})}
              style={{ background: "#6AB090", width: "auto", padding: "0.5rem 1rem" }}
            >
              + Add Related Contact
            </button>
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
