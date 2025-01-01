import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
  
    const token = req.cookies.get("token")?.value;
    
  
    if (!token) {
      return NextResponse.json(
        { message: "توکنی یافت نشد" },
        { status: 400 }
      );
    }

  
    const cookieStore = cookies();
    cookieStore.set({
      name: "token",
      value: "",
      path: "/",
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    });

  
    return NextResponse.json(
      { message: "خروج با موفقیت انجام شد" },
      { status: 200 }
    );

  } catch (error) {
  
    console.error("Error during logout:", error);

  
    return NextResponse.json(
      { message: "خطایی رخ داد. لطفا دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
