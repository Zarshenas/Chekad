import { getGravatarUrl } from "@/utils/defaultAvatar";
import { NextResponse } from "next/server";

export function GET(req) {
  return NextResponse.json({ message: "Hi" }, { status: 200 });
}
