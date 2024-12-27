import { Comment } from "@/models/Comment";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  const { postId } = params;
  try {
    connectDB();
    const commentsList = await Comment.find({ postId }).populate(
      "userId",
      "username profileImage"
    );
    return new Response(JSON.stringify(commentsList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};


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
      commentText: content,
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export const PUT = async (req, res) => {
  const { commentId, newCommentText } = await req.json();
  try {
    connectDB();
    const updatedCommnet = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { commentText: newCommentText } },
      { new: true }
    );
    if (!updatedCommnet) {
      return NextResponse.json({message:"comment not found"}, { status: 404 });
    }
    return NextResponse.json(updatedCommnet, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  const { commentId } = await req.json();
  try {
    connectDB();
    const deletedComment = await Comment.findByIdAndDelete(commentId, { new: true })
      .then((deletedComment) => deletedComment)
      .catch((error) => {
        throw new Error(error);
      });
    return NextResponse.json(deletedComment, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};