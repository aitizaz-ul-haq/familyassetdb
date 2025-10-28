import { getCurrentUser } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import Asset from "../../../models/Asset";
import { redirect } from "next/navigation";
import Link from "next/link";
import AddAssetForm from "./AddAssetForm";

export default async function AssetsPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  await connectDB();

  const assets = await Asset.find()
    .populate("owners.personId", "fullName")
    .sort({ createdAt: -1 });

  return (
    <div>
      <h1 style={{ marginBottom: "2rem" }}>Assets</h1>

      {user.role === "admin" && <AddAssetForm />}

      <div className="card">
        <div className="table-responsive">
          <table className="table-sm table-nowrap">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Owners</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset._id.toString()}>
                  <td>
                    <Link href={`/assets/${asset._id.toString()}`}>
                      {asset.title}
                    </Link>
                  </td>
                  <td>{asset.assetType.replace("_", " ")}</td>
                  <td>
                    {asset.location?.city && asset.location?.areaOrSector
                      ? `${asset.location.city}, ${asset.location.areaOrSector}`
                      : asset.location?.city || "N/A"}
                  </td>
                  <td>
                    <span className={`badge ${asset.currentStatus === "in_dispute" ? "badge-danger" : "badge-success"}`}>
                      {asset.currentStatus}
                    </span>
                  </td>
                  <td>
                    {asset.owners.map((owner, idx) => (
                      <div key={idx}>
                        {owner.personId?.fullName || "Unknown"} ({owner.percentage}%)
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}