import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "../.env.local") });

const AssetSchema = new mongoose.Schema({
  assetType: String,
  title: String,
  nickname: String,
  description: String,
  landUseType: String,
  houseUsageType: String,
  apartmentUsageType: String,
  vehicleType: String,
  usageType: String,
  possessionStatus: String,
  isPrimaryFamilyResidence: Boolean,
  isIncomeGenerating: Boolean,
  currentStatus: String,
  location: Object,
  dimensions: Object,
  structure: Object,
  registration: Object,
  specs: Object,
  owners: Array,
  primaryUsers: Array,
  acquisitionInfo: Object,
  mutationAndTitle: Object,
  occupancy: Object,
  rentalInfo: Object,
  valuation: Object,
  compliance: Object,
  possessionDetails: Object,
  maintenance: Object,
  controlInfo: Object,
  history: Array,
  flags: Object,
  notesInternal: String,
  tags: Array,
}, { timestamps: true });

const DocumentSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: "Asset" },
  label: String,
  fileUrl: String,
  docType: String,
  fileType: String,
  issuedBy: String,
  issueDate: Date,
  notes: String,
  isCritical: Boolean,
  uploadedBy: String,
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  passwordHash: String,
  role: String,
  relationToFamily: String,
  cnic: String,
  status: String,
}, { timestamps: true });

