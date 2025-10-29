import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../lib/auth";
import { connectDB } from "../../../../../lib/db";
import Asset from "../../../../../models/Asset";

export async function POST(request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { assetId, document } = body;

    console.log("Attaching document:", { assetId, document });

    if (!assetId || !document || !document.label || !document.fileUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    // Detect file type from URL
    let fileType = "other";
    if (document.fileUrl.includes("drive.google.com")) {
      fileType = "pdf";
    } else if (document.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      const match = document.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
      fileType = match[1].toLowerCase();
    }

    // Add document to asset
    const asset = await Asset.findByIdAndUpdate(
      assetId,
      {
        $push: {
          documents: {
            label: document.label,
            fileUrl: document.fileUrl,
            docType: document.docType || "other",
            fileType: fileType,
            notes: document.notes,
            uploadedAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    console.log(`Document attached successfully to asset: ${asset.title}`);
    console.log(`Asset now has ${asset.documents?.length || 0} documents`);

    return NextResponse.json({ 
      success: true, 
      assetId: asset._id.toString(),
      assetTitle: asset.title,
      documentCount: asset.documents?.length || 0
    });
  } catch (error) {
    console.error("Error attaching document:", error);
    return NextResponse.json({ error: "Failed to attach document", details: error.message }, { status: 500 });
  }
}
