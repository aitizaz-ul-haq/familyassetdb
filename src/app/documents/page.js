import { getCurrentUser } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";
import Document from "../../../models/Document";
import Asset from "../../../models/Asset";
import { redirect } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "../components/DashboardLayout";
import AddDocumentForm from "./AddDocumentForm";
import DocumentsList from "./DocumentsList";

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

      <DocumentsList documents={documentsData} />
    </DashboardLayout>
  );
}
