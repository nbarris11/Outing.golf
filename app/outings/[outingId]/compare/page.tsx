import { notFound } from "next/navigation";
import Link from "next/link";

import { BackButton } from "@/components/common/back-button";
import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { LodgingSearchPanel } from "@/components/outings/lodging-search-panel";
import { MarkAsBookedButton } from "@/components/outings/mark-as-booked-button";
import { RentalListingPanel } from "@/components/outings/rental-listing-panel";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";
import { markAsBookedAction } from "@/lib/actions/outings";
import { currency } from "@/lib/utils";
import { isAdmin } from "@/modules/outings/permissions";
import { getOutingDetail } from "@/modules/outings/service";

export default async function ComparePage({
  params
}: {
  params: Promise<{ outingId: string }>;
}) {
  const profile = await requireProfile();
  const { outingId } = await params;
  const detail = await getOutingDetail(outingId, profile.id);

  if (!detail) {
    notFound();
  }

  const defaultWindow = detail.outing.preferredDateWindows[0];
  const favoriteLodgingIds = detail.favorites
    .filter((item) => item.entityType === "lodging")
    .map((item) => item.entityId);
  const canManageLodging = detail.outing.organizerId === profile.id || isAdmin(profile);

  const nights = defaultWindow
    ? Math.max(
        1,
        Math.round(
          (new Date(defaultWindow.end).getTime() - new Date(defaultWindow.start).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 3;
  const roundsPerPlayer =
    detail.recommendation.consensusRounds ??
    (detail.outing.golfIntensity === "light"
      ? 2
      : detail.outing.golfIntensity === "golf_first"
        ? 4
        : 3);
  const players = detail.outing.numberOfPlayers;

  // Deduplicate lodging by name — sort featured first so the featured entry wins when names collide
  const seenLodgingNames = new Set<string>();
  const dedupedLodging = [...detail.lodging]
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .filter((stay) => {
      if (seenLodgingNames.has(stay.name)) return false;
      seenLodgingNames.add(stay.name);
      return true;
    });

  // Summary of what's already "in the trip" (real organizer picks, not a sandbox)
  const pickedCourses = detail.golfCourses.filter((c) => c.featured && !c.hidden);
  const pickedLodging = dedupedLodging.find((l) => l.featured && !l.hidden) ?? null;
  const picksCount = pickedCourses.length + (pickedLodging ? 1 : 0);

  const isOrganizer = detail.outing.organizerId === profile.id || isAdmin(profile);
  const isBooked = detail.outing.status === "booked" || detail.outing.status === "completed";
  const votingOpen = detail.outing.votingOpen;
  const allVotes = detail.votes;
  const bookingState = !votingOpen && allVotes.length > 0 ? "ready" : votingOpen ? "voting_open" : "no_vote";

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton fallback={`/outings/${outingId}`} label="Back to outing" />
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Trip overview</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              The whole trip at a glance
            </h1>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              Read-only summary: recommendations, destination costs, and rental options. To add or change picks, head back to the Organize page.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
            <Link
              href={`/outings/${outingId}`}
              className="inline-flex h-11 items-center justify-center rounded-full bg-forest-900 px-5 text-sm font-semibold text-cream shadow-[0_4px_14px_rgba(20,58,44,0.25)] hover:bg-forest-900/90 transition-colors"
            >
              {picksCount > 0 ? "Edit picks on Organize →" : "Pick courses on Organize →"}
            </Link>
            {isOrganizer && !isBooked && (
              <MarkAsBookedButton
                outingId={outingId}
                markAsBooked={markAsBookedAction}
                bookingState={bookingState}
              />
            )}
            {isOrganizer && isBooked && (
              <Link
                href={`/outings/${outingId}/trip`}
                className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
              >
                → View Trip HQ
              </Link>
            )}
          </div>
        </div>

        {/* ── Current picks summary (what's already "in the trip") ── */}
        {picksCount > 0 && (
          <Card className="mt-8 border-emerald-200 bg-emerald-50/30">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-700/80">In the trip</p>
                <p className="mt-1 text-sm text-charcoal/75">
                  {pickedCourses.length > 0 && (
                    <>
                      {pickedCourses.length} course{pickedCourses.length !== 1 ? "s" : ""}: {pickedCourses.map((c) => c.name).join(", ")}
                    </>
                  )}
                  {pickedCourses.length > 0 && pickedLodging && " · "}
                  {pickedLodging && <>Hotel: {pickedLodging.name}</>}
                </p>
              </div>
              <Link
                href={`/outings/${outingId}`}
                className="shrink-0 text-sm font-semibold text-forest-900 underline underline-offset-2 hover:no-underline"
              >
                Change picks →
              </Link>
            </div>
          </Card>
        )}

        {detail.destinations.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No options to compare yet"
              body="Once the outing has provider-backed options, this page will organize the shortlist into a cleaner decision view."
            />
          </div>
        ) : (
          <div className="mt-8 space-y-6">

            {/* ── Top recommendations ── */}
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  label: "Recommended destination",
                  value:
                    detail.destinations.find(
                      (item) => item.id === detail.recommendation.destinationScores[0]?.id
                    )?.name ?? "Waiting for preferences"
                },
                {
                  label: "Recommended course",
                  value:
                    detail.golfCourses.find(
                      (item) => item.id === detail.recommendation.golfScores[0]?.id
                    )?.name ?? "Waiting for preferences"
                },
                {
                  label: "Recommended stay",
                  value:
                    dedupedLodging.find(
                      (item) => item.id === detail.recommendation.lodgingScores[0]?.id
                    )?.name ?? "Waiting for preferences"
                }
              ].map((item) => (
                <Card key={item.label} className="bg-forest-950 text-cream">
                  <p className="text-sm text-cream/56">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{item.value}</p>
                </Card>
              ))}
            </div>

            {/* ── Destination shortlist ── */}
            <Card>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.03em]">Destination shortlist</h2>
                  <p className="mt-1 text-sm text-charcoal/60">Scan cost, travel, and overall fit in one pass.</p>
                </div>
                <Badge>{detail.destinations.length} destinations</Badge>
              </div>
              <div className="mt-5 grid gap-4">
                {detail.destinations.map((destination) => {
                  const score = detail.recommendation.destinationScores.find(
                    (item) => item.id === destination.id
                  );
                  const estimatedPerPerson =
                    destination.averageRoundCost * roundsPerPlayer +
                    Math.round((destination.averageNightlyRate * nights) / players);
                  return (
                    <div
                      key={destination.id}
                      className="rounded-[28px] border border-charcoal/8 bg-cream p-5"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-semibold tracking-[-0.03em]">
                              {destination.name}
                            </h3>
                            <Badge>{destination.region}</Badge>
                          </div>
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-charcoal/68">
                            {destination.summary}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {destination.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-white px-3 py-1 text-xs text-charcoal/60"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-4 lg:min-w-[400px]">
                          <div className="rounded-[20px] bg-white p-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-charcoal/45">Golf</p>
                            <p className="mt-2 text-sm font-semibold">
                              {currency(destination.averageRoundCost)}/round
                            </p>
                          </div>
                          <div className="rounded-[20px] bg-white p-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-charcoal/45">Stay</p>
                            <p className="mt-2 text-sm font-semibold">
                              {currency(destination.averageNightlyRate)}/night
                            </p>
                          </div>
                          <div className="rounded-[20px] bg-white p-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-charcoal/45">Travel</p>
                            <p className="mt-2 text-sm font-semibold">
                              {destination.driveHours
                                ? `${destination.driveHours}h drive`
                                : `${destination.flightHours}h flight`}
                            </p>
                          </div>
                          <div className="rounded-[20px] bg-forest-900/8 p-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-charcoal/45">Est./person</p>
                            <p className="mt-2 text-sm font-semibold text-forest-900">
                              {currency(estimatedPerPerson)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-charcoal/56">Overall fit score</p>
                        <p className="text-lg font-semibold text-forest-900">{score?.score ?? 0}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* ── Golf course shortlist ── */}
            {(() => {
              const visibleCourses = detail.golfCourses.filter((c) => !c.hidden);
              if (visibleCourses.length === 0) return null;
              const sortedCourses = [
                ...visibleCourses.filter((c) => c.featured),
                ...visibleCourses.filter((c) => !c.featured)
              ];
              return (
                <Card>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold tracking-[-0.03em]">Golf course shortlist</h2>
                      <p className="mt-1 text-sm text-charcoal/60">Compare courses by quality, walkability, and price.</p>
                    </div>
                    <Badge>{visibleCourses.length} courses</Badge>
                  </div>
                  <div className="mt-5 grid gap-4">
                    {sortedCourses.map((course) => {
                      const score = detail.recommendation.golfScores.find((s) => s.id === course.id);
                      return (
                        <div
                          key={course.id}
                          className={`rounded-[28px] border p-5 ${course.featured ? "border-emerald-200 bg-emerald-50/30" : "border-charcoal/8 bg-cream"}`}
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-semibold tracking-[-0.03em]">{course.name}</h3>
                                {course.featured && (
                                  <Badge className="bg-emerald-600 text-white">✓ In the trip</Badge>
                                )}
                              </div>
                              {course.locationLabel && (
                                <p className="mt-1 text-sm text-charcoal/60">{course.locationLabel}</p>
                              )}
                              {course.summary && (
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-charcoal/68">{course.summary}</p>
                              )}
                              {course.tags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {course.tags.map((tag) => (
                                    <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs text-charcoal/60">{tag}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex shrink-0 flex-wrap gap-3 lg:flex-col lg:items-end">
                              {course.averageGreensFee > 0 && (
                                <div className="rounded-[20px] bg-white px-4 py-3 text-right">
                                  <p className="text-xs uppercase tracking-[0.2em] text-charcoal/45">Greens fee</p>
                                  <p className="mt-1 text-sm font-semibold">${course.averageGreensFee}/round</p>
                                </div>
                              )}
                              {course.qualityScore > 0 && (
                                <div className="rounded-[20px] bg-white px-4 py-3 text-right">
                                  <p className="text-xs uppercase tracking-[0.2em] text-charcoal/45">Quality</p>
                                  <p className="mt-1 text-sm font-semibold">{course.qualityScore}/10</p>
                                </div>
                              )}
                            </div>
                          </div>
                          {(course.walkingFriendly || course.rideFriendly) && (
                            <div className="mt-4 flex flex-wrap gap-3 text-xs text-charcoal/55">
                              {course.walkingFriendly && <span>🚶 Walking friendly</span>}
                              {course.rideFriendly && <span>🛺 Ride-friendly</span>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })()}

            {/* ── Airbnb / VRBO (everyone) + manual listing (organizer only) ── */}
            <RentalListingPanel
              outingId={detail.outing.id}
              destination={detail.outing.destinationLabel}
              checkIn={defaultWindow?.start ?? new Date().toISOString().slice(0, 10)}
              checkOut={defaultWindow?.end ?? new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10)}
              guests={detail.outing.numberOfPlayers}
              nights={nights}
              players={players}
              isOrganizer={canManageLodging}
            />

            {/* ── Live hotel search (organizer only) ── */}
            {canManageLodging && (
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.22em] text-charcoal/40">
                  Search hotels
                </p>
                <LodgingSearchPanel
                  outingId={detail.outing.id}
                  destination={detail.outing.destinationLabel}
                  defaultCheckIn={defaultWindow?.start ?? new Date().toISOString().slice(0, 10)}
                  defaultCheckOut={
                    defaultWindow?.end ??
                    new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10)
                  }
                  defaultGuests={detail.outing.numberOfPlayers}
                  isOrganizer={canManageLodging}
                  savedOptions={detail.lodging}
                  favoriteOptionIds={favoriteLodgingIds}
                />
              </div>
            )}
          </div>
        )}
      </section>
    </PageShell>
  );
}
