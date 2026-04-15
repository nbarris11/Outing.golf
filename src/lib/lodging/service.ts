import { randomUUID } from "node:crypto";

import { getCurrentProfile } from "@/lib/auth";
import { isDemoMode } from "@/lib/env";
import { logError } from "@/lib/logger";
import { searchHotelBedsHotels } from "@/lib/providers/hotelbeds/hotels";
import {
  bookLiteApiOffer,
  prebookLiteApiOffer,
  searchLiteApiHotels
} from "@/lib/providers/liteapi/hotels";
import type {
  LodgingBookInput,
  LodgingPrebookInput,
  LodgingSearchInput
} from "@/lib/providers/liteapi/types";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { canAccessOuting, canManageOuting, isAdmin } from "@/modules/outings/permissions";
import { getOutingDetail } from "@/modules/outings/service";
import { mockLodgingProvider } from "@/modules/providers/mock-providers";
import type { LodgingSearchResult, Outing } from "@/types/domain";

function inferDestinationOptionId(outingDetail: Awaited<ReturnType<typeof getOutingDetail>>) {
  return outingDetail?.destinations[0]?.id ?? null;
}

async function createFallbackResults(input: LodgingSearchInput, outingDetail: Awaited<ReturnType<typeof getOutingDetail>>) {
  if (!outingDetail) {
    return [];
  }

  const inventory = await mockLodgingProvider.searchLodging({
    outing: outingDetail.outing,
    destinations: outingDetail.destinations,
    preferredType: outingDetail.outing.lodgingPreference,
    guests: input.adults + input.children,
    limitPerDestination: 4
  });

  return inventory.map<LodgingSearchResult>((item) => ({
    provider: "liteapi",
    hotelId: item.hotelId ?? item.id,
    hotelName: item.name,
    roomName: item.roomName ?? "Mock room",
    boardType: item.boardType ?? null,
    priceTotal: item.priceTotal ?? item.nightlyRate,
    currency: item.currency ?? input.currency,
    nightlyRate: item.nightlyRate,
    cancellationSummary: item.cancellationSummary ?? item.summary,
    refundable: item.refundable ?? true,
    hotelAddress: item.hotelAddress ?? null,
    city: item.city ?? null,
    state: item.state ?? null,
    country: item.country ?? null,
    latitude: item.latitude ?? null,
    longitude: item.longitude ?? null,
    starRating: item.starRating ?? null,
    reviewScore: item.reviewScore ?? null,
    thumbnailUrl: item.thumbnailUrl ?? null,
    amenities: item.amenities ?? item.tags,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guestCount: input.adults + input.children,
    offerId: item.offerId ?? `mock-${item.id}`,
    destinationOptionId: item.destinationOptionId,
    lodgingType: item.lodgingType,
    rawProviderData: null
  }));
}

async function isDevelopmentFallbackEnabled() {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return false;
  }

  const { data } = await supabase
    .from("feature_flags")
    .select("enabled")
    .eq("key", "lodging_mock_fallback")
    .maybeSingle();

  return Boolean(data?.enabled);
}

async function getAllowedOuting(outingId: string) {
  const profile = await getCurrentProfile();

  if (!profile) {
    return { profile: null, detail: null };
  }

  const detail = await getOutingDetail(outingId, profile.id);
  return { profile, detail };
}

async function recordLodgingApiError(input: {
  outingId?: string;
  route: string;
  error: unknown;
  context?: Record<string, unknown>;
}) {
  const adminClient = createSupabaseAdminClient();

  if (!adminClient) {
    logError("Lodging API error", input.error, input.context);
    return;
  }

  await adminClient.from("lodging_api_errors").insert({
    outing_id: input.outingId ?? null,
    provider: "liteapi",
    route: input.route,
    error_message: input.error instanceof Error ? input.error.message : String(input.error),
    context_json: input.context ?? {}
  });
}

