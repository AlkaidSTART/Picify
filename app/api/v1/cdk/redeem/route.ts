import { NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { AppError } from "@/lib/api/errors";
import { assertCsrf } from "@/lib/security/csrf";
import { rateLimit } from "@/lib/security/rate-limit";
import { prisma } from "@/lib/db";
import { RedeemCdkSchema } from "@/lib/validators/cdk";
import { createHash } from "node:crypto";
import { PACKAGES, type PackageType } from "@/lib/cdk/packages";

function hashCdkCode(code: string): string {
  const secret = process.env.ADMIN_CDK_SECRET ?? "fallback-cdk-secret";
  return createHash("sha256")
    .update(code + secret)
    .digest("hex");
}

export const POST = withApiHandler(async (req: NextRequest) => {
  assertCsrf(req);

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    throw new AppError("UNAUTHORIZED", "请先登录", 401);
  }

  await rateLimit(`cdk:${userId}`, 5, 600);

  const body = await req.json();
  const parsed = RedeemCdkSchema.safeParse(body);

  if (!parsed.success) {
    throw new AppError(
      "VALIDATION_FAILED",
      "请求参数不合法",
      400,
      parsed.error.flatten(),
    );
  }

  const codeHash = hashCdkCode(parsed.data.code);

  const result = await prisma.$transaction(async (tx) => {
    const cdk = await tx.cdkCode.findUnique({ where: { codeHash } });

    if (!cdk || cdk.status !== "unused") {
      throw new AppError("CDK_INVALID", "兑换码无效或已使用", 400);
    }

    if (cdk.expiresAt && cdk.expiresAt < new Date()) {
      throw new AppError("CDK_INVALID", "兑换码无效或已使用", 400);
    }

    const updated = await tx.cdkCode.updateMany({
      where: { id: cdk.id, status: "unused" },
      data: {
        status: "redeemed",
        redeemedByUserId: userId,
        redeemedAt: new Date(),
      },
    });

    if (updated.count === 0) {
      throw new AppError("CDK_INVALID", "兑换码无效或已使用", 400);
    }

    const totalCredits = cdk.credits + cdk.bonusCredits;
    const user = await tx.user.update({
      where: { id: userId },
      data: { remainingCredits: { increment: totalCredits } },
    });

    await tx.creditLedger.create({
      data: {
        userId,
        change: totalCredits,
        balanceAfter: user.remainingCredits,
        type: "cdk_redeem",
        reason: `兑换${PACKAGES[cdk.packageType as PackageType]?.label ?? cdk.packageType}`,
        refType: "cdk",
        refId: cdk.id,
      },
    });

    return {
      addedCredits: totalCredits,
      remainingCredits: user.remainingCredits,
      packageType: cdk.packageType,
    };
  });

  return NextResponse.json({ ok: true, data: result });
});
