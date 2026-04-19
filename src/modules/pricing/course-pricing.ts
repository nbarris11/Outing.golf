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
  const pattern = /[$£€]\s?(\d{2,4})(?:\.\d{1,2})?/g;
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

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length);
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

// ─── Course website scraping ──────────────────────────────────────────────────

const RATE_PATHS = [
  "/rates", "/green-fees", "/greens-fees", "/fees", "/pricing",
  "/tee-times", "/golf/rates", "/course/rates",
  // Common booking-system and CMS patterns
  "/golf-fees", "/golf-rates", "/golf/fees", "/golf/pricing", "/golf/green-fees",
  "/play", "/play/golf", "/play/rates", "/play/fees", "/play/green-fees",
  "/visitors", "/visitor-rates", "/visitor-fees", "/public", "/public-rates",
  "/daily-fee", "/daily-fees", "/daily-rates",
  "/rate-sheet", "/rate-card", "/fee-schedule",
  "/book", "/book-a-tee-time", "/reserve",
  "/course/fees", "/course/pricing",
  "/golf-course/rates", "/golf-course/fees",
  "/membership/public-rates", "/public-play",
  "/tee-time-rates", "/tee-time-fees",
];
const RATE_CONTEXT_WORDS = /\b(greens?\s*fees?|rate|round|18\s*holes?|9\s*holes?|weekday|weekend|twilight|morning|afternoon|cart|walk(?:ing)?|golf|per\s*person|green\s*fee|trail\s*fee|riding|replay|visitor|per\s*round|society|buggy|trolley)\b/i;
const NINE_HOLE_RE = /\b(9[\s-]holes?|nine[\s-]holes?|front\s*9|back\s*9|9[\s-]hole\s*rate|9[\s-]hole\s*fee)\b/i;
const EIGHTEEN_HOLE_RE = /\b(18[\s-]holes?|eighteen[\s-]holes?|full\s*round|per\s*round|18[\s-]hole\s*rate|18[\s-]hole\s*fee)\b/i;
const SCRAPE_TIMEOUT_MS = 5000;

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ");
}

async function fetchHtml(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OutingGolfBot/1.0; +https://outing.golf)",
        Accept: "text/html,application/xhtml+xml"
      }
    });
    if (!response.ok) return null;
    const ct = response.headers.get("content-type") ?? "";
    if (!ct.includes("text/html")) return null;
    const text = await response.text();
    return text.slice(0, 400_000); // cap to 400KB
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

interface TaggedPrice { value: number; is9Hole: boolean; is18Hole: boolean; }

// Extract prices tagged by hole count. Within ~80 chars of rate-related keywords.
function extractTaggedPrices(text: string): TaggedPrice[] {
  const seen = new Set<string>();
  const prices: TaggedPrice[] = [];

  function addPrice(value: number, idx: number, key: string) {
    if (seen.has(key)) return;
    seen.add(key);
    const ctx = text.slice(Math.max(0, idx - 100), idx + 100);
    const is9Hole = NINE_HOLE_RE.test(ctx);
    const is18Hole = EIGHTEEN_HOLE_RE.test(ctx);
    prices.push({ value, is9Hole, is18Hole });
  }

  // Pattern 1: currency prices "$85", "£65", "€75", "$ 85", "£ 65"
  const currencyPattern = /[$£€]\s?(\d{2,4})(?:\.\d{1,2})?/g;
  for (const match of text.matchAll(currencyPattern)) {
    const value = Number(match[1]);
    if (!Number.isFinite(value) || value < 15 || value > 600) continue;
    const idx = match.index ?? 0;
    const ctx = text.slice(Math.max(0, idx - 80), idx + 80);
    if (!RATE_CONTEXT_WORDS.test(ctx)) continue;
    addPrice(value, idx, `${idx}`);
  }

  // Pattern 2: plain numbers near rate keywords — "Weekday: 65", "75/person"
  const plainPattern = /\b(\d{2,3})(?:\.\d{2})?\s*(?:\/\s*(?:person|player|golfer|round|hole))?\b/g;
  for (const match of text.matchAll(plainPattern)) {
    const value = Number(match[1]);
    if (!Number.isFinite(value) || value < 18 || value > 400) continue;
    const idx = match.index ?? 0;
    const ctx = text.slice(Math.max(0, idx - 40), idx + 40);
    if (!RATE_CONTEXT_WORDS.test(ctx)) continue;
    if (value >= 200 && !/weekend|weekday|twilight|morning|afternoon/.test(ctx)) continue;
    addPrice(value, idx, `plain:${idx}`);
  }

  return prices;
}

