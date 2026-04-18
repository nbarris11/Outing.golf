import { redirect } from "next/navigation";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { TripBoardingPass } from "@/components/trip/trip-boarding-pass";
import { TripCountdown } from "@/components/trip/trip-countdown";
import { TripLineup } from "@/components/trip/trip-lineup";
import { TripPackingList } from "@/components/trip/trip-packing-list";
import { TripTeeTimes } from "@/components/trip/trip-tee-times";
import { requireProfile } from "@/lib/auth";
import { seedPersonalPackingItems, seedGroupPackingItems } from "@/lib/actions/trip";
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

  // Seed packing items on first visit (personal per-user, group per-outing)
  await Promise.all([
    seedPersonalPackingItems(outingId, profile.id),
    seedGroupPackingItems(outingId)
  ]);
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
      {/* Breadcrumb */}
      <div className="px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/outings/${outingId}`}
            className="inline-flex items-center gap-1.5 text-sm text-cream/50 transition hover:text-cream/80"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to outing
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-10 pb-14 sm:px-6 lg:px-8">
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
            courses={detail.golfCourses
              .filter((c) => !c.hidden)
              .sort((a, b) => {
                if (a.scheduleDay == null && b.scheduleDay == null) return 0;
                if (a.scheduleDay == null) return 1;
                if (b.scheduleDay == null) return -1;
                return a.scheduleDay - b.scheduleDay;
              })}
            lodgingName={topLodging?.name ?? null}
            lodgingAddress={topLodging?.hotelAddress ?? null}
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

              {/* Tee times */}
              <TripTeeTimes bookings={detail.outing.teeTimeBookings ?? []} />

              {/* Quick links */}
              <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-charcoal/6">
                <h3 className="font-serif text-xl font-semibold text-forest-900">Quick links</h3>
                <ul className="mt-4 space-y-2">
                  {/* weather */}
                  {destinationForWeather && (
                    <li>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(`10 day weather forecast ${destinationForWeather}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3 text-sm font-medium text-charcoal hover:bg-sand transition-colors"
                      >
                        <span className="text-lg">🌤</span>
                        <span>10-day forecast for {destinationForWeather}</span>
                      </a>
                    </li>
                  )}
                  {/* each course directions link */}
                  {(() => {
                    const visibleCourses = detail.golfCourses.filter((c) => !c.hidden);
                    const scheduledCourses = visibleCourses.filter((c) => c.scheduleDay != null);
                    const coursesToShow = scheduledCourses.length > 0
                      ? [...scheduledCourses].sort((a, b) => (a.scheduleDay ?? 0) - (b.scheduleDay ?? 0))
                      : topCourse ? [topCourse] : [];
                    return coursesToShow.map((course) => (
                      <li key={course.id}>
                        <a
                          href={`https://www.google.com/maps/search/${encodeURIComponent(`${course.name} ${destinationForWeather}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3 text-sm font-medium text-charcoal hover:bg-sand transition-colors"
                        >
                          <span className="text-lg">⛳</span>
                          <span>Directions to {course.name}</span>
                        </a>
                      </li>
                    ));
                  })()}
                  {/* bars & restaurants */}
                  <li>
                    {(() => {
                      // Build the most specific address available for the lodging location
                      const lodgingSearchAddr =
                        topLodging?.hotelAddress
                          ? topLodging.hotelAddress
                          : [topLodging?.name, topLodging?.city, topLodging?.state]
                              .filter(Boolean)
                              .join(", ") || destinationForWeather;
                      return (
                        <a
                          href={`https://www.google.com/maps/search/bars+and+restaurants+near+${encodeURIComponent(lodgingSearchAddr)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3 text-sm font-medium text-charcoal hover:bg-sand transition-colors"
                        >
                          <span className="text-lg">🍺</span>
                          <span>Bars &amp; restaurants near lodging</span>
                        </a>
                      );
                    })()}
                  </li>
                  {/* Ride links: one Uber + one Lyft per course, pickup = lodging */}
                  {(() => {
                    const visibleCourses = detail.golfCourses.filter((c) => !c.hidden);
                    const scheduledCourses = visibleCourses.filter((c) => c.scheduleDay != null);
                    const coursesToShow = scheduledCourses.length > 0
                      ? [...scheduledCourses].sort((a, b) => (a.scheduleDay ?? 0) - (b.scheduleDay ?? 0))
                      : topCourse ? [topCourse] : [];
                    const pickup = lodgingAddress ?? destinationForWeather;
                    return coursesToShow.map((course) => {
                      const dropoff = `${course.name}${course.locationLabel ? `, ${course.locationLabel}` : ""}`;
                      const uberUrl = pickup
                        ? `https://m.uber.com/ul/?action=setPickup&pickup[formatted_address]=${encodeURIComponent(pickup)}&dropoff[formatted_address]=${encodeURIComponent(dropoff)}`
                        : `https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=${encodeURIComponent(dropoff)}`;
                      const lyftUrl = pickup
                        ? `https://lyft.com/ride?id=lyft&pickup[address]=${encodeURIComponent(pickup)}&destination[address]=${encodeURIComponent(dropoff)}`
                        : `https://lyft.com/ride?id=lyft&destination[address]=${encodeURIComponent(dropoff)}`;
                      const courseLabel = coursesToShow.length > 1
                        ? `${course.scheduleDay ? `Day ${course.scheduleDay} · ` : ""}${course.name}`
                        : course.name;
                      return (
                        <>
                          <li key={`uber-${course.id}`}>
                            <a
                              href={uberUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3 text-sm font-medium text-charcoal hover:bg-sand transition-colors"
                            >
                              <span className="text-lg">🚗</span>
                              <span>Uber to {courseLabel}</span>
                            </a>
                          </li>
                          <li key={`lyft-${course.id}`}>
                            <a
                              href={lyftUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3 text-sm font-medium text-charcoal hover:bg-sand transition-colors"
                            >
                              <span className="text-lg">🚕</span>
                              <span>Lyft to {courseLabel}</span>
                            </a>
                          </li>
                        </>
                      );
                    });
                  })()}
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
      <SiteFooter />
    </div>
  );
}
