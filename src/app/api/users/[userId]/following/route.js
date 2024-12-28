import { User } from "@/models/User";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  const { userId } = params;

  try {
    await connectDB();

    // Validate userId as a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "آیدی وارد شده معتبر نیست." },
        { status: 400 }
      );
    }

    // Fetch the user's following list
    const user = await User.findById(userId).populate(
      "following",
      "username name profileImage"
    );

    if (!user) {
      return NextResponse.json(
        { error: "کاربر مورد نظر یافت نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { following: user.following },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching following list:", error);
    return NextResponse.json(
      { error: "خطایی در بازیابی لیست دنبال‌شوندگان رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
};
