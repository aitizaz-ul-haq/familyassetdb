import { getCurrentUser } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import Asset from "../../../models/Asset";
import { redirect } from "next/navigation";
import DashboardLayout from "../components/DashboardLayout";
import AttachDocumentButton from "./AttachDocumentButton";
import DocumentsTable from "./DocumentsTable";

export const dynamic = 'force-dynamic';

export default async function DocumentsPage({ searchParams }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await connectDB();

  const searchQuery = searchParams?.search?.trim() || "";

  console.log("=== DOCUMENTS PAGE DEBUG ===");
  console.log("Search query:", searchQuery);

  // First, let's see ALL assets with documents (no filter)
  const allAssetsWithDocs = await Asset.find({ 
    documents: { $exists: true, $ne: [] } 
  })
    .select('title documents')
    .lean();

  console.log(`Total assets with documents in DB: ${allAssetsWithDocs.length}`);
  if (allAssetsWithDocs.length > 0) {
    console.log("Assets found:", allAssetsWithDocs.map(a => ({
      title: a.title,
      docCount: a.documents?.length || 0
    })));
  }

  // Now apply search filter
  let query = { documents: { $exists: true, $ne: [] } };
  
  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: "i" };
    console.log("Applying search filter:", query);
  }

  const assetsWithDocs = await Asset.find(query)
    .select('title documents')
    .sort({ title: 1 })
    .lean();

  console.log(`Assets after filter: ${assetsWithDocs.length}`);
  console.log("=== END DEBUG ===");

  // Serialize data
  const assetsData = assetsWithDocs.map(asset => ({
    _id: asset._id.toString(),
    title: asset.title,
    documentCount: asset.documents?.length || 0,
    documents: (asset.documents || []).map(doc => ({
      label: doc.label,
      fileUrl: doc.fileUrl,
      docType: doc.docType,
      fileType: doc.fileType,
      uploadedAt: doc.uploadedAt,
    }))
  }));

  return (
    <DashboardLayout userName={user.fullName}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ margin: 0 }}>📎 Documents</h1>
        <AttachDocumentButton />
      </div>

      <div className="card">
        <p style={{ marginBottom: "1.5rem", color: "#666", fontSize: "0.95rem" }}>
          Assets with attached documents. Use the search to find specific assets by name.
        </p>

        {/* DEBUG INFO */}
        <div style={{ 
          padding: "1rem", 
          background: "#f0f0f0", 
          borderRadius: "4px", 
          marginBottom: "1rem",
          fontSize: "0.85rem"
        }}>
          <strong>Debug Info:</strong><br/>
          Total assets with documents: {allAssetsWithDocs.length}<br/>
          Search query: {searchQuery || "(none)"}<br/>
          Results shown: {assetsData.length}
        </div>

        <DocumentsTable assets={assetsData} initialSearch={searchQuery} />
      </div>
    </DashboardLayout>
  );
}
