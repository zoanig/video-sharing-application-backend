import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { payload, userLoginType, userSignUpType } from "../types";
import { compare, hash } from "bcrypt";

export const createUser = async (user: userSignUpType) => {
  const newUser = new User({
    ...user,
    password: await hash(user.password, 10),
  });
  await newUser.save();
  return newUser;
};

export const loginUser = async (user: userLoginType) => {
  const foundUser = await User.findOne({ email: user.email }).orFail();

  const isValid = await compare(user.password, foundUser.password);
  if (!isValid) {
    throw new Error("nopassword");
  }

  const payload: payload = {
    username: foundUser.username,
    email: foundUser.email,
    role: foundUser.role,
    _id: foundUser._id,
  };
  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};
