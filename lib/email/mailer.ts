import nodemailer from "nodemailer";
import { AppError } from "@/lib/api/errors";

export function getMailTransport() {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!host || !port || !user || !pass) {
    throw new AppError(
      "EMAIL_CONFIG_MISSING",
      "Email configuration is incomplete",
      500,
    );
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });
}
