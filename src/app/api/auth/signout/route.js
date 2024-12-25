import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  let token = req.cookies.get("token")?.value;
  const cookieStore = cookies();
  if (token) {
    // Remove the token cookie
    cookieStore.set({
      name: "token",
      value: "",
      path: "/",
      httpOnly: true,
      secure: true,
      expires: new Date(0), // Expire immediately
    });
    return new Response(
      JSON.stringify({ message: "Logged out successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return NextResponse.json({ message: "No token found" }, { status: 400 });
}
