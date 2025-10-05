import mongoose from "mongoose";
import { z } from "zod";
import { userLoginSchema } from "./validators/userLogin";
import { userSignUpSchema } from "./validators/userSignUp";
import { videoUploadSchema } from "./validators/videoUpload";
import {
  videoUpdateParamsSchema,
  videoUpdateSchema,
} from "./validators/videoUpdate";
import { refreshTokenSchema } from "./validators/refreshToken";

export type userSignUpType = z.infer<typeof userSignUpSchema>;
export type userLoginType = z.infer<typeof userLoginSchema>;
export type refreshTokenType = z.infer<typeof refreshTokenSchema>;

export type videoUploadType = z.infer<typeof videoUploadSchema>;
export type videoUpdateType = z.infer<typeof videoUpdateSchema>;
export type videoUpdateParamsType = z.infer<typeof videoUpdateParamsSchema>;

export type userRole = "user" | "admin";
export interface payload {
  username: string;
  email: string;
  role: userRole;
  _id: mongoose.Types.ObjectId;
}
