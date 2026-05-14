import { z } from "zod";

export const OssPresignRequestSchema = z.object({
  filename: z
    .string()
    .min(1)
    .max(128)
    .regex(/^[\w.-]+\.(jpg|jpeg|png)$/i),
  contentType: z.enum(["image/jpeg", "image/png"]),
  size: z.number().int().positive().max(10 * 1024 * 1024),
});
