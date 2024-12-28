import { newPostSchema } from "@/helpers/validation/newPostSchema";
import { Post } from "@/models/Post";
import { cloudinary } from "@/utils/cloudinary";
import connectDB from "@/utils/connectDB";
import { withMulter } from "@/utils/multer";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export const GET = async (req, { params }) => {
  const { userId } = params;

  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "آیدی وارد شده معتبر نیست." },
        { status: 400 }
      );
    }

    const userPosts = await Post.find({ userId: new mongoose.Types.ObjectId(userId) });

    return NextResponse.json({ posts: userPosts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "خطایی در بازیابی پست‌ها رخ داد." },
      { status: 500 }
    );
  }
};

export const POST = withMulter(async (req) => {
  const userId = req.headers.get("x-user-id");
  const postsFolder = `chekad-project/users/${userId}/posts`;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "شما احراز هویت نشده‌اید." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const tags = formData.getAll("tags");
    const files = formData.getAll("files");
    const image = formData.get("image");

    await connectDB();

    const validatedPost = await newPostSchema.validate({
      userId,
      title,
      content,
      tags,
      files,
      image,
    });

    const fileUrls = await Promise.all(
      validatedPost.files.map(async (file) => {
        const readableStream = Readable.from(file.stream());
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: postsFolder, public_id: `${file.name.split(".")[0]}` },
            (error, result) => {
              if (error) reject(error);
              resolve(result);
            }
          );
          readableStream.pipe(uploadStream);
        });

        return {
          filename: file.name,
          size: file.size,
          fileType: file.type,
          url: uploadResult.secure_url,
        };
      })
    );

    const imageStream = Readable.from(image.stream());
    const imageUploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: postsFolder, public_id: `${image.name.split(".")[0]}` },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );
      imageStream.pipe(uploadStream);
    });

    const newPost = await Post.create({
      ...validatedPost,
      userId: new mongoose.Types.ObjectId(userId),
      imageUrl: imageUploadResult.secure_url,
      files: fileUrls,
    });

    return NextResponse.json(
      { message: "پست با موفقیت ایجاد شد.", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "خطایی در ایجاد پست رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 400 }
    );
  }
});
