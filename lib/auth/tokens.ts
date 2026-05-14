import { SignJWT, jwtVerify } from "jose";
import { createHash, randomBytes } from "crypto";
import { AppError } from "@/lib/api/errors";

export type AccessTokenPayload = {
  userId: string;
  email: string;
};

const ACCESS_TOKEN_TTL_SECONDS = 60 * 15;
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError(
      "JWT_SECRET_MISSING",
      "JWT secret is not configured",
      500,
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createAccessToken(payload: AccessTokenPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify<AccessTokenPayload>(
      token,
      getJwtSecret(),
    );
    return payload;
  } catch {
    return null;
  }
}

export function createRefreshToken() {
  return randomBytes(32).toString("base64url");
}

export function hashRefreshToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getRefreshTokenTtlSeconds() {
  return REFRESH_TOKEN_TTL_SECONDS;
}

export function getAccessTokenTtlSeconds() {
  return ACCESS_TOKEN_TTL_SECONDS;
}
