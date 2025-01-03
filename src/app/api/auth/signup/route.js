import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import { User } from "@/models/User";
import signupSchema from "@/helpers/validation/signupSchema";
import { hashPassword } from "@/utils/auth";
import { getGravatarUrl } from "@/utils/defaultAvatar";

export async function POST(req) {
  try {
    const data = await req.json();

    // Validate the user data
    const validatedUser = await signupSchema.validate(data);
    const { username, email, password } = validatedUser;

    await connectDB();

    // Hash the password
    const hashedPass = await hashPassword(password);

    // Create a default avatar based on the email
    const defaultAvatar = getGravatarUrl(email);

    await User.create({
      username,
      email,
      password: hashedPass,
      profileImage: defaultAvatar,
    });

    return NextResponse.json(
      { message: ".کاربر با موفقیت ایجاد شد" },
      { status: 201 }
    );
    
  } catch (error) {
    if (error.name === 'ValidationError') {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        { errors: `${duplicateField} قبلاً استفاده شده است. لطفاً فیلد دیگری انتخاب کنید.` },
        { status: 400 }
      );
    }

    
    console.error("Error during user creation:", error);
    return NextResponse.json(
      { errors: "خطایی رخ داده است. لطفاً بعداً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
