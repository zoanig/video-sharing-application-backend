import mongoose from "mongoose";
import { userLoginSchema } from "./validators/userLogin";
import { userSignUpSchema } from "./validators/userSignUp";
import { z } from "zod";

export type userSignUpType = z.infer<typeof userSignUpSchema.shape.body>;
export type userLoginType = z.infer<typeof userLoginSchema.shape.body>;
export type userRole = "user" | "admin";
export interface payload {
  username: string;
  email: string;
  role: userRole;
  _id: mongoose.Types.ObjectId;
}
