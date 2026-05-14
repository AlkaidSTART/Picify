import { NextResponse } from "next/server";
import { getAccessTokenTtlSeconds, getRefreshTokenTtlSeconds } from "./tokens";

const isProd = process.env.NODE_ENV === "production";

export function setAuthCookies(
  res: NextResponse,
  payload: { accessToken: string; refreshToken: string; csrfToken: string },
) {
  res.cookies.set("access_token", payload.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: getAccessTokenTtlSeconds(),
  });

  res.cookies.set("refresh_token", payload.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: getRefreshTokenTtlSeconds(),
  });

  res.cookies.set("csrf_token", payload.csrfToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: "lax",
    path: "/",
  });
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set("access_token", "", { maxAge: 0, path: "/" });
  res.cookies.set("refresh_token", "", { maxAge: 0, path: "/" });
  res.cookies.set("csrf_token", "", { maxAge: 0, path: "/" });
}
