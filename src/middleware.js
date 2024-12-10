import { NextResponse } from "next/server";
import * as jose from 'jose';
import { verify } from "jsonwebtoken";

export async function middleware(req) {
  const excludedPaths = ["/api/auth/"];
  const { pathname } = req.nextUrl;

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
    response.headers.set("x-user-email", result.email);
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
  matcher: ["/:path*"], // Apply middleware to all routes
};
