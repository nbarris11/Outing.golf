import { redirect } from "next/navigation";

import { ChatPanel } from "@/components/chat/chat-panel";
import { CopyLinkButton } from "@/components/outings/copy-link-button";
import { MarkAsBookedButton } from "@/components/outings/mark-as-booked-button";
import { CourseScheduleSelector } from "@/components/outings/course-schedule-selector";
import { DateAvailabilityPicker } from "@/components/outings/date-availability-picker";
import { FavoriteButton } from "@/components/outings/favorite-button";
import { LodgingRoomRate } from "@/components/outings/lodging-room-rate";
import { OrganizerPickButton } from "@/components/outings/organizer-pick-button";
import { RoundsSelector } from "@/components/outings/rounds-selector";
import { VoteButton } from "@/components/outings/vote-button";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldLabel, Input, Select, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  closeVotingAction,
  inviteMemberAction,
  markAsBookedAction,
  nudgeMemberAction,
  openVotingAction,
  regenerateOutingInventoryAction,
  resendInviteAction,
  sendChatMessageInlineAction,
  submitPreferencesAction
} from "@/lib/actions/outings";
import { requireProfile } from "@/lib/auth";
import { getOutingShareLink } from "@/lib/outing-share-links";
import { currency, formatLongDateLabel } from "@/lib/utils";
import { getOutingDetail } from "@/modules/outings/service";
import type { PreferenceSubmission, Profile } from "@/types/domain";

