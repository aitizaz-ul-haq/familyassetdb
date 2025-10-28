import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/db";
import Asset from "../../../../models/Asset";

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const assets = await Asset.find()
      .populate("owners.personId", "fullName")
      .select("title assetType currentStatus location owners")
      .sort({ createdAt: -1 });

    const formatted = assets.map((asset) => ({
      _id: asset._id.toString(),
      title: asset.title,
      assetType: asset.assetType,
      currentStatus: asset.currentStatus,
      location: {
        city: asset.location?.city,
        areaOrSector: asset.location?.areaOrSector,
      },
      owners: asset.owners.map((owner) => ({
        personName: owner.personId?.fullName || "Unknown",
        percentage: owner.percentage,
      })),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET /api/assets error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    await connectDB();

    const asset = await Asset.create(body);

    return NextResponse.json({ _id: asset._id.toString() }, { status: 201 });
  } catch (error) {
    console.error("POST /api/assets error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}