async function recordSearchRequest(input: {
  outingId?: string;
  request: Record<string, unknown>;
  resultsCount: number;
  usedFallback: boolean;
  status: string;
  errorMessage?: string | null;
  createdBy?: string;
}) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return;
  }

  await supabase.from("lodging_search_requests").insert({
    outing_id: input.outingId ?? null,
    provider: "liteapi",
    destination_query: String(input.request.destination ?? input.request.hotelIds ?? "unknown"),
    request_json: input.request,
    results_count: input.resultsCount,
    used_fallback: input.usedFallback,
    status: input.status,
    error_message: input.errorMessage ?? null,
    created_by: input.createdBy ?? null
  });
}

export async function searchLodgingForUi(input: LodgingSearchInput) {
  const profile = await getCurrentProfile();

  if (!profile) {
    throw new Error("Sign in required");
  }

  let outingDetail: Awaited<ReturnType<typeof getOutingDetail>> = null;

  if (input.outingId) {
    outingDetail = await getOutingDetail(input.outingId, profile.id);

    if (!outingDetail) {
      throw new Error("You do not have access to that outing");
    }
  }

  try {
    const [liteApiResponse, hotelBedsResults] = await Promise.all([
      searchLiteApiHotels(input),
      searchHotelBedsHotels(input) // already returns [] on failure
    ]);
    let results: LodgingSearchResult[] = [
      ...liteApiResponse.results,
      ...hotelBedsResults
    ].map((item) => ({
      ...item,
      destinationOptionId: item.destinationOptionId ?? inferDestinationOptionId(outingDetail) ?? null
    }));
    let usedFallback = false;

    if (!results.length && await isDevelopmentFallbackEnabled()) {
      results = await createFallbackResults(input, outingDetail);
      usedFallback = results.length > 0;
    }

    await recordSearchRequest({
      outingId: input.outingId,
      request: input,
      resultsCount: results.length,
      usedFallback,
      status: "completed",
      createdBy: profile.id
    });

    return {
      results,
      usedFallback
    };
  } catch (error) {
    const usedFallback = await isDevelopmentFallbackEnabled();
    const fallbackResults = usedFallback ? await createFallbackResults(input, outingDetail) : [];

    await recordSearchRequest({
      outingId: input.outingId,
      request: input,
      resultsCount: fallbackResults.length,
      usedFallback,
      status: fallbackResults.length ? "fallback" : "failed",
      errorMessage: error instanceof Error ? error.message : "LiteAPI search failed",
      createdBy: profile.id
    });
    await recordLodgingApiError({
      outingId: input.outingId,
      route: "search",
      error,
      context: { request: input }
    });

    if (fallbackResults.length) {
      return {
        results: fallbackResults,
        usedFallback: true
      };
    }

    throw error;
  }
}

