import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../lib/auth";
import { connectDB } from "../../../../../lib/db";
import Asset from "../../../../../models/Asset";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { assetId, docId } = await request.json();

    if (!assetId || !docId) {
      return NextResponse.json(
        { error: "Missing assetId or docId" },
        { status: 400 }
      );
    }

    await connectDB();

    // Use $pull to remove the document without triggering validation
    const result = await Asset.updateOne(
      { _id: new mongoose.Types.ObjectId(assetId) },
      { $pull: { documents: { _id: new mongoose.Types.ObjectId(docId) } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Document not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete document error:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
