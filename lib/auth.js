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
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME);
  
  if (!token) {
    return null;
  }
  
  const payload = verifyJWT(token.value);
  if (!payload) {
    return null;
  }
  
  try {
    await connectDB();
    const user = await User.findById(payload._id).select("-passwordHash");
    
    if (!user) {
      return null;
    }
    
    return {
      _id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}
