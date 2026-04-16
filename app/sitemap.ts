import type { MetadataRoute } from "next";

const BASE_URL = "https://www.outing.golf";
const LAST_MOD = new Date("2026-04-16");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: LAST_MOD,
      changeFrequency: "weekly",
      priority: 1.0
    },
    {
      url: `${BASE_URL}/how-it-works`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${BASE_URL}/how-to-plan-a-golf-trip`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${BASE_URL}/golf-trip-planning-checklist`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/golf-trip-itinerary-template`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/golf-trip-cost-per-person`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/golf-trip-budget-breakdown`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/golf-trip-budget-planner`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/golf-trip-spreadsheet-alternative`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/best-golf-trip-destinations`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${BASE_URL}/best-golf-trip-destinations-for-groups`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/best-budget-golf-trip-destinations`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/bachelor-golf-trip-planner`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/bachelor-golf-trip-itinerary`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/organize-a-golf-trip-with-friends`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/annual-golf-trip-checklist`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/golf-weekend-planning-checklist`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/golf-trip-planner-large-groups`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/golf-trip-planner-vs-spreadsheet`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/buddies-golf-trip-planner`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/scottsdale-golf-trip-planner`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${BASE_URL}/myrtle-beach-golf-trip-planner`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${BASE_URL}/palm-springs-golf-trip-planner`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/pinehurst-golf-trip-planner`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${BASE_URL}/kiawah-island-golf-trip-planner`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${BASE_URL}/pebble-beach-golf-trip-planner`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.6
    },
    {
      url: `${BASE_URL}/advertise`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: LAST_MOD,
      changeFrequency: "monthly",
      priority: 0.5
    }
  ];
}
