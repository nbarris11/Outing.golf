import { redirect } from "next/navigation";

import { TripBoardingPass } from "@/components/trip/trip-boarding-pass";
import { TripCountdown } from "@/components/trip/trip-countdown";
import { TripLineup } from "@/components/trip/trip-lineup";
import { TripPackingList } from "@/components/trip/trip-packing-list";
import { requireProfile } from "@/lib/auth";
import { seedPackingItemsIfEmpty } from "@/lib/actions/trip";
import { getOutingDetail, getTripPackingItems } from "@/modules/outings/service";

export default async function TripHqPage({
  params
}: {
  params: Promise<{ outingId: string }>;
}) {
  const profile = await requireProfile();
  const { outingId } = await params;
  const detail = await getOutingDetail(outingId, profile.id);

  if (!detail) redirect("/dashboard");

  if (detail.outing.status !== "booked" && detail.outing.status !== "completed") {
    redirect(`/outings/${outingId}`);
  }

  const isOrganizer = detail.outing.organizerId === profile.id;

  // Seed default packing items on first visit (safe to call during render)
  await seedPackingItemsIfEmpty(outingId);
  const packingItems = await getTripPackingItems(outingId);

  // Find top course and lodging
  const topCourse =
    detail.golfCourses.find((c) => c.featured) ?? detail.golfCourses[0] ?? null;
  const topLodging =
    detail.lodging.find((l) => l.topPick) ??
    detail.lodging.find((l) => l.featured) ??
    detail.lodging[0] ??
    null;

  // Trip dates
  const tripStart =
    (detail.outing.preferredDateWindows[0] as { start?: string } | undefined)?.start ?? null;
  const tripEnd =
    (detail.outing.preferredDateWindows[0] as { end?: string } | undefined)?.end ?? null;

  // Build member list
  const memberList = detail.members.map((m) => {
    const p = detail.profiles.find((prof) => prof.id === m.profileId);
    const pref = detail.preferences.find((pr) => pr.profileId === m.profileId);
    return {
      name: p?.fullName ?? p?.email ?? "Member",
      email: p?.email ?? "",
      role: m.role,
      homeCity: pref?.homeCity ?? null
    };
  });

  // Profile name map for packing list
  const profileNameMap = new Map(
    detail.profiles.map((p) => [p.id, p.fullName ?? p.email ?? "Someone"])
  );

  // Member first names for boarding pass
  const memberFirstNames = memberList.map((m) => m.name.split(" ")[0]);

  // Quick links helpers
  const courseAddress = topCourse?.locationLabel ?? topCourse?.name ?? null;
  const lodgingAddress = topLodging?.hotelAddress ?? topLodging?.name ?? null;
  const destinationForWeather = detail.outing.destinationLabel ?? "";

  return (
    <div className="min-h-screen bg-forest-900">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-14 sm:px-6 lg:px-8">
        {/* Subtle dot pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #f7f4ee 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cream/45">
            trip confirmed
          </p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.04em] text-cream sm:text-7xl">
            {detail.outing.name}
          </h1>
          {detail.outing.destinationLabel && (
            <p className="mt-3 text-lg text-cream/65">{detail.outing.destinationLabel}</p>
          )}
          {tripStart && <TripCountdown targetDate={tripStart} />}
        </div>
      </section>

      {/* Content area on cream */}
      <div className="rounded-t-[40px] bg-cream min-h-screen">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

          {/* Boarding pass */}
          <TripBoardingPass
            outingName={detail.outing.name}
            destination={detail.outing.destinationLabel ?? "TBD"}
            startDate={tripStart ?? ""}
            endDate={tripEnd ?? ""}
            courseName={topCourse?.name ?? null}
            lodgingName={topLodging?.name ?? null}
            playerCount={detail.outing.numberOfPlayers}
            memberNames={memberFirstNames}
          />

          {/* Two-column grid */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Packing list */}
            <TripPackingList
              items={packingItems}
              outingId={outingId}
              currentProfileId={profile.id}
              isOrganizer={isOrganizer}
              profiles={profileNameMap}
            />

            {/* Right column */}
            <div className="space-y-6">
              {/* Lineup */}
              <TripLineup members={memberList} />

              {/* Quick links */}
              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-charcoal/6">
                <h3 className="font-serif text-xl font-semibold text-forest-900">Quick links</h3>
                <ul className="mt-4 space-y-3">
                  {destinationForWeather && (
                    <li>
                      <a
                        href={`https://weather.com/weather/tenday/l/${encodeURIComponent(destinationForWeather)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3 text-sm font-medium text-charcoal hover:bg-sand transition-colors"
                      >
                        <span className="text-lg">🌤</span>
                        <span>10-day forecast for {destinationForWeather}</span>
                      </a>
                    </li>
                  )}
                  {courseAddress && (
                    <li>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(courseAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3 text-sm font-medium text-charcoal hover:bg-sand transition-colors"
                      >
                        <span className="text-lg">⛳</span>
                        <span>Directions to {topCourse?.name}</span>
                      </a>
                    </li>
                  )}
                  {lodgingAddress && (
                    <li>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(lodgingAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3 text-sm font-medium text-charcoal hover:bg-sand transition-colors"
                      >
                        <span className="text-lg">🏠</span>
                        <span>Directions to {topLodging?.name}</span>
                      </a>
                    </li>
                  )}
                  <li>
                    <a
                      href={`/outings/${outingId}`}
                      className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3 text-sm font-medium text-charcoal hover:bg-sand transition-colors"
                    >
                      <span className="text-lg">📋</span>
                      <span>View planning details</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Organizer link */}
          {isOrganizer && (
            <div className="mt-10 text-center">
              <a
                href={`/outings/${outingId}`}
                className="text-sm text-charcoal/50 hover:text-forest-900 transition-colors"
              >
                ← Manage outing settings
              </a>
            </div>
          )}

          <div className="mt-12 pb-8" />
        </div>
      </div>
    </div>
  );
}
