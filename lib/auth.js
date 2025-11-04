import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "./db";
import User from "../models/User";

const COOKIE_NAME = "family_assets_session";
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export function signJWT(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function createSession(userId, role, email) {
  const token = signJWT({ _id: userId, role, email });
  
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  
  return token;
}

export function destroySession() {
  cookies().delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("family_assets_session");

    if (!token) {
      console.log("No token found");
      return null;
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    
    await connectDB();
    
    // Fetch complete user data including cnic
    const user = await User.findById(decoded._id)
      .select("_id fullName email role cnic relationToFamily status")
      .lean();
    
    if (!user) {
      console.log("User not found in database");
      return null;
    }

    console.log("Auth - User fetched from DB:", {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      cnic: user.cnic,
      relationToFamily: user.relationToFamily
    });

    return {
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      cnic: user.cnic || null,
      relationToFamily: user.relationToFamily || null,
      status: user.status || "active"
    };
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
