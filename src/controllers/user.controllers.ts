import { Request, Response } from "express";
import { userSignUpType } from "../types";
import { createUser } from "../services/users.services";
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
    if (err.code == 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            `Duplicate key error: A user with that ${field} already exists.`
          )
        );
    } else {
      return res.status(500).json(new ApiError(500));
    }
  }
};
