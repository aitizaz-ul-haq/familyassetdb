import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env.local") });

const AssetSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const UserSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

async function seedCompleteAssets() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Asset = mongoose.models.Asset || mongoose.model("Asset", AssetSchema);
    const User = mongoose.models.User || mongoose.model("User", UserSchema);
    const users = await User.find({});
    
    if (users.length === 0) {
      await mongoose.disconnect();
      process.exit(1);
    }

    // LAND PLOTS (5 complete)
    const landPlots = [
      {
        assetType: "land_plot",
        title: "1 Kanal Prime Plot I-8/3",
        nickname: "I-8 Corner Premium",
        description: "Premium corner plot in I-8/3, near main park and mosque. Excellent location for construction.",
        landUseType: "residential",
        isPrimaryFamilyResidence: false,
        isIncomeGenerating: false,
        location: {
          country: "Pakistan",
          province: "Islamabad Capital Territory",
          city: "Islamabad",
          district: "Islamabad",
          tehsil: "Islamabad",
          areaOrSector: "I-8/3",
          societyOrProject: "CDA Sector",
          blockOrPhase: "Block A",
          streetNumber: "Street 45",
          plotNumber: "432",
          fullAddress: "Plot 432, Street 45, Block A, I-8/3, Islamabad",
          nearestLandmark: "Near Iqra School and Main Park",
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
        owners: [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        acquisitionInfo: {
          acquiredDate: new Date("2015-03-15"),
          acquiredFrom: "Capital Development Authority",
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 12000000,
          notes: "Purchased through CDA auction. Excellent deal at the time."
        },
        valuation: {
          estimatedMarketValuePKR: 35000000,
          estimatedDate: new Date("2024-01-01"),
          source: "Zameen.com and local dealer average",
          forcedSaleValuePKR: 28000000,
          valuationNotes: "Prime location, high demand area. Value increasing yearly."
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
          titleNotes: "All documents verified and clear. No encumbrances."
        },
        compliance: {
          annualPropertyTaxPKR: 45000,
          propertyTaxPaidTill: new Date("2025-06-30"),
          electricityBillNumber: "N/A",
          gasBillNumber: "N/A",
          waterBillNumber: "N/A",
          encroachmentRisk: "none",
          govtAcquisitionRisk: "none"
        },
        disputeInfo: { isInDispute: false },
        relatedContacts: [
          {
            category: "property_dealer",
            name: "Asif Real Estate Services",
            phoneNumber: "0300-1234567",
            email: "asif@realestate.com",
            cnic: "61101-1234567-1",
            address: "Shop 5, I-8 Markaz, Islamabad",
            notes: "Original dealer, very reliable. Good contact for market rates.",
            addedAt: new Date("2015-03-01")
          },
          {
            category: "lawyer",
            name: "Advocate Shahid Mahmood",
            phoneNumber: "0321-9876543",
            email: "shahid.law@gmail.com",
            notes: "Handled registry and mutation. Excellent service.",
            addedAt: new Date("2015-04-01")
          }
        ],
        documents: [], // REMOVED - Add documents manually via UI
        history: [
          { date: new Date("2015-03-15"), action: "Acquired", details: "Purchased from CDA auction", actor: users[0].fullName },
          { date: new Date("2015-04-20"), action: "Registry completed", details: "Registry done at Sub-Registrar Office", actor: users[0].fullName },
          { date: new Date("2015-05-10"), action: "Mutation completed", details: "Transfer completed in CDA records", actor: users[0].fullName },
          { date: new Date("2024-06-30"), action: "Tax paid", details: "Annual property tax paid for FY 2024-25", actor: users[0].fullName },
          { date: new Date("2024-01-15"), action: "Valuation done", details: "Property valuation assessment by expert", actor: users[0].fullName }
        ],
        tags: ["prime_location", "corner", "park_facing", "investment", "i8"],
        notesInternal: "Excellent investment property. Consider building a house in next 2-3 years. Value appreciating steadily. Keep for long term.",
        flags: { needsAttention: false, highValue: true, hasLegalIssues: false }
      },
      {
        assetType: "land_plot",
        title: "10 Marla Commercial Plot DHA Phase 4",
        nickname: "DHA Main Boulevard",
        description: "10 marla plot on main boulevard DHA Phase 4. Ideal for commercial plaza.",
        landUseType: "commercial",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "DHA Phase 4",
          societyOrProject: "Defence Housing Authority",
          blockOrPhase: "Phase 4",
          streetNumber: "Main Boulevard",
          plotNumber: "789",
          fullAddress: "Plot 789, Main Boulevard, DHA Phase 4, Islamabad",
          geoCoordinates: { lat: 33.5651, lng: 73.0169 }
        },
        currentStatus: "clean",
        dimensions: {
          totalArea: { value: 10, unit: "marla" },
          convertedAreaSqFt: 2722,
          frontWidthFt: 35,
          depthFt: 70,
          isMainRoadFacing: true
        },
        owners: users.length >= 2 ? [
          { personId: users[0]._id, percentage: 50, ownershipType: "legal_owner" },
          { personId: users[1]._id, percentage: 50, ownershipType: "joint" }
        ] : [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        acquisitionInfo: {
          acquiredDate: new Date("2018-06-10"),
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 8500000,
          notes: "Purchased for commercial development"
        },
        valuation: {
          estimatedMarketValuePKR: 22000000,
          estimatedDate: new Date("2024-01-01"),
          source: "DHA rates and market survey"
        },
        mutationAndTitle: {
          registryNumber: "REG-DHA-789-2018",
          isTitleClear: true
        },
        compliance: {
          annualPropertyTaxPKR: 60000,
          propertyTaxPaidTill: new Date("2025-06-30"),
          encroachmentRisk: "low",
          govtAcquisitionRisk: "none"
        },
        relatedContacts: [
          {
            category: "property_dealer",
            name: "DHA Estate Consultants",
            phoneNumber: "0333-7654321",
            email: "info@dhaestate.com",
            notes: "Specializes in DHA properties"
          }
        ],
        history: [
          { date: new Date("2018-06-10"), action: "Acquired", details: "Purchased for commercial use" },
          { date: new Date("2024-06-30"), action: "Tax paid", details: "Annual tax paid" }
        ],
        tags: ["commercial", "dha", "main_boulevard", "high_value"],
        notesInternal: "Good commercial potential. Consider building plaza.",
        flags: { highValue: true }
      },
      {
        assetType: "land_plot",
        title: "5 Marla Residential Plot Bahria Town Phase 7",
        landUseType: "residential",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "Bahria Town Phase 7",
          societyOrProject: "Bahria Town",
          plotNumber: "234"
        },
        currentStatus: "clean",
        dimensions: {
          totalArea: { value: 5, unit: "marla" },
          convertedAreaSqFt: 1361
        },
        owners: users.length >= 2 ? [{ personId: users[1]._id, percentage: 100, ownershipType: "inherited" }] : [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        acquisitionInfo: {
          method: "inherited",
          acquiredDate: new Date("2020-01-15"),
          notes: "Inherited from grandfather"
        },
        valuation: {
          estimatedMarketValuePKR: 4500000,
          estimatedDate: new Date("2024-01-01")
        },
        relatedContacts: [],
        history: [
          { date: new Date("2020-01-15"), action: "Inherited", details: "Received through inheritance" }
        ],
        tags: ["bahria", "inherited", "residential"],
        flags: {}
      },
      {
        assetType: "land_plot",
        title: "2 Kanal Agricultural Land Village Sihala",
        landUseType: "agricultural",
        location: {
          country: "Pakistan",
          province: "Punjab",
          city: "Islamabad",
          district: "Islamabad",
          areaOrSector: "Village Sihala",
          fullAddress: "Khasra 123, Village Sihala, Islamabad"
        },
        currentStatus: "clean",
        dimensions: {
          totalArea: { value: 2, unit: "kanal" },
          convertedAreaSqFt: 10890
        },
        owners: users.length >= 3 ? [{ personId: users[2]._id, percentage: 100, ownershipType: "legal_owner" }] : [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        acquisitionInfo: {
          method: "purchased",
          acquiredDate: new Date("2010-08-20"),
          priceOrValueAtAcquisitionPKR: 2000000
        },
        valuation: {
          estimatedMarketValuePKR: 9000000,
          estimatedDate: new Date("2024-01-01")
        },
        mutationAndTitle: {
          khasraNumber: "123/45",
          fardNumber: "FARD-456",
          isTitleClear: true
        },
        compliance: {
          annualPropertyTaxPKR: 15000,
          propertyTaxPaidTill: new Date("2025-06-30")
        },
        tags: ["agricultural", "village", "ancestral"],
        history: [
          { date: new Date("2010-08-20"), action: "Purchased", details: "Bought from local farmer" }
        ],
        flags: {}
      },
      {
        assetType: "land_plot",
        title: "15 Marla Corner Plot E-11/2",
        landUseType: "residential",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "E-11/2",
          plotNumber: "890"
        },
        currentStatus: "clean",
        dimensions: {
          totalArea: { value: 15, unit: "marla" },
          convertedAreaSqFt: 4083,
          isCornerPlot: true
        },
        owners: users.length >= 4 ? [{ personId: users[3]._id, percentage: 100, ownershipType: "legal_owner" }] : [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        valuation: {
          estimatedMarketValuePKR: 28000000,
          estimatedDate: new Date("2024-01-01")
        },
        tags: ["e11", "corner", "large_plot"],
        history: [],
        flags: { highValue: true }
      }
    ];

    for (const plot of landPlots) {
      await Asset.create(plot);
    }

    // HOUSES (5 complete)
    const houses = [
      {
        assetType: "house",
        title: "5 Bedroom Luxury House F-11/3",
        nickname: "Family Mansion F-11",
        description: "Spacious 5 bedroom double-story house with modern amenities, garden, and basement",
        houseUsageType: "primary_residence",
        isPrimaryFamilyResidence: true,
        isIncomeGenerating: false,
        location: {
          country: "Pakistan",
          province: "Islamabad Capital Territory",
          city: "Islamabad",
          areaOrSector: "F-11/3",
          streetNumber: "Street 12",
          houseNumber: "456",
          fullAddress: "House 456, Street 12, F-11/3, Islamabad",
          nearestLandmark: "Near Jamia Mosque F-11",
          geoCoordinates: { lat: 33.7000, lng: 73.0500 }
        },
        currentStatus: "clean",
        structure: {
          landArea: { value: 12, unit: "marla" },
          coveredAreaSqFt: 3500,
          floors: 2,
          rooms: 8,
          bedrooms: 5,
          bathrooms: 5,
          kitchens: 1,
          drawingRooms: 2,
          tvLounges: 1,
          storeRooms: 2,
          servantQuarters: true,
          garageOrParking: "2 cars covered parking + 2 open",
          constructionYear: 2010,
          conditionSummary: "Excellent. Recently renovated kitchen and bathrooms in 2023."
        },
        owners: users.length >= 2 ? [
          { personId: users[0]._id, percentage: 50, ownershipType: "legal_owner" },
          { personId: users[1]._id, percentage: 50, ownershipType: "joint" }
        ] : [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        acquisitionInfo: {
          acquiredDate: new Date("2010-05-20"),
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 18000000,
          acquiredFrom: "Previous owner - Mr. Ahmed",
          notes: "Purchased land and built custom house. Construction completed in Dec 2010."
        },
        valuation: {
          estimatedMarketValuePKR: 85000000,
          estimatedDate: new Date("2024-01-01"),
          source: "Professional valuer Zameen Certified",
          forcedSaleValuePKR: 68000000,
          valuationNotes: "Prime F-11 location, excellent condition"
        },
        mutationAndTitle: {
          registryNumber: "REG-F11-456-2010",
          registryDate: new Date("2010-06-15"),
          mutationNumber: "MUT-F11-456",
          mutationDate: new Date("2010-07-01"),
          propertyTaxNumber: "TAX-F11-456",
          isTitleClear: true,
          titleNotes: "Clean title, all documents verified"
        },
        compliance: {
          annualPropertyTaxPKR: 120000,
          propertyTaxPaidTill: new Date("2025-06-30"),
          electricityBillNumber: "IESCO-F11-456",
          gasBillNumber: "SNGPL-F11-456",
          waterBillNumber: "CDA-F11-456",
          encroachmentRisk: "none",
          govtAcquisitionRisk: "none"
        },
        relatedContacts: [
          {
            category: "caretaker",
            name: "Muhammad Saleem",
            phoneNumber: "0333-1234567",
            notes: "Caretaker for 12 years. Very reliable and trustworthy.",
            addedAt: new Date("2010-12-01")
          },
          {
            category: "builder",
            name: "Tariq Construction Co.",
            phoneNumber: "0300-9876543",
            email: "tariq.construction@gmail.com",
            notes: "Built the house in 2010. Available for any renovation work."
          }
        ],
        history: [
          { date: new Date("2010-05-20"), action: "Land purchased", details: "12 marla plot purchased" },
          { date: new Date("2010-06-01"), action: "Construction started", details: "Foundation work began" },
          { date: new Date("2010-12-15"), action: "Construction completed", details: "House ready for occupation" },
          { date: new Date("2023-03-01"), action: "Renovation", details: "Kitchen and bathrooms renovated with modern fittings" },
          { date: new Date("2024-06-30"), action: "Tax paid", details: "Annual property tax paid" }
        ],
        tags: ["primary_residence", "f11", "family_house", "spacious", "renovated"],
        notesInternal: "This is our main family home. Excellent condition. All utilities working perfectly.",
        flags: { highValue: true }
      },
      {
        assetType: "house",
        title: "3 Bedroom Rental House G-13/2",
        houseUsageType: "rental",
        isIncomeGenerating: true,
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "G-13/2",
          houseNumber: "789"
        },
        currentStatus: "clean",
        structure: {
          landArea: { value: 8, unit: "marla" },
          coveredAreaSqFt: 2200,
          floors: 2,
          bedrooms: 3,
          bathrooms: 3,
          kitchens: 1,
          constructionYear: 2015
        },
        owners: [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        valuation: {
          estimatedMarketValuePKR: 32000000,
          estimatedDate: new Date("2024-01-01")
        },
        compliance: {
          annualPropertyTaxPKR: 50000,
          propertyTaxPaidTill: new Date("2025-06-30")
        },
        relatedContacts: [
          {
            category: "tenant",
            name: "Ali Raza",
            phoneNumber: "0345-9876543",
            notes: "Current tenant since Jan 2023. Rent: 80,000/month. Very responsible."
          }
        ],
        history: [
          { date: new Date("2015-08-20"), action: "Constructed", details: "House built" },
          { date: new Date("2023-01-01"), action: "Rented out", details: "Leased to Ali Raza" }
        ],
        tags: ["rental", "income_generating", "g13"],
        notesInternal: "Good rental income. Tenant very cooperative.",
        flags: {}
      },
      {
        assetType: "house",
        title: "4 Bedroom House I-10/3",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "I-10/3",
          houseNumber: "234"
        },
        currentStatus: "clean",
        structure: {
          landArea: { value: 10, unit: "marla" },
          bedrooms: 4,
          bathrooms: 4,
          floors: 2,
          constructionYear: 2012
        },
        owners: users.length >= 3 ? [{ personId: users[2]._id, percentage: 100, ownershipType: "inherited" }] : [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["i10", "inherited"],
        history: [],
        flags: {}
      },
      {
        assetType: "house",
        title: "6 Bedroom Mansion DHA Phase 2",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "DHA Phase 2",
          houseNumber: "890"
        },
        currentStatus: "clean",
        structure: {
          landArea: { value: 1, unit: "kanal" },
          coveredAreaSqFt: 4500,
          floors: 2,
          bedrooms: 6,
          bathrooms: 6,
          servantQuarters: true,
          constructionYear: 2008
        },
        owners: users.length >= 2 ? [{ personId: users[1]._id, percentage: 100, ownershipType: "legal_owner" }] : [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        valuation: {
          estimatedMarketValuePKR: 110000000,
          estimatedDate: new Date("2024-01-01")
        },
        tags: ["dha", "mansion", "luxury"],
        flags: { highValue: true }
      },
      {
        assetType: "house",
        title: "2 Bedroom Guest House E-11/2",
        houseUsageType: "guest_house",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "E-11/2",
          houseNumber: "567"
        },
        currentStatus: "clean",
        structure: {
          landArea: { value: 5, unit: "marla" },
          bedrooms: 2,
          bathrooms: 2,
          floors: 1
        },
        owners: users.length >= 4 ? [{ personId: users[3]._id, percentage: 100, ownershipType: "legal_owner" }] : [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["guest_house", "e11"],
        history: [],
        flags: {}
      }
    ];

    for (const house of houses) {
      await Asset.create(house);
    }

    // APARTMENTS (5 complete)
    const apartments = [
      {
        assetType: "apartment",
        title: "3 Bed Luxury Apartment Centaurus Residency",
        nickname: "Centaurus Premium",
        description: "Luxury 3 bedroom apartment with mall and cinema access, rooftop facilities",
        apartmentUsageType: "primary_residence",
        isPrimaryFamilyResidence: false,
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "F-8",
          societyOrProject: "Centaurus Mall Residency",
          apartmentNumber: "1205",
          floorNumber: "12",
          fullAddress: "Apartment 1205, 12th Floor, Centaurus Residency, F-8, Islamabad"
        },
        currentStatus: "clean",
        structure: {
          coveredAreaSqFt: 1800,
          floors: 1,
          bedrooms: 3,
          bathrooms: 3,
          kitchens: 1,
          drawingRooms: 1,
          tvLounges: 1,
          storeRooms: 1,
          garageOrParking: "2 covered parking spaces",
          constructionYear: 2013,
          conditionSummary: "Excellent, modern amenities, gym and pool access"
        },
        owners: users.length >= 3 ? [{ personId: users[2]._id, percentage: 100, ownershipType: "legal_owner" }] : [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        acquisitionInfo: {
          acquiredDate: new Date("2014-01-15"),
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 22000000,
          notes: "Purchased directly from developer"
        },
        valuation: {
          estimatedMarketValuePKR: 52000000,
          estimatedDate: new Date("2024-01-01"),
          source: "Zameen.com Centaurus rates",
          forcedSaleValuePKR: 45000000,
          valuationNotes: "Premium location, high demand"
        },
        mutationAndTitle: {
          registryNumber: "REG-CENT-1205-2014",
          isTitleClear: true
        },
        compliance: {
          annualPropertyTaxPKR: 95000,
          propertyTaxPaidTill: new Date("2025-06-30"),
          electricityBillNumber: "IESCO-CENT-1205",
          gasBillNumber: "SNGPL-CENT-1205"
        },
        relatedContacts: [
          {
            category: "property_dealer",
            name: "Centaurus Sales Office",
            phoneNumber: "051-2345678",
            email: "sales@centaurus.com.pk",
            notes: "Original developer contact"
          }
        ],
        history: [
          { date: new Date("2014-01-15"), action: "Purchased", details: "Bought from developer" },
          { date: new Date("2024-06-30"), action: "Tax paid", details: "Annual maintenance paid" }
        ],
        tags: ["centaurus", "luxury", "mall_access", "premium"],
        notesInternal: "Excellent apartment with all facilities. Good investment.",
        flags: { highValue: true }
      },
      {
        assetType: "apartment",
        title: "2 Bed Apartment Gulberg Greens Tower A",
        apartmentUsageType: "rental",
        isIncomeGenerating: true,
        location: {
          country: "Pakistan",
          city: "Islamabad",
          societyOrProject: "Gulberg Greens Tower A",
          apartmentNumber: "506",
          floorNumber: "5"
        },
        currentStatus: "clean",
        structure: {
          coveredAreaSqFt: 1200,
          bedrooms: 2,
          bathrooms: 2,
          constructionYear: 2018
        },
        owners: [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        valuation: {
          estimatedMarketValuePKR: 18000000,
          estimatedDate: new Date("2024-01-01")
        },
        relatedContacts: [
          {
            category: "tenant",
            name: "Hassan Malik",
            phoneNumber: "0300-7654321",
            notes: "Tenant since 2022, rent: 55,000/month"
          }
        ],
        history: [
          { date: new Date("2022-01-01"), action: "Rented", details: "Leased to Hassan Malik" }
        ],
        tags: ["gulberg", "rental", "tower"],
        flags: {}
      },
      {
        assetType: "apartment",
        title: "1 Bed Studio Eighteen Heights E-11",
        apartmentUsageType: "investment",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "E-11",
          societyOrProject: "Eighteen Heights",
          apartmentNumber: "803",
          floorNumber: "8"
        },
        currentStatus: "clean",
        structure: {
          coveredAreaSqFt: 750,
          bedrooms: 1,
          bathrooms: 1,
          constructionYear: 2019
        },
        owners: users.length >= 2 ? [{ personId: users[1]._id, percentage: 100, ownershipType: "legal_owner" }] : [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["studio", "investment", "e11"],
        history: [],
        flags: {}
      },
      {
        assetType: "apartment",
        title: "4 Bed Penthouse Icon Tower F-10",
        apartmentUsageType: "primary_residence",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          areaOrSector: "F-10",
          societyOrProject: "Icon Tower",
          apartmentNumber: "PH-01",
          floorNumber: "20"
        },
        currentStatus: "clean",
        structure: {
          coveredAreaSqFt: 3000,
          bedrooms: 4,
          bathrooms: 4,
          servantQuarters: true,
          constructionYear: 2017
        },
        owners: users.length >= 4 ? [{ personId: users[3]._id, percentage: 100, ownershipType: "legal_owner" }] : [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        valuation: {
          estimatedMarketValuePKR: 72000000,
          estimatedDate: new Date("2024-01-01")
        },
        tags: ["penthouse", "luxury", "f10"],
        flags: { highValue: true }
      },
      {
        assetType: "apartment",
        title: "2 Bed Apartment Bahria Heights Tower 1",
        apartmentUsageType: "vacant",
        location: {
          country: "Pakistan",
          city: "Islamabad",
          societyOrProject: "Bahria Heights Tower 1",
          apartmentNumber: "604",
          floorNumber: "6"
        },
        currentStatus: "clean",
        structure: {
          coveredAreaSqFt: 1100,
          bedrooms: 2,
          bathrooms: 2,
          constructionYear: 2020
        },
        owners: [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["bahria", "vacant"],
        history: [],
        flags: {}
      }
    ];

    for (const apt of apartments) {
      await Asset.create(apt);
    }

    // VEHICLES (5 complete)
    const vehicles = [
      {
        assetType: "vehicle",
        title: "White Honda Civic 2022 Oriel",
        nickname: "Family Civic",
        description: "Daily use family sedan, excellent condition, automatic transmission",
        vehicleType: "car",
        location: { country: "Pakistan", city: "Islamabad" },
        currentStatus: "clean",
        specs: {
          make: "Honda",
          model: "Civic Oriel",
          modelYear: 2022,
          color: "Pearl White",
          engineCapacityCC: 1800,
          fuelType: "petrol",
          transmission: "automatic",
          odometerKm: 28000,
          chassisNumber: "MRHFC862MKJ123456",
          engineNumber: "R18A1-1234567"
        },
        registration: {
          registrationNumber: "ISB-22-1234",
          registrationCity: "Islamabad",
          registrationDate: new Date("2022-03-15"),
          tokenTaxPaidTill: new Date("2025-06-30"),
          insuranceValidTill: new Date("2025-03-15"),
          fitnessValidTill: new Date("2027-03-15")
        },
        owners: [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        acquisitionInfo: {
          acquiredDate: new Date("2022-03-15"),
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 5500000,
          acquiredFrom: "Honda Atlas Cars Pakistan - Islamabad Showroom",
          notes: "Brand new from showroom. First owner."
        },
        valuation: {
          estimatedMarketValuePKR: 6500000,
          estimatedDate: new Date("2024-01-01"),
          source: "PakWheels market average",
          forcedSaleValuePKR: 6100000,
          valuationNotes: "Excellent condition, low mileage, good resale value"
        },
        compliance: {
          encroachmentRisk: "none",
          govtAcquisitionRisk: "none"
        },
        relatedContacts: [
          {
            category: "agent",
            name: "Ali Motors Workshop",
            phoneNumber: "0333-9876543",
            address: "G-11 Markaz, Islamabad",
            notes: "Regular servicing every 5000 km. Very reliable mechanic.",
            addedAt: new Date("2022-04-01")
          }
        ],
        history: [
          { date: new Date("2022-03-15"), action: "Purchased", details: "Brand new from Honda showroom", actor: users[0].fullName },
          { date: new Date("2022-06-15"), action: "First service", details: "1000 km free service" },
          { date: new Date("2023-03-15"), action: "Insurance renewed", details: "Comprehensive insurance" },
          { date: new Date("2024-03-15"), action: "Token tax paid", details: "Paid for year 2024-25" }
        ],
        tags: ["family_car", "daily_use", "honda", "automatic"],
        notesInternal: "Excellent condition. Regular maintenance. No accidents.",
        flags: { needsAttention: false }
      },
      {
        assetType: "vehicle",
        title: "Black Toyota Fortuner 2023 Sigma 4",
        vehicleType: "car",
        location: { country: "Pakistan", city: "Islamabad" },
        currentStatus: "clean",
        specs: {
          make: "Toyota",
          model: "Fortuner Sigma 4",
          modelYear: 2023,
          color: "Attitude Black",
          engineCapacityCC: 2700,
          fuelType: "diesel",
          transmission: "automatic",
          odometerKm: 15000
        },
        registration: {
          registrationNumber: "ISB-23-5678",
          registrationCity: "Islamabad",
          registrationDate: new Date("2023-01-10"),
          tokenTaxPaidTill: new Date("2025-06-30")
        },
        owners: users.length >= 2 ? [{ personId: users[1]._id, percentage: 100, ownershipType: "legal_owner" }] : [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        acquisitionInfo: {
          method: "purchased",
          priceOrValueAtAcquisitionPKR: 14500000
        },
        valuation: {
          estimatedMarketValuePKR: 15800000,
          estimatedDate: new Date("2024-01-01")
        },
        history: [
          { date: new Date("2023-01-10"), action: "Purchased", details: "New from Toyota showroom" }
        ],
        tags: ["suv", "luxury", "toyota"],
        flags: { highValue: true }
      },
      {
        assetType: "vehicle",
        title: "Red Honda CD 70 Motorcycle 2020",
        vehicleType: "motorcycle",
        location: { country: "Pakistan", city: "Islamabad" },
        currentStatus: "clean",
        specs: {
          make: "Honda",
          model: "CD 70",
          modelYear: 2020,
          color: "Red",
          engineCapacityCC: 70,
          fuelType: "petrol",
          transmission: "manual",
          odometerKm: 38000
        },
        registration: {
          registrationNumber: "ISB-20-9012",
          registrationCity: "Islamabad",
          tokenTaxPaidTill: new Date("2025-06-30")
        },
        owners: users.length >= 3 ? [{ personId: users[2]._id, percentage: 100, ownershipType: "legal_owner" }] : [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["motorcycle", "cd70", "daily_commute"],
        history: [],
        flags: {}
      },
      {
        assetType: "vehicle",
        title: "Silver Suzuki Alto 2021 VXR",
        vehicleType: "car",
        location: { country: "Pakistan", city: "Islamabad" },
        currentStatus: "clean",
        specs: {
          make: "Suzuki",
          model: "Alto VXR",
          modelYear: 2021,
          color: "Silky Silver",
          engineCapacityCC: 660,
          fuelType: "petrol",
          transmission: "manual",
          odometerKm: 42000
        },
        registration: {
          registrationNumber: "ISB-21-3456",
          registrationCity: "Islamabad",
          tokenTaxPaidTill: new Date("2025-06-30")
        },
        owners: users.length >= 4 ? [{ personId: users[3]._id, percentage: 100, ownershipType: "legal_owner" }] : [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        tags: ["alto", "economy", "fuel_efficient"],
        history: [],
        flags: {}
      },
      {
        assetType: "vehicle",
        title: "White Toyota Corolla 2019 Altis Grande",
        vehicleType: "car",
        location: { country: "Pakistan", city: "Islamabad" },
        currentStatus: "clean",
        specs: {
          make: "Toyota",
          model: "Corolla Altis Grande",
          modelYear: 2019,
          color: "White",
          engineCapacityCC: 1800,
          fuelType: "petrol",
          transmission: "automatic",
          odometerKm: 65000
        },
        registration: {
          registrationNumber: "ISB-19-7890",
          registrationCity: "Islamabad",
          tokenTaxPaidTill: new Date("2025-06-30")
        },
        owners: [{ personId: users[0]._id, percentage: 100, ownershipType: "legal_owner" }],
        valuation: {
          estimatedMarketValuePKR: 4800000,
          estimatedDate: new Date("2024-01-01")
        },
        tags: ["corolla", "sedan", "reliable"],
        history: [],
        flags: {}
      }
    ];

    for (const vehicle of vehicles) {
      await Asset.create(vehicle);
    }

    // Summary
    const totalAssets = await Asset.countDocuments();

    users.forEach((user, i) => {
      console.log(`  ${i + 1}. ${user.fullName}`);
    });
   

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

seedCompleteAssets();
