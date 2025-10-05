import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { payload, userLoginType, userSignUpType } from "../types";
import { compare, hash } from "bcrypt";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";

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

export const refreshAccessToken = (token: string) => {
  try {
    const user = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
    const newAccessToken = jwt.sign(
      user,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    return { newAccessToken };
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new ApiError(400, "Jwt Token is Expired. Log in again.");
    } else if (err instanceof jwt.JsonWebTokenError) {
      throw new ApiError(400, "Invalid jwt Token");
    }
  }
};

export const updateWatchHistory = async (
  user: payload,
  vidId: mongoose.Types.ObjectId
) => {
  try {
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { watchHistory: vidId },
    }).orFail();
  } catch (err: unknown) {
    throw new ApiError(500, "Error occured while updating watch history");
  }
};
