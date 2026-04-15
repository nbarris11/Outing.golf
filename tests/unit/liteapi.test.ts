import { describe, expect, it } from "vitest";

import { normalizeLiteApiPrebookResponse, normalizeLiteApiSearchResponse } from "@/lib/providers/liteapi/normalizers";
import {
  lodgingBookInputSchema,
  lodgingPrebookInputSchema,
  lodgingSearchInputSchema
} from "@/lib/providers/liteapi/types";
import { canManageOuting } from "@/modules/outings/permissions";

describe("liteAPI lodging schemas", () => {
  it("accepts valid lodging search input", () => {
    const result = lodgingSearchInputSchema.parse({
      destination: "Scottsdale, Arizona",
      checkIn: "2026-06-10",
      checkOut: "2026-06-13",
      adults: 4,
      children: 0,
      rooms: 2,
      currency: "USD"
    });

    expect(result.destination).toBe("Scottsdale, Arizona");
    expect(result.rooms).toBe(2);
  });

  it("rejects invalid lodging search dates", () => {
    expect(() =>
      lodgingSearchInputSchema.parse({
        destination: "Scottsdale, Arizona",
        checkIn: "2026-06-13",
        checkOut: "2026-06-10",
        adults: 4,
        currency: "USD"
      })
    ).toThrow();
  });

  it("accepts prebook and booking payloads", () => {
    expect(
      lodgingPrebookInputSchema.parse({
        outingId: "11111111-1111-1111-1111-111111111111",
        offerId: "offer_123"
      }).offerId
    ).toBe("offer_123");

    expect(
      lodgingBookInputSchema.parse({
        outingId: "11111111-1111-1111-1111-111111111111",
        prebookId: "pre_123",
        guestEmail: "guest@example.com",
        holder: {
          firstName: "Neil",
          lastName: "Barris",
          email: "guest@example.com"
        },
        guests: [{ firstName: "Neil", lastName: "Barris" }],
        payment: {
          method: "card",
          token: "tok_123"
        }
      }).prebookId
    ).toBe("pre_123");
  });
});

describe("liteAPI normalizers", () => {
  it("normalizes hotel rates into the UI result shape", () => {
    const results = normalizeLiteApiSearchResponse(
      {
        hotels: [
          {
            hotelId: "hotel_1",
            name: "Sunset Resort",
            address: {
              address: "123 Fairway Dr",
              city: "Scottsdale",
              state: "AZ",
              country: "US"
            },
            starRating: 4.5,
            reviewScore: 4.6,
            amenities: [{ name: "Pool" }, { name: "Spa" }],
            images: [{ url: "https://example.com/hotel.jpg" }],
            latitude: 33.5,
            longitude: -111.9
          }
        ],
        data: [
          {
            hotelId: "hotel_1",
            roomTypes: [
              {
                offerId: "offer_1",
                roomName: "King Suite",
                boardType: "BB",
                refundable: true,
                retailRate: {
                  total: 900,
                  suggestedSellingPrice: 300,
                  currency: "USD"
                },
                cancellationPolicies: {
                  summary: "Free cancellation before arrival"
                }
              }
            ]
          }
        ]
      },
      {
        destination: "Scottsdale, Arizona",
        checkIn: "2026-06-10",
        checkOut: "2026-06-13",
        adults: 4,
        children: 0,
        rooms: 2,
        currency: "USD"
      }
    );

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      provider: "liteapi",
      hotelId: "hotel_1",
      hotelName: "Sunset Resort",
      roomName: "King Suite",
      priceTotal: 900,
      nightlyRate: 300,
      refundable: true,
      city: "Scottsdale",
      amenities: ["Pool", "Spa"]
    });
  });

  it("normalizes prebook responses", () => {
    const prebook = normalizeLiteApiPrebookResponse({
      prebookId: "pre_123",
      retailRate: {
        total: 1200,
        currency: "USD"
      },
      cancellationPolicies: {
        summary: "Free cancellation within 24 hours"
      },
      roomName: "Two Queen Room",
      expiresAt: "2026-06-01T12:00:00Z"
    });

    expect(prebook.prebookId).toBe("pre_123");
    expect(prebook.priceTotal).toBe(1200);
    expect(prebook.currency).toBe("USD");
  });
});

describe("lodging save permissions", () => {
  it("lets the organizer manage saved lodging options", () => {
    expect(
      canManageOuting(
        {
          id: "outing_1",
          name: "Pinehurst",
          organizerId: "host_1",
          destinationType: "city",
          destinationLabel: "Pinehurst",
          preferredDateWindows: [],
          budgetTarget: 1200,
          tripStyle: "classic",
          numberOfPlayers: 4,
          golfIntensity: "balanced",
          lodgingPreference: "resort",
          status: "planning",
          organizerWeighting: 3, votingOpen: false,
          teeTimeBookings: [],
          createdAt: "2026-04-10T00:00:00Z"
        },
        {
          id: "host_1",
          email: "host@example.com",
          fullName: "Host User",
          appRole: "member",
          createdAt: "2026-04-10T00:00:00Z"
        }
      )
    ).toBe(true);
  });

  it("blocks non-organizers from managing saved lodging options", () => {
    expect(
      canManageOuting(
        {
          id: "outing_1",
          name: "Pinehurst",
          organizerId: "host_1",
          destinationType: "city",
          destinationLabel: "Pinehurst",
          preferredDateWindows: [],
          budgetTarget: 1200,
          tripStyle: "classic",
          numberOfPlayers: 4,
          golfIntensity: "balanced",
          lodgingPreference: "resort",
          status: "planning",
          organizerWeighting: 3, votingOpen: false,
          teeTimeBookings: [],
          createdAt: "2026-04-10T00:00:00Z"
        },
        {
          id: "friend_1",
          email: "friend@example.com",
          fullName: "Friend User",
          appRole: "member",
          createdAt: "2026-04-10T00:00:00Z"
        }
      )
    ).toBe(false);
  });
});
