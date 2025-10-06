import { z } from "zod";

export const playlistCreateSchema = z.object({
  videos: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format")),
  title: z.string().min(3).max(100),
  description: z.string().min(3).max(300).optional(),
});

export const playlistUpdateSchema = z.object({
  videos: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format"))
    .optional(),
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(3).max(300).optional(),
  removedVids: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Id format"))
    .optional(),
});
