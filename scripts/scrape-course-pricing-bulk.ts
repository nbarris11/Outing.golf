/**
 * Bulk golf course pricing scraper
 *
 * Discovers golf courses across US markets via Google Places Nearby Search,
 * then runs the full pricing enrichment pipeline (website scrape → review
 * parse → priceRange) for each and stores results in the `course_pricing`
 * Supabase table.
 *
 * Usage:
 *   npx tsx scripts/scrape-course-pricing-bulk.ts
 *   npx tsx scripts/scrape-course-pricing-bulk.ts --markets 10 --per-market 20
 *   npx tsx scripts/scrape-course-pricing-bulk.ts --resume   (skip already-cached)
 *   npx tsx scripts/scrape-course-pricing-bulk.ts --market-offset 5  (start from market #5)
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { fetchAndCacheCoursePricing, getCachedCoursePricing, buildLookupKey } from "../src/modules/pricing/course-pricing";
import { env } from "../src/lib/env";

// ─── Config from CLI args ────────────────────────────────────────────────────

const args = process.argv.slice(2);
const getArg = (flag: string, def: number) => {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? Number(args[idx + 1]) : def;
};
const hasFlag = (flag: string) => args.includes(flag);

const MAX_MARKETS = getArg("--markets", 999);
const PER_MARKET = getArg("--per-market", 20);
const MARKET_OFFSET = getArg("--market-offset", 0);
const RESUME = hasFlag("--resume");
const DRY_RUN = hasFlag("--dry-run");

// Throttle: ms between Google Places API calls (avoid quota hits)
const PLACES_DELAY_MS = 1200;
// Throttle: ms between pricing enrichment calls (each does multiple fetches internally)
const PRICING_DELAY_MS = 2000;

// ─── US golf markets ─────────────────────────────────────────────────────────
// 160+ markets covering every major golf region: resort destinations, Sun Belt,
// Midwest muni markets, Northeast, Northwest, mountain courses.

const MARKETS: Array<{ label: string; lat: number; lng: number; radiusM: number }> = [
  // ── Florida ──────────────────────────────────────────────────────────────
  { label: "Orlando, FL",         lat: 28.5383, lng: -81.3792, radiusM: 50_000 },
  { label: "Naples, FL",          lat: 26.1420, lng: -81.7948, radiusM: 40_000 },
  { label: "Miami, FL",           lat: 25.7617, lng: -80.1918, radiusM: 40_000 },
  { label: "Tampa, FL",           lat: 27.9506, lng: -82.4572, radiusM: 50_000 },
  { label: "Jacksonville, FL",    lat: 30.3322, lng: -81.6557, radiusM: 40_000 },
  { label: "Ponte Vedra, FL",     lat: 30.2394, lng: -81.3853, radiusM: 30_000 },
  { label: "Sarasota, FL",        lat: 27.3364, lng: -82.5307, radiusM: 35_000 },
  { label: "Fort Lauderdale, FL", lat: 26.1224, lng: -80.1373, radiusM: 35_000 },
  { label: "Palm Beach, FL",      lat: 26.7056, lng: -80.0364, radiusM: 35_000 },
  { label: "Pensacola, FL",       lat: 30.4213, lng: -87.2169, radiusM: 40_000 },
  { label: "Destin, FL",          lat: 30.3935, lng: -86.4958, radiusM: 35_000 },
  // ── Carolinas ────────────────────────────────────────────────────────────
  { label: "Myrtle Beach, SC",    lat: 33.6891, lng: -78.8867, radiusM: 50_000 },
  { label: "Hilton Head, SC",     lat: 32.2163, lng: -80.7526, radiusM: 30_000 },
  { label: "Kiawah Island, SC",   lat: 32.6082, lng: -80.0841, radiusM: 25_000 },
  { label: "Pinehurst, NC",       lat: 35.1954, lng: -79.4695, radiusM: 35_000 },
  { label: "Charlotte, NC",       lat: 35.2271, lng: -80.8431, radiusM: 40_000 },
  { label: "Wilmington, NC",      lat: 34.2257, lng: -77.9447, radiusM: 35_000 },
  // ── Georgia / Alabama ─────────────────────────────────────────────────────
  { label: "Augusta, GA",         lat: 33.4735, lng: -82.0105, radiusM: 40_000 },
  { label: "Savannah, GA",        lat: 32.0835, lng: -81.0998, radiusM: 35_000 },
  { label: "Atlanta, GA",         lat: 33.7490, lng: -84.3880, radiusM: 40_000 },
  { label: "Sea Island, GA",      lat: 31.1407, lng: -81.3968, radiusM: 25_000 },
  { label: "Birmingham, AL",      lat: 33.5186, lng: -86.8104, radiusM: 40_000 },
  // ── Texas ─────────────────────────────────────────────────────────────────
  { label: "Dallas, TX",          lat: 32.7767, lng: -96.7970, radiusM: 50_000 },
  { label: "San Antonio, TX",     lat: 29.4241, lng: -98.4936, radiusM: 45_000 },
  { label: "Austin, TX",          lat: 30.2672, lng: -97.7431, radiusM: 45_000 },
  { label: "Houston, TX",         lat: 29.7604, lng: -95.3698, radiusM: 50_000 },
  { label: "Corpus Christi, TX",  lat: 27.8006, lng: -97.3964, radiusM: 35_000 },
  // ── Arizona ───────────────────────────────────────────────────────────────
  { label: "Scottsdale, AZ",      lat: 33.4942, lng: -111.9261, radiusM: 45_000 },
  { label: "Tucson, AZ",          lat: 32.2226, lng: -110.9747, radiusM: 40_000 },
  { label: "Phoenix, AZ",         lat: 33.4484, lng: -112.0740, radiusM: 40_000 },
  { label: "Sedona, AZ",          lat: 34.8697, lng: -111.7610, radiusM: 30_000 },
  // ── California ────────────────────────────────────────────────────────────
  { label: "Pebble Beach, CA",    lat: 36.5688, lng: -121.9498, radiusM: 30_000 },
  { label: "Palm Springs, CA",    lat: 33.8303, lng: -116.5453, radiusM: 40_000 },
  { label: "San Diego, CA",       lat: 32.7157, lng: -117.1611, radiusM: 45_000 },
  { label: "Los Angeles, CA",     lat: 34.0522, lng: -118.2437, radiusM: 45_000 },
  { label: "San Francisco, CA",   lat: 37.7749, lng: -122.4194, radiusM: 40_000 },
  { label: "Napa, CA",            lat: 38.2975, lng: -122.2869, radiusM: 35_000 },
  // ── Nevada ────────────────────────────────────────────────────────────────
  { label: "Las Vegas, NV",       lat: 36.1699, lng: -115.1398, radiusM: 45_000 },
  { label: "Reno, NV",            lat: 39.5296, lng: -119.8138, radiusM: 35_000 },
  // ── Pacific Northwest ─────────────────────────────────────────────────────
  { label: "Bandon, OR",          lat: 43.1182, lng: -124.4087, radiusM: 30_000 },
  { label: "Portland, OR",        lat: 45.5051, lng: -122.6750, radiusM: 45_000 },
  { label: "Seattle, WA",         lat: 47.6062, lng: -122.3321, radiusM: 45_000 },
  // ── Mountain West ─────────────────────────────────────────────────────────
  { label: "Denver, CO",          lat: 39.7392, lng: -104.9903, radiusM: 45_000 },
  { label: "Colorado Springs, CO",lat: 38.8339, lng: -104.8214, radiusM: 35_000 },
  { label: "Vail, CO",            lat: 39.6433, lng: -106.3781, radiusM: 30_000 },
  { label: "Salt Lake City, UT",  lat: 40.7608, lng: -111.8910, radiusM: 40_000 },
  { label: "Moab, UT",            lat: 38.5733, lng: -109.5498, radiusM: 25_000 },
  // ── Midwest ───────────────────────────────────────────────────────────────
  { label: "Chicago, IL",         lat: 41.8781, lng: -87.6298, radiusM: 50_000 },
  { label: "St. Louis, MO",       lat: 38.6270, lng: -90.1994, radiusM: 45_000 },
  { label: "Kansas City, MO",     lat: 39.0997, lng: -94.5786, radiusM: 45_000 },
  { label: "Minneapolis, MN",     lat: 44.9778, lng: -93.2650, radiusM: 45_000 },
  { label: "Columbus, OH",        lat: 39.9612, lng: -82.9988, radiusM: 40_000 },
  { label: "Cincinnati, OH",      lat: 39.1031, lng: -84.5120, radiusM: 40_000 },
  { label: "Detroit, MI",         lat: 42.3314, lng: -83.0458, radiusM: 45_000 },
  { label: "West Branch, MI",     lat: 44.2764, lng: -84.2383, radiusM: 35_000 },
  { label: "Traverse City, MI",   lat: 44.7631, lng: -85.6206, radiusM: 35_000 },
  { label: "Harbor Springs, MI",  lat: 45.4322, lng: -84.9939, radiusM: 30_000 },
  { label: "Indianapolis, IN",    lat: 39.7684, lng: -86.1581, radiusM: 40_000 },
  { label: "Milwaukee, WI",       lat: 43.0389, lng: -87.9065, radiusM: 40_000 },
  { label: "Madison, WI",         lat: 43.0731, lng: -89.4012, radiusM: 35_000 },
  { label: "Kohler, WI",          lat: 43.7386, lng: -87.7820, radiusM: 20_000 },
  { label: "Omaha, NE",           lat: 41.2565, lng: -95.9345, radiusM: 40_000 },
  // ── Northeast ─────────────────────────────────────────────────────────────
  { label: "New York, NY",        lat: 40.7128, lng: -74.0060, radiusM: 50_000 },
  { label: "Boston, MA",          lat: 42.3601, lng: -71.0589, radiusM: 40_000 },
  { label: "Philadelphia, PA",    lat: 39.9526, lng: -75.1652, radiusM: 40_000 },
  { label: "Pittsburgh, PA",      lat: 40.4406, lng: -79.9959, radiusM: 40_000 },
  { label: "Washington DC",       lat: 38.9072, lng: -77.0369, radiusM: 45_000 },
  { label: "Baltimore, MD",       lat: 39.2904, lng: -76.6122, radiusM: 35_000 },
  { label: "Hartford, CT",        lat: 41.7658, lng: -72.6851, radiusM: 35_000 },
  { label: "Providence, RI",      lat: 41.8240, lng: -71.4128, radiusM: 30_000 },
  { label: "Portland, ME",        lat: 43.6591, lng: -70.2568, radiusM: 30_000 },
  { label: "Saratoga Springs, NY",lat: 43.0831, lng: -73.7846, radiusM: 30_000 },
  // ── Mid-Atlantic / Southeast ──────────────────────────────────────────────
  { label: "Virginia Beach, VA",  lat: 36.8529, lng: -75.9780, radiusM: 35_000 },
  { label: "Richmond, VA",        lat: 37.5407, lng: -77.4360, radiusM: 35_000 },
  { label: "Greenbrier, WV",      lat: 37.7784, lng: -80.3015, radiusM: 25_000 },
  { label: "Morgantown, WV",      lat: 39.6295, lng: -79.9559, radiusM: 25_000 },
  { label: "Memphis, TN",         lat: 35.1495, lng: -90.0490, radiusM: 40_000 },
  { label: "Nashville, TN",       lat: 36.1627, lng: -86.7816, radiusM: 40_000 },
  { label: "Chattanooga, TN",     lat: 35.0456, lng: -85.3097, radiusM: 35_000 },
  { label: "Louisville, KY",      lat: 38.2527, lng: -85.7585, radiusM: 35_000 },
  { label: "Lexington, KY",       lat: 38.0406, lng: -84.5037, radiusM: 35_000 },
  { label: "New Orleans, LA",     lat: 29.9511, lng: -90.0715, radiusM: 40_000 },
  { label: "Baton Rouge, LA",     lat: 30.4515, lng: -91.1871, radiusM: 35_000 },
  { label: "Jackson, MS",         lat: 32.2988, lng: -90.1848, radiusM: 35_000 },
  { label: "Little Rock, AR",     lat: 34.7465, lng: -92.2896, radiusM: 35_000 },
  { label: "Oklahoma City, OK",   lat: 35.4676, lng: -97.5164, radiusM: 40_000 },
  { label: "Tulsa, OK",           lat: 36.1540, lng: -95.9928, radiusM: 35_000 },
  // ── Hawaii ────────────────────────────────────────────────────────────────
  { label: "Maui, HI",            lat: 20.7984, lng: -156.3319, radiusM: 40_000 },
  { label: "Oahu, HI",            lat: 21.3069, lng: -157.8583, radiusM: 35_000 },
  { label: "Big Island, HI",      lat: 19.5429, lng: -155.6659, radiusM: 40_000 },
  { label: "Kauai, HI",           lat: 22.0964, lng: -159.5261, radiusM: 35_000 },

  // ── Florida (extended) ────────────────────────────────────────────────────
  { label: "Gainesville, FL",     lat: 29.6516, lng: -82.3248, radiusM: 35_000 },
  { label: "Ocala, FL",           lat: 29.1872, lng: -82.1401, radiusM: 35_000 },
  { label: "Tallahassee, FL",     lat: 30.4518, lng: -84.2807, radiusM: 35_000 },
  { label: "Fort Myers, FL",      lat: 26.6406, lng: -81.8723, radiusM: 35_000 },
  { label: "Melbourne, FL",       lat: 28.0836, lng: -80.6081, radiusM: 30_000 },
  { label: "Daytona Beach, FL",   lat: 29.2108, lng: -81.0228, radiusM: 30_000 },
  { label: "Lakeland, FL",        lat: 28.0395, lng: -81.9498, radiusM: 30_000 },
  { label: "The Villages, FL",    lat: 28.9331, lng: -81.9567, radiusM: 25_000 },

  // ── Carolinas (extended) ─────────────────────────────────────────────────
  { label: "Raleigh, NC",         lat: 35.7796, lng: -78.6382, radiusM: 40_000 },
  { label: "Greensboro, NC",      lat: 36.0726, lng: -79.7920, radiusM: 35_000 },
  { label: "Asheville, NC",       lat: 35.5951, lng: -82.5515, radiusM: 30_000 },
  { label: "Outer Banks, NC",     lat: 35.9582, lng: -75.6243, radiusM: 30_000 },
  { label: "Columbia, SC",        lat: 34.0007, lng: -81.0348, radiusM: 35_000 },
  { label: "Aiken, SC",           lat: 33.5601, lng: -81.7198, radiusM: 25_000 },

  // ── Georgia (extended) ───────────────────────────────────────────────────
  { label: "Columbus, GA",        lat: 32.4610, lng: -84.9877, radiusM: 30_000 },
  { label: "Valdosta, GA",        lat: 30.8327, lng: -83.2785, radiusM: 30_000 },
  { label: "Albany, GA",          lat: 31.5785, lng: -84.1557, radiusM: 25_000 },
  { label: "Jekyll Island, GA",   lat: 31.0677, lng: -81.4196, radiusM: 20_000 },

  // ── Alabama / Mississippi ─────────────────────────────────────────────────
  { label: "Montgomery, AL",      lat: 32.3617, lng: -86.2792, radiusM: 35_000 },
  { label: "Mobile, AL",          lat: 30.6954, lng: -88.0399, radiusM: 35_000 },
  { label: "Huntsville, AL",      lat: 34.7304, lng: -86.5861, radiusM: 35_000 },
  { label: "Gulf Shores, AL",     lat: 30.2460, lng: -87.7008, radiusM: 30_000 },
  { label: "Biloxi, MS",          lat: 30.3960, lng: -88.8853, radiusM: 30_000 },
  { label: "Natchez, MS",         lat: 31.5604, lng: -91.4032, radiusM: 25_000 },

  // ── Texas (extended) ─────────────────────────────────────────────────────
  { label: "Fort Worth, TX",      lat: 32.7555, lng: -97.3308, radiusM: 40_000 },
  { label: "El Paso, TX",         lat: 31.7619, lng: -106.4850, radiusM: 35_000 },
  { label: "Lubbock, TX",         lat: 33.5779, lng: -101.8552, radiusM: 30_000 },
  { label: "Amarillo, TX",        lat: 35.2220, lng: -101.8313, radiusM: 30_000 },
  { label: "Tyler, TX",           lat: 32.3513, lng: -95.3011, radiusM: 30_000 },
  { label: "Galveston, TX",       lat: 29.3013, lng: -94.7977, radiusM: 25_000 },
  { label: "Midland, TX",         lat: 31.9973, lng: -102.0779, radiusM: 30_000 },
  { label: "Waco, TX",            lat: 31.5493, lng: -97.1467, radiusM: 30_000 },

  // ── Arizona (extended) ───────────────────────────────────────────────────
  { label: "Flagstaff, AZ",       lat: 35.1983, lng: -111.6513, radiusM: 30_000 },
  { label: "Yuma, AZ",            lat: 32.6927, lng: -114.6277, radiusM: 30_000 },
  { label: "Peoria, AZ",          lat: 33.5806, lng: -112.2374, radiusM: 25_000 },
  { label: "Wickenburg, AZ",      lat: 33.9647, lng: -112.7297, radiusM: 25_000 },

  // ── California (extended) ────────────────────────────────────────────────
  { label: "Carlsbad, CA",        lat: 33.1581, lng: -117.3506, radiusM: 25_000 },
  { label: "Santa Barbara, CA",   lat: 34.4208, lng: -119.6982, radiusM: 30_000 },
  { label: "Fresno, CA",          lat: 36.7378, lng: -119.7871, radiusM: 35_000 },
  { label: "Sacramento, CA",      lat: 38.5816, lng: -121.4944, radiusM: 40_000 },
  { label: "Stockton, CA",        lat: 37.9577, lng: -121.2908, radiusM: 30_000 },
  { label: "Bakersfield, CA",     lat: 35.3733, lng: -119.0187, radiusM: 30_000 },
  { label: "Carmel, CA",          lat: 36.5552, lng: -121.9233, radiusM: 20_000 },
  { label: "Riverside, CA",       lat: 33.9806, lng: -117.3755, radiusM: 30_000 },
  { label: "Lake Tahoe, CA",      lat: 38.9399, lng: -119.9772, radiusM: 35_000 },

  // ── Nevada / New Mexico ───────────────────────────────────────────────────
  { label: "Henderson, NV",       lat: 36.0395, lng: -114.9817, radiusM: 25_000 },
  { label: "Albuquerque, NM",     lat: 35.0844, lng: -106.6504, radiusM: 40_000 },
  { label: "Santa Fe, NM",        lat: 35.6870, lng: -105.9378, radiusM: 30_000 },

  // ── Pacific Northwest (extended) ─────────────────────────────────────────
  { label: "Spokane, WA",         lat: 47.6588, lng: -117.4260, radiusM: 35_000 },
  { label: "Tacoma, WA",          lat: 47.2529, lng: -122.4443, radiusM: 30_000 },
  { label: "Eugene, OR",          lat: 44.0521, lng: -123.0868, radiusM: 30_000 },
  { label: "Bend, OR",            lat: 44.0582, lng: -121.3153, radiusM: 30_000 },
  { label: "Medford, OR",         lat: 42.3265, lng: -122.8756, radiusM: 25_000 },
  { label: "Boise, ID",           lat: 43.6150, lng: -116.2023, radiusM: 35_000 },
  { label: "Coeur d'Alene, ID",   lat: 47.6777, lng: -116.7805, radiusM: 30_000 },

  // ── Mountain West (extended) ─────────────────────────────────────────────
  { label: "Aspen, CO",           lat: 39.1911, lng: -106.8175, radiusM: 25_000 },
  { label: "Steamboat Springs, CO",lat: 40.4850, lng: -106.8317, radiusM: 25_000 },
  { label: "Grand Junction, CO",  lat: 39.0639, lng: -108.5506, radiusM: 25_000 },
  { label: "Provo, UT",           lat: 40.2338, lng: -111.6585, radiusM: 30_000 },
  { label: "St. George, UT",      lat: 37.0965, lng: -113.5684, radiusM: 30_000 },
  { label: "Park City, UT",       lat: 40.6461, lng: -111.4980, radiusM: 25_000 },
  { label: "Billings, MT",        lat: 45.7833, lng: -108.5007, radiusM: 30_000 },
  { label: "Missoula, MT",        lat: 46.8721, lng: -113.9940, radiusM: 30_000 },
  { label: "Whitefish, MT",       lat: 48.4110, lng: -114.3358, radiusM: 25_000 },
  { label: "Jackson Hole, WY",    lat: 43.4799, lng: -110.7624, radiusM: 30_000 },
  { label: "Casper, WY",          lat: 42.8501, lng: -106.3252, radiusM: 30_000 },
  { label: "Rapid City, SD",      lat: 44.0805, lng: -103.2310, radiusM: 30_000 },
  { label: "Sioux Falls, SD",     lat: 43.5446, lng: -96.7311, radiusM: 30_000 },
  { label: "Bismarck, ND",        lat: 46.8083, lng: -100.7837, radiusM: 30_000 },
  { label: "Fargo, ND",           lat: 46.8772, lng: -96.7898, radiusM: 30_000 },

  // ── Midwest (extended) ───────────────────────────────────────────────────
  { label: "Springfield, IL",     lat: 39.7817, lng: -89.6501, radiusM: 30_000 },
  { label: "Peoria, IL",          lat: 40.6936, lng: -89.5890, radiusM: 30_000 },
  { label: "Galena, IL",          lat: 42.4167, lng: -90.4290, radiusM: 20_000 },
  { label: "Springfield, MO",     lat: 37.2090, lng: -93.2923, radiusM: 30_000 },
  { label: "Branson, MO",         lat: 36.6437, lng: -93.2185, radiusM: 25_000 },
  { label: "Des Moines, IA",      lat: 41.5868, lng: -93.6250, radiusM: 35_000 },
  { label: "Cedar Rapids, IA",    lat: 41.9779, lng: -91.6656, radiusM: 30_000 },
  { label: "Dubuque, IA",         lat: 42.5006, lng: -90.6646, radiusM: 25_000 },
  { label: "Rochester, MN",       lat: 44.0234, lng: -92.4635, radiusM: 30_000 },
  { label: "Duluth, MN",          lat: 46.7867, lng: -92.1005, radiusM: 30_000 },
  { label: "Brainerd, MN",        lat: 46.3583, lng: -94.2008, radiusM: 25_000 },
  { label: "Flint, MI",           lat: 43.0125, lng: -83.6875, radiusM: 30_000 },
  { label: "Grand Rapids, MI",    lat: 42.9634, lng: -85.6681, radiusM: 35_000 },
  { label: "Petoskey, MI",        lat: 45.3736, lng: -84.9553, radiusM: 25_000 },
  { label: "Toledo, OH",          lat: 41.6528, lng: -83.5379, radiusM: 30_000 },
  { label: "Cleveland, OH",       lat: 41.4993, lng: -81.6944, radiusM: 40_000 },
  { label: "Akron, OH",           lat: 41.0814, lng: -81.5190, radiusM: 30_000 },
  { label: "Youngstown, OH",      lat: 41.0998, lng: -80.6495, radiusM: 25_000 },
  { label: "Fort Wayne, IN",      lat: 41.0793, lng: -85.1394, radiusM: 30_000 },
  { label: "Evansville, IN",      lat: 37.9716, lng: -87.5711, radiusM: 30_000 },
  { label: "South Bend, IN",      lat: 41.6764, lng: -86.2520, radiusM: 30_000 },
  { label: "Green Bay, WI",       lat: 44.5192, lng: -88.0198, radiusM: 30_000 },
  { label: "Sheboygan, WI",       lat: 43.7508, lng: -87.7145, radiusM: 25_000 },
  { label: "Wausau, WI",          lat: 44.9591, lng: -89.6301, radiusM: 25_000 },
  { label: "Lincoln, NE",         lat: 40.8136, lng: -96.7026, radiusM: 30_000 },
  { label: "Wichita, KS",         lat: 37.6872, lng: -97.3301, radiusM: 35_000 },
  { label: "Topeka, KS",          lat: 39.0558, lng: -95.6890, radiusM: 30_000 },

  // ── Northeast (extended) ─────────────────────────────────────────────────
  { label: "Albany, NY",          lat: 42.6526, lng: -73.7562, radiusM: 35_000 },
  { label: "Buffalo, NY",         lat: 42.8864, lng: -78.8784, radiusM: 35_000 },
  { label: "Rochester, NY",       lat: 43.1566, lng: -77.6088, radiusM: 30_000 },
  { label: "Syracuse, NY",        lat: 43.0481, lng: -76.1474, radiusM: 30_000 },
  { label: "Long Island, NY",     lat: 40.7891, lng: -73.1350, radiusM: 40_000 },
  { label: "The Hamptons, NY",    lat: 40.9176, lng: -72.3960, radiusM: 25_000 },
  { label: "Bethpage, NY",        lat: 40.7526, lng: -73.4876, radiusM: 20_000 },
  { label: "Cape Cod, MA",        lat: 41.6688, lng: -70.2962, radiusM: 30_000 },
  { label: "Worcester, MA",       lat: 42.2626, lng: -71.8023, radiusM: 30_000 },
  { label: "Springfield, MA",     lat: 42.1015, lng: -72.5898, radiusM: 25_000 },
  { label: "Burlington, VT",      lat: 44.4759, lng: -73.2121, radiusM: 30_000 },
  { label: "Stowe, VT",           lat: 44.4655, lng: -72.6874, radiusM: 20_000 },
  { label: "Manchester, NH",      lat: 42.9956, lng: -71.4548, radiusM: 30_000 },
  { label: "Concord, NH",         lat: 43.2081, lng: -71.5376, radiusM: 25_000 },
  { label: "Atlantic City, NJ",   lat: 39.3643, lng: -74.4229, radiusM: 30_000 },
  { label: "Trenton, NJ",         lat: 40.2171, lng: -74.7429, radiusM: 25_000 },
  { label: "Wilmington, DE",      lat: 39.7447, lng: -75.5484, radiusM: 25_000 },

  // ── Mid-Atlantic / Appalachian ────────────────────────────────────────────
  { label: "Charlottesville, VA", lat: 38.0293, lng: -78.4767, radiusM: 30_000 },
  { label: "Roanoke, VA",         lat: 37.2710, lng: -79.9414, radiusM: 30_000 },
  { label: "Williamsburg, VA",    lat: 37.2707, lng: -76.7075, radiusM: 25_000 },
  { label: "Shenandoah, VA",      lat: 38.6590, lng: -78.5253, radiusM: 25_000 },
  { label: "Frederick, MD",       lat: 39.4143, lng: -77.4105, radiusM: 25_000 },
  { label: "Ocean City, MD",      lat: 38.3365, lng: -75.0849, radiusM: 20_000 },
  { label: "Hagerstown, MD",      lat: 39.6418, lng: -77.7199, radiusM: 25_000 },
  { label: "Altoona, PA",         lat: 40.5187, lng: -78.3947, radiusM: 25_000 },
  { label: "Scranton, PA",        lat: 41.4090, lng: -75.6624, radiusM: 25_000 },
  { label: "State College, PA",   lat: 40.7934, lng: -77.8600, radiusM: 25_000 },
  { label: "Lancaster, PA",       lat: 40.0379, lng: -76.3055, radiusM: 25_000 },

  // ── Tennessee / Kentucky (extended) ──────────────────────────────────────
  { label: "Knoxville, TN",       lat: 35.9606, lng: -83.9207, radiusM: 35_000 },
  { label: "Johnson City, TN",    lat: 36.3134, lng: -82.3535, radiusM: 25_000 },
  { label: "Gatlinburg, TN",      lat: 35.7143, lng: -83.5129, radiusM: 20_000 },

  // ── Louisiana / Arkansas (extended) ──────────────────────────────────────
  { label: "Shreveport, LA",      lat: 32.5252, lng: -93.7502, radiusM: 35_000 },
  { label: "Lafayette, LA",       lat: 30.2241, lng: -92.0198, radiusM: 30_000 },
  { label: "Hot Springs, AR",     lat: 34.5037, lng: -93.0552, radiusM: 25_000 },
  { label: "Fayetteville, AR",    lat: 36.0626, lng: -94.1574, radiusM: 30_000 },

  // ── Great Plains / Midwest second-tier ───────────────────────────────────
  { label: "Sioux City, IA",      lat: 42.4999, lng: -96.4003, radiusM: 25_000 },
  { label: "Joplin, MO",          lat: 37.0842, lng: -94.5133, radiusM: 25_000 },
  { label: "Bowling Green, KY",   lat: 36.9685, lng: -86.4808, radiusM: 25_000 },
  { label: "Paducah, KY",         lat: 37.0834, lng: -88.6001, radiusM: 25_000 },

  // ── Scotland ──────────────────────────────────────────────────────────────
  { label: "St Andrews, Scotland",    lat: 56.3398, lng: -2.7967,  radiusM: 30_000 },
  { label: "Edinburgh, Scotland",     lat: 55.9533, lng: -3.1883,  radiusM: 40_000 },
  { label: "Glasgow, Scotland",       lat: 55.8642, lng: -4.2518,  radiusM: 40_000 },
  { label: "Carnoustie, Scotland",    lat: 56.5022, lng: -2.7069,  radiusM: 25_000 },
  { label: "Turnberry, Scotland",     lat: 55.3219, lng: -4.8333,  radiusM: 25_000 },
  { label: "Royal Dornoch, Scotland", lat: 57.8789, lng: -4.0269,  radiusM: 20_000 },
  { label: "Inverness, Scotland",     lat: 57.4778, lng: -4.2247,  radiusM: 30_000 },
  { label: "Aberdeen, Scotland",      lat: 57.1497, lng: -2.0943,  radiusM: 35_000 },
  { label: "Gleneagles, Scotland",    lat: 56.2799, lng: -3.7389,  radiusM: 20_000 },

  // ── Ireland / Northern Ireland ─────────────────────────────────────────────
  { label: "Dublin, Ireland",         lat: 53.3498, lng: -6.2603,  radiusM: 40_000 },
  { label: "Cork, Ireland",           lat: 51.8985, lng: -8.4756,  radiusM: 35_000 },
  { label: "Lahinch, Ireland",        lat: 52.9328, lng: -9.3444,  radiusM: 25_000 },
  { label: "Ballybunion, Ireland",    lat: 52.5080, lng: -9.6720,  radiusM: 20_000 },
  { label: "Galway, Ireland",         lat: 53.2707, lng: -9.0568,  radiusM: 30_000 },
  { label: "Kerry, Ireland",          lat: 52.1545, lng: -9.5669,  radiusM: 30_000 },
  { label: "Belfast, N. Ireland",     lat: 54.5973, lng: -5.9301,  radiusM: 35_000 },
  { label: "Royal Portrush, N. Ireland", lat: 55.2050, lng: -6.6558, radiusM: 20_000 },

  // ── England ────────────────────────────────────────────────────────────────
  { label: "London, England",         lat: 51.5074, lng: -0.1278,  radiusM: 50_000 },
  { label: "Royal Birkdale, England", lat: 53.6133, lng: -3.0283,  radiusM: 25_000 },
  { label: "Sandwich, England",       lat: 51.2762, lng: 1.3434,   radiusM: 20_000 },
  { label: "Sunningdale, England",    lat: 51.3920, lng: -0.6247,  radiusM: 20_000 },
  { label: "Manchester, England",     lat: 53.4808, lng: -2.2426,  radiusM: 35_000 },
  { label: "Birmingham, England",     lat: 52.4862, lng: -1.8904,  radiusM: 35_000 },
  { label: "Bristol, England",        lat: 51.4545, lng: -2.5879,  radiusM: 30_000 },

  // ── Portugal ───────────────────────────────────────────────────────────────
  { label: "Algarve, Portugal",       lat: 37.1358, lng: -8.5376,  radiusM: 60_000 },
  { label: "Lisbon, Portugal",        lat: 38.7223, lng: -9.1393,  radiusM: 40_000 },
  { label: "Porto, Portugal",         lat: 41.1579, lng: -8.6291,  radiusM: 35_000 },
  { label: "Madeira, Portugal",       lat: 32.7607, lng: -16.9595, radiusM: 30_000 },

  // ── Spain ──────────────────────────────────────────────────────────────────
  { label: "Costa del Sol, Spain",    lat: 36.5297, lng: -4.8834,  radiusM: 50_000 },
  { label: "Madrid, Spain",           lat: 40.4168, lng: -3.7038,  radiusM: 40_000 },
  { label: "Barcelona, Spain",        lat: 41.3851, lng: 2.1734,   radiusM: 40_000 },
  { label: "Sotogrande, Spain",       lat: 36.2893, lng: -5.2529,  radiusM: 25_000 },
  { label: "Majorca, Spain",          lat: 39.6953, lng: 3.0176,   radiusM: 40_000 },
  { label: "Tenerife, Spain",         lat: 28.2916, lng: -16.6291, radiusM: 40_000 },

  // ── France ────────────────────────────────────────────────────────────────
  { label: "Paris, France",           lat: 48.8566, lng: 2.3522,   radiusM: 45_000 },
  { label: "Côte d'Azur, France",     lat: 43.7102, lng: 7.2620,   radiusM: 40_000 },
  { label: "Biarritz, France",        lat: 43.4832, lng: -1.5586,  radiusM: 25_000 },

  // ── Italy ─────────────────────────────────────────────────────────────────
  { label: "Rome, Italy",             lat: 41.9028, lng: 12.4964,  radiusM: 40_000 },
  { label: "Milan, Italy",            lat: 45.4654, lng: 9.1859,   radiusM: 40_000 },
  { label: "Tuscany, Italy",          lat: 43.7711, lng: 11.2486,  radiusM: 50_000 },
  { label: "Lake Como, Italy",        lat: 45.9917, lng: 9.1568,   radiusM: 30_000 },
  { label: "Sicily, Italy",           lat: 37.5999, lng: 14.0154,  radiusM: 50_000 },

  // ── Germany / Switzerland / Austria ───────────────────────────────────────
  { label: "Munich, Germany",         lat: 48.1351, lng: 11.5820,  radiusM: 40_000 },
  { label: "Frankfurt, Germany",      lat: 50.1109, lng: 8.6821,   radiusM: 35_000 },
  { label: "Hamburg, Germany",        lat: 53.5753, lng: 10.0153,  radiusM: 35_000 },
  { label: "Zurich, Switzerland",     lat: 47.3769, lng: 8.5417,   radiusM: 35_000 },
  { label: "Geneva, Switzerland",     lat: 46.2044, lng: 6.1432,   radiusM: 30_000 },
  { label: "Vienna, Austria",         lat: 48.2082, lng: 16.3738,  radiusM: 35_000 },

  // ── Netherlands / Belgium / Scandinavia ───────────────────────────────────
  { label: "Amsterdam, Netherlands",  lat: 52.3676, lng: 4.9041,   radiusM: 35_000 },
  { label: "Stockholm, Sweden",       lat: 59.3293, lng: 18.0686,  radiusM: 40_000 },
  { label: "Copenhagen, Denmark",     lat: 55.6761, lng: 12.5683,  radiusM: 35_000 },
  { label: "Oslo, Norway",            lat: 59.9139, lng: 10.7522,  radiusM: 35_000 },

  // ── Caribbean ─────────────────────────────────────────────────────────────
  { label: "Punta Cana, Dominican Republic", lat: 18.5820, lng: -68.4033, radiusM: 40_000 },
  { label: "Santo Domingo, DR",       lat: 18.4861, lng: -69.9312, radiusM: 35_000 },
  { label: "Nassau, Bahamas",         lat: 25.0480, lng: -77.3554, radiusM: 30_000 },
  { label: "Montego Bay, Jamaica",    lat: 18.4762, lng: -77.8939, radiusM: 30_000 },
  { label: "Ocho Rios, Jamaica",      lat: 18.4043, lng: -77.1040, radiusM: 25_000 },
  { label: "Turks and Caicos",        lat: 21.6940, lng: -71.7979, radiusM: 30_000 },
  { label: "Barbados",                lat: 13.1939, lng: -59.5432, radiusM: 30_000 },
  { label: "Puerto Rico",             lat: 18.2208, lng: -66.5901, radiusM: 50_000 },
  { label: "Aruba",                   lat: 12.5211, lng: -69.9683, radiusM: 20_000 },
  { label: "St. Kitts",               lat: 17.3578, lng: -62.7830, radiusM: 20_000 },
  { label: "Bermuda",                 lat: 32.3078, lng: -64.7505, radiusM: 25_000 },

  // ── Mexico ────────────────────────────────────────────────────────────────
  { label: "Los Cabos, Mexico",       lat: 22.8905, lng: -109.9167, radiusM: 40_000 },
  { label: "Puerto Vallarta, Mexico", lat: 20.6534, lng: -105.2253, radiusM: 35_000 },
  { label: "Cancun, Mexico",          lat: 21.1619, lng: -86.8515, radiusM: 35_000 },
  { label: "Riviera Maya, Mexico",    lat: 20.4230, lng: -87.2751, radiusM: 40_000 },
  { label: "Mazatlan, Mexico",        lat: 23.2494, lng: -106.4111, radiusM: 30_000 },
  { label: "Mexico City, Mexico",     lat: 19.4326, lng: -99.1332, radiusM: 45_000 },

  // ── Canada ────────────────────────────────────────────────────────────────
  { label: "Banff, Canada",           lat: 51.1784, lng: -115.5708, radiusM: 30_000 },
  { label: "Whistler, Canada",        lat: 50.1163, lng: -122.9574, radiusM: 25_000 },
  { label: "Vancouver, Canada",       lat: 49.2827, lng: -123.1207, radiusM: 45_000 },
  { label: "Toronto, Canada",         lat: 43.6532, lng: -79.3832, radiusM: 50_000 },
  { label: "Montreal, Canada",        lat: 45.5017, lng: -73.5673, radiusM: 45_000 },
  { label: "Muskoka, Canada",         lat: 45.0000, lng: -79.3000, radiusM: 35_000 },
  { label: "Prince Edward Island, Canada", lat: 46.2382, lng: -63.1311, radiusM: 35_000 },
  { label: "Calgary, Canada",         lat: 51.0447, lng: -114.0719, radiusM: 40_000 },
  { label: "Halifax, Canada",         lat: 44.6488, lng: -63.5752, radiusM: 30_000 },

  // ── Australia / New Zealand ───────────────────────────────────────────────
  { label: "Sydney, Australia",       lat: -33.8688, lng: 151.2093, radiusM: 50_000 },
  { label: "Melbourne, Australia",    lat: -37.8136, lng: 144.9631, radiusM: 50_000 },
  { label: "Queensland, Australia",   lat: -26.4390, lng: 153.0351, radiusM: 50_000 },
  { label: "Perth, Australia",        lat: -31.9505, lng: 115.8605, radiusM: 45_000 },
  { label: "Adelaide, Australia",     lat: -34.9285, lng: 138.6007, radiusM: 40_000 },
  { label: "Auckland, New Zealand",   lat: -36.8509, lng: 174.7645, radiusM: 40_000 },
  { label: "Queenstown, New Zealand", lat: -45.0312, lng: 168.6626, radiusM: 30_000 },

  // ── Asia ──────────────────────────────────────────────────────────────────
  { label: "Tokyo, Japan",            lat: 35.6762, lng: 139.6503, radiusM: 50_000 },
  { label: "Osaka, Japan",            lat: 34.6937, lng: 135.5023, radiusM: 40_000 },
  { label: "Seoul, South Korea",      lat: 37.5665, lng: 126.9780, radiusM: 45_000 },
  { label: "Singapore",               lat: 1.3521,  lng: 103.8198, radiusM: 30_000 },
  { label: "Bangkok, Thailand",       lat: 13.7563, lng: 100.5018, radiusM: 50_000 },
  { label: "Phuket, Thailand",        lat: 7.8804,  lng: 98.3923,  radiusM: 35_000 },
  { label: "Bali, Indonesia",         lat: -8.4095, lng: 115.1889, radiusM: 40_000 },
  { label: "Hong Kong",               lat: 22.3193, lng: 114.1694, radiusM: 30_000 },
  { label: "Shanghai, China",         lat: 31.2304, lng: 121.4737, radiusM: 45_000 },
  { label: "Beijing, China",          lat: 39.9042, lng: 116.4074, radiusM: 45_000 },

  // ── Middle East / Africa ──────────────────────────────────────────────────
  { label: "Dubai, UAE",              lat: 25.2048, lng: 55.2708,  radiusM: 40_000 },
  { label: "Abu Dhabi, UAE",          lat: 24.4539, lng: 54.3773,  radiusM: 35_000 },
  { label: "Cape Town, South Africa", lat: -33.9249, lng: 18.4241, radiusM: 40_000 },
  { label: "Johannesburg, South Africa", lat: -26.2041, lng: 28.0473, radiusM: 45_000 },
  { label: "Sun City, South Africa",  lat: -25.3394, lng: 27.0978, radiusM: 20_000 },
  { label: "Marrakech, Morocco",      lat: 31.6295, lng: -7.9811,  radiusM: 35_000 },
];


// ─── Progress tracking ────────────────────────────────────────────────────────

const PROGRESS_FILE = resolve(__dirname, "scraping-progress.json");

interface Progress {
  seenPlaceIds: string[];
  processedKeys: string[];
  marketsDone: string[];
  stats: { discovered: number; priced: number; skipped: number; failed: number };
  startedAt: string;
  updatedAt: string;
}

function loadProgress(): Progress {
  if (RESUME && existsSync(PROGRESS_FILE)) {
    try {
      const raw = readFileSync(PROGRESS_FILE, "utf8");
      const p = JSON.parse(raw) as Progress;
      console.log(`Resuming from ${p.updatedAt} — ${p.processedKeys.length} already processed`);
      return p;
    } catch {
      console.warn("Could not parse progress file, starting fresh");
    }
  }
  return {
    seenPlaceIds: [],
    processedKeys: [],
    marketsDone: [],
    stats: { discovered: 0, priced: 0, skipped: 0, failed: 0 },
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function saveProgress(p: Progress) {
  p.updatedAt = new Date().toISOString();
  writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2));
}

// ─── Google Places Nearby Search ──────────────────────────────────────────────

interface NearbyPlace {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
}

interface NearbySearchResponse {
  places?: NearbyPlace[];
}

async function discoverCoursesNearby(
  lat: number,
  lng: number,
  radiusM: number
): Promise<NearbyPlace[]> {
  if (!env.GOOGLE_MAPS_API_KEY) return [];

  const body = {
    includedTypes: ["golf_course"],
    maxResultCount: PER_MARKET,
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: radiusM
      }
    },
    languageCode: "en",
    regionCode: "US"
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress"
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text();
      console.warn(`  Google Places error ${res.status}: ${text.slice(0, 120)}`);
      return [];
    }
    const data = (await res.json()) as NearbySearchResponse;
    return data.places ?? [];
  } catch (e) {
    console.warn(`  Nearby search failed: ${e}`);
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseLocation(address?: string): string {
  if (!address) return "United States";
  // Take city + state from "1 Golf Dr, Pebble Beach, CA 93953, USA"
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length >= 3) return `${parts[parts.length - 3]}, ${parts[parts.length - 2].replace(/\s+\d+$/, "")}`;
  if (parts.length === 2) return parts[0];
  return address;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  if (!env.GOOGLE_MAPS_API_KEY) {
    console.error("GOOGLE_MAPS_API_KEY is not set — cannot run scraper");
    process.exit(1);
  }

  const progress = loadProgress();
  const seenIds = new Set(progress.seenPlaceIds);
  const processedKeys = new Set(progress.processedKeys);
  const marketsDone = new Set(progress.marketsDone);

  const markets = MARKETS.slice(MARKET_OFFSET, MARKET_OFFSET + MAX_MARKETS);

  console.log(`\n${"─".repeat(60)}`);
  console.log(`Golf Course Pricing Bulk Scraper`);
  console.log(`${"─".repeat(60)}`);
  console.log(`Markets: ${markets.length}  ·  Per-market: ${PER_MARKET}  ·  Resume: ${RESUME}  ·  Dry-run: ${DRY_RUN}`);
  console.log(`${"─".repeat(60)}\n`);

  for (const market of markets) {
    const marketLabel = market.label;

    if (RESUME && marketsDone.has(marketLabel)) {
      console.log(`[skip] ${marketLabel} — already done`);
      continue;
    }

    console.log(`\n[${marketLabel}] Searching…`);
    const places = await discoverCoursesNearby(market.lat, market.lng, market.radiusM);
    console.log(`  Found ${places.length} courses`);
    progress.stats.discovered += places.length;
    await sleep(PLACES_DELAY_MS);

    for (const place of places) {
      const placeId = place.id;
      const name = place.displayName?.text ?? "Unknown Course";
      const location = parseLocation(place.formattedAddress);
      const lookupKey = buildLookupKey(name, location);

      if (seenIds.has(placeId) || processedKeys.has(lookupKey)) {
        progress.stats.skipped++;
        continue;
      }

      seenIds.add(placeId);
      processedKeys.add(lookupKey);
      progress.seenPlaceIds = Array.from(seenIds);
      progress.processedKeys = Array.from(processedKeys);

      if (DRY_RUN) {
        console.log(`  [dry] ${name} — ${location}`);
        continue;
      }

      // Check cache first (already priced + fresh = skip)
      const cached = await getCachedCoursePricing(name, location);
      if (cached?.avgRate) {
        console.log(`  [cached] ${name} — $${cached.avgRate} (${cached.confidence})`);
        progress.stats.skipped++;
        saveProgress(progress);
        continue;
      }

      process.stdout.write(`  [fetch] ${name} — ${location} … `);
      try {
        const result = await fetchAndCacheCoursePricing(name, location);
        if (result?.avgRate) {
          console.log(`$${result.avgRate} (${result.confidence}) via ${result.sourceName}`);
          progress.stats.priced++;
        } else {
          console.log("no price found");
          progress.stats.failed++;
        }
      } catch (e) {
        console.log(`ERROR: ${e}`);
        progress.stats.failed++;
      }

      saveProgress(progress);
      await sleep(PRICING_DELAY_MS);
    }

    marketsDone.add(marketLabel);
    progress.marketsDone = Array.from(marketsDone);
    saveProgress(progress);

    console.log(
      `  Stats so far: ${progress.stats.priced} priced · ${progress.stats.skipped} skipped · ${progress.stats.failed} failed`
    );
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log("DONE");
  console.log(`  Discovered : ${progress.stats.discovered}`);
  console.log(`  Priced     : ${progress.stats.priced}`);
  console.log(`  Skipped    : ${progress.stats.skipped}`);
  console.log(`  Failed     : ${progress.stats.failed}`);
  console.log(`  Progress   : ${PROGRESS_FILE}`);
  console.log(`${"─".repeat(60)}\n`);
}

run().catch((err) => {
  console.error("Scraper crashed:", err);
  process.exit(1);
});
