import { getMailTransport } from "./mailer";
import { AppError } from "@/lib/api/errors";

export async function sendOtpEmail(payload: { email: string; code: string }) {
  const from = process.env.EMAIL_FROM;
  if (!from) {
    throw new AppError(
      "EMAIL_FROM_MISSING",
      "EMAIL_FROM is not configured",
      500,
    );
  }

  const transporter = getMailTransport();

  await transporter.sendMail({
    from,
    to: payload.email,
    subject: "Your Picify verification code",
    text: `Your verification code is ${payload.code}. It expires in 10 minutes.`,
  });
}
