import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";
import { AppError } from "@/lib/api/errors";

const MUTATION_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function getCsrfSecret() {
  const secret = process.env.CSRF_SECRET;
  if (!secret) {
    throw new AppError("CSRF_SECRET_MISSING", "安全配置不完整", 500);
  }
  return secret;
}

export function createCsrfToken() {
  const nonce = randomBytes(24).toString("base64url");
  const sig = createHmac("sha256", getCsrfSecret())
    .update(nonce)
    .digest("base64url");
  return `${nonce}.${sig}`;
}

function isValidCsrfToken(token: string) {
  const [nonce, sig] = token.split(".");
  if (!nonce || !sig) return false;
  const expected = createHmac("sha256", getCsrfSecret())
    .update(nonce)
    .digest("base64url");
  const sigBuffer = Buffer.from(sig);
  const expectedBuffer = Buffer.from(expected);
  return (
    sigBuffer.length === expectedBuffer.length &&
    timingSafeEqual(sigBuffer, expectedBuffer)
  );
}

export function assertCsrf(req: NextRequest) {
  if (!MUTATION_METHODS.has(req.method)) return;

  const cookieToken = req.cookies.get("csrf_token")?.value;
  const headerToken = req.headers.get("x-csrf-token");

  if (
    !cookieToken ||
    !headerToken ||
    cookieToken !== headerToken ||
    !isValidCsrfToken(cookieToken)
  ) {
    throw new AppError(
      "CSRF_TOKEN_INVALID",
      "安全验证失败，请刷新页面重试",
      403,
    );
  }
}
