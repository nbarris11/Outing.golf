import { logError, logInfo } from "@/lib/logger";
import { searchLiteApiHotels } from "@/lib/providers/liteapi/hotels";
import type { LodgingSearchInput } from "@/lib/providers/liteapi/types";
import type { LodgingOption } from "@/types/domain";
import { generateId } from "@/lib/utils";

import { mockLodgingProvider } from "./mock-providers";
import type { LodgingProvider } from "./interfaces";

export const liteApiLodgingProvider: LodgingProvider = {
  definition: {
    id: "liteapi",
    key: "liteapi-lodging",
    label: "liteAPI hotel rates and booking",
    availability: "implemented",
    env: ["LITEAPI_BASE_URL", "LITEAPI_BOOK_BASE_URL", "LITEAPI_API_KEY"],
    notes: "Uses liteAPI server-side hotel search, prebook, and booking flows with normalized lodging results.",
    integrationTouchpoints: [
      "src/lib/providers/liteapi/client.ts",
      "src/lib/providers/liteapi/hotels.ts",
      "app/api/lodging/search/route.ts"
    ]
  },
  async searchLodging(input) {
    const primaryDestination = input.destinations[0];
    const defaultWindow = input.outing.preferredDateWindows[0];

    if (!primaryDestination || !defaultWindow) {
      return mockLodgingProvider.searchLodging(input);
    }

    const request: LodgingSearchInput = {
      destination: `${primaryDestination.name}, ${primaryDestination.region}`,
      checkIn: defaultWindow.start,
      checkOut: defaultWindow.end,
      adults: Math.max(1, Math.min(input.guests, 8)),
      children: 0,
      rooms: Math.max(1, Math.ceil(input.guests / 2)),
      currency: "USD"
    };

    try {
      const { results } = await searchLiteApiHotels(request);

      if (!results.length) {
        logInfo("LiteAPI returned no lodging results for outing inventory seeding", {
          outingId: input.outing.id,
          destination: request.destination
        });
        return [];
      }

      const named = results.filter((item) => {
        const n = (item.hotelName ?? "").trim().toLowerCase();
        return n.length > 0 && n !== "unnamed" && !n.startsWith("unnamed hotel") && !n.startsWith("unnamed property");
      });

      return named.slice(0, input.limitPerDestination ?? 4).map<LodgingOption>((item) => ({
        id: generateId("lodging"),
        outingId: input.outing.id,
        destinationOptionId: primaryDestination.id,
        providerKey: "liteapi",
        name: item.hotelName,
        nightlyRate: item.nightlyRate,
        priceTotal: item.priceTotal,
        currency: item.currency,
        lodgingType: item.lodgingType ?? input.preferredType,
        sleeps: input.guests,
        roomName: item.roomName,
        boardType: item.boardType,
        cancellationSummary: item.cancellationSummary,
        refundable: item.refundable,
        hotelAddress: item.hotelAddress,
        city: item.city,
        state: item.state,
        country: item.country,
        latitude: item.latitude,
        longitude: item.longitude,
        starRating: item.starRating,
        reviewScore: item.reviewScore,
        thumbnailUrl: item.thumbnailUrl,
        amenities: item.amenities,
        checkIn: item.checkIn,
        checkOut: item.checkOut,
        guestCount: item.guestCount,
        offerId: item.offerId,
        hotelId: item.hotelId,
        topPick: false,
        summary:
          item.cancellationSummary ??
          `${item.roomName}${item.boardType ? ` · ${item.boardType}` : ""}`.trim(),
        tags: [item.refundable ? "refundable" : "non-refundable", item.boardType ?? "room only"],
        featured: false,
        hidden: false
      }));
    } catch (error) {
      logError("LiteAPI lodging provider failed during inventory fetch", error, {
        outingId: input.outing.id,
        destination: request.destination
      });
      return [];
    }
  }
};
