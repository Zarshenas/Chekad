import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Retrieve the token from cookies
    const token = req.cookies.get("token")?.value;
    
    // Check if the token exists
    if (!token) {
      return NextResponse.json(
        { message: "توکنی یافت نشد" },
        { status: 400 }
      );
    }

    // If token exists, remove it
    const cookieStore = cookies();
    cookieStore.set({
      name: "token",
      value: "",
      path: "/",
      httpOnly: true,
      secure: true,
      expires: new Date(0), // Expire immediately
    });

    // Return success response
    return NextResponse.json(
      { message: "خروج با موفقیت انجام شد" },
      { status: 200 }
    );

  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error during logout:", error);

    // Return error response
    return NextResponse.json(
      { message: "خطایی رخ داد. لطفا دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
