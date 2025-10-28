"use client";

import { useState, useEffect } from "react";

export default function VehicleAssetForm({ onCancel }) {
  const [people, setPeople] = useState([]);
  const [activeSection, setActiveSection] = useState("basic");
  const [formData, setFormData] = useState({
    assetType: "vehicle",
    title: "",
    nickname: "",
    description: "",
    vehicleType: "car",
    usageType: "family_use",
    possessionStatus: "in_our_possession",
    isIncomeGenerating: false,
    currentStatus: "clean",
    registration: {
      registrationNumber: "",
      registrationCity: "",
      registrationDate: "",
      exciseFileNumber: "",
      isRegistrationClear: true,
      tokenTaxStatus: "clear",
      tokenTaxPaidTill: "",
      ownershipOnBook: "",
      notes: "",
    },
    specs: {
      make: "",
      model: "",
      variant: "",
      modelYear: "",
      fuelType: "petrol",
      batteryCapacityKWh: "",
      motorPowerKW: "",
      torqueNm: "",
      topSpeedKph: "",
      color: "",
      seatingCapacity: "",
      chassisNumber: "",
      engineNumberOrMotorId: "",
      odometerKm: "",
      tyreInfo: {
        frontTyreSize: "",
        rearTyreSize: "",
        tyreConditionNotes: "",
        lastTyreChangeDate: "",
      },
    },
    owners: [{ personId: "", percentage: 100, ownershipType: "legal owner" }],
    primaryUsers: [{ personName: "", relation: "", contact: "", usageNotes: "" }],
    acquisitionInfo: {
      acquiredDate: "",
      acquiredFrom: "",
      method: "purchased",
      priceOrValueAtAcquisitionPKR: "",
      paymentMode: "",
      witnesses: [""],
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
      isInsured: true,
      insuranceCompany: "",
      policyNumber: "",
      insuranceExpiry: "",
      coverageType: "comprehensive",
      hasAccidentClaimHistory: false,
      challanHistory: [],
    },
    maintenance: {
      lastServiceDate: "",
      lastServiceNotes: "",
      nextServiceDueKm: "",
      brakeCondition: "",
      batteryHealthEstimatePct: "",
      issues: [""],
    },
    controlInfo: {
      whoHasKeys: [{ holderName: "", relation: "", contact: "", notes: "" }],
      whereOriginalPapersAreStored: "",
      digitalCopiesStored: "",
    },
    history: [{ date: "", action: "", details: "", actor: "" }],
    flags: {
      inheritanceSensitive: false,
      dailyUseCritical: false,
      transferToSonPlanned: false,
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
    { id: "registration", label: "Registration" },
    { id: "specs", label: "Specifications" },
    { id: "owners", label: "Ownership" },
    { id: "users", label: "Primary Users" },
    { id: "acquisition", label: "Acquisition" },
    { id: "valuation", label: "Valuation" },
    { id: "compliance", label: "Insurance & Compliance" },
    { id: "maintenance", label: "Maintenance" },
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
      <h2>Add New Vehicle Asset</h2>
      
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
                placeholder="e.g., White Honri VE 2.0"
              />
            </div>
            <div>
              <label className="label">Nickname</label>
              <input
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                placeholder="e.g., Small EV, Family Car"
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                placeholder="City EV, used for daily commute..."
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Vehicle Type</label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                >
                  <option value="car">Car</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                  <option value="rickshaw">Rickshaw</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">Usage Type</label>
                <select
                  value={formData.usageType}
                  onChange={(e) => setFormData({ ...formData, usageType: e.target.value })}
                >
                  <option value="family_use">Family Use</option>
                  <option value="business">Business</option>
                  <option value="rental">Rental</option>
                  <option value="commercial">Commercial</option>
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

        {activeSection === "registration" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Registration Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Registration Number *</label>
                <input
                  value={formData.registration.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registration: { ...formData.registration, registrationNumber: e.target.value }})}
                  required
                  placeholder="e.g., ABC-123 Islamabad"
                />
              </div>
              <div>
                <label className="label">Registration City</label>
                <input
                  value={formData.registration.registrationCity}
                  onChange={(e) => setFormData({ ...formData, registration: { ...formData.registration, registrationCity: e.target.value }})}
                  placeholder="e.g., Islamabad, Lahore"
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Registration Date</label>
                <input
                  type="date"
                  value={formData.registration.registrationDate}
                  onChange={(e) => setFormData({ ...formData, registration: { ...formData.registration, registrationDate: e.target.value }})}
                />
              </div>
              <div>
                <label className="label">Excise File Number</label>
                <input
                  value={formData.registration.exciseFileNumber}
                  onChange={(e) => setFormData({ ...formData, registration: { ...formData.registration, exciseFileNumber: e.target.value }})}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Token Tax Status</label>
                <select
                  value={formData.registration.tokenTaxStatus}
                  onChange={(e) => setFormData({ ...formData, registration: { ...formData.registration, tokenTaxStatus: e.target.value }})}
                >
                  <option value="clear">Clear</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="label">Token Tax Paid Till</label>
                <input
                  type="date"
                  value={formData.registration.tokenTaxPaidTill}
                  onChange={(e) => setFormData({ ...formData, registration: { ...formData.registration, tokenTaxPaidTill: e.target.value }})}
                />
              </div>
            </div>
            <div>
              <label className="label">Ownership On Book</label>
              <input
                value={formData.registration.ownershipOnBook}
                onChange={(e) => setFormData({ ...formData, registration: { ...formData.registration, ownershipOnBook: e.target.value }})}
                placeholder="Name as per registration book"
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={formData.registration.isRegistrationClear}
                onChange={(e) => setFormData({ ...formData, registration: { ...formData.registration, isRegistrationClear: e.target.checked }})}
                style={{ width: "auto" }}
              />
              <label>Registration is Clear</label>
            </div>
            <div>
              <label className="label">Registration Notes</label>
              <textarea
                value={formData.registration.notes}
                onChange={(e) => setFormData({ ...formData, registration: { ...formData.registration, notes: e.target.value }})}
                rows="2"
                placeholder="Any notes about registration status..."
              />
            </div>
          </div>
        )}

        {activeSection === "specs" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Vehicle Specifications</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Make</label>
                <input
                  value={formData.specs.make}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, make: e.target.value }})}
                  placeholder="e.g., Honri, Toyota, Honda"
                />
              </div>
              <div>
                <label className="label">Model</label>
                <input
                  value={formData.specs.model}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, model: e.target.value }})}
                  placeholder="e.g., VE 2.0, Corolla, Civic"
                />
              </div>
              <div>
                <label className="label">Variant</label>
                <input
                  value={formData.specs.variant}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, variant: e.target.value }})}
                  placeholder="e.g., Base, XLi, VTi"
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Model Year</label>
                <input
                  type="number"
                  value={formData.specs.modelYear}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, modelYear: e.target.value }})}
                  placeholder="2025"
                />
              </div>
              <div>
                <label className="label">Fuel Type</label>
                <select
                  value={formData.specs.fuelType}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, fuelType: e.target.value }})}
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="cng">CNG</option>
                </select>
              </div>
              <div>
                <label className="label">Color</label>
                <input
                  value={formData.specs.color}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, color: e.target.value }})}
                  placeholder="e.g., White, Black"
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Chassis Number</label>
                <input
                  value={formData.specs.chassisNumber}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, chassisNumber: e.target.value }})}
                />
              </div>
              <div>
                <label className="label">Engine / Motor Number</label>
                <input
                  value={formData.specs.engineNumberOrMotorId}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, engineNumberOrMotorId: e.target.value }})}
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Odometer (Km)</label>
                <input
                  type="number"
                  value={formData.specs.odometerKm}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, odometerKm: e.target.value }})}
                />
              </div>
              <div>
                <label className="label">Seating Capacity</label>
                <input
                  type="number"
                  value={formData.specs.seatingCapacity}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, seatingCapacity: e.target.value }})}
                />
              </div>
            </div>
            {formData.specs.fuelType === "electric" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", padding: "1rem", background: "#f0f9ff", borderRadius: "4px" }}>
                <div>
                  <label className="label">Battery Capacity (kWh)</label>
                  <input
                    type="number"
                    value={formData.specs.batteryCapacityKWh}
                    onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, batteryCapacityKWh: e.target.value }})}
                  />
                </div>
                <div>
                  <label className="label">Motor Power (kW)</label>
                  <input
                    type="number"
                    value={formData.specs.motorPowerKW}
                    onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, motorPowerKW: e.target.value }})}
                  />
                </div>
                <div>
                  <label className="label">Top Speed (km/h)</label>
                  <input
                    type="number"
                    value={formData.specs.topSpeedKph}
                    onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, topSpeedKph: e.target.value }})}
                  />
                </div>
              </div>
            )}
            <div style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
              <h4 style={{ marginBottom: "0.75rem" }}>Tyre Information</h4>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="label">Front Tyre Size</label>
                  <input
                    value={formData.specs.tyreInfo.frontTyreSize}
                    onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, tyreInfo: { ...formData.specs.tyreInfo, frontTyreSize: e.target.value }}})}
                    placeholder="e.g., 155/65R14"
                  />
                </div>
                <div>
                  <label className="label">Rear Tyre Size</label>
                  <input
                    value={formData.specs.tyreInfo.rearTyreSize}
                    onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, tyreInfo: { ...formData.specs.tyreInfo, rearTyreSize: e.target.value }}})}
                    placeholder="e.g., 155/65R14"
                  />
                </div>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <label className="label">Tyre Condition Notes</label>
                <input
                  value={formData.specs.tyreInfo.tyreConditionNotes}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, tyreInfo: { ...formData.specs.tyreInfo, tyreConditionNotes: e.target.value }}})}
                  placeholder="Front tyres new, rear need replacement soon"
                />
              </div>
              <div style={{ marginTop: "1rem" }}>
                <label className="label">Last Tyre Change Date</label>
                <input
                  type="date"
                  value={formData.specs.tyreInfo.lastTyreChangeDate}
                  onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, tyreInfo: { ...formData.specs.tyreInfo, lastTyreChangeDate: e.target.value }}})}
                />
              </div>
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

        {activeSection === "users" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Primary Users</h3>
            <p style={{ fontSize: "0.9rem", color: "#666" }}>People who regularly use this vehicle</p>
            {formData.primaryUsers.map((user, idx) => (
              <div key={idx} style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label className="label">Name</label>
                    <input
                      value={user.personName}
                      onChange={(e) => {
                        const newUsers = [...formData.primaryUsers];
                        newUsers[idx].personName = e.target.value;
                        setFormData({ ...formData, primaryUsers: newUsers });
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Relation</label>
                    <input
                      value={user.relation}
                      onChange={(e) => {
                        const newUsers = [...formData.primaryUsers];
                        newUsers[idx].relation = e.target.value;
                        setFormData({ ...formData, primaryUsers: newUsers });
                      }}
                      placeholder="e.g., son, father"
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                  <div>
                    <label className="label">Contact</label>
                    <input
                      value={user.contact}
                      onChange={(e) => {
                        const newUsers = [...formData.primaryUsers];
                        newUsers[idx].contact = e.target.value;
                        setFormData({ ...formData, primaryUsers: newUsers });
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Usage Notes</label>
                    <input
                      value={user.usageNotes}
                      onChange={(e) => {
                        const newUsers = [...formData.primaryUsers];
                        newUsers[idx].usageNotes = e.target.value;
                        setFormData({ ...formData, primaryUsers: newUsers });
                      }}
                      placeholder="Daily commute, weekend trips, etc."
                    />
                  </div>
                </div>
                {formData.primaryUsers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newUsers = formData.primaryUsers.filter((_, i) => i !== idx);
                      setFormData({ ...formData, primaryUsers: newUsers });
                    }}
                    style={{ marginTop: "0.5rem", background: "#ef5350", width: "auto", padding: "0.35rem 1rem", fontSize: "0.85rem" }}
                  >
                    Remove User
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, primaryUsers: [...formData.primaryUsers, { personName: "", relation: "", contact: "", usageNotes: "" }]})}
              style={{ background: "#6AB090", width: "auto", padding: "0.5rem 1rem" }}
            >
              + Add Primary User
            </button>
          </div>
        )}

        {activeSection === "acquisition" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Acquisition Details</h3>
            {/* ...existing acquisition fields similar to other forms... */}
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
                  placeholder="Dealer name or previous owner"
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
          </div>
        )}

        {activeSection === "valuation" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Valuation</h3>
            {/* ...existing valuation fields... */}
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
          </div>
        )}

        {activeSection === "compliance" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Insurance & Compliance</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <input
                type="checkbox"
                checked={formData.compliance.isInsured}
                onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, isInsured: e.target.checked }})}
                style={{ width: "auto" }}
              />
              <label>Currently Insured</label>
            </div>
            {formData.compliance.isInsured && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="label">Insurance Company</label>
                    <input
                      value={formData.compliance.insuranceCompany}
                      onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, insuranceCompany: e.target.value }})}
                    />
                  </div>
                  <div>
                    <label className="label">Policy Number</label>
                    <input
                      value={formData.compliance.policyNumber}
                      onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, policyNumber: e.target.value }})}
                    />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label className="label">Insurance Expiry</label>
                    <input
                      type="date"
                      value={formData.compliance.insuranceExpiry}
                      onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, insuranceExpiry: e.target.value }})}
                    />
                  </div>
                  <div>
                    <label className="label">Coverage Type</label>
                    <select
                      value={formData.compliance.coverageType}
                      onChange={(e) => setFormData({ ...formData, compliance: { ...formData.compliance, coverageType: e.target.value }})}
                    >
                      <option value="comprehensive">Comprehensive</option>
                      <option value="third_party">Third Party</option>
                      <option value="act_only">Act Only</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeSection === "maintenance" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Maintenance</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Last Service Date</label>
                <input
                  type="date"
                  value={formData.maintenance.lastServiceDate}
                  onChange={(e) => setFormData({ ...formData, maintenance: { ...formData.maintenance, lastServiceDate: e.target.value }})}
                />
              </div>
              <div>
                <label className="label">Next Service Due (Km)</label>
                <input
                  type="number"
                  value={formData.maintenance.nextServiceDueKm}
                  onChange={(e) => setFormData({ ...formData, maintenance: { ...formData.maintenance, nextServiceDueKm: e.target.value }})}
                />
              </div>
            </div>
            <div>
              <label className="label">Last Service Notes</label>
              <textarea
                value={formData.maintenance.lastServiceNotes}
                onChange={(e) => setFormData({ ...formData, maintenance: { ...formData.maintenance, lastServiceNotes: e.target.value }})}
                rows="2"
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label className="label">Brake Condition</label>
                <input
                  value={formData.maintenance.brakeCondition}
                  onChange={(e) => setFormData({ ...formData, maintenance: { ...formData.maintenance, brakeCondition: e.target.value }})}
                  placeholder="e.g., OK, Needs attention"
                />
              </div>
              {formData.specs.fuelType === "electric" && (
                <div>
                  <label className="label">Battery Health (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.maintenance.batteryHealthEstimatePct}
                    onChange={(e) => setFormData({ ...formData, maintenance: { ...formData.maintenance, batteryHealthEstimatePct: e.target.value }})}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === "control" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Control Information</h3>
            {/* ...similar to house control info... */}
            <div>
              <label className="label">Where Original Papers Are Stored</label>
              <input
                value={formData.controlInfo.whereOriginalPapersAreStored}
                onChange={(e) => setFormData({ ...formData, controlInfo: { ...formData.controlInfo, whereOriginalPapersAreStored: e.target.value }})}
                placeholder="Car file in lounge cupboard, blue folder"
              />
            </div>
            <div>
              <label className="label">Digital Copies Stored</label>
              <input
                value={formData.controlInfo.digitalCopiesStored}
                onChange={(e) => setFormData({ ...formData, controlInfo: { ...formData.controlInfo, digitalCopiesStored: e.target.value }})}
                placeholder="Google Drive > FamilyAssets > Vehicles"
              />
            </div>
          </div>
        )}

        {activeSection === "history" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            {/* ...similar to other history sections... */}
            <h3>History Timeline</h3>
            {formData.history.map((entry, idx) => (
              <div key={idx} style={{ padding: "1rem", border: "1px solid #ddd", borderRadius: "4px" }}>
                {/* ...existing history fields... */}
              </div>
            ))}
          </div>
        )}

        {activeSection === "flags" && (
          <div style={{ display: "grid", gap: "1rem" }}>
            <h3>Flags & Internal Notes</h3>
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
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
                  checked={formData.flags.dailyUseCritical}
                  onChange={(e) => setFormData({ ...formData, flags: { ...formData.flags, dailyUseCritical: e.target.checked }})}
                  style={{ width: "auto" }}
                />
                <label>Daily Use Critical</label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={formData.flags.transferToSonPlanned}
                  onChange={(e) => setFormData({ ...formData, flags: { ...formData.flags, transferToSonPlanned: e.target.checked }})}
                  style={{ width: "auto" }}
                />
                <label>Transfer Planned</label>
              </div>
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
