import { User } from "@/models/User";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req, { params }) => {
  try {
    await connectDB();

    const { followId } = await req.json();
    const { userId } = params;

    // Validate userId and followId as ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(followId)) {
      return NextResponse.json(
        { error: "آیدی‌های وارد شده معتبر نیستند." },
        { status: 400 }
      );
    }

    // Update the user's following list
    const targetUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { following: followId } },
      { new: true }
    );

    if (!targetUser) {
      return NextResponse.json(
        { error: "کاربر هدف یافت نشد." },
        { status: 404 }
      );
    }

    // Update the target user's followers list
    const follower = await User.findByIdAndUpdate(
      followId,
      { $addToSet: { followers: userId } },
      { new: true }
    );

    if (!follower) {
      return NextResponse.json(
        { error: "کاربری که باید دنبال شود، یافت نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "عملیات دنبال کردن با موفقیت انجام شد.",
        targetUser,
        follower,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in follow operation:", error);
    return NextResponse.json(
      { error: "خطایی در انجام عملیات رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
};
