import { NextResponse } from "next/server";
import { z } from "zod";

import { saveLodgingOption } from "@/lib/lodging/service";

const saveLodgingOptionSchema = z.object({
  option: z.object({
    provider: z.literal("liteapi"),
    hotelId: z.string().min(1),
    hotelName: z.string().min(1),
    roomName: z.string().min(1),
    boardType: z.string().nullable(),
    priceTotal: z.number(),
    currency: z.string().length(3),
    nightlyRate: z.number(),
    cancellationSummary: z.string().nullable(),
    refundable: z.boolean(),
    hotelAddress: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string().nullable(),
    latitude: z.number().nullable(),
    longitude: z.number().nullable(),
    starRating: z.number().nullable(),
    reviewScore: z.number().nullable(),
    thumbnailUrl: z.string().nullable(),
    amenities: z.array(z.string()),
    checkIn: z.string().date(),
    checkOut: z.string().date(),
    guestCount: z.number().int().positive(),
    offerId: z.string().min(1),
    destinationOptionId: z.string().uuid().nullable().optional(),
    lodgingType: z.enum(["hotel", "resort", "house", "mixed"]).optional()
  })
});

export async function POST(
  request: Request,
  context: { params: Promise<{ outingId: string }> }
) {
  try {
    const { outingId } = await context.params;
    const payload = saveLodgingOptionSchema.parse(await request.json());
    const optionId = await saveLodgingOption({
      outingId,
      option: payload.option
    });

    return NextResponse.json({ optionId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid lodging option payload", details: error.flatten() },
        { status: 400 }
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : (error as Record<string, unknown>)?.message?.toString?.() ?? "Failed to save lodging option";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
