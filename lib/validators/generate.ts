import { z } from "zod";

export const GenerateRequestSchema = z.object({
  persona: z.enum(["ecommerce", "creator", "designer", "office"]),
  scene: z.string().min(1).max(64),
  mode: z.enum(["basic", "advanced"]).default("basic"),
  params: z.record(z.string(), z.unknown()),
});

export const TaskIdSchema = z.object({
  taskId: z.string().min(1),
});
