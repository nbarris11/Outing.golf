import { NextResponse } from "next/server";

import { toggleLodgingFavorite } from "@/lib/lodging/service";

export async function POST(
  _request: Request,
  context: { params: Promise<{ outingId: string; optionId: string }> }
) {
  try {
    const { outingId, optionId } = await context.params;
    const result = await toggleLodgingFavorite({ outingId, optionId });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update favorite" },
      { status: 500 }
    );
  }
}
