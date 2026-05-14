import { NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { prisma } from "@/lib/db";
import { createOtpCode } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/email/send-otp";
import { rateLimit } from "@/lib/security/rate-limit";
import { sendOtpSchema } from "@/lib/validators/auth";

const OTP_EXPIRES_MINUTES = 10;

export const POST = withApiHandler(async (req: NextRequest) => {
  const body = sendOtpSchema.parse(await req.json());
  const email = body.email.toLowerCase();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  await rateLimit(`otp:send:${email}`, 1, 60);
  await rateLimit(`otp:send:ip:${ip}`, 10, 60 * 60);

  await prisma.otpCode.updateMany({
    where: { email, used: false },
    data: { used: true },
  });

  const code = createOtpCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000);

  await prisma.otpCode.create({
    data: {
      email,
      code,
      expiresAt,
    },
  });

  await sendOtpEmail({ email, code });

  return NextResponse.json({ ok: true });
});
