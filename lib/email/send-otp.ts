import { getMailTransport } from "./mailer";
import { AppError } from "@/lib/api/errors";

export async function sendOtpEmail(payload: { email: string; code: string }) {
  const from = process.env.EMAIL_FROM;
  if (!from) {
    throw new AppError("EMAIL_FROM_MISSING", "发件人配置不完整", 500);
  }

  const transporter = getMailTransport();

  await transporter.sendMail({
    from,
    to: payload.email,
    subject: "Picify 验证码",
    text: `您的验证码是 ${payload.code}。验证码在 10 分钟内有效。`,
  });
}
