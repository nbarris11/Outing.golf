import { env } from "@/lib/env";
import { logError, logInfo } from "@/lib/logger";
import type {
  DestinationOption,
  GolfCourseOption,
  Outing
} from "@/types/domain";

import { mockDestinationProvider, mockGolfProvider } from "./mock-providers";
import type {
  DestinationSearchProvider,
  GolfCourseProvider,
  ProviderDefinition
} from "./interfaces";

const GOOGLE_PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const GOOGLE_PLACES_NEARBY_SEARCH_URL = "https://places.googleapis.com/v1/places:searchNearby";
const DEFAULT_SEARCH_RADIUS_METERS = 50_000;
const DEFAULT_DESTINATION_LIMIT = 8;
const DEFAULT_GOLF_LIMIT = 4;
const LOCATION_TYPES = new Set([
  "administrative_area_level_1",
  "administrative_area_level_2",
  "country",
  "locality",
  "postal_code"
]);

type GooglePlace = {
  id: string;
  displayName?: {
    text?: string;
  };
  formattedAddress?: string;
  primaryType?: string;
  types?: string[];
  location?: {
    latitude?: number;
    longitude?: number;
    lat?: number;
    lng?: number;
  };
  rating?: number;
  userRatingCount?: number;
};

type GooglePlacesSearchResponse = {
  places?: GooglePlace[];
};

type DestinationMetadata = {
  placeId: string;
  latitude: number | null;
  longitude: number | null;
};

const destinationDefinition: ProviderDefinition<"google_places"> = {
  id: "google_places",
  key: "google-places-destination",
  label: "Google Places destination search",
  availability: "implemented",
  env: ["GOOGLE_MAPS_API_KEY"],
  notes:
    "Uses Google Places Text Search for live destination discovery, then normalizes the results into the app's destination option shape.",
  integrationTouchpoints: [
    "src/modules/providers/google-places.ts",
    "src/modules/providers/registry.ts",
    "src/modules/providers/inventory-service.ts"
  ]
};

const golfDefinition: ProviderDefinition<"google_places"> = {
  id: "google_places",
  key: "google-places-golf",
  label: "Google Places golf course search",
  availability: "implemented",
  env: ["GOOGLE_MAPS_API_KEY"],
  notes:
    "Uses Google Places Nearby Search and Text Search for live golf course discovery while the rest of the app keeps its normalized course shape.",
  integrationTouchpoints: [
    "src/modules/providers/google-places.ts",
    "src/modules/providers/registry.ts",
    "src/modules/providers/inventory-service.ts"
  ]
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getSearchRadiusMeters() {
  return clamp(env.GOOGLE_PLACES_SEARCH_RADIUS_METERS ?? DEFAULT_SEARCH_RADIUS_METERS, 1, 50_000);
}

function getPlaceName(place: GooglePlace) {
  return place.displayName?.text?.trim() || place.formattedAddress?.split(",")[0]?.trim() || "Unknown place";
}

function getPlaceLocation(place: GooglePlace) {
  const latitude = place.location?.latitude ?? place.location?.lat;
  const longitude = place.location?.longitude ?? place.location?.lng;

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return null;
  }

  return { latitude, longitude };
}

function extractRegion(place: GooglePlace) {
  const formattedAddress = place.formattedAddress?.trim();

  if (!formattedAddress) {
    return "United States";
  }

  const parts = formattedAddress
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length >= 3) {
    return parts[parts.length - 2] ?? parts[parts.length - 1] ?? "United States";
  }

  if (parts.length >= 2) {
    return parts[parts.length - 1] ?? "United States";
  }

  return formattedAddress;
}

function buildDestinationMetadata(place: GooglePlace): DestinationMetadata {
  const location = getPlaceLocation(place);

  return {
    placeId: place.id,
    latitude: location?.latitude ?? null,
    longitude: location?.longitude ?? null
  };
}

function encodeDestinationId(metadata: DestinationMetadata) {
  return [
    "google_destination",
    metadata.placeId,
    metadata.latitude?.toFixed(5) ?? "",
    metadata.longitude?.toFixed(5) ?? ""
  ].join("|");
}

function decodeDestinationId(id: string): DestinationMetadata | null {
  if (!id.startsWith("google_destination|")) {
    return null;
  }

  const [, placeId, latitudeRaw, longitudeRaw] = id.split("|");

  if (!placeId) {
    return null;
  }

  const latitude = latitudeRaw ? Number(latitudeRaw) : null;
  const longitude = longitudeRaw ? Number(longitudeRaw) : null;

  return {
    placeId,
    latitude: Number.isFinite(latitude) ? latitude : null,
    longitude: Number.isFinite(longitude) ? longitude : null
  };
}

function isGeographicalPlace(place: GooglePlace) {
  const types = new Set([...(place.types ?? []), place.primaryType].filter(Boolean));
  return Array.from(types).some((type) => LOCATION_TYPES.has(type as string));
}

