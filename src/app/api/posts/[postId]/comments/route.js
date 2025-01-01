import { Comment } from "@/models/Comment";
import connectDB from "@/utils/connectDB";
import { toShamsi } from "@/utils/toShamsi";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  const { postId } = params;

  try {
    await connectDB();
    const commentsList = await Comment.find({ postId }).populate(
      "userId",
      "username profileImage"
    );

    return NextResponse.json(toShamsi(commentsList), { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "خطایی در بازیابی نظرات رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
};

export async function POST(req, { params }) {
  const userId = req.headers.get("x-user-id");
  const { postId } = params;

  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "متن نظر الزامی است." },
        { status: 400 }
      );
    }

    await connectDB();
    const newComment = await Comment.create({
      userId: new mongoose.Types.ObjectId(userId),
      postId: new mongoose.Types.ObjectId(postId),
      commentText: content,
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "خطایی در ثبت نظر رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}

export const PUT = async (req) => {
  try {
    const { commentId, newCommentText } = await req.json();

    if (!commentId || !newCommentText) {
      return NextResponse.json(
        { error: "آیدی نظر و متن جدید الزامی هستند." },
        { status: 400 }
      );
    }

    await connectDB();
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { $set: { commentText: newCommentText } },
      { new: true }
    );

    if (!updatedComment) {
      return NextResponse.json(
        { error: "نظر مورد نظر یافت نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "خطایی در ویرایش نظر رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
};

export const DELETE = async (req) => {
  try {
    const { commentId } = await req.json();

    if (!commentId) {
      return NextResponse.json(
        { error: "آیدی نظر الزامی است." },
        { status: 400 }
      );
    }

    await connectDB();
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return NextResponse.json(
        { error: "نظر مورد نظر یافت نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "نظر با موفقیت حذف شد." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "خطایی در حذف نظر رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
};
