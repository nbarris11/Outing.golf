import { hotelBedsFetch } from "./client";

interface HotelBedsDestination {
  code: string;
  name: string;
  countryCode: string;
}

interface HotelBedsDestinationsResponse {
  from: number;
  to: number;
  total: number;
  destinations: Array<{
    code: string;
    name: { content: string } | string;
    countryCode: string;
  }>;
}

let destinationCache: HotelBedsDestination[] | null = null;

export async function fetchAndCacheDestinations(): Promise<HotelBedsDestination[]> {
  const response = await hotelBedsFetch<HotelBedsDestinationsResponse>(
    "/hotel-content-api/1.0/locations/destinations?fields=code,name,countryCode&language=ENG&from=1&to=500&countryCodes=US,MX,CA,GB,IE",
    { method: "GET" }
  );

  destinationCache = (response.destinations ?? []).map((d) => ({
    code: d.code,
    name: typeof d.name === "string" ? d.name : d.name.content,
    countryCode: d.countryCode
  }));

  return destinationCache;
}

export async function resolveDestinationCode(destination: string): Promise<string | null> {
  const normalized = destination
    .toLowerCase()
    .replace(/\b(area|region|county)\b/g, "")
    .trim();

  const cache = destinationCache ?? (await fetchAndCacheDestinations());

  // Exact match first
  const exact = cache.find((d) => d.name.toLowerCase() === normalized);

  if (exact) {
    return exact.code;
  }

  // Partial match: destination name includes the search term, or term includes destination name
  const terms = normalized.split(/\s+/).filter(Boolean);

  const scored = cache
    .map((d) => {
      const dName = d.name.toLowerCase();
      const nameIncludesTerm = terms.some((t) => dName.includes(t));
      const termIncludesName = dName.split(/\s+/).every((w) => normalized.includes(w));
      const score = (nameIncludesTerm ? 1 : 0) + (termIncludesName ? 1 : 0);
      return { d, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored[0]?.d.code ?? null;
}
