import { newPostSchema } from "@/helpers/validation/newPostSchema";
import { Post } from "@/models/Post";
import { cloudinary, moveFilesToPostFolder } from "@/utils/cloudinary";
import connectDB from "@/utils/connectDB";
import { withMulter } from "@/utils/multer";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export const GET = (req, res) => {
  const userId = req.headers.get("x-user-id");
  return new Response(
    JSON.stringify({ message: "Here U will get all of your posts later" }),
    { status: 200 }
  );
};
export const POST = withMulter(async (req, res) => {
  const userId = req.headers.get("x-user-id");
  const postsFolder = `chekad-project/users/${userId}/posts`;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return new Response(JSON.stringify({ error: "Not Authenticated" }), {
      status: 401,
    });
  }
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const content = formData.get("content");
    const tags = formData.getAll("tags");
    const files = formData.getAll("files");
    const image = formData.get("image");
    console.log(files);
    //   Connect to the database
    await connectDB();
    
    const validatedPost = await newPostSchema
    .validate({
      userId,
      title,
      content,
      tags,
      files,
      image,
    })
    .then((data) => data)
    .catch((error) => {
      return error;
    });
    console.log(validatedPost);
    const fileUrl = await Promise.all(
      validatedPost.files.map(async (file) => {
        // Create a Readable stream from the file
        const readableStream = Readable.from(file.stream());
        // Upload the file to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            // { folder: `user_${userId}_POSTS_FILES`, public_id: `${file.name}` },
            { folder: postsFolder, public_id: `${file.name.split(".")[0]}` },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          readableStream.pipe(uploadStream); // Pipe the stream to Cloudinary
        });
        return {
          filename: file.name,
          size: file.size,
          fileType: file.type,
          url: uploadResult.secure_url,
        };
      })
    );
    
    // Create a Readable stream from the file
    const readableStream = Readable.from(image.stream());
    // Upload the file to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `${postsFolder}`, public_id: `${image.name.split(".")[0]}` },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      readableStream.pipe(uploadStream); // Pipe the stream to Cloudinary
    });
    
    // console.log(uploadResult.secure_url);
    const newPost = await Post.create({
      ...validatedPost,
      userId: new mongoose.Types.ObjectId(userId),
      imageUrl: uploadResult.secure_url,
      files: fileUrl,
    }).then((newPost) => newPost);
    if (newPost) {
      return new Response(JSON.stringify({ message: "Post created" }), {
        status: 201,
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ errors: error }, { status: 400 });
  }
});
