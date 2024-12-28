import { User } from "@/models/User";
import { verifyToken } from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// GET: Verify Token and Return User Info
export async function GET(req) {
  const token = req.cookies.get("token");

  // Token not found, return unauthorized error
  if (!token) {
    return new Response(
      JSON.stringify({ status: "failed", message: "وارد نشده‌اید" }), // Not logged in
      { status: 401 }
    );
  }

  try {
    const result = verifyToken(token.value, process.env.SECRET_KEY);

    // If token is invalid, return unauthorized error
    if (!result) {
      return new Response(
        JSON.stringify({ status: "failed", message: "مجاز نیستید" }), // Not authorized
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({ status: "success", data: result }),
      { status: 200 }
    );
  } catch (error) {
    // General error handling
    console.error("Error verifying token:", error);
    return new Response(
      JSON.stringify({ status: "failed", message: "خطای داخلی سرور" }), // Internal server error
      { status: 500 }
    );
  }
}

// DELETE: Delete a User by ID
export async function DELETE(req) {
  const userId = req.headers.get("x-user-id");

  // If userId is not provided or invalid, return error
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

    // If no user was deleted, return a "not found" error
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
    // Handle any errors that occur during the deletion process
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { status: "failed", message: "خطای داخلی سرور" }, // Internal server error
      { status: 500 }
    );
  }
}
