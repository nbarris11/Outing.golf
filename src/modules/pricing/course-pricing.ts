import { env } from "@/lib/env";
import { logError, logInfo } from "@/lib/logger";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const CACHE_TTL_DAYS = 30;
const PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const PLACE_DETAILS_URL = "https://places.googleapis.com/v1/places";
const SCRAPE_TIMEOUT_MS = 5000;

// ─── Types ────────────────────────────────────────────────────────────────────

export type CourseAccessType = "public" | "semi_private" | "private" | "resort" | "unknown";
export type PriceCategory =
  | "peak_weekday" | "weekend" | "twilight"
  | "junior" | "senior" | "nine_hole" | "cart" | "uncategorized";

export interface CoursePricing {
  courseName: string;
  locationLabel: string;
  weekdayRate: number | null;
  weekendRate: number | null;
  avgRate: number | null;
  sourceUrl: string | null;
  sourceName: string | null;
  notes: string | null;
  confidence: "high" | "medium" | "low" | "none" | null;
  courseAccessType: CourseAccessType | null;
  priceBreakdown: Partial<Record<PriceCategory, number[]>> | null;
  region: string | null;
  fetchedAt: string;
}

interface BuiltPricing {
  weekdayRate: number | null;
  weekendRate: number | null;
  avgRate: number;
  sourceUrl: string | null;
  sourceName: string | null;
  notes: string;
  confidence: "high" | "medium" | "low";
  priceBreakdown: Partial<Record<PriceCategory, number[]>>;
}

// ─── Pre-filter ───────────────────────────────────────────────────────────────

const NON_COURSE_NAME_RE = /minigolf|mini.golf|urban.golf|simulator|indoor.golf|club.?fitting|driving.range|golf.shop|pro.shop|golf.lounge|golf.bar|topgolf|puttshack|footgolf/i;
const GENERIC_NAME_RE = /^(golf\s*course|golf\s*club|golf)$/i;

export function isBookableCourse(name: string, types?: string[]): boolean {
  if (types?.length && !types.includes("golf_course")) return false;
  if (NON_COURSE_NAME_RE.test(name)) return false;
  if (GENERIC_NAME_RE.test(name.trim())) return false;
  return true;
}

// ─── Region detection ─────────────────────────────────────────────────────────

export function detectRegion(location: string): string {
  if (/\b(england|scotland|ireland|wales|northern ireland|n\.\s*ireland|uk|united kingdom)\b/i.test(location)) return "uk_ireland";
  if (/\b(france|germany|italy|spain|portugal|netherlands|belgium|switzerland|austria|sweden|denmark|norway|finland|luxembourg|czech|poland|greece)\b/i.test(location)) return "western_europe";
  if (/\b(japan|korea|singapore|thailand|indonesia|china|hong kong|taiwan|malaysia|philippines|australia|new zealand|vietnam)\b/i.test(location)) return "asia_pacific";
  if (/\b(uae|dubai|abu dhabi|south africa|morocco|kenya|egypt|israel|saudi)\b/i.test(location)) return "other_international";
  if (/\b(mexico|canada|caribbean|bahamas|jamaica|barbados|bermuda|dominican|puerto rico|aruba)\b/i.test(location)) return "north_america";
  return "us";
}

// ─── Region sanity bands ──────────────────────────────────────────────────────

const REGION_BANDS: Record<string, { min: number; max: number }> = {
  us:                   { min: 20,  max: 400 },
  us_resort:            { min: 75,  max: 800 },
  north_america:        { min: 20,  max: 500 },
  western_europe:       { min: 30,  max: 400 },
  uk_ireland:           { min: 25,  max: 400 },
  asia_pacific:         { min: 15,  max: 500 },
  other_international:  { min: 15,  max: 500 },
};

function sanityCheck(
  rate: number,
  region: string,
  accessType: CourseAccessType
): { ok: boolean; note: string } {
  const band = accessType === "resort"
    ? (REGION_BANDS.us_resort)
    : (REGION_BANDS[region] ?? REGION_BANDS.us);
  if (rate < band.min || rate > band.max) {
    return { ok: false, note: `Outside expected range for region (${band.min}–${band.max}) — verify` };
  }
  return { ok: true, note: "" };
}

// ─── Cache helpers ────────────────────────────────────────────────────────────

export function buildLookupKey(name: string, location: string) {
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  return `${norm(name)}|${norm(location)}`;
}

function isFresh(fetchedAt: string) {
  return Date.now() - new Date(fetchedAt).getTime() < CACHE_TTL_DAYS * 86_400_000;
}

