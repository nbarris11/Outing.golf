import { notFound } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";
import { currency } from "@/lib/utils";
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

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Compare options</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
            Compare destinations, golf, and lodging side by side
          </h1>
          <p className="mt-4 text-base leading-7 text-charcoal/68">
            This view is tuned for quick tradeoff scanning: cost, travel logic, group fit, quality,
            and confidence.
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
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  label: "Recommended destination",
                  value:
                    detail.destinations.find((item) => item.id === detail.recommendation.destinationScores[0]?.id)?.name ??
                    "Waiting"
                },
                {
                  label: "Recommended course",
                  value:
                    detail.golfCourses.find((item) => item.id === detail.recommendation.golfScores[0]?.id)?.name ?? "Waiting"
                },
                {
                  label: "Recommended stay",
                  value:
                    detail.lodging.find((item) => item.id === detail.recommendation.lodgingScores[0]?.id)?.name ?? "Waiting"
                }
              ].map((item) => (
                <Card key={item.label} className="bg-forest-950 text-cream">
                  <p className="text-sm text-cream/56">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{item.value}</p>
                </Card>
              ))}
            </div>

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
                  const score = detail.recommendation.destinationScores.find((item) => item.id === destination.id);
                  return (
                    <div key={destination.id} className="rounded-[28px] border border-charcoal/8 bg-cream p-5">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-semibold tracking-[-0.03em]">{destination.name}</h3>
                            <Badge>{destination.region}</Badge>
                          </div>
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-charcoal/68">{destination.summary}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {destination.tags.map((tag) => (
                              <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs text-charcoal/60">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[360px]">
                          <div className="rounded-[20px] bg-white p-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-charcoal/45">Golf</p>
                            <p className="mt-2 text-sm font-semibold">{currency(destination.averageRoundCost)}/round</p>
                          </div>
                          <div className="rounded-[20px] bg-white p-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-charcoal/45">Stay</p>
                            <p className="mt-2 text-sm font-semibold">{currency(destination.averageNightlyRate)}/night</p>
                          </div>
                          <div className="rounded-[20px] bg-white p-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-charcoal/45">Travel</p>
                            <p className="mt-2 text-sm font-semibold">
                              {destination.driveHours ? `${destination.driveHours}h drive` : `${destination.flightHours}h flight`}
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

            <div className="grid gap-6 xl:grid-cols-2">
              <Card>
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-xl font-semibold tracking-[-0.03em]">Golf course options</h2>
                    <p className="mt-1 text-sm text-charcoal/60">Which rounds feel worth the trip?</p>
                  </div>
                  <Badge>{detail.golfCourses.length} courses</Badge>
                </div>
                <div className="mt-5 space-y-3">
                  {detail.golfCourses.map((course) => {
                    const score = detail.recommendation.golfScores.find((item) => item.id === course.id);
                    return (
                      <div key={course.id} className="rounded-[24px] bg-cream p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{course.name}</p>
                            <p className="text-sm text-charcoal/60">{course.locationLabel}</p>
                          </div>
                          <p className="text-sm font-medium text-forest-900">{score?.score ?? 0} fit</p>
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <p className="text-sm text-charcoal/68">{currency(course.averageGreensFee)} / round</p>
                          <p className="text-sm text-charcoal/68">{course.qualityScore} quality</p>
                          <p className="text-sm text-charcoal/68">
                            {course.walkingFriendly ? "Walking-friendly" : "Riding-first"}
                          </p>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-charcoal/64">{course.summary}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card>
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-xl font-semibold tracking-[-0.03em]">Lodging options</h2>
                    <p className="mt-1 text-sm text-charcoal/60">Which stay keeps the group comfortable and aligned?</p>
                  </div>
                  <Badge>{detail.lodging.length} stays</Badge>
                </div>
                <div className="mt-5 space-y-3">
                  {detail.lodging.map((stay) => {
                    const score = detail.recommendation.lodgingScores.find((item) => item.id === stay.id);
                    return (
                      <div key={stay.id} className="rounded-[24px] bg-cream p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{stay.name}</p>
                            <p className="text-sm capitalize text-charcoal/60">{stay.lodgingType}</p>
                          </div>
                          <p className="text-sm font-medium text-forest-900">{score?.score ?? 0} fit</p>
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          <p className="text-sm text-charcoal/68">{currency(stay.nightlyRate)} / night</p>
                          <p className="text-sm text-charcoal/68">Sleeps {stay.sleeps}</p>
                          <p className="text-sm text-charcoal/68">{stay.tags[0] ?? "Flexible stay"}</p>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-charcoal/64">{stay.summary}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}
