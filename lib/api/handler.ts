import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";

type HandlerContext = { params: Promise<Record<string, string>> };

type ApiHandler = (
  req: NextRequest,
  ctx: HandlerContext,
) => Promise<NextResponse>;

export function withApiHandler(handler: ApiHandler) {
  return async (req: NextRequest, ctx: HandlerContext) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(
          {
            error: {
              code: error.code,
              message: error.message,
              details: error.details,
            },
          },
          { status: error.status },
        );
      }

      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: {
              code: "VALIDATION_FAILED",
              message: "请求参数不合法",
              details: error.flatten(),
            },
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          error: {
            code: "INTERNAL_ERROR",
            message: "服务器开小差了，请稍后重试",
          },
        },
        { status: 500 },
      );
    }
  };
}
