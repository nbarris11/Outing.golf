import { env } from "@/lib/env";
import { logError, logInfo } from "@/lib/logger";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const CACHE_TTL_DAYS = 30;
const PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const PLACE_DETAILS_URL = "https://places.googleapis.com/v1/places";

export interface CoursePricing {
  courseName: string;
  locationLabel: string;
  weekdayRate: number | null;
  weekendRate: number | null;
  avgRate: number | null;
  sourceUrl: string | null;
  sourceName: string | null;
  notes: string | null;
  confidence: "high" | "medium" | "low" | null;
  fetchedAt: string;
}

export function buildLookupKey(name: string, location: string) {
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  return `${norm(name)}|${norm(location)}`;
}

function isFresh(fetchedAt: string) {
  const ageMs = Date.now() - new Date(fetchedAt).getTime();
  return ageMs < CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;
}

interface CachedRow {
  course_name: string;
  location_label: string;
  weekday_rate: number | null;
  weekend_rate: number | null;
  avg_rate: number | null;
  source_url: string | null;
  source_name: string | null;
  notes: string | null;
  confidence: "high" | "medium" | "low" | null;
  fetched_at: string;
}

function rowToPricing(row: CachedRow): CoursePricing {
  return {
    courseName: row.course_name,
    locationLabel: row.location_label,
    weekdayRate: row.weekday_rate,
    weekendRate: row.weekend_rate,
    avgRate: row.avg_rate,
    sourceUrl: row.source_url,
    sourceName: row.source_name,
    notes: row.notes,
    confidence: row.confidence,
    fetchedAt: row.fetched_at
  };
}

export async function getCachedCoursePricing(
  name: string,
  location: string
): Promise<CoursePricing | null> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;

  const lookupKey = buildLookupKey(name, location);
  const { data } = await supabase
    .from("course_pricing")
    .select(
      "course_name,location_label,weekday_rate,weekend_rate,avg_rate,source_url,source_name,notes,confidence,fetched_at"
    )
    .eq("lookup_key", lookupKey)
    .maybeSingle();

  if (!data) return null;
  if (!isFresh(data.fetched_at)) return null;
  return rowToPricing(data as CachedRow);
}

export async function getManyCachedPricings(
  queries: Array<{ name: string; location: string }>
): Promise<Map<string, CoursePricing>> {
  const map = new Map<string, CoursePricing>();
  const supabase = createSupabaseAdminClient();
  if (!supabase || queries.length === 0) return map;

  const keys = queries.map((q) => buildLookupKey(q.name, q.location));
  const { data } = await supabase
    .from("course_pricing")
    .select(
      "lookup_key,course_name,location_label,weekday_rate,weekend_rate,avg_rate,source_url,source_name,notes,confidence,fetched_at"
    )
    .in("lookup_key", keys);

  for (const row of (data ?? []) as Array<CachedRow & { lookup_key: string }>) {
    if (!isFresh(row.fetched_at)) continue;
    map.set(row.lookup_key, rowToPricing(row));
  }
  return map;
}

// ─── Google Places Details + review parsing ──────────────────────────────────

interface PlaceSearchResponse {
  places?: Array<{
    id: string;
    displayName?: { text?: string };
    formattedAddress?: string;
  }>;
}

interface PlaceDetails {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  websiteUri?: string;
  priceLevel?:
    | "PRICE_LEVEL_FREE"
    | "PRICE_LEVEL_INEXPENSIVE"
    | "PRICE_LEVEL_MODERATE"
    | "PRICE_LEVEL_EXPENSIVE"
    | "PRICE_LEVEL_VERY_EXPENSIVE";
  priceRange?: {
    startPrice?: { units?: string };
    endPrice?: { units?: string };
  };
  reviews?: Array<{
    text?: { text?: string };
    rating?: number;
    publishTime?: string;
  }>;
}

async function googleFetch<T>(url: string, init?: RequestInit): Promise<T | null> {
  if (!env.GOOGLE_MAPS_API_KEY) return null;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), env.OUTING_PROVIDER_REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store"
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Google Places ${response.status}: ${body.slice(0, 200)}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function findPlaceId(name: string, location: string): Promise<string | null> {
  const body = {
    textQuery: `${name} ${location}`,
    includedType: "golf_course",
    languageCode: "en",
    regionCode: "US",
    pageSize: 1
  };
  const res = await googleFetch<PlaceSearchResponse>(PLACES_TEXT_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY ?? "",
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress"
    },
    body: JSON.stringify(body)
  });
  return res?.places?.[0]?.id ?? null;
}

async function fetchPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  const fieldMask = [
    "id",
    "displayName",
    "formattedAddress",
    "websiteUri",
    "priceLevel",
    "priceRange",
    "reviews"
  ].join(",");
  return googleFetch<PlaceDetails>(`${PLACE_DETAILS_URL}/${placeId}`, {
    method: "GET",
    headers: {
      "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY ?? "",
      "X-Goog-FieldMask": fieldMask
    }
  });
}

