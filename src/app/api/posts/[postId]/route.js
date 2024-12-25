import { Post } from "@/models/Post";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  const { postId } = params;
  try {
    connectDB();
    const fetchedPost = await Post.findById(new mongoose.Types.ObjectId(postId))
      .then((data) => data)
      .catch((error) => {
        throw new Error("couldn't retrieve post");
        
      });
      return NextResponse.json({ post:fetchedPost }, { status: 200 });
    console.log(fetchedPost);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
