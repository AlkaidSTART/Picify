import { SignJWT, jwtVerify } from "jose";
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
    throw new AppError("JWT_SECRET_MISSING", "系统未配置鉴权密钥", 500);
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

export async function createRefreshToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function hashRefreshToken(token: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function getRefreshTokenTtlSeconds() {
  return REFRESH_TOKEN_TTL_SECONDS;
}

export function getAccessTokenTtlSeconds() {
  return ACCESS_TOKEN_TTL_SECONDS;
}
