import { getCurrentUser } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import Asset from "../../../models/Asset";
import Person from "../../../models/Person";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await connectDB();

  const [totalAssets, totalPeople, assetsInDispute, recentAssets] = await Promise.all([
    Asset.countDocuments(),
    Person.countDocuments(),
    Asset.countDocuments({ "disputeInfo.isInDispute": true }),
    Asset.find().sort({ createdAt: -1 }).limit(5).select("title assetType currentStatus createdAt"),
  ]);

  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>Dashboard</h1>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>Welcome back, {user.fullName}.</p>

      <div className="grid-cards" style={{ marginBottom: "2rem" }}>
        <div className="card">
          <h3>Total Assets</h3>
          <div style={{ fontSize: "2rem", fontWeight: "bold", marginTop: "0.5rem" }}>{totalAssets}</div>
        </div>
        <div className="card">
          <h3>Assets in Dispute</h3>
          <div style={{ fontSize: "2rem", fontWeight: "bold", marginTop: "0.5rem", color: assetsInDispute ? "#d32f2f" : "#2e7d32" }}>{assetsInDispute}</div>
        </div>
        <div className="card">
          <h3>Total People</h3>
          <div style={{ fontSize: "2rem", fontWeight: "bold", marginTop: "0.5rem" }}>{totalPeople}</div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", gap: "0.75rem" }}>
          <h2 style={{ margin: 0 }}>Recent Assets</h2>
          <Link href="/assets">View all</Link>
        </div>
        <div className="table-responsive">
          {recentAssets.length === 0 ? (
            <p>No assets yet. <Link href="/assets">Add your first asset</Link></p>
          ) : (
            <table className="table-sm table-nowrap">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {recentAssets.map((asset) => (
                  <tr key={asset._id.toString()}>
                    <td><Link href={`/assets/${asset._id.toString()}`}>{asset.title}</Link></td>
                    <td>{asset.assetType.replace("_", " ")}</td>
                    <td>{asset.currentStatus}</td>
                    <td>{new Date(asset.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}