import Link from "next/link";
import { ChatPanel } from "@/components/chat/chat-panel";
import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldLabel, Input, Select, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  inviteMemberAction,
  sendChatMessageAction,
  submitPreferencesAction
} from "@/lib/actions/outings";
import { requireProfile } from "@/lib/auth";
import { currency, formatLongDateLabel, percent } from "@/lib/utils";
import { getOutingDetail } from "@/modules/outings/service";
import type { PreferenceSubmission, Profile } from "@/types/domain";

function labelize(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function confidenceLabel(score: number) {
  if (score >= 80) {
    return "High confidence";
  }

  if (score >= 60) {
    return "Good signal";
  }

  return "Still early";
}

function planningWindowLabel(start: string, end: string) {
  return `${formatLongDateLabel(start)} to ${formatLongDateLabel(end)}`;
}


function MemberCard({
  person,
  responded,
  updatedAt,
  role
}: {
  person: Profile | undefined;
  responded: boolean;
  updatedAt?: string;
  role: string;
}) {
  return (
    <div className="rounded-[24px] border border-charcoal/8 bg-cream p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-charcoal">{person?.fullName ?? "Member"}</p>
          <p className="mt-1 text-sm text-charcoal/58">{person?.email}</p>
        </div>
        <div className="text-right">
          <Badge className={responded ? "bg-emerald-100 text-emerald-800" : "bg-sand text-charcoal/78"}>
            {responded ? "Preferences in" : "Waiting"}
          </Badge>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-charcoal/35">{role}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-charcoal/48">
        {responded && updatedAt ? `Last updated ${formatLongDateLabel(updatedAt)}` : "Needs a quick nudge."}
      </p>
    </div>
  );
}

function preferenceDefaults(preference: PreferenceSubmission | null) {
  return {
    budgetMin: preference?.budgetMin?.toString() ?? "900",
    budgetMax: preference?.budgetMax?.toString() ?? "1400",
    availableDates: preference?.availableDates.join(", ") ?? "",
    destinationVotes: preference?.destinationVotes.join(", ") ?? "",
    lodgingPreferences: preference?.lodgingPreferences.join(", ") ?? "",
    courseQualityPreference: preference?.courseQualityPreference?.toString() ?? "7",
    walkingPreference: preference?.walkingPreference ?? "either",
    comments: preference?.comments ?? ""
  };
}

export default async function OutingDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ outingId: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const profile = await requireProfile();
  const { outingId } = await params;
  const notices = await searchParams;
  const detail = await getOutingDetail(outingId, profile.id);

  if (!detail) {
    return (
      <PageShell>
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <Card className="text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Access</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
              This outing isn’t available to you
            </h1>
            <p className="mt-5 text-base leading-7 text-charcoal/68">
              The link may be wrong, the outing may have moved, or your account does not have access.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/dashboard">
                <Button>Return to dashboard</Button>
              </Link>
            </div>
          </Card>
        </section>
      </PageShell>
    );
  }

  const profiles = detail.profiles;
  const bestDate = detail.recommendation.bestDates[0];
  const defaults = preferenceDefaults(detail.currentPreference);
  const dateSuggestion = detail.outing.preferredDateWindows
    .flatMap((window) => [window.start, window.end])
    .join(", ");

  // Trip cost estimates
  const tripWindow = detail.outing.preferredDateWindows[0];
  const nights = tripWindow
    ? Math.max(1, Math.round((new Date(tripWindow.end).getTime() - new Date(tripWindow.start).getTime()) / (1000 * 60 * 60 * 24)))
    : 3;
  const roundsPerPlayer = detail.outing.golfIntensity === "light" ? 2 : detail.outing.golfIntensity === "golf_first" ? 4 : 3;
  const players = detail.outing.numberOfPlayers;

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Outing</p>
              <Badge>{detail.outing.status.replaceAll("_", " ")}</Badge>
              <Badge className="bg-forest-900/10 text-forest-900">
                {confidenceLabel(detail.insights.confidence)}
              </Badge>
            </div>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em] text-charcoal sm:text-5xl">
              {detail.outing.name}
            </h1>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              {detail.outing.notes ??
                "Gather dates, budgets, courses, and lodging preferences in one calm planning flow."}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href={`/outings/${detail.outing.id}/compare`} className="block">
              <Button variant="secondary" className="w-full">
                Compare options
              </Button>
            </Link>
            <Link href="#preferences" className="block">
              <Button className="w-full">Update your preferences</Button>
            </Link>
          </div>
        </div>

        {notices.success ? (
          <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {notices.success}
          </p>
        ) : null}
        {notices.error ? (
          <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {notices.error}
          </p>
        ) : null}

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <Card className="overflow-hidden p-0">
              <div className="border-b border-charcoal/8 bg-[linear-gradient(135deg,rgba(20,58,44,0.96),rgba(53,79,67,0.9))] px-6 py-6 text-cream">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs uppercase tracking-[0.26em] text-cream/58">Planning pulse</p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                      {detail.insights.respondedCount} of {detail.members.length} players have shared preferences
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-cream/76">
                      {detail.insights.nextAction}
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-white/12 bg-white/8 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-cream/52">Decision confidence</p>
                    <p className="mt-2 text-3xl font-semibold">{detail.insights.confidence}</p>
                    <p className="mt-1 text-sm text-cream/66">{confidenceLabel(detail.insights.confidence)}</p>
                  </div>
                </div>
                <div className="mt-5 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-sand-strong"
                    style={{ width: percent(detail.insights.responseRate) }}
                  />
                </div>
              </div>

              <div className="grid gap-3 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[24px] bg-cream p-4">
                  <p className="text-sm text-charcoal/48">Budget target</p>
                  <p className="mt-2 text-2xl font-semibold text-charcoal">
                    {currency(detail.outing.budgetTarget)}
                  </p>
                </div>
                <div className="rounded-[24px] bg-cream p-4">
                  <p className="text-sm text-charcoal/48">Best overlap</p>
                  <p className="mt-2 text-lg font-semibold text-charcoal">
                    {bestDate ? formatLongDateLabel(bestDate.date) : "Waiting on dates"}
                  </p>
                  <p className="mt-1 text-xs text-charcoal/48">
                    {bestDate ? `${bestDate.availableCount} players free` : "Add more availability to rank dates"}
                  </p>
                </div>
                <div className="rounded-[24px] bg-cream p-4">
                  <p className="text-sm text-charcoal/48">Votes and favorites</p>
                  <p className="mt-2 text-2xl font-semibold text-charcoal">
                    {detail.insights.voteCount + detail.insights.favoriteCount}
                  </p>
                  <p className="mt-1 text-xs text-charcoal/48">
                    {detail.insights.voteCount} votes, {detail.insights.favoriteCount} saves
                  </p>
                </div>
                <div className="rounded-[24px] bg-cream p-4">
                  <p className="text-sm text-charcoal/48">Trip frame</p>
                  <p className="mt-2 text-lg font-semibold text-charcoal">
                    {labelize(detail.outing.tripStyle)}
                  </p>
                  <p className="mt-1 text-xs text-charcoal/48">
                    {labelize(detail.outing.golfIntensity)} golf · {labelize(detail.outing.lodgingPreference)} stay
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-charcoal/38">Golf options</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-charcoal">
                    Courses on the shortlist
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-6 text-charcoal/60">
                  {roundsPerPlayer} rounds per player · {players} golfers
                </p>
              </div>

              {detail.golfCourses.length === 0 ? (
                <div className="mt-5">
                  <EmptyState
                    title="Golf options will appear here"
                    body="Courses are seeded when an outing is created. If you just created this outing, they should appear shortly."
                  />
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {detail.golfCourses.map((course) => {
                    const isTop = course.id === detail.insights.topCourse?.id;
                    const golfPerPerson = course.averageGreensFee * roundsPerPlayer;
                    return (
                      <div key={course.id} className="rounded-[24px] border border-charcoal/8 bg-cream p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-charcoal">{course.name}</p>
                              {isTop && <Badge className="bg-forest-900/10 text-forest-900">Top fit</Badge>}
                            </div>
                            <p className="mt-1 text-sm text-charcoal/58">{course.locationLabel}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-charcoal">{currency(golfPerPerson)}<span className="ml-1 text-sm font-normal text-charcoal/55">/person</span></p>
                            <p className="mt-1 text-xs text-charcoal/48">{currency(course.averageGreensFee)} × {roundsPerPlayer} rounds</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-charcoal/64">
                          <span>Quality {course.qualityScore}/10</span>
                          <span>{course.walkingFriendly ? "Walking-friendly" : "Riding-first"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-charcoal/38">Lodging options</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-charcoal">
                    Stays on the shortlist
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-6 text-charcoal/60">
                  {nights} nights · {players} golfers
                </p>
              </div>

              {detail.lodging.length === 0 ? (
                <div className="mt-5">
                  <EmptyState
                    title="Lodging options will appear here"
                    body="Stays are seeded when an outing is created. If you just created this outing, they should appear shortly."
                  />
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {detail.lodging.map((stay) => {
                    const isTop = stay.id === detail.insights.topLodging?.id;
                    const lodgingTotal = stay.priceTotal ?? stay.nightlyRate * nights;
                    const perPerson = Math.round(lodgingTotal / players);
                    return (
                      <div key={stay.id} className="rounded-[24px] border border-charcoal/8 bg-cream p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-charcoal">{stay.name}</p>
                              {isTop && <Badge className="bg-forest-900/10 text-forest-900">Top fit</Badge>}
                            </div>
                            <p className="mt-1 text-sm capitalize text-charcoal/58">{labelize(stay.lodgingType)} · Sleeps {stay.sleeps}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-charcoal">{currency(perPerson)}<span className="ml-1 text-sm font-normal text-charcoal/55">/person</span></p>
                            <p className="mt-1 text-xs text-charcoal/48">{currency(stay.nightlyRate)}/night × {nights} nights ÷ {players}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-charcoal/64">
                          {stay.refundable !== null && stay.refundable !== undefined && (
                            <span>{stay.refundable ? "Refundable" : "Non-refundable"}</span>
                          )}
                          {stay.city && <span>{stay.city}{stay.state ? `, ${stay.state}` : ""}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-charcoal/38">Trip frame</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-charcoal">
                    Outing summary
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-charcoal/60">
                  The organizer has already set the planning rails. The group only needs to tighten the date and final shortlist.
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-cream p-4">
                  <p className="text-sm text-charcoal/48">Destination prompt</p>
                  <p className="mt-2 text-base font-medium text-charcoal">{detail.outing.destinationLabel}</p>
                </div>
                <div className="rounded-[24px] bg-cream p-4">
                  <p className="text-sm text-charcoal/48">Player count</p>
                  <p className="mt-2 text-base font-medium text-charcoal">
                    {detail.outing.numberOfPlayers} golfers
                  </p>
                </div>
                <div className="rounded-[24px] bg-cream p-4 sm:col-span-2">
                  <p className="text-sm text-charcoal/48">Preferred windows</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {detail.outing.preferredDateWindows.map((window) => (
                      <Badge key={`${window.start}-${window.end}`}>
                        {planningWindowLabel(window.start, window.end)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-charcoal/38">People</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-charcoal">
                    Members and invites
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-charcoal/60">
                  Keep response collection visible so the organizer knows whether to push for more availability or start narrowing options.
                </p>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-3">
                  {detail.memberSnapshots.map((snapshot) => {
                    const person = profiles.find((item) => item.id === snapshot.member.profileId);

                    return (
                      <MemberCard
                        key={snapshot.member.id}
                        person={person}
                        responded={snapshot.responded}
                        updatedAt={snapshot.preference?.updatedAt}
                        role={labelize(snapshot.member.role)}
                      />
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <form action={inviteMemberAction} className="rounded-[28px] bg-forest-950 p-5 text-cream">
                    <input type="hidden" name="outingId" value={detail.outing.id} />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold tracking-[-0.03em]">Invite another golfer</h3>
                        <p className="mt-2 text-sm text-cream/66">
                          Add a friend by email and keep response tracking tidy.
                        </p>
                      </div>
                      <Badge className="bg-white/10 text-cream">Organizer action</Badge>
                    </div>
                    <div className="mt-4">
                      <FieldLabel htmlFor="inviteEmail">Invite by email</FieldLabel>
                      <Input
                        id="inviteEmail"
                        name="email"
                        type="email"
                        placeholder="friend@example.com"
                        className="bg-white/10 text-cream placeholder:text-cream/35"
                      />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-cream/60">
                      Email invites are live now. Share links can drop into this same workflow later without changing the organizer flow.
                    </p>
                    <SubmitButton label="Send invite" pendingLabel="Sending..." className="mt-4" />
                  </form>

                  {detail.invites.length ? (
                    <div className="space-y-3">
                      {detail.invites.map((invite) => (
                        <div key={invite.id} className="rounded-[24px] border border-charcoal/8 bg-cream p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="font-medium text-charcoal">{invite.email}</p>
                              <p className="mt-1 text-xs text-charcoal/48">
                                Sent {formatLongDateLabel(invite.createdAt)}
                              </p>
                            </div>
                            <Badge>{labelize(invite.status)}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="No pending invites"
                      body="Once you invite more people, their status will appear here so the organizer always knows who still needs to join."
                    />
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card id="preferences">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-charcoal/38">Your input</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-charcoal">
                    Submit your preferences
                  </h2>
                </div>
                {detail.currentPreference ? (
                  <Badge className="bg-emerald-100 text-emerald-800">Saved already</Badge>
                ) : (
                  <Badge>Quick form</Badge>
                )}
              </div>

              <p className="mt-3 text-sm leading-6 text-charcoal/62">
                Give the organizer the basics: your budget, the dates that work, and any strong destination or lodging lean. You can always update it later.
              </p>

              <form action={submitPreferencesAction} className="mt-5 space-y-5">
                <input type="hidden" name="outingId" value={detail.outing.id} />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="budgetMin">Budget min</FieldLabel>
                    <Input id="budgetMin" name="budgetMin" type="number" defaultValue={defaults.budgetMin} />
                  </div>
                  <div>
                    <FieldLabel htmlFor="budgetMax">Budget max</FieldLabel>
                    <Input id="budgetMax" name="budgetMax" type="number" defaultValue={defaults.budgetMax} />
                  </div>
                </div>

                <div className="rounded-[24px] bg-cream p-4">
                  <FieldLabel htmlFor="availableDates">Available dates</FieldLabel>
                  <Input
                    id="availableDates"
                    name="availableDates"
                    defaultValue={defaults.availableDates}
                    placeholder="2026-05-10, 2026-05-11, 2026-05-12"
                  />
                  <p className="mt-2 text-xs text-charcoal/50">
                    Start with the dates that work best for you. Suggested from the organizer: {dateSuggestion}
                  </p>
                </div>

                <div className="rounded-[24px] bg-cream p-4">
                  <FieldLabel htmlFor="destinationVotes">Destination votes</FieldLabel>
                  <Input
                    id="destinationVotes"
                    name="destinationVotes"
                    defaultValue={defaults.destinationVotes}
                    placeholder="Northern Michigan Loop, Scottsdale Sun Split"
                  />
                  <p className="mt-2 text-xs text-charcoal/50">
                    Optional, but helpful if you already have a favorite destination from the shortlist.
                  </p>
                </div>

                <div className="rounded-[24px] bg-cream p-4">
                  <FieldLabel htmlFor="lodgingPreferences">Lodging preferences</FieldLabel>
                  <Input
                    id="lodgingPreferences"
                    name="lodgingPreferences"
                    defaultValue={defaults.lodgingPreferences}
                    placeholder="house, resort"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="courseQualityPreference">Course quality preference (1-10)</FieldLabel>
                    <Input
                      id="courseQualityPreference"
                      name="courseQualityPreference"
                      type="number"
                      min="1"
                      max="10"
                      defaultValue={defaults.courseQualityPreference}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="walkingPreference">Walking vs riding</FieldLabel>
                    <Select id="walkingPreference" name="walkingPreference" defaultValue={defaults.walkingPreference}>
                      <option value="either">Either</option>
                      <option value="walking">Prefer walking</option>
                      <option value="riding">Prefer riding</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="comments">Comments</FieldLabel>
                  <Textarea
                    id="comments"
                    name="comments"
                    defaultValue={defaults.comments}
                    placeholder="Anything else the organizer should know?"
                  />
                </div>

                <SubmitButton label="Save preferences" pendingLabel="Saving..." />
              </form>
            </Card>

            <ChatPanel
              messages={detail.messages}
              profiles={profiles}
              outingId={detail.outing.id}
              currentProfileId={profile.id}
              sendAction={sendChatMessageAction}
            />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
