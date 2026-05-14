import { z } from "zod";

export const RedeemCdkSchema = z.object({
  code: z
    .string()
    .trim()
    .min(12)
    .max(64)
    .regex(/^[A-Z0-9-]+$/),
});
