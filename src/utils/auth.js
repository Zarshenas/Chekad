import { hash, compare } from "bcryptjs";
import { verify } from "jsonwebtoken";

const salt = 8;

const hashPassword = async (password) => {
  const hashed = await hash(password, salt);
  return hashed;
};

const verifyPassword = async (hasshedPass, plainPass) => {
  const isEqul = await compare(plainPass, hasshedPass);
  return isEqul;
};

const verifyToken = (token, secretKey) => {
  try {
    const result = verify(token, secretKey);
    return { userId : result.userId};
  } catch (err) {
    return false;
  }
};

export { hashPassword, verifyPassword, verifyToken };
