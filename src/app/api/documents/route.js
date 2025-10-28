import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/db";
import Document from "../../../../models/Document";

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
    const { assetId, label, fileUrl, docType, fileType, issuedBy, issueDate, notes, isCritical } = body;

    if (!assetId || !label || !fileUrl) {
      return NextResponse.json({ error: "assetId, label, and fileUrl are required" }, { status: 400 });
    }

    await connectDB();

    const document = await Document.create({
      assetId,
      label,
      fileUrl,
      docType,
      fileType,
      issuedBy,
      issueDate,
      notes,
      isCritical,
      uploadedBy: user.fullName,
    });

    return NextResponse.json({ _id: document._id.toString() }, { status: 201 });
  } catch (error) {
    console.error("POST /api/documents error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
