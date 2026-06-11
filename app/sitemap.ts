import type { MetadataRoute } from "next";

const BASE_URL = "https://www.outing.golf";

// Per-route last-modified dates. Update the date for a route whenever its
// content meaningfully changes — search engines use lastmod as a recrawl hint
// and a single uniform date across the site reads as fabricated.
const APRIL_REFRESH = new Date("2026-04-16");
const JUNE_REFRESH = new Date("2026-06-10");

type RouteEntry = {
  path: string;
  lastModified: Date;
  changeFrequency: "weekly" | "monthly";
  priority: number;
};

const ROUTES: RouteEntry[] = [
  { path: "/", lastModified: JUNE_REFRESH, changeFrequency: "weekly", priority: 1.0 },
  { path: "/how-it-works", lastModified: JUNE_REFRESH, changeFrequency: "monthly", priority: 0.8 },
  { path: "/pricing", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.8 },
  { path: "/sample-trip", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/how-to-plan-a-golf-trip", lastModified: JUNE_REFRESH, changeFrequency: "monthly", priority: 0.8 },
  { path: "/best-golf-trip-planner-apps", lastModified: JUNE_REFRESH, changeFrequency: "monthly", priority: 0.8 },
  { path: "/golf-outing-organizer", lastModified: JUNE_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/golf-trip-planning-checklist", lastModified: JUNE_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/golf-trip-itinerary-template", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/golf-trip-cost-per-person", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/golf-trip-budget-breakdown", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/golf-trip-budget-planner", lastModified: JUNE_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/golf-trip-spreadsheet-alternative", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/best-golf-trip-destinations", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.8 },
  { path: "/best-golf-trip-destinations-for-groups", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/best-budget-golf-trip-destinations", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/bachelor-golf-trip-planner", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/bachelor-golf-trip-itinerary", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/organize-a-golf-trip-with-friends", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/annual-golf-trip-checklist", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/golf-weekend-planning-checklist", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/golf-trip-planner-large-groups", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/golf-trip-planner-vs-spreadsheet", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/buddies-golf-trip-planner", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/scottsdale-golf-trip-planner", lastModified: JUNE_REFRESH, changeFrequency: "monthly", priority: 0.8 },
  { path: "/myrtle-beach-golf-trip-planner", lastModified: JUNE_REFRESH, changeFrequency: "monthly", priority: 0.8 },
  { path: "/palm-springs-golf-trip-planner", lastModified: JUNE_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/pinehurst-golf-trip-planner", lastModified: JUNE_REFRESH, changeFrequency: "monthly", priority: 0.7 },
  { path: "/kiawah-island-golf-trip-planner", lastModified: JUNE_REFRESH, changeFrequency: "monthly", priority: 0.8 },
  { path: "/pebble-beach-golf-trip-planner", lastModified: JUNE_REFRESH, changeFrequency: "monthly", priority: 0.8 },
  { path: "/about", lastModified: JUNE_REFRESH, changeFrequency: "monthly", priority: 0.6 },
  { path: "/advertise", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", lastModified: APRIL_REFRESH, changeFrequency: "monthly", priority: 0.5 }
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, ...rest }) => ({
    url: path === "/" ? `${BASE_URL}/` : `${BASE_URL}${path}`,
    ...rest
  }));
}