interface CachedRow {
  course_name: string; location_label: string;
  weekday_rate: number | null; weekend_rate: number | null; avg_rate: number | null;
  source_url: string | null; source_name: string | null;
  notes: string | null; confidence: "high" | "medium" | "low" | "none" | null;
  course_access_type: CourseAccessType | null;
  price_breakdown: Partial<Record<PriceCategory, number[]>> | null;
  region: string | null; fetched_at: string;
}

function rowToPricing(row: CachedRow): CoursePricing {
  return {
    courseName: row.course_name, locationLabel: row.location_label,
    weekdayRate: row.weekday_rate, weekendRate: row.weekend_rate, avgRate: row.avg_rate,
    sourceUrl: row.source_url, sourceName: row.source_name,
    notes: row.notes, confidence: row.confidence,
    courseAccessType: row.course_access_type,
    priceBreakdown: row.price_breakdown, region: row.region,
    fetchedAt: row.fetched_at,
  };
}

export async function getCachedCoursePricing(name: string, location: string): Promise<CoursePricing | null> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("course_pricing")
    .select("course_name,location_label,weekday_rate,weekend_rate,avg_rate,source_url,source_name,notes,confidence,course_access_type,price_breakdown,region,fetched_at")
    .eq("lookup_key", buildLookupKey(name, location))
    .maybeSingle();
  if (!data || !isFresh(data.fetched_at)) return null;
  return rowToPricing(data as CachedRow);
}

export async function getManyCachedPricings(
  queries: Array<{ name: string; location: string }>
): Promise<Map<string, CoursePricing>> {
  const map = new Map<string, CoursePricing>();
  const supabase = createSupabaseAdminClient();
  if (!supabase || !queries.length) return map;
  const keys = queries.map((q) => buildLookupKey(q.name, q.location));
  const { data } = await supabase
    .from("course_pricing")
    .select("lookup_key,course_name,location_label,weekday_rate,weekend_rate,avg_rate,source_url,source_name,notes,confidence,course_access_type,price_breakdown,region,fetched_at")
    .in("lookup_key", keys);
  for (const row of (data ?? []) as Array<CachedRow & { lookup_key: string }>) {
    if (!isFresh(row.fetched_at)) continue;
    map.set(row.lookup_key, rowToPricing(row));
  }
  return map;
}

// ─── Google Places ────────────────────────────────────────────────────────────

interface PlaceSearchResponse {
  places?: Array<{ id: string; displayName?: { text?: string }; formattedAddress?: string }>;
}

interface PlaceDetails {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  websiteUri?: string;
  priceLevel?: "PRICE_LEVEL_FREE" | "PRICE_LEVEL_INEXPENSIVE" | "PRICE_LEVEL_MODERATE" | "PRICE_LEVEL_EXPENSIVE" | "PRICE_LEVEL_VERY_EXPENSIVE";
  priceRange?: { startPrice?: { units?: string }; endPrice?: { units?: string } };
  reviews?: Array<{ text?: { text?: string }; rating?: number; publishTime?: string }>;
}

