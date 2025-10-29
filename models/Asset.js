import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema({
  // Basic Information
  assetType: {
    type: String,
    enum: ["land_plot", "house", "apartment", "vehicle", "business_share", "other"],
    required: true
  },
  title: { type: String, required: true },
  nickname: String,
  description: String,
  
  // Type-specific usage flags
  landUseType: {
    type: String,
    enum: ["residential", "commercial", "agricultural", "industrial", "mixed"]
  },
  houseUsageType: {
    type: String,
    enum: ["primary_residence", "rental", "guest_house", "vacant"]
  },
  apartmentUsageType: {
    type: String,
    enum: ["primary_residence", "rental", "investment", "vacant"]
  },
  vehicleType: {
    type: String,
    enum: ["car", "motorcycle", "truck", "bus", "van", "other"]
  },
  isPrimaryFamilyResidence: Boolean,
  isIncomeGenerating: Boolean,

  // Location - Complete
  location: {
    country: { type: String, default: "Pakistan" },
    province: String,
    city: String,
    district: String,
    tehsil: String,
    areaOrSector: String,
    societyOrProject: String,
    blockOrPhase: String,
    streetNumber: String,
    plotNumber: String,
    houseNumber: String,
    apartmentNumber: String,
    floorNumber: String,
    fullAddress: String,
    nearestLandmark: String,
    geoCoordinates: {
      lat: Number,
      lng: Number
    }
  },

  // Current Status
  currentStatus: {
    type: String,
    enum: ["clean", "in_dispute", "under_transfer", "sold_but_not_cleared", "unknown"],
    default: "clean"
  },

  // Dimensions (for land_plot)
  dimensions: {
    totalArea: {
      value: Number,
      unit: { type: String, enum: ["marla", "kanal", "acre", "sqft", "sqyd"] }
    },
    convertedAreaSqFt: Number,
    frontWidthFt: Number,
    depthFt: Number,
    isCornerPlot: Boolean,
    isParkFacing: Boolean,
    isMainRoadFacing: Boolean
  },

  // Structure (for house/apartment)
  structure: {
    landArea: {
      value: Number,
      unit: { type: String, enum: ["marla", "kanal", "sqft", "sqyd"] }
    },
    coveredAreaSqFt: Number,
    floors: Number,
    rooms: Number,
    bedrooms: Number,
    bathrooms: Number,
    kitchens: Number,
    drawingRooms: Number,
    tvLounges: Number,
    storeRooms: Number,
    servantQuarters: Boolean,
    garageOrParking: String,
    constructionYear: Number,
    conditionSummary: String
  },

  // Vehicle Specifications
  specs: {
    make: String,
    model: String,
    modelYear: Number,
    color: String,
    engineCapacityCC: Number,
    fuelType: { type: String, enum: ["petrol", "diesel", "cng", "electric", "hybrid"] },
    transmission: { type: String, enum: ["manual", "automatic"] },
    odometerKm: Number,
    chassisNumber: String,
    engineNumber: String
  },

  // Vehicle Registration
  registration: {
    registrationNumber: String,
    registrationCity: String,
    registrationDate: Date,
    tokenTaxPaidTill: Date,
    insuranceValidTill: Date,
    fitnessValidTill: Date
  },

  // Ownership
  owners: [{
    personId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: true
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    ownershipType: {
      type: String,
      enum: ["legal_owner", "inherited", "benami", "joint", "other"],
      default: "legal_owner"
    }
  }],

  // Acquisition Info
  acquisitionInfo: {
    acquiredDate: Date,
    acquiredFrom: String,
    method: {
      type: String,
      enum: ["purchased", "gifted", "inherited", "transferred", "settlement", "other"]
    },
    priceOrValueAtAcquisitionPKR: Number,
    notes: String
  },

  // Valuation
  valuation: {
    estimatedMarketValuePKR: Number,
    estimatedDate: Date,
    source: String,
    forcedSaleValuePKR: Number,
    valuationNotes: String
  },

  // Mutation & Title
  mutationAndTitle: {
    registryNumber: String,
    registryDate: Date,
    mutationNumber: String,
    mutationDate: Date,
    fardNumber: String,
    khasraNumber: String,
    propertyTaxNumber: String,
    isTitleClear: Boolean,
    titleNotes: String
  },

  // Compliance
  compliance: {
    annualPropertyTaxPKR: Number,
    propertyTaxPaidTill: Date,
    electricityBillNumber: String,
    gasBillNumber: String,
    waterBillNumber: String,
    encroachmentRisk: { type: String, enum: ["none", "low", "medium", "high"] },
    govtAcquisitionRisk: { type: String, enum: ["none", "low", "medium", "high"] }
  },

  // Dispute Information
  disputeInfo: {
    isInDispute: { type: Boolean, default: false },
    type: String,
    startedDate: Date,
    details: String,
    lawyerName: String,
    lawyerPhone: String,
    caseNumber: String,
    courtName: String,
    nextHearingDate: Date
  },

  // Related Contacts
  relatedContacts: [{
    category: {
      type: String,
      enum: [
        "lawyer",
        "agent",
        "caretaker",
        "tenant",
        "property_dealer",
        "builder",
        "conflict_person",
        "government_official",
        "other"
      ],
      required: true
    },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: String,
    cnic: String,
    address: String,
    notes: String,
    addedAt: { type: Date, default: Date.now }
  }],

  // Documents
  documents: [{
    label: { type: String, required: true },
    fileUrl: { type: String, required: true },
    docType: {
      type: String,
      enum: ["ownership", "mutation", "tax", "map", "legal", "photo", "other"]
    },
    fileType: String,
    notes: String,
    uploadedAt: { type: Date, default: Date.now }
  }],

  // History Timeline
  history: [{
    date: { type: Date, default: Date.now },
    action: { type: String, required: true },
    details: String,
    actor: String
  }],

  // Tags
  tags: [String],

  // Internal Notes
  notesInternal: String,

  // Flags
  flags: {
    needsAttention: Boolean,
    highValue: Boolean,
    hasLegalIssues: Boolean
  }

}, { timestamps: true });

const Asset = mongoose.models.Asset || mongoose.model("Asset", AssetSchema);

export default Asset;
