import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import userInfoSchema from "@/helpers/validation/userInfoSchema";
import cloudinary from "@/utils/cloudinary";
import { withMulter } from "@/utils/multer";
import { Readable } from "stream";
import { User } from "@/models/User";

export const GET = (req, res) => {
  const userEmail = req.headers.get("x-user-email");
  return new Response(JSON.stringify({ message: "salll" }), { status: 200 });
};

export const PUT = withMulter(async (req, res) => {
  const userEmail = req.headers.get("x-user-email");
  try {
    const formData = await req.formData();
    const profilePicture = formData.get("profilePicture");
    const bio = formData.get("bio");
    const name = formData.get("name");

    //   Connect to the database
    await connectDB();

    const validatedInfo = await userInfoSchema
      .validate({ profilePicture, bio, name })
      .then((data) => data)
      .catch((error) => {
        return error;
      });
    if (validatedInfo.errors) {
      return NextResponse.json(
        { errors: validatedInfo.errors },
        { status: 400 }
      );
    }
    // Create a Readable stream from the file
    const readableStream = Readable.from(profilePicture.stream());

    // Upload the file to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "profile_pictures" }, // Optional folder in Cloudinary
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      readableStream.pipe(uploadStream); // Pipe the stream to Cloudinary
    });

    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { profileImage: uploadResult.secure_url },
      { new: true }
    );
    console.log(user);

    return new Response(JSON.stringify({ imageUrl: uploadResult.secure_url }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
});
