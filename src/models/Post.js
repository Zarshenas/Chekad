import { models, model, Schema } from "mongoose";

const fileSchema = new Schema({
  url: { type: String, required: true }, 
  filename: { type: String, required: true }, 
  fileType: { type: String, required: true }, 
  size: { type: Number, required: true },
});

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [String], 
    links: [String], 
    likes: {
      type: Number,
      default: 0,
    },
    files: [fileSchema],
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Post = models.Post || model("Post", postSchema);
