import { getCurrentUser } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import Asset from "../../../models/Asset";
import Person from "../../../models/Person";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "../components/DashboardLayout";

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

  // Fetch assets that have documents
  const assetsWithDocs = await Asset.find({ 
    documents: { $exists: true, $ne: [] } 
  })
    .select('title assetType documents')
    .sort({ updatedAt: -1 })
    .limit(10)
    .lean();

  // Serialize data
  const assetsWithDocsData = assetsWithDocs.map(asset => ({
    _id: asset._id.toString(),
    title: asset.title,
    assetType: asset.assetType,
    documents: asset.documents.map(doc => ({
      _id: doc._id?.toString(),
      label: doc.label,
      fileUrl: doc.fileUrl,
      fileType: doc.fileType,
      docType: doc.docType,
    }))
  }));

  return (
    <DashboardLayout userName={user.fullName}>
      <h1 style={{ marginBottom: "2rem" }}>Dashboard</h1>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
          <h3 style={{ color: "#7FC6A4", fontSize: "2rem", margin: "0 0 0.5rem 0" }}>{totalAssets}</h3>
          <p style={{ color: "#6D7692", margin: 0 }}>Total Assets</p>
        </div>
        <div className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
          <h3 style={{ color: "#ef5350", fontSize: "2rem", margin: "0 0 0.5rem 0" }}>{assetsInDispute}</h3>
          <p style={{ color: "#6D7692", margin: 0 }}>Assets in Dispute</p>
        </div>
        <div className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
          <h3 style={{ color: "#2196F3", fontSize: "2rem", margin: "0 0 0.5rem 0" }}>{totalPeople}</h3>
          <p style={{ color: "#6D7692", margin: 0 }}>Total People</p>
        </div>
      </div>

      {/* Recent Assets */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Recent Assets</h2>
        {recentAssets.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>Title</th>
                <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>Type</th>
                <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>Status</th>
                <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd" }}>City</th>
              </tr>
            </thead>
            <tbody>
              {recentAssets.map((asset) => (
                <tr key={asset._id.toString()}>
                  <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>
                    <Link href={`/assets`} style={{ color: "#7FC6A4", textDecoration: "none" }}>
                      {asset.title}
                    </Link>
                  </td>
                  <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>{asset.assetType?.replace(/_/g, " ")}</td>
                  <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>
                    <span style={{ color: asset.currentStatus === "clean" ? "green" : "red" }}>
                      {asset.currentStatus?.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>{asset.location?.city || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "#666" }}>No assets found.</p>
        )}
      </div>

      {/* NEW: Assets with Documents Table */}
      <div className="card">
        <h2 style={{ marginBottom: "1rem" }}>📎 Assets with Documents</h2>
        {assetsWithDocsData.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd", width: "40%" }}>
                    Asset with Docs
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd", width: "20%" }}>
                    Type
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "left", border: "1px solid #ddd", width: "15%" }}>
                    Format
                  </th>
                  <th style={{ padding: "0.75rem", textAlign: "center", border: "1px solid #ddd", width: "25%" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {assetsWithDocsData.map((asset) => (
                  asset.documents.map((doc, docIdx) => (
                    <tr key={`${asset._id}-${docIdx}`}>
                      <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                          <strong style={{ fontSize: "0.9rem", color: "#333" }}>{asset.title}</strong>
                          <span style={{ fontSize: "0.8rem", color: "#666" }} title={doc.label}>
                            {doc.label.length > 40 ? `${doc.label.substring(0, 40)}...` : doc.label}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "0.75rem", border: "1px solid #ddd", fontSize: "0.85rem" }}>
                        {asset.assetType?.replace(/_/g, " ")}
                      </td>
                      <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>
                        <span style={{
                          padding: "0.25rem 0.5rem",
                          background: 
                            doc.fileType?.toLowerCase() === 'pdf' ? "#f44336" :
                            ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(doc.fileType?.toLowerCase()) ? "#4caf50" :
                            "#999",
                          color: "white",
                          borderRadius: "3px",
                          fontSize: "0.7rem",
                          fontWeight: "600",
                          textTransform: "uppercase"
                        }}>
                          {doc.fileType?.toLowerCase() === 'pdf' ? 'PDF' :
                           ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(doc.fileType?.toLowerCase()) ? 'IMG' :
                           doc.fileType || 'DOC'}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem", border: "1px solid #ddd" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: "0.4rem 0.8rem",
                              background: "#2196F3",
                              color: "white",
                              borderRadius: "4px",
                              textDecoration: "none",
                              fontSize: "0.75rem",
                              whiteSpace: "nowrap"
                            }}
                          >
                            ↗ Open
                          </a>
                          <Link
                            href={`/assets`}
                            style={{
                              padding: "0.4rem 0.8rem",
                              background: "#7FC6A4",
                              color: "white",
                              borderRadius: "4px",
                              textDecoration: "none",
                              fontSize: "0.75rem",
                              whiteSpace: "nowrap"
                            }}
                          >
                            View Asset
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: "#666", fontSize: "0.9rem" }}>No assets with documents found.</p>
        )}
      </div>
    </DashboardLayout>
  );
}