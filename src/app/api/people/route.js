import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth";
import { connectDB } from "../../../../lib/db";
import Person from "../../../../models/Person";

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const people = await Person.find()
      .select("fullName relationToFamily status cnic")
      .sort({ fullName: 1 });

    return NextResponse.json(people);
  } catch (error) {
    console.error("GET /api/people error:", error);
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
    const { fullName, fatherName, cnic, relationToFamily, status, notes } = body;

    if (!fullName) {
      return NextResponse.json({ error: "fullName is required" }, { status: 400 });
    }

    await connectDB();

    const person = await Person.create({
      fullName,
      fatherName,
      cnic,
      relationToFamily,
      status: status || "alive",
      notes,
    });

    return NextResponse.json({ _id: person._id.toString() }, { status: 201 });
  } catch (error) {
    console.error("POST /api/people error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}