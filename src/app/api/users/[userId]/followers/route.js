import { User } from "@/models/User";
import connectDB from "@/utils/connectDB";

export const GET = async (req, { params }) => {
  const { userId } = params;
  try {
    connectDB();
    const followersList = await User.findById(userId).populate("followers","username name profileImage");
    return new Response(JSON.stringify( followersList.followers ), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
