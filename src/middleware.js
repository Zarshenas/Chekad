import { NextResponse } from "next/server";
import * as jose from "jose";
import { verify } from "jsonwebtoken";

export async function middleware(req) {
  const excludedPaths = ["/api/auth/"];
  const { pathname } = req.nextUrl;
  if (pathname === "/") {
    return NextResponse.next(); // Skip middleware for excluded paths
  }
  
  if (excludedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next(); // Skip middleware for excluded paths
  }
  let token = req.cookies.get("token");
  if (!token) {
    // Redirect to login if no token is provided
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }
  
  try {
    // Verify the token
    const result = jose.decodeJwt(token.value);
    // Attach the email to header
    const response = NextResponse.next();
    response.headers.set("x-user-id", result.userId);
    return response;
  } catch (error) {
    console.error("Invalid token:", error.message);
    // Redirect to login if the token is invalid
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }
}

// export const config = {
//   matcher: ["/user"], // Protect specific routes
// };

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
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
  // matcher: ["/:path*"], // Apply middleware to all routes
};
