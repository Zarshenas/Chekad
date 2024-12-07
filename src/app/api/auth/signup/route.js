import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import { User } from "@/models/User";
import signupSchema from "@/helpers/validation/signupSchema";
import { hashPassword } from "@/utils/auth";

export async function POST(req) {
  const data = await req.json();

  const validatedUser = await signupSchema
    .validate(data)
    .then(({ username, email, password }) => {
      return { username, email, password };
    })
    .catch((error) => {
      return error;
    });

  //checking id the user data had any errors to send right response
  if (validatedUser.errors) {
    return NextResponse.json({ errors: validatedUser.errors }, { status: 400 });
  }

  try {
    await connectDB();
    //hashing the password to store it in db
    const hashedPass = await hashPassword(validatedUser.password);

    await User.create({ ...validatedUser, password: hashedPass });

    return NextResponse.json({ message: "user created." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { errors: `${Object.keys(error.keyValue)} is duplicated` },
      { status: 400 }
    );
  }
}