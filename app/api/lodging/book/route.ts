import { NextResponse } from "next/server";
import { z } from "zod";

import { createLodgingBooking } from "@/lib/lodging/service";
import { lodgingBookInputSchema } from "@/lib/providers/liteapi/types";

export async function POST(request: Request) {
  try {
    const payload = lodgingBookInputSchema.parse(await request.json());
    const booking = await createLodgingBooking(payload);

    return NextResponse.json({
      providerBookingId: booking.providerBookingId,
      confirmationCode: booking.confirmationCode,
      status: booking.status,
      totalPrice: booking.totalPrice,
      currency: booking.currency
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid booking request", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Booking failed" },
      { status: 500 }
    );
  }
}
