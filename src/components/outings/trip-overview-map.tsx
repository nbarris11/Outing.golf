import type { GolfCourseOption, LodgingOption } from "@/types/domain";
import { courseRoundDays } from "@/lib/trip-plan";
export function TripOverviewMap({
  courses,
  lodging,
}: {
  courses: GolfCourseOption[];
  lodging: LodgingOption | null;
}) {
  const selected = courses
    .filter((c) => c.featured && !c.hidden)
    .sort(
      (a, b) =>
        Math.min(...courseRoundDays(a).map((d) => d ?? 999)) -
        Math.min(...courseRoundDays(b).map((d) => d ?? 999)),
    );
  const stops = [
    ...(lodging
      ? [
          {
            name: lodging.name,
            address: lodging.hotelAddress || lodging.name,
            kind: "Stay",
          },
        ]
      : []),
    ...selected.map((c) => ({
      name: c.name,
      address: `${c.name}, ${c.locationLabel}`,
      kind: "Course",
    })),
  ];
  if (!stops.length) return null;
  const mapped = stops.slice(0, 5); // Three intermediate stops work in both mobile and desktop Maps URLs.
  const route = new URLSearchParams({
    api: "1",
    origin: mapped[0].address,
    destination: mapped[mapped.length - 1].address,
    travelmode: "driving",
  });
  if (mapped.length > 2)
    route.set(
      "waypoints",
      mapped
        .slice(1, -1)
        .map((s) => s.address)
        .join("|"),
    );
  const routeUrl =
    mapped.length > 1
      ? `https://www.google.com/maps/dir/?${route}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapped[0].address)}`;
  const embed =
    mapped.length > 1
      ? `https://maps.google.com/maps?saddr=${encodeURIComponent(mapped[0].address)}&daddr=${mapped
          .slice(1)
          .map((s) => encodeURIComponent(s.address))
          .join("+to:")}&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(mapped[0].address)}&output=embed`;
  return (
    <details className="mt-5 overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
      <summary className="cursor-pointer p-5 font-semibold">
        Your trip on the map{" "}
        <span className="ml-2 text-sm font-normal text-charcoal/60">
          {selected.length} courses{lodging ? " + your stay" : ""}
        </span>
      </summary>
      <div className="grid gap-4 p-4 pt-0 lg:grid-cols-[2fr_1fr]">
        <iframe
          title="Trip overview map"
          src={embed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-80 w-full rounded-xl border-0"
        />
        <div>
          <p className="mb-3 text-sm text-charcoal/60">
            See how your stay and rounds fit together. Open directions for
            current drive times.
          </p>
          <ol className="space-y-3">
            {stops.map((stop, i) => (
              <li key={`${stop.name}-${i}`} className="text-sm">
                <span className="font-semibold">
                  {i + 1}. {stop.name}
                </span>
                <p className="text-xs text-charcoal/60">{stop.kind}</p>
                <a
                  className="text-xs underline"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View location ↗
                </a>
              </li>
            ))}
          </ol>
          <a
            className="mt-4 inline-block rounded-full bg-forest-900 px-4 py-2 text-sm text-white"
            href={routeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open route & drive times ↗
          </a>
          {stops.length > 5 && (
            <p className="mt-2 text-xs text-charcoal/60">
              The route shows the first five stops. Open the other locations
              above for directions.
            </p>
          )}
          <p className="mt-2 text-xs text-charcoal/60">
            Route order follows the itinerary. Confirm each location before
            travelling.
          </p>
        </div>
      </div>
    </details>
  );
}
