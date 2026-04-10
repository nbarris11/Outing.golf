import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  CircleDollarSign,
  MapPinned,
  Plus,
  Sparkles
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth";
import { currency, formatLongDateLabel } from "@/lib/utils";
import { getDashboardData } from "@/modules/outings/service";

export default async function DashboardPage() {
  const profile = await requireProfile();
  const outings = await getDashboardData(profile.id);
  const averageConfidence =
    outings.length > 0
      ? Math.round(outings.reduce((total, item) => total + item.insights.confidence, 0) / outings.length)
      : 0;
  const leadOuting =
    outings.length > 0
      ? [...outings].sort((left, right) => right.insights.confidence - left.insights.confidence)[0]
      : null;

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Dashboard</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">
              Welcome back, {profile.fullName.split(" ")[0]}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-charcoal/68">
              See what is ready, what still needs input, and what decision the group should make next.
            </p>
          </div>
          <Link href="/outings/new">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create outing
            </Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-sm text-charcoal/50">Active outings</p>
            <p className="mt-4 text-4xl font-semibold tracking-[-0.04em]">{outings.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-charcoal/50">Pending invites</p>
            <p className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
              {outings.reduce((total, outing) => total + outing.invites.length, 0)}
            </p>
          </Card>
          <Card>
            <p className="text-sm text-charcoal/50">Average decision confidence</p>
            <p className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
              {outings.length ? `${averageConfidence}%` : "No outings yet"}
            </p>
          </Card>
        </div>

        {outings.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="Your dashboard is ready for the first outing"
              body="Create one outing, invite the group, and the dashboard will start surfacing overlap, fit, and next-step signals."
              cta={{ href: "/outings/new", label: "Create your first outing" }}
            />
          </div>
        ) : null}

        {leadOuting ? (
          <section className="mt-8">
            <Card className="overflow-hidden p-0">
              <div className="border-b border-charcoal/8 bg-[linear-gradient(135deg,rgba(20,58,44,0.98),rgba(45,71,60,0.92))] px-6 py-6 text-cream sm:px-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-sm uppercase tracking-[0.25em] text-cream/55">
                      Best Plan Based on Your Group
                    </p>
                    <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em]">
                      {leadOuting.outing.name}
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-cream/78">
                      {leadOuting.insights.recommendationSummary}
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/12 bg-white/8 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-cream/55">Decision confidence</p>
                    <p className="mt-2 text-4xl font-semibold">{leadOuting.insights.confidence}%</p>
                    <p className="mt-2 text-sm text-cream/68">
                      The app has enough signal to point the organizer toward a clear next move.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4 xl:px-8">
                <div className="rounded-[24px] bg-cream p-5">
                  <p className="text-sm text-charcoal/48">Best date overlap</p>
                  <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-charcoal">
                    {leadOuting.recommendation.bestDates[0]
                      ? formatLongDateLabel(leadOuting.recommendation.bestDates[0].date)
                      : "Waiting on replies"}
                  </p>
                  <p className="mt-2 text-sm text-charcoal/60">
                    {leadOuting.recommendation.bestDates[0]
                      ? `${leadOuting.recommendation.bestDates[0].availableCount} people line up here`
                      : "More availability will sharpen the recommendation"}
                  </p>
                </div>
                <div className="rounded-[24px] bg-cream p-5">
                  <p className="text-sm text-charcoal/48">Average group budget</p>
                  <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-charcoal">
                    {currency(leadOuting.insights.averageBudget)}
                  </p>
                  <p className="mt-2 text-sm text-charcoal/60">
                    Based on the preferences the group has shared so far.
                  </p>
                </div>
                <div className="rounded-[24px] bg-cream p-5 sm:col-span-2">
                  <p className="text-sm text-charcoal/48">Top 3 destination options</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {leadOuting.insights.topDestinations.length ? (
                      leadOuting.insights.topDestinations.map((destination, index) => (
                        <Badge key={destination.id} className={index === 0 ? "bg-forest-900 text-cream" : ""}>
                          {index + 1}. {destination.name}
                        </Badge>
                      ))
                    ) : (
                      <Badge>Waiting on group preferences</Badge>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-charcoal/60">
                    These are the front-runners once budget fit, date overlap, and votes are blended together.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-charcoal/8 px-6 py-5 sm:flex-row sm:items-center sm:justify-between xl:px-8">
                <p className="max-w-2xl text-sm leading-6 text-charcoal/66">
                  Quick recommendation: {leadOuting.insights.nextAction}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href={`/outings/${leadOuting.outing.id}`}>
                    <Button className="w-full sm:w-auto">Open outing</Button>
                  </Link>
                  <Link href={`/outings/${leadOuting.outing.id}/compare`}>
                    <Button variant="secondary" className="w-full sm:w-auto">
                      Compare options
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        ) : null}

        <div className="mt-8 space-y-5">
          {outings.map(({ outing, members, invites, preferences, recommendation, insights }) => {
            const responsePercent = Math.round((preferences.length / members.length) * 100) || 0;

            return (
              <Card key={outing.id} className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold tracking-[-0.04em]">{outing.name}</h2>
                    <Badge>{outing.status.replaceAll("_", " ")}</Badge>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-charcoal/68">{outing.notes}</p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-[24px] bg-cream p-4">
                      <CircleDollarSign className="h-4 w-4 text-forest-900" />
                      <p className="mt-3 text-sm text-charcoal/50">Budget target</p>
                      <p className="mt-1 text-xl font-semibold">{currency(outing.budgetTarget)}</p>
                    </div>
                    <div className="rounded-[24px] bg-cream p-4">
                      <CalendarRange className="h-4 w-4 text-forest-900" />
                      <p className="mt-3 text-sm text-charcoal/50">Top overlap</p>
                      <p className="mt-1 text-xl font-semibold">
                        {recommendation.bestDates[0]?.date ?? "Waiting"}
                      </p>
                    </div>
                    <div className="rounded-[24px] bg-cream p-4">
                      <MapPinned className="h-4 w-4 text-forest-900" />
                      <p className="mt-3 text-sm text-charcoal/50">Leading destination</p>
                      <p className="mt-1 text-base font-semibold">{insights.topDestination?.name ?? "Waiting"}</p>
                    </div>
                    <div className="rounded-[24px] bg-cream p-4">
                      <Sparkles className="h-4 w-4 text-forest-900" />
                      <p className="mt-3 text-sm text-charcoal/50">Next move</p>
                      <p className="mt-1 text-sm font-semibold leading-6">{insights.nextAction}</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[28px] border border-charcoal/8 bg-white p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-charcoal/50">Response progress</p>
                        <p className="mt-1 text-sm text-charcoal/68">
                          {preferences.length} of {members.length} members have submitted preferences
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-forest-900">{responsePercent}%</p>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-charcoal/8">
                      <div className="h-2 rounded-full bg-forest-900" style={{ width: `${responsePercent}%` }} />
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] bg-forest-950 p-6 text-cream">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-cream/60">Decision panel</p>
                      <p className="mt-2 text-4xl font-semibold">{insights.confidence}%</p>
                      <p className="mt-1 text-sm text-cream/62">
                        confidence that the group can narrow this down now
                      </p>
                    </div>
                    <Badge className="bg-white/10 text-cream">{invites.length} invites open</Badge>
                  </div>

                  <div className="mt-6 space-y-4 rounded-[24px] bg-white/8 p-4">
                    <div>
                      <p className="text-sm text-cream/52">Top course</p>
                      <p className="mt-1 font-medium">{insights.topCourse?.name ?? "No course yet"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-cream/52">Top lodging</p>
                      <p className="mt-1 font-medium">{insights.topLodging?.name ?? "No stay yet"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-cream/52">Strongest date</p>
                      <p className="mt-1 font-medium">{recommendation.bestDates[0]?.date ?? "Waiting on replies"}</p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link href={`/outings/${outing.id}`} className="w-full">
                      <Button className="w-full bg-cream text-charcoal hover:bg-white">Open outing</Button>
                    </Link>
                    <Link href={`/outings/${outing.id}/compare`} className="w-full">
                      <Button variant="ghost" className="w-full border border-white/15 text-cream">
                        Compare options
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-cream/62">
                    <ArrowRight className="h-4 w-4" />
                    {insights.nextAction}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
