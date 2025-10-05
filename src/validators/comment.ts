import { z } from "zod";

export const commentSchema = z.object({
  desciption: z.string().min(3).max(300),
});
