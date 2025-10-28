import { getCurrentUser } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import Asset from "../../../models/Asset";
import { redirect } from "next/navigation";
import DashboardLayout from "../components/DashboardLayout";
import AddAssetForm from "./AddAssetForm";
import AssetsTable from "./AssetsTable";

export default async function AssetsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await connectDB();

  const assets = await Asset.find()
    .populate("owners.personId", "fullName")
    .sort({ createdAt: -1 });

  const assetsData = assets.map((asset) => ({
    _id: asset._id.toString(),
    title: asset.title,
    assetType: asset.assetType,
    currentStatus: asset.currentStatus,
    location: {
      city: asset.location?.city || "N/A",
      areaOrSector: asset.location?.areaOrSector || "N/A",
    },
    owners: asset.owners.map((owner) => ({
      personName: owner.personId?.fullName || "Unknown",
      percentage: owner.percentage,
    })),
    // Include full asset data for view/edit modal
    fullData: {
      ...asset.toObject(),
      _id: asset._id.toString(),
    },
  }));

  // Get unique values for filters
  const cities = [
    ...new Set(assets.map((a) => a.location?.city).filter(Boolean)),
  ].sort();
  const statuses = [
    ...new Set(assets.map((a) => a.currentStatus).filter(Boolean)),
  ].sort();

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