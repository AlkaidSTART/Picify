import { NextRequest, NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { AppError } from "@/lib/api/errors";
import { getScenesByPersona } from "@/lib/scenes/catalog";

export const GET = withApiHandler(async (req: NextRequest) => {
  const persona = req.nextUrl.searchParams.get("persona");

  if (!persona) {
    throw new AppError("MISSING_PERSONA", "缺少人群参数 persona", 400);
  }

  const scenes = getScenesByPersona(persona);

  if (scenes.length === 0) {
    throw new AppError("SCENES_NOT_FOUND", "未找到对应人群的场景", 404);
  }

  return NextResponse.json({ scenes });
});