function labelize(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function planningWindowLabel(start: string, end: string) {
  return `${formatLongDateLabel(start)} – ${formatLongDateLabel(end)}`;
}

function budgetRangeDefaults(target: number) {
  return {
    budgetMin: Math.max(300, target - 200).toString(),
    budgetMax: Math.min(4000, target + 200).toString()
  };
}

function preferenceDefaults(preference: PreferenceSubmission | null, outingBudgetTarget: number) {
  const seededBudgetRange = budgetRangeDefaults(outingBudgetTarget);
  return {
    budgetMin: preference?.budgetMin?.toString() ?? seededBudgetRange.budgetMin,
    budgetMax: preference?.budgetMax?.toString() ?? seededBudgetRange.budgetMax,
    availableDates: preference?.availableDates.join(", ") ?? "",
    destinationVotes: preference?.destinationVotes ?? [],
    lodgingPreferences: preference?.lodgingPreferences ?? [],
    courseQualityPreference: preference?.courseQualityPreference?.toString() ?? "7",
    walkingPreference: preference?.walkingPreference ?? "either",
    comments: preference?.comments ?? "",
    preferredRounds: preference?.preferredRounds ?? null,
    homeCity: preference?.homeCity ?? null
  };
}

function MemberRow({
  person,
  responded,
  role,
  homeCity
}: {
  person: Profile | undefined;
  responded: boolean;
  role: string;
  homeCity?: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-charcoal/6 last:border-0">
      <div className="min-w-0">
        <p className="font-medium text-charcoal truncate">{person?.fullName ?? "Member"}</p>
        <p className="text-sm text-charcoal/50 truncate">{person?.email}</p>
        {homeCity && (
          <p className="text-xs text-charcoal/40">✈️ From {homeCity}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge className={responded ? "bg-emerald-100 text-emerald-800" : "bg-sand text-charcoal/70"}>
          {responded ? "Responded ✓" : "Waiting"}
        </Badge>
        <span className="hidden sm:inline text-xs text-charcoal/35">{role}</span>
      </div>
    </div>
  );
}

export default async function OutingDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ outingId: string }>;
  searchParams: Promise<{ success?: string; error?: string; created?: string; inviteEmail?: string; inviteLink?: string; shareLink?: string; newMember?: string; confirmed?: string }>;
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
            <h1 className="font-serif text-4xl font-semibold tracking-[-0.05em]">
              This trip isn&apos;t available to you
            </h1>
            <p className="mt-4 text-base leading-7 text-charcoal/68">
              The link may be wrong, or your account doesn&apos;t have access.
            </p>
            <div className="mt-8 flex justify-center">
              <Button href="/dashboard">Back to dashboard</Button>
            </div>
          </Card>
        </section>
      </PageShell>
    );
  }

  const isOrganizer = detail.outing.organizerId === profile.id;

  // Redirect members (non-organizers) to Trip HQ when outing is booked.
  // Organizer stays on this page so they can manage settings even after booking.
  if (!isOrganizer && (detail.outing.status === "booked" || detail.outing.status === "completed")) {
    redirect(`/outings/${outingId}/trip`);
  }

  const profiles = detail.profiles;
  const bestDate = detail.recommendation.bestDates[0];
  const defaults = preferenceDefaults(detail.currentPreference, detail.outing.budgetTarget);
  const progressTarget = detail.insights.respondedCount + detail.insights.pendingCount;
  const preferenceSaved = Boolean(detail.currentPreference);

  // ── New member welcome screen (Step 2) ──────────────────────────────────────
  // Show for any member who hasn't submitted preferences yet — not just ?newMember=1
  // This catches people who signed in via Google, direct nav, email invite, etc.
  if (!detail.currentPreference && !isOrganizer) {
    return (
      <PageShell>
        <section className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Badge className="bg-forest-900/10 text-forest-900">You&apos;re in</Badge>
            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.05em] text-charcoal">
              {detail.outing.name}
            </h1>
            <p className="mt-3 text-base leading-7 text-charcoal/66">
              Fill in your preferences below — takes under 5 minutes. Once you submit, you&apos;ll see the full trip view with courses, lodging, and the group&apos;s picks.
            </p>
          </div>

          {notices.error ? (
            <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{notices.error}</p>
          ) : null}

          <Card>
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">Your preferences</h2>
            <p className="mt-2 text-sm text-charcoal/58">
              Tell the group your budget, available dates, and what you care about most.
            </p>

            <form action={submitPreferencesAction} className="mt-5 space-y-4">
              <input type="hidden" name="outingId" value={detail.outing.id} />
              <input type="hidden" name="fromNewMember" value="1" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="budgetMin">Budget min ($)</FieldLabel>
                  <Input id="budgetMin" name="budgetMin" type="number" defaultValue={defaults.budgetMin} />
                </div>
                <div>
                  <FieldLabel htmlFor="budgetMax">Budget max ($)</FieldLabel>
                  <Input id="budgetMax" name="budgetMax" type="number" defaultValue={defaults.budgetMax} />
                  <p className="mt-1.5 text-xs text-charcoal/45">Trip target: {currency(detail.outing.budgetTarget)}</p>
                </div>
              </div>

              {detail.outing.preferredDateWindows.length > 0 && (
                <div className="rounded-[22px] bg-cream p-4">
                  <FieldLabel>Which dates work for you?</FieldLabel>
                  <div className="mt-2">
                    <DateAvailabilityPicker
                      windows={detail.outing.preferredDateWindows}
                      defaultSelected={[]}
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="courseQualityPreference">Course quality (1–10)</FieldLabel>
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
                  <FieldLabel htmlFor="walkingPreference">Walking or riding?</FieldLabel>
                  <Select id="walkingPreference" name="walkingPreference" defaultValue={defaults.walkingPreference}>
                    <option value="either">Either is fine</option>
                    <option value="walking">Prefer walking</option>
                    <option value="riding">Prefer riding</option>
                  </Select>
                </div>
              </div>

              {detail.destinations.length > 0 ? (
                <div>
                  <FieldLabel>Destination lean (optional)</FieldLabel>
                  <div className="mt-2 space-y-2">
                    {detail.destinations.map((dest) => (
                      <label
                        key={dest.id}
                        className="flex cursor-pointer items-center gap-3 rounded-[14px] bg-cream px-3 py-2.5 text-sm text-charcoal transition-colors hover:bg-charcoal/5"
                      >
                        <input
                          type="checkbox"
                          name="destinationVotes"
                          value={dest.name}
                          defaultChecked={(defaults.destinationVotes as string[]).includes(dest.name)}
                          className="h-4 w-4 accent-forest-900"
                        />
                        <span className="flex-1 font-medium">{dest.name}</span>
                        {dest.driveHours != null && (
                          <span className="shrink-0 text-xs text-charcoal/45">🚗 ~{Math.round(dest.driveHours * 60)} mi</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <FieldLabel>Lodging style (optional)</FieldLabel>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {([
                    ["hotel", "Hotel"],
                    ["resort", "Resort"],
                    ["house", "House / Rental"],
                    ["mixed", "No preference"]
                  ] as const).map(([value, label]) => (
                    <label
                      key={value}
                      className="flex cursor-pointer items-center gap-2.5 rounded-[14px] bg-cream px-3 py-2.5 text-sm text-charcoal transition-colors hover:bg-charcoal/5"
                    >
                      <input
                        type="checkbox"
                        name="lodgingPreferences"
                        value={value}
                        defaultChecked={(defaults.lodgingPreferences as string[]).includes(value)}
                        className="h-4 w-4 accent-forest-900"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="preferredRounds">How many rounds do you want to play?</FieldLabel>
                <Select id="preferredRounds" name="preferredRounds" defaultValue={defaults.preferredRounds ?? ""}>
                  <option value="">No preference</option>
                  <option value="1">1 round</option>
                  <option value="2">2 rounds</option>
                  <option value="3">3 rounds</option>
                  <option value="4">4 rounds</option>
                  <option value="5">5 rounds</option>
                  <option value="6">6 rounds</option>
                  <option value="7">7 rounds</option>
                </Select>
              </div>

              <div>
                <FieldLabel htmlFor="comments">Anything else?</FieldLabel>
                <Textarea
                  id="comments"
                  name="comments"
                  defaultValue={defaults.comments}
                  placeholder="Notes for the organizer..."
                />
              </div>

              <div>
                <FieldLabel htmlFor="homeCity">Your home zip code</FieldLabel>
                <Input
                  id="homeCity"
                  name="homeCity"
                  defaultValue={defaults.homeCity ?? ""}
                  placeholder="e.g. 49503"
                />
                <p className="mt-1.5 text-xs text-charcoal/45">
                  Used to show driving and flight options tailored to you.
                </p>
              </div>

              <SubmitButton label="Submit preferences →" pendingLabel="Saving..." className="w-full" />
            </form>
          </Card>
        </section>
      </PageShell>
    );
  }

  // ── Step 3: Post-preferences confirmation for new members ────────────────────
  if (notices.confirmed === "1") {
    const topDestination = detail.destinations.find(
      (d) => d.id === detail.recommendation.destinationScores[0]?.id
    );
    const topCourse = detail.golfCourses.find(
      (c) => c.id === detail.recommendation.golfScores[0]?.id
    );
    const seenLodgingNamesStep3 = new Set<string>();
    const dedupedLodgingStep3 = detail.lodging.filter((stay) => {
      if (seenLodgingNamesStep3.has(stay.name)) return false;
      seenLodgingNamesStep3.add(stay.name);
      return true;
    });
    const topLodging = dedupedLodgingStep3.find(
      (l) => l.id === detail.recommendation.lodgingScores[0]?.id
    );
    const tripWindowStep3 = detail.outing.preferredDateWindows[0];
    const nightsStep3 = tripWindowStep3
      ? Math.max(1, Math.round((new Date(tripWindowStep3.end).getTime() - new Date(tripWindowStep3.start).getTime()) / (1000 * 60 * 60 * 24)))
      : 3;
    const roundsStep3 = detail.recommendation.consensusRounds
      ?? (detail.outing.golfIntensity === "light" ? 2 : detail.outing.golfIntensity === "golf_first" ? 4 : 3);
    const playersStep3 = detail.outing.numberOfPlayers;

    return (
      <PageShell>
        <section id="confirmed-top" className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest-900/10 text-2xl">
              ⛳
            </div>
            <h1 className="mt-5 font-serif text-4xl font-semibold tracking-[-0.05em] text-charcoal">
              You&apos;re all set!
            </h1>
            <p className="mt-3 text-base leading-7 text-charcoal/66">
              Based on your preferences and the rest of the group&apos;s, here&apos;s what&apos;s shaping up for{" "}
              <span className="font-semibold text-charcoal">{detail.outing.name}</span>.
            </p>
          </div>

          <div className="space-y-4">
            {topDestination ? (
              <div className="rounded-[28px] bg-forest-950 p-6 text-cream">
                <p className="text-xs uppercase tracking-[0.22em] text-cream/50">Top destination</p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">{topDestination.name}</p>
                <p className="mt-1 text-sm text-cream/60">{topDestination.region}</p>
                {topDestination.summary ? (
                  <p className="mt-3 text-sm leading-6 text-cream/70">{topDestination.summary}</p>
                ) : null}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[18px] bg-white/8 px-4 py-3">
                    <p className="text-xs text-cream/50">Avg. round</p>
                    <p className="mt-1 text-sm font-semibold">{currency(topDestination.averageRoundCost)}</p>
                  </div>
                  <div className="rounded-[18px] bg-white/8 px-4 py-3">
                    <p className="text-xs text-cream/50">Est. per person</p>
                    <p className="mt-1 text-sm font-semibold">
                      {currency(
                        topDestination.averageRoundCost * roundsStep3 +
                          Math.round((topDestination.averageNightlyRate * nightsStep3) / playersStep3)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[28px] bg-cream p-5 text-center text-sm text-charcoal/50">
                Destination picks are being calculated — check back soon.
              </div>
            )}

            {topCourse ? (
              <div className="rounded-[28px] border border-charcoal/8 bg-white p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-charcoal/40">Top course</p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-charcoal">{topCourse.name}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <div className="rounded-[14px] bg-cream px-3 py-2 text-sm">
                    <span className="text-charcoal/55">Greens fee </span>
                    <span className="font-semibold text-charcoal">{currency(topCourse.averageGreensFee)}</span>
                  </div>
                  <div className="rounded-[14px] bg-cream px-3 py-2 text-sm">
                    <span className="text-charcoal/55">{roundsStep3} round{roundsStep3 !== 1 ? "s" : ""} · </span>
                    <span className="font-semibold text-charcoal">{currency(topCourse.averageGreensFee * roundsStep3)} per person</span>
                  </div>
                </div>
              </div>
            ) : null}

            {topLodging ? (
              <div className="rounded-[28px] border border-charcoal/8 bg-white p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-charcoal/40">Top lodging</p>
                <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-charcoal">{topLodging.name}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <div className="rounded-[14px] bg-cream px-3 py-2 text-sm">
                    <span className="text-charcoal/55">Nightly rate </span>
                    <span className="font-semibold text-charcoal">{currency(topLodging.nightlyRate ?? 0)}</span>
                  </div>
                  <div className="rounded-[14px] bg-cream px-3 py-2 text-sm">
                    <span className="text-charcoal/55">{nightsStep3} nights · </span>
                    <span className="font-semibold text-charcoal">
                      {currency(Math.round(((topLodging.nightlyRate ?? 0) * nightsStep3) / playersStep3))} per person
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button href={`/outings/${outingId}`} className="w-full text-center justify-center">
              See the full outing →
            </Button>
            <Button href={`/outings/${outingId}/compare`} variant="secondary" className="w-full text-center justify-center">
              Compare all options
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-charcoal/40">
            Results update as more members respond.
          </p>
        </section>
      </PageShell>
    );
  }

  // ── Main outing page ─────────────────────────────────────────────────────────

  const shareLink = isOrganizer
    ? notices.shareLink ?? (await getOutingShareLink(detail.outing.id, detail.outing.organizerId)) ?? null
    : null;

  const responsePercent = progressTarget
    ? Math.round((detail.insights.respondedCount / progressTarget) * 100)
    : 0;

  // Deduplicate lodging
  const seenLodgingNames = new Set<string>();
  const dedupedLodging = detail.lodging.filter((stay) => {
    if (seenLodgingNames.has(stay.name)) return false;
    seenLodgingNames.add(stay.name);
    return true;
  });

  // Cost estimates
  const tripWindow = detail.outing.preferredDateWindows[0];
  const nights = tripWindow
    ? Math.max(1, Math.round((new Date(tripWindow.end).getTime() - new Date(tripWindow.start).getTime()) / (1000 * 60 * 60 * 24)))
    : 3;
  const roundsPerPlayer = detail.recommendation.consensusRounds
    ?? (detail.outing.golfIntensity === "light" ? 2 : detail.outing.golfIntensity === "golf_first" ? 4 : 3);
  const players = detail.outing.numberOfPlayers;

  // Group budget consensus — average of every member's stated (budgetMin + budgetMax) / 2
  // Computed from detail.preferences (typed correctly) rather than insights to avoid TS inference issues
  const groupBudgetAvg = detail.preferences.length > 0
    ? Math.round(detail.preferences.reduce((sum, p) => sum + (p.budgetMin + p.budgetMax) / 2, 0) / detail.preferences.length)
    : null;

  // ── Favorites helpers ────────────────────────────────────────────────────────
  const allFavorites = detail.favorites;
  const myFavorites = allFavorites.filter((f) => f.profileId === profile.id);
  function isFavoritedByMe(entityType: "golf_course" | "lodging", entityId: string) {
    return myFavorites.some((f) => f.entityType === entityType && f.entityId === entityId);
  }
  function favoriteCount(entityType: "golf_course" | "lodging", entityId: string) {
    return allFavorites.filter((f) => f.entityType === entityType && f.entityId === entityId).length;
  }

  // Voting state
  const votingOpen = detail.outing.votingOpen;
  const myVotes = detail.votes.filter((v) => v.profileId === profile.id);
  const myCoursePick = myVotes.find((v) => v.entityType === "golf_course")?.entityId ?? null;
  const myLodgingPick = myVotes.find((v) => v.entityType === "lodging")?.entityId ?? null;

  // Tally votes per entity
  const allVotes = detail.votes;
  function voteTally(entityType: "golf_course" | "lodging", entityId: string) {
    return allVotes.filter((v) => v.entityType === entityType && v.entityId === entityId).length;
  }

  // Top 3 courses and lodging for the voting zone
  const top3Courses = detail.golfCourses.slice(0, 3);
  const top3Lodging = dedupedLodging.slice(0, 3);
  const totalVoters = progressTarget;

  // Per-person cost estimate
  // If courses have schedule_rounds set, sum those up; otherwise fall back to global rounds estimate
  const scheduledCoursesWithRounds = detail.golfCourses.filter((c) => !c.hidden && c.scheduleDay != null);
  const totalScheduledGolfCost = scheduledCoursesWithRounds.length > 0
    ? scheduledCoursesWithRounds.reduce((sum, c) => sum + c.averageGreensFee * (c.scheduleRounds ?? 1), 0)
    : null;
  const golfPerPerson = totalScheduledGolfCost !== null
    ? totalScheduledGolfCost
    : detail.insights.topCourse
      ? detail.insights.topCourse.averageGreensFee * roundsPerPlayer
      : null;
  const lodgingTotal = detail.insights.topLodging
    ? (detail.insights.topLodging.priceTotal ?? detail.insights.topLodging.nightlyRate * nights)
    : null;
  const lodgingPerPerson = lodgingTotal !== null ? Math.round(lodgingTotal / players) : null;
  const estimatedPerPerson = golfPerPerson !== null && lodgingPerPerson !== null
    ? golfPerPerson + lodgingPerPerson
    : null;
  // Total rounds from scheduled courses (for display)
  const totalScheduledRounds = scheduledCoursesWithRounds.reduce((sum, c) => sum + (c.scheduleRounds ?? 1), 0);

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Trip header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={
                (detail.outing.status as string) === "booked" ? "bg-emerald-100 text-emerald-800"
                : (detail.outing.status as string) === "completed" ? "bg-charcoal/8 text-charcoal/50"
                : "bg-sand text-charcoal/70"
              }>
                {detail.outing.status === "narrowed_down" ? "Narrowed down" : labelize(detail.outing.status)}
              </Badge>
              {votingOpen && (
                <Badge className="bg-amber-100 text-amber-800">🗳 Group vote open</Badge>
              )}
            </div>
            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-charcoal sm:text-4xl">
              {detail.outing.name}
            </h1>
            <p className="mt-1 text-sm text-charcoal/55">
              {detail.outing.destinationLabel} · {detail.outing.numberOfPlayers} golfers
              {tripWindow ? ` · ${planningWindowLabel(tripWindow.start, tripWindow.end)}` : ""}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end sm:min-w-[160px]">
            {isOrganizer && (detail.outing.status === "booked" || detail.outing.status === "completed") && (
              <Button href={`/outings/${detail.outing.id}/trip`} className="w-full sm:w-auto bg-forest-900 text-cream">
                → View Trip HQ
              </Button>
            )}
            <Button href={`/outings/${detail.outing.id}/compare`} variant="secondary" className="w-full sm:w-auto">
              Compare options
            </Button>
            {isOrganizer && detail.outing.status !== "booked" && detail.outing.status !== "completed" && (
              <MarkAsBookedButton
                outingId={detail.outing.id}
                markAsBooked={markAsBookedAction}
                bookingState={
                  !votingOpen && allVotes.length > 0
                    ? "ready"
                    : votingOpen
                      ? "voting_open"
                      : "no_vote"
                }
              />
            )}
          </div>
        </div>

        {/* ── Stat strip ── */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {/* Responses */}
          <div className="rounded-[20px] border border-charcoal/8 bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-charcoal/42">Responses</p>
            <p className="mt-2 text-xl font-semibold text-charcoal">
              {detail.insights.respondedCount}<span className="text-sm font-normal text-charcoal/40">/{progressTarget || "—"}</span>
            </p>
            {progressTarget > 0 && (
              <div className="mt-2 h-1.5 w-full rounded-full bg-charcoal/8">
                <div
                  className={["h-1.5 rounded-full transition-all", responsePercent === 100 ? "bg-emerald-500" : "bg-forest-900"].join(" ")}
                  style={{ width: `${responsePercent}%` }}
                />
              </div>
            )}
          </div>

          {/* Best date */}
          <div className="rounded-[20px] border border-charcoal/8 bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-charcoal/42">Best date</p>
            <p className="mt-2 text-sm font-semibold text-charcoal leading-tight">
              {bestDate ? bestDate.date : "—"}
            </p>
            {bestDate && (
              <p className="mt-1 text-xs text-charcoal/45">{bestDate.availableCount} available</p>
            )}
          </div>

          {/* Group budget avg — from actual member submissions */}
          <div className={["rounded-[20px] border px-4 py-3", groupBudgetAvg ? "border-forest-900/15 bg-forest-900/6" : "border-charcoal/8 bg-white"].join(" ")}>
            <p className="text-xs uppercase tracking-[0.18em] text-charcoal/42">Group budget</p>
            <p className={["mt-2 text-xl font-semibold", groupBudgetAvg ? "text-forest-900" : "text-charcoal/30"].join(" ")}>
              {groupBudgetAvg ? currency(groupBudgetAvg) : "—"}
            </p>
            {groupBudgetAvg && (
              <p className="mt-1 text-xs text-charcoal/45">avg of {detail.preferences.length} response{detail.preferences.length !== 1 ? "s" : ""}</p>
            )}
          </div>

          {/* Est. per person */}
          <div className={["rounded-[20px] border px-4 py-3", estimatedPerPerson ? "border-charcoal/8 bg-white" : "border-charcoal/8 bg-white"].join(" ")}>
            <p className="text-xs uppercase tracking-[0.18em] text-charcoal/42">Est./person</p>
            <p className={["mt-2 text-xl font-semibold", estimatedPerPerson ? "text-charcoal" : "text-charcoal/30"].join(" ")}>
              {estimatedPerPerson ? currency(estimatedPerPerson) : "—"}
            </p>
            {estimatedPerPerson && (
              <p className="mt-1 text-xs text-charcoal/45">
                {nights}n · {totalScheduledRounds > 0 ? totalScheduledRounds : roundsPerPlayer}rnd
              </p>
            )}
          </div>

          {/* Nights */}
          <div className="rounded-[20px] border border-charcoal/8 bg-white px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-charcoal/42">Trip length</p>
            <p className="mt-2 text-xl font-semibold text-charcoal">
              {nights}<span className="text-sm font-normal text-charcoal/40"> nights</span>
            </p>
            <p className="mt-1 text-xs text-charcoal/45">
              {totalScheduledRounds > 0 ? totalScheduledRounds : roundsPerPlayer} rounds planned
            </p>
          </div>
        </div>

        {/* ── Notices ── */}
        {notices.created === "1" ? (
          <div className="mt-5 rounded-[22px] border border-emerald-200 bg-[linear-gradient(135deg,#ecfdf3,#f7f4ee)] px-5 py-4">
            <h2 className="font-semibold text-charcoal">Trip created — invite the group</h2>
            <p className="mt-1 text-sm text-charcoal/68">
              {notices.inviteEmail ? `First invite sent to ${notices.inviteEmail}.` : "Share the link or invite by email below."}
            </p>
          </div>
        ) : notices.success ? (
          <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notices.success}</p>
        ) : null}
        {notices.error ? (
          <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{notices.error}</p>
        ) : null}

        {/* ── All-in CTA: organizer prompt to start vote ── */}
        {isOrganizer && !votingOpen && responsePercent === 100 && progressTarget > 0 && allVotes.length === 0 && (
          <div className="mt-6 rounded-[28px] border-2 border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5,#f7f4ee)] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎉</span>
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">Everyone&apos;s in!</h2>
                </div>
                <p className="mt-1 text-sm text-charcoal/65">
                  All {progressTarget} members have submitted their preferences. Ready to open the group vote on courses and lodging?
                </p>
              </div>
              <form action={openVotingAction} className="shrink-0">
                <input type="hidden" name="outingId" value={detail.outing.id} />
                <SubmitButton
                  label="🗳 Open group vote"
                  pendingLabel="Opening…"
                  className="rounded-full bg-forest-900 px-5 py-2.5 text-sm font-semibold text-cream shadow-[0_4px_14px_rgba(20,58,44,0.25)] hover:bg-forest-900/90 transition-colors"
                />
              </form>
            </div>
          </div>
        )}

        {/* ── Vote results: shown after voting closes and votes exist ── */}
        {!votingOpen && allVotes.length > 0 && (() => {
          const courseVoteCounts = new Map<string, number>();
          const lodgingVoteCounts = new Map<string, number>();
          allVotes.forEach((v) => {
            if (v.entityType === "golf_course") courseVoteCounts.set(v.entityId, (courseVoteCounts.get(v.entityId) ?? 0) + 1);
            if (v.entityType === "lodging") lodgingVoteCounts.set(v.entityId, (lodgingVoteCounts.get(v.entityId) ?? 0) + 1);
          });
          const winningCourseEntry = [...courseVoteCounts.entries()].sort((a, b) => b[1] - a[1])[0];
          const winningLodgingEntry = [...lodgingVoteCounts.entries()].sort((a, b) => b[1] - a[1])[0];
          const winningCourse = winningCourseEntry ? detail.golfCourses.find((c) => c.id === winningCourseEntry[0]) : null;
          const winningLodging = winningLodgingEntry ? detail.lodging.find((l) => l.id === winningLodgingEntry[0]) : null;
          const totalCourseVotes = [...courseVoteCounts.values()].reduce((a, b) => a + b, 0);
          const totalLodgingVotes = [...lodgingVoteCounts.values()].reduce((a, b) => a + b, 0);
          return (
            <div className="mt-6 rounded-[28px] border-2 border-forest-900/15 bg-[linear-gradient(135deg,rgba(20,58,44,0.06),rgba(247,244,238,0.8))] p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">Vote results</h2>
                  </div>
                  <p className="mt-1 text-sm text-charcoal/60">
                    Voting is closed. These are the group&apos;s top picks.
                  </p>
                </div>
                {isOrganizer && (
                  <form action={openVotingAction} className="shrink-0">
                    <input type="hidden" name="outingId" value={detail.outing.id} />
                    <SubmitButton label="Re-open vote" pendingLabel="Opening…" className="text-sm" />
                  </form>
                )}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {winningCourse && (
                  <div className="rounded-[22px] bg-white p-4 ring-2 ring-forest-900/15">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/45">Top course</p>
                    <p className="mt-2 font-semibold text-charcoal">{winningCourse.name}</p>
                    <p className="mt-0.5 text-sm text-charcoal/55">{winningCourse.locationLabel}</p>
                    <p className="mt-2 text-xs text-charcoal/50">
                      {winningCourseEntry![1]} of {totalCourseVotes} vote{totalCourseVotes !== 1 ? "s" : ""}
                      {totalCourseVotes > 0 ? ` · ${Math.round((winningCourseEntry![1] / totalCourseVotes) * 100)}%` : ""}
                    </p>
                  </div>
                )}
                {winningLodging && (
                  <div className="rounded-[22px] bg-white p-4 ring-2 ring-forest-900/15">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/45">Top lodging</p>
                    <p className="mt-2 font-semibold text-charcoal">{winningLodging.name}</p>
                    <p className="mt-0.5 text-sm text-charcoal/55">
                      {currency(winningLodging.nightlyRate)}/night · {winningLodging.city ?? ""}
                    </p>
                    <p className="mt-2 text-xs text-charcoal/50">
                      {winningLodgingEntry![1]} of {totalLodgingVotes} vote{totalLodgingVotes !== 1 ? "s" : ""}
                      {totalLodgingVotes > 0 ? ` · ${Math.round((winningLodgingEntry![1] / totalLodgingVotes) * 100)}%` : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ── Group vote zone (full-width, only when open) ── */}
        {votingOpen && (top3Courses.length > 0 || top3Lodging.length > 0) && (
          <div className="mt-6 rounded-[28px] border-2 border-amber-200 bg-amber-50/60 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🗳</span>
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">Group vote</h2>
                </div>
                <p className="mt-1 text-sm text-charcoal/60">
                  Each person picks one course and one lodging. The organizer makes the final call.
                </p>
              </div>
              {isOrganizer && (
                <form action={closeVotingAction}>
                  <input type="hidden" name="outingId" value={detail.outing.id} />
                  <SubmitButton label="Close vote" pendingLabel="Closing..." className="shrink-0 text-sm" />
                </form>
              )}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Course vote */}
              {top3Courses.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/50">Pick a course</p>
                  <div className="space-y-3">
                    {top3Courses.map((course) => {
                      const tally = voteTally("golf_course", course.id);
                      const isMyPick = myCoursePick === course.id;
                      const pct = totalVoters > 0 ? Math.round((tally / totalVoters) * 100) : 0;
                      return (
                        <div key={course.id} className={["rounded-[20px] p-4 transition-all", isMyPick ? "bg-forest-900 text-cream" : "bg-white"].join(" ")}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className={["font-semibold", isMyPick ? "text-cream" : "text-charcoal"].join(" ")}>{course.name}</p>
                              <p className={["text-sm", isMyPick ? "text-cream/60" : "text-charcoal/55"].join(" ")}>{currency(course.averageGreensFee)}/round</p>
                            </div>
                            <VoteButton
                              outingId={detail.outing.id}
                              entityType="golf_course"
                              entityId={course.id}
                              isMyPick={isMyPick}
                            />
                          </div>
                          {tally > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className={isMyPick ? "text-cream/60" : "text-charcoal/50"}>{tally} vote{tally !== 1 ? "s" : ""}</span>
                                <span className={isMyPick ? "text-cream/60" : "text-charcoal/50"}>{pct}%</span>
                              </div>
                              <div className={["h-1.5 w-full rounded-full", isMyPick ? "bg-white/15" : "bg-charcoal/8"].join(" ")}>
                                <div
                                  className={["h-1.5 rounded-full transition-all", isMyPick ? "bg-white/60" : "bg-forest-900"].join(" ")}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Lodging vote */}
              {top3Lodging.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal/50">Pick a place to stay</p>
                  <div className="space-y-3">
                    {top3Lodging.map((stay) => {
                      const tally = voteTally("lodging", stay.id);
                      const isMyPick = myLodgingPick === stay.id;
                      const pct = totalVoters > 0 ? Math.round((tally / totalVoters) * 100) : 0;
                      return (
                        <div key={stay.id} className={["rounded-[20px] p-4 transition-all", isMyPick ? "bg-forest-900 text-cream" : "bg-white"].join(" ")}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className={["font-semibold", isMyPick ? "text-cream" : "text-charcoal"].join(" ")}>{stay.name}</p>
                              <p className={["text-sm", isMyPick ? "text-cream/60" : "text-charcoal/55"].join(" ")}>
                                {currency(stay.nightlyRate)}/night · {currency(Math.round((stay.priceTotal ?? stay.nightlyRate * nights) / players))}/person
                              </p>
                            </div>
                            <VoteButton
                              outingId={detail.outing.id}
                              entityType="lodging"
                              entityId={stay.id}
                              isMyPick={isMyPick}
                            />
                          </div>
                          {tally > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className={isMyPick ? "text-cream/60" : "text-charcoal/50"}>{tally} vote{tally !== 1 ? "s" : ""}</span>
                                <span className={isMyPick ? "text-cream/60" : "text-charcoal/50"}>{pct}%</span>
                              </div>
                              <div className={["h-1.5 w-full rounded-full", isMyPick ? "bg-white/15" : "bg-charcoal/8"].join(" ")}>
                                <div
                                  className={["h-1.5 rounded-full transition-all", isMyPick ? "bg-white/60" : "bg-forest-900"].join(" ")}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Main two-column grid ── */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">

          {/* ── Left column: options + chat ── */}
          <div className="space-y-6">

            {/* Golf courses */}
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">⛳ Golf courses</h2>
                  {detail.insights.respondedCount > 0 && (
                    <p className="mt-0.5 text-xs text-forest-900/70">↑ Ranked by group preferences</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-charcoal/50">
                    {roundsPerPlayer} rounds · {players} players
                    {detail.recommendation.consensusRounds ? " · group votes" : ""}
                  </p>
                  {isOrganizer && (
                    <form action={regenerateOutingInventoryAction.bind(null, detail.outing.id)}>
                      <SubmitButton
                        label="↺ Refresh results"
                        pendingLabel="Refreshing…"
                        className="rounded-full bg-charcoal/8 px-3 py-1 text-xs font-medium text-charcoal/60 hover:bg-charcoal/12 hover:text-charcoal shadow-none"
                      />
                    </form>
                  )}
                </div>
              </div>

              {detail.golfCourses.length === 0 ? (
                <div className="mt-4 rounded-[22px] border border-dashed border-amber-200 bg-amber-50 px-5 py-5 text-center">
                  <p className="text-sm font-medium text-amber-800">⏳ No golf courses found yet</p>
                  <p className="mt-1 text-xs text-amber-700/70">
                    {isOrganizer
                      ? "Try clicking \"↺ Refresh results\" above to pull in options for your destination."
                      : "Options are being pulled in — check back shortly."}
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {detail.golfCourses.map((course) => {
                    const isTop = course.id === detail.insights.topCourse?.id;
                    const courseRounds = course.scheduleRounds ?? 1;
                    const courseGolfCost = course.averageGreensFee * courseRounds;
                    const tally = voteTally("golf_course", course.id);
                    const favCount = favoriteCount("golf_course", course.id);
                    const favByMe = isFavoritedByMe("golf_course", course.id);
                    return (
                      <div key={course.id} className="rounded-[22px] border border-charcoal/8 bg-cream p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-charcoal">{course.name}</p>
                              {isTop && <Badge className="bg-forest-900/10 text-forest-900">Top pick</Badge>}
                              {course.featured && <Badge className="bg-forest-900 text-cream">★ Pick</Badge>}
                              {tally > 0 && votingOpen && (
                                <Badge className="bg-amber-100 text-amber-800">{tally} vote{tally !== 1 ? "s" : ""}</Badge>
                              )}
                            </div>
                            <p className="mt-0.5 text-sm text-charcoal/55">{course.locationLabel}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-charcoal">{currency(courseGolfCost)}<span className="ml-1 text-xs font-normal text-charcoal/50">/person</span></p>
                            <p className="mt-0.5 text-xs text-charcoal/45">{currency(course.averageGreensFee)} × {courseRounds}rnd</p>
                          </div>
                        </div>
                        {/* Bottom row — info left, all controls right; wraps on mobile */}
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs text-charcoal/55 min-w-0">
                            <span className="shrink-0">Quality {course.qualityScore}/100</span>
                            <span className="shrink-0">{course.walkingFriendly ? "Walking" : "Riding"}</span>
                            {course.scheduleDay && (
                              <span className="shrink-0 rounded-full bg-forest-900/8 px-2 py-0.5 text-forest-900 font-medium">
                                Day {course.scheduleDay}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center justify-end gap-1.5">
                            <FavoriteButton
                              outingId={detail.outing.id}
                              entityType="golf_course"
                              entityId={course.id}
                              isFavorited={favByMe}
                              totalCount={favCount}
                            />
                            {isOrganizer && (
                              <OrganizerPickButton
                                outingId={detail.outing.id}
                                entityType="golf_course"
                                entityId={course.id}
                                isFeatured={course.featured ?? false}
                              />
                            )}
                            {isOrganizer && (
                              <RoundsSelector
                                outingId={detail.outing.id}
                                courseId={course.id}
                                scheduleRounds={course.scheduleRounds ?? 1}
                              />
                            )}
                            {isOrganizer && detail.golfCourses.length > 1 && (
                              <CourseScheduleSelector
                                outingId={detail.outing.id}
                                courseId={course.id}
                                scheduleDay={course.scheduleDay ?? null}
                                maxDays={nights}
                              />
                            )}
                            <a
                              href={`https://www.google.com/search?q=${encodeURIComponent(course.name + " golf course " + course.locationLabel)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-full bg-forest-900 px-3 py-1.5 text-xs font-medium text-cream hover:bg-forest-900/90 transition-colors"
                            >
                              Find tee times →
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Lodging options */}
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">🏨 Lodging options</h2>
                  {detail.insights.respondedCount > 0 && (
                    <p className="mt-0.5 text-xs text-forest-900/70">↑ Ranked by group preferences</p>
                  )}
                </div>
                <p className="text-sm text-charcoal/50">{nights} nights · {players} players</p>
              </div>

              {dedupedLodging.length === 0 ? (
                <div className="mt-4 rounded-[22px] border border-dashed border-amber-200 bg-amber-50 px-5 py-5 text-center">
                  <p className="text-sm font-medium text-amber-800">⏳ Finding lodging options…</p>
                  <p className="mt-1 text-xs text-amber-700/70">Lodging options are being pulled in — refresh in a few seconds.</p>
                  <a href="" className="mt-3 inline-block rounded-full bg-amber-100 px-4 py-2 text-xs font-medium text-amber-800 hover:bg-amber-200 transition-colors">Refresh now</a>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {dedupedLodging.map((stay) => {
                    const isTop = stay.id === detail.insights.topLodging?.id;
                    const tally = voteTally("lodging", stay.id);
                    const favCount = favoriteCount("lodging", stay.id);
                    const favByMe = isFavoritedByMe("lodging", stay.id);
                    return (
                      <div key={stay.id} className="rounded-[22px] border border-charcoal/8 bg-cream p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-charcoal">{stay.name}</p>
                              {isTop && <Badge className="bg-forest-900/10 text-forest-900">Top pick</Badge>}
                              {stay.featured && <Badge className="bg-forest-900 text-cream">★ Pick</Badge>}
                              {tally > 0 && votingOpen && (
                                <Badge className="bg-amber-100 text-amber-800">{tally} vote{tally !== 1 ? "s" : ""}</Badge>
                              )}
                            </div>
                            <p className="mt-0.5 text-sm capitalize text-charcoal/55">
                              {labelize(stay.lodgingType)}{stay.city ? ` · ${stay.city}${stay.state ? `, ${stay.state}` : ""}` : ""}
                            </p>
                          </div>
                          <LodgingRoomRate nightlyRate={stay.nightlyRate} nights={nights} />
                        </div>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-charcoal/55">
                            <span>Sleeps {stay.sleeps}</span>
                            {stay.refundable !== null && stay.refundable !== undefined && (
                              <span>{stay.refundable ? "Refundable" : "Non-refundable"}</span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <FavoriteButton
                              outingId={detail.outing.id}
                              entityType="lodging"
                              entityId={stay.id}
                              isFavorited={favByMe}
                              totalCount={favCount}
                            />
                            {isOrganizer && (
                              <OrganizerPickButton
                                outingId={detail.outing.id}
                                entityType="lodging"
                                entityId={stay.id}
                                isFeatured={stay.featured ?? false}
                              />
                            )}
                            <a
                              href={`https://maps.google.com/maps/search/${encodeURIComponent(stay.name + (stay.city ? " " + stay.city : "") + (stay.state ? " " + stay.state : ""))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-full bg-forest-900 px-3 py-1.5 text-xs font-medium text-cream hover:bg-forest-900/90 transition-colors"
                            >
                              View on Maps →
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </Card>

            {/* Combined cost estimate */}
            {golfPerPerson !== null && lodgingPerPerson !== null && (
              <div className="rounded-[28px] bg-forest-950 px-6 py-5 text-cream">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-cream/50">Estimated per person</p>
                    <p className="mt-2 font-serif text-4xl font-semibold tracking-[-0.05em]">
                      {currency(golfPerPerson + lodgingPerPerson)}
                    </p>
                    <p className="mt-1 text-sm text-cream/55">
                      {scheduledCoursesWithRounds.length > 0
                        ? `${scheduledCoursesWithRounds.length} course${scheduledCoursesWithRounds.length !== 1 ? "s" : ""} scheduled · ${totalScheduledRounds} round${totalScheduledRounds !== 1 ? "s" : ""}`
                        : `Top-ranked golf & lodging · ${nights} nights · ${roundsPerPlayer} rounds`}
                    </p>
                  </div>
                  <div className="space-y-1 text-sm text-cream/65">
                    <p>{currency(golfPerPerson)} golf ({scheduledCoursesWithRounds.length > 0 ? `${totalScheduledRounds} rounds` : `${roundsPerPlayer} rounds`})</p>
                    <p>{currency(lodgingPerPerson)} lodging (÷ {players} players)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Chat — compact */}
            <ChatPanel
              messages={detail.messages.slice(-3)}
              profiles={profiles}
              outingId={detail.outing.id}
              currentProfileId={profile.id}
              sendAction={sendChatMessageInlineAction}
              compact
              totalMessages={detail.messages.length}
            />
          </div>

          {/* ── Right column ── */}
          <div className="space-y-6">

            {/* ── Group: single combined section ── */}
            <Card id="group">
              {/* Header + progress */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">The group</h2>
                  <p className="mt-1 text-sm text-charcoal/55">
                    {detail.insights.respondedCount === progressTarget && progressTarget > 0
                      ? `Everyone's responded ✓`
                      : `${detail.insights.respondedCount} of ${progressTarget || "—"} responded`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-forest-900/8 text-forest-900">{detail.members.length} joined</Badge>
                  {detail.invites.filter((i) => i.status === "pending").length > 0 && (
                    <Badge className="bg-sand text-charcoal/72">
                      {detail.invites.filter((i) => i.status === "pending").length} pending
                    </Badge>
                  )}
                </div>
              </div>

              {/* Member list */}
              <div className="mt-4">
                {detail.memberSnapshots.map((snapshot) => {
                  const person = profiles.find((item) => item.id === snapshot.member.profileId);
                  return (
                    <div key={snapshot.member.id}>
                      <MemberRow
                        person={person}
                        responded={snapshot.responded}
                        role={labelize(snapshot.member.role)}
                        homeCity={snapshot.preference?.homeCity}
                      />
                      {!snapshot.responded && snapshot.member.profileId !== profile.id && isOrganizer && (
                        <div className="mb-1 flex justify-end">
                          <form action={nudgeMemberAction}>
                            <input type="hidden" name="outingId" value={detail.outing.id} />
                            <input type="hidden" name="memberProfileId" value={snapshot.member.profileId} />
                            <input type="hidden" name="memberEmail" value={person?.email ?? ""} />
                            <Button type="submit" variant="secondary" className="px-3 py-1.5 text-xs">
                              Send reminder
                            </Button>
                          </form>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Pending invites */}
                {detail.invites.filter((i) => i.status === "pending").length > 0 && (
                  <div className="mt-3 space-y-2">
                    {detail.invites.filter((i) => i.status === "pending").map((invite) => (
                      <div key={invite.id} className="flex items-center justify-between gap-3 rounded-[16px] bg-cream px-4 py-2.5">
                        <p className="text-sm text-charcoal truncate">{invite.email}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge>Pending</Badge>
                          {isOrganizer && (
                            <form action={resendInviteAction}>
                              <input type="hidden" name="outingId" value={detail.outing.id} />
                              <input type="hidden" name="inviteId" value={invite.id} />
                              <Button type="submit" variant="secondary" className="px-2.5 py-1 text-xs">Resend</Button>
                            </form>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Organizer invite form */}
              {isOrganizer && (
                <form action={inviteMemberAction} className="mt-5 rounded-[22px] bg-forest-950 p-4 text-cream">
                  <input type="hidden" name="outingId" value={detail.outing.id} />
                  <h3 className="font-semibold tracking-[-0.02em]">Invite more golfers</h3>
                  <p className="mt-1 text-sm text-cream/60">One email per line, or comma-separated.</p>
                  <div className="mt-3">
                    <Textarea
                      name="emails"
                      placeholder={"friend@example.com\nanother@example.com"}
                      className="min-h-20 bg-white/10 text-cream placeholder:text-cream/35"
                    />
                  </div>
                  <div className="mt-3">
                    <SubmitButton label="Send invites" pendingLabel="Sending..." className="w-full" />
                  </div>
                  {shareLink ? (
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <p className="mb-2 text-xs text-cream/50">Or share a link directly</p>
                      <CopyLinkButton link={shareLink} label="Copy share link" copiedLabel="Copied!" />
                    </div>
                  ) : null}
                </form>
              )}
            </Card>

            {/* ── Your preferences ── */}
            <Card id="preferences">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">Your preferences</h2>
                {preferenceSaved ? (
                  <Badge className="bg-emerald-100 text-emerald-800">Saved ✓</Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-800">Not filled in</Badge>
                )}
              </div>

              {preferenceSaved ? (
                /* Collapsed summary */
                <div className="mt-3 rounded-[18px] bg-cream px-4 py-3 text-sm text-charcoal/68">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    <span className="text-charcoal/45">Budget</span>
                    <span className="font-medium text-charcoal">{currency(Number(defaults.budgetMin))} – {currency(Number(defaults.budgetMax))}</span>
                    <span className="text-charcoal/45">Rounds</span>
                    <span className="font-medium text-charcoal">{defaults.preferredRounds ?? "No preference"}</span>
                    <span className="text-charcoal/45">Walking</span>
                    <span className="font-medium text-charcoal capitalize">{defaults.walkingPreference}</span>
                    {defaults.homeCity && (
                      <>
                        <span className="text-charcoal/45">From</span>
                        <span className="font-medium text-charcoal">{defaults.homeCity}</span>
                      </>
                    )}
                  </div>
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs text-forest-900 hover:underline">Edit preferences</summary>
                    <form action={submitPreferencesAction} className="mt-4 space-y-4">
                      <input type="hidden" name="outingId" value={detail.outing.id} />
                      {PreferencesFormFields({ detail, defaults })}
                      <SubmitButton label="Save preferences" pendingLabel="Saving..." />
                    </form>
                  </details>
                </div>
              ) : (
                /* Full form for first-timers */
                <form action={submitPreferencesAction} className="mt-4 space-y-4">
                  <input type="hidden" name="outingId" value={detail.outing.id} />
                  {PreferencesFormFields({ detail, defaults })}
                  <SubmitButton label="Save preferences" pendingLabel="Saving..." />
                </form>
              )}
            </Card>

            {/* ── Airbnb / VRBO quick-search ── */}
            {(() => {
              const dest = detail.outing.destinationLabel !== "Flexible location"
                ? detail.outing.destinationLabel : "";
              const airbnbParams = new URLSearchParams({
                ...(dest ? { query: dest } : {}),
                ...(tripWindow ? { checkin: tripWindow.start, checkout: tripWindow.end } : {}),
                adults: String(players),
                tab_id: "home_tab"
              });
              const airbnbUrl = dest
                ? `https://www.airbnb.com/s/${encodeURIComponent(dest)}/homes?${airbnbParams}`
                : `https://www.airbnb.com/s/homes?${airbnbParams}`;
              const vrboParams = new URLSearchParams({
                ...(dest ? { q: dest } : {}),
                ...(tripWindow ? { arrival: tripWindow.start, departure: tripWindow.end } : {}),
                sleeps: String(players)
              });
              const vrboUrl = `https://www.vrbo.com/search?${vrboParams}`;
              return (
                <div className="rounded-[22px] border border-charcoal/8 bg-white px-5 py-4">
                  <p className="text-sm font-semibold text-charcoal">🏠 House &amp; rental search</p>
                  <p className="mt-0.5 text-xs text-charcoal/50">
                    Pre-filled with your destination{tripWindow ? ", dates," : ""} and {players} guests.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <a
                      href={airbnbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-charcoal/12 bg-cream px-3 py-2 text-sm font-medium text-charcoal transition hover:border-[#FF5A5F]/50 hover:text-[#FF5A5F]"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current" aria-hidden="true">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.09 4.29c.615 0 1.12.504 1.12 1.12a1.12 1.12 0 01-2.24 0c0-.616.505-1.12 1.12-1.12zm3.93 11.55c-.17.396-.404.74-.695 1.02a3.16 3.16 0 01-.99.655c-.37.15-.75.228-1.154.228-.405 0-.785-.077-1.155-.228a3.16 3.16 0 01-.989-.655 3.17 3.17 0 01-.695-1.02c-.614-1.434-.24-2.99.3-4.307.544-1.315 1.31-2.5 1.945-3.43.633.93 1.4 2.115 1.943 3.43.54 1.317.915 2.873.3 4.306h.19zm1.47.614c.16-.382.255-.79.255-1.225 0-.79-.24-1.568-.58-2.317-.342-.748-.813-1.487-1.283-2.185-.47-.698-.943-1.36-1.33-1.948a.414.414 0 00-.692 0c-.387.588-.86 1.25-1.33 1.948-.47.698-.942 1.437-1.283 2.185-.34.749-.58 1.527-.58 2.317 0 .436.094.843.255 1.225.384.895 1.107 1.61 2.017 1.97.38.148.78.225 1.196.225.415 0 .815-.077 1.195-.224.91-.36 1.633-1.076 2.016-1.97l.145-.001z" />
                      </svg>
                      Airbnb ↗
                    </a>
                    <a
                      href={vrboUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-charcoal/12 bg-cream px-3 py-2 text-sm font-medium text-charcoal transition hover:border-[#1C6BB0]/50 hover:text-[#1C6BB0]"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current" aria-hidden="true">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                      </svg>
                      VRBO ↗
                    </a>
                  </div>
                </div>
              );
            })()}

            {/* ── Getting there (compact, only if homeCity set) ── */}
            {detail.currentPreference?.homeCity ? (
              <div className="rounded-[22px] border border-charcoal/8 bg-white px-5 py-4">
                <p className="text-sm font-semibold text-charcoal">✈️ Getting there</p>
                <p className="mt-0.5 text-xs text-charcoal/50">
                  From <strong>{detail.currentPreference.homeCity}</strong> to {detail.outing.destinationLabel}
                </p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/${encodeURIComponent(detail.currentPreference.homeCity)}/${encodeURIComponent(detail.outing.destinationLabel)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-full border border-charcoal/12 bg-cream px-3 py-2 text-center text-xs font-medium text-charcoal hover:bg-charcoal/5 transition-colors"
                  >
                    🚗 Drive
                  </a>
                  <a
                    href={`https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(detail.currentPreference.homeCity)}+to+${encodeURIComponent(detail.outing.destinationLabel)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-full border border-charcoal/12 bg-cream px-3 py-2 text-center text-xs font-medium text-charcoal hover:bg-charcoal/5 transition-colors"
                  >
                    ✈️ Fly
                  </a>
                </div>
              </div>
            ) : null}

            {/* ── Organizer actions ── */}
            {isOrganizer && (
              <div className="space-y-3">
                {/* Edit trip details */}
                <div className="rounded-[22px] border border-charcoal/10 bg-white px-5 py-4">
                  <p className="text-sm font-semibold text-charcoal">Trip details</p>
                  <p className="mt-1 text-xs text-charcoal/55">
                    Update the name, dates, budget, destination, or group size.
                  </p>
                  <div className="mt-3">
                    <Button href={`/outings/${detail.outing.id}/edit`} variant="secondary" className="w-full justify-center text-sm">
                      ✏️ Edit trip details
                    </Button>
                  </div>
                </div>

                {/* Open vote (only when not yet open and there are options to vote on) */}
                {!votingOpen && (detail.golfCourses.length >= 2 || dedupedLodging.length >= 2) && (
                  <div className="rounded-[22px] border border-charcoal/10 bg-white px-5 py-4">
                    <p className="text-sm font-semibold text-charcoal">Ready to let the group vote?</p>
                    <p className="mt-1 text-xs text-charcoal/55">
                      Open a group vote so everyone picks their preferred course and lodging. You make the final call.
                    </p>
                    <form action={openVotingAction} className="mt-3">
                      <input type="hidden" name="outingId" value={detail.outing.id} />
                      <SubmitButton label="🗳 Open group vote" pendingLabel="Opening..." className="w-full justify-center text-sm" />
                    </form>
                  </div>
                )}

                {/* Compare & finalize CTA */}
                {(detail.destinations.length > 0 || detail.golfCourses.length > 0) && detail.insights.respondedCount >= 1 && (
                  <div className="rounded-[22px] border-2 border-emerald-200 bg-[linear-gradient(135deg,#ecfdf3,#f7f4ee)] px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-800/60">Next step</p>
                    <h2 className="mt-1.5 text-base font-semibold tracking-[-0.02em] text-charcoal">
                      {detail.insights.respondedCount >= 2 ? "Compare and lock it in" : "Compare while the group responds"}
                    </h2>
                    <p className="mt-1 text-xs text-charcoal/60">
                      {detail.insights.respondedCount >= 2
                        ? "Enough preferences are in — pick your hotel and tee times."
                        : "Rankings update as more preferences come in."}
                    </p>
                    <div className="mt-3">
                      <Button href={`/outings/${detail.outing.id}/compare`} className="w-full justify-center text-sm">
                        Compare &amp; finalize →
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

// ── Preferences form fields (shared between collapsed edit and full form) ──────
function PreferencesFormFields({
  detail,
  defaults
}: {
  detail: Awaited<ReturnType<typeof getOutingDetail>>;
  defaults: ReturnType<typeof preferenceDefaults>;
}) {
  if (!detail) return null;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="budgetMin">Budget min ($)</FieldLabel>
          <Input id="budgetMin" name="budgetMin" type="number" defaultValue={defaults.budgetMin} />
        </div>
        <div>
          <FieldLabel htmlFor="budgetMax">Budget max ($)</FieldLabel>
          <Input id="budgetMax" name="budgetMax" type="number" defaultValue={defaults.budgetMax} />
          <p className="mt-1.5 text-xs text-charcoal/45">Trip target: {currency(detail.outing.budgetTarget)}</p>
        </div>
      </div>

      {detail.outing.preferredDateWindows.length > 0 && (
        <div className="rounded-[22px] bg-cream p-4">
          <FieldLabel>Which dates work for you?</FieldLabel>
          <div className="mt-2">
            <DateAvailabilityPicker
              windows={detail.outing.preferredDateWindows}
              defaultSelected={detail.currentPreference?.availableDates ?? []}
            />
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="courseQualityPreference">Course quality (1–10)</FieldLabel>
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
          <FieldLabel htmlFor="walkingPreference">Walking or riding?</FieldLabel>
          <Select id="walkingPreference" name="walkingPreference" defaultValue={defaults.walkingPreference}>
            <option value="either">Either is fine</option>
            <option value="walking">Prefer walking</option>
            <option value="riding">Prefer riding</option>
          </Select>
        </div>
      </div>

      {detail.destinations.length > 0 && (
        <div>
          <FieldLabel>Destination lean (optional)</FieldLabel>
          <div className="mt-2 space-y-2">
            {detail.destinations.map((dest) => (
              <label
                key={dest.id}
                className="flex cursor-pointer items-center gap-3 rounded-[14px] bg-cream px-3 py-2.5 text-sm text-charcoal transition-colors hover:bg-charcoal/5"
              >
                <input
                  type="checkbox"
                  name="destinationVotes"
                  value={dest.name}
                  defaultChecked={(defaults.destinationVotes as string[]).includes(dest.name)}
                  className="h-4 w-4 accent-forest-900"
                />
                <span className="flex-1 font-medium">{dest.name}</span>
                {dest.driveHours != null && (
                  <span className="shrink-0 text-xs text-charcoal/45">🚗 ~{Math.round(dest.driveHours * 60)} mi</span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <FieldLabel>Lodging style (optional)</FieldLabel>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {([
            ["hotel", "Hotel"],
            ["resort", "Resort"],
            ["house", "House / Rental"],
            ["mixed", "No preference"]
          ] as const).map(([value, label]) => (
            <label
              key={value}
              className="flex cursor-pointer items-center gap-2.5 rounded-[14px] bg-cream px-3 py-2.5 text-sm text-charcoal transition-colors hover:bg-charcoal/5"
            >
              <input
                type="checkbox"
                name="lodgingPreferences"
                value={value}
                defaultChecked={(defaults.lodgingPreferences as string[]).includes(value)}
                className="h-4 w-4 accent-forest-900"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="preferredRounds">How many rounds?</FieldLabel>
        <Select id="preferredRounds" name="preferredRounds" defaultValue={defaults.preferredRounds ?? ""}>
          <option value="">No preference</option>
          <option value="1">1 round</option>
          <option value="2">2 rounds</option>
          <option value="3">3 rounds</option>
          <option value="4">4 rounds</option>
          <option value="5">5 rounds</option>
          <option value="6">6 rounds</option>
          <option value="7">7 rounds</option>
        </Select>
      </div>

      <div>
        <FieldLabel htmlFor="comments">Anything else?</FieldLabel>
        <Textarea
          id="comments"
          name="comments"
          defaultValue={defaults.comments}
          placeholder="Notes for the organizer..."
        />
      </div>

      <div>
        <FieldLabel htmlFor="homeCity">Your home zip code</FieldLabel>
        <Input
          id="homeCity"
          name="homeCity"
          defaultValue={defaults.homeCity ?? ""}
          placeholder="e.g. 49503"
        />
        <p className="mt-1.5 text-xs text-charcoal/45">Used to show driving and flight options.</p>
      </div>
    </>
  );
}
