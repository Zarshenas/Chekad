import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// async function moveFilesToPostFolder(userId, postId) {
//   try {
//     // Search for all files in the drafts folder
//     const folderPath = `chekad-project/users/${userId}/drafts/`;
//     const files = await cloudinary.search
//       .expression(`folder:${folderPath}*`) // Search files in the folder
//       .execute();

//     if (files.resources.length === 0) {
//       console.log("No files found in drafts folder.");
//       return;
//     }

//     // Loop through each file and move it to the post folder
//     for (const file of files.resources) {
//       const draftPublicId = file.public_id; // Get the current file's public_id
//       const fileName = draftPublicId.split("/").pop(); // Extract the file name
//       console.log("Name",fileName);
//       console.log("Draft",draftPublicId);
//       // console.log(`Moving file: ${draftPublicId} to ${fileName}`);
//       const targetPublicId = `chekad-project/users/${userId}/posts/post-${postId}`;
//       console.log("Target",targetPublicId);
//       // Move the file using Cloudinary's rename API
//       const result = await cloudinary.uploader.rename(
//         draftPublicId,
//         targetPublicId
//       );
//       // console.log(`Result of moving file ${draftPublicId}:`, result);
//       const newFileUrl = cloudinary.url(result.public_id);
//       cloudinary.uploader.destroy(draftPublicId, (error, result) => {
//         if (error) {
//           console.error("Error deleting draft file:", error);
//         } else {
//           console.log("Draft file deleted:", result);
//         }
//       });
//     }

//     console.log("All files moved successfully.");
//   } catch (error) {
//     console.error("Error moving files:", error);
//   }
// }

export { cloudinary };
