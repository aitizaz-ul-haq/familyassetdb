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

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    await connectDB();

    const asset = await Asset.findById(params.id);
    
    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Update all fields
    Object.keys(body).forEach(key => {
      asset[key] = body[key];
    });

    await asset.save();

    return NextResponse.json({ success: true, asset });
  } catch (error) {
    console.error("Update asset error:", error);
    return NextResponse.json(
      { error: "Failed to update asset", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const deletedAsset = await Asset.findByIdAndDelete(params.id);

    if (!deletedAsset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/assets/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}