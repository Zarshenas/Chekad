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
  bio: Yup.string()
    .max(500, "متن بیوگرافی نباید بیشتر از 500 کاراکتر باشد.")
    .nullable(),
  name: Yup.string()
    .min(3, "نام باید حداقل 3 کاراکتر باشد.")
    .nullable(),
});

export default userInfoSchema;
