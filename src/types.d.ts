import { userSignUpSchema } from "./validators/userSignUp";
import { z } from "zod";

export type userSignUpType = z.infer<typeof userSignUpSchema.shape.body>;