function estimateDestinationNightlyRate(outing: Outing, index: number) {
  const baseByStyle = {
    value: 210,
    classic: 280,
    premium: 390,
    bucket_list: 540
  } as const;

  return baseByStyle[outing.tripStyle] + index * 25;
}

function estimateDestinationRoundCost(outing: Outing, index: number) {
  const baseByIntensity = {
    light: 95,
    balanced: 145,
    golf_first: 185
  } as const;

  const tripStyleLift = {
    value: 0,
    classic: 18,
    premium: 45,
    bucket_list: 95
  } as const;

  return baseByIntensity[outing.golfIntensity] + tripStyleLift[outing.tripStyle] + index * 12;
}

function destinationSummary(place: GooglePlace, query: string) {
  const address = place.formattedAddress ? ` around ${place.formattedAddress}` : "";
  return `Live Google Places match for ${query}${address}. Travel, stay, and golf pricing stay estimated until more inventory partners are connected.`;
}

function destinationTags(place: GooglePlace) {
  const tags = [
    "google places",
    "live location",
    ...(place.primaryType ? [place.primaryType.replaceAll("_", " ")] : [])
  ];

  return Array.from(new Set(tags));
}

function estimateGreensFee(outing: Outing, place: GooglePlace, index: number) {
  const ratingLift = place.rating ? Math.round((place.rating - 4) * 45) : 0;
  const styleLift = outing.tripStyle === "premium" ? 35 : outing.tripStyle === "bucket_list" ? 80 : 0;
  return Math.max(95, 125 + ratingLift + styleLift + index * 10);
}

function estimateQualityScore(place: GooglePlace, index: number) {
  const ratingScore = place.rating ? Math.round(place.rating * 20) : 82;
  const reviewLift = place.userRatingCount ? Math.min(8, Math.round(place.userRatingCount / 150)) : 0;
  return clamp(ratingScore + reviewLift - index, 72, 98);
}

function golfSummary(place: GooglePlace, destination: DestinationOption) {
  const ratingLabel = place.rating ? ` with a ${place.rating.toFixed(1)} Google rating` : "";
  return `Live course result near ${destination.name}${ratingLabel}. Greens fee and walking/riding fit are estimated for planning until live tee-time feeds are connected.`;
}

function golfTags(place: GooglePlace) {
  const reviewTag = place.userRatingCount ? `${place.userRatingCount}+ reviews` : null;
  const ratingTag = place.rating ? `${place.rating.toFixed(1)} rating` : null;

  return Array.from(new Set(["google places", "live course", reviewTag, ratingTag].filter(Boolean) as string[]));
}

