import * as Yup from "yup";

const signinSchema = Yup.object().shape({
  email: Yup.string()
    .email("فرمت ایمیل معتبر نیست")
    .required("ایمیل الزامی است"),
  password: Yup.string()
    .required("رمز عبور الزامی است")
});


export default signinSchema;