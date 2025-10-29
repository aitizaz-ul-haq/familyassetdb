import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    console.log("Login attempt started");

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set");
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
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected");

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("User not found:", email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("User found:", user.email);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      console.log("Password mismatch for:", email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("Password matched, creating session");

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

    // Set cookie
    cookies().set({
      name: "family_assets_session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    console.log("Session created successfully for:", email);

    return NextResponse.json({
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    console.error("Error stack:", error.stack);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}