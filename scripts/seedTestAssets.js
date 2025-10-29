import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env.local") });

const AssetSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const UserSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

async function seedAssets() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected\n");

    const Asset = mongoose.models.Asset || mongoose.model("Asset", AssetSchema);
    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    console.log("👥 Fetching existing users from database...");
    const existingUsers = await User.find({});
    
    if (existingUsers.length === 0) {
      console.log("❌ No users found in database!");
      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(`✅ Found ${existingUsers.length} existing users:`);
    existingUsers.forEach((u, i) => {
      console.log(`   ${i + 1}. ${u.fullName} (${u.email}) - ${u.relationToFamily || 'N/A'}`);
    });
    console.log("");

    const owners = existingUsers;

    // LAND PLOTS (10)
    console.log("🏞️  Creating 10 Land Plots...");
    const landPlots = [
      {
        assetType: "land_plot",
        title: "1 Kanal Residential Plot I-8/3",
        nickname: "I-8 Corner Plot",
        description: "Prime corner plot in I-8/3, near main park",
        landUseType: "residential",
        isPrimaryFamilyResidence: false,
        isIncomeGenerating: false,
        location: {
          country: "Pakistan",
          province: "Islamabad Capital Territory",
          city: "Islamabad",
          district: "Islamabad",
          areaOrSector: "I-8/3",
          streetNumber: "Street 45",
          plotNumber: "432",
          fullAddress: "Plot 432, Street 45, I-8/3, Islamabad",
          nearestLandmark: "Near Iqra School",
          geoCoordinates: { lat: 33.6708, lng: 73.0651 }
        },
        currentStatus: "clean",
        dimensions: {
          totalArea: { value: 1, unit: "kanal" },
          convertedAreaSqFt: 5445,
          frontWidthFt: 50,
          depthFt: 90,
          isCornerPlot: true,
          isParkFacing: true,
          isMainRoadFacing: false
        },
        owners: [
          { personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }
        ],
        acquisitionInfo: {
          acquiredDate: new Date("2015-03-15"),
          acquiredFrom: "Capital Development Authority",
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 12000000,
          notes: "Purchased through CDA auction"
        },
        valuation: {
          estimatedMarketValuePKR: 35000000,
          estimatedDate: new Date("2024-01-01"),
          source: "Zameen.com average",
          forcedSaleValuePKR: 28000000,
          valuationNotes: "Prime location, high demand area"
        },
        mutationAndTitle: {
          registryNumber: "REG-I8-432-2015",
          registryDate: new Date("2015-04-20"),
          mutationNumber: "MUT-87654",
          mutationDate: new Date("2015-05-10"),
          fardNumber: "FARD-12345",
          khasraNumber: "432/21",
          propertyTaxNumber: "TAX-I8-432",
          isTitleClear: true,
          titleNotes: "All documents verified and clear"
        },
        compliance: {
          annualPropertyTaxPKR: 45000,
          propertyTaxPaidTill: new Date("2025-06-30"),
          encroachmentRisk: "none",
          govtAcquisitionRisk: "none"
        },
        disputeInfo: {
          isInDispute: false
        },
        relatedContacts: [
          {
            category: "property_dealer",
            name: "Asif Real Estate",
            phoneNumber: "0300-1234567",
            email: "asif@realestate.com",
            notes: "Original dealer, good contact for area info"
          }
        ],
        history: [
          { date: new Date("2015-03-15"), action: "Acquired", details: "Purchased from CDA auction", actor: owners[0].fullName },
          { date: new Date("2015-05-10"), action: "Mutation completed", details: "Transfer completed", actor: owners[0].fullName },
          { date: new Date("2024-06-30"), action: "Tax paid", details: "Annual property tax paid", actor: owners[0].fullName }
        ],
        tags: ["prime_location", "corner", "park_facing"],
        notesInternal: "Excellent investment, consider building in 2-3 years",
        flags: { needsAttention: false, highValue: true, hasLegalIssues: false }
      },
      {
        assetType: "land_plot",
        title: "10 Marla Plot DHA Phase 4",
        landUseType: "mixed",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "DHA Phase 4", plotNumber: "789" },
        currentStatus: "clean",
        dimensions: { totalArea: { value: 10, unit: "marla" }, convertedAreaSqFt: 2722 },
        owners: owners.length >= 2 ? [
          { personId: owners[0]._id, percentage: 50, ownershipType: "legal_owner" },
          { personId: owners[1]._id, percentage: 50, ownershipType: "joint" }
        ] : [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        acquisitionInfo: { acquiredDate: new Date("2018-06-10"), method: "purchased", priceOrValueAtAcquisitionPKR: 8500000 },
        valuation: { estimatedMarketValuePKR: 18000000, estimatedDate: new Date("2024-01-01") },
        tags: ["dha"],
        flags: { highValue: true }
      },
      {
        assetType: "land_plot",
        title: "5 Marla Plot Bahria Town Phase 7",
        landUseType: "residential",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "Bahria Town Phase 7", plotNumber: "234" },
        currentStatus: "clean",
        dimensions: { totalArea: { value: 5, unit: "marla" }, convertedAreaSqFt: 1361 },
        owners: owners.length >= 2 ? [{ personId: owners[1]._id, percentage: 100, ownershipType: "inherited" }] : [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["bahria"]
      },
      {
        assetType: "land_plot",
        title: "2 Kanal Agricultural Land Village Sihala",
        landUseType: "agricultural",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "Village Sihala" },
        currentStatus: "clean",
        dimensions: { totalArea: { value: 2, unit: "kanal" }, convertedAreaSqFt: 10890 },
        owners: owners.length >= 3 ? [{ personId: owners[2]._id, percentage: 100, ownershipType: "legal_owner" }] : [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["agricultural"]
      },
      {
        assetType: "land_plot",
        title: "8 Marla Plot G-13/1",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "G-13/1" },
        currentStatus: "clean",
        dimensions: { totalArea: { value: 8, unit: "marla" }, convertedAreaSqFt: 2178 },
        owners: owners.length >= 4 ? [{ personId: owners[3]._id, percentage: 100, ownershipType: "legal_owner" }] : [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["g13"]
      },
      {
        assetType: "land_plot",
        title: "15 Marla Plot E-11",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "E-11" },
        currentStatus: "clean",
        dimensions: { totalArea: { value: 15, unit: "marla" }, convertedAreaSqFt: 4083 },
        owners: [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["e11"]
      },
      {
        assetType: "land_plot",
        title: "6 Marla Plot PWD Housing Society",
        location: { country: "Pakistan", city: "Islamabad", societyOrProject: "PWD Housing Society" },
        currentStatus: "clean",
        dimensions: { totalArea: { value: 6, unit: "marla" }, convertedAreaSqFt: 1633 },
        owners: owners.length >= 2 ? [{ personId: owners[1]._id, percentage: 100, ownershipType: "legal_owner" }] : [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["pwd"]
      },
      {
        assetType: "land_plot",
        title: "12 Marla Corner Plot F-10/2",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "F-10/2" },
        currentStatus: "clean",
        dimensions: { totalArea: { value: 12, unit: "marla" }, convertedAreaSqFt: 3267, isCornerPlot: true },
        owners: owners.length >= 3 ? [{ personId: owners[2]._id, percentage: 100, ownershipType: "legal_owner" }] : [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["f10", "corner"]
      },
      {
        assetType: "land_plot",
        title: "20 Marla Plot G-11/3",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "G-11/3" },
        currentStatus: "clean",
        dimensions: { totalArea: { value: 20, unit: "marla" }, convertedAreaSqFt: 5444 },
        owners: owners.length >= 4 ? [{ personId: owners[3]._id, percentage: 100, ownershipType: "legal_owner" }] : [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        valuation: { estimatedMarketValuePKR: 25000000, estimatedDate: new Date("2024-01-01") },
        tags: ["g11", "large"],
        flags: { highValue: true }
      },
      {
        assetType: "land_plot",
        title: "3 Marla Commercial Plot Blue Area",
        landUseType: "commercial",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "Blue Area" },
        currentStatus: "clean",
        dimensions: { totalArea: { value: 3, unit: "marla" }, convertedAreaSqFt: 816 },
        owners: [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["commercial", "blue_area"]
      }
    ];

    for (const plot of landPlots) {
      await Asset.create(plot);
    }
    console.log("✅ Created 10 land plots\n");

    // HOUSES (10)
    console.log("🏠 Creating 10 Houses...");
    const houses = [
      {
        assetType: "house",
        title: "5 Bedroom House F-11/3",
        houseUsageType: "primary_residence",
        isPrimaryFamilyResidence: true,
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "F-11/3", houseNumber: "456" },
        currentStatus: "clean",
        structure: { landArea: { value: 12, unit: "marla" }, coveredAreaSqFt: 3500, floors: 2, bedrooms: 5, bathrooms: 5, kitchens: 1, servantQuarters: true, constructionYear: 2010 },
        owners: [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        valuation: { estimatedMarketValuePKR: 75000000, estimatedDate: new Date("2024-01-01") },
        tags: ["primary_residence", "family_house"],
        flags: { highValue: true }
      },
      {
        assetType: "house",
        title: "3 Bedroom House G-13/2",
        houseUsageType: "rental",
        isIncomeGenerating: true,
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "G-13/2" },
        currentStatus: "clean",
        structure: { landArea: { value: 8, unit: "marla" }, coveredAreaSqFt: 2200, floors: 2, bedrooms: 3, bathrooms: 3, constructionYear: 2015 },
        owners: [{ personId: owners[1]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["rental"]
      },
      {
        assetType: "house",
        title: "4 Bedroom House I-10/3",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "I-10/3" },
        currentStatus: "clean",
        structure: { bedrooms: 4, bathrooms: 4, floors: 2 },
        owners: [{ personId: owners[2]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["i10"]
      },
      {
        assetType: "house",
        title: "2 Bedroom House E-11/2",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "E-11/2" },
        currentStatus: "clean",
        structure: { bedrooms: 2, bathrooms: 2, floors: 1 },
        owners: [{ personId: owners[3]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["e11"]
      },
      {
        assetType: "house",
        title: "6 Bedroom House DHA Phase 2",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "DHA Phase 2" },
        currentStatus: "clean",
        structure: { bedrooms: 6, floors: 2 },
        owners: [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["dha"]
      },
      {
        assetType: "house",
        title: "3 Bedroom House Bahria Enclave",
        location: { country: "Pakistan", city: "Islamabad", societyOrProject: "Bahria Enclave" },
        currentStatus: "clean",
        structure: { bedrooms: 3 },
        owners: [{ personId: owners[1]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["bahria"]
      },
      {
        assetType: "house",
        title: "5 Bedroom House G-10/4",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "G-10/4" },
        currentStatus: "clean",
        structure: { bedrooms: 5 },
        owners: [{ personId: owners[2]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["g10"]
      },
      {
        assetType: "house",
        title: "4 Bedroom House F-10/1",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "F-10/1" },
        currentStatus: "clean",
        structure: { bedrooms: 4 },
        owners: [{ personId: owners[3]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["f10"]
      },
      {
        assetType: "house",
        title: "3 Bedroom House Gulberg Greens",
        location: { country: "Pakistan", city: "Islamabad", societyOrProject: "Gulberg Greens" },
        currentStatus: "clean",
        structure: { bedrooms: 3 },
        owners: [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["gulberg"]
      },
      {
        assetType: "house",
        title: "2 Bedroom House PWD Society",
        location: { country: "Pakistan", city: "Islamabad", societyOrProject: "PWD Housing Society" },
        currentStatus: "clean",
        structure: { bedrooms: 2 },
        owners: [{ personId: owners[1]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["pwd"]
      }
    ];

    for (const house of houses) {
      await Asset.create(house);
    }
    console.log("✅ Created 10 houses\n");

    // APARTMENTS (10)
    console.log("🏢 Creating 10 Apartments...");
    const apartments = [
      {
        assetType: "apartment",
        title: "3 Bed Apartment Centaurus Mall",
        apartmentUsageType: "primary_residence",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "F-8", societyOrProject: "Centaurus Residency", apartmentNumber: "1205", floorNumber: "12" },
        currentStatus: "clean",
        structure: { coveredAreaSqFt: 1800, bedrooms: 3, bathrooms: 3 },
        owners: [{ personId: owners[2]._id, percentage: 100, ownershipType: "legal_owner" }],
        valuation: { estimatedMarketValuePKR: 45000000, estimatedDate: new Date("2024-01-01") },
        tags: ["centaurus", "luxury"],
        flags: { highValue: true }
      },
      {
        assetType: "apartment",
        title: "2 Bed Apartment Gulberg Greens",
        location: { country: "Pakistan", city: "Islamabad", societyOrProject: "Gulberg Greens Tower A" },
        currentStatus: "clean",
        structure: { bedrooms: 2, bathrooms: 2 },
        owners: [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["gulberg"]
      },
      {
        assetType: "apartment",
        title: "Studio Apartment Eighteen Heights",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "E-11", societyOrProject: "Eighteen Heights" },
        currentStatus: "clean",
        structure: { bedrooms: 1, bathrooms: 1 },
        owners: [{ personId: owners[3]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["studio", "e11"]
      },
      {
        assetType: "apartment",
        title: "4 Bed Penthouse Icon Tower",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "F-10", societyOrProject: "Icon Tower" },
        currentStatus: "clean",
        structure: { bedrooms: 4, bathrooms: 4 },
        owners: [{ personId: owners[1]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["penthouse", "luxury"]
      },
      {
        assetType: "apartment",
        title: "2 Bed Apartment Bahria Heights",
        location: { country: "Pakistan", city: "Islamabad", societyOrProject: "Bahria Heights Tower 1" },
        currentStatus: "clean",
        structure: { bedrooms: 2 },
        owners: [{ personId: owners[2]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["bahria"]
      },
      {
        assetType: "apartment",
        title: "3 Bed Apartment Dream Gardens",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "G-13" },
        currentStatus: "clean",
        structure: { bedrooms: 3 },
        owners: [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["g13"]
      },
      {
        assetType: "apartment",
        title: "2 Bed Apartment Warda Hamna",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "DHA Phase 2" },
        currentStatus: "clean",
        structure: { bedrooms: 2 },
        owners: [{ personId: owners[1]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["dha"]
      },
      {
        assetType: "apartment",
        title: "1 Bed Apartment F-11 Markaz",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "F-11 Markaz" },
        currentStatus: "clean",
        structure: { bedrooms: 1 },
        owners: [{ personId: owners[3]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["f11"]
      },
      {
        assetType: "apartment",
        title: "3 Bed Apartment Spring North",
        location: { country: "Pakistan", city: "Islamabad", societyOrProject: "Spring North Tower B" },
        currentStatus: "clean",
        structure: { bedrooms: 3 },
        owners: [{ personId: owners[2]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["spring_north"]
      },
      {
        assetType: "apartment",
        title: "2 Bed Apartment Ivy Green",
        location: { country: "Pakistan", city: "Islamabad", areaOrSector: "E-11", societyOrProject: "Ivy Green" },
        currentStatus: "clean",
        structure: { bedrooms: 2 },
        owners: [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["ivy_green", "e11"]
      }
    ];

    for (const apt of apartments) {
      await Asset.create(apt);
    }
    console.log("✅ Created 10 apartments\n");

    // VEHICLES (10)
    console.log("🚗 Creating 10 Vehicles...");
    const vehicles = [
      {
        assetType: "vehicle",
        title: "White Honda Civic 2022",
        vehicleType: "car",
        location: { country: "Pakistan", city: "Islamabad" },
        currentStatus: "clean",
        specs: { make: "Honda", model: "Civic Oriel", modelYear: 2022, color: "Pearl White", engineCapacityCC: 1800, fuelType: "petrol", transmission: "automatic", odometerKm: 25000 },
        registration: { registrationNumber: "ISB-22-1234", registrationCity: "Islamabad", registrationDate: new Date("2022-03-15"), tokenTaxPaidTill: new Date("2025-06-30") },
        owners: [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        valuation: { estimatedMarketValuePKR: 6200000, estimatedDate: new Date("2024-01-01") },
        tags: ["family_car", "honda"]
      },
      {
        assetType: "vehicle",
        title: "Black Toyota Fortuner 2023",
        vehicleType: "car",
        location: { country: "Pakistan", city: "Islamabad" },
        currentStatus: "clean",
        specs: { make: "Toyota", model: "Fortuner Sigma 4", modelYear: 2023, color: "Black", engineCapacityCC: 2700, fuelType: "diesel", transmission: "automatic" },
        registration: { registrationNumber: "ISB-23-5678", registrationCity: "Islamabad" },
        owners: [{ personId: owners[1]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["suv", "luxury"],
        flags: { highValue: true }
      },
      {
        assetType: "vehicle",
        title: "Red Honda CD 70 Motorcycle",
        vehicleType: "motorcycle",
        location: { country: "Pakistan", city: "Islamabad" },
        currentStatus: "clean",
        specs: { make: "Honda", model: "CD 70", modelYear: 2020, color: "Red", engineCapacityCC: 70 },
        registration: { registrationNumber: "ISB-20-9012" },
        owners: [{ personId: owners[2]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["motorcycle"]
      },
      {
        assetType: "vehicle",
        title: "Silver Suzuki Alto 2021",
        vehicleType: "car",
        location: { country: "Pakistan", city: "Islamabad" },
        currentStatus: "clean",
        specs: { make: "Suzuki", model: "Alto VXR", modelYear: 2021, color: "Silver", engineCapacityCC: 660 },
        registration: { registrationNumber: "ISB-21-3456" },
        owners: [{ personId: owners[3]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["alto"]
      },
      {
        assetType: "vehicle",
        title: "White Toyota Corolla 2019",
        vehicleType: "car",
        location: { country: "Pakistan", city: "Islamabad" },
        currentStatus: "clean",
        specs: { make: "Toyota", model: "Corolla Altis Grande", modelYear: 2019, color: "White", engineCapacityCC: 1800 },
        registration: { registrationNumber: "ISB-19-7890" },
        owners: [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["corolla"]
      },
      {
        assetType: "vehicle",
        title: "Blue Honda BRV 2020",
        vehicleType: "car",
        location: { country: "Pakistan", city: "Islamabad" },
        currentStatus: "clean",
        specs: { make: "Honda", model: "BR-V", modelYear: 2020, engineCapacityCC: 1500 },
        registration: { registrationNumber: "ISB-20-2345" },
        owners: [{ personId: owners[1]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["brv"]
      },
      {
        assetType: "vehicle",
        title: "Gray Suzuki Cultus 2018",
        vehicleType: "car",
        location: { country: "Pakistan", city: "Islamabad" },
        currentStatus: "clean",
        specs: { make: "Suzuki", model: "Cultus VXL", modelYear: 2018, engineCapacityCC: 1000 },
        registration: { registrationNumber: "ISB-18-6789" },
        owners: [{ personId: owners[2]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["cultus"]
      },
      {
        assetType: "vehicle",
        title: "Black Yamaha YBR 125",
        vehicleType: "motorcycle",
        location: { country: "Pakistan", city: "Islamabad" },
        currentStatus: "clean",
        specs: { make: "Yamaha", model: "YBR 125", modelYear: 2022, engineCapacityCC: 125 },
        registration: { registrationNumber: "ISB-22-0123" },
        owners: [{ personId: owners[3]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["motorcycle", "yamaha"]
      },
      {
        assetType: "vehicle",
        title: "White Suzuki WagonR 2021",
        vehicleType: "car",
        location: { country: "Pakistan", city: "Islamabad" },
        currentStatus: "clean",
        specs: { make: "Suzuki", model: "WagonR VXL", modelYear: 2021, engineCapacityCC: 1000 },
        registration: { registrationNumber: "ISB-21-4567" },
        owners: [{ personId: owners[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["wagonr"]
      },
      {
        assetType: "vehicle",
        title: "Silver Honda Civic 2017",
        vehicleType: "car",
        location: { country: "Pakistan", city: "Islamabad" },
        currentStatus: "clean",
        specs: { make: "Honda", model: "Civic VTi Oriel", modelYear: 2017, engineCapacityCC: 1800 },
        registration: { registrationNumber: "ISB-17-8901" },
        owners: [{ personId: owners[1]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["civic", "2017"]
      }
    ];

    for (const vehicle of vehicles) {
      await Asset.create(vehicle);
    }
    console.log("✅ Created 10 vehicles\n");

    // Summary
    const totalAssets = await Asset.countDocuments();
    console.log("━".repeat(60));
    console.log("✅ SEEDING COMPLETE!");
    console.log("━".repeat(60));
    console.log(`Total assets in database: ${totalAssets}`);
    console.log("\n📊 Assets created:");
    console.log("  - 10 Land Plots");
    console.log("  - 10 Houses");
    console.log("  - 10 Apartments");
    console.log("  - 10 Vehicles");
    console.log("\n👥 Ownership distributed among:");
    owners.forEach((user, i) => {
      console.log(`  ${i + 1}. ${user.fullName} (${user.relationToFamily})`);
    });
    console.log("\n✅ You can now view these assets at /assets page");
    console.log("Click 'View Details' to see comprehensive data including:");
    console.log("  - Complete location information");
    console.log("  - Dimensions (for plots)");
    console.log("  - Structure details (for houses/apartments)");
    console.log("  - Vehicle specifications and registration");
    console.log("  - Ownership breakdown");
    console.log("  - Valuation data");
    console.log("  - Related contacts");
    console.log("  - And much more!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

seedAssets();
