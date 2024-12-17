import * as Yup from "yup";

const SUPPORTED_FORMATS = ["image/jpeg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const userInfoSchema = Yup.object().shape({
  profilePicture: Yup.mixed()
  .test(
    "File",
    "فرمت تصویر معتبر نیست. فقط JPEG, PNG و GIF پشتیبانی می‌شود.",
    (value) => value && SUPPORTED_FORMATS.includes(value.type)
  )
  .test(
    "size",
    "حجم تصویر نباید از ۵ مگابایت بیشتر باشد.",
    (value) => value && value.size <= MAX_FILE_SIZE
  ),
  bio: Yup.string().max(500, "bio can't be more than 500 characters").nullable(),
  name: Yup.string().min(3, "name must be at least 3 characters").nullable(),
});

export default userInfoSchema;
