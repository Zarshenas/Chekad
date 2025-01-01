import { Post } from "@/models/Post";
import connectDB from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Readable } from "stream";
import { cloudinary } from "@/utils/cloudinary";
import { toShamsi } from "@/utils/toShamsi";


// GET a single post by ID
export const GET = async (req, { params }) => {
  const { postId } = params;

  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { error: "آیدی پست معتبر نیست." },
        { status: 400 }
      );
    }

    await connectDB();
    const fetchedPost = await Post.findById(
      postId
    );

    if (!fetchedPost) {
      return NextResponse.json(
        { error: "پست مورد نظر یافت نشد." },
        { status: 404 }
      );
    }
    //sending the post with shamsi date
    const formatDate= toShamsi([fetchedPost]);

    return NextResponse.json({ post:formatDate[0] }, { status: 200 });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "خطایی در بازیابی پست رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
};

export const DELETE = async (req, { params }) => {
  const { postId } = params;

  try {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return NextResponse.json(
        { error: "آیدی پست معتبر نیست." },
        { status: 400 }
      );
    }

    await connectDB();
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return NextResponse.json(
        { error: "پست مورد نظر برای حذف یافت نشد." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "پست با موفقیت حذف شد.", post: deletedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "خطایی در حذف پست رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
};

export const PATCH = async (req, { params }) => {
  const { postId } = params;
  const userId = req.headers.get("x-user-id");
  const postsFolder = `chekad-project/users/${userId}/posts`;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(postId)
    ) {
      return NextResponse.json(
        { error: "اطلاعات کاربر یا پست نامعتبر است." },
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

    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json(
        { error: "پست موردنظر پیدا نشد." },
        { status: 404 }
      );
    }

    if (String(post.userId) !== userId) {
      return NextResponse.json(
        { error: "شما مجاز به ویرایش این پست نیستید." },
        { status: 403 }
      );
    }

    const updatedFiles = await Promise.all(
      files.map(async (file) => {
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
    let imageUrl = post.imageUrl;
    if (image) {
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
      imageUrl = imageUploadResult.secure_url;
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = tags.length ? tags : post.tags;
    post.files = updatedFiles.length ? updatedFiles : post.files;
    post.imageUrl = imageUrl;

    await post.save();

    return NextResponse.json(
      { message: "پست با موفقیت ویرایش شد.", post },
      { status: 200 }
    );
  }  catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "خطایی در ویرایش پست رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 400 }
    );
  }
};
