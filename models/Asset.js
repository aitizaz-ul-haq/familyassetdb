import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema(
  {
    assetType: {
      type: String,
      enum: ["land_plot", "house", "apartment", "vehicle", "business_share", "other"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
    },
    description: {
      type: String,
    },
    
    // PLOT-SPECIFIC FIELDS
    landUseType: String,
    zoningStatus: String,
    possessionStatus: String,
    
    // HOUSE-SPECIFIC FIELDS
    houseUsageType: String,
    isPrimaryFamilyResidence: Boolean,
    isIncomeGenerating: Boolean,
    
    // APARTMENT-SPECIFIC FIELDS
    apartmentUsageType: String,
    
    // VEHICLE-SPECIFIC FIELDS
    vehicleType: String,
    usageType: String,
    
    // Common location for plots/houses
    location: {
      country: String,
      city: String,
      tehsil: String,
      district: String,
      mouzaVillage: String,
      areaOrSector: String,
      blockOrPhase: String,
      streetNumber: String,
      plotNumber: String,
      houseNumber: String,
      khasraNumber: String,
      fullAddress: String,
      geoCoordinates: {
        lat: Number,
        lng: Number,
      },
      boundaryDescription: String,
      rightOfWayAccess: String,
      nearestLandmark: String,
      // Apartment-specific location fields
      societyOrProject: String,
      blockOrTower: String,
      apartmentNumber: String,
      floorNumber: Number,
    },
    
    // Plot dimensions
    dimensions: {
      totalArea: {
        value: Number,
        unit: String,
      },
      convertedAreaSqFt: Number,
      frontWidthFt: Number,
      depthFt: Number,
      isCornerPlot: Boolean,
      isParkFacing: Boolean,
      isMainRoadFacing: Boolean,
    },
    
    // House structure
    structure: {
      landArea: {
        value: Number,
        unit: String,
      },
      coveredAreaSqFt: Number,
      floors: Number,
      rooms: Number,
      bathrooms: Number,
      kitchens: Number,
      drawingRooms: Number,
      lounges: Number,
      parkingSpots: Number,
      hasSeparatePortions: Boolean,
      portionDetails: [
        {
          name: String,
          status: String,
          rented: Boolean,
          entryIsIndependent: Boolean,
        },
      ],
      utilitiesActive: {
        electricity: Boolean,
        gas: Boolean,
        water: Boolean,
        internet: Boolean,
      },
      conditionSummary: String,
      lastRenovationDate: Date,
      lastRenovationNotes: String,
      // Apartment structure fields
      bedrooms: Number,
      balconies: Number,
      parkingSlots: [
        {
          slotNumber: String,
          coveredParking: Boolean,
          notes: String,
        },
      ],
      furnished: Boolean,
      apartmentConditionSummary: String,
    },
    
    // Vehicle registration
    registration: {
      registrationNumber: String,
      registrationCity: String,
      registrationDate: Date,
      exciseFileNumber: String,
      isRegistrationClear: Boolean,
      tokenTaxStatus: String,
      tokenTaxPaidTill: Date,
      ownershipOnBook: String,
      notes: String,
    },
    
    // Vehicle specs
    specs: {
      make: String,
      model: String,
      variant: String,
      modelYear: Number,
      fuelType: String,
      batteryCapacityKWh: Number,
      motorPowerKW: Number,
      torqueNm: Number,
      topSpeedKph: Number,
      color: String,
      seatingCapacity: Number,
      chassisNumber: String,
      engineNumberOrMotorId: String,
      odometerKm: Number,
      tyreInfo: {
        frontTyreSize: String,
        rearTyreSize: String,
        tyreConditionNotes: String,
        lastTyreChangeDate: Date,
      },
    },
    
    currentStatus: {
      type: String,
      enum: ["clean", "in_dispute", "under_transfer", "sold_but_not_cleared", "unknown"],
      default: "clean",
    },
    
    owners: [
      {
        personId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Person",
          required: true,
        },
        personName: String,
        percentage: {
          type: Number,
          required: true,
        },
        ownershipType: String,
        isAlive: Boolean,
      },
    ],
    
    // Vehicle primary users
    primaryUsers: [
      {
        personName: String,
        relation: String,
        contact: String,
        usageNotes: String,
      },
    ],
    
    acquisitionInfo: {
      acquiredDate: Date,
      acquiredFrom: String,
      method: {
        type: String,
        enum: ["purchased", "gifted", "inherited", "transferred", "settlement", "other"],
      },
      priceOrValueAtAcquisitionPKR: Number,
      paymentMode: String,
      witnesses: [String],
      notes: String,
    },
    
    mutationAndTitle: {
      registryNumber: String,
      mutationNumber: String,
      fardNumber: String,
      propertyTaxNumber: String,
      landRecordAuthority: String,
      khatooniNumber: String,
      khewatNumber: String,
      jamabandiReference: String,
      utilityConnections: {
        electricityMeterNumber: String,
        gasMeterNumber: String,
        waterConnectionRef: String,
      },
      isTitleClear: Boolean,
      notes: String,
      // Apartment specific
      allotmentLetterNumber: String,
      possessionLetterNumber: String,
      transferLetterNumber: String,
      maintenanceAccountNumber: String,
    },
    
    disputeInfo: {
      isInDispute: {
        type: Boolean,
        default: false,
      },
      type: String,
      startedDate: Date,
      details: String,
      opposingParty: String,
      lawyerName: String,
      lawyerContact: String,
      caseNumber: String,
      courtName: String,
      nextHearingDate: Date,
      riskLevel: {
        type: String,
        enum: ["none", "low", "medium", "high"],
      },
    },
    
    possessionDetails: {
      whoPhysicallyControlsLand: String,
      isSomeoneElseSitting: Boolean,
      encroachmentNotes: String,
      boundaryWallBuilt: Boolean,
      gateLocked: Boolean,
    },
    
    // House/Apartment occupancy
    occupancy: {
      occupiedBy: String,
      occupantContact: String,
      rentalStatus: String,
      monthlyRentPKR: Number,
      rentContractStart: Date,
      rentContractEnd: Date,
      rentContractScanDocId: String,
      utilityBillsPaidBy: String,
    },
    
    // Apartment rental info
    rentalInfo: {
      isRentedOut: Boolean,
      tenantName: String,
      tenantContact: String,
      monthlyRentPKR: Number,
      securityDepositPKR: Number,
      rentDueDayOfMonth: Number,
      rentContractStart: Date,
      rentContractEnd: Date,
      utilityBillsPaidBy: String,
      maintenanceFeePaidBy: String,
      latePaymentHistory: [
        {
          month: String,
          daysLate: Number,
          note: String,
        },
      ],
      rentContractScanDocId: String,
    },
    
    valuation: {
      estimatedMarketValuePKR: Number,
      estimatedDate: Date,
      source: String,
      forcedSaleValuePKR: Number,
      notes: String,
    },
    
    compliance: {
      annualPropertyTaxPKR: Number,
      propertyTaxPaidTill: Date,
      anyGovernmentNotice: Boolean,
      notices: [String],
      govtAcquisitionRisk: String,
      encroachmentRisk: String,
      plannedRoadWidening: Boolean,
      structuralRisk: String,
      societyMaintenanceOutstandingPKR: Number,
      notes: String,
      // Vehicle compliance
      isInsured: Boolean,
      insuranceCompany: String,
      policyNumber: String,
      insuranceExpiry: Date,
      coverageType: String,
      hasAccidentClaimHistory: Boolean,
      challanHistory: [
        {
          date: Date,
          authority: String,
          reason: String,
          amountPKR: Number,
          cleared: Boolean,
        },
      ],
    },
    
    // Vehicle maintenance
    maintenance: {
      lastServiceDate: Date,
      lastServiceNotes: String,
      nextServiceDueKm: Number,
      brakeCondition: String,
      batteryHealthEstimatePct: Number,
      issues: [String],
    },
    
    controlInfo: {
      whoHasPhysicalPapers: [
        {
          holderName: String,
          relation: String,
          contact: String,
          notes: String,
        },
      ],
      whereOriginalPapersAreStored: String,
      digitalCopiesStored: String,
      // House/Vehicle specific
      whoHasPhysicalKeys: [
        {
          holderName: String,
          relation: String,
          contact: String,
          notes: String,
        },
      ],
      keysHeldBy: [
        {
          holderName: String,
          relation: String,
          contact: String,
          notes: String,
        },
      ],
      whoHasKeys: [
        {
          holderName: String,
          relation: String,
          contact: String,
          notes: String,
        },
      ],
    },
    
    history: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        action: {
          type: String,
          required: true,
        },
        details: String,
        actor: String,
      },
    ],
    
    flags: {
      inheritanceSensitive: Boolean,
      familyDisputeRisk: String,
      illegalOccupationRisk: Boolean,
      noteForHeirs: String,
      incomeCriticalForFamily: Boolean,
      vacancyRiskIfTenantLeaves: String,
      dailyUseCritical: Boolean,
      transferToSonPlanned: Boolean,
    },
    
    notesInternal: String,
    tags: [String],
    documents: [{
      label: {
        type: String,
        required: true
      },
      fileUrl: {
        type: String,
        required: true
      },
      docType: {
        type: String,
        enum: ["ownership", "mutation", "tax", "map", "legal", "photo", "other"],
        default: "other"
      },
      fileType: String,
      notes: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    relatedContacts: [{
      category: {
        type: String,
        enum: ["labor", "neighbor", "dealer", "conflict_person", "other"],
        required: true
      },
      name: {
        type: String,
        required: true
      },
      phoneNumber: {
        type: String,
        required: true
      },
      notes: String,
      addedAt: {
        type: Date,
        default: Date.now
      }
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Asset || mongoose.model("Asset", AssetSchema);
