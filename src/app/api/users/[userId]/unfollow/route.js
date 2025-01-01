import { User } from "@/models/User";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req, { params }) => {
  try {
    await connectDB();

    const { unFollowId } = await req.json();
    const { userId } = params;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(unFollowId)) {
      return NextResponse.json(
        { error: "شناسه‌های وارد شده معتبر نیستند." },
        { status: 400 }
      );
    }

    const targetUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { following: unFollowId } },
      { new: true }
    );

    if (!targetUser) {
      return NextResponse.json(
        { error: "کاربر مورد نظر پیدا نشد." },
        { status: 404 }
      );
    }

    // Update the unfollowed user's followers list
    const follower = await User.findByIdAndUpdate(
      unFollowId,
      { $pull: { followers: userId } },
      { new: true }
    );

    if (!follower) {
      return NextResponse.json(
        { error: "کاربر دنبال شده پیدا نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "دنبال نکردن با موفقیت انجام شد.", targetUser, follower },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during unfollow operation:", error);
    return NextResponse.json(
      { error: "خطایی رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
};
