import * as Yup from "yup";

const userInfoSchema = Yup.object.shape({
  image: Yup.string(),
  bio: Yup.string().min(15, "bio must be at least 15 characters"),
  name: Yup.string().min(3, "name must be at least 3 characters"),
});

export default userInfoSchema;
