import mongoose from "mongoose";
import { z } from "zod";
export const videoUpdateSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(30).max(300).optional(),
});

export const videoUpdateParamsSchema = z.object({
  Id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Video Id format"),
});