async function googleFetch<T>(url: string, init?: RequestInit): Promise<T | null> {
  if (!env.GOOGLE_MAPS_API_KEY) return null;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), env.OUTING_PROVIDER_REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`Google Places ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(id);
  }
}

// Strip full street address down to "City, State" or "City, Country" for
// better Places fuzzy matching on international courses.
function locationToSearchQuery(location: string): string {
  // European province codes like " MI", " PV" appended to address — strip
  const parts = location.split(",").map(s => s.trim());
  if (parts.length >= 3) {
    // "17000 Lincoln St, Grand Haven, MI 49417" → "Grand Haven, MI"
    // "Via Roma 1, Milano, MI, Italy" → "Milano, Italy"
    const city = parts[parts.length - 2];
    const stateCountry = parts[parts.length - 1].replace(/\s+\d+$/, "").trim(); // strip zip
    return `${city}, ${stateCountry}`;
  }
  return location;
}

async function findPlaceId(name: string, location: string): Promise<string | null> {
  const cityQuery = locationToSearchQuery(location);
  const res = await googleFetch<PlaceSearchResponse>(PLACES_TEXT_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY ?? "",
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
    },
    body: JSON.stringify({
      textQuery: `${name} ${cityQuery}`,
      includedType: "golf_course",
      languageCode: "en",
      pageSize: 1,
    }),
  });
  return res?.places?.[0]?.id ?? null;
}

async function fetchPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  const fieldMask = "id,displayName,formattedAddress,websiteUri,priceLevel,priceRange,reviews";
  return googleFetch<PlaceDetails>(`${PLACE_DETAILS_URL}/${placeId}`, {
    method: "GET",
    headers: {
      "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY ?? "",
      "X-Goog-FieldMask": fieldMask,
    },
  });
}

// ─── Access type classification ───────────────────────────────────────────────

const PRIVATE_SIGNALS = /\bmembers?\s*only\b|\bby\s*invitation\b|\binvite[\s-]only\b|\bmembership\s*required\b|\bprivate\s*club\b|\bprivate\s*members\b/i;
const PUBLIC_SIGNALS  = /\bbook\s*a?\s*tee\s*time\b|\breserve\b|\bpublic\s*rate\b|\bdaily\s*fee\b|\bvisitor\s*rate\b|\bonline\s*booking\b|\btee\s*times?\s*available\b/i;
const RESORT_SIGNALS  = /\bresort\b|\blodge\b|\bhotel\b|\bstay\s*&?\s*play\b|\baccommodation\b/i;
const SEMI_SIGNALS    = /\bgolf\s*outing\b|\bouting\s*rate\b|\bgroup\s*rate\b|\bcorporate\s*golf\b|\bguest\s*play\b|\boutings?\s*welcome\b/i;

export function classifyAccessType(
  reviews: PlaceDetails["reviews"],
  homepageText: string | null
): CourseAccessType {
  const reviewText = (reviews ?? []).map(r => r.text?.text ?? "").join(" ");
  const text = ((homepageText ?? "") + " " + reviewText).toLowerCase();

  if (PRIVATE_SIGNALS.test(text) && !PUBLIC_SIGNALS.test(text)) return "private";
  if (RESORT_SIGNALS.test(text) && PUBLIC_SIGNALS.test(text)) return "resort";
  if (SEMI_SIGNALS.test(text)) return "semi_private";
  if (PUBLIC_SIGNALS.test(text)) return "public";
  return "unknown";
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────

async function fetchHtml(url: string): Promise<string | null> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!res.ok) return null;
    if (!(res.headers.get("content-type") ?? "").includes("text/html")) return null;
    const text = await res.text();
    if (text.includes("cf_chl_opt") || text.includes("Just a moment") || text.includes("Enable JavaScript and cookies")) return null;
    return text.slice(0, 500_000);
  } catch { return null; }
  finally { clearTimeout(id); }
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ");
}

// ─── Categorized price extraction ────────────────────────────────────────────

const CATEGORY_RE: Record<PriceCategory, RegExp> = {
  peak_weekday: /\b(weekday|mon[-\s]?fri|monday|tuesday|wednesday|thursday|friday|lunedì|martedì|mercoledì|giovedì|venerdì|montag|dienstag|mittwoch|donnerstag|freitag|lundi|mardi|mercredi|jeudi|vendredi|lunes|martes|miércoles|jueves|viernes|wochentag)\b/i,
  weekend:      /\b(weekend|saturday|sunday|sabato|domenica|samstag|sonntag|samedi|dimanche|sábado|domingo|sat\/sun)\b/i,
  twilight:     /\b(twilight|after\s+\d|late\s+afternoon|dopo\s+le\s+\d|sera|dämmerung|crépuscule|crepúsculo|after\s+noon|pm\s+rate)\b/i,
  junior:       /\b(junior|jr\.?|youth|under[\s-]\d|ragazzi|jugend|jeune|joven|cadet)\b/i,
  senior:       /\b(senior|over[\s-]6\d|anziani|senioren|sénior|55\+|60\+|65\+)\b/i,
  nine_hole:    /\b(9[\s-]holes?|nine[\s-]holes?|9\s*buche|9\s*löcher|9\s*trous|9\s*hoyos|front\s*9|back\s*9|nine\s*hole)\b/i,
  cart:         /\b(cart\s*fee|buggy\s*fee|buggy\s*hire|voiturette|carrello|elektroauto|carrito|cart\s*only|riding\s*fee|trail\s*fee|pull\s*cart)\b/i,
  uncategorized: /./,
};

// Parse a price value from a match string, handling European comma decimals
// and currency symbols: $, £, €, EUR, GBP
function parseCurrencyValue(raw: string): number | null {
  // Remove currency symbols/codes
  let s = raw.replace(/[$£€]|EUR|GBP|USD/gi, "").trim();
  // European comma decimal: "75,50" → "75.50"  (only if comma followed by exactly 2 digits at end)
  s = s.replace(/(\d),(\d{2})$/, "$1.$2");
  // Remove remaining commas (thousands separators)
  s = s.replace(/,/g, "");
  const v = Number(s);
  return Number.isFinite(v) ? v : null;
}

function extractCategorizedPrices(text: string): Partial<Record<PriceCategory, number[]>> {
  const result: Partial<Record<PriceCategory, number[]>> = {};
  const seen = new Set<string>();

  // Match currency values: $85, £65, €75, €75,00, 75€, EUR 75, 75 EUR, 65.00
  const currencyRe = /(?:[$£€]\s?(\d{2,4}(?:[.,]\d{1,2})?)|(\d{2,4}(?:[.,]\d{2})?)\s?(?:[$£€]|EUR|GBP|USD)\b|(?:EUR|GBP|USD)\s?(\d{2,4}(?:[.,]\d{2})?))/gi;
  // Also plain numbers near rate context
  const plainRe = /\b(\d{2,3})(?:\.\d{2})?\s*(?:\/\s*(?:person|player|golfer|round|pp))?\b/g;

  const RATE_CONTEXT = /\b(green[\s-]?fee|greens?\s*fee|rate|round|18\s*holes?|9\s*holes?|weekday|weekend|twilight|morning|afternoon|golf|per\s*person|visitor|society|outing|tariff[ae]?|tarife|preise|prezzi|tarifs|tarifas|per\s*round|buggy|voiturette)\b/i;

  const tryAdd = (value: number, idx: number, key: string) => {
    if (seen.has(key) || value < 15 || value > 700) return;
    const ctx = text.slice(Math.max(0, idx - 100), idx + 100);
    if (!RATE_CONTEXT.test(ctx)) return;
    seen.add(key);

    // Determine category from context
    let assigned: PriceCategory = "uncategorized";
    for (const cat of ["peak_weekday", "weekend", "twilight", "junior", "senior", "nine_hole", "cart"] as PriceCategory[]) {
      if (CATEGORY_RE[cat].test(ctx)) { assigned = cat; break; }
    }

    if (!result[assigned]) result[assigned] = [];
    result[assigned]!.push(value);
  };

  for (const m of text.matchAll(currencyRe)) {
    const raw = m[1] ?? m[2] ?? m[3];
    if (!raw) continue;
    const v = parseCurrencyValue(raw);
    if (v !== null) tryAdd(v, m.index ?? 0, `c${m.index}`);
  }

  for (const m of text.matchAll(plainRe)) {
    const v = Number(m[1]);
    if (v >= 200 && !/weekday|weekend|twilight|morning|afternoon/i.test(
      text.slice(Math.max(0, (m.index ?? 0) - 40), (m.index ?? 0) + 40)
    )) continue; // likely yardage
    tryAdd(v, m.index ?? 0, `n${m.index}`);
  }

  return result;
}

// ─── Rate computation from breakdown ─────────────────────────────────────────

function median(values: number[]): number | null {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? Math.round((s[m - 1] + s[m]) / 2) : s[m];
}

function computeRates(breakdown: Partial<Record<PriceCategory, number[]>>): {
  weekday: number | null; weekend: number | null; avg: number | null;
} {
  // Exclude cart, junior, senior, twilight, nine_hole from rate calculations
  const weekday = median(breakdown.peak_weekday ?? []);
  const uncategorized = median(breakdown.uncategorized ?? []);
  const effectiveWeekday = weekday ?? uncategorized;
  const weekend = median(breakdown.weekend ?? []);
  const effectiveWeekend = weekend ?? (effectiveWeekday ? Math.round(effectiveWeekday * 1.2) : null);

  const avg = effectiveWeekday && effectiveWeekend
    ? Math.round((effectiveWeekday + effectiveWeekend) / 2)
    : effectiveWeekday ?? effectiveWeekend;

  return { weekday: effectiveWeekday, weekend: effectiveWeekend, avg };
}

// ─── JSON-LD extraction ───────────────────────────────────────────────────────

function extractJsonLdPrices(html: string): number[] {
  const prices: number[] = [];
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const items = [JSON.parse(m[1])].flat();
      for (const item of items) {
        const pr: string = item.priceRange ?? item.price ?? "";
        if (pr) {
          for (const nm of pr.matchAll(/[$£€]?\s?(\d{2,3}(?:[.,]\d{2})?)/g)) {
            const v = parseCurrencyValue(nm[1]);
            if (v && v >= 15 && v <= 700) prices.push(v);
          }
        }
        for (const offer of [item.offers, item.hasOfferCatalog?.itemListElement].flat().filter(Boolean)) {
          const p = Number(offer?.price ?? offer?.lowPrice ?? 0);
          if (p >= 15 && p <= 700) prices.push(p);
        }
      }
    } catch { /* malformed */ }
  }
  return prices;
}

// ─── Booking platform APIs ────────────────────────────────────────────────────

// Platforms whose pricing is entirely JS-rendered — no static HTML prices available.
// Detecting these early lets us skip the full link-following crawl (~30 requests)
// and fall through to Google Places signals instead.
const JS_ONLY_PLATFORMS = new Set([
  "golfnow", "ezlinks", "chronogolf", "lightspeed", "clubprophet", "teeon", "golfmanager",
]);

function detectBookingPlatform(html: string): { platform: string; id: string } | null {
  const patterns: Array<[RegExp, string]> = [
    // ── Platforms with working APIs ────────────────────────────────────────────
    [/book\.teeitup\.com[^"']*[?&]course=(\d+)/i, "teeitup"],
    [/phx\.book\.teeitup\.com[^"']*[?&]course=(\d+)/i, "teeitup"],
    [/foreupsoftware\.com\/index\.php\/booking\/(\d+)/i, "foreup"],
    [/book\.foreup\.com[^"']*schedule_id=(\d+)/i, "foreup"],
    // ── GolfNow / Golf Channel Solutions / EZLinks (all same company, JS-only) ─
    [/golfnow-customize/i, "golfnow"],
    [/golf.?channel.?solutions/i, "golfnow"],
    [/golfnow\.com\/book/i, "golfnow"],
    [/golfnow\.com\/widgets/i, "golfnow"],
    [/golfnow\.com\/tee-times\/facility/i, "golfnow"],
    [/ezlinksgolf\.com/i, "golfnow"],
    [/powered\s+by\s+golf\s+channel/i, "golfnow"],
    // ── Other JS-only platforms ────────────────────────────────────────────────
    [/chronogolf\.com[^"']*club\//i, "chronogolf"],
    [/app\.chronogolf\.com/i, "chronogolf"],
    [/lightspeedgolf\.com/i, "lightspeed"],
    [/clubprophet\.com/i, "clubprophet"],
    [/tee-on\.com[^"']*course/i, "teeon"],
    [/golfmanager\.com/i, "golfmanager"],
  ];
  for (const [re, platform] of patterns) {
    const m = html.match(re);
    if (m) return { platform, id: m[1] ?? "detected" };
  }
  return null;
}

async function fetchTeeitupPrices(courseId: string): Promise<number[]> {
  const today = new Date().toISOString().slice(0, 10);
  const url = `https://phx.book.teeitup.com/api/tee-time-results?courseId=${courseId}&date=${today}&holes=18&players=4`;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const data = await res.json() as { teeTimes?: Array<{ price?: number }> };
    return (data.teeTimes ?? []).map(t => t.price ?? 0).filter(p => p >= 15 && p <= 700);
  } catch { return []; }
  finally { clearTimeout(id); }
}

