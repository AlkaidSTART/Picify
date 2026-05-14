import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";

type HandlerContext = { params?: Record<string, string> };

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
              message: "Invalid input",
              details: error.flatten(),
            },
          },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          error: { code: "INTERNAL_ERROR", message: "Unexpected server error" },
        },
        { status: 500 },
      );
    }
  };
}
