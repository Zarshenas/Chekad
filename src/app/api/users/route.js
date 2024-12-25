import { User } from "@/models/User";
import { verifyToken } from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export function GET(req) {
  const token = req.cookies.get("token");
  if (!token) {
    return new Response(
      JSON.stringify({ status: "faild", message: "not logged in" }),
      { status: 401 }
    );
  }
  const result = verifyToken(token.value, process.env.SECRET_KEY);
  if (!result) {
    return new Response(
      JSON.stringify({ status: "faild", message: "not authorized" }),
      { status: 401 }
    );
  }
  return new Response(JSON.stringify({ status: "success", data: result }), {
    status: 200,
  });
}

export function DELETE(req) {
  const userId = req.headers.get("x-user-id");
  try {
    connectDB();
    User.deleteOne({ _id: new mongoose.Types.ObjectId(userId)}).then(()=>console.log("user deleted!!!"))
    return NextResponse.json({ message: "user deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