async function fetchForeupPrices(scheduleId: string): Promise<number[]> {
  const date = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  const url = `https://foreupsoftware.com/index.php/api/booking/times?time=all&date=${date}&holes=18&players=4&schedule_id=${scheduleId}&api_key=no_limits`;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const data = await res.json() as Array<{ green_fee?: number; price?: number }>;
    return Array.isArray(data) ? data.map(t => t.green_fee ?? t.price ?? 0).filter(p => p >= 15 && p <= 700) : [];
  } catch { return []; }
  finally { clearTimeout(id); }
}

// ─── Website scraper ──────────────────────────────────────────────────────────

const RATES_LINK_RE = /\b(green[\s-]?fee|greens?\s*fee|rates?|pricing|golf[\s-]?fee|daily[\s-]?fee|visitor|public[\s-]?rate|fee[\s-]?schedule|tee[\s-]?time|book|reserve|play|tariff[ae]?|tarife|preise|prezzi|tarifs|tarifas|quote\s*golf|listino|greenfee)\b/i;

const RATE_PATHS = [
  "/rates", "/green-fees", "/greens-fees", "/fees", "/pricing",
  "/tee-times", "/golf/rates", "/course/rates", "/golf-fees", "/golf-rates",
  "/golf/fees", "/golf/pricing", "/golf/green-fees", "/play", "/play/golf",
  "/play/rates", "/play/fees", "/visitors", "/visitor-rates", "/public-rates",
  "/daily-fees", "/daily-rates", "/fee-schedule", "/book", "/reserve",
  "/course/fees", "/tariffe", "/greenfee", "/preise", "/tarifs", "/tarifas",
];

