"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../AddAssetForm.module.css";

export default function EditAssetForm({ asset, users }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // Basic info
    title: asset.title || "",
    nickname: asset.nickname || "",
    description: asset.description || "",
    currentStatus: asset.currentStatus || "clean",
    
    // Type-specific
    landUseType: asset.landUseType || "",
    houseUsageType: asset.houseUsageType || "",
    apartmentUsageType: asset.apartmentUsageType || "",
    vehicleType: asset.vehicleType || "",
    isPrimaryFamilyResidence: asset.isPrimaryFamilyResidence || false,
    isIncomeGenerating: asset.isIncomeGenerating || false,
    
    // Location
    country: asset.location?.country || "Pakistan",
    province: asset.location?.province || "",
    city: asset.location?.city || "",
    district: asset.location?.district || "",
    tehsil: asset.location?.tehsil || "",
    areaOrSector: asset.location?.areaOrSector || "",
    societyOrProject: asset.location?.societyOrProject || "",
    blockOrPhase: asset.location?.blockOrPhase || "",
    streetNumber: asset.location?.streetNumber || "",
    plotNumber: asset.location?.plotNumber || "",
    houseNumber: asset.location?.houseNumber || "",
    apartmentNumber: asset.location?.apartmentNumber || "",
    floorNumber: asset.location?.floorNumber || "",
    fullAddress: asset.location?.fullAddress || "",
    nearestLandmark: asset.location?.nearestLandmark || "",
    geoLat: asset.location?.geoCoordinates?.lat || "",
    geoLng: asset.location?.geoCoordinates?.lng || "",
    
    // Dimensions (for plots)
    totalAreaValue: asset.dimensions?.totalArea?.value || "",
    totalAreaUnit: asset.dimensions?.totalArea?.unit || "marla",
    convertedAreaSqFt: asset.dimensions?.convertedAreaSqFt || "",
    frontWidthFt: asset.dimensions?.frontWidthFt || "",
    depthFt: asset.dimensions?.depthFt || "",
    isCornerPlot: asset.dimensions?.isCornerPlot || false,
    isParkFacing: asset.dimensions?.isParkFacing || false,
    isMainRoadFacing: asset.dimensions?.isMainRoadFacing || false,
    
    // Structure (for houses/apartments)
    structureLandAreaValue: asset.structure?.landArea?.value || "",
    structureLandAreaUnit: asset.structure?.landArea?.unit || "marla",
    coveredAreaSqFt: asset.structure?.coveredAreaSqFt || "",
    floors: asset.structure?.floors || "",
    rooms: asset.structure?.rooms || "",
    bedrooms: asset.structure?.bedrooms || "",
    bathrooms: asset.structure?.bathrooms || "",
    kitchens: asset.structure?.kitchens || "",
    drawingRooms: asset.structure?.drawingRooms || "",
    tvLounges: asset.structure?.tvLounges || "",
    storeRooms: asset.structure?.storeRooms || "",
    servantQuarters: asset.structure?.servantQuarters || false,
    garageOrParking: asset.structure?.garageOrParking || "",
    constructionYear: asset.structure?.constructionYear || "",
    conditionSummary: asset.structure?.conditionSummary || "",
    
    // Vehicle specs
    make: asset.specs?.make || "",
    model: asset.specs?.model || "",
    modelYear: asset.specs?.modelYear || "",
    color: asset.specs?.color || "",
    engineCapacityCC: asset.specs?.engineCapacityCC || "",
    fuelType: asset.specs?.fuelType || "petrol",
    transmission: asset.specs?.transmission || "manual",
    odometerKm: asset.specs?.odometerKm || "",
    chassisNumber: asset.specs?.chassisNumber || "",
    engineNumber: asset.specs?.engineNumber || "",
    
    // Registration
    registrationNumber: asset.registration?.registrationNumber || "",
    registrationCity: asset.registration?.registrationCity || "",
    registrationDate: asset.registration?.registrationDate || "",
    tokenTaxPaidTill: asset.registration?.tokenTaxPaidTill || "",
    insuranceValidTill: asset.registration?.insuranceValidTill || "",
    fitnessValidTill: asset.registration?.fitnessValidTill || "",
    
    // Acquisition
    acquiredDate: asset.acquisitionInfo?.acquiredDate || "",
    acquiredFrom: asset.acquisitionInfo?.acquiredFrom || "",
    acquisitionMethod: asset.acquisitionInfo?.method || "purchased",
    acquisitionPrice: asset.acquisitionInfo?.priceOrValueAtAcquisitionPKR || "",
    acquisitionNotes: asset.acquisitionInfo?.notes || "",
    
    // Valuation
    estimatedMarketValue: asset.valuation?.estimatedMarketValuePKR || "",
    valuationDate: asset.valuation?.estimatedDate || "",
    valuationSource: asset.valuation?.source || "",
    forcedSaleValue: asset.valuation?.forcedSaleValuePKR || "",
    valuationNotes: asset.valuation?.valuationNotes || "",
    
    // Mutation
    registryNumber: asset.mutationAndTitle?.registryNumber || "",
    registryDate: asset.mutationAndTitle?.registryDate || "",
    mutationNumber: asset.mutationAndTitle?.mutationNumber || "",
    mutationDate: asset.mutationAndTitle?.mutationDate || "",
    fardNumber: asset.mutationAndTitle?.fardNumber || "",
    khasraNumber: asset.mutationAndTitle?.khasraNumber || "",
    propertyTaxNumber: asset.mutationAndTitle?.propertyTaxNumber || "",
    isTitleClear: asset.mutationAndTitle?.isTitleClear || false,
    titleNotes: asset.mutationAndTitle?.titleNotes || "",
    
    // Compliance
    annualPropertyTax: asset.compliance?.annualPropertyTaxPKR || "",
    propertyTaxPaidTill: asset.compliance?.propertyTaxPaidTill || "",
    electricityBillNumber: asset.compliance?.electricityBillNumber || "",
    gasBillNumber: asset.compliance?.gasBillNumber || "",
    waterBillNumber: asset.compliance?.waterBillNumber || "",
    encroachmentRisk: asset.compliance?.encroachmentRisk || "none",
    govtAcquisitionRisk: asset.compliance?.govtAcquisitionRisk || "none",
    
    // Dispute
    isInDispute: asset.disputeInfo?.isInDispute || false,
    disputeType: asset.disputeInfo?.type || "",
    disputeStartedDate: asset.disputeInfo?.startedDate || "",
    disputeDetails: asset.disputeInfo?.details || "",
    lawyerName: asset.disputeInfo?.lawyerName || "",
    lawyerPhone: asset.disputeInfo?.lawyerPhone || "",
    caseNumber: asset.disputeInfo?.caseNumber || "",
    courtName: asset.disputeInfo?.courtName || "",
    nextHearingDate: asset.disputeInfo?.nextHearingDate || "",
    
    // Other
    tags: (asset.tags || []).join(", "),
    notesInternal: asset.notesInternal || "",
    needsAttention: asset.flags?.needsAttention || false,
    highValue: asset.flags?.highValue || false,
    hasLegalIssues: asset.flags?.hasLegalIssues || false
  });

  const [owners, setOwners] = useState(asset.owners || [{ personId: "", percentage: 100, ownershipType: "legal_owner" }]);
  const [contacts, setContacts] = useState(asset.relatedContacts || []);

  const addOwner = () => {
    setOwners([...owners, { personId: "", percentage: 0, ownershipType: "legal_owner" }]);
  };

  const removeOwner = (index) => {
    setOwners(owners.filter((_, i) => i !== index));
  };

  const updateOwner = (index, field, value) => {
    setOwners(owners.map((o, i) => i === index ? { ...o, [field]: value } : o));
  };

  const addContact = () => {
    setContacts([...contacts, { category: "lawyer", name: "", phoneNumber: "", email: "", notes: "" }]);
  };

  const removeContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const updateContact = (index, field, value) => {
    setContacts(contacts.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        nickname: formData.nickname,
        description: formData.description,
        currentStatus: formData.currentStatus,
        
        location: {
          country: formData.country,
          province: formData.province,
          city: formData.city,
          district: formData.district,
          tehsil: formData.tehsil,
          areaOrSector: formData.areaOrSector,
          societyOrProject: formData.societyOrProject,
          blockOrPhase: formData.blockOrPhase,
          streetNumber: formData.streetNumber,
          plotNumber: formData.plotNumber,
          houseNumber: formData.houseNumber,
          apartmentNumber: formData.apartmentNumber,
          floorNumber: formData.floorNumber,
          fullAddress: formData.fullAddress,
          nearestLandmark: formData.nearestLandmark,
          geoCoordinates: formData.geoLat && formData.geoLng ? {
            lat: parseFloat(formData.geoLat),
            lng: parseFloat(formData.geoLng)
          } : undefined
        },
        
        owners: owners.filter(o => o.personId && o.percentage),
        
        acquisitionInfo: {
          acquiredDate: formData.acquiredDate || undefined,
          acquiredFrom: formData.acquiredFrom,
          method: formData.acquisitionMethod,
          priceOrValueAtAcquisitionPKR: formData.acquisitionPrice ? parseInt(formData.acquisitionPrice) : undefined,
          notes: formData.acquisitionNotes
        },
        
        valuation: {
          estimatedMarketValuePKR: formData.estimatedMarketValue ? parseInt(formData.estimatedMarketValue) : undefined,
          estimatedDate: formData.valuationDate || undefined,
          source: formData.valuationSource,
          forcedSaleValuePKR: formData.forcedSaleValue ? parseInt(formData.forcedSaleValue) : undefined,
          valuationNotes: formData.valuationNotes
        },
        
        mutationAndTitle: {
          registryNumber: formData.registryNumber,
          registryDate: formData.registryDate || undefined,
          mutationNumber: formData.mutationNumber,
          mutationDate: formData.mutationDate || undefined,
          fardNumber: formData.fardNumber,
          khasraNumber: formData.khasraNumber,
          propertyTaxNumber: formData.propertyTaxNumber,
          isTitleClear: formData.isTitleClear,
          titleNotes: formData.titleNotes
        },
        
        compliance: {
          annualPropertyTaxPKR: formData.annualPropertyTax ? parseInt(formData.annualPropertyTax) : undefined,
          propertyTaxPaidTill: formData.propertyTaxPaidTill || undefined,
          electricityBillNumber: formData.electricityBillNumber,
          gasBillNumber: formData.gasBillNumber,
          waterBillNumber: formData.waterBillNumber,
          encroachmentRisk: formData.encroachmentRisk,
          govtAcquisitionRisk: formData.govtAcquisitionRisk
        },
        
        disputeInfo: {
          isInDispute: formData.isInDispute
        },
        
        relatedContacts: contacts.filter(c => c.name && c.phoneNumber),
        
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        notesInternal: formData.notesInternal,
        
        flags: {
          needsAttention: formData.needsAttention,
          highValue: formData.highValue,
          hasLegalIssues: formData.hasLegalIssues
        }
      };

      // Add type-specific fields
      if (asset.assetType === "land_plot") {
        payload.landUseType = formData.landUseType;
        payload.isPrimaryFamilyResidence = formData.isPrimaryFamilyResidence;
        payload.isIncomeGenerating = formData.isIncomeGenerating;
        payload.dimensions = {
          totalArea: formData.totalAreaValue ? { value: parseInt(formData.totalAreaValue), unit: formData.totalAreaUnit } : undefined,
          convertedAreaSqFt: formData.convertedAreaSqFt ? parseInt(formData.convertedAreaSqFt) : undefined,
          frontWidthFt: formData.frontWidthFt ? parseInt(formData.frontWidthFt) : undefined,
          depthFt: formData.depthFt ? parseInt(formData.depthFt) : undefined,
          isCornerPlot: formData.isCornerPlot,
          isParkFacing: formData.isParkFacing,
          isMainRoadFacing: formData.isMainRoadFacing
        };
      } else if (asset.assetType === "house" || asset.assetType === "apartment") {
        payload.houseUsageType = formData.houseUsageType;
        payload.apartmentUsageType = formData.apartmentUsageType;
        payload.isPrimaryFamilyResidence = formData.isPrimaryFamilyResidence;
        payload.isIncomeGenerating = formData.isIncomeGenerating;
        payload.structure = {
          landArea: formData.structureLandAreaValue ? { value: parseInt(formData.structureLandAreaValue), unit: formData.structureLandAreaUnit } : undefined,
          coveredAreaSqFt: formData.coveredAreaSqFt ? parseInt(formData.coveredAreaSqFt) : undefined,
          floors: formData.floors ? parseInt(formData.floors) : undefined,
          rooms: formData.rooms ? parseInt(formData.rooms) : undefined,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
          kitchens: formData.kitchens ? parseInt(formData.kitchens) : undefined,
          drawingRooms: formData.drawingRooms ? parseInt(formData.drawingRooms) : undefined,
          tvLounges: formData.tvLounges ? parseInt(formData.tvLounges) : undefined,
          storeRooms: formData.storeRooms ? parseInt(formData.storeRooms) : undefined,
          servantQuarters: formData.servantQuarters,
          garageOrParking: formData.garageOrParking,
          constructionYear: formData.constructionYear ? parseInt(formData.constructionYear) : undefined,
          conditionSummary: formData.conditionSummary
        };
      } else if (asset.assetType === "vehicle") {
        payload.vehicleType = formData.vehicleType;
        payload.specs = {
          make: formData.make,
          model: formData.model,
          modelYear: formData.modelYear ? parseInt(formData.modelYear) : undefined,
          color: formData.color,
          engineCapacityCC: formData.engineCapacityCC ? parseInt(formData.engineCapacityCC) : undefined,
          fuelType: formData.fuelType,
          transmission: formData.transmission,
          odometerKm: formData.odometerKm ? parseInt(formData.odometerKm) : undefined,
          chassisNumber: formData.chassisNumber,
          engineNumber: formData.engineNumber
        };
        payload.registration = {
          registrationNumber: formData.registrationNumber,
          registrationCity: formData.registrationCity,
          registrationDate: formData.registrationDate || undefined,
          tokenTaxPaidTill: formData.tokenTaxPaidTill || undefined,
          insuranceValidTill: formData.insuranceValidTill || undefined,
          fitnessValidTill: formData.fitnessValidTill || undefined
        };
      }

      if (formData.isInDispute) {
        payload.disputeInfo = {
          isInDispute: true,
          type: formData.disputeType,
          startedDate: formData.disputeStartedDate || undefined,
          details: formData.disputeDetails,
          lawyerName: formData.lawyerName,
          lawyerPhone: formData.lawyerPhone,
          caseNumber: formData.caseNumber,
          courtName: formData.courtName,
          nextHearingDate: formData.nextHearingDate || undefined
        };
      }

      const response = await fetch(`/api/assets/${asset._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("✅ Asset updated successfully!");
        router.push("/assets");
        router.refresh();
      } else {
        const result = await response.json();
        setError(result.error || "Failed to update asset");
      }
    } catch (err) {
      console.error(err);
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && (
        <div className={styles.errorAlert}>
          ⚠️ {error}
        </div>
      )}

      {/* Asset Type Display (read-only) */}
      <div className={`${styles.sectionHeader} ${styles.fullWidth}`}>
        <h3>Asset Type: {asset.assetType.replace(/_/g, " ").toUpperCase()}</h3>
      </div>

      {/* Basic Information */}
      <div className={`${styles.sectionHeader} ${styles.fullWidth}`}>
        <h3>📋 Basic Information</h3>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Nickname</label>
        <input
          type="text"
          value={formData.nickname}
          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
          className={styles.input}
        />
      </div>

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label className={styles.label}>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className={styles.textarea}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Current Status *</label>
        <select
          value={formData.currentStatus}
          onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
          required
          className={styles.select}
        >
          <option value="clean">✅ Clean</option>
          <option value="in_dispute">⚠️ In Dispute</option>
          <option value="under_transfer">🔄 Under Transfer</option>
          <option value="sold_but_not_cleared">⏳ Sold But Not Cleared</option>
          <option value="unknown">❓ Unknown</option>
        </select>
      </div>

      {/* Type-specific fields */}
      {asset.assetType === "land_plot" && (
        <>
          <div className={styles.formGroup}>
            <label className={styles.label}>Land Use Type</label>
            <select
              value={formData.landUseType}
              onChange={(e) => setFormData({ ...formData, landUseType: e.target.value })}
              className={styles.select}
            >
              <option value="">Select...</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="agricultural">Agricultural</option>
              <option value="industrial">Industrial</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </>
      )}

      {asset.assetType === "house" && (
        <div className={styles.formGroup}>
          <label className={styles.label}>House Usage Type</label>
          <select
            value={formData.houseUsageType}
            onChange={(e) => setFormData({ ...formData, houseUsageType: e.target.value })}
            className={styles.select}
          >
            <option value="">Select...</option>
            <option value="primary_residence">Primary Residence</option>
            <option value="rental">Rental</option>
            <option value="guest_house">Guest House</option>
            <option value="vacant">Vacant</option>
          </select>
        </div>
      )}

      {asset.assetType === "apartment" && (
        <div className={styles.formGroup}>
          <label className={styles.label}>Apartment Usage Type</label>
          <select
            value={formData.apartmentUsageType}
            onChange={(e) => setFormData({ ...formData, apartmentUsageType: e.target.value })}
            className={styles.select}
          >
            <option value="">Select...</option>
            <option value="primary_residence">Primary Residence</option>
            <option value="rental">Rental</option>
            <option value="investment">Investment</option>
            <option value="vacant">Vacant</option>
          </select>
        </div>
      )}

      {asset.assetType === "vehicle" && (
        <div className={styles.formGroup}>
          <label className={styles.label}>Vehicle Type</label>
          <select
            value={formData.vehicleType}
            onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
            className={styles.select}
          >
            <option value="">Select...</option>
            <option value="car">Car</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="truck">Truck</option>
            <option value="bus">Bus</option>
            <option value="van">Van</option>
            <option value="other">Other</option>
          </select>
        </div>
      )}

      {/* Location Section */}
      <div className={`${styles.sectionHeader} ${styles.fullWidth}`}>
        <h3>📍 Location Information</h3>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Country</label>
        <input type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className={styles.input} />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Province</label>
        <input type="text" value={formData.province} onChange={(e) => setFormData({ ...formData, province: e.target.value })} className={styles.input} />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>City</label>
        <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={styles.input} />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>District</label>
        <input type="text" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} className={styles.input} />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Area/Sector</label>
        <input type="text" value={formData.areaOrSector} onChange={(e) => setFormData({ ...formData, areaOrSector: e.target.value })} className={styles.input} />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Society/Project</label>
        <input type="text" value={formData.societyOrProject} onChange={(e) => setFormData({ ...formData, societyOrProject: e.target.value })} className={styles.input} />
      </div>

      {asset.assetType === "land_plot" && (
        <>
          <div className={styles.formGroup}>
            <label className={styles.label}>Plot Number</label>
            <input type="text" value={formData.plotNumber} onChange={(e) => setFormData({ ...formData, plotNumber: e.target.value })} className={styles.input} />
          </div>
        </>
      )}

      {(asset.assetType === "house" || asset.assetType === "apartment") && (
        <>
          <div className={styles.formGroup}>
            <label className={styles.label}>House/Building Number</label>
            <input type="text" value={formData.houseNumber} onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })} className={styles.input} />
          </div>

          {asset.assetType === "apartment" && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Apartment Number</label>
                <input type="text" value={formData.apartmentNumber} onChange={(e) => setFormData({ ...formData, apartmentNumber: e.target.value })} className={styles.input} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Floor Number</label>
                <input type="text" value={formData.floorNumber} onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })} className={styles.input} />
              </div>
            </>
          )}
        </>
      )}

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label className={styles.label}>Full Address</label>
        <textarea value={formData.fullAddress} onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })} rows={2} className={styles.textarea} />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Latitude</label>
        <input type="number" step="any" value={formData.geoLat} onChange={(e) => setFormData({ ...formData, geoLat: e.target.value })} className={styles.input} />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Longitude</label>
        <input type="number" step="any" value={formData.geoLng} onChange={(e) => setFormData({ ...formData, geoLng: e.target.value })} className={styles.input} />
      </div>

      {/* Dimensions Section (for plots) */}
      {asset.assetType === "land_plot" && (
        <>
          <div className={`${styles.sectionHeader} ${styles.fullWidth}`}>
            <h3>📐 Dimensions</h3>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Total Area Value</label>
            <input type="number" value={formData.totalAreaValue} onChange={(e) => setFormData({ ...formData, totalAreaValue: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Area Unit</label>
            <select value={formData.totalAreaUnit} onChange={(e) => setFormData({ ...formData, totalAreaUnit: e.target.value })} className={styles.select}>
              <option value="marla">Marla</option>
              <option value="kanal">Kanal</option>
              <option value="acre">Acre</option>
              <option value="sqft">Square Feet</option>
              <option value="sqyd">Square Yards</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Converted Area (Sq Ft)</label>
            <input type="number" value={formData.convertedAreaSqFt} onChange={(e) => setFormData({ ...formData, convertedAreaSqFt: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Front Width (ft)</label>
            <input type="number" value={formData.frontWidthFt} onChange={(e) => setFormData({ ...formData, frontWidthFt: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Depth (ft)</label>
            <input type="number" value={formData.depthFt} onChange={(e) => setFormData({ ...formData, depthFt: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input type="checkbox" checked={formData.isCornerPlot} onChange={(e) => setFormData({ ...formData, isCornerPlot: e.target.checked })} />
              {' '}Corner Plot
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input type="checkbox" checked={formData.isParkFacing} onChange={(e) => setFormData({ ...formData, isParkFacing: e.target.checked })} />
              {' '}Park Facing
            </label>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <input type="checkbox" checked={formData.isMainRoadFacing} onChange={(e) => setFormData({ ...formData, isMainRoadFacing: e.target.checked })} />
              {' '}Main Road Facing
            </label>
          </div>
        </>
      )}

      {/* Structure Section (for house/apartment) */}
      {(asset.assetType === "house" || asset.assetType === "apartment") && (
        <>
          <div className={`${styles.sectionHeader} ${styles.fullWidth}`}>
            <h3>🏗️ Structure Details</h3>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Covered Area (Sq Ft)</label>
            <input type="number" value={formData.coveredAreaSqFt} onChange={(e) => setFormData({ ...formData, coveredAreaSqFt: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Floors</label>
            <input type="number" value={formData.floors} onChange={(e) => setFormData({ ...formData, floors: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Bedrooms</label>
            <input type="number" value={formData.bedrooms} onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Bathrooms</label>
            <input type="number" value={formData.bathrooms} onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Kitchens</label>
            <input type="number" value={formData.kitchens} onChange={(e) => setFormData({ ...formData, kitchens: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Parking/Garage</label>
            <input type="text" value={formData.garageOrParking} onChange={(e) => setFormData({ ...formData, garageOrParking: e.target.value })} className={styles.input} placeholder="e.g., 2 cars covered" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Construction Year</label>
            <input type="number" value={formData.constructionYear} onChange={(e) => setFormData({ ...formData, constructionYear: e.target.value })} className={styles.input} />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Condition Summary</label>
            <textarea value={formData.conditionSummary} onChange={(e) => setFormData({ ...formData, conditionSummary: e.target.value })} rows={2} className={styles.textarea} />
          </div>
        </>
      )}

      {/* Vehicle Specs Section */}
      {asset.assetType === "vehicle" && (
        <>
          <div className={`${styles.sectionHeader} ${styles.fullWidth}`}>
            <h3>🚗 Vehicle Specifications</h3>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Make</label>
            <input type="text" value={formData.make} onChange={(e) => setFormData({ ...formData, make: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Model</label>
            <input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Model Year</label>
            <input type="number" value={formData.modelYear} onChange={(e) => setFormData({ ...formData, modelYear: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Color</label>
            <input type="text" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Engine Capacity (CC)</label>
            <input type="number" value={formData.engineCapacityCC} onChange={(e) => setFormData({ ...formData, engineCapacityCC: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Odometer (km)</label>
            <input type="number" value={formData.odometerKm} onChange={(e) => setFormData({ ...formData, odometerKm: e.target.value })} className={styles.input} />
          </div>

          <div className={`${styles.sectionHeader} ${styles.fullWidth}`}>
            <h3>📝 Vehicle Registration</h3>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Registration Number</label>
            <input type="text" value={formData.registrationNumber} onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Registration City</label>
            <input type="text" value={formData.registrationCity} onChange={(e) => setFormData({ ...formData, registrationCity: e.target.value })} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Token Tax Paid Till</label>
            <input type="date" value={formData.tokenTaxPaidTill} onChange={(e) => setFormData({ ...formData, tokenTaxPaidTill: e.target.value })} className={styles.input} />
          </div>
        </>
      )}

      {/* Ownership Section */}
      <div className={`${styles.sectionHeader} ${styles.fullWidth}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>👥 Ownership</h3>
          <button type="button" onClick={addOwner} style={{ padding: "0.5rem 1rem", background: "#7FC6A4", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            + Add Owner
          </button>
        </div>
      </div>

      {owners.map((owner, idx) => (
        <div key={idx} className={styles.fullWidth} style={{ padding: "1rem", background: "#f9f9f9", borderRadius: "8px", marginBottom: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <div>
              <label className={styles.label}>Owner</label>
              <select value={owner.personId} onChange={(e) => updateOwner(idx, "personId", e.target.value)} className={styles.select}>
                <option value="">Select owner...</option>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.fullName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.label}>Percentage</label>
              <input type="number" min="0" max="100" value={owner.percentage} onChange={(e) => updateOwner(idx, "percentage", e.target.value)} className={styles.input} />
            </div>
            <div>
              <label className={styles.label}>Type</label>
              <select value={owner.ownershipType} onChange={(e) => updateOwner(idx, "ownershipType", e.target.value)} className={styles.select}>
                <option value="legal_owner">Legal Owner</option>
                <option value="inherited">Inherited</option>
                <option value="joint">Joint</option>
                <option value="benami">Benami</option>
              </select>
            </div>
          </div>
          {owners.length > 1 && (
            <button type="button" onClick={() => removeOwner(idx)} style={{ marginTop: "0.5rem", padding: "0.25rem 0.75rem", background: "#ef5350", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Remove
            </button>
          )}
        </div>
      ))}

      {/* Valuation Section */}
      <div className={`${styles.sectionHeader} ${styles.fullWidth}`}>
        <h3>💵 Valuation</h3>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Market Value (PKR)</label>
        <input type="number" value={formData.estimatedMarketValue} onChange={(e) => setFormData({ ...formData, estimatedMarketValue: e.target.value })} className={styles.input} />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Valuation Date</label>
        <input type="date" value={formData.valuationDate} onChange={(e) => setFormData({ ...formData, valuationDate: e.target.value })} className={styles.input} />
      </div>

      {/* Related Contacts Section */}
      <div className={`${styles.sectionHeader} ${styles.fullWidth}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>📞 Related Contacts</h3>
          <button type="button" onClick={addContact} style={{ padding: "0.5rem 1rem", background: "#7FC6A4", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
            + Add Contact
          </button>
        </div>
      </div>

      {contacts.map((contact, idx) => (
        <div key={idx} className={styles.fullWidth} style={{ padding: "1rem", background: "#f9f9f9", borderRadius: "8px", marginBottom: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
            <div>
              <label className={styles.label}>Category</label>
              <select value={contact.category} onChange={(e) => updateContact(idx, "category", e.target.value)} className={styles.select}>
                <option value="lawyer">Lawyer</option>
                <option value="agent">Agent</option>
                <option value="caretaker">Caretaker</option>
                <option value="tenant">Tenant</option>
                <option value="property_dealer">Property Dealer</option>
                <option value="builder">Builder</option>
              </select>
            </div>
            <div>
              <label className={styles.label}>Name</label>
              <input type="text" value={contact.name} onChange={(e) => updateContact(idx, "name", e.target.value)} className={styles.input} />
            </div>
            <div>
              <label className={styles.label}>Phone</label>
              <input type="tel" value={contact.phoneNumber} onChange={(e) => updateContact(idx, "phoneNumber", e.target.value)} className={styles.input} />
            </div>
            <div>
              <label className={styles.label}>Email</label>
              <input type="email" value={contact.email} onChange={(e) => updateContact(idx, "email", e.target.value)} className={styles.input} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label className={styles.label}>Notes</label>
              <textarea value={contact.notes} onChange={(e) => updateContact(idx, "notes", e.target.value)} rows={2} className={styles.textarea} />
            </div>
          </div>
          <button type="button" onClick={() => removeContact(idx)} style={{ marginTop: "0.5rem", padding: "0.25rem 0.75rem", background: "#ef5350", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Remove Contact
          </button>
        </div>
      ))}

      {/* Tags and Notes */}
      <div className={`${styles.sectionHeader} ${styles.fullWidth}`}>
        <h3>🏷️ Tags & Notes</h3>
      </div>

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label className={styles.label}>Tags (comma separated)</label>
        <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className={styles.input} placeholder="e.g., prime_location, corner, investment" />
      </div>

      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label className={styles.label}>Internal Notes</label>
        <textarea value={formData.notesInternal} onChange={(e) => setFormData({ ...formData, notesInternal: e.target.value })} rows={3} className={styles.textarea} />
      </div>

      {/* Flags */}
      <div className={`${styles.sectionHeader} ${styles.fullWidth}`}>
        <h3>🚩 Flags</h3>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          <input type="checkbox" checked={formData.needsAttention} onChange={(e) => setFormData({ ...formData, needsAttention: e.target.checked })} />
          {' '}Needs Attention
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          <input type="checkbox" checked={formData.highValue} onChange={(e) => setFormData({ ...formData, highValue: e.target.checked })} />
          {' '}High Value
        </label>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          <input type="checkbox" checked={formData.hasLegalIssues} onChange={(e) => setFormData({ ...formData, hasLegalIssues: e.target.checked })} />
          {' '}Has Legal Issues
        </label>
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="submit"
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? "Updating..." : "💾 Update Asset"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