// Extract plausible greens-fee mentions from review text. Matches "$85", "$125.50",
// "paid $60", etc. Filters to reasonable golf-price range.
function extractPricesFromReviews(reviews: PlaceDetails["reviews"]): number[] {
  if (!reviews?.length) return [];
  const pattern = /\$\s?(\d{2,4})(?:\.\d{1,2})?/g;
  const prices: number[] = [];
  for (const review of reviews) {
    const text = review.text?.text;
    if (!text) continue;
    for (const match of text.matchAll(pattern)) {
      const value = Number(match[1]);
      // Plausible greens-fee range — excludes $5 snacks and $5000 memberships.
      if (Number.isFinite(value) && value >= 20 && value <= 500) {
        prices.push(value);
      }
    }
  }
  return prices;
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

// Rough band from Google's priceLevel enum. Used only as a fallback signal when
// review parsing finds nothing.
const PRICE_LEVEL_BAND: Record<string, { low: number; high: number }> = {
  PRICE_LEVEL_INEXPENSIVE: { low: 25, high: 55 },
  PRICE_LEVEL_MODERATE: { low: 55, high: 100 },
  PRICE_LEVEL_EXPENSIVE: { low: 100, high: 175 },
  PRICE_LEVEL_VERY_EXPENSIVE: { low: 175, high: 350 }
};

interface BuiltPricing {
  avgRate: number;
  weekdayRate: number | null;
  weekendRate: number | null;
  sourceUrl: string | null;
  sourceName: string | null;
  notes: string | null;
  confidence: "high" | "medium" | "low";
}

function buildPricingFromDetails(details: PlaceDetails): BuiltPricing | null {
  const reviewPrices = extractPricesFromReviews(details.reviews);

  // Prefer priceRange when Google provides it (newer field, accurate when present).
  const startUnits = details.priceRange?.startPrice?.units;
  const endUnits = details.priceRange?.endPrice?.units;
  const startPrice = startUnits ? Number(startUnits) : null;
  const endPrice = endUnits ? Number(endUnits) : null;
  if (startPrice && endPrice && startPrice >= 20 && endPrice <= 500) {
    const avg = Math.round((startPrice + endPrice) / 2);
    return {
      avgRate: avg,
      weekdayRate: startPrice,
      weekendRate: endPrice,
      sourceUrl: details.websiteUri ?? null,
      sourceName: details.websiteUri ? hostFromUrl(details.websiteUri) : "Google Places",
      notes: "Range from Google Places",
      confidence: "high"
    };
  }

  if (reviewPrices.length >= 2) {
    const avg = median(reviewPrices);
    if (avg) {
      return {
        avgRate: avg,
        weekdayRate: Math.min(...reviewPrices),
        weekendRate: Math.max(...reviewPrices),
        sourceUrl: details.websiteUri ?? null,
        sourceName: "Golfer reviews",
        notes: `Median of ${reviewPrices.length} price mentions in reviews`,
        confidence: "medium"
      };
    }
  }

  if (reviewPrices.length === 1) {
    return {
      avgRate: reviewPrices[0],
      weekdayRate: null,
      weekendRate: null,
      sourceUrl: details.websiteUri ?? null,
      sourceName: "Golfer review",
      notes: "Single price mention in a recent review",
      confidence: "low"
    };
  }

  const band = details.priceLevel ? PRICE_LEVEL_BAND[details.priceLevel] : null;
  if (band) {
    const avg = Math.round((band.low + band.high) / 2);
    return {
      avgRate: avg,
      weekdayRate: band.low,
      weekendRate: band.high,
      sourceUrl: details.websiteUri ?? null,
      sourceName: "Google Places tier",
      notes: `Price tier estimate — actual rate ranges ~$${band.low}-$${band.high}`,
      confidence: "low"
    };
  }

  return null;
}

function hostFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export async function fetchAndCacheCoursePricing(
  name: string,
  location: string
): Promise<CoursePricing | null> {
  if (!env.GOOGLE_MAPS_API_KEY) {
    logInfo("Skipping course pricing enrichment — GOOGLE_MAPS_API_KEY not set");
    return null;
  }

  try {
    const placeId = await findPlaceId(name, location);
    if (!placeId) {
      logInfo("No Google Places match for course", { name, location });
      return null;
    }

    const details = await fetchPlaceDetails(placeId);
    if (!details) return null;

    const built = buildPricingFromDetails(details);
    if (!built) {
      logInfo("Google Places returned no usable pricing signals", { name, location });
      return null;
    }

    const supabase = createSupabaseAdminClient();
    if (!supabase) return null;

    const lookupKey = buildLookupKey(name, location);
    const row = {
      lookup_key: lookupKey,
      course_name: name,
      location_label: location,
      weekday_rate: built.weekdayRate,
      weekend_rate: built.weekendRate,
      avg_rate: built.avgRate,
      source_url: built.sourceUrl,
      source_name: built.sourceName,
      notes: built.notes,
      confidence: built.confidence,
      fetched_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from("course_pricing")
      .upsert(row, { onConflict: "lookup_key" });
    if (error) {
      logError("Failed to cache course pricing", error, { name, location });
    }

    return {
      courseName: name,
      locationLabel: location,
      weekdayRate: built.weekdayRate,
      weekendRate: built.weekendRate,
      avgRate: built.avgRate,
      sourceUrl: built.sourceUrl,
      sourceName: built.sourceName,
      notes: built.notes,
      confidence: built.confidence,
      fetchedAt: row.fetched_at
    };
  } catch (error) {
    logError("Course pricing fetch failed", error, { name, location });
    return null;
  }
}

export async function getOrFetchCoursePricing(
  name: string,
  location: string
): Promise<CoursePricing | null> {
  const cached = await getCachedCoursePricing(name, location);
  if (cached) return cached;
  return fetchAndCacheCoursePricing(name, location);
}
