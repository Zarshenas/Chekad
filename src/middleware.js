import { NextResponse } from "next/server";
import * as jose from "jose";
import { redirect } from 'next/navigation'

export async function middleware(req ) {
  const url = req.nextUrl.clone();
  const excludedPaths = new Set(["/api/auth/signin", "/api/auth/signup", "/"]);
  const protectedRoutes = new Set([
    "/api/user/post",
    "/api/user/update-profile",
  ]);
  const { pathname } = req.nextUrl;
  let token = req.cookies.get("token")?.value;

  // Skip middleware for excluded paths
  if (excludedPaths.has(pathname)) {
    return NextResponse.next();
  }

  // If accessing a protected route without a token, redirect to signin
  if (protectedRoutes.has(pathname) && !token) {
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  // Redirect to login if no token is provided
  if (!token) {
    url.pathname = '/signin';
    return NextResponse.redirect(url);
  }

  try {
    // Verify the token using jwtVerify
    const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY));

    // Attach the userId to the response headers
    const response = NextResponse.next();
    response.headers.set("x-user-id", payload.userId);

    return response;
  } catch (error) {
    console.error("Invalid token:", error.message);
    // Redirect to login if the token is invalid
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }
}

export const config = {
  matcher: [
    "/api/:path*", // Apply middleware to all API routes
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
      has: [{ type: "header", key: "x-present" }],
      missing: [{ type: "header", key: "x-missing", value: "prefetch" }],
    },
  ],
};