export async function saveLodgingOption(input: {
  outingId: string;
  option: LodgingSearchResult;
}) {
  const { profile, detail } = await getAllowedOuting(input.outingId);

  if (!profile || !detail) {
    throw new Error("Outing not available");
  }

  if (!canManageOuting(detail.outing, profile) && !isAdmin(profile)) {
    throw new Error("Only organizers can save lodging options");
  }

  const writeClient = createSupabaseAdminClient() ?? (await createSupabaseServerClient());

  if (!writeClient) {
    throw new Error("Supabase is not configured");
  }

  const destinationOptionId = input.option.destinationOptionId ?? inferDestinationOptionId(detail);

  if (!destinationOptionId) {
    throw new Error("No destination is available for this outing yet");
  }

  const summaryBits = [
    input.option.roomName,
    input.option.boardType,
    input.option.cancellationSummary
  ].filter(Boolean);

  const row = {
    outing_id: input.outingId,
    destination_option_id: destinationOptionId,
    provider_key: input.option.provider,
    name: input.option.hotelName,
    nightly_rate: Math.round(input.option.nightlyRate),
    price_total: Math.round(input.option.priceTotal),
    currency: input.option.currency,
    lodging_type: input.option.lodgingType ?? "hotel",
    sleeps: input.option.guestCount,
    room_name: input.option.roomName,
    board_type: input.option.boardType,
    cancellation_summary: input.option.cancellationSummary,
    refundable: input.option.refundable,
    hotel_address: input.option.hotelAddress,
    city: input.option.city,
    state: input.option.state,
    country: input.option.country,
    latitude: input.option.latitude,
    longitude: input.option.longitude,
    star_rating: input.option.starRating,
    review_score: input.option.reviewScore,
    thumbnail_url: input.option.thumbnailUrl,
    amenities: input.option.amenities,
    check_in: input.option.checkIn,
    check_out: input.option.checkOut,
    guest_count: input.option.guestCount,
    offer_id: input.option.offerId,
    hotel_id: input.option.hotelId,
    raw_provider_data: input.option.rawProviderData ?? {},
    summary: summaryBits.join(" · ") || "Saved from live hotel search",
    tags: [
      input.option.refundable ? "refundable" : "non-refundable",
      input.option.boardType ?? "room only",
      input.option.starRating ? `${input.option.starRating} star` : "hotel"
    ],
    hidden: false,
    featured: false
  };

  // 1. Check for existing row
  const { data: existing } = await writeClient
    .from("lodging_options")
    .select("id")
    .eq("outing_id", input.outingId)
    .eq("offer_id", input.option.offerId)
    .maybeSingle();

  let savedId: string;
  if (existing) {
    // Update existing
    const { data, error } = await writeClient
      .from("lodging_options")
      .update(row)
      .eq("id", existing.id)
      .select("id")
      .single();
    if (error || !data) throw error ?? new Error("Failed to update lodging option");
    savedId = data.id;
  } else {
    // Insert new
    const { data, error } = await writeClient
      .from("lodging_options")
      .insert(row)
      .select("id")
      .single();
    if (error || !data) throw error ?? new Error("Failed to save lodging option");
    savedId = data.id;
  }

  await writeClient.from("saved_lodging_options").upsert({
    outing_id: input.outingId,
    lodging_option_id: savedId,
    created_by: profile.id
  }, { onConflict: "outing_id,lodging_option_id" });

  return savedId as string;
}

export async function toggleLodgingFavorite(input: {
  outingId: string;
  optionId: string;
}) {
  const { profile, detail } = await getAllowedOuting(input.outingId);

  if (!profile || !detail) {
    throw new Error("Outing not available");
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("outing_id", input.outingId)
    .eq("profile_id", profile.id)
    .eq("entity_type", "lodging")
    .eq("entity_id", input.optionId)
    .maybeSingle();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return { favorited: false };
  }

  await supabase.from("favorites").insert({
    outing_id: input.outingId,
    profile_id: profile.id,
    entity_type: "lodging",
    entity_id: input.optionId
  });

  return { favorited: true };
}

export async function markLodgingTopPick(input: {
  outingId: string;
  optionId: string;
}) {
  const { profile, detail } = await getAllowedOuting(input.outingId);

  if (!profile || !detail) {
    throw new Error("Outing not available");
  }

  if (!canManageOuting(detail.outing, profile) && !isAdmin(profile)) {
    throw new Error("Only organizers can set the top pick");
  }

  const writeClient = createSupabaseAdminClient() ?? (await createSupabaseServerClient());

  if (!writeClient) {
    throw new Error("Supabase is not configured");
  }

  await writeClient.from("lodging_options").update({ top_pick: false }).eq("outing_id", input.outingId);
  await writeClient.from("lodging_options").update({ top_pick: true, featured: true }).eq("id", input.optionId);

  return { topPick: true };
}

export async function createLodgingPrebook(input: LodgingPrebookInput) {
  const { profile, detail } = await getAllowedOuting(input.outingId);

  if (!profile || !detail) {
    throw new Error("Outing not available");
  }

  if (!canManageOuting(detail.outing, profile) && !isAdmin(profile)) {
    throw new Error("Only organizers can create a prebook");
  }

  // Generate clientReference at prebook time so it can be passed through to booking
  const clientReference = `outing-${input.outingId}-${randomUUID()}`;

  try {
    const prebook = await prebookLiteApiOffer({ offerId: input.offerId });
    const supabase = await createSupabaseServerClient();

    await supabase?.from("lodging_prebooks").insert({
      outing_id: input.outingId,
      provider: "liteapi",
      offer_id: input.offerId,
      prebook_id: prebook.prebookId,
      status: "created",
      price_total: prebook.priceTotal,
      currency: prebook.currency,
      expires_at: prebook.expiresAt,
      client_reference: clientReference,
      lodging_option_id: input.lodgingOptionId ?? null,
      response_json: prebook.rawResponse,
      created_by: profile.id
    });

    return { ...prebook, clientReference };
  } catch (error) {
    await recordLodgingApiError({
      outingId: input.outingId,
      route: "prebook",
      error,
      context: { offerId: input.offerId }
    });
    throw error;
  }
}