function findRatesLinks(html: string, base: URL): string[] {
  const found = new Set<string>();
  for (const m of html.matchAll(/href=["']([^"'#][^"']*?)["']/gi)) {
    try {
      const u = new URL(m[1], base);
      if (u.hostname !== base.hostname) continue;
      if (RATES_LINK_RE.test(u.pathname.replace(/[-_/]/g, " "))) found.add(u.href);
    } catch { /* skip */ }
  }
  for (const m of html.matchAll(/<a\s[^>]*href=["']([^"'#][^"']*?)["'][^>]*>([\s\S]{1,80}?)<\/a>/gi)) {
    const text = m[2].replace(/<[^>]+>/g, "").trim();
    if (!RATES_LINK_RE.test(text)) continue;
    try {
      const u = new URL(m[1], base);
      if (u.hostname === base.hostname) found.add(u.href);
    } catch { /* skip */ }
  }
  return Array.from(found).slice(0, 10);
}

async function scrapeCourseWebsite(
  websiteUri: string
): Promise<{ breakdown: Partial<Record<PriceCategory, number[]>>; pageUrl: string } | null> {
  let base: URL;
  try { base = new URL(websiteUri); } catch { return null; }

  const homepageHtml = await fetchHtml(base.href);
  if (!homepageHtml) return null;

  // 1. Booking platform detection
  const platform = detectBookingPlatform(homepageHtml);
  if (platform) {
    // JS-only platforms: all pricing is rendered client-side, static scraping
    // will never find prices. Skip the entire crawl and fall through to
    // Google Places signals — much faster and more accurate than 30 empty fetches.
    if (JS_ONLY_PLATFORMS.has(platform.platform)) {
      logInfo(`[skip-scrape] ${base.hostname} — ${platform.platform} booking widget (JS-only, falling back to Google Places)`);
      return null;
    }
    // Platforms with accessible APIs
    let prices: number[] = [];
    if (platform.platform === "teeitup") prices = await fetchTeeitupPrices(platform.id);
    else if (platform.platform === "foreup") prices = await fetchForeupPrices(platform.id);
    if (prices.length) {
      return {
        breakdown: { uncategorized: prices },
        pageUrl: `${platform.platform} API`,
      };
    }
  }

  // 2. JSON-LD on homepage
  const jlPrices = extractJsonLdPrices(homepageHtml);
  if (jlPrices.length) {
    return { breakdown: { uncategorized: jlPrices }, pageUrl: base.href };
  }

  // 3. Follow real rates links + guessed paths
  const discovered = findRatesLinks(homepageHtml, base);
  const guessed = RATE_PATHS.map(p => new URL(p, base).href);
  const urls = Array.from(new Set([...discovered, ...guessed, base.href]));

  let best: { breakdown: Partial<Record<PriceCategory, number[]>>; pageUrl: string } | null = null;
  let bestCount = 0;

  const results = await Promise.all(
    urls.map(async url => {
      const html = url === base.href ? homepageHtml : await fetchHtml(url);
      if (!html) return null;
      // JSON-LD check on sub-pages
      const jl = extractJsonLdPrices(html);
      if (jl.length) return { url, breakdown: { uncategorized: jl } as Partial<Record<PriceCategory, number[]>> };
      const text = stripHtml(html);
      const breakdown = extractCategorizedPrices(text);
      const total = Object.values(breakdown).flat().length;
      return total > 0 ? { url, breakdown } : null;
    })
  );

  for (const r of results) {
    if (!r) continue;
    const count = Object.values(r.breakdown).flat().length;
    // Prefer dedicated rates pages over homepage
    if (count > bestCount || (count >= bestCount && r.url !== base.href)) {
      best = { breakdown: r.breakdown, pageUrl: r.url };
      bestCount = count;
    }
  }

  return best;
}

// ─── Google Places signals fallback ──────────────────────────────────────────

const PRICE_LEVEL_BAND: Record<string, { low: number; high: number }> = {
  PRICE_LEVEL_INEXPENSIVE: { low: 25, high: 55 },
  PRICE_LEVEL_MODERATE:    { low: 55, high: 100 },
  PRICE_LEVEL_EXPENSIVE:   { low: 100, high: 175 },
  PRICE_LEVEL_VERY_EXPENSIVE: { low: 175, high: 350 },
};

function buildFromGoogleSignals(details: PlaceDetails): BuiltPricing | null {
  const startPrice = details.priceRange?.startPrice?.units ? Number(details.priceRange.startPrice.units) : null;
  const endPrice   = details.priceRange?.endPrice?.units   ? Number(details.priceRange.endPrice.units)   : null;
  if (startPrice && endPrice && startPrice >= 15 && endPrice <= 700) {
    return {
      avgRate: Math.round((startPrice + endPrice) / 2),
      weekdayRate: startPrice, weekendRate: endPrice,
      sourceUrl: details.websiteUri ?? null,
      sourceName: details.websiteUri ? hostFromUrl(details.websiteUri) : "Google Places",
      notes: "Range from Google Places priceRange",
      confidence: "high",
      priceBreakdown: { peak_weekday: [startPrice], weekend: [endPrice] },
    };
  }

  // Review text prices
  const reviewPrices: number[] = [];
  for (const review of details.reviews ?? []) {
    const text = review.text?.text ?? "";
    for (const m of text.matchAll(/\$\s?(\d{2,4})(?:\.\d{1,2})?/g)) {
      const v = Number(m[1]);
      if (v >= 15 && v <= 700) reviewPrices.push(v);
    }
  }
  if (reviewPrices.length >= 2) {
    const med = median(reviewPrices)!;
    return {
      avgRate: med, weekdayRate: Math.min(...reviewPrices), weekendRate: Math.max(...reviewPrices),
      sourceUrl: details.websiteUri ?? null, sourceName: "Golfer reviews",
      notes: `Median of ${reviewPrices.length} price mentions in reviews`,
      confidence: "medium",
      priceBreakdown: { uncategorized: reviewPrices },
    };
  }
  if (reviewPrices.length === 1) {
    return {
      avgRate: reviewPrices[0], weekdayRate: null, weekendRate: null,
      sourceUrl: details.websiteUri ?? null, sourceName: "Golfer review",
      notes: "Single price mention in a review",
      confidence: "low",
      priceBreakdown: { uncategorized: reviewPrices },
    };
  }

  const band = details.priceLevel ? PRICE_LEVEL_BAND[details.priceLevel] : null;
  if (band) {
    return {
      avgRate: Math.round((band.low + band.high) / 2),
      weekdayRate: band.low, weekendRate: band.high,
      sourceUrl: details.websiteUri ?? null, sourceName: "Google Places tier",
      notes: `Price tier estimate — ~$${band.low}–$${band.high}`,
      confidence: "low",
      priceBreakdown: { uncategorized: [band.low, band.high] },
    };
  }

  return null;
}

// ─── GolfNow / TeeOff fallbacks ───────────────────────────────────────────────

async function scrapeBookingAggregator(name: string, location: string): Promise<{ prices: number[]; pageUrl: string } | null> {
  const q = encodeURIComponent(`${name} ${locationToSearchQuery(location)}`);
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const urls = [
    `https://www.golfnow.com/tee-times/search#sort=deal&view=list&holes=18&date=${today}&q=${q}`,
    `https://www.teeoff.com/tee-times?q=${q}`,
  ];
  for (const url of urls) {
    const html = await fetchHtml(url);
    if (!html) continue;
    const text = stripHtml(html);
    const breakdown = extractCategorizedPrices(text);
    const prices = Object.values(breakdown).flat();
    if (prices.length) return { prices, pageUrl: url };
  }
  return null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hostFromUrl(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function fetchAndCacheCoursePricing(
  name: string,
  location: string
): Promise<CoursePricing | null> {
  if (!env.GOOGLE_MAPS_API_KEY) {
    logInfo("Skipping course pricing — GOOGLE_MAPS_API_KEY not set");
    return null;
  }

  // Step 0 — pre-filter
  if (!isBookableCourse(name)) {
    logInfo(`[skip] ${name} — not a bookable golf course`);
    return null;
  }

  const region = detectRegion(location);

  try {
    // Step 1 — Google Places lookup
    const placeId = await findPlaceId(name, location);
    if (!placeId) {
      logInfo(`[miss] ${name} — no Google Places match`);
      return null;
    }

    const details = await fetchPlaceDetails(placeId);
    if (!details) return null;

    // Fetch homepage for access classification
    const homepageHtml = details.websiteUri ? await fetchHtml(details.websiteUri) : null;
    const homepageText = homepageHtml ? stripHtml(homepageHtml) : null;

    // Classify access type
    const accessType = classifyAccessType(details.reviews, homepageText);

    // Step 0b — skip private clubs
    if (accessType === "private") {
      logInfo(`[skip] ${name} — private club, no scrape attempted`);
      const supabase = createSupabaseAdminClient();
      if (supabase) {
        await supabase.from("course_pricing").upsert({
          lookup_key: buildLookupKey(name, location),
          course_name: name, location_label: location,
          weekday_rate: null, weekend_rate: null, avg_rate: null,
          source_url: null, source_name: null,
          notes: "Private club — no public pricing",
          confidence: "none",
          course_access_type: "private",
          price_breakdown: null, region,
          fetched_at: new Date().toISOString(),
        }, { onConflict: "lookup_key" });
      }
      return null;
    }

    let built: BuiltPricing | null = null;

    // Step 3 — website scrape
    if (details.websiteUri && homepageHtml) {
      const scraped = await scrapeCourseWebsite(details.websiteUri);
      if (scraped) {
        const rates = computeRates(scraped.breakdown);
        if (rates.avg) {
          const totalPrices = Object.values(scraped.breakdown).flat().length;
          built = {
            avgRate: rates.avg,
            weekdayRate: rates.weekday,
            weekendRate: rates.weekend,
            sourceUrl: scraped.pageUrl,
            sourceName: scraped.pageUrl.includes("API") ? scraped.pageUrl : hostFromUrl(scraped.pageUrl),
            notes: `From ${totalPrices} rate${totalPrices !== 1 ? "s" : ""} on course website`,
            confidence: totalPrices >= 3 ? "high" : totalPrices >= 1 ? "medium" : "low",
            priceBreakdown: scraped.breakdown,
          };
        }
      }
    }

    // Step 4 — Google Places signals
    if (!built) built = buildFromGoogleSignals(details);

    // Step 5 — booking aggregators
    if (!built) {
      const agg = await scrapeBookingAggregator(name, location);
      if (agg && agg.prices.length) {
        const med = median(agg.prices)!;
        built = {
          avgRate: med,
          weekdayRate: Math.min(...agg.prices),
          weekendRate: Math.max(...agg.prices),
          sourceUrl: agg.pageUrl,
          sourceName: hostFromUrl(agg.pageUrl),
          notes: `Median of ${agg.prices.length} tee-time rates from ${hostFromUrl(agg.pageUrl)}`,
          confidence: agg.prices.length >= 3 ? "medium" : "low",
          priceBreakdown: { uncategorized: agg.prices },
        };
      }
    }

    if (!built) {
      logInfo(`[miss] ${name} — scraped but no price extracted`);
      if (accessType === "semi_private") {
        const supabase = createSupabaseAdminClient();
        if (supabase) {
          await supabase.from("course_pricing").upsert({
            lookup_key: buildLookupKey(name, location),
            course_name: name, location_label: location,
            weekday_rate: null, weekend_rate: null, avg_rate: null,
            source_url: null, source_name: null,
            notes: "Semi-private — contact course for outing rates",
            confidence: "none",
            course_access_type: "semi_private",
            price_breakdown: null, region,
            fetched_at: new Date().toISOString(),
          }, { onConflict: "lookup_key" });
        }
      }
      return null;
    }

    // Sanity check
    let { confidence } = built;
    let notes = built.notes;
    const check = sanityCheck(built.avgRate, region, accessType);
    if (!check.ok) {
      confidence = confidence === "high" ? "medium" : "low";
      notes = `${notes} — ${check.note}`;
    }

    // Persist
    const supabase = createSupabaseAdminClient();
    if (!supabase) return null;

    const row = {
      lookup_key: buildLookupKey(name, location),
      course_name: name, location_label: location,
      weekday_rate: built.weekdayRate,
      weekend_rate: built.weekendRate,
      avg_rate: built.avgRate,
      source_url: built.sourceUrl,
      source_name: built.sourceName,
      notes,
      confidence,
      course_access_type: accessType,
      price_breakdown: built.priceBreakdown,
      region,
      fetched_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("course_pricing").upsert(row, { onConflict: "lookup_key" });
    if (error) logError("Failed to cache course pricing", error, { name, location });

    return {
      courseName: name, locationLabel: location,
      weekdayRate: built.weekdayRate, weekendRate: built.weekendRate, avgRate: built.avgRate,
      sourceUrl: built.sourceUrl, sourceName: built.sourceName,
      notes, confidence,
      courseAccessType: accessType,
      priceBreakdown: built.priceBreakdown,
      region,
      fetchedAt: row.fetched_at,
    };

  } catch (error) {
    logError("Course pricing fetch failed", error, { name, location });
    return null;
  }
}

export async function getOrFetchCoursePricing(name: string, location: string): Promise<CoursePricing | null> {
  const cached = await getCachedCoursePricing(name, location);
  if (cached) return cached;
  return fetchAndCacheCoursePricing(name, location);
}
