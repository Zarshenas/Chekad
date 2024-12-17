import * as Yup from "yup";

const SUPPORTED_IMAGE_FORMATS = ["image/jpeg", "image/png"];
const SUPPORTED_FILE_FORMATS = ["application/pdf", "application/epub+zip"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Validation for fileSchema
// const fileValidationSchema = Yup.object().shape({
//   filename: Yup.string()
//     .required("Filename is required")
//     .max(255, "Filename cannot exceed 255 characters"),
//   fileType: Yup.string()
//     .required("File type is required")
//     .matches(
//       /^(application\/pdf|application\/epub\+zip|image\/(jpeg|png|gif|webp|bmp|tiff)|application\/vnd\.amazon\.ebook)$/,
//       "Unsupported file type"
//     ),
//   size: Yup.number()
//     .required("File size is required")
//     .min(1, "File size cannot be 0 or less")
//     .max(5 * 1024 * 1024, "File size cannot exceed 5MB"),
// });

const newPostSchema = Yup.object().shape({
  userId: Yup.string()
    .required("User ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid User ID format"), // MongoDB ObjectId format
  title: Yup.string()
    .required("Title is required")
    .max(255, "Title cannot exceed 255 characters"),
  content: Yup.string()
    .required("Content is required")
    .max(5000, "Content cannot exceed 5000 characters"),
  tags: Yup.array().of(
    Yup.string().max(50, "Each tag must be at most 50 characters")
  ), // Tags array
  links: Yup.array().of(Yup.string().url("Each link must be a valid URL")), // Links array
  likes: Yup.number()
    .integer("Likes must be an integer")
    .min(0, "Likes cannot be negative")
    .default(0),
  files: Yup.array()
    .of(
      Yup.mixed()
        .required("File is required")
        .test("File", "Only PDFs and EBooks are allowed", (value) => {
          return value && SUPPORTED_FILE_FORMATS.includes(value.type);
        })
        .test("size", "File size must be less than 5MB.", (value) => {
          return value && value.size <= MAX_FILE_SIZE;
        })
    )
    .max(3, "You can upload up to 3 files"),
  image: Yup.mixed()
    .required("Image is required")
    .test("File", "Unsupported file format. Allowed: JPEG, PNG.", (value) => {
      // Ensure file is selected
      if (!value) return false;
      return SUPPORTED_IMAGE_FORMATS.includes(value.type);
    })
    .test("size", "File size must be less than 5MB.", (value) => {
      if (!value) return false;
      return value.size <= MAX_FILE_SIZE;
    }),
});

export { newPostSchema };
