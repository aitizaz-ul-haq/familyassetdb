import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import User from "../../../../../models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    console.log("=== LOGIN API STARTED ===");
    console.log("Environment check:");
    console.log("- JWT_SECRET exists:", !!process.env.JWT_SECRET);
    console.log("- MONGODB_URI exists:", !!process.env.MONGODB_URI);
    console.log("- NODE_ENV:", process.env.NODE_ENV);

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not set");
      return NextResponse.json(
        { error: "Server configuration error: JWT_SECRET missing" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    console.log("Login attempt for email:", email);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to database
    console.log("Attempting to connect to database...");
    await connectDB();
    console.log("✅ Database connected");

    // Find user
    console.log("Searching for user:", email);
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("❌ User not found:", email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("✅ User found:", user.email, "Role:", user.role);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("✅ Password matched, creating session");

    // Create JWT
    const token = jwt.sign(
      {
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ JWT created");

    // Set cookie
    cookies().set({
      name: "family_assets_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from "strict" for better Vercel compatibility
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    console.log("✅ Session cookie set");
    console.log("=== LOGIN SUCCESSFUL ===");

    return NextResponse.json({
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error.message);
    console.error("Error stack:", error.stack);

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}