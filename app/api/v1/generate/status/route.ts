import { NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { AppError } from "@/lib/api/errors";
import { prisma } from "@/lib/db";

export const GET = withApiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    throw new AppError("UNAUTHORIZED", "请先登录", 401);
  }

  const taskId = req.nextUrl.searchParams.get("taskId");
  if (!taskId) {
    throw new AppError("INVALID_PARAMS", "缺少 taskId 参数", 400);
  }

  const task = await prisma.generationTask.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new AppError("TASK_NOT_FOUND", "任务不存在", 404);
  }

  const base: Record<string, unknown> = {
    taskId: task.id,
    status: task.status,
    mode: task.mode,
    costCredits: task.costCredits,
  };

  if (task.status === "completed") {
    base.imageUrl = task.imageUrl;
    base.imageWidth = task.imageWidth;
    base.imageHeight = task.imageHeight;
    base.imageSize = task.imageSize;

    if (task.mode === "advanced" && task.reasoning) {
      base.reasoning = task.reasoning;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { remainingCredits: true },
    });
    base.remainingCredits = user?.remainingCredits ?? 0;
  }

  if (task.status === "failed") {
    base.errorMessage = task.errorMessage;
  }

  return NextResponse.json({ ok: true, data: base });
});
