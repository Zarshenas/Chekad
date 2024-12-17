import  { models, model, Schema } from "mongoose";
const postSchema = new Schema(
  {
    userId: {
      // type: String, 
        type: Schema.Types.ObjectId, 
      ref: "User",// Reference to the User model
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 255,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [String], // Array of tags for categorization
    links: [String], // Array of tags for categorization
    likes: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);
export const Post = models.Post || model("Post",postSchema);