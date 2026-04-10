import { env } from "@/lib/env";

import { liteApiFetchJson } from "./client";
import {
  normalizeLiteApiBookingResponse,
  normalizeLiteApiPrebookResponse,
  normalizeLiteApiSearchResponse
} from "./normalizers";
import type {
  LiteApiBookingResult,
  LiteApiPrebookResult,
  LiteApiSearchInput,
  LiteApiSearchResultEnvelope
} from "./types";

function buildOccupancies(input: LiteApiSearchInput) {
  const rooms = Math.max(1, input.rooms);
  const adultsPerRoom = Math.max(1, Math.ceil(input.adults / rooms));
  const childrenPerRoom = input.children > 0 ? Math.ceil(input.children / rooms) : 0;

  return Array.from({ length: rooms }, () => ({
    adults: adultsPerRoom,
    ...(childrenPerRoom > 0 ? { children: Array.from({ length: childrenPerRoom }, () => 8) } : {})
  }));
}

export async function searchLiteApiHotels(input: LiteApiSearchInput): Promise<LiteApiSearchResultEnvelope> {
  const body: Record<string, unknown> = {
    checkin: input.checkIn,
    checkout: input.checkOut,
    currency: input.currency.toUpperCase(),
    guestNationality: "US",
    occupancies: buildOccupancies(input),
    timeout: 10,
    maxRatesPerHotel: 3,
    includeHotelData: true,
    roomMapping: true
  };

  if (input.hotelIds?.length) {
    body.hotelIds = input.hotelIds;
  } else if (input.destination) {
    body.aiSearch = input.destination;
  }

  if (input.starRating?.length) {
    body.starRating = input.starRating;
  }

  if (input.refundableOnly) {
    body.refundableRatesOnly = true;
  }

  if (input.minReviewScore) {
    body.minRating = input.minReviewScore;
  }

  if (input.priceMin !== undefined) {
    body.minPrice = input.priceMin;
  }

  if (input.priceMax !== undefined) {
    body.maxPrice = input.priceMax;
  }

  const rawResponse = await liteApiFetchJson<Record<string, unknown>>("/hotels/rates", {
    method: "POST",
    baseUrl: env.LITEAPI_BASE_URL,
    body
  });

  return {
    results: normalizeLiteApiSearchResponse(rawResponse, input),
    rawResponse
  };
}

export async function prebookLiteApiOffer(input: { offerId: string }): Promise<LiteApiPrebookResult> {
  const rawResponse = await liteApiFetchJson<Record<string, unknown>>("/rates/prebook", {
    method: "POST",
    baseUrl: env.LITEAPI_BOOK_BASE_URL,
    body: {
      offerId: input.offerId,
      usePaymentSdk: false
    }
  });

  return normalizeLiteApiPrebookResponse(rawResponse);
}

export async function bookLiteApiOffer(input: {
  prebookId: string;
  clientReference?: string;
  holder: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  guests: Array<{
    firstName: string;
    lastName: string;
  }>;
  payment: Record<string, unknown>;
}): Promise<LiteApiBookingResult> {
  const rawResponse = await liteApiFetchJson<Record<string, unknown>>("/rates/book", {
    method: "POST",
    baseUrl: env.LITEAPI_BOOK_BASE_URL,
    body: {
      prebookId: input.prebookId,
      clientReference: input.clientReference,
      holder: input.holder,
      guests: input.guests,
      payment: input.payment
    }
  });

  return normalizeLiteApiBookingResponse(rawResponse);
}
