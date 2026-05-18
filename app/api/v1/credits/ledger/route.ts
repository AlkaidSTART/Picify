import { NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { AppError } from "@/lib/api/errors";
import { prisma } from "@/lib/db";

export const GET = withApiHandler(async (req: NextRequest) => {
  const userId = req.headers.get("x-user-id");
  if (!userId) {
    throw new AppError("UNAUTHORIZED", "请先登录", 401);
  }

  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") ?? "1"));
  const pageSize = Math.min(
    50,
    Math.max(1, Number(req.nextUrl.searchParams.get("pageSize") ?? "20")),
  );

  const [items, total] = await Promise.all([
    prisma.creditLedger.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.creditLedger.count({ where: { userId } }),
  ]);

  return NextResponse.json({
    ok: true,
    data: {
      items,
      total,
      page,
      pageSize,
    },
  });
});
