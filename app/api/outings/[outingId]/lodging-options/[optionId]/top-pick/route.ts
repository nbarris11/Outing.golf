import { NextResponse } from "next/server";

import { markLodgingTopPick } from "@/lib/lodging/service";

export async function POST(
  _request: Request,
  context: { params: Promise<{ outingId: string; optionId: string }> }
) {
  try {
    const { outingId, optionId } = await context.params;
    const result = await markLodgingTopPick({ outingId, optionId });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update top pick" },
      { status: 500 }
    );
  }
}
