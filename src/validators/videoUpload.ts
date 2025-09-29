import { z } from "zod";

export const videoUploadSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(30).max(300).optional(),
});
