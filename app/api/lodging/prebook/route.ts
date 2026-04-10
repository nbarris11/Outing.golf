import { NextResponse } from "next/server";
import { z } from "zod";

import { createLodgingPrebook } from "@/lib/lodging/service";
import { lodgingPrebookInputSchema } from "@/lib/providers/liteapi/types";

export async function POST(request: Request) {
  try {
    const payload = lodgingPrebookInputSchema.parse(await request.json());
    const prebook = await createLodgingPrebook(payload);

    return NextResponse.json({
      prebookId: prebook.prebookId,
      finalPrice: prebook.priceTotal,
      currency: prebook.currency,
      cancellationSummary: prebook.cancellationSummary,
      roomDetails: prebook.roomDetails,
      expiresAt: prebook.expiresAt
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid prebook request", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Prebook failed" },
      { status: 500 }
    );
  }
}