export async function createLodgingBooking(input: LodgingBookInput) {
  const { profile, detail } = await getAllowedOuting(input.outingId);

  if (!profile || !detail) {
    throw new Error("Outing not available");
  }

  if (!canManageOuting(detail.outing, profile) && !isAdmin(profile)) {
    throw new Error("Only organizers can confirm a booking");
  }

  // Look up the prebook row to get the clientReference generated at prebook time,
  // and to enforce the expiry before charging the guest.
  const supabaseForLookup = await createSupabaseServerClient();
  const { data: prebookRow } = await supabaseForLookup
    ?.from("lodging_prebooks")
    .select("expires_at, client_reference, status")
    .eq("prebook_id", input.prebookId)
    .maybeSingle() ?? { data: null };

  if (prebookRow?.expires_at && new Date(prebookRow.expires_at) <= new Date()) {
    throw new Error("This prebook has expired. Please search again and select a new rate.");
  }

  const clientReference = prebookRow?.client_reference ?? input.clientReference ?? `outing-${input.outingId}-${randomUUID()}`;
  const isSandbox = Boolean(process.env.LITEAPI_API_KEY?.startsWith("sand_"));

  try {
    const booking = await bookLiteApiOffer({
      prebookId: input.prebookId,
      clientReference,
      holder: input.holder,
      guests: input.guests,
      payment: input.payment,
      sandbox: isSandbox
    });
    const supabase = await createSupabaseServerClient();

    await supabase?.from("lodging_bookings").insert({
      outing_id: input.outingId,
      provider: "liteapi",
      prebook_id: input.prebookId,
      provider_booking_id: booking.providerBookingId,
      provider_confirmation_code: booking.confirmationCode,
      status: booking.status,
      total_price: booking.totalPrice,
      currency: booking.currency,
      guest_email: input.guestEmail,
      client_reference: clientReference,
      response_json: booking.rawResponse,
      created_by: profile.id
    });

    return booking;
  } catch (error) {
    await recordLodgingApiError({
      outingId: input.outingId,
      route: "book",
      error,
      context: { prebookId: input.prebookId, clientReference }
    });
    throw error;
  }
}

export async function getLodgingIntegrationStatus() {
  const profile = await getCurrentProfile();

  if (!profile || !isAdmin(profile)) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const configured = Boolean(process.env.LITEAPI_API_KEY);

  const [errorsResult, fallbackFlagResult] = await Promise.all([
    supabase?.from("lodging_api_errors").select("id,route,error_message,created_at").order("created_at", { ascending: false }).limit(8),
    supabase?.from("feature_flags").select("enabled").eq("key", "lodging_mock_fallback").maybeSingle()
  ]);

  return {
    configured,
    mode: isDemoMode ? "demo" : "live",
    provider: process.env.OUTING_LODGING_PROVIDER ?? "mock",
    baseUrl: process.env.LITEAPI_BASE_URL ?? "",
    bookBaseUrl: process.env.LITEAPI_BOOK_BASE_URL ?? "",
    devMockFallbackEnabled: Boolean(fallbackFlagResult?.data?.enabled),
    recentErrors: errorsResult?.data ?? []
  };
}

export async function runLiteApiSandboxTestSearch(input: {
  destination: string;
  checkIn: string;
  checkOut: string;
}) {
  const profile = await getCurrentProfile();

  if (!profile || !isAdmin(profile)) {
    throw new Error("Admin access required");
  }

  const result = await searchLiteApiHotels({
    destination: input.destination,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    adults: 2,
    children: 0,
    rooms: 1,
    currency: "USD"
  });

  return result.results.length;
}
