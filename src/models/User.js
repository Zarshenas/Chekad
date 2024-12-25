import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    username: { type: String, unique: true, require: true },
    name: { type: String, default: () => "" },
    password: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    bio: { type: String, default: () => "" },
    profileImage: { type: String, default: () => "" },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const User = models.User || model("User", userSchema);
