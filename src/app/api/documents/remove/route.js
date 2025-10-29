import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../lib/auth";
import { connectDB } from "../../../../../lib/db";
import Asset from "../../../../../models/Asset";

export async function POST(request) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ONLY admin can delete documents
  if (user.role !== "admin") {
    return NextResponse.json({ 
      error: "Forbidden - Only Admin can delete documents" 
    }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { assetId, docIndex } = body;

    if (!assetId || docIndex === undefined) {
      return NextResponse.json({ error: "Missing assetId or docIndex" }, { status: 400 });
    }

    await connectDB();

    // Find the asset first
    const asset = await Asset.findById(assetId);

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    if (!asset.documents || asset.documents.length <= docIndex) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Remove the document at the specified index
    const deletedDoc = asset.documents[docIndex];
    asset.documents.splice(docIndex, 1);

    // Save the asset
    await asset.save();

    console.log(`[ADMIN DELETE] User ${user.email} deleted document "${deletedDoc.label}" from asset: ${asset.title}`);
    console.log(`Asset now has ${asset.documents.length} documents`);

    return NextResponse.json({ 
      success: true, 
      assetId: asset._id.toString(),
      assetTitle: asset.title,
      deletedLabel: deletedDoc.label,
      remainingCount: asset.documents.length
    });
  } catch (error) {
    console.error("Error removing document:", error);
    return NextResponse.json({ error: "Failed to remove document", details: error.message }, { status: 500 });
  }
}
