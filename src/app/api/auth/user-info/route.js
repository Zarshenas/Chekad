import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import { User } from "@/models/User";
import { hashPassword } from "@/utils/auth";
import { getGravatarUrl } from "@/utils/defaultAvatar";
import * as jose from "jose";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.json(
          { message: "توکنی یافت نشد" },
          { status: 400 }
        );
      }
      const {payload:{userId}} = await jose.jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY));

    await connectDB();


    const userInfo = await User.findById({_id:userId}).select({ password: 0,updatedAt:0 });

    return NextResponse.json(
      { user: userInfo },
      { status: 200 }
    );
    
  } catch (error) {
    if (error.name === 'ValidationError') {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    
    console.error("Error during user creation:", error);
    return NextResponse.json(
      { errors: "خطایی رخ داده است. لطفاً بعداً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
