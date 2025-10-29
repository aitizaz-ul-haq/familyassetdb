import { getCurrentUser } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import Asset from "../../../models/Asset";
import User from "../../../models/User";
import { redirect } from "next/navigation";
import DashboardLayout from "../components/DashboardLayout";
import DashboardCharts from "./DashboardCharts";
import styles from "./dashboard.module.css";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await connectDB();

  // Basic stats
  const totalAssets = await Asset.countDocuments();
  const totalUsers = await User.countDocuments();
  const assetsInDispute = await Asset.countDocuments({ 
    "disputeInfo.isInDispute": true 
  });

  // Assets by type
  const assetsByType = await Asset.aggregate([
    {
      $group: {
        _id: "$assetType",
        count: { $sum: 1 }
      }
    }
  ]);

  // Assets by status
  const assetsByStatus = await Asset.aggregate([
    {
      $group: {
        _id: "$currentStatus",
        count: { $sum: 1 }
      }
    }
  ]);

  // Assets by location (city)
  const assetsByCity = await Asset.aggregate([
    {
      $group: {
        _id: "$location.city",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  // Assets with documents vs without
  const assetsWithDocs = await Asset.countDocuments({
    documents: { $exists: true, $ne: [] }
  });
  const assetsWithoutDocs = totalAssets - assetsWithDocs;

  // Ownership distribution (top 5 owners by asset count)
  const topOwners = await Asset.aggregate([
    { $unwind: "$owners" },
    {
      $lookup: {
        from: "people",
        localField: "owners.personId",
        foreignField: "_id",
        as: "personInfo"
      }
    },
    { $unwind: "$personInfo" },
    {
      $group: {
        _id: "$personInfo.fullName",
        assetCount: { $sum: 1 }
      }
    },
    { $sort: { assetCount: -1 } },
    { $limit: 5 }
  ]);

  // Monthly asset acquisition trend (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const acquisitionTrend = await Asset.aggregate([
    {
      $match: {
        "acquisitionInfo.acquiredDate": { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$acquisitionInfo.acquiredDate" },
          month: { $month: "$acquisitionInfo.acquiredDate" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  // Serialize data
  const chartData = {
    assetsByType: assetsByType.map(item => ({
      type: item._id || "Unknown",
      count: item.count
    })),
    assetsByStatus: assetsByStatus.map(item => ({
      status: item._id || "Unknown",
      count: item.count
    })),
    assetsByCity: assetsByCity.map(item => ({
      city: item._id || "Unknown",
      count: item.count
    })),
    documentsStats: {
      withDocs: assetsWithDocs,
      withoutDocs: assetsWithoutDocs
    },
    topOwners: topOwners.map(item => ({
      name: item._id,
      count: item.assetCount
    })),
    acquisitionTrend: acquisitionTrend.map(item => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      count: item.count
    }))
  };

  return (
    <DashboardLayout userName={user.fullName}>
      <div className={styles.dashboardContainer}>
        <h1 className={styles.dashboardTitle}>📊 Dashboard</h1>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.purple}`}>
            <div className={styles.statIcon}>🏢</div>
            <h3 className={styles.statNumber}>{totalAssets}</h3>
            <p className={styles.statLabel}>Total Assets</p>
          </div>

          <div className={`${styles.statCard} ${styles.pink}`}>
            <div className={styles.statIcon}>⚠️</div>
            <h3 className={styles.statNumber}>{assetsInDispute}</h3>
            <p className={styles.statLabel}>Assets in Dispute</p>
          </div>

          <div className={`${styles.statCard} ${styles.blue}`}>
            <div className={styles.statIcon}>👥</div>
            <h3 className={styles.statNumber}>{totalUsers}</h3>
            <p className={styles.statLabel}>Registered Users</p>
          </div>
        </div>

        {/* Charts - Client Component */}
        <DashboardCharts data={chartData} />
      </div>
    </DashboardLayout>
  );
}