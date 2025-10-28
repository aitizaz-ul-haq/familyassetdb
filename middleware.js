import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }
  
  // Check for session cookie
  const token = request.cookies.get("family_assets_session");
  
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
