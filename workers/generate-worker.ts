import { Worker } from "bullmq";
import { PrismaClient } from "@prisma/client";
import { buildBasicPrompt } from "@/lib/ai/prompt-builder";
import {
  callGPT55Reasoning,
  type ReasoningResult,
} from "@/lib/ai/advanced-reasoning";
import { callGPTImage2 } from "@/lib/ai/image-generator";
import { uploadToOSS } from "@/lib/oss";
import type { GenerationJobData } from "@/lib/queue/types";
import { connection, GENERATION_QUEUE } from "@/lib/queue/config";

const prisma = new PrismaClient();

type ReasoningJson = {
  analysis: string;
  enhancedPrompt: string;
  styleNotes: string;
  compositionTip: string;
};

async function processJob(job: { data: GenerationJobData }) {
  const { taskId } = job.data;

  const task = await prisma.generationTask.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    console.error(`[Worker] 任务不存在: ${taskId}`);
    return;
  }

  await prisma.generationTask.update({
    where: { id: taskId },
    data: { status: "generating" },
  });

  try {
    let imageBuffer: Buffer;
    let reasoning: ReasoningResult | null = null;
    let rawPrompt = "";

    if (task.mode === "basic") {
      rawPrompt = buildBasicPrompt(
        task.persona,
        task.scene,
        task.params as Record<string, unknown>,
      );
      const result = await callGPTImage2(rawPrompt);
      imageBuffer = result.buffer;
    } else {
      reasoning = await callGPT55Reasoning(
        task.persona,
        task.scene,
        task.params as Record<string, unknown>,
      );

      rawPrompt = reasoning.enhancedPrompt;
      const result = await callGPTImage2(rawPrompt);
      imageBuffer = result.buffer;
    }

    const ossKey = `generated/${task.userId}/${taskId}.png`;
    const imageUrl = await uploadToOSS(ossKey, imageBuffer);

    const reasoningData: ReasoningJson | undefined = reasoning
      ? {
          analysis: reasoning.analysis,
          enhancedPrompt: reasoning.enhancedPrompt,
          styleNotes: reasoning.styleNotes,
          compositionTip: reasoning.compositionTip,
        }
      : undefined;

    await prisma.$transaction([
      prisma.generationTask.update({
        where: { id: taskId },
        data: {
          status: "completed",
          imageUrl,
          imageWidth: 1024,
          imageHeight: 1024,
          imageSize: imageBuffer.length,
          rawPrompt,
          enhancedPrompt: task.mode === "advanced" ? rawPrompt : null,
          reasoning: reasoningData as unknown as Record<string, string>,
          completedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: task.userId },
        data: { totalGenerated: { increment: 1 } },
      }),
    ]);

    console.log(`[Worker] 任务完成: ${taskId}`);
  } catch (err) {
    console.error(`[Worker] 任务失败: ${taskId}`, err);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: task.userId },
        data: { remainingCredits: { increment: task.costCredits } },
      });

      await tx.creditLedger.create({
        data: {
          userId: task.userId,
          change: task.costCredits,
          balanceAfter: user.remainingCredits,
          type: "generation_refund",
          reason: "生成失败退还",
          refType: "generation_task",
          refId: taskId,
        },
      });

      await tx.generationTask.update({
        where: { id: taskId },
        data: {
          status: "failed",
          errorMessage: (err as Error).message ?? "生成失败",
        },
      });
    });

    throw err;
  }
}

if (!connection) {
  console.error("[Worker] Redis 未连接，无法启动 Worker");
  process.exit(1);
}

const worker = new Worker<GenerationJobData>(GENERATION_QUEUE, processJob, {
  connection,
  concurrency: 3,
});

worker.on("completed", (job) => {
  console.log(`[Worker] 已完成: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`[Worker] 失败: ${job?.id}`, err.message);
});

console.log("[Worker] 生成任务 Worker 已启动，等待任务...");

process.on("SIGINT", async () => {
  console.log("[Worker] 正在关闭...");
  await worker.close();
  process.exit(0);
});
