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
import { rateLimit } from "@/lib/security/rate-limit";
import { verifyOtpSchema } from "@/lib/validators/auth";

export const POST = withApiHandler(async (req: NextRequest) => {
  const body = verifyOtpSchema.parse(await req.json());
  const email = body.email.toLowerCase();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  await rateLimit(`otp:verify:${email}`, 5, 60 * 10);
  await rateLimit(`otp:verify:ip:${ip}`, 5, 60 * 10);

  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      email,
      code: body.code,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!otpRecord) {
    throw new AppError("OTP_INVALID", "验证码无效或已过期", 400);
  }

  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { used: true },
  });

  const user = await prisma.user.upsert({
    where: { email },
    create: { email },
    update: {},
  });

  const accessToken = await createAccessToken({
    userId: user.id,
    email: user.email,
  });
  const refreshToken = createRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshTokenHash,
      expiresAt: new Date(Date.now() + getRefreshTokenTtlSeconds() * 1000),
    },
  });

  const csrfToken = createCsrfToken();
  const response = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      remainingCredits: user.remainingCredits,
    },
  });

  setAuthCookies(response, { accessToken, refreshToken, csrfToken });

  return response;
});
