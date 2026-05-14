import { NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { prisma } from "@/lib/db";
import { hashRefreshToken } from "@/lib/auth/tokens";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { assertCsrf } from "@/lib/security/csrf";

export const POST = withApiHandler(async (req: NextRequest) => {
  assertCsrf(req);

  const refreshToken = req.cookies.get("refresh_token")?.value;
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: { token: hashRefreshToken(refreshToken) },
    });
  }

  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
});
