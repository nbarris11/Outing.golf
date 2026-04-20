/**
 * Retry pricing enrichment for courses that failed the bulk scraper.
 * Uses additional sources: JSON-LD structured data, Golf Advisor, EZLinks,
 * Club Prophet, and deeper website crawling — always targeting 18-hole rates.
 *
 * Usage:
 *   npx tsx scripts/retry-failed-pricing.ts
 *   npx tsx scripts/retry-failed-pricing.ts --limit 100
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { createSupabaseAdminClient } from "../src/lib/supabase/admin";
import { env } from "../src/lib/env";

const args = process.argv.slice(2);
const LIMIT = (() => { const i = args.indexOf("--limit"); return i !== -1 ? Number(args[i + 1]) : 999999; })();
const DELAY_MS = 1500;
const TIMEOUT_MS = 6000;

// ─── Regex ────────────────────────────────────────────────────────────────────

const NINE_HOLE_RE   = /\b(9[\s-]holes?|nine[\s-]holes?|front\s*9|back\s*9)\b/i;
const EIGHTEEN_HOLE_RE = /\b(18[\s-]holes?|eighteen[\s-]holes?|full\s*round|per\s*round)\b/i;
const RATE_CONTEXT   = /\b(greens?\s*fee|rate|round|18\s*holes?|9\s*holes?|weekday|weekend|twilight|morning|afternoon|cart|walk|golf|per\s*person|green\s*fee|visitor|per\s*round|society|buggy|trolley)\b/i;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function fetchText(url: string): Promise<string | null> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5"
      }
    });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("text/html") && !ct.includes("application/json")) return null;
    const text = (await res.text()).slice(0, 500_000);
    if (text.includes("cf_chl_opt") || text.includes("Just a moment") || text.includes("Enable JavaScript and cookies")) return null;
    return text;
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

// ─── Price extraction (18-hole aware) ────────────────────────────────────────

interface TaggedPrice { value: number; is9: boolean; is18: boolean; }

function extractTagged(text: string): TaggedPrice[] {
  const seen = new Set<string>();
  const out: TaggedPrice[] = [];

  const add = (value: number, idx: number, key: string) => {
    if (seen.has(key) || value < 18 || value > 600) return;
    seen.add(key);
    const ctx = text.slice(Math.max(0, idx - 120), idx + 120);
    out.push({ value, is9: NINE_HOLE_RE.test(ctx), is18: EIGHTEEN_HOLE_RE.test(ctx) });
  };

  for (const m of text.matchAll(/[$£€]\s?(\d{2,4})(?:\.\d{1,2})?/g)) {
    const v = Number(m[1]);
    const ctx = text.slice(Math.max(0, (m.index ?? 0) - 80), (m.index ?? 0) + 80);
    if (RATE_CONTEXT.test(ctx)) add(v, m.index ?? 0, `c${m.index}`);
  }

  for (const m of text.matchAll(/\b(\d{2,3})(?:\.\d{2})?\s*(?:\/\s*(?:person|player|golfer|round))?\b/g)) {
    const v = Number(m[1]);
    const ctx = text.slice(Math.max(0, (m.index ?? 0) - 40), (m.index ?? 0) + 40);
    if (RATE_CONTEXT.test(ctx) && !(v >= 200 && !/weekday|weekend|twilight/.test(ctx)))
      add(v, m.index ?? 0, `n${m.index}`);
  }

  return out;
}

function selectPrices(tagged: TaggedPrice[]): number[] {
  if (!tagged.length) return [];
  const e18 = tagged.filter(p => p.is18 && !p.is9).map(p => p.value);
  if (e18.length) return e18;
  const amb = tagged.filter(p => !p.is9).map(p => p.value);
  if (amb.length) return amb;
  return tagged.map(p => Math.round(p.value * 2)); // 9-hole → double
}

function avg(nums: number[]): number {
  return Math.round(nums.reduce((s, v) => s + v, 0) / nums.length);
}

// ─── JSON-LD structured data ─────────────────────────────────────────────────
// Many golf websites embed schema.org pricing in <script type="application/ld+json">

function extractJsonLdPrices(html: string): number[] {
  const prices: number[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const m of html.matchAll(re)) {
    try {
      const obj = JSON.parse(m[1]);
      const items = Array.isArray(obj) ? obj : [obj];
      for (const item of items) {
        // priceRange: "$45 - $85", "£65", "€75", or plain "65"
        const pr: string = item.priceRange ?? item.price ?? "";
        if (pr) {
          for (const nm of pr.matchAll(/[$£€]?\s?(\d{2,3})/g)) {
            const v = Number(nm[1]);
            if (v >= 15 && v <= 500) prices.push(v);
          }
        }
        // offers array
        for (const offer of (item.offers ?? item.hasOfferCatalog?.itemListElement ?? [])) {
          const p = Number(offer.price ?? offer.lowPrice ?? 0);
          if (p >= 18 && p <= 500) prices.push(p);
        }
      }
    } catch { /* malformed JSON */ }
  }
  return prices;
}

