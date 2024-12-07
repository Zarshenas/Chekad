import * as Yup from "yup";
const signupSchema = Yup.object().shape({
  username: Yup.string()
    .required("username is required")
    .min(6, "username must be at least 6 characters")
    .max(15, "username can't be more than 15 characters")
    .matches("^[A-Za-z][A-Za-z0-9_]{5,15}$", "Invalid username"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default signupSchema;
