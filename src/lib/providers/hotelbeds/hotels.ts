import { logError } from "@/lib/logger";
import type { LodgingSearchResult } from "@/types/domain";

import { hotelBedsFetch } from "./client";
import { resolveDestinationCode } from "./destinations";
import { normalizeHotelBedsResponse } from "./normalizers";
import type { HotelBedsSearchInput } from "./types";

interface HotelBedsAvailabilityResponse {
  hotels: {
    hotels: unknown[];
    checkIn: string;
    checkOut: string;
  };
}

function buildOccupancies(input: HotelBedsSearchInput) {
  const rooms = Math.max(1, input.rooms);
  const adultsPerRoom = Math.max(1, Math.ceil(input.adults / rooms));
  const childrenPerRoom = input.children > 0 ? Math.ceil(input.children / rooms) : 0;

  return Array.from({ length: rooms }, () => ({
    rooms: 1,
    adults: adultsPerRoom,
    children: childrenPerRoom,
    ...(childrenPerRoom > 0
      ? { paxes: Array.from({ length: childrenPerRoom }, () => ({ type: "CH", age: 8 })) }
      : {})
  }));
}

export async function searchHotelBedsHotels(
  input: HotelBedsSearchInput
): Promise<LodgingSearchResult[]> {
  try {
    const destinationCode = await resolveDestinationCode(input.destination ?? "");

    if (!destinationCode) {
      return [];
    }

    const body = {
      stay: {
        checkIn: input.checkIn,
        checkOut: input.checkOut
      },
      occupancies: buildOccupancies(input),
      destination: { code: destinationCode },
      filter: { minCategory: 1, maxCategory: 5 },
      reviews: [
        {
          type: "TRIPADVISOR",
          maxRate: 5,
          minRate: 0,
          minReviewCount: 10
        }
      ]
    };

    const response = await hotelBedsFetch<HotelBedsAvailabilityResponse>(
      "/hotel-api/1.0/hotels",
      {
        method: "POST",
        body: body as Record<string, unknown>
      }
    );

    const hotels = response?.hotels?.hotels ?? [];
    return normalizeHotelBedsResponse(hotels, input);
  } catch (error) {
    logError("HotelBeds search failed", error, {
      destination: input.destination,
      checkIn: input.checkIn,
      checkOut: input.checkOut
    });
    return [];
  }
}
