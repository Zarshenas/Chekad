import { Comment } from "@/models/Comment";
import connectDB from "@/utils/connectDB";

export const GET = async (req, { params }) => {
  const { postId } = params;
  try {
    connectDB();
    const commentsList = await Comment.find({postId}).populate("userId" , "username profileImage");
    return new Response(JSON.stringify(commentsList), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

