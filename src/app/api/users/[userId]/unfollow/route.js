import { User } from "@/models/User";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req, { params }) => {
  const { unFollowId } = await req.json();
  const { userId } = params;
  try {
    connectDB();
    // Update the user following
    const targetUser = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId),
      { $pull: { following: unFollowId } },
      { new: true }
    ).catch((error) => {
        console.log(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      });

    // Update the target followers List
    const follower = await User.findByIdAndUpdate(
      new mongoose.Types.ObjectId(unFollowId),
      { $pull: { followers: userId } },
      { new: true }
    ).catch((error) => {
      console.log(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    });
    return NextResponse.json({ targetUser, follower } , {status: 200});
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
