import { Post } from "@/models/Post";
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    await connectDB();
    const fetchAllPosts = await Post.find();

    return NextResponse.json({ posts: fetchAllPosts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "خطایی در بازیابی پست‌ها رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
};
