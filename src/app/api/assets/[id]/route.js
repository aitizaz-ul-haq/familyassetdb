import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../lib/auth";
import { connectDB } from "../../../../../lib/db";
import Asset from "../../../../../models/Asset";

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const asset = await Asset.findById(params.id).populate("owners.personId", "fullName");

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const formatted = {
      _id: asset._id.toString(),
      assetType: asset.assetType,
      title: asset.title,
      description: asset.description,
      location: asset.location,
      currentStatus: asset.currentStatus,
      owners: asset.owners.map((owner) => ({
        personId: owner.personId?._id.toString(),
        personName: owner.personId?.fullName || "Unknown",
        percentage: owner.percentage,
        ownershipType: owner.ownershipType,
      })),
      acquisitionInfo: asset.acquisitionInfo,
      disputeInfo: asset.disputeInfo,
      documents: asset.documents,
      history: asset.history,
      tags: asset.tags,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/assets/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}