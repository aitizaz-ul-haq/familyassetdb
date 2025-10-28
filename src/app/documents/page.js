import { getCurrentUser } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import Document from "../../../models/Document";
import Asset from "../../../models/Asset";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "../components/DashboardLayout";
import AddDocumentForm from "./AddDocumentForm";

export default async function DocumentsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await connectDB();

  const documents = await Document.find()
    .populate("assetId", "title")
    .sort({ createdAt: -1 });

  const assets = await Asset.find().select("title").sort({ title: 1 });

  const documentsData = documents.map((doc) => ({
    _id: doc._id.toString(),
    label: doc.label,
    fileUrl: doc.fileUrl,
    docType: doc.docType,
    fileType: doc.fileType,
    assetTitle: doc.assetId?.title || "Unknown Asset",
    assetId: doc.assetId?._id.toString(),
    notes: doc.notes,
    isCritical: doc.isCritical,
    createdAt: doc.createdAt,
  }));

  const assetsData = assets.map((a) => ({
    _id: a._id.toString(),
    title: a.title,
  }));

  return (
    <DashboardLayout userName={user.fullName}>
      <h1 style={{ marginBottom: "2rem" }}>Documents</h1>

      {user.role === "admin" && <AddDocumentForm assets={assetsData} />}

      <div className="card">
        {documentsData.length === 0 ? (
          <p>
            No documents uploaded yet. Add documents to assets to see them here.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table-sm table-nowrap">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Format</th>
                  <th>Asset</th>
                  <th>Notes</th>
                  <th>Uploaded</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documentsData.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      {doc.isCritical && (
                        <span
                          style={{
                            color: "#d32f2f",
                            marginRight: "0.5rem",
                          }}
                        >
                          ⚠️
                        </span>
                      )}
                      {doc.label}
                    </td>
                    <td>{doc.docType}</td>
                    <td>
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          background: "#f5f5f5",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          textTransform: "uppercase",
                        }}
                      >
                        {doc.fileType}
                      </span>
                    </td>
                    <td>
                      <Link href={`/assets/${doc.assetId}`}>
                        {doc.assetTitle}
                      </Link>
                    </td>
                    <td>{doc.notes || "N/A"}</td>
                    <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            padding: "0.25rem 0.75rem",
                            background: "#7FC6A4",
                            color: "white",
                            borderRadius: "4px",
                            fontSize: "0.85rem",
                            textDecoration: "none",
                            display: "inline-block",
                          }}
                        >
                          View
                        </a>
                      </div>
                    </td>
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
