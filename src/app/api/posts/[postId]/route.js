import { Post } from "@/models/Post";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// GET a single post by ID
export const GET = async (req, { params }) => {
  const { postId } = params;

  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { error: "آیدی پست معتبر نیست." },
        { status: 400 }
      );
    }

    await connectDB();
    const fetchedPost = await Post.findById(new mongoose.Types.ObjectId(postId));

    if (!fetchedPost) {
      return NextResponse.json(
        { error: "پست مورد نظر یافت نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json({ post: fetchedPost }, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "خطایی در بازیابی پست رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
};

// DELETE a post by ID
export const DELETE = async (req, { params }) => {
  const { postId } = params;

  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { error: "آیدی پست معتبر نیست." },
        { status: 400 }
      );
    }

    await connectDB();
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return NextResponse.json(
        { error: "پست مورد نظر برای حذف یافت نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "پست با موفقیت حذف شد.", post: deletedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "خطایی در حذف پست رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
};
