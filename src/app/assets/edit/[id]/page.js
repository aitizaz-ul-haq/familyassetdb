import { getCurrentUser } from "../../../../../lib/auth";
import { connectDB } from "../../../../../lib/db";
import Asset from "../../../../../models/Asset";
import User from "../../../../../models/User";
import { redirect, notFound } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
import EditAssetForm from "./EditAssetForm";

export default async function EditAssetPage({ params }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  
  if (user.role !== "admin") {
    redirect("/assets");
  }

  await connectDB();

  const asset = await Asset.findById(params.id).lean();
  
  if (!asset) {
    notFound();
  }

  // Fetch all users for ownership dropdown
  const users = await User.find({}).select("_id fullName email").lean();

  // Serialize asset data
  const assetData = {
    _id: asset._id.toString(),
    assetType: asset.assetType,
    title: asset.title,
    nickname: asset.nickname,
    description: asset.description,
    landUseType: asset.landUseType,
    houseUsageType: asset.houseUsageType,
    apartmentUsageType: asset.apartmentUsageType,
    vehicleType: asset.vehicleType,
    isPrimaryFamilyResidence: asset.isPrimaryFamilyResidence,
    isIncomeGenerating: asset.isIncomeGenerating,
    location: asset.location,
    currentStatus: asset.currentStatus,
    dimensions: asset.dimensions,
    structure: asset.structure,
    specs: asset.specs,
    registration: asset.registration ? {
      ...asset.registration,
      registrationDate: asset.registration.registrationDate?.toISOString().split('T')[0],
      tokenTaxPaidTill: asset.registration.tokenTaxPaidTill?.toISOString().split('T')[0],
      insuranceValidTill: asset.registration.insuranceValidTill?.toISOString().split('T')[0],
      fitnessValidTill: asset.registration.fitnessValidTill?.toISOString().split('T')[0]
    } : null,
    owners: (asset.owners || []).map(o => ({
      personId: o.personId?.toString(),
      percentage: o.percentage,
      ownershipType: o.ownershipType
    })),
    acquisitionInfo: asset.acquisitionInfo ? {
      ...asset.acquisitionInfo,
      acquiredDate: asset.acquisitionInfo.acquiredDate?.toISOString().split('T')[0]
    } : null,
    valuation: asset.valuation ? {
      ...asset.valuation,
      estimatedDate: asset.valuation.estimatedDate?.toISOString().split('T')[0]
    } : null,
    mutationAndTitle: asset.mutationAndTitle ? {
      ...asset.mutationAndTitle,
      registryDate: asset.mutationAndTitle.registryDate?.toISOString().split('T')[0],
      mutationDate: asset.mutationAndTitle.mutationDate?.toISOString().split('T')[0]
    } : null,
    compliance: asset.compliance ? {
      ...asset.compliance,
      propertyTaxPaidTill: asset.compliance.propertyTaxPaidTill?.toISOString().split('T')[0]
    } : null,
    disputeInfo: asset.disputeInfo,
    relatedContacts: asset.relatedContacts || [],
    tags: asset.tags || [],
    notesInternal: asset.notesInternal,
    flags: asset.flags || {}
  };

  const usersData = users.map(u => ({
    _id: u._id.toString(),
    fullName: u.fullName,
    email: u.email
  }));

  return (
    <DashboardLayout userName={user.fullName}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "2rem" }}>✏️ Edit Asset</h1>
        <div className="card" style={{ padding: "2rem" }}>
          <EditAssetForm asset={assetData} users={usersData} />
        </div>
      </div>
    </DashboardLayout>
  );
}
