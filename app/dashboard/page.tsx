import { Calendar, MapPin, Plus, Users } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/empty-state";
import { deleteOutingAction } from "@/lib/actions/outings";
import { requireProfile } from "@/lib/auth";
import { getDashboardData } from "@/modules/outings/service";

function formatTripDates(windows: { start: string; end: string }[]) {
  if (!windows.length) return "Dates TBD";
  const w = windows[0];
  // Parse as local noon to avoid timezone-off-by-one
  const start = new Date(w.start + "T12:00:00");
  const end = new Date(w.end + "T12:00:00");
  const startStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endStr = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  if (windows.length === 1) return `${startStr} – ${endStr}`;
  return `${windows.length} options · earliest ${start.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
}

function statusStyle(status: string) {
  if (status === "booking") return "bg-emerald-100 text-emerald-800";
  if (status === "completed") return "bg-charcoal/8 text-charcoal/50";
  return "bg-sand text-charcoal/70";
}

function statusLabel(status: string) {
  if (status === "booking") return "Ready to book";
  if (status === "completed") return "Completed";
  if (status === "planning") return "Planning";
  return status.replaceAll("_", " ");
}

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const profile = await requireProfile();
  const notices = await searchParams;
  const outings = await getDashboardData(profile.id);

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal sm:text-4xl">
              Hey {profile.fullName.split(" ")[0]} 👋
            </h1>
            <p className="mt-1 text-sm text-charcoal/55">
              {outings.length === 0
                ? "You don't have any trips yet."
                : outings.length === 1
                  ? "You have 1 trip in progress."
                  : `You have ${outings.length} trips in progress.`}
            </p>
          </div>
          <Button href="/outings/new" className="w-full sm:w-auto shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Plan a new trip
          </Button>
        </div>

        {/* Notices */}
        {notices.success ? (
          <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notices.success}</p>
        ) : null}
        {notices.error ? (
          <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{notices.error}</p>
        ) : null}

        {/* Empty state */}
        {outings.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Plan your first golf trip"
              body="Set the frame in under a minute — destination, dates, budget, vibe. Then invite the group and let everyone weigh in."
              cta={{ href: "/outings/new", label: "Plan a trip" }}
            />
          </div>
        ) : null}

        {/* Trip cards */}
        <div className="mt-6 grid gap-4">
          {outings.map(({ outing, invites, insights, recommendation }) => {
            const isOrganizer = outing.organizerId === profile.id;
            const progressTarget = insights.respondedCount + insights.pendingCount;
            const responsePercent = progressTarget
              ? Math.round((insights.respondedCount / progressTarget) * 100)
              : 0;
            const needsInvites = progressTarget === 0 && isOrganizer;
            const topDate = recommendation.bestDates[0];

            return (
              <div
                key={outing.id}
                className="rounded-[28px] border border-charcoal/8 bg-white p-6 transition hover:shadow-[0_8px_40px_rgba(33,36,35,0.08)]"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                  {/* Left — trip identity */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">
                        {outing.name}
                      </h2>
                      <Badge className={statusStyle(outing.status)}>
                        {statusLabel(outing.status)}
                      </Badge>
                      {!isOrganizer && (
                        <Badge className="bg-charcoal/6 text-charcoal/55">Invited</Badge>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-charcoal/58">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {outing.destinationLabel}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        {formatTripDates(outing.preferredDateWindows)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 shrink-0" />
                        {outing.numberOfPlayers} golfers
                      </span>
                    </div>

                    {/* Response progress */}
                    <div className="mt-4">
                      {needsInvites ? (
                        <p className="text-sm text-charcoal/50">
                          No responses yet — invite the group to get started.
                        </p>
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-xs text-charcoal/50 mb-1.5">
                            <span>
                              {insights.respondedCount === progressTarget && progressTarget > 0
                                ? `All ${progressTarget} members responded ✓`
                                : `${insights.respondedCount} of ${progressTarget} responded`}
                            </span>
                            <span>{responsePercent}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-charcoal/8">
                            <div
                              className={[
                                "h-1.5 rounded-full transition-all",
                                responsePercent === 100 ? "bg-emerald-500" : "bg-forest-900"
                              ].join(" ")}
                              style={{ width: `${responsePercent}%` }}
                            />
                          </div>
                          {topDate && (
                            <p className="mt-2 text-xs text-charcoal/45">
                              Best date overlap: {topDate.date} · {topDate.availableCount} available
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right — actions */}
                  <div className="flex shrink-0 flex-col gap-2 sm:items-stretch sm:min-w-[140px]">
                    <Button href={`/outings/${outing.id}`} className="w-full justify-center">
                      Open trip
                    </Button>
                    {needsInvites && (
                      <Button
                        href={`/outings/${outing.id}#people`}
                        variant="secondary"
                        className="w-full justify-center text-sm"
                      >
                        Invite group
                      </Button>
                    )}
                    {isOrganizer && !needsInvites && insights.respondedCount > 0 && (
                      <Button
                        href={`/outings/${outing.id}/compare`}
                        variant="secondary"
                        className="w-full justify-center text-sm"
                      >
                        Compare options
                      </Button>
                    )}
                    {isOrganizer && (
                      <form action={deleteOutingAction}>
                        <input type="hidden" name="outingId" value={outing.id} />
                        <button
                          type="submit"
                          className="w-full rounded-full px-4 py-2 text-xs text-charcoal/35 transition hover:text-red-500"
                        >
                          Delete
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>
    </PageShell>
  );
}
