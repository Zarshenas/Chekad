import { Post } from "@/models/Post";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET =async (req) => {
  try {
    connectDB();
    const fetchAllPosts = await Post.find()
      .then((data) => data)
      .catch((error) => {
        throw new Error("couldn't retrieve posts");
      });
      return NextResponse.json({ post:fetchAllPosts }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
};