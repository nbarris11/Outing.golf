import { courseWebsiteDescription } from "@/modules/providers/course-description";
import { NextResponse } from "next/server";
import { requireProfile } from "@/lib/auth";
import { getOutingDetail } from "@/modules/outings/service";
import { env } from "@/lib/env";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ outingId: string; courseId: string }> },
) {
  const profile = await requireProfile();
  const { outingId, courseId } = await params;
  const detail = await getOutingDetail(outingId, profile.id);
  const course = detail?.golfCourses.find((c) => c.id === courseId);
  if (!detail || !course)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!env.GOOGLE_MAPS_API_KEY) return NextResponse.json({});
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
    if (!response.ok) return NextResponse.json({});
    const place = (await response.json()).places?.[0];
    if (!place) return NextResponse.json({});
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
    return NextResponse.json(
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
    return NextResponse.json({});
  }
}
