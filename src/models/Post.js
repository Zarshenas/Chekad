import { models, model, Schema } from "mongoose";

const fileSchema = new Schema({
  url: { type: String, required: true }, // URL of the uploaded file
  filename: { type: String, required: true }, // Original filename
  fileType: { type: String, required: true }, // File MIME type, e.g., "application/pdf"
  size: { type: Number, required: true }, // File size in bytes
});

const postSchema = new Schema(
  {
    userId: {
      // type: String,
      type: Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
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
    tags: [String], // Array of tags for categorization
    links: [String], // Array of tags for categorization
    likes: {
      type: Number,
      default: 0,
    },
    files: [fileSchema], // Array of attached files
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Post = models.Post || model("Post", postSchema);
