import Anthropic from "@anthropic-ai/sdk";

import { env } from "@/lib/env";
import { logError, logInfo } from "@/lib/logger";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const CACHE_TTL_DAYS = 30;
const MODEL = "claude-sonnet-4-6";

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

interface ExtractedPricing {
  weekdayRate: number | null;
  weekendRate: number | null;
  avgRate: number | null;
  sourceUrl: string | null;
  sourceName: string | null;
  notes: string | null;
  confidence: "high" | "medium" | "low";
}

function extractJson(text: string): ExtractedPricing | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    const num = (v: unknown): number | null => {
      if (v == null) return null;
      const n = typeof v === "number" ? v : Number(String(v).replace(/[^0-9.]/g, ""));
      return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
    };
    const conf = ["high", "medium", "low"].includes(parsed.confidence) ? parsed.confidence : "low";
    return {
      weekdayRate: num(parsed.weekdayRate ?? parsed.weekday_rate),
      weekendRate: num(parsed.weekendRate ?? parsed.weekend_rate),
      avgRate: num(parsed.avgRate ?? parsed.avg_rate),
      sourceUrl: typeof parsed.sourceUrl === "string" ? parsed.sourceUrl : null,
      sourceName: typeof parsed.sourceName === "string" ? parsed.sourceName : null,
      notes: typeof parsed.notes === "string" ? parsed.notes : null,
      confidence: conf
    };
  } catch {
    return null;
  }
}

/**
 * Ask Claude (with web search) to find the real greens fee for a course, then cache it.
 * Returns the resulting pricing row, or null on failure / no data.
 */
export async function fetchAndCacheCoursePricing(
  name: string,
  location: string
): Promise<CoursePricing | null> {
  if (!env.ANTHROPIC_API_KEY) {
    logInfo("Skipping course pricing enrichment — ANTHROPIC_API_KEY not set");
    return null;
  }

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  const prompt = `Find the current greens fee (cart-included, regular rate) for this golf course:

Course: ${name}
Location: ${location}

Search the course's official website first, then GolfNow / Supreme Golf / TeeOff as backups. Return ONLY a JSON object with this exact shape — no prose before or after:

{
  "weekdayRate": <number in USD, or null>,
  "weekendRate": <number in USD, or null>,
  "avgRate": <number in USD — best single estimate if only one rate found>,
  "sourceUrl": "<url of the page the price came from>",
  "sourceName": "<short label like 'coursewebsite.com' or 'GolfNow'>",
  "notes": "<short caveat if needed, e.g. 'peak season rate' or null>",
  "confidence": "high" | "medium" | "low"
}

Rules:
- Only include a rate if you actually found it on a web page you can cite.
- Prefer the course's own website over aggregators.
- If you cannot find real pricing, return all null values with confidence "low" and explain in notes.
- Do not make up numbers. Do not use historical/estimated/formulaic pricing.`;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
          max_uses: 4
        }
      ],
      messages: [{ role: "user", content: prompt }]
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      logInfo("Course pricing fetch returned no text", { name, location });
      return null;
    }

    const extracted = extractJson(textBlock.text);
    if (!extracted) {
      logInfo("Course pricing fetch produced unparsable response", { name, location });
      return null;
    }

    // Nothing usable — skip caching so we retry later.
    if (!extracted.avgRate && !extracted.weekdayRate && !extracted.weekendRate) {
      return null;
    }

    const avgRate =
      extracted.avgRate ??
      (extracted.weekdayRate && extracted.weekendRate
        ? Math.round((extracted.weekdayRate + extracted.weekendRate) / 2)
        : extracted.weekdayRate ?? extracted.weekendRate);

    const supabase = createSupabaseAdminClient();
    if (!supabase) return null;

    const lookupKey = buildLookupKey(name, location);
    const row = {
      lookup_key: lookupKey,
      course_name: name,
      location_label: location,
      weekday_rate: extracted.weekdayRate,
      weekend_rate: extracted.weekendRate,
      avg_rate: avgRate,
      source_url: extracted.sourceUrl,
      source_name: extracted.sourceName,
      notes: extracted.notes,
      confidence: extracted.confidence,
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
      weekdayRate: extracted.weekdayRate,
      weekendRate: extracted.weekendRate,
      avgRate,
      sourceUrl: extracted.sourceUrl,
      sourceName: extracted.sourceName,
      notes: extracted.notes,
      confidence: extracted.confidence,
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
