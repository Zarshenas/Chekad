import { User } from "@/models/User";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req, { params }) => {
  const { followId } = await req.json();
  const { userId } = params;
  try {
    connectDB();
    // Update the user following
    const targetUser = await User.findByIdAndUpdate(
        new mongoose.Types.ObjectId(userId),
      { $addToSet: { following: followId } },
      { new: true }
    );

    // Update the target followers List
    const follower = await User.findByIdAndUpdate(
        new mongoose.Types.ObjectId(followId),
      { $addToSet: { followers: userId } },
      { new: true }
    );
    return NextResponse.json({ targetUser, follower });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
