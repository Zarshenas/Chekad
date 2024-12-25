import { models, model, Schema } from "mongoose";


const commentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    commentText: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export const Comment = models.Comment || model("Comment", commentSchema);