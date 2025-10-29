import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  // Clear the session cookie
  cookies().set({
    name: "family_assets_session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // Expire immediately
    path: "/",
  });

  // Redirect to login page
  return NextResponse.redirect(new URL("/login", request.url));
}
