import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "./uploads", // Temporary directory for uploaded files
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

export const uploadMiddleware = upload.single("profilePicture");

// Wrapper for Next.js API routes
export const withMulter = (handler) => async (req, res) => {
  await new Promise((resolve, reject) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  return handler(req, res);
};
