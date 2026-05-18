import { NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { AppError } from "@/lib/api/errors";
import { assertCsrf } from "@/lib/security/csrf";
import { rateLimit } from "@/lib/security/rate-limit";
import { prisma } from "@/lib/db";
import { GenerateRequestSchema } from "@/lib/validators/generate";
import { getPersonas, getScenesByPersona } from "@/lib/scenes/catalog";
import { connection, GENERATION_QUEUE } from "@/lib/queue/config";
import { Queue } from "bullmq";

const COST_MAP = { basic: 1, advanced: 2 } as const;

export const POST = withApiHandler(async (req: NextRequest) => {
  assertCsrf(req);

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    throw new AppError("UNAUTHORIZED", "请先登录", 401);
  }

  await rateLimit(`generate:${userId}`, 10, 60);

  const body = await req.json();
  const parsed = GenerateRequestSchema.safeParse(body);

  if (!parsed.success) {
    throw new AppError(
      "VALIDATION_FAILED",
      "请求参数不合法",
      400,
      parsed.error.flatten(),
    );
  }

  const { persona, scene, mode, params } = parsed.data;
  const costCredits = COST_MAP[mode];

  const personaExists = getPersonas().some((p) => p.id === persona);
  if (!personaExists) {
    throw new AppError("INVALID_PARAMS", "人群类型不存在", 400);
  }

  const scenes = getScenesByPersona(persona);
  const sceneConfig = scenes.find((s) => s.id === scene);
  if (!sceneConfig) {
    throw new AppError("INVALID_PARAMS", "场景不存在", 400);
  }

  const missingRequired = sceneConfig.params
    .filter((p) => p.required)
    .filter((p) => !params[p.key] || String(params[p.key]).trim() === "");
  if (missingRequired.length > 0) {
    throw new AppError("INVALID_PARAMS", "必填参数缺失", 400, {
      fields: missingRequired.map((p) => p.key),
    });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError("UNAUTHORIZED", "用户不存在", 401);
  }
  if (user.remainingCredits < costCredits) {
    throw new AppError("INSUFFICIENT_CREDITS", "余额不足，请先充值", 403);
  }

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: userId, remainingCredits: { gte: costCredits } },
      data: { remainingCredits: { decrement: costCredits } },
    });

    if (updated.remainingCredits < 0) {
      throw new AppError("INSUFFICIENT_CREDITS", "余额不足，请先充值", 403);
    }

    await tx.creditLedger.create({
      data: {
        userId,
        change: -costCredits,
        balanceAfter: updated.remainingCredits,
        type: "generation_cost",
        reason: `${mode === "advanced" ? "高级" : "基础"}模式生成`,
        refType: "generation_task",
      },
    });

    const task = await tx.generationTask.create({
      data: {
        userId,
        persona,
        scene,
        params: params as Record<string, string>,
        mode,
        costCredits,
        status: "pending",
      },
    });

    await tx.creditLedger.updateMany({
      where: { userId, refType: "generation_task", refId: null },
      data: { refId: task.id },
    });

    return { task, remainingCredits: updated.remainingCredits };
  });

  if (connection) {
    const queue = new Queue(GENERATION_QUEUE, { connection });
    await queue.add("generate", { taskId: result.task.id } as const, {
      attempts: 3,
      backoff: { type: "exponential", delay: 3000 },
    });
  }

  return NextResponse.json({
    ok: true,
    data: {
      taskId: result.task.id,
      status: "pending",
      remainingCredits: result.remainingCredits,
    },
  });
});
