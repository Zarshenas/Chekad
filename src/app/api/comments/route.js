import { Comment } from "@/models/Comment";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  const userId = req.headers.get("x-user-id");

  const { postId } = params;
  const { content } = await req.json();

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  try {
    connectDB();
    const newComment = await Comment.create({
        userId: new mongoose.Types.ObjectId(userId),
        postId: new mongoose.Types.ObjectId(postId),
        commentText:content,
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}