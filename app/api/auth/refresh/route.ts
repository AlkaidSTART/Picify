import { NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { AppError } from "@/lib/api/errors";
import { prisma } from "@/lib/db";
import {
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
  getRefreshTokenTtlSeconds,
} from "@/lib/auth/tokens";
import { createCsrfToken } from "@/lib/security/csrf";
import { setAuthCookies } from "@/lib/auth/cookies";

export const POST = withApiHandler(async (req: NextRequest) => {
  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    throw new AppError("REFRESH_TOKEN_MISSING", "登录状态已过期", 401);
  }

  const refreshTokenHash = hashRefreshToken(refreshToken);
  const record = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenHash },
  });

  if (!record || record.expiresAt <= new Date()) {
    throw new AppError(
      "REFRESH_TOKEN_INVALID",
      "身份验证无效，请重新登录",
      401,
    );
  }

  await prisma.refreshToken.delete({ where: { id: record.id } });

  const user = await prisma.user.findUnique({ where: { id: record.userId } });
  if (!user) {
    throw new AppError("USER_NOT_FOUND", "找不到相关用户信息", 404);
  }

  const accessToken = await createAccessToken({
    userId: user.id,
    email: user.email,
  });
  const newRefreshToken = createRefreshToken();
  const newRefreshHash = hashRefreshToken(newRefreshToken);

  await prisma.refreshToken.create({
    data: {
      userId: record.userId,
      token: newRefreshHash,
      expiresAt: new Date(Date.now() + getRefreshTokenTtlSeconds() * 1000),
    },
  });

  const csrfToken = createCsrfToken();
  const response = NextResponse.json({ ok: true });
  setAuthCookies(response, {
    accessToken,
    refreshToken: newRefreshToken,
    csrfToken,
  });

  return response;
});
