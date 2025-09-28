import { Request, Response } from "express";
import { userLoginType, userSignUpType } from "../types";
import { createUser, loginUser } from "../services/users.services";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";

export const userSignUp = async (
  req: Request<{}, {}, userSignUpType>,
  res: Response
) => {
  try {
    const { username, password, email } = req.body;
    const user = await createUser({ username, password, email });
    const code = 200;
    return res.status(code).json(
      new ApiResponse(code, "User Created Successfully", {
        userId: user._id,
        email: user.email,
        username: user.username,
      })
    );
  } catch (err: any) {
    if ((err as any).code === 11000 || (err as any).cause?.code === 11000) {
      const keyValue = (err as any).keyValue || (err as any).cause?.keyValue;
      const field = keyValue ? Object.keys(keyValue)[0] : "field";
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            `Duplicate key error: A user with that ${field} already exists.`
          )
        );
    } else {
      console.error(err);
      return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
  }
};

export const userLogin = async (
  req: Request<{}, {}, userLoginType>,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await loginUser({ email, password });
    return res.status(200).json(
      new ApiResponse(200, "Logged in Successfully", {
        accessToken,
        refreshToken,
      })
    );
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      return res
        .status(404)
        .json(new ApiError(404, "No User associated with this email found"));
    } else if (err instanceof Error && err.message === "nopassword") {
      return res
        .status(401)
        .json(new ApiError(401, "Invalid User Credentials"));
    } else {
      return res
        .status(500)
        .json(new ApiError(500, "Something went wroong", [err]));
    }
  }
};

export const updateProfile = (req: Request, res: Response) => {
  res.json(new ApiResponse(200, "Nigga You In", req.user));
};
