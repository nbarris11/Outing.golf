import { inferLodgingType } from "@/lib/providers/liteapi/types";
import type { LodgingSearchResult } from "@/types/domain";

import type { HotelBedsSearchInput } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  return null;
}

function parseStarRating(categoryCode: unknown): number | null {
  const code = asString(categoryCode);

  if (!code) {
    return null;
  }

  // e.g. "4EST" → 4
  const match = code.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

function formatCancellationSummary(
  cancellationPolicies: unknown[]
): string {
  if (!cancellationPolicies.length) {
    return "Free cancellation";
  }

  const first = asRecord(cancellationPolicies[0]);
  const from = asString(first.from);
  return from ? `Non-refundable from ${from}` : "Non-refundable";
}

export function normalizeHotelBedsResponse(
  hotels: unknown[],
  input: HotelBedsSearchInput
): LodgingSearchResult[] {
  const nights = Math.max(
    1,
    Math.round(
      (new Date(input.checkOut).getTime() - new Date(input.checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const results: LodgingSearchResult[] = [];

  for (const rawHotel of hotels) {
    const hotel = asRecord(rawHotel);
    const hotelCode = hotel.code;
    const hotelName = asString(hotel.name) ?? "Unnamed hotel";
    const starRating = parseStarRating(hotel.categoryCode);
    const latitude = asNumber(hotel.latitude) !== null ? parseFloat(String(hotel.latitude)) : null;
    const longitude = asNumber(hotel.longitude) !== null ? parseFloat(String(hotel.longitude)) : null;
    const currency = asString(hotel.currency) ?? "EUR";

    const rooms = asArray(hotel.rooms);

    for (const rawRoom of rooms) {
      const room = asRecord(rawRoom);
      const roomName = asString(room.name) ?? "Standard room";
      const rates = asArray(room.rates);

      for (const rawRate of rates) {
        const rate = asRecord(rawRate);

        // Filter out non-bookable rates
        if (asString(rate.rateType) !== "BOOKABLE") {
          continue;
        }

        const rateKey = asString(rate.rateKey);

        if (!rateKey) {
          continue;
        }

        const sellingRate = asNumber(rate.sellingRate);
        const net = asNumber(rate.net);
        const rawPrice = sellingRate !== null ? sellingRate : net;

        if (rawPrice === null) {
          continue;
        }

        const priceTotal = Math.round(rawPrice);
        const nightlyRate = Math.round(priceTotal / nights);
        const rateClass = asString(rate.rateClass);
        const refundable = rateClass !== "NRF";
        const cancellationPolicies = asArray(rate.cancellationPolicies);
        const cancellationSummary = formatCancellationSummary(cancellationPolicies);
        const boardCode = asString(rate.boardCode);

        const lodgingType = inferLodgingType({
          hotelName,
          roomName,
          boardType: boardCode
        });

        results.push({
          provider: "hotelbeds" as const,
          hotelId: `hotelbeds-${hotelCode}`,
          hotelName,
          roomName,
          boardType: boardCode,
          priceTotal,
          currency,
          nightlyRate,
          cancellationSummary,
          refundable,
          hotelAddress: null,
          city: asString(hotel.zoneName),
          state: null,
          country: asString(hotel.destinationCode),
          latitude,
          longitude,
          starRating,
          reviewScore: null,
          thumbnailUrl: null,
          amenities: [],
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          guestCount: input.adults + input.children,
          offerId: rateKey,
          lodgingType,
          rawProviderData: { hotel: { code: hotelCode, name: hotelName }, rate }
        } satisfies LodgingSearchResult);
      }
    }
  }

  return results;
}
