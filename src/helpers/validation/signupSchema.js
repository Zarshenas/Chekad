import * as Yup from "yup";
const signupSchema = Yup.object().shape({
  username: Yup.string()
    .required("نام کاربری الزامی است")
    .min(6, "نام کاربری باید حداقل 6 کاراکتر باشد")
    .max(15, "نام کاربری نباید بیشتر از 15 کاراکتر باشد")
    .matches("^[A-Za-z][A-Za-z0-9_]{5,15}$", "نام کاربری معتبر نیست"),
  email: Yup.string()
    .email("فرمت ایمیل معتبر نیست")
    .required("ایمیل الزامی است"),
  password: Yup.string()
    .required("رمز عبور الزامی است")
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "رمز عبور باید یکسان باشد")
    .required("تأیید رمز عبور الزامی است"),
});

export default signupSchema;
