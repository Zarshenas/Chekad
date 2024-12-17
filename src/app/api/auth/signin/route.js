import signinSchema from "@/helpers/validation/signinSchema";
import { User } from "@/models/User";
import { verifyPassword } from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, password } = await req.json();
  const validatedInfo = signinSchema
    .validate({ email, password })
    .catch((error) => {
      return error;
    });

  if (validatedInfo.errors) {
    return NextResponse.json({ errors: validatedInfo.errors }, { status: 400 });
  }

  try {
    connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "user not found!" }, { status: 404 });
    }

    if (!(await verifyPassword(user.password, password))) {
      return NextResponse.json({ error: "Wrong Password" }, { status: 400 });
    }
    console.log(user._id);
    const token = sign({ userId: user._id.toString() }, process.env.SECRET_KEY, {
      expiresIn: 24 * 60 * 60,
    });
    const seralized = serialize("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return new Response(JSON.stringify({ message: "login success full" }), {
        status: 200,
        headers: { "Set-Cookie": seralized },
      });
  } catch (error) {
    return NextResponse.json({ errors: error }, { status: 400 });
  }
}
