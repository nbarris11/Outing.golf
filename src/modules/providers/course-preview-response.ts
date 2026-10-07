import { courseWebsiteDescription } from "@/modules/providers/course-description";
import { env } from "@/lib/env";
import { NextResponse } from "next/server";
import type { GolfCourseOption } from "@/types/domain";
const json = NextResponse.json;
export async function coursePreviewResponse(course: GolfCourseOption) {
  if (!env.GOOGLE_MAPS_API_KEY) return json({});
  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask":
            "places.displayName,places.editorialSummary,places.photos,places.googleMapsUri,places.websiteUri,places.rating,places.userRatingCount",
        },
        body: JSON.stringify({
          textQuery: `${course.name} ${course.locationLabel}`,
          pageSize: 1,
        }),
      },
    );
    if (!response.ok) return json({});
    const place = (await response.json()).places?.[0];
    if (!place) return json({});
    const descriptionPromise = place.editorialSummary?.text
      ? Promise.resolve(place.editorialSummary.text as string)
      : place.websiteUri
        ? courseWebsiteDescription(place.websiteUri.replace(/^http:/, "https:"))
        : Promise.resolve(null);
    let photoUrl: string | undefined;
    const photo = place.photos?.[0];
    if (photo?.name && /^places\/[^/]+\/photos\/[^/]+$/.test(photo.name)) {
      const photoResponse = await fetch(
        `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=900&skipHttpRedirect=true`,
        {
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
          headers: { "X-Goog-Api-Key": env.GOOGLE_MAPS_API_KEY },
        },
      ).catch(() => null);
      if (photoResponse?.ok) photoUrl = (await photoResponse.json()).photoUri;
    }
    return json(
      {
        description: await descriptionPromise,
        descriptionSource: place.editorialSummary?.text
          ? "Google Maps"
          : "Course website",
        photoUrl,
        attribution: photo?.authorAttributions
          ?.map((a: { displayName: string }) => a.displayName)
          .join(", "),
        website: place.websiteUri,
        maps: place.googleMapsUri,
        rating: place.rating,
        reviews: place.userRatingCount,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return json({});
  }
}
