import { NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { AppError } from "@/lib/api/errors";
import { assertCsrf } from "@/lib/security/csrf";
import { rateLimit } from "@/lib/security/rate-limit";
import { OssPresignRequestSchema } from "@/lib/validators/oss";
import { generatePresignUrl } from "@/lib/oss";

export const POST = withApiHandler(async (req: NextRequest) => {
  assertCsrf(req);

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    throw new AppError("UNAUTHORIZED", "请先登录", 401);
  }

  await rateLimit(`oss:${userId}`, 30, 60);

  const body = await req.json();
  const parsed = OssPresignRequestSchema.safeParse(body);

  if (!parsed.success) {
    throw new AppError("VALIDATION_FAILED", "请求参数不合法", 400, parsed.error.flatten());
  }

  const { filename, contentType } = parsed.data;
  const result = await generatePresignUrl(userId, filename, contentType);

  return NextResponse.json({ ok: true, data: result });
});
