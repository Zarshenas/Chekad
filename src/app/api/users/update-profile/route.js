import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import userInfoSchema from "@/helpers/validation/userInfoSchema";
import { cloudinary } from "@/utils/cloudinary";
import { withMulter } from "@/utils/multer";
import { Readable } from "stream";
import { User } from "@/models/User";

export const PUT = withMulter(async (req) => {
  const userId = req.headers.get("x-user-id");
  const profileFolder = `chekad-project/users/${userId}/profilePic`;

  if (!userId) {
    return NextResponse.json(
      { error: "شناسه کاربر یافت نشد." },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const profilePicture = formData.get("profilePicture");
    const bio = formData.get("bio");
    const name = formData.get("name");

    // Validate user input
    const { error: validationError, value: validatedInfo } = userInfoSchema.validate(
      { profilePicture, bio, name }
    );

    if (validationError) {
      return NextResponse.json(
        { error: "اطلاعات وارد شده معتبر نیست.", details: validationError.details },
        { status: 400 }
      );
    }

    await connectDB();

    // Upload profile picture to Cloudinary
    let profileImageUrl = null;
    if (profilePicture) {
      const readableStream = Readable.from(profilePicture.stream());
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: profileFolder, public_id: `user_${userId}` },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        readableStream.pipe(uploadStream);
      });

      profileImageUrl = uploadResult.secure_url;
    }

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(validatedInfo.bio && { bio: validatedInfo.bio }),
        ...(validatedInfo.name && { name: validatedInfo.name }),
        ...(profileImageUrl && { profileImage: profileImageUrl }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "کاربر یافت نشد یا بروزرسانی انجام نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "اطلاعات کاربر با موفقیت بروزرسانی شد.", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "خطایی رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
});
