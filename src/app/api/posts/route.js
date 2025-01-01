import { Post } from "@/models/Post";
import connectDB from "@/utils/connectDB";
import { toShamsi } from "@/utils/toShamsi";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  // checking if the request has params or not
  if (!searchParams.size) {
    try {
      await connectDB();
      const fetchAllPosts = await Post.find();
      //returning all posts with shmasi dates
      return NextResponse.json({ posts: toShamsi(fetchAllPosts) }, { status: 200 });
    } catch (error) {
      console.error("Error fetching posts:", error);
      return NextResponse.json(
        { error: "خطایی در بازیابی پست‌ها رخ داد. لطفاً دوباره تلاش کنید." },
        { status: 500 } 
      );
    }
  } else {
    const keyword = searchParams.get("keyword");
    const tags = searchParams.getAll("tags"); 
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1); 
    const limit = Math.max(1, parseInt(searchParams.get("limit")) || 10); 

    try {
      await connectDB();

      const filter = {};
      
      
      if (keyword) {
        const sanitizedKeyword = keyword.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&'); 
        filter.$or = [
          { title: { $regex: sanitizedKeyword, $options: "i" } }, 
          { content: { $regex: sanitizedKeyword, $options: "i" } },
        ];
      }

      
      if (tags.length > 0) {
        filter.tags = { $all: tags };
      }
      
      const skip = (page - 1) * limit;

      const posts = await Post.find(filter)
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(limit);
      
      const totalPosts = await Post.countDocuments(filter); 

      return NextResponse.json(
        {
          posts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching posts:", error);
      return NextResponse.json(
        { error: "خطایی در دریافت پست‌ها رخ داد. لطفاً دوباره تلاش کنید." },
        { status: 500 } 
      );
    }
  }
};
