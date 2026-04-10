import type { LodgingSearchResult } from "@/types/domain";

import {
  type LiteApiBookingResult,
  type LiteApiPrebookResult,
  type LiteApiSearchInput,
  type LiteApiSearchResponse,
  inferLodgingType
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : typeof value === "string" && value.trim()
      ? Number(value)
      : null;
}

function firstNumber(...values: unknown[]) {
  for (const value of values) {
    const parsed = asNumber(value);
    if (parsed !== null) {
      return parsed;
    }
  }

  return null;
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    const parsed = asString(value);
    if (parsed) {
      return parsed;
    }
  }

  return null;
}

function normalizeAmenities(input: unknown) {
  return asArray(input)
    .map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }

      const record = asRecord(item);
      return firstString(record.name, record.label, record.value);
    })
    .filter((item): item is string => Boolean(item));
}

function normalizeCancellationSummary(rate: Record<string, unknown>) {
  const cancellation = asRecord(rate.cancellationPolicies ?? rate.cancellation_policy ?? rate.cancellation);
  return firstString(
    cancellation.summary,
    cancellation.description,
    cancellation.type,
    rate.cancellationSummary
  );
}

function normalizeBoardType(rate: Record<string, unknown>) {
  return firstString(
    rate.boardType,
    asRecord(rate.mealPlan).code,
    asRecord(rate.mealPlan).name,
    asRecord(rate.board).code
  );
}

function normalizeRefundable(rate: Record<string, unknown>) {
  const explicit = rate.refundable;

  if (typeof explicit === "boolean") {
    return explicit;
  }

  const text = firstString(rate.rateType, rate.cancellationType, normalizeCancellationSummary(rate))?.toLowerCase() ?? "";
  return text.includes("refundable") || text.includes("rfn");
}

function normalizePrice(rate: Record<string, unknown>) {
  const retailRate = asRecord(rate.retailRate ?? rate.retail_rate);
  const retailTotal = asArray(retailRate.total)[0];
  const retailSuggested = asArray(retailRate.suggestedSellingPrice)[0];
  const retailInitial = asArray(retailRate.initialPrice)[0];
  const total = firstNumber(
    retailRate.total,
    asRecord(retailTotal).amount,
    asRecord(retailRate.total).amount,
    asRecord(rate.offerRetailRate).amount,
    rate.price,
    rate.total
  );
  const nightly = firstNumber(
    retailRate.suggestedSellingPrice,
    asRecord(retailSuggested).amount,
    asRecord(retailRate.nightlyRate).amount,
    asRecord(rate.suggestedSellingPrice).amount,
    asRecord(retailInitial).amount,
    rate.nightlyRate,
    total
  );
  const currency =
    firstString(
      retailRate.currency,
      asRecord(retailTotal).currency,
      asRecord(retailSuggested).currency,
      asRecord(rate.offerRetailRate).currency,
      asRecord(rate.suggestedSellingPrice).currency,
      rate.currency
    ) ?? "USD";

  return {
    total: total ?? 0,
    nightly: nightly ?? total ?? 0,
    currency
  };
}

function normalizeImageUrl(hotel: Record<string, unknown>) {
  const images = asArray(hotel.images ?? hotel.image_details ?? hotel.photos);
  const firstImage = asRecord(images[0]);
  return firstString(firstImage.url, firstImage.thumbnail, firstImage.imageUrl, hotel.thumbnailUrl);
}

function normalizeAddress(hotel: Record<string, unknown>) {
  const address = asRecord(hotel.address ?? hotel.location);
  return {
    hotelAddress: firstString(address.address, address.line1, hotel.address),
    city: firstString(address.city, hotel.city),
    state: firstString(address.state, hotel.state),
    country: firstString(address.country, address.countryCode, hotel.country)
  };
}

