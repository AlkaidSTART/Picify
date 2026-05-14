import { NextResponse } from "next/server";
import { withApiHandler } from "@/lib/api/handler";
import { getPersonas } from "@/lib/scenes/catalog";

export const GET = withApiHandler(async () => {
  const personas = getPersonas();

  return NextResponse.json({ personas });
});
