"use client";

import { useState, useEffect } from "react";
import PlotAssetForm from "./PlotAssetForm";
import HouseAssetForm from "./HouseAssetForm";
import ApartmentAssetForm from "./ApartmentAssetForm";
import VehicleAssetForm from "./VehicleAssetForm";
import { useRouter } from "next/navigation";
import styles from "./AddAssetForm.module.css";

export default function AddAssetForm() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [people, setPeople] = useState([]);
  const [activeSection, setActiveSection] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    assetType: "land_plot",
    description: "",
    country: "Pakistan",
    city: "",
    areaOrSector: "",
    currentStatus: "clean",
    location: {
      tehsil: "",
      district: "",
      mouzaVillage: "",
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

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    if (showForm) {
      fetch("/api/people")
        .then((res) => res.json())
        .then((data) => setPeople(data));
    }
  }, [showForm]);

  const addContact = () => {
    setContacts([...contacts, {
      id: Date.now(),
      category: "lawyer",
      name: "",
      phoneNumber: "",
      email: "",
      notes: ""
    }]);
  };

  const removeContact = (id) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const updateContact = (id, field, value) => {
    setContacts(contacts.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          assetType: formData.assetType,
          description: formData.description,
          location: {
            country: formData.country,
            city: formData.city,
            areaOrSector: formData.areaOrSector,
          },
          currentStatus: formData.currentStatus,
          relatedContacts: contacts.filter(c => c.name && c.phoneNumber).map(c => ({
            category: c.category,
            name: c.name,
            phoneNumber: c.phoneNumber,
            email: c.email,
            notes: c.notes
          }))
        }),
      });

      if (response.ok) {
        alert("✅ Asset added successfully!");
        router.push("/assets");
        router.refresh();
      } else {
        const result = await response.json();
        setError(result.error || "Failed to add asset");
      }
    } catch (err) {
      console.error(err);
      setError("Network error: " + err.message);
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

  if (!formData.assetType) {
    return (
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2>Select Asset Type</h2>
        <p style={{ marginBottom: "1.5rem", color: "#666" }}>Choose the type of asset you want to add</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <button
            onClick={() => setFormData({ ...formData, assetType: "land_plot" })}
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
            onClick={() => setFormData({ ...formData, assetType: "house" })}
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
            onClick={() => setFormData({ ...formData, assetType: "apartment" })}
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
            onClick={() => setFormData({ ...formData, assetType: "vehicle" })}
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
    switch (formData.assetType) {
      case "land_plot":
        return <PlotAssetForm onCancel={() => setFormData({ ...formData, assetType: null })} />;
      case "house":
        return <HouseAssetForm onCancel={() => setFormData({ ...formData, assetType: null })} />;
      case "apartment":
        return <ApartmentAssetForm onCancel={() => setFormData({ ...formData, assetType: null })} />;
      case "vehicle":
        return <VehicleAssetForm onCancel={() => setFormData({ ...formData, assetType: null })} />;
      default:
        return null;
    }
  };

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      <h2>Add New Asset</h2>
      
      {renderAssetForm()}

      {/* Related Contacts Section */}
      <div className={`${styles.sectionHeader} ${styles.fullWidth}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>📞 Related Contacts (Optional)</h3>
          <button
            type="button"
            onClick={addContact}
            style={{
              padding: "0.5rem 1rem",
              background: "#7FC6A4",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "0.85rem"
            }}
          >
            + Add Contact
          </button>
        </div>
      </div>

      {contacts.length > 0 && (
        <div className={styles.fullWidth}>
          {contacts.map((contact, idx) => (
            <div key={contact.id} style={{
              padding: "1rem",
              background: "#f9f9f9",
              borderRadius: "8px",
              marginBottom: "1rem",
              border: "1px solid #e0e0e0"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <strong style={{ color: "#6D7692" }}>Contact {idx + 1}</strong>
                <button
                  type="button"
                  onClick={() => removeContact(contact.id)}
                  style={{
                    background: "#ef5350",
                    color: "white",
                    border: "none",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "0.85rem"
                  }}
                >
                  Remove
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                <div>
                  <label className={styles.label}>Category *</label>
                  <select
                    value={contact.category}
                    onChange={(e) => updateContact(contact.id, "category", e.target.value)}
                    className={styles.select}
                  >
                    <option value="lawyer">👨‍⚖️ Lawyer</option>
                    <option value="agent">🤵 Agent</option>
                    <option value="caretaker">👷 Caretaker</option>
                    <option value="tenant">🏠 Tenant</option>
                    <option value="property_dealer">🏘️ Property Dealer</option>
                    <option value="builder">🏗️ Builder</option>
                    <option value="conflict_person">⚠️ Conflict Person</option>
                    <option value="government_official">🏛️ Government Official</option>
                    <option value="other">📋 Other</option>
                  </select>
                </div>

                <div>
                  <label className={styles.label}>Name *</label>
                  <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => updateContact(contact.id, "name", e.target.value)}
                    placeholder="Contact name"
                    className={styles.input}
                  />
                </div>

                <div>
                  <label className={styles.label}>Phone Number *</label>
                  <input
                    type="tel"
                    value={contact.phoneNumber}
                    onChange={(e) => updateContact(contact.id, "phoneNumber", e.target.value)}
                    placeholder="0300-1234567"
                    className={styles.input}
                  />
                </div>

                <div>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => updateContact(contact.id, "email", e.target.value)}
                    placeholder="email@example.com"
                    className={styles.input}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label className={styles.label}>Notes</label>
                  <textarea
                    value={contact.notes}
                    onChange={(e) => updateContact(contact.id, "notes", e.target.value)}
                    placeholder="Additional information..."
                    rows={2}
                    className={styles.textarea}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ...existing buttons... */}
    </div>
  );
}