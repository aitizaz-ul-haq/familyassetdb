import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const users = await User.find()
      .select("fullName email relationToFamily status role")
      .sort({ fullName: 1 });

    const usersData = users.map(u => ({
      _id: u._id.toString(),
      fullName: u.fullName,
      relationToFamily: u.relationToFamily || "N/A",
      status: u.status,
    }));

    return NextResponse.json(usersData);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
