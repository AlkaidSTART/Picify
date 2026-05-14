import { NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { createCsrfToken } from "@/lib/security/csrf";

export const GET = withApiHandler(async () => {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("csrf_token", createCsrfToken(), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return response;
});
