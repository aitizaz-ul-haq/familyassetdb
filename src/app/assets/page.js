import { getCurrentUser } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import Asset from "../../../models/Asset";
import User from "../../../models/User";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import DashboardLayout from "../components/DashboardLayout";
import AssetsClient from "./AssetsClient";

export default async function AssetsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await connectDB();

  const assets = await Asset.find()
    .sort({ createdAt: -1 })
    .lean();

  console.log(`Found ${assets.length} assets`);

  // Get all unique user IDs from owners
  const userIds = new Set();
  assets.forEach(asset => {
    if (asset.owners && Array.isArray(asset.owners)) {
      asset.owners.forEach(owner => {
        if (owner.personId) {
          userIds.add(owner.personId.toString());
        }
      });
    }
  });

  console.log(`Found ${userIds.size} unique user IDs`);

  // Fetch all users in one query
  const users = await User.find({ 
    _id: { $in: Array.from(userIds).map(id => new mongoose.Types.ObjectId(id)) } 
  })
    .select('_id fullName')
    .lean();

  console.log(`Fetched ${users.length} users from DB`);

  // Create a map for quick lookup
  const userMap = {};
  users.forEach(u => {
    userMap[u._id.toString()] = u;
  });

  // Properly serialize ALL data
  const assetsData = assets.map(asset => {
    const owners = (asset.owners || []).map(o => {
      const userId = o.personId?.toString();
      const owner = userMap[userId];
      
      return {
        personId: userId || null,
        personName: owner?.fullName || "Unknown",
        percentage: o.percentage || 0,
        ownershipType: o.ownershipType || "legal_owner"
      };
    });

    return {
      _id: asset._id.toString(),
      title: asset.title,
      assetType: asset.assetType,
      currentStatus: asset.currentStatus,
      location: asset.location,
      owners: owners,
      fullData: {
        // Basic Information
        _id: asset._id.toString(),
        assetType: asset.assetType,
        title: asset.title,
        nickname: asset.nickname,
        description: asset.description,
        
        // Type-specific flags
        landUseType: asset.landUseType,
        houseUsageType: asset.houseUsageType,
        apartmentUsageType: asset.apartmentUsageType,
        vehicleType: asset.vehicleType,
        isPrimaryFamilyResidence: asset.isPrimaryFamilyResidence,
        isIncomeGenerating: asset.isIncomeGenerating,
        
        // Location - ALL fields
        location: asset.location ? {
          country: asset.location.country,
          province: asset.location.province,
          city: asset.location.city,
          district: asset.location.district,
          tehsil: asset.location.tehsil,
          areaOrSector: asset.location.areaOrSector,
          societyOrProject: asset.location.societyOrProject,
          blockOrPhase: asset.location.blockOrPhase,
          streetNumber: asset.location.streetNumber,
          plotNumber: asset.location.plotNumber,
          houseNumber: asset.location.houseNumber,
          apartmentNumber: asset.location.apartmentNumber,
          floorNumber: asset.location.floorNumber,
          fullAddress: asset.location.fullAddress,
          nearestLandmark: asset.location.nearestLandmark,
          geoCoordinates: asset.location.geoCoordinates
        } : null,
        
        // Current Status
        currentStatus: asset.currentStatus,
        
        // Dimensions (for plots)
        dimensions: asset.dimensions ? {
          totalArea: asset.dimensions.totalArea,
          convertedAreaSqFt: asset.dimensions.convertedAreaSqFt,
          frontWidthFt: asset.dimensions.frontWidthFt,
          depthFt: asset.dimensions.depthFt,
          isCornerPlot: asset.dimensions.isCornerPlot,
          isParkFacing: asset.dimensions.isParkFacing,
          isMainRoadFacing: asset.dimensions.isMainRoadFacing
        } : null,
        
        // Structure (for houses/apartments)
        structure: asset.structure ? {
          landArea: asset.structure.landArea,
          coveredAreaSqFt: asset.structure.coveredAreaSqFt,
          floors: asset.structure.floors,
          rooms: asset.structure.rooms,
          bedrooms: asset.structure.bedrooms,
          bathrooms: asset.structure.bathrooms,
          kitchens: asset.structure.kitchens,
          drawingRooms: asset.structure.drawingRooms,
          tvLounges: asset.structure.tvLounges,
          storeRooms: asset.structure.storeRooms,
          servantQuarters: asset.structure.servantQuarters,
          garageOrParking: asset.structure.garageOrParking,
          constructionYear: asset.structure.constructionYear,
          conditionSummary: asset.structure.conditionSummary
        } : null,
        
        // Vehicle Specs
        specs: asset.specs ? {
          make: asset.specs.make,
          model: asset.specs.model,
          modelYear: asset.specs.modelYear,
          color: asset.specs.color,
          engineCapacityCC: asset.specs.engineCapacityCC,
          fuelType: asset.specs.fuelType,
          transmission: asset.specs.transmission,
          odometerKm: asset.specs.odometerKm,
          chassisNumber: asset.specs.chassisNumber,
          engineNumber: asset.specs.engineNumber
        } : null,
        
        // Vehicle Registration
        registration: asset.registration ? {
          registrationNumber: asset.registration.registrationNumber,
          registrationCity: asset.registration.registrationCity,
          registrationDate: asset.registration.registrationDate?.toISOString(),
          tokenTaxPaidTill: asset.registration.tokenTaxPaidTill?.toISOString(),
          insuranceValidTill: asset.registration.insuranceValidTill?.toISOString(),
          fitnessValidTill: asset.registration.fitnessValidTill?.toISOString()
        } : null,
        
        // Owners with full details
        owners: owners,
        
        // Acquisition Info
        acquisitionInfo: asset.acquisitionInfo ? {
          acquiredDate: asset.acquisitionInfo.acquiredDate?.toISOString(),
          acquiredFrom: asset.acquisitionInfo.acquiredFrom,
          method: asset.acquisitionInfo.method,
          priceOrValueAtAcquisitionPKR: asset.acquisitionInfo.priceOrValueAtAcquisitionPKR,
          notes: asset.acquisitionInfo.notes
        } : null,
        
        // Valuation
        valuation: asset.valuation ? {
          estimatedMarketValuePKR: asset.valuation.estimatedMarketValuePKR,
          estimatedDate: asset.valuation.estimatedDate?.toISOString(),
          source: asset.valuation.source,
          forcedSaleValuePKR: asset.valuation.forcedSaleValuePKR,
          valuationNotes: asset.valuation.valuationNotes
        } : null,
        
        // Mutation & Title
        mutationAndTitle: asset.mutationAndTitle ? {
          registryNumber: asset.mutationAndTitle.registryNumber,
          registryDate: asset.mutationAndTitle.registryDate?.toISOString(),
          mutationNumber: asset.mutationAndTitle.mutationNumber,
          mutationDate: asset.mutationAndTitle.mutationDate?.toISOString(),
          fardNumber: asset.mutationAndTitle.fardNumber,
          khasraNumber: asset.mutationAndTitle.khasraNumber,
          propertyTaxNumber: asset.mutationAndTitle.propertyTaxNumber,
          isTitleClear: asset.mutationAndTitle.isTitleClear,
          titleNotes: asset.mutationAndTitle.titleNotes
        } : null,
        
        // Compliance
        compliance: asset.compliance ? {
          annualPropertyTaxPKR: asset.compliance.annualPropertyTaxPKR,
          propertyTaxPaidTill: asset.compliance.propertyTaxPaidTill?.toISOString(),
          electricityBillNumber: asset.compliance.electricityBillNumber,
          gasBillNumber: asset.compliance.gasBillNumber,
          waterBillNumber: asset.compliance.waterBillNumber,
          encroachmentRisk: asset.compliance.encroachmentRisk,
          govtAcquisitionRisk: asset.compliance.govtAcquisitionRisk
        } : null,
        
        // Dispute Info
        disputeInfo: asset.disputeInfo ? {
          isInDispute: asset.disputeInfo.isInDispute,
          type: asset.disputeInfo.type,
          startedDate: asset.disputeInfo.startedDate?.toISOString(),
          details: asset.disputeInfo.details,
          lawyerName: asset.disputeInfo.lawyerName,
          lawyerPhone: asset.disputeInfo.lawyerPhone,
          caseNumber: asset.disputeInfo.caseNumber,
          courtName: asset.disputeInfo.courtName,
          nextHearingDate: asset.disputeInfo.nextHearingDate?.toISOString()
        } : null,
        
        // Related Contacts
        relatedContacts: (asset.relatedContacts || []).map(contact => ({
          category: contact.category,
          name: contact.name,
          phoneNumber: contact.phoneNumber,
          email: contact.email,
          cnic: contact.cnic,
          address: contact.address,
          notes: contact.notes,
          addedAt: contact.addedAt?.toISOString()
        })),
        
        // Documents
        documents: (asset.documents || []).map(doc => ({
          _id: doc._id?.toString() || null,
          label: doc.label,
          fileUrl: doc.fileUrl,
          docType: doc.docType,
          fileType: doc.fileType,
          notes: doc.notes,
          uploadedAt: doc.uploadedAt?.toISOString(),
        })),
        
        // History
        history: (asset.history || []).map(h => ({
          date: h.date?.toISOString(),
          action: h.action,
          details: h.details,
          actor: h.actor
        })),
        
        // Tags
        tags: asset.tags || [],
        
        // Notes
        notesInternal: asset.notesInternal,
        
        // Flags
        flags: asset.flags ? {
          needsAttention: asset.flags.needsAttention,
          highValue: asset.flags.highValue,
          hasLegalIssues: asset.flags.hasLegalIssues
        } : null,
        
        // Timestamps
        createdAt: asset.createdAt?.toISOString(),
        updatedAt: asset.updatedAt?.toISOString()
      }
    };
  });

  return (
    <DashboardLayout 
      userName={user.fullName} 
      userRole={user.role}
      userCnic={user.cnic}
    >
      <AssetsClient 
        assets={assetsData} 
        userRole={user.role}
      />
    </DashboardLayout>
  );
}