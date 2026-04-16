import type { MetadataRoute } from "next";

const BASE_URL = "https://www.outing.golf";

const resourcePages = [
  "/how-it-works",
  "/how-to-plan-a-golf-trip",
  "/golf-trip-planning-checklist",
  "/golf-trip-itinerary-template",
  "/golf-trip-cost-per-person",
  "/golf-trip-budget-breakdown",
  "/golf-trip-budget-planner",
  "/golf-trip-spreadsheet-alternative",
  "/best-golf-trip-destinations",
  "/best-golf-trip-destinations-for-groups",
  "/best-budget-golf-trip-destinations",
  "/bachelor-golf-trip-planner",
  "/bachelor-golf-trip-itinerary",
  "/organize-a-golf-trip-with-friends",
  "/annual-golf-trip-checklist",
  "/golf-weekend-planning-checklist",
  "/golf-trip-planner-large-groups",
  "/golf-trip-planner-vs-spreadsheet",
  "/buddies-golf-trip-planner",
  "/scottsdale-golf-trip-planner",
  "/myrtle-beach-golf-trip-planner",
  "/palm-springs-golf-trip-planner",
  "/pinehurst-golf-trip-planner"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0
    },
    {
      url: `${BASE_URL}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6
    },
    {
      url: `${BASE_URL}/sample-trip`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    },
    ...resourcePages
      .filter((p) => p !== "/how-it-works")
      .map((path) => ({
        url: `${BASE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7
      }))
  ];
}
