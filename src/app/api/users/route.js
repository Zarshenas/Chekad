import { User } from "@/models/User";
import { verifyToken } from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  const token = req.cookies.get("token");

  if (!token) {
    return new Response(
      JSON.stringify({ status: "failed", message: "وارد نشده‌اید" }),
      { status: 401 }
    );
  }

  try {
    const result = verifyToken(token.value, process.env.SECRET_KEY);

    if (!result) {
      return new Response(
        JSON.stringify({ status: "failed", message: "مجاز نیستید" }), 
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({ status: "success", data: result }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying token:", error);
    return new Response(
      JSON.stringify({ status: "failed", message: "خطای داخلی سرور" }), // Internal server error
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const userId = req.headers.get("x-user-id");

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json(
      { status: "failed", message: "شناسه کاربر معتبر یا موجود نیست" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const deletionResult = await User.deleteOne({
      _id: new mongoose.Types.ObjectId(userId),
    });

    if (deletionResult.deletedCount === 0) {
      return NextResponse.json(
        { status: "failed", message: "کاربر یافت نشد" }, // User not found
        { status: 404 }
      );
    }

    console.log("User deleted successfully:", userId);

    return NextResponse.json(
      { status: "success", message: "کاربر حذف شد" }, // User deleted
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { status: "failed", message: "خطای داخلی سرور" }, // Internal server error
      { status: 500 }
    );
  }
}