export function normalizeLiteApiSearchResponse(
  response: LiteApiSearchResponse,
  input: LiteApiSearchInput
): LodgingSearchResult[] {
  const nights = Math.max(
    1,
    Math.round(
      (new Date(input.checkOut).getTime() - new Date(input.checkIn).getTime()) / (1000 * 60 * 60 * 24)
    )
  );
  const hotels = asArray(response.hotels).map(asRecord);
  const hotelMap = new Map(
    hotels
      .map((hotel) => [firstString(hotel.hotelId, hotel.id), hotel] as const)
      .filter((entry): entry is [string, Record<string, unknown>] => Boolean(entry[0]))
  );

  return asArray(response.data)
    .flatMap((item) => {
      const hotelRate = asRecord(item);
      const hotelId = firstString(hotelRate.hotelId, hotelRate.hotel_id, hotelRate.id);
      const hotel = hotelId ? hotelMap.get(hotelId) ?? {} : {};
      const rates = asArray(hotelRate.roomTypes ?? hotelRate.rates ?? hotelRate.rooms);

      if (!rates.length) {
        rates.push(hotelRate);
      }

      return rates.map((rawRate) => {
        const rate = asRecord(rawRate);
        const roomName = firstString(
          rate.roomName,
          rate.name,
          asRecord(rate.room).name,
          asRecord(rate.roomType).name,
          "Standard room"
        )!;
        const price = normalizePrice(rate);
        const nightlyRate =
          price.total > 0 && (price.nightly <= 0 || price.nightly > price.total)
            ? price.total / nights
            : price.nightly;
        const boardType = normalizeBoardType(rate);
        const latLng = {
          latitude: firstNumber(hotel.latitude, asRecord(hotel.location).latitude),
          longitude: firstNumber(hotel.longitude, asRecord(hotel.location).longitude)
        };
        const reviewScore = firstNumber(hotel.reviewScore, hotel.rating, asRecord(hotel.reviews).score);
        const starRating = firstNumber(hotel.starRating, hotel.stars, asRecord(hotel.category).rating);

        return {
          provider: "liteapi" as const,
          hotelId: hotelId ?? `unknown-${Math.random().toString(36).slice(2, 8)}`,
          hotelName: firstString(hotel.name, hotelRate.hotelName, "Unnamed hotel")!,
          roomName,
          boardType,
          priceTotal: Math.round(price.total),
          currency: price.currency,
          nightlyRate: Math.round(nightlyRate),
          cancellationSummary: normalizeCancellationSummary(rate),
          refundable: normalizeRefundable(rate),
          ...normalizeAddress(hotel),
          ...latLng,
          starRating,
          reviewScore,
          thumbnailUrl: normalizeImageUrl(hotel),
          amenities: normalizeAmenities(hotel.amenities ?? hotel.facilities),
          checkIn: input.checkIn,
          checkOut: input.checkOut,
          guestCount: input.adults + input.children,
          offerId: firstString(rate.offerId, rate.offer_id, rate.id, hotelRate.offerId) ?? "",
          lodgingType: inferLodgingType({
            boardType,
            hotelName: firstString(hotel.name, hotelRate.hotelName),
            roomName
          }),
          rawProviderData: {
            hotel: hotelId ? hotel : undefined,
            rate
          }
        } satisfies LodgingSearchResult;
      });
    })
    .filter((item) => Boolean(item.offerId));
}

export function normalizeLiteApiPrebookResponse(response: Record<string, unknown>): LiteApiPrebookResult {
  const price = normalizePrice(response);
  const expiresAt = firstString(response.expiresAt, response.expiration, response.expiry);

  return {
    prebookId: firstString(response.prebookId, response.id)!,
    priceTotal: price.total ? Math.round(price.total) : null,
    currency: price.currency ?? null,
    cancellationSummary: normalizeCancellationSummary(response),
    roomDetails: firstString(response.roomName, response.roomTypeName, response.description),
    expiresAt,
    rawResponse: response
  };
}

export function normalizeLiteApiBookingResponse(response: Record<string, unknown>): LiteApiBookingResult {
  const price = normalizePrice(response);

  return {
    providerBookingId: firstString(response.bookingId, response.id, response.providerBookingId),
    confirmationCode: firstString(response.confirmationCode, response.reference, response.bookingReference),
    status: firstString(response.status, "confirmed")!,
    totalPrice: price.total ? Math.round(price.total) : null,
    currency: price.currency ?? null,
    rawResponse: response
  };
}
