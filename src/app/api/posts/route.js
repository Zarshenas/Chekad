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
        { status: 500 } // Changed to 500 for server errors
      );
    }
  } else {
    const keyword = searchParams.get("keyword"); // Keyword to search in title/content
    const tags = searchParams.getAll("tags"); // Tags to filter posts
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1); // Ensure page is at least 1
    const limit = Math.max(1, parseInt(searchParams.get("limit")) || 10); // Ensure limit is at least 1

    try {
      await connectDB();

      const filter = {};
      
      // Filter by keyword in title or content
      if (keyword) {
        const sanitizedKeyword = keyword.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&'); // Simple regex escape
        filter.$or = [
          { title: { $regex: sanitizedKeyword, $options: "i" } }, // Case-insensitive match
          { content: { $regex: sanitizedKeyword, $options: "i" } },
        ];
      }

      // Filter by tags (must match all provided tags)
      if (tags.length > 0) {
        filter.tags = { $all: tags };
      }
      // Pagination and sorting
      const skip = (page - 1) * limit;

      const posts = await Post.find(filter)
        .sort({ createdAt: -1 }) // Sort by newest posts
        .skip(skip)
        .limit(limit);
      
      const totalPosts = await Post.countDocuments(filter); // Total matching posts for pagination

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
        { status: 500 } // Changed to 500 for server errors
      );
    }
  }
};
