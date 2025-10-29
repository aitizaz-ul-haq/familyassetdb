import { getCurrentUser } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import Asset from "../../../models/Asset";
import Person from "../../../models/Person";
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

  console.log("=== ASSETS PAGE DEBUG ===");
  console.log(`Found ${assets.length} assets`);

  // Debug first asset
  if (assets.length > 0) {
    console.log("First asset:", {
      title: assets[0].title,
      owners: assets[0].owners
    });
  }

  // Get all unique person IDs from assets
  const personIds = new Set();
  assets.forEach(asset => {
    if (asset.owners && Array.isArray(asset.owners)) {
      asset.owners.forEach(owner => {
        if (owner.personId) {
          // Try to convert to ObjectId if it's a string
          try {
            const id = mongoose.Types.ObjectId.isValid(owner.personId) 
              ? owner.personId.toString() 
              : null;
            if (id) personIds.add(id);
          } catch (e) {
            console.error("Invalid personId:", owner.personId);
          }
        }
      });
    }
  });

  console.log(`Found ${personIds.size} unique person IDs:`, Array.from(personIds));

  // Fetch all persons in one query
  const persons = await Person.find({ 
    _id: { $in: Array.from(personIds).map(id => new mongoose.Types.ObjectId(id)) } 
  })
    .select('_id fullName')
    .lean();

  console.log(`Fetched ${persons.length} persons from DB:`);
  persons.forEach(p => {
    console.log(`  - ${p._id.toString()}: ${p.fullName}`);
  });

  // Create a map for quick lookup
  const personMap = {};
  persons.forEach(person => {
    personMap[person._id.toString()] = person;
  });

  // Properly serialize all data
  const assetsData = assets.map(asset => {
    const owners = (asset.owners || []).map(o => {
      const personId = o.personId?.toString();
      const person = personMap[personId];
      
      // Debug each owner lookup
      if (!person && personId) {
        console.log(`⚠️ MISSING PERSON: Asset "${asset.title}" has owner with personId ${personId} but person not found in DB`);
      }
      
      return {
        personId: personId || null,
        personName: person?.fullName || "Unknown",
        percentage: o.percentage || 0
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
        _id: asset._id.toString(),
        title: asset.title,
        assetType: asset.assetType,
        currentStatus: asset.currentStatus,
        location: asset.location,
        owners: owners.map(o => ({
          ...o,
          ownershipType: asset.owners?.find(ao => ao.personId?.toString() === o.personId)?.ownershipType || "legal_owner"
        })),
        dimensions: asset.dimensions,
        structure: asset.structure,
        specs: asset.specs,
        registration: asset.registration,
        acquisitionInfo: asset.acquisitionInfo ? {
          ...asset.acquisitionInfo,
          acquiredDate: asset.acquisitionInfo.acquiredDate?.toISOString()
        } : null,
        valuation: asset.valuation ? {
          ...asset.valuation,
          estimatedDate: asset.valuation.estimatedDate?.toISOString()
        } : null,
        mutationAndTitle: asset.mutationAndTitle,
        compliance: asset.compliance ? {
          ...asset.compliance,
          propertyTaxPaidTill: asset.compliance.propertyTaxPaidTill?.toISOString()
        } : null,
        documents: (asset.documents || []).map(doc => ({
          _id: doc._id?.toString() || null,
          label: doc.label,
          fileUrl: doc.fileUrl,
          docType: doc.docType,
          fileType: doc.fileType,
          notes: doc.notes,
          uploadedAt: doc.uploadedAt ? doc.uploadedAt.toISOString() : null,
        })),
        relatedContacts: asset.relatedContacts || [],
        history: (asset.history || []).map(h => ({
          date: h.date?.toISOString(),
          action: h.action,
          details: h.details,
          actor: h.actor
        })),
        tags: asset.tags || [],
        notesInternal: asset.notesInternal,
        flags: asset.flags,
        createdAt: asset.createdAt?.toISOString(),
        updatedAt: asset.updatedAt?.toISOString()
      }
    };
  });

  console.log("=== END DEBUG ===");

  return (
    <DashboardLayout userName={user.fullName}>
      <AssetsClient 
        assets={assetsData} 
        userRole={user.role}
      />
    </DashboardLayout>
  );
}