import { notFound } from "next/navigation";

import { BackButton } from "@/components/common/back-button";
import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { ComparePanel } from "@/components/outings/compare-panel";
import { LodgingSearchPanel } from "@/components/outings/lodging-search-panel";
import { RentalListingPanel } from "@/components/outings/rental-listing-panel";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";
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

  // Deduplicate lodging by name for display
  const seenLodgingNames = new Set<string>();
  const dedupedLodging = detail.lodging.filter((stay) => {
    if (seenLodgingNames.has(stay.name)) return false;
    seenLodgingNames.add(stay.name);
    return true;
  });

  // Attach fit scores for the interactive panel
  const coursesWithScores = detail.golfCourses.map((course) => ({
    ...course,
    fitScore: detail.recommendation.golfScores.find((s) => s.id === course.id)?.score ?? 0
  }));
  const lodgingWithScores = dedupedLodging.map((stay) => ({
    ...stay,
    fitScore: detail.recommendation.lodgingScores.find((s) => s.id === stay.id)?.score ?? 0
  }));

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton fallback={`/outings/${outingId}`} label="Back to outing" />
        </div>
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Compare options</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Compare destinations, golf, and lodging side by side
          </h1>
          <p className="mt-4 text-base leading-7 text-charcoal/68">
            Select a course and a lodging option below — the cost breakdown per person updates instantly.
          </p>
        </div>

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

            {/* ── Interactive course + lodging selection ── */}
            <ComparePanel
              courses={coursesWithScores}
              lodging={lodgingWithScores}
              nights={nights}
              players={players}
              roundsPerPlayer={roundsPerPlayer}
            />

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
