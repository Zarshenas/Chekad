import { hash, compare } from "bcryptjs";

const salt = 8;

const hashPassword = async (password) => {
  const hashed = await hash(password, salt);
  return hashed;
};

const verifyPassword = async (hasshedPass, plainPass) => {
  const isEqul = await compare(plainPass, hasshedPass);
  return isEqul;
};

export { hashPassword , verifyPassword};