const Asset = mongoose.models.Asset || mongoose.model("Asset", AssetSchema);
const Document = mongoose.models.Document || mongoose.model("Document", DocumentSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seedAssets() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in .env.local");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "family_assets_db",
    });

    console.log("Connected to MongoDB");

    // Get users for ownership
    const users = await User.find();
    const saadi = users.find(u => u.email === "saadi");
    const papa = users.find(u => u.email === "papa");
    const samina = users.find(u => u.email === "samina");
    const moon = users.find(u => u.email === "moon");

    // Clear existing assets and documents
    await Asset.deleteMany({});
    await Document.deleteMany({});
    console.log("Cleared existing assets and documents");

    // ============== PLOTS ==============
    const plots = [
      {
        assetType: "land_plot",
        title: "10 Marla Residential Plot, Street 4, Shams Colony H-13 Islamabad",
        nickname: "H-13 Plot",
        description: "Empty residential plot, boundary wall on 3 sides, currently not constructed.",
        landUseType: "residential",
        possessionStatus: "in_our_possession",
        currentStatus: "clean",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          district: "Islamabad",
          areaOrSector: "H-13 Shams Colony",
          streetNumber: "4",
          plotNumber: "32",
          fullAddress: "Plot #32 Street 4, Shams Colony, H-13, Islamabad",
          nearestLandmark: "Near NUST / Kashmir Highway",
        },
        dimensions: {
          totalArea: { value: 10, unit: "marla" },
          convertedAreaSqFt: 2722,
          frontWidthFt: 30,
          depthFt: 90,
          isCornerPlot: false,
        },
        owners: [
          { personId: papa._id, percentage: 50, ownershipType: "legal owner" },
          { personId: saadi._id, percentage: 50, ownershipType: "legal owner" },
        ],
        acquisitionInfo: {
          acquiredDate: new Date("2018-06-12"),
          acquiredFrom: "Mr. XYZ s/o ABC",
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 9500000,
        },
        valuation: {
          estimatedMarketValuePKR: 15500000,
          estimatedDate: new Date("2025-10-28"),
          source: "Dealer in I-8 Markaz",
        },
        history: [
          { date: new Date("2018-06-12"), action: "acquired", details: "Purchased for 95 lac PKR", actor: "Father" },
        ],
        tags: ["plot", "residential", "h-13"],
      },
      {
        assetType: "land_plot",
        title: "5 Marla Commercial Plot, G-13 Markaz Islamabad",
        nickname: "G-13 Shop Plot",
        description: "Commercial plot in main market, perfect for shop construction.",
        landUseType: "commercial",
        possessionStatus: "in_our_possession",
        currentStatus: "clean",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          district: "Islamabad",
          areaOrSector: "G-13 Markaz",
          plotNumber: "45",
          fullAddress: "Plot #45, G-13 Markaz, Islamabad",
        },
        dimensions: {
          totalArea: { value: 5, unit: "marla" },
          convertedAreaSqFt: 1361,
          isCornerPlot: true,
        },
        owners: [
          { personId: papa._id, percentage: 100, ownershipType: "legal owner" },
        ],
        acquisitionInfo: {
          acquiredDate: new Date("2020-03-15"),
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 12000000,
        },
        valuation: {
          estimatedMarketValuePKR: 18000000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["plot", "commercial", "g-13"],
      },
      {
        assetType: "land_plot",
        title: "1 Kanal Agricultural Land, Village Sihala Islamabad",
        nickname: "Sihala Farm Land",
        description: "Agricultural land, currently used for vegetable farming.",
        landUseType: "agricultural",
        possessionStatus: "in_our_possession",
        currentStatus: "clean",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          mouzaVillage: "Sihala",
          khasraNumber: "123/4",
          fullAddress: "Khasra 123/4, Village Sihala, Islamabad",
        },
        dimensions: {
          totalArea: { value: 1, unit: "kanal" },
          convertedAreaSqFt: 5445,
        },
        owners: [
          { personId: samina._id, percentage: 100, ownershipType: "inherited" },
        ],
        acquisitionInfo: {
          acquiredDate: new Date("2015-01-20"),
          method: "inherited",
        },
        valuation: {
          estimatedMarketValuePKR: 5000000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["plot", "agricultural", "sihala"],
      },
      {
        assetType: "land_plot",
        title: "8 Marla Residential Plot, DHA Phase 2 Islamabad",
        nickname: "DHA Phase 2 Plot",
        description: "Prime location plot in DHA Phase 2, park facing.",
        landUseType: "residential",
        possessionStatus: "in_our_possession",
        currentStatus: "clean",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "DHA Phase 2",
          plotNumber: "567",
          fullAddress: "Plot 567, DHA Phase 2, Islamabad",
        },
        dimensions: {
          totalArea: { value: 8, unit: "marla" },
          convertedAreaSqFt: 2178,
          isParkFacing: true,
        },
        owners: [
          { personId: saadi._id, percentage: 60, ownershipType: "legal owner" },
          { personId: moon._id, percentage: 40, ownershipType: "legal owner" },
        ],
        acquisitionInfo: {
          acquiredDate: new Date("2022-08-10"),
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 14000000,
        },
        valuation: {
          estimatedMarketValuePKR: 17000000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["plot", "residential", "dha"],
      },
      {
        assetType: "land_plot",
        title: "15 Marla Corner Plot, I-8/3 Islamabad",
        nickname: "I-8 Corner Plot",
        description: "Corner plot, main road facing, ideal for commercial or residential.",
        landUseType: "mixed",
        possessionStatus: "in_our_possession",
        currentStatus: "clean",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "I-8/3",
          plotNumber: "89",
          fullAddress: "Plot 89, Street 12, I-8/3, Islamabad",
        },
        dimensions: {
          totalArea: { value: 15, unit: "marla" },
          convertedAreaSqFt: 4083,
          isCornerPlot: true,
          isMainRoadFacing: true,
        },
        owners: [
          { personId: papa._id, percentage: 100, ownershipType: "legal owner" },
        ],
        acquisitionInfo: {
          acquiredDate: new Date("2019-11-25"),
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 18000000,
        },
        valuation: {
          estimatedMarketValuePKR: 25000000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["plot", "corner", "i-8"],
      },
    ];

    // ============== HOUSES ==============
    const houses = [
      {
        assetType: "house",
        title: "House #32 Street 4 Shams Colony H-13 Islamabad",
        nickname: "Family House H-13",
        description: "Double-story house, 5 rooms + 2 baths. Ground floor occupied by uncle's family.",
        houseUsageType: "residential",
        possessionStatus: "in_our_possession",
        isPrimaryFamilyResidence: false,
        isIncomeGenerating: false,
        currentStatus: "clean",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          district: "Islamabad",
          areaOrSector: "H-13 Shams Colony",
          streetNumber: "4",
          houseNumber: "32",
          fullAddress: "House #32, Street 4, Shams Colony, H-13, Islamabad",
        },
        structure: {
          landArea: { value: 10, unit: "marla" },
          coveredAreaSqFt: 2200,
          floors: 2,
          rooms: 5,
          bathrooms: 2,
          kitchens: 2,
        },
        owners: [
          { personId: papa._id, percentage: 50, ownershipType: "legal owner" },
          { personId: saadi._id, percentage: 50, ownershipType: "legal owner" },
        ],
        acquisitionInfo: {
          acquiredDate: new Date("2018-06-12"),
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 9500000,
        },
        valuation: {
          estimatedMarketValuePKR: 15500000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["house", "family_use", "h-13"],
      },
      {
        assetType: "house",
        title: "5 Bedroom House, G-10/4 Islamabad",
        nickname: "G-10 Main House",
        description: "Large family house with garden, currently rented.",
        houseUsageType: "residential",
        possessionStatus: "rented_out",
        isIncomeGenerating: true,
        currentStatus: "clean",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "G-10/4",
          houseNumber: "567",
          fullAddress: "House 567, G-10/4, Islamabad",
        },
        structure: {
          landArea: { value: 12, unit: "marla" },
          coveredAreaSqFt: 2800,
          floors: 2,
          rooms: 5,
          bathrooms: 3,
        },
        owners: [
          { personId: papa._id, percentage: 100, ownershipType: "legal owner" },
        ],
        occupancy: {
          rentalStatus: "rented",
          monthlyRentPKR: 80000,
        },
        valuation: {
          estimatedMarketValuePKR: 22000000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["house", "rental_income", "g-10"],
      },
      {
        assetType: "house",
        title: "3 Bedroom Villa, Bahria Town Phase 4",
        nickname: "Bahria Villa",
        description: "Modern villa in gated community.",
        houseUsageType: "residential",
        possessionStatus: "in_our_possession",
        isPrimaryFamilyResidence: true,
        currentStatus: "clean",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "Bahria Town Phase 4",
          fullAddress: "Villa 234, Bahria Town Phase 4, Islamabad",
        },
        structure: {
          landArea: { value: 8, unit: "marla" },
          coveredAreaSqFt: 1800,
          floors: 1,
          rooms: 3,
          bathrooms: 2,
        },
        owners: [
          { personId: saadi._id, percentage: 100, ownershipType: "legal owner" },
        ],
        valuation: {
          estimatedMarketValuePKR: 18000000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["house", "primary_residence", "bahria"],
      },
      {
        assetType: "house",
        title: "Ancestral House, Village Dhudial Chakwal",
        nickname: "Dhudial House",
        description: "Old family house in village, needs renovation.",
        houseUsageType: "residential",
        possessionStatus: "in_our_possession",
        currentStatus: "clean",
        location: {
          country: "Pakistan",
          city: "Chakwal",
          mouzaVillage: "Dhudial",
          fullAddress: "Village Dhudial, Chakwal",
        },
        structure: {
          landArea: { value: 2, unit: "kanal" },
          floors: 1,
          rooms: 4,
          bathrooms: 1,
        },
        owners: [
          { personId: samina._id, percentage: 100, ownershipType: "inherited" },
        ],
        flags: {
          inheritanceSensitive: true,
        },
        tags: ["house", "ancestral", "village"],
      },
      {
        assetType: "house",
        title: "Corner House F-11/3 Islamabad",
        nickname: "F-11 Corner House",
        description: "Corner house, 3 stories, commercial ground floor.",
        houseUsageType: "mixed",
        possessionStatus: "in_our_possession",
        isIncomeGenerating: true,
        currentStatus: "clean",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "F-11/3",
          houseNumber: "123",
          fullAddress: "House 123, F-11/3, Islamabad",
        },
        structure: {
          landArea: { value: 20, unit: "marla" },
          coveredAreaSqFt: 4500,
          floors: 3,
          rooms: 8,
          bathrooms: 4,
        },
        owners: [
          { personId: papa._id, percentage: 70, ownershipType: "legal owner" },
          { personId: saadi._id, percentage: 30, ownershipType: "legal owner" },
        ],
        valuation: {
          estimatedMarketValuePKR: 35000000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["house", "commercial", "f-11"],
      },
    ];

    // ============== APARTMENTS ==============
    const apartments = [
      {
        assetType: "apartment",
        title: "Apartment #402, Block B, Centaurus Residency",
        nickname: "Centaurus Apt 402",
        description: "2-bed luxury apartment, currently rented.",
        apartmentUsageType: "rental",
        possessionStatus: "rented_out",
        isIncomeGenerating: true,
        currentStatus: "clean",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          societyOrProject: "Centaurus Residency",
          blockOrTower: "Block B",
          apartmentNumber: "402",
          floorNumber: 4,
          fullAddress: "Apartment 402, Block B, Centaurus, Islamabad",
        },
        structure: {
          bedrooms: 2,
          bathrooms: 2,
          lounges: 1,
          coveredAreaSqFt: 1200,
        },
        owners: [
          { personId: saadi._id, percentage: 100, ownershipType: "legal owner" },
        ],
        rentalInfo: {
          isRentedOut: true,
          monthlyRentPKR: 55000,
        },
        valuation: {
          estimatedMarketValuePKR: 9500000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["apartment", "rental_income", "centaurus"],
      },
      {
        assetType: "apartment",
        title: "Studio Apartment, Bahria Heights Tower 1",
        nickname: "Bahria Studio",
        description: "Small studio apartment for investment.",
        apartmentUsageType: "investment",
        possessionStatus: "in_our_possession",
        isIncomeGenerating: false,
        currentStatus: "clean",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          societyOrProject: "Bahria Heights",
          blockOrTower: "Tower 1",
          apartmentNumber: "505",
          floorNumber: 5,
        },
        structure: {
          bedrooms: 1,
          bathrooms: 1,
          coveredAreaSqFt: 550,
        },
        owners: [
          { personId: moon._id, percentage: 100, ownershipType: "legal owner" },
        ],
        valuation: {
          estimatedMarketValuePKR: 4500000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["apartment", "studio", "bahria"],
      },
      {
        assetType: "apartment",
        title: "3 Bed Apartment, Gulberg Greens Tower A",
        nickname: "Gulberg Greens",
        description: "Spacious 3-bedroom apartment.",
        apartmentUsageType: "self_use",
        possessionStatus: "in_our_possession",
        currentStatus: "clean",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          societyOrProject: "Gulberg Greens",
          blockOrTower: "Tower A",
          apartmentNumber: "801",
          floorNumber: 8,
        },
        structure: {
          bedrooms: 3,
          bathrooms: 3,
          lounges: 1,
          coveredAreaSqFt: 1800,
        },
        owners: [
          { personId: papa._id, percentage: 100, ownershipType: "legal owner" },
        ],
        valuation: {
          estimatedMarketValuePKR: 14000000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["apartment", "self_use", "gulberg"],
      },
      {
        assetType: "apartment",
        title: "2 Bed Apartment, Icon Tower F-10",
        nickname: "Icon F-10",
        description: "Modern apartment in prime location.",
        apartmentUsageType: "rental",
        possessionStatus: "rented_out",
        isIncomeGenerating: true,
        currentStatus: "clean",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "F-10",
          blockOrTower: "Icon Tower",
          apartmentNumber: "1203",
          floorNumber: 12,
        },
        structure: {
          bedrooms: 2,
          bathrooms: 2,
          coveredAreaSqFt: 1100,
        },
        owners: [
          { personId: papa._id, percentage: 50, ownershipType: "legal owner" },
          { personId: samina._id, percentage: 50, ownershipType: "legal owner" },
        ],
        rentalInfo: {
          isRentedOut: true,
          monthlyRentPKR: 60000,
        },
        valuation: {
          estimatedMarketValuePKR: 11000000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["apartment", "rental_income", "f-10"],
      },
      {
        assetType: "apartment",
        title: "Penthouse, Eighteen Heights E-11",
        nickname: "E-11 Penthouse",
        description: "Luxury penthouse with rooftop terrace.",
        apartmentUsageType: "self_use",
        possessionStatus: "in_our_possession",
        currentStatus: "clean",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "E-11",
          blockOrTower: "Eighteen Heights",
          apartmentNumber: "PH-01",
          floorNumber: 15,
        },
        structure: {
          bedrooms: 4,
          bathrooms: 4,
          lounges: 2,
          coveredAreaSqFt: 3000,
        },
        owners: [
          { personId: saadi._id, percentage: 100, ownershipType: "legal owner" },
        ],
        valuation: {
          estimatedMarketValuePKR: 28000000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["apartment", "penthouse", "luxury"],
      },
    ];

    // ============== VEHICLES ==============
    const vehicles = [
      {
        assetType: "vehicle",
        title: "White Honda Civic 2022",
        nickname: "Family Civic",
        description: "Daily use family car.",
        vehicleType: "car",
        usageType: "family_use",
        possessionStatus: "in_our_possession",
        currentStatus: "clean",
        registration: {
          registrationNumber: "ABC-123 Islamabad",
          registrationCity: "Islamabad",
          registrationDate: new Date("2022-02-10"),
          tokenTaxPaidTill: new Date("2025-12-31"),
          isRegistrationClear: true,
        },
        specs: {
          make: "Honda",
          model: "Civic",
          variant: "VTi Oriel",
          modelYear: 2022,
          fuelType: "petrol",
          color: "White",
          odometerKm: 45000,
          engineNumberOrMotorId: "ENG-HC-223344",
          chassisNumber: "CHS-HC-556677",
        },
        owners: [
          { personId: papa._id, percentage: 100, ownershipType: "legal owner" },
        ],
        primaryUsers: [
          { personName: "Saadi", relation: "son", usageNotes: "Daily commute" },
        ],
        acquisitionInfo: {
          acquiredDate: new Date("2022-02-10"),
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 5500000,
        },
        valuation: {
          estimatedMarketValuePKR: 5200000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["vehicle", "car", "family_use"],
      },
      {
        assetType: "vehicle",
        title: "Black Toyota Fortuner 2023",
        nickname: "Fortuner SUV",
        description: "Family SUV for long trips.",
        vehicleType: "car",
        usageType: "family_use",
        possessionStatus: "in_our_possession",
        currentStatus: "clean",
        registration: {
          registrationNumber: "XYZ-789 Islamabad",
          registrationCity: "Islamabad",
          registrationDate: new Date("2023-05-15"),
          tokenTaxPaidTill: new Date("2026-05-15"),
          isRegistrationClear: true,
        },
        specs: {
          make: "Toyota",
          model: "Fortuner",
          variant: "Sigma 4",
          modelYear: 2023,
          fuelType: "diesel",
          color: "Black",
          odometerKm: 22000,
        },
        owners: [
          { personId: papa._id, percentage: 100, ownershipType: "legal owner" },
        ],
        acquisitionInfo: {
          acquiredDate: new Date("2023-05-15"),
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 13500000,
        },
        valuation: {
          estimatedMarketValuePKR: 13000000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["vehicle", "suv", "family_use"],
      },
      {
        assetType: "vehicle",
        title: "Red Honda CD 70 Motorcycle",
        nickname: "Moon's Bike",
        description: "Motorcycle for local errands.",
        vehicleType: "motorcycle",
        usageType: "family_use",
        possessionStatus: "in_our_possession",
        currentStatus: "clean",
        registration: {
          registrationNumber: "ISB-1234",
          registrationCity: "Islamabad",
          registrationDate: new Date("2020-08-20"),
          isRegistrationClear: true,
        },
        specs: {
          make: "Honda",
          model: "CD 70",
          modelYear: 2020,
          fuelType: "petrol",
          color: "Red",
          odometerKm: 15000,
        },
        owners: [
          { personId: moon._id, percentage: 100, ownershipType: "legal owner" },
        ],
        acquisitionInfo: {
          acquiredDate: new Date("2020-08-20"),
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 85000,
        },
        valuation: {
          estimatedMarketValuePKR: 70000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["vehicle", "motorcycle", "local_use"],
      },
      {
        assetType: "vehicle",
        title: "Silver Suzuki Alto 2021",
        nickname: "Alto City Car",
        description: "Small city car, fuel efficient.",
        vehicleType: "car",
        usageType: "family_use",
        possessionStatus: "in_our_possession",
        currentStatus: "clean",
        registration: {
          registrationNumber: "LHE-5678 Lahore",
          registrationCity: "Lahore",
          registrationDate: new Date("2021-03-10"),
          isRegistrationClear: true,
        },
        specs: {
          make: "Suzuki",
          model: "Alto",
          variant: "VXR",
          modelYear: 2021,
          fuelType: "petrol",
          color: "Silver",
          odometerKm: 38000,
        },
        owners: [
          { personId: samina._id, percentage: 100, ownershipType: "inherited" },
        ],
        acquisitionInfo: {
          acquiredDate: new Date("2021-03-10"),
          method: "inherited",
        },
        valuation: {
          estimatedMarketValuePKR: 1800000,
          estimatedDate: new Date("2025-10-28"),
        },
        tags: ["vehicle", "car", "city_car"],
      },
      {
        assetType: "vehicle",
        title: "White Honri VE 2.0 Electric",
        nickname: "Small EV",
        description: "City EV, used for daily runs.",
        vehicleType: "car",
        usageType: "family_use",
        possessionStatus: "in_our_possession",
        currentStatus: "clean",
        registration: {
          registrationNumber: "ISB-EV-2025",
          registrationCity: "Islamabad",
          registrationDate: new Date("2025-02-10"),
          tokenTaxPaidTill: new Date("2025-12-31"),
          isRegistrationClear: true,
        },
        specs: {
          make: "Honri",
          model: "VE 2.0",
          variant: "Base",
          modelYear: 2025,
          fuelType: "electric",
          batteryCapacityKWh: 18.5,
          motorPowerKW: 30,
          color: "White",
          odometerKm: 4200,
        },
        owners: [
          { personId: papa._id, percentage: 100, ownershipType: "legal owner" },
        ],
        primaryUsers: [
          { personName: "Saadi", relation: "son", usageNotes: "Daily commute H-13 ↔ I-8" },
        ],
        acquisitionInfo: {
          acquiredDate: new Date("2025-02-10"),
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 4000000,
        },
        valuation: {
          estimatedMarketValuePKR: 3800000,
          estimatedDate: new Date("2025-10-28"),
        },
        flags: {
          dailyUseCritical: true,
        },
        tags: ["vehicle", "electric", "daily_commute"],
      },
    ];

    // Insert all assets
    const allAssets = [...plots, ...houses, ...apartments, ...vehicles];
    const insertedAssets = await Asset.insertMany(allAssets);
    console.log(`✅ Created ${insertedAssets.length} assets`);

    // ============== CREATE DOCUMENTS ==============
    const documents = [];

    // Sample document URLs (using placeholder ImgBB and Google Drive links)
    const sampleImageUrls = [
      "https://i.ibb.co/sample1/registry-deed.jpg",
      "https://i.ibb.co/sample2/tax-receipt.jpg",
      "https://i.ibb.co/sample3/site-photo.jpg",
      "https://i.ibb.co/sample4/mutation-paper.jpg",
    ];

    const samplePdfUrls = [
      "https://drive.google.com/file/d/1example/view",
      "https://drive.google.com/file/d/2example/view",
    ];

    // Add 2-3 documents per asset
    insertedAssets.forEach((asset, idx) => {
      // Registry deed for all
      documents.push({
        assetId: asset._id,
        label: `Registry Deed - ${asset.title}`,
        fileUrl: samplePdfUrls[0],
        docType: "ownership",
        fileType: "pdf",
        issuedBy: "Registrar Office",
        issueDate: asset.acquisitionInfo?.acquiredDate || new Date(),
        isCritical: true,
        uploadedBy: "Admin",
      });

      // Tax receipt
      if (asset.assetType !== "vehicle") {
        documents.push({
          assetId: asset._id,
          label: `Property Tax Receipt 2025`,
          fileUrl: sampleImageUrls[1],
          docType: "tax",
          fileType: "jpeg",
          issuedBy: "CDA / Excise",
          issueDate: new Date("2025-07-01"),
          isCritical: false,
          uploadedBy: "Admin",
        });
      }

      // Site photo for properties
      if (["land_plot", "house"].includes(asset.assetType)) {
        documents.push({
          assetId: asset._id,
          label: `Site Photo`,
          fileUrl: sampleImageUrls[2],
          docType: "photo",
          fileType: "jpg",
          notes: "Current condition photo",
          isCritical: false,
          uploadedBy: "Admin",
        });
      }
    });

    const insertedDocs = await Document.insertMany(documents);
    console.log(`✅ Created ${insertedDocs.length} documents`);

    console.log("\n📊 Summary:");
    console.log(`- ${plots.length} Plots`);
    console.log(`- ${houses.length} Houses`);
    console.log(`- ${apartments.length} Apartments`);
    console.log(`- ${vehicles.length} Vehicles`);
    console.log(`- Total: ${insertedAssets.length} assets`);
    console.log(`- Total: ${insertedDocs.length} documents`);

    console.log("\n✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding assets:", error);
    process.exit(1);
  }
}

seedAssets();
