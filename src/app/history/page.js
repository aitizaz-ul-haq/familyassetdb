import { getCurrentUser } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import Asset from "../../../models/Asset";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "../components/DashboardLayout";

export default async function HistoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await connectDB();

  // Get all assets with history
  const assets = await Asset.find({ "history.0": { $exists: true } })
    .select("title history")
    .sort({ "history.date": -1 });

  // Flatten all history entries with asset info
  const allHistory = [];
  assets.forEach((asset) => {
    asset.history.forEach((entry) => {
      allHistory.push({
        assetId: asset._id.toString(),
        assetTitle: asset.title,
        date: entry.date,
        action: entry.action,
        details: entry.details,
      });
    });
  });

  // Sort by date descending
  allHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <DashboardLayout 
      userName={user.fullName}
      userRole={user.role}
      userCnic={user.cnic}
    >
      <h1 style={{ marginBottom: "2rem" }}>History</h1>

      <div className="card">
        {allHistory.length === 0 ? (
          <p>No history entries yet. Add assets with history to see them here.</p>
        ) : (
          <div className="table-responsive">
            <table className="table-sm table-nowrap">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Asset</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {allHistory.map((entry, idx) => (
                  <tr key={idx}>
                    <td>{new Date(entry.date).toLocaleDateString()}</td>
                    <td>
                      <Link href={`/assets/${entry.assetId}`}>
                        {entry.assetTitle}
                      </Link>
                    </td>
                    <td>{entry.action}</td>
                    <td>{entry.details || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
