import signinSchema from "@/helpers/validation/signinSchema";
import { User } from "@/models/User";
import { verifyPassword } from "@/utils/auth";
import connectDB from "@/utils/connectDB";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";
import { NextResponse } from "next/server";

const expiration = 60 * 60; // 1 hour

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    await signinSchema.validate({ email, password });
  } catch (validationError) {
    return NextResponse.json(
      { errors: validationError.errors || validationError.message },
      { status: 400 }
    );
  }

  try {
    await connectDB();
  } catch (dbError) {
    return NextResponse.json(
      { error: "خطا در اتصال به پایگاه داده. لطفاً بعداً دوباره تلاش کنید." },
      { status: 500 }
    );
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`کاربری با ایمیل ${email} یافت نشد.`);
      return NextResponse.json({ message: "ایمیل یا رمز عبور نامعتبر است." }, { status: 400 });
    }

    const isPasswordValid = await verifyPassword(user.password, password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "ایمیل یا رمز عبور نامعتبر است." }, { status: 400 });
    }

    const token = sign({ userId: user._id.toString() }, process.env.SECRET_KEY, {
      expiresIn: expiration,
    });

    const serialized = serialize("token", token, {
      httpOnly: true,
      maxAge: expiration,
      path: "/",
    });

    return new Response(
      JSON.stringify({ message: "ورود با موفقیت انجام شد." , access:token }),
      {
        status: 200,
        headers: { "Set-Cookie": serialized },
      }
    );
  } catch (error) {
    return NextResponse.json({ errors: error.message }, { status: 500 });
  }
}