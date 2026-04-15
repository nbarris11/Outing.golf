import type { LodgingSearchInput } from "@/lib/providers/liteapi/types";

export class HotelBedsRequestError extends Error {
  status: number;
  path: string;
  code?: string;
  details?: unknown;

  constructor(input: { message: string; status: number; path: string; code?: string; details?: unknown }) {
    super(input.message);
    this.name = "HotelBedsRequestError";
    this.status = input.status;
    this.path = input.path;
    this.code = input.code;
    this.details = input.details;
  }
}

export type HotelBedsSearchInput = LodgingSearchInput;
