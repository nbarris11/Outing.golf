import { NextResponse } from "next/server";
import { z } from "zod";

import { searchLodgingForUi } from "@/lib/lodging/service";
import { lodgingSearchInputSchema } from "@/lib/providers/liteapi/types";

export async function POST(request: Request) {
  try {
    const payload = lodgingSearchInputSchema.parse(await request.json());
    const result = await searchLodgingForUi(payload);

    return NextResponse.json({
      results: result.results.map(({ rawProviderData, ...item }) => item),
      usedFallback: result.usedFallback
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid lodging search input", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lodging search failed" },
      { status: 500 }
    );
  }
}
