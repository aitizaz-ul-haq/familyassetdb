"use client";

import { useState, useEffect } from "react";

export default function ApartmentAssetForm({ onCancel }) {
  const [people, setPeople] = useState([]);
  const [activeSection, setActiveSection] = useState("basic");
  const [formData, setFormData] = useState({
    assetType: "apartment",
    title: "",
    nickname: "",
    description: "",
    apartmentUsageType: "rental",
    possessionStatus: "rented_out",
    isIncomeGenerating: true,
    currentStatus: "clean",
    location: {
      country: "Pakistan",
      city: "",
      tehsil: "",
      district: "",
      societyOrProject: "",
      blockOrTower: "",
      apartmentNumber: "",
      floorNumber: "",
      fullAddress: "",
      nearestLandmark: "",
    },
    structure: {
      bedrooms: "",
      bathrooms: "",
      lounges: "",
      kitchens: "",
      balconies: "",
      coveredAreaSqFt: "",
      floorNumber: "",
      parkingSlots: [],
      furnished: false,
      apartmentConditionSummary: "",
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
      allotmentLetterNumber: "",
      possessionLetterNumber: "",
      transferLetterNumber: "",
      propertyTaxNumber: "",
      maintenanceAccountNumber: "",
      isTitleClear: true,
      notes: "",
    },
    rentalInfo: {
      isRentedOut: true,
      tenantName: "",
      tenantContact: "",
      monthlyRentPKR: "",
      securityDepositPKR: "",
      rentDueDayOfMonth: 5,
      rentContractStart: "",
      rentContractEnd: "",
      utilityBillsPaidBy: "tenant",
      maintenanceFeePaidBy: "owner",
      latePaymentHistory: [],
    },
    valuation: {
      estimatedMarketValuePKR: "",
      estimatedDate: "",
      source: "",
      forcedSaleValuePKR: "",
      notes: "",
    },
    compliance: {
      societyMaintenanceOutstandingPKR: 0,
      propertyTaxPaidTill: "",
      anyGovernmentNotice: false,
      encroachmentRisk: "none",
      structuralRisk: "low",
      notes: "",
    },
    controlInfo: {
      keysHeldBy: [{ holderName: "", relation: "", contact: "", notes: "" }],
      whereOriginalPapersAreStored: "",
      digitalCopiesStored: "",
    },
    history: [{ date: "", action: "", details: "", actor: "" }],
    flags: {
      inheritanceSensitive: false,
      incomeCriticalForFamily: false,
      vacancyRiskIfTenantLeaves: "medium",
      noteForHeirs: "",
    },
    notesInternal: "",
    tags: [],
    relatedContacts: [{ personId: "", relation: "", contact: "" }],
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
    { id: "mutation", label: "Title & Letters" },
    { id: "rental", label: "Rental Info" },
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
      <h2>Add New Apartment Asset</h2>
      
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
                placeholder="e.g., Apartment #402, Block B, XYZ Residency, Bahria Town Rawalpindi"
              />
            </div>
            <div>
              <label className="label">Nickname</label>
              <input
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                placeholder="e.g., XYZ Residency Apt 402"
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                placeholder="2-bed apartment, 4th floor, currently rented..."
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Apartment Usage Type</label>
                <select
                  value={formData.apartmentUsageType}
                  onChange={(e) => setFormData({ ...formData, apartmentUsageType: e.target.value })}
                >
                  <option value="rental">Rental</option>
                  <option value="self_use">Self Use</option>
                  <option value="investment">Investment</option>
                </select>
              </div>
              <div>
                <label className="label">Possession Status</label>
                <select
                  value={formData.possessionStatus}
                  onChange={(e) => setFormData({ ...formData, possessionStatus: e.target.value })}
                >
                  <option value="rented_out">Rented Out</option>
                  <option value="in_our_possession">In Our Possession</option>
                  <option value="vacant">Vacant</option>
                </select>
              </div>
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
        )}

        {activeSection === "location" && (
          <div style={{ display: "grid", gap: "1rem" }}>
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
            <div>
              <label className="label">Society / Project Name</label>
              <input
                value={formData.location.societyOrProject}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, societyOrProject: e.target.value }})}
                placeholder="e.g., XYZ Residency, Bahria Town"
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Block / Tower</label>
                <input
                  value={formData.location.blockOrTower}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, blockOrTower: e.target.value }})}
                  placeholder="e.g., Block B, Tower 3"
                />
              </div>
              <div>
                <label className="label">Apartment Number</label>
                <input
                  value={formData.location.apartmentNumber}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, apartmentNumber: e.target.value }})}
                  placeholder="e.g., 402"
                />
              </div>
              <div>
                <label className="label">Floor Number</label>
                <input
                  type="number"
                  value={formData.location.floorNumber}
                  onChange={(e) => setFormData({ ...formData, location: { ...formData.location, floorNumber: e.target.value }})}
                  placeholder="e.g., 4"
                />
              </div>
            </div>
            <div>
              <label className="label">Full Address</label>
              <textarea
                value={formData.location.fullAddress}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, fullAddress: e.target.value }})}
                rows="2"
              />
            </div>
            <div>
              <label className="label">Nearest Landmark</label>
              <input
                value={formData.location.nearestLandmark}
                onChange={(e) => setFormData({ ...formData, location: { ...formData.location, nearestLandmark: e.target.value }})}
              />
            </div>
          </div>
        )}

        {activeSection === "structure" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Apartment Structure</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
              <div>
                <label className="label">Bedrooms</label>
                <input
                  type="number"
                  value={formData.structure.bedrooms}
                  onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, bedrooms: e.target.value }})}
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
                <label className="label">Lounges</label>
                <input
                  type="number"
                  value={formData.structure.lounges}
                  onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, lounges: e.target.value }})}
                />
              </div>
              <div>
                <label className="label">Balconies</label>
                <input
                  type="number"
                  value={formData.structure.balconies}
                  onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, balconies: e.target.value }})}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Covered Area (Sq Ft)</label>
                <input
                  type="number"
                  value={formData.structure.coveredAreaSqFt}
                  onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, coveredAreaSqFt: e.target.value }})}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
                <input
                  type="checkbox"
                  checked={formData.structure.furnished}
                  onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, furnished: e.target.checked }})}
                  style={{ width: "auto" }}
                />
                <label>Furnished</label>
              </div>
            </div>
            <div>
              <label className="label">Condition Summary</label>
              <textarea
                value={formData.structure.apartmentConditionSummary}
                onChange={(e) => setFormData({ ...formData, structure: { ...formData.structure, apartmentConditionSummary: e.target.value }})}
                rows="2"
                placeholder="Good condition. Minor paint touch-ups needed."
              />
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
                  placeholder="Developer name or previous owner"
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
                </select>
              </div>
              <div>
                <label className="label">Price (PKR)</label>
                <input
                  type="number"
                  value={formData.acquisitionInfo.priceOrValueAtAcquisitionPKR}
                  onChange={(e) => setFormData({ ...formData, acquisitionInfo: { ...formData.acquisitionInfo, priceOrValueAtAcquisitionPKR: e.target.value }})}
                />
              </div>
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
            <h3>Title & Letters</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Allotment Letter Number</label>
                <input
                  value={formData.mutationAndTitle.allotmentLetterNumber}
                  onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, allotmentLetterNumber: e.target.value }})}
                />
              </div>
              <div>
                <label className="label">Possession Letter Number</label>
                <input
                  value={formData.mutationAndTitle.possessionLetterNumber}
                  onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, possessionLetterNumber: e.target.value }})}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Transfer Letter Number</label>
                <input
                  value={formData.mutationAndTitle.transferLetterNumber}
                  onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, transferLetterNumber: e.target.value }})}
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
            <div>
              <label className="label">Maintenance Account Number</label>
              <input
                value={formData.mutationAndTitle.maintenanceAccountNumber}
                onChange={(e) => setFormData({ ...formData, mutationAndTitle: { ...formData.mutationAndTitle, maintenanceAccountNumber: e.target.value }})}
              />
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
          </div>
        )}

        {activeSection === "rental" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Rental Information</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <input
                type="checkbox"
                checked={formData.rentalInfo.isRentedOut}
                onChange={(e) => setFormData({ ...formData, rentalInfo: { ...formData.rentalInfo, isRentedOut: e.target.checked }})}
                style={{ width: "auto" }}
              />
              <label>Currently Rented Out</label>
            </div>
            {formData.rentalInfo.isRentedOut && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="label">Tenant Name</label>
                    <input
                      value={formData.rentalInfo.tenantName}
                      onChange={(e) => setFormData({ ...formData, rentalInfo: { ...formData.rentalInfo, tenantName: e.target.value }})}
                    />
                  </div>
                  <div>
                    <label className="label">Tenant Contact</label>
                    <input
                      value={formData.rentalInfo.tenantContact}
                      onChange={(e) => setFormData({ ...formData, rentalInfo: { ...formData.rentalInfo, tenantContact: e.target.value }})}
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="label">Monthly Rent (PKR)</label>
                    <input
                      type="number"
                      value={formData.rentalInfo.monthlyRentPKR}
                      onChange={(e) => setFormData({ ...formData, rentalInfo: { ...formData.rentalInfo, monthlyRentPKR: e.target.value }})}
                    />
                  </div>
                  <div>
                    <label className="label">Security Deposit (PKR)</label>
                    <input
                      type="number"
                      value={formData.rentalInfo.securityDepositPKR}
                      onChange={(e) => setFormData({ ...formData, rentalInfo: { ...formData.rentalInfo, securityDepositPKR: e.target.value }})}
                    />
                  </div>
                  <div>
                    <label className="label">Rent Due Day</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={formData.rentalInfo.rentDueDayOfMonth}
                      onChange={(e) => setFormData({ ...formData, rentalInfo: { ...formData.rentalInfo, rentDueDayOfMonth: e.target.value }})}
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="label">Contract Start Date</label>
                    <input
                      type="date"
                      value={formData.rentalInfo.rentContractStart}
                      onChange={(e) => setFormData({ ...formData, rentalInfo: { ...formData.rentalInfo, rentContractStart: e.target.value }})}
                    />
                  </div>
                  <div>
                    <label className="label">Contract End Date</label>
                    <input
                      type="date"
                      value={formData.rentalInfo.rentContractEnd}
                      onChange={(e) => setFormData({ ...formData, rentalInfo: { ...formData.rentalInfo, rentContractEnd: e.target.value }})}
                    />
                  </div>
                </div>
              </>
            )}
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
                placeholder="Dealer / Agent name"
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
          </div>
        )}

        {activeSection === "compliance" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Compliance</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Society Maintenance Outstanding (PKR)</label>
                <input
                  type="number"
                  value={formData.compliance.societyMaintenanceOutstandingPKR}
                  onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, societyMaintenanceOutstandingPKR: e.target.value }})}
                />
              </div>
              <div>
                <label className="label">Property Tax Paid Till</label>
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
                <label className="label">Structural Risk</label>
                <select
                  value={formData.compliance.structuralRisk}
                  onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, structuralRisk: e.target.value }})}
                >
                  <option value="none">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeSection === "control" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Control Information</h3>
            <div>
              <label className="label">Where Original Papers Are Stored</label>
              <input
                value={formData.controlInfo.whereOriginalPapersAreStored}
                onChange={(e) => setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whereOriginalPapersAreStored: e.target.value }})}
                placeholder="Locker at home, steel cabinet drawer #2"
              />
            </div>
            <div>
              <label className="label">Digital Copies Stored</label>
              <input
                value={formData.controlInfo.digitalCopiesStored}
                onChange={(e) => setFormData({ ...formData, controlInfo: { ...formData.controlInfo, digitalCopiesStored: e.target.value }})}
                placeholder="Google Drive > FamilyAssets > Apartments"
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
                    placeholder="e.g., acquired, renovation, rented_out"
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={formData.flags.incomeCriticalForFamily}
                  onChange={(e) => setFormData({ ...formData, flags: { ...formData.flags, incomeCriticalForFamily: e.target.checked }})}
                  style={{ width: "auto" }}
                />
                <label>Income Critical For Family</label>
              </div>
            </div>
            <div>
              <label className="label">Vacancy Risk If Tenant Leaves</label>
              <select
                value={formData.flags.vacancyRiskIfTenantLeaves}
                onChange={(e) => setFormData({ ...formData, flags: { ...formData.flags, vacancyRiskIfTenantLeaves: e.target.value }})}
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
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.5rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
                <select
                  value={contact.personId}
                  onChange={(e) => {
                    const newContacts = [...formData.relatedContacts];
                    newContacts[idx].personId = e.target.value;
                    setFormData({ ...formData, relatedContacts: newContacts });
                  }}
                  required
                >
                  <option value="">Select contact</option>
                  {people.map((person) => (
                    <option key={person._id} value={person._id}>
                      {person.fullName} ({person.relationToFamily}) - {person.status}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Relation"
                  value={contact.relation}
                  onChange={(e) => {
                    const newContacts = [...formData.relatedContacts];
                    newContacts[idx].relation = e.target.value;
                    setFormData({ ...formData, relatedContacts: newContacts });
                  }}
                />
                <input
                  placeholder="Contact Info"
                  value={contact.contact}
                  onChange={(e) => {
                    const newContacts = [...formData.relatedContacts];
                    newContacts[idx].contact = e.target.value;
                    setFormData({ ...formData, relatedContacts: newContacts });
                  }}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, relatedContacts: [...formData.relatedContacts, { personId: "", relation: "", contact: "" }]})}
              style={{ background: "#6AB090", width: "auto", padding: "0.5rem 1rem" }}
            >
              + Add Another Contact
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
