import mongoose from "mongoose";
import { userLoginSchema } from "./validators/userLogin";
import { userSignUpSchema } from "./validators/userSignUp";
import { z } from "zod";
import { videoUploadSchema } from "./validators/videoUpload";

export type userSignUpType = z.infer<typeof userSignUpSchema>;
export type userLoginType = z.infer<typeof userLoginSchema>;
export type videoUploadType = z.infer<typeof videoUploadSchema>;

export type userRole = "user" | "admin";
export interface payload {
  username: string;
  email: string;
  role: userRole;
  _id: mongoose.Types.ObjectId;
}
