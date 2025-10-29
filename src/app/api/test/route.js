import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";

export async function GET() {
  try {
    console.log("=== TEST API ===");
    console.log("Environment variables:");
    console.log("- MONGODB_URI:", process.env.MONGODB_URI ? "EXISTS" : "MISSING");
    console.log("- JWT_SECRET:", process.env.JWT_SECRET ? "EXISTS" : "MISSING");
    console.log("- NODE_ENV:", process.env.NODE_ENV);

    await connectDB();

    return NextResponse.json({
      status: "✅ OK",
      mongodb: "✅ Connected",
      jwt: process.env.JWT_SECRET ? "✅ Set" : "❌ Missing",
      env: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error("Test API Error:", error);
    return NextResponse.json({
      status: "❌ ERROR",
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
