import { getCurrentUser } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import Asset from "../../../models/Asset";
import User from "../../../models/User"; // Import User model for population
import { redirect } from "next/navigation";
import DashboardLayout from "../components/DashboardLayout";
import AddAssetForm from "./AddAssetForm";
import AssetsTable from "./AssetsTable";

export default async function AssetsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await connectDB();

  // Don't populate - owners.personId references User._id (string)
  // We'll handle owner names separately
  const assets = await Asset.find()
    .sort({ createdAt: -1 })
    .lean();

  // Get all user IDs from assets
  const userIds = [...new Set(
    assets.flatMap(a => a.owners?.map(o => o.personId).filter(Boolean) || [])
  )];

  // Fetch users separately
  const users = await User.find({ _id: { $in: userIds } }).lean();
  const userMap = Object.fromEntries(users.map(u => [u._id.toString(), u]));

  const assetsData = assets.map(asset => ({
    _id: asset._id.toString(),
    title: asset.title,
    assetType: asset.assetType,
    currentStatus: asset.currentStatus,
    location: {
      city: asset.location?.city || "N/A",
      areaOrSector: asset.location?.areaOrSector || "N/A",
    },
    owners: asset.owners?.map(owner => {
      const userId = owner.personId?.toString();
      const user = userMap[userId];
      return {
        personName: user?.fullName || "Unknown",
        percentage: owner.percentage,
      };
    }) || [],
    fullData: {
      _id: asset._id.toString(),
      assetType: asset.assetType,
      title: asset.title,
      nickname: asset.nickname,
      description: asset.description,
      landUseType: asset.landUseType,
      houseUsageType: asset.houseUsageType,
      apartmentUsageType: asset.apartmentUsageType,
      vehicleType: asset.vehicleType,
      usageType: asset.usageType,
      possessionStatus: asset.possessionStatus,
      isPrimaryFamilyResidence: asset.isPrimaryFamilyResidence,
      isIncomeGenerating: asset.isIncomeGenerating,
      currentStatus: asset.currentStatus,
      location: asset.location,
      dimensions: asset.dimensions,
      structure: asset.structure,
      registration: asset.registration,
      specs: asset.specs,
      owners: asset.owners?.map(o => {
        const userId = o.personId?.toString();
        const user = userMap[userId];
        return {
          personId: userId || null,
          personName: user?.fullName || null,
          percentage: o.percentage,
          ownershipType: o.ownershipType,
        };
      }) || [],
      primaryUsers: asset.primaryUsers,
      acquisitionInfo: asset.acquisitionInfo,
      mutationAndTitle: asset.mutationAndTitle,
      occupancy: asset.occupancy,
      rentalInfo: asset.rentalInfo,
      valuation: asset.valuation,
      compliance: asset.compliance,
      possessionDetails: asset.possessionDetails,
      maintenance: asset.maintenance,
      controlInfo: asset.controlInfo,
      history: asset.history || [],
      flags: asset.flags,
      notesInternal: asset.notesInternal,
      tags: asset.tags || [],
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
      documents: asset.documents || [],
      relatedContacts: asset.relatedContacts || [],
    },
  }));

  const cities = [...new Set(assets.map(a => a.location?.city).filter(Boolean))].sort();
  const statuses = [...new Set(assets.map(a => a.currentStatus).filter(Boolean))].sort();

  return (
    <DashboardLayout userName={user.fullName}>
      <h1 style={{ marginBottom: "2rem" }}>Assets</h1>

      {user.role === "admin" && <AddAssetForm />}

      <AssetsTable 
        assets={assetsData} 
        cities={cities}
        statuses={statuses}
        userRole={user.role}
      />
    </DashboardLayout>
  );
}