async function searchPlaces(
  url: string,
  body: Record<string, unknown>,
  fieldMask: string
): Promise<GooglePlace[]> {
  if (!env.GOOGLE_MAPS_API_KEY) {
    throw new Error("GOOGLE_MAPS_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), env.OUTING_PROVIDER_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": fieldMask
      },
      body: JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store"
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Google Places request failed (${response.status}): ${errorBody.slice(0, 300)}`);
    }

    const payload = (await response.json()) as GooglePlacesSearchResponse;
    return payload.places ?? [];
  } finally {
    clearTimeout(timeoutId);
  }
}

async function textSearch(body: Record<string, unknown>) {
  return searchPlaces(
    GOOGLE_PLACES_TEXT_SEARCH_URL,
    body,
    [
      "places.id",
      "places.displayName.text",
      "places.formattedAddress",
      "places.location",
      "places.primaryType",
      "places.types",
      "places.rating",
      "places.userRatingCount"
    ].join(",")
  );
}

async function nearbySearch(body: Record<string, unknown>) {
  return searchPlaces(
    GOOGLE_PLACES_NEARBY_SEARCH_URL,
    body,
    [
      "places.id",
      "places.displayName.text",
      "places.formattedAddress",
      "places.location",
      "places.primaryType",
      "places.types",
      "places.rating",
      "places.userRatingCount"
    ].join(",")
  );
}

function buildDestinationQuery(outing: Outing, query: string) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return outing.name;
  }

  return normalizedQuery;
}

async function fallbackDestinations(outing: Outing, query: string, limit: number) {
  logInfo("Falling back to mock destination provider after Google Places returned no usable destinations", {
    outingId: outing.id,
    query,
    limit
  });
  return mockDestinationProvider.searchDestinations({ outing, query, limit });
}

async function fallbackGolfCourses(
  outing: Outing,
  destination: DestinationOption,
  limitPerDestination: number
) {
  logInfo("Falling back to mock golf provider after Google Places returned no usable courses", {
    outingId: outing.id,
    destinationId: destination.id,
    destinationName: destination.name,
    limitPerDestination
  });

  const fallback = await mockGolfProvider.searchCourses({
    outing,
    destinations: [destination],
    limitPerDestination
  });

  return fallback.slice(0, limitPerDestination);
}

export const googlePlacesDestinationProvider: DestinationSearchProvider = {
  definition: destinationDefinition,
  async searchDestinations({ outing, query, limit = DEFAULT_DESTINATION_LIMIT }) {
    const safeLimit = clamp(limit, 1, 20);
    const normalizedQuery = buildDestinationQuery(outing, query ?? outing.destinationLabel);

    try {
      const places = await textSearch({
        textQuery: normalizedQuery,
        languageCode: "en",
        regionCode: "US",
        pageSize: safeLimit
      });

      const geographicalPlaces = places.filter(isGeographicalPlace).slice(0, safeLimit);

      if (!geographicalPlaces.length) {
        return fallbackDestinations(outing, normalizedQuery, safeLimit);
      }

      return geographicalPlaces.map((place, index) => {
        const metadata = buildDestinationMetadata(place);

        return {
          id: encodeDestinationId(metadata),
          outingId: outing.id,
          providerKey: destinationDefinition.key,
          name: getPlaceName(place),
          region: extractRegion(place),
          driveHours: null,
          flightHours: Number((2.3 + index * 0.35).toFixed(1)),
          averageNightlyRate: estimateDestinationNightlyRate(outing, index),
          averageRoundCost: estimateDestinationRoundCost(outing, index),
          tags: destinationTags(place),
          summary: destinationSummary(place, normalizedQuery),
          featured: index === 0,
          hidden: false
        } satisfies DestinationOption;
      });
    } catch (error) {
      logError("Google Places destination search failed", error, {
        outingId: outing.id,
        query: normalizedQuery
      });
      return fallbackDestinations(outing, normalizedQuery, safeLimit);
    }
  }
};

export const googlePlacesGolfProvider: GolfCourseProvider = {
  definition: golfDefinition,
  async searchCourses({ outing, destinations, limitPerDestination = DEFAULT_GOLF_LIMIT }) {
    const safeLimit = clamp(limitPerDestination, 1, 20);
    const allCourses: GolfCourseOption[] = [];

    for (const destination of destinations) {
      const metadata = decodeDestinationId(destination.id);

      // Detect state/region-level destinations — the destination name won't contain
      // a comma and will match a broad administrative area. For these we skip nearby
      // search (which only covers a 50km radius around the centroid) and go straight
      // to a text search so we get courses spread across the whole state.
      const isBroadArea =
        !destination.name.includes(",") &&
        (destination.region === destination.name || destination.name.split(" ").length <= 3);

      try {
        let places: GooglePlace[] = [];

        if (!isBroadArea && metadata?.latitude != null && metadata.longitude != null) {
          places = await nearbySearch({
            includedTypes: ["golf_course"],
            languageCode: "en",
            regionCode: "US",
            maxResultCount: safeLimit,
            rankPreference: "POPULARITY",
            locationRestriction: {
              circle: {
                center: {
                  latitude: metadata.latitude,
                  longitude: metadata.longitude
                },
                radius: getSearchRadiusMeters()
              }
            }
          });
        }

        if (!places.length) {
          places = await textSearch({
            textQuery: `best golf courses in ${destination.name}`,
            includedType: "golf_course",
            strictTypeFiltering: true,
            languageCode: "en",
            regionCode: "US",
            pageSize: safeLimit
          });
        }

        // If still not enough, do a second search for more variety
        if (places.length < safeLimit / 2) {
          const more = await textSearch({
            textQuery: `public golf courses ${destination.name}`,
            includedType: "golf_course",
            strictTypeFiltering: true,
            languageCode: "en",
            regionCode: "US",
            pageSize: safeLimit
          });
          const existingIds = new Set(places.map(p => p.id));
          places.push(...more.filter(p => !existingIds.has(p.id)));
        }

        if (!places.length) {
          allCourses.push(...(await fallbackGolfCourses(outing, destination, safeLimit)));
          continue;
        }

        allCourses.push(
          ...places.slice(0, safeLimit).map((place, index) => ({
            id: `google_course|${place.id}|${destination.id}`,
            outingId: outing.id,
            destinationOptionId: destination.id,
            providerKey: golfDefinition.key,
            name: getPlaceName(place),
            locationLabel: place.formattedAddress?.trim() || `${destination.name}, ${destination.region}`,
            averageGreensFee: estimateGreensFee(outing, place, index),
            qualityScore: estimateQualityScore(place, index),
            rideFriendly: true,
            walkingFriendly: (place.rating ?? 0) >= 4.2 || index % 2 === 0,
            summary: golfSummary(place, destination),
            tags: golfTags(place),
            featured: index === 0,
            hidden: false
          }))
        );
      } catch (error) {
        logError("Google Places golf search failed", error, {
          outingId: outing.id,
          destinationId: destination.id,
          destinationName: destination.name
        });
        allCourses.push(...(await fallbackGolfCourses(outing, destination, safeLimit)));
      }
    }

    return allCourses;
  }
};
