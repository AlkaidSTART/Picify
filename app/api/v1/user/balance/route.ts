import { NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { AppError } from "@/lib/api/errors";
import { prisma } from "@/lib/db";
import { PACKAGES } from "@/lib/cdk/packages";

export const GET = withApiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    throw new AppError("UNAUTHORIZED", "请先登录", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, remainingCredits: true, totalGenerated: true },
  });

  if (!user) {
    throw new AppError("UNAUTHORIZED", "用户不存在", 401);
  }

  const packages = Object.entries(PACKAGES).map(([type, pkg]) => ({
    type,
    label: pkg.label,
    credits: pkg.credits,
    bonus: pkg.bonus,
  }));

  return NextResponse.json({
    ok: true,
    data: {
      userId: user.id,
      remainingCredits: user.remainingCredits,
      totalGenerated: user.totalGenerated,
      packages,
    },
  });
});
