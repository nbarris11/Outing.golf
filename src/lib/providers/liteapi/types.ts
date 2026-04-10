import { z } from "zod";

import type { LodgingSearchResult, LodgingType } from "@/types/domain";

export class LiteApiRequestError extends Error {
  status: number;
  path: string;
  code?: string;
  details?: unknown;

  constructor(input: { message: string; status: number; path: string; code?: string; details?: unknown }) {
    super(input.message);
    this.name = "LiteApiRequestError";
    this.status = input.status;
    this.path = input.path;
    this.code = input.code;
    this.details = input.details;
  }
}

export const lodgingSearchInputSchema = z.object({
  destination: z.string().trim().min(2).optional(),
  hotelIds: z.array(z.string().trim().min(1)).optional(),
  checkIn: z.string().date(),
  checkOut: z.string().date(),
  adults: z.coerce.number().int().positive().default(2),
  children: z.coerce.number().int().min(0).default(0),
  rooms: z.coerce.number().int().positive().default(1),
  currency: z.string().trim().length(3).default("USD"),
  outingId: z.string().uuid().optional(),
  starRating: z.array(z.coerce.number()).optional(),
  refundableOnly: z.coerce.boolean().optional(),
  hotelStyle: z.enum(["hotel", "resort", "house", "mixed"]).optional(),
  minReviewScore: z.coerce.number().min(0).max(5).optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional()
}).refine((value) => Boolean(value.destination || value.hotelIds?.length), {
  message: "Provide a destination or at least one hotel ID",
  path: ["destination"]
}).refine((value) => new Date(value.checkOut) > new Date(value.checkIn), {
  message: "Check-out must be after check-in",
  path: ["checkOut"]
});

export type LodgingSearchInput = z.infer<typeof lodgingSearchInputSchema>;
export type LiteApiSearchInput = LodgingSearchInput;

export const lodgingPrebookInputSchema = z.object({
  outingId: z.string().uuid(),
  offerId: z.string().trim().min(1)
});

export type LodgingPrebookInput = z.infer<typeof lodgingPrebookInputSchema>;

export const lodgingBookInputSchema = z.object({
  outingId: z.string().uuid(),
  prebookId: z.string().trim().min(1),
  guestEmail: z.string().email(),
  clientReference: z.string().trim().min(1).max(120).optional(),
  holder: z.object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    email: z.string().email(),
    phone: z.string().trim().min(3).optional()
  }),
  guests: z.array(
    z.object({
      firstName: z.string().trim().min(1),
      lastName: z.string().trim().min(1)
    })
  ).min(1),
  payment: z.object({
    method: z.string().trim().min(1),
    token: z.string().trim().min(1).optional(),
    cardNumber: z.string().trim().min(12).optional(),
    cardExpMonth: z.string().trim().min(1).optional(),
    cardExpYear: z.string().trim().min(2).optional(),
    cardCvc: z.string().trim().min(3).optional(),
    billingAddress: z.object({
      line1: z.string().trim().min(1),
      city: z.string().trim().min(1),
      state: z.string().trim().min(1).optional(),
      postalCode: z.string().trim().min(1),
      country: z.string().trim().length(2)
    }).optional()
  })
});

export type LodgingBookInput = z.infer<typeof lodgingBookInputSchema>;

export interface LiteApiSearchResponse {
  data?: unknown[];
  hotels?: unknown[];
  [key: string]: unknown;
}

export interface LiteApiPrebookResult {
  prebookId: string;
  priceTotal: number | null;
  currency: string | null;
  cancellationSummary: string | null;
  roomDetails: string | null;
  expiresAt: string | null;
  rawResponse: Record<string, unknown>;
}

export interface LiteApiBookingResult {
  providerBookingId: string | null;
  confirmationCode: string | null;
  status: string;
  totalPrice: number | null;
  currency: string | null;
  rawResponse: Record<string, unknown>;
}

export interface LiteApiSearchResultEnvelope {
  results: LodgingSearchResult[];
  rawResponse: Record<string, unknown>;
}

export function inferLodgingType(input: {
  boardType?: string | null;
  hotelName?: string | null;
  roomName?: string | null;
}): LodgingType {
  const haystack = `${input.hotelName ?? ""} ${input.roomName ?? ""} ${input.boardType ?? ""}`.toLowerCase();

  if (haystack.includes("resort")) {
    return "resort";
  }

  if (haystack.includes("villa") || haystack.includes("house") || haystack.includes("apartment")) {
    return "house";
  }

  return "hotel";
}