// Return only 18-hole prices. If none are explicitly labeled, return all prices
// that aren't explicitly labeled as 9-hole. If only 9-hole prices exist, double them.
function extractRatePrices(text: string): number[] {
  const tagged = extractTaggedPrices(text);
  if (tagged.length === 0) return [];

  const explicit18 = tagged.filter((p) => p.is18Hole && !p.is9Hole).map((p) => p.value);
  if (explicit18.length > 0) return explicit18;

  const ambiguous = tagged.filter((p) => !p.is9Hole).map((p) => p.value);
  if (ambiguous.length > 0) return ambiguous;

  // Only 9-hole prices found — double them as a 18-hole estimate
  return tagged.map((p) => Math.round(p.value * 2));
}

// ─── Booking platform API scrapers ───────────────────────────────────────────
// Many courses outsource their tee-time booking to SaaS platforms (TeeItUp,
// ForeUp, Chronogolf). These platforms expose JSON APIs that return real
// current prices — far more accurate than scraping static HTML.

// Detect booking platform links in the homepage HTML and extract IDs/slugs.
function detectBookingPlatform(html: string, base: URL): {
  platform: "teeitup" | "foreup" | "chronogolf" | "lightspeed";
  id: string;
} | null {
  // TeeItUp: href contains "book.teeitup.com" or "teeitup.com" with ?course=NNN
  const teeitupHref = /book\.teeitup\.com[^"']*[?&]course=(\d+)/i;
  const teeitupMatch = html.match(teeitupHref);
  if (teeitupMatch) return { platform: "teeitup", id: teeitupMatch[1] };

  // ForeUp: foreupsoftware.com/index.php/booking/NNN or book.foreup.com
  const foreupHref = /foreupsoftware\.com\/index\.php\/booking\/(\d+)/i;
  const foreupMatch = html.match(foreupHref);
  if (foreupMatch) return { platform: "foreup", id: foreupMatch[1] };

  const foreupBook = /href=["'][^"']*book\.foreup\.com\/[^"']*schedule_id=(\d+)/i;
  const foreupBookMatch = html.match(foreupBook);
  if (foreupBookMatch) return { platform: "foreup", id: foreupBookMatch[1] };

  // Chronogolf / Lightspeed Golf
  const chronoHref = /href=["'][^"']*chronogolf\.com[^"']*club\/(\d+)/i;
  const chronoMatch = html.match(chronoHref);
  if (chronoMatch) return { platform: "chronogolf", id: chronoMatch[1] };

  return null;
}

async function fetchTeeitupPrices(courseId: string): Promise<number[]> {
  const today = new Date().toISOString().slice(0, 10);
  const url = `https://phx.book.teeitup.com/api/tee-time-results?courseId=${courseId}&date=${today}&holes=18&players=4`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" }
    });
    if (!res.ok) return [];
    const data = await res.json() as { teeTimes?: Array<{ price?: number; rates?: Array<{ greenFee?: number }> }> };
    const prices: number[] = [];
    for (const tt of data.teeTimes ?? []) {
      if (tt.price && tt.price >= 15 && tt.price <= 600) prices.push(tt.price);
      for (const r of tt.rates ?? []) {
        if (r.greenFee && r.greenFee >= 15 && r.greenFee <= 600) prices.push(r.greenFee);
      }
    }
    return prices;
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchForeupPrices(scheduleId: string): Promise<number[]> {
  const today = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }).replace(/\//g, "-");
  const url = `https://foreupsoftware.com/index.php/api/booking/times?time=all&date=${today}&holes=18&players=4&schedule_id=${scheduleId}&api_key=no_limits`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" }
    });
    if (!res.ok) return [];
    const data = await res.json() as Array<{ green_fee?: number; price?: number }>;
    if (!Array.isArray(data)) return [];
    return data
      .map((t) => t.green_fee ?? t.price ?? 0)
      .filter((p) => p >= 15 && p <= 600);
  } catch {
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchBookingPlatformPrices(
  html: string,
  base: URL
): Promise<{ prices: number[]; sourceUrl: string; sourceName: string } | null> {
  const detected = detectBookingPlatform(html, base);
  if (!detected) return null;

  let prices: number[] = [];
  let sourceUrl = base.href;

  if (detected.platform === "teeitup") {
    prices = await fetchTeeitupPrices(detected.id);
    sourceUrl = `https://phx.book.teeitup.com (course ${detected.id})`;
  } else if (detected.platform === "foreup") {
    prices = await fetchForeupPrices(detected.id);
    sourceUrl = `https://foreupsoftware.com (schedule ${detected.id})`;
  }

  if (prices.length === 0) return null;
  return { prices, sourceUrl, sourceName: detected.platform === "teeitup" ? "TeeItUp" : "ForeUp" };
}

// Link text / href patterns that strongly indicate a rates page.
const RATES_LINK_RE = /\b(green[\s-]?fees?|greens[\s-]?fees?|rates?|fee\s*schedule|pricing|golf\s*fees?|green\s*fee|daily\s*fees?|public\s*rates?|visitor\s*rates?|play\s*golf|tee\s*times?|book\s*(?:a\s*)?tee|reserve)\b/i;

// Extract all internal hrefs from raw HTML that look like rates pages.
function findRatesLinks(html: string, base: URL): string[] {
  const found: string[] = [];
  const hrefRe = /href=["']([^"'#?][^"']*?)["']/gi;
  for (const match of html.matchAll(hrefRe)) {
    const raw = match[1];
    // Only follow same-domain paths or relative URLs
    let resolved: URL;
    try {
      resolved = new URL(raw, base);
    } catch {
      continue;
    }
    if (resolved.hostname !== base.hostname) continue;
    const path = resolved.pathname.toLowerCase();
    // Check the path itself for rate-related keywords
    if (RATES_LINK_RE.test(path.replace(/[-_/]/g, " "))) {
      found.push(resolved.href);
    }
  }
  // Also check anchor text — extract <a ...>text</a> and match both href and text
  const anchorRe = /<a\s[^>]*href=["']([^"'#?][^"']*?)["'][^>]*>([\s\S]{1,80}?)<\/a>/gi;
  for (const match of html.matchAll(anchorRe)) {
    const raw = match[1];
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    if (!RATES_LINK_RE.test(text)) continue;
    let resolved: URL;
    try {
      resolved = new URL(raw, base);
    } catch {
      continue;
    }
    if (resolved.hostname !== base.hostname) continue;
    found.push(resolved.href);
  }
  return Array.from(new Set(found)).slice(0, 8); // cap discovered links
}

async function scrapeCourseWebsite(
  websiteUri: string
): Promise<{ prices: number[]; pageUrl: string } | null> {
  let base: URL;
  try {
    base = new URL(websiteUri);
  } catch {
    return null;
  }

  // Step 1: fetch the homepage.
  const homepageHtml = await fetchHtml(base.href);
  if (!homepageHtml) return null;

  // Step 2: check for a booking platform (TeeItUp, ForeUp, etc.) — highest accuracy.
  const platformResult = await fetchBookingPlatformPrices(homepageHtml, base);
  if (platformResult && platformResult.prices.length > 0) {
    return { prices: platformResult.prices, pageUrl: platformResult.sourceUrl };
  }

  // Step 3: discover actual rates links from navigation/anchors in the homepage.
  const discoveredLinks = findRatesLinks(homepageHtml, base);

  // Step 4: also try our known common path patterns.
  const guessedUrls = RATE_PATHS.map((p) => new URL(p, base).href);

  // Prioritise discovered links (real), then guesses, then homepage itself.
  const ordered = [...discoveredLinks, ...guessedUrls, base.href];
  const unique = Array.from(new Set(ordered));

  // Fetch all candidates in parallel (homepage already fetched, reuse it).
  const results = await Promise.all(
    unique.map(async (url) => {
      const html = url === base.href ? homepageHtml : await fetchHtml(url);
      if (!html) return null;
      const text = stripHtml(html);
      const prices = extractRatePrices(text);
      return prices.length > 0 ? { url, prices } : null;
    })
  );

  // Prefer a dedicated rates page over the homepage.
  const ratesHit = results.find((r) => r && r.url !== base.href);
  const winner = ratesHit ?? results.find((r) => r !== null);
  if (!winner) return null;
  return { prices: winner.prices, pageUrl: winner.url };
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

// ─── SinglePlatform fallback ──────────────────────────────────────────────────
// Google Maps surfaces SinglePlatform "Menu" pages for many courses that list
// green fees. The Places API doesn't expose this URL, so we construct the slug
// from the course name and try the two most common suffix variants (-0, no suffix).

function toSinglePlatformSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function scrapeSinglePlatform(
  name: string
): Promise<{ prices: number[]; pageUrl: string } | null> {
  const slug = toSinglePlatformSlug(name);
  const candidates = [
    `https://places.singleplatform.com/${slug}-0/menu`,
    `https://places.singleplatform.com/${slug}/menu`,
  ];
  for (const url of candidates) {
    const html = await fetchHtml(url);
    if (!html) continue;
    const text = stripHtml(html);
    const prices = extractRatePrices(text);
    if (prices.length > 0) return { prices, pageUrl: url };
  }
  return null;
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

    let built: BuiltPricing | null = null;

    if (details.websiteUri) {
      const scraped = await scrapeCourseWebsite(details.websiteUri);
      if (scraped && scraped.prices.length > 0) {
        const avg = average(scraped.prices);
        if (avg) {
          built = {
            avgRate: avg,
            weekdayRate: Math.min(...scraped.prices),
            weekendRate: Math.max(...scraped.prices),
            sourceUrl: scraped.pageUrl,
            sourceName: hostFromUrl(scraped.pageUrl),
            notes: `Avg of ${scraped.prices.length} rate${scraped.prices.length !== 1 ? "s" : ""} on course website`,
            confidence: scraped.prices.length >= 2 ? "high" : "medium"
          };
        }
      }
    }

    if (!built) built = buildPricingFromDetails(details);

    // Fallback: try SinglePlatform — Google Maps surfaces these "Menu" pages for
    // many courses with green fee listings, but the Places API doesn't expose the URL.
    if (!built) {
      const sp = await scrapeSinglePlatform(name);
      if (sp && sp.prices.length > 0) {
        const avg = average(sp.prices);
        if (avg) {
          built = {
            avgRate: avg,
            weekdayRate: Math.min(...sp.prices),
            weekendRate: Math.max(...sp.prices),
            sourceUrl: sp.pageUrl,
            sourceName: "SinglePlatform",
            notes: `Avg of ${sp.prices.length} rate${sp.prices.length !== 1 ? "s" : ""} on SinglePlatform`,
            confidence: sp.prices.length >= 2 ? "medium" : "low"
          };
        }
      }
    }

    if (!built) {
      logInfo("No usable pricing signals from any source", { name, location });
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
