import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/tokens";

const PUBLIC_PATHS = new Set([
  "/",
  "/api/auth/send-otp",
  "/api/auth/verify-otp",
  "/api/auth/refresh",
  "/api/auth/csrf",
]);

const PUBLIC_PREFIXES = ["/api/scenes", "/api/personas"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  if (
    PUBLIC_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return NextResponse.next();
  }

  if (
    process.env.NODE_ENV !== "production" &&
    pathname.startsWith("/dashboard")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("access_token")?.value;
  if (!token) {
    return respondUnauthorized(req);
  }

  const payload = await verifyAccessToken(token);
  if (!payload) {
    return respondUnauthorized(req);
  }

  const res = NextResponse.next();
  res.headers.set("x-user-id", payload.userId);
  return res;
}

function respondUnauthorized(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/", req.url));
}

export const config = { matcher: ["/api/:path*", "/dashboard/:path*"] };