// ─── Booking platform detection ──────────────────────────────────────────────

// Platforms whose pricing is entirely JS-rendered — scraping their HTML will
// never find prices. Detect them early to skip the full crawl.
const JS_ONLY_PLATFORMS = new Set([
  "golfnow", "ezlinks", "chronogolf", "lightspeed", "clubprophet", "teeon",
  "golfmanager", "golfregistrations",
]);

interface PlatformHit { platform: string; id: string; }

function detectPlatform(html: string): PlatformHit | null {
  const patterns: Array<[RegExp, string]> = [
    // ── Working APIs ──────────────────────────────────────────────────────────
    [/book\.teeitup\.com[^"']*[?&]course=(\d+)/i, "teeitup"],
    [/phx\.book\.teeitup\.com[^"']*[?&]course=(\d+)/i, "teeitup"],
    [/foreupsoftware\.com\/index\.php\/booking\/(\d+)/i, "foreup"],
    [/book\.foreup\.com[^"']*schedule_id=(\d+)/i, "foreup"],
    // ── GolfNow / Golf Channel Solutions / EZLinks (same company, JS-only) ────
    [/golfnow-customize/i, "golfnow"],
    [/golf.?channel.?solutions/i, "golfnow"],
    [/golfnow\.com\/book/i, "golfnow"],
    [/golfnow\.com\/widgets/i, "golfnow"],
    [/golfnow\.com\/tee-times\/facility/i, "golfnow"],
    [/ezlinksgolf\.com/i, "golfnow"],
    [/powered\s+by\s+golf\s+channel/i, "golfnow"],
    // ── Other JS-only platforms ───────────────────────────────────────────────
    [/app\.chronogolf\.com/i, "chronogolf"],
    [/chronogolf\.com[^"']*club\//i, "chronogolf"],
    [/lightspeedgolf\.com/i, "lightspeed"],
    [/clubprophet\.com/i, "clubprophet"],
    [/tee-on\.com[^"']*course/i, "teeon"],
    [/golfmanager\.com/i, "golfmanager"],
    [/golfregistrations\.com[^"']*cid=(\d+)/i, "golfregistrations"],
  ];
  for (const [re, platform] of patterns) {
    const m = html.match(re);
    if (m) return { platform, id: m[1] ?? "detected" };
  }
  return null;
}

async function fetchForeupPrices(scheduleId: string): Promise<number[]> {
  const date = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  const url = `https://foreupsoftware.com/index.php/api/booking/times?time=all&date=${date}&holes=18&players=4&schedule_id=${scheduleId}&api_key=no_limits`;
  const text = await fetchText(url);
  if (!text) return [];
  try {
    const data = JSON.parse(text) as Array<{ green_fee?: number; price?: number }>;
    return Array.isArray(data) ? data.map(t => t.green_fee ?? t.price ?? 0).filter(p => p >= 18 && p <= 600) : [];
  } catch { return []; }
}

async function fetchTeeitupPrices(courseId: string): Promise<number[]> {
  const today = new Date().toISOString().slice(0, 10);
  const url = `https://phx.book.teeitup.com/api/tee-time-results?courseId=${courseId}&date=${today}&holes=18&players=4`;
  const text = await fetchText(url);
  if (!text) return [];
  try {
    const data = JSON.parse(text) as { teeTimes?: Array<{ price?: number }> };
    return (data.teeTimes ?? []).map(t => t.price ?? 0).filter(p => p >= 18 && p <= 600);
  } catch { return []; }
}

// ─── Golf Advisor scraper ─────────────────────────────────────────────────────

async function scrapeGolfAdvisor(name: string, location: string): Promise<number[]> {
  const q = encodeURIComponent(`${name} ${location}`);
  const url = `https://www.golfadvisor.com/courses/search?q=${q}`;
  const html = await fetchText(url);
  if (!html) return [];
  const text = stripHtml(html);
  return selectPrices(extractTagged(text));
}

// ─── GolfNow course profile ───────────────────────────────────────────────────

async function scrapeGolfNowProfile(name: string, location: string): Promise<number[]> {
  const q = encodeURIComponent(`${name} ${location}`);
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const url = `https://www.golfnow.com/tee-times/search#sort=deal&view=list&holes=18&date=${today}&q=${q}`;
  const html = await fetchText(url);
  if (!html) return [];
  const text = stripHtml(html);
  return selectPrices(extractTagged(text));
}

// ─── Deep website scraper ─────────────────────────────────────────────────────

const RATES_LINK_RE = /\b(green[\s-]?fee|greens[\s-]?fee|rates?|pricing|golf[\s-]?fee|daily[\s-]?fee|visitor|public[\s-]?rate|fee[\s-]?schedule|tee[\s-]?time|book)\b/i;

function findLinks(html: string, base: URL): string[] {
  const found = new Set<string>();
  for (const m of html.matchAll(/href=["']([^"'#][^"']*?)["']/gi)) {
    try {
      const u = new URL(m[1], base);
      if (u.hostname !== base.hostname) continue;
      const path = u.pathname.toLowerCase().replace(/[-_/]/g, " ");
      if (RATES_LINK_RE.test(path)) found.add(u.href);
    } catch { /* skip */ }
  }
  // Also match anchor text
  for (const m of html.matchAll(/<a\s[^>]*href=["']([^"'#][^"']*?)["'][^>]*>([\s\S]{1,60}?)<\/a>/gi)) {
    const text = m[2].replace(/<[^>]+>/g, "").trim();
    if (!RATES_LINK_RE.test(text)) continue;
    try {
      const u = new URL(m[1], base);
      if (u.hostname === base.hostname) found.add(u.href);
    } catch { /* skip */ }
  }
  return Array.from(found).slice(0, 10);
}

const EXTRA_PATHS = [
  "/rates", "/green-fees", "/greens-fees", "/fees", "/pricing", "/play",
  "/golf-fees", "/golf-rates", "/daily-fees", "/visitor-rates", "/public-rates",
  "/fee-schedule", "/tee-times", "/book", "/reserve", "/golf/rates",
  "/golf/fees", "/golf/pricing", "/course/rates", "/course/fees",
  "/play/golf", "/play/rates", "/visitors", "/public", "/daily-rate",
];

async function deepScrapeWebsite(websiteUri: string): Promise<{ prices: number[]; pageUrl: string } | null> {
  let base: URL;
  try { base = new URL(websiteUri); } catch { return null; }

  const homepageHtml = await fetchText(base.href);
  if (!homepageHtml) return null;

  // JSON-LD first — most reliable
  const jsonLdPrices = extractJsonLdPrices(homepageHtml);
  const jsonLd18 = selectPrices(jsonLdPrices.map(v => ({ value: v, is9: false, is18: false })));
  if (jsonLd18.length) return { prices: jsonLd18, pageUrl: base.href };

  // Booking platform detection
  const platform = detectPlatform(homepageHtml);
  if (platform) {
    // JS-only: all pricing rendered client-side, skip crawl entirely
    if (JS_ONLY_PLATFORMS.has(platform.platform)) {
      return null;
    }
    let apiPrices: number[] = [];
    if (platform.platform === "foreup") apiPrices = await fetchForeupPrices(platform.id);
    else if (platform.platform === "teeitup") apiPrices = await fetchTeeitupPrices(platform.id);
    if (apiPrices.length) return { prices: apiPrices, pageUrl: `${platform.platform} API` };
  }

  // Discovered links from nav + known paths
  const discovered = findLinks(homepageHtml, base);
  const guessed = EXTRA_PATHS.map(p => new URL(p, base).href);
  const urls = Array.from(new Set([...discovered, ...guessed, base.href]));

  const candidates = await Promise.all(
    urls.map(async url => {
      const html = url === base.href ? homepageHtml : await fetchText(url);
      if (!html) return null;

      // JSON-LD on sub-pages too
      const jlPrices = extractJsonLdPrices(html);
      const jl18 = selectPrices(jlPrices.map(v => ({ value: v, is9: false, is18: false })));
      if (jl18.length) return { url, prices: jl18 };

      const text = stripHtml(html);
      const prices = selectPrices(extractTagged(text));
      return prices.length ? { url, prices } : null;
    })
  );

  const ratesHit = candidates.find(r => r && r.url !== base.href);
  const winner = ratesHit ?? candidates.find(r => r !== null);
  return winner ? { prices: winner.prices, pageUrl: winner.url } : null;
}

// ─── Google Places (re-fetch with website) ────────────────────────────────────

async function getWebsiteFromGoogle(name: string, location: string): Promise<string | null> {
  if (!env.GOOGLE_MAPS_API_KEY) return null;
  const body = { textQuery: `${name} ${location}`, includedType: "golf_course", languageCode: "en", regionCode: "US", pageSize: 1 };
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.id"
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) return null;
    const data = await res.json() as { places?: Array<{ id: string }> };
    const placeId = data.places?.[0]?.id;
    if (!placeId) return null;

    const det = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: { "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY, "X-Goog-FieldMask": "websiteUri" }
    });
    if (!det.ok) return null;
    const detData = await det.json() as { websiteUri?: string };
    return detData.websiteUri ?? null;
  } catch { return null; }
}

// ─── Save to Supabase ─────────────────────────────────────────────────────────

async function saveToDb(
  lookupKey: string, name: string, location: string,
  prices: number[], sourceUrl: string, sourceName: string, notes: string,
  confidence: "high" | "medium" | "low"
) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return;
  const avgRate = avg(prices);
  const row = {
    lookup_key: lookupKey,
    course_name: name,
    location_label: location,
    weekday_rate: Math.min(...prices),
    weekend_rate: Math.max(...prices),
    avg_rate: avgRate,
    source_url: sourceUrl,
    source_name: sourceName,
    notes,
    confidence,
    fetched_at: new Date().toISOString()
  };
  await supabase.from("course_pricing").upsert(row, { onConflict: "lookup_key" });
}

// ─── SinglePlatform ───────────────────────────────────────────────────────────

function toSinglePlatformSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function scrapeSinglePlatform(name: string): Promise<number[]> {
  const slug = toSinglePlatformSlug(name);
  for (const url of [
    `https://places.singleplatform.com/${slug}-0/menu`,
    `https://places.singleplatform.com/${slug}/menu`,
  ]) {
    const html = await fetchText(url);
    if (!html) continue;
    const prices = selectPrices(extractTagged(stripHtml(html)));
    if (prices.length) return prices;
  }
  return [];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  // Load progress file to get all processed lookup keys
  const progressPath = resolve(__dirname, "scraping-progress.json");
  if (!existsSync(progressPath)) {
    console.error(`Progress file not found: ${progressPath}`);
    console.error("Run scrape-course-pricing-bulk.ts first to generate this file.");
    process.exit(1);
  }
  const progress = JSON.parse(readFileSync(progressPath, "utf8")) as { processedKeys: string[] };
  const allKeys = progress.processedKeys;

  // Find which keys are missing from the DB — batch to stay under URL limits
  const supabase = createSupabaseAdminClient();
  if (!supabase) { console.error("No Supabase client"); process.exit(1); }

  console.log(`Checking ${allKeys.length} processed keys against DB…`);
  const BATCH_SIZE = 150;
  const existingSet = new Set<string>();
  for (let i = 0; i < allKeys.length; i += BATCH_SIZE) {
    const batch = allKeys.slice(i, i + BATCH_SIZE);
    const { data } = await supabase.from("course_pricing").select("lookup_key").in("lookup_key", batch);
    (data ?? []).forEach((r: { lookup_key: string }) => existingSet.add(r.lookup_key));
  }

  const failed = allKeys.filter(k => !existingSet.has(k));
  console.log(`Found ${failed.length} courses with no pricing data — retrying with enhanced methods\n`);

  const toRetry = failed.slice(0, LIMIT);
  let priced = 0, stillFailed = 0;

  for (const lookupKey of toRetry) {
    // Parse name and location back from the lookup key (format: "name|location")
    const pipeIdx = lookupKey.indexOf("|");
    if (pipeIdx === -1) continue;
    const name = lookupKey.slice(0, pipeIdx).trim();
    const location = lookupKey.slice(pipeIdx + 1).trim();

    process.stdout.write(`[retry] ${name} — ${location} … `);

    // Strategy 1: get the course website from Google Places, then deep-scrape it
    const website = await getWebsiteFromGoogle(name, location);
    if (website) {
      const scraped = await deepScrapeWebsite(website);
      if (scraped && scraped.prices.length > 0) {
        const a = avg(scraped.prices);
        console.log(`$${a} via ${scraped.pageUrl.replace(/^https?:\/\//, "").slice(0, 50)}`);
        await saveToDb(lookupKey, name, location, scraped.prices, scraped.pageUrl,
          scraped.pageUrl.includes("foreup") ? "ForeUp" :
          scraped.pageUrl.includes("teeitup") ? "TeeItUp" :
          new URL(website).hostname.replace(/^www\./, ""),
          `Avg of ${scraped.prices.length} 18-hole rates`,
          scraped.prices.length >= 3 ? "high" : "medium");
        priced++;
        await sleep(DELAY_MS);
        continue;
      }
    }

    // Strategy 2: Golf Advisor
    const gaP = await scrapeGolfAdvisor(name, location);
    if (gaP.length) {
      const a = avg(gaP);
      console.log(`$${a} via Golf Advisor`);
      await saveToDb(lookupKey, name, location, gaP, `https://www.golfadvisor.com`, "Golf Advisor",
        `Avg of ${gaP.length} rates from Golf Advisor`, "medium");
      priced++;
      await sleep(DELAY_MS);
      continue;
    }

    // Strategy 3: GolfNow search listing
    const gnP = await scrapeGolfNowProfile(name, location);
    if (gnP.length) {
      const a = avg(gnP);
      console.log(`$${a} via GolfNow`);
      await saveToDb(lookupKey, name, location, gnP, `https://www.golfnow.com`, "GolfNow",
        `Avg of ${gnP.length} tee-time rates from GolfNow`, "medium");
      priced++;
      await sleep(DELAY_MS);
      continue;
    }

    // Strategy 4: SinglePlatform — Google Maps surfaces these "Menu" pages for
    // many courses with green fee listings; slug constructed from course name.
    const spP = await scrapeSinglePlatform(name);
    if (spP.length) {
      const a = avg(spP);
      console.log(`$${a} via SinglePlatform`);
      await saveToDb(lookupKey, name, location, spP,
        `https://places.singleplatform.com/${toSinglePlatformSlug(name)}-0/menu`,
        "SinglePlatform", `Avg of ${spP.length} rates from SinglePlatform`,
        spP.length >= 2 ? "medium" : "low");
      priced++;
      await sleep(DELAY_MS);
      continue;
    }

    console.log("still no data");
    stillFailed++;
    await sleep(800);
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`RETRY DONE`);
  console.log(`  Newly priced : ${priced}`);
  console.log(`  Still failed : ${stillFailed}`);
  console.log(`${"─".repeat(50)}\n`);
}

run().catch(err => { console.error(err); process.exit(1); });
