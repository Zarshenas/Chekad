import * as Yup from "yup";

const SUPPORTED_IMAGE_FORMATS = ["image/jpeg", "image/png"];
const SUPPORTED_FILE_FORMATS = ["application/pdf", "application/epub+zip"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB


const newPostSchema = Yup.object().shape({
  userId: Yup.string()
    .required("شناسه کاربر الزامی است")
    .matches(/^[0-9a-fA-F]{24}$/, "فرمت شناسه کاربر معتبر نیست"), // MongoDB ObjectId format
  title: Yup.string()
    .required("عنوان الزامی است")
    .max(255, "عنوان نباید بیشتر از ۲۵۵ کاراکتر باشد"),
  content: Yup.string()
    .required("محتوا الزامی است")
    .max(5000, "محتوا نباید بیشتر از ۵۰۰۰ کاراکتر باشد"),
  tags: Yup.array().of(
    Yup.string().max(50, "هر برچسب باید حداکثر ۵۰ کاراکتر باشد")
  ), // Tags array
  links: Yup.array().of(Yup.string().url("هر لینک باید یک URL معتبر باشد")), // Links array
  likes: Yup.number()
    .integer("لایک‌ها باید عدد صحیح باشند")
    .min(0, "لایک‌ها نمی‌توانند منفی باشند")
    .default(0),
  files: Yup.array()
    .of(
      Yup.mixed()
        .required("فایل الزامی است")
        .test("File", "فقط فایل‌های PDF و EBook مجاز هستند", (value) => {
          return value && SUPPORTED_FILE_FORMATS.includes(value.type);
        })
        .test("size", "حجم فایل باید کمتر از ۵MB باشد.", (value) => {
          return value && value.size <= MAX_FILE_SIZE;
        })
    )
    .max(3, "شما می‌توانید حداکثر ۳ فایل بارگذاری کنید"),
  image: Yup.mixed()
    .required("تصویر الزامی است")
    .test("File", "فرمت فایل پشتیبانی نمی‌شود. فرمت‌های مجاز: JPEG, PNG.", (value) => {
      // Ensure file is selected
      if (!value) return false;
      return SUPPORTED_IMAGE_FORMATS.includes(value.type);
    })
    .test("size", "حجم فایل باید کمتر از ۵MB باشد.", (value) => {
      if (!value) return false;
      return value.size <= MAX_FILE_SIZE;
    }),
});

export { newPostSchema };
