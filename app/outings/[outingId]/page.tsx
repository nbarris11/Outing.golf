import { ChatPanel } from "@/components/chat/chat-panel";
import { EmptyState } from "@/components/common/empty-state";
import { CopyLinkButton } from "@/components/outings/copy-link-button";
import { DateAvailabilityPicker } from "@/components/outings/date-availability-picker";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldLabel, Input, Select, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  inviteMemberAction,
  nudgeMemberAction,
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
          {responded ? "Responded" : "Waiting"}
        </Badge>
        <span className="hidden sm:inline text-xs text-charcoal/35">{role}</span>
      </div>
    </div>
  );
}

function IncludedPersonPill({
  title,
  subtitle,
  tone = "member"
}: {
  title: string;
  subtitle: string;
  tone?: "member" | "pending";
}) {
  return (
    <div
      className={[
        "rounded-[18px] px-4 py-3",
        tone === "pending" ? "border border-dashed border-charcoal/15 bg-white" : "bg-cream"
      ].join(" ")}
    >
      <p className="text-sm font-medium text-charcoal">{title}</p>
      <p className="mt-1 text-xs text-charcoal/50">{subtitle}</p>
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

  const profiles = detail.profiles;
  const bestDate = detail.recommendation.bestDates[0];
  const defaults = preferenceDefaults(detail.currentPreference, detail.outing.budgetTarget);
  const progressTarget = detail.insights.respondedCount + detail.insights.pendingCount;
  const isOrganizer = detail.outing.organizerId === profile.id;

  // New members who haven't filled out preferences yet get a focused welcome screen
  // instead of the full page, so the first thing they do is submit their info.
  if (notices.newMember === "1" && !detail.currentPreference) {
    return (
      <PageShell>
        <section className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Badge className="bg-forest-900/10 text-forest-900">You&apos;re in</Badge>
            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.05em] text-charcoal">
              {detail.outing.name}
            </h1>
            <p className="mt-3 text-base leading-7 text-charcoal/66">
              Fill in your preferences below — takes under a minute. Once you submit, you&apos;ll see the full trip view with courses, lodging, and the group&apos;s picks.
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
                        <span className="font-medium">{dest.name}</span>
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
                <FieldLabel htmlFor="homeCity">Where are you traveling from?</FieldLabel>
                <Input
                  id="homeCity"
                  name="homeCity"
                  defaultValue={defaults.homeCity ?? ""}
                  placeholder="e.g. Chicago, IL or Grand Rapids, MI"
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

  // ── Step 3: post-preference confirmation screen for new members ──
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
        <section className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
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

          {/* Top picks */}
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

          {/* CTA */}
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

  const shareLink = isOrganizer
    ? notices.shareLink ?? (await getOutingShareLink(detail.outing.id, detail.outing.organizerId)) ?? null
    : null;
  const responsePercent = progressTarget
    ? Math.round((detail.insights.respondedCount / progressTarget) * 100)
    : 0;

  // Deduplicate lodging — keep one card per hotel name
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

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Trip header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={detail.outing.status === "booked" ? "bg-emerald-100 text-emerald-800" : detail.outing.status === "completed" ? "bg-charcoal/8 text-charcoal/50" : "bg-sand text-charcoal/70"}>
                {detail.outing.status === "narrowed_down" ? "Narrowed down" : labelize(detail.outing.status)}
              </Badge>
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
            <Button href={`/outings/${detail.outing.id}/compare`} className="w-full sm:w-auto">
              Compare options
            </Button>
            <Button href="#preferences" variant="secondary" className="w-full sm:w-auto">
              My preferences
            </Button>
          </div>
        </div>

        {/* ── Group progress bar ── */}
        <div className="mt-5 rounded-[20px] bg-white border border-charcoal/8 px-5 py-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-charcoal">
              {progressTarget === 0
                ? "Invite the group to get started"
                : detail.insights.respondedCount === progressTarget
                  ? `All ${progressTarget} members responded ✓`
                  : `${detail.insights.respondedCount} of ${progressTarget} members responded`}
            </span>
            {bestDate && (
              <span className="hidden sm:inline text-charcoal/50 text-xs">
                Best overlap: {bestDate.date} · {bestDate.availableCount} available
              </span>
            )}
          </div>
          {progressTarget > 0 && (
            <div className="h-2 w-full rounded-full bg-charcoal/8">
              <div
                className={["h-2 rounded-full transition-all", responsePercent === 100 ? "bg-emerald-500" : "bg-forest-900"].join(" ")}
                style={{ width: `${responsePercent}%` }}
              />
            </div>
          )}
        </div>


        <Card className="mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-charcoal/42">People</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-charcoal">
                Who&apos;s in this outing
              </h2>
              <p className="mt-2 text-sm text-charcoal/60">
                Everyone already in the group, plus anyone still sitting on an invite.
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-forest-900/8 text-forest-900">{detail.members.length} joined</Badge>
              {detail.invites.length ? (
                <Badge className="bg-sand text-charcoal/72">
                  {detail.invites.filter((invite) => invite.status === "pending").length} pending
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {detail.memberSnapshots.map((snapshot) => {
              const person = profiles.find((item) => item.id === snapshot.member.profileId);

              return (
                <IncludedPersonPill
                  key={snapshot.member.id}
                  title={person?.fullName ?? person?.email ?? "Member"}
                  subtitle={
                    snapshot.responded
                      ? `${person?.email ?? "No email"} · preferences submitted`
                      : `${person?.email ?? "No email"} · still needs to respond`
                  }
                />
              );
            })}
            {detail.invites
              .filter((invite) => invite.status === "pending")
              .map((invite) => (
                <IncludedPersonPill
                  key={invite.id}
                  title={invite.email}
                  subtitle="Invite sent · waiting to join"
                  tone="pending"
                />
              ))}
          </div>
        </Card>

        {/* ── Notices ── */}
        {notices.created === "1" ? (
          <Card className="mt-5 border-emerald-200 bg-[linear-gradient(135deg,#ecfdf3,#f7f4ee)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">
                  Trip created — now invite the group
                </h2>
                <p className="mt-1 text-sm text-charcoal/68">
                  {notices.inviteEmail
                    ? `First invite is ready for ${notices.inviteEmail}.`
                    : "Share the link or invite by email below."}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row shrink-0">
                <Button href="#people" variant="secondary">Invite more</Button>
              </div>
            </div>
          </Card>
        ) : notices.success ? (
          <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notices.success}</p>
        ) : null}
        {notices.error ? (
          <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{notices.error}</p>
        ) : null}

        {/* ── Main two-column grid ── */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">

          {/* ── Left column ── */}
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
                <p className="text-sm text-charcoal/50">
                  {roundsPerPlayer} rounds · {players} players
                  {detail.recommendation.consensusRounds ? " · from group votes" : " · estimated"}
                </p>
              </div>

              {detail.golfCourses.length === 0 ? (
                <div className="mt-4">
                  <div className="rounded-[22px] border border-dashed border-amber-200 bg-amber-50 px-5 py-5 text-center">
                    <p className="text-sm font-medium text-amber-800">⏳ Finding golf courses…</p>
                    <p className="mt-1 text-xs text-amber-700/70">Options are being pulled in — refresh in a few seconds.</p>
                    <a href="" className="mt-3 inline-block rounded-full bg-amber-100 px-4 py-2 text-xs font-medium text-amber-800 hover:bg-amber-200 transition-colors">Refresh now</a>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {detail.golfCourses.map((course) => {
                    const isTop = course.id === detail.insights.topCourse?.id;
                    const golfPerPerson = course.averageGreensFee * roundsPerPlayer;
                    return (
                      <div key={course.id} className="rounded-[22px] border border-charcoal/8 bg-cream p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-charcoal">{course.name}</p>
                              {isTop && <Badge className="bg-forest-900/10 text-forest-900">Top pick</Badge>}
                            </div>
                            <p className="mt-0.5 text-sm text-charcoal/55">{course.locationLabel}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-charcoal">{currency(golfPerPerson)}<span className="ml-1 text-xs font-normal text-charcoal/50">/person</span></p>
                            <p className="mt-0.5 text-xs text-charcoal/45">{currency(course.averageGreensFee)} × {roundsPerPlayer} rounds</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex gap-3 text-xs text-charcoal/55">
                            <span>Quality {course.qualityScore}/100</span>
                            <span>{course.walkingFriendly ? "Walking-friendly" : "Riding"}</span>
                          </div>
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
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Lodging options */}
            <Card id="people">
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
                <div className="mt-4">
                  <div className="rounded-[22px] border border-dashed border-amber-200 bg-amber-50 px-5 py-5 text-center">
                    <p className="text-sm font-medium text-amber-800">⏳ Finding lodging options…</p>
                    <p className="mt-1 text-xs text-amber-700/70">Lodging options are being pulled in — refresh in a few seconds.</p>
                    <a href="" className="mt-3 inline-block rounded-full bg-amber-100 px-4 py-2 text-xs font-medium text-amber-800 hover:bg-amber-200 transition-colors">Refresh now</a>
                  </div>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {dedupedLodging.map((stay) => {
                    const isTop = stay.id === detail.insights.topLodging?.id;
                    const lodgingTotal = stay.priceTotal ?? stay.nightlyRate * nights;
                    const perPerson = Math.round(lodgingTotal / players);
                    return (
                      <div key={stay.id} className="rounded-[22px] border border-charcoal/8 bg-cream p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-charcoal">{stay.name}</p>
                              {isTop && <Badge className="bg-forest-900/10 text-forest-900">Top pick</Badge>}
                            </div>
                            <p className="mt-0.5 text-sm capitalize text-charcoal/55">
                              {labelize(stay.lodgingType)}{stay.city ? ` · ${stay.city}${stay.state ? `, ${stay.state}` : ""}` : ""}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-charcoal">{currency(perPerson)}<span className="ml-1 text-xs font-normal text-charcoal/50">/person</span></p>
                            <p className="mt-0.5 text-xs text-charcoal/45">{currency(stay.nightlyRate)}/night × {nights} nights</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex gap-3 text-xs text-charcoal/55">
                            <span>Sleeps {stay.sleeps}</span>
                            {stay.refundable !== null && stay.refundable !== undefined && (
                              <span>{stay.refundable ? "Refundable" : "Non-refundable"}</span>
                            )}
                          </div>
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
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Combined cost estimate */}
            {detail.insights.topCourse && detail.insights.topLodging ? (() => {
              const golfPerPerson = detail.insights.topCourse.averageGreensFee * roundsPerPlayer;
              const lodgingTotal = detail.insights.topLodging.priceTotal ?? detail.insights.topLodging.nightlyRate * nights;
              const lodgingPerPerson = Math.round(lodgingTotal / players);
              const totalPerPerson = golfPerPerson + lodgingPerPerson;
              return (
                <div className="rounded-[28px] bg-forest-950 px-6 py-5 text-cream">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-cream/50">Estimated per person</p>
                      <p className="mt-2 font-serif text-4xl font-semibold tracking-[-0.05em]">
                        {currency(totalPerPerson)}
                      </p>
                      <p className="mt-1 text-sm text-cream/55">
                        Based on top-ranked golf &amp; lodging · {nights} nights · {roundsPerPlayer} rounds
                      </p>
                    </div>
                    <div className="space-y-1 text-sm text-cream/65">
                      <p>{currency(golfPerPerson)} golf ({roundsPerPlayer} rounds)</p>
                      <p>{currency(lodgingPerPerson)} lodging (÷ {players} players)</p>
                    </div>
                  </div>
                </div>
              );
            })() : null}

            {/* Chat */}
            <ChatPanel
              messages={detail.messages}
              profiles={profiles}
              outingId={detail.outing.id}
              currentProfileId={profile.id}
              sendAction={sendChatMessageInlineAction}
            />
          </div>

          {/* ── Right column ── */}
          <div className="space-y-6">

            {/* Getting there */}
            {detail.currentPreference?.homeCity ? (
              <Card>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">✈️ Getting there</h2>
                <p className="mt-1 text-sm text-charcoal/55">
                  From <strong>{detail.currentPreference.homeCity}</strong> to {detail.outing.destinationLabel}
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={`https://www.google.com/maps/dir/${encodeURIComponent(detail.currentPreference.homeCity)}/${encodeURIComponent(detail.outing.destinationLabel)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-charcoal/12 bg-cream px-4 py-3 text-sm font-medium text-charcoal hover:bg-charcoal/5 transition-colors"
                  >
                    🚗 Get driving directions
                  </a>
                  <a
                    href={`https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(detail.currentPreference.homeCity)}+to+${encodeURIComponent(detail.outing.destinationLabel)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-charcoal/12 bg-cream px-4 py-3 text-sm font-medium text-charcoal hover:bg-charcoal/5 transition-colors"
                  >
                    ✈️ Search flights
                  </a>
                </div>
                <p className="mt-3 text-xs text-charcoal/40">
                  Links open Google Maps / Google Flights in a new tab.
                </p>
              </Card>
            ) : (
              <div className="rounded-[22px] border border-dashed border-charcoal/15 px-5 py-4 text-sm text-charcoal/50">
                Add your home city in preferences below to see driving and flight options for this trip.
              </div>
            )}

            {/* Preferences form */}
            <Card id="preferences">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">Your preferences</h2>
                {detail.currentPreference ? (
                  <Badge className="bg-emerald-100 text-emerald-800">Saved ✓</Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-800">Not filled in yet</Badge>
                )}
              </div>
              <p className="mt-2 text-sm text-charcoal/58">
                Tell the group your budget, available dates, and what you care about most. Takes under a minute.
              </p>

              <form action={submitPreferencesAction} className="mt-5 space-y-4">
                <input type="hidden" name="outingId" value={detail.outing.id} />

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
                          <span className="font-medium">{dest.name}</span>
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
                  <FieldLabel htmlFor="homeCity">Where are you traveling from?</FieldLabel>
                  <Input
                    id="homeCity"
                    name="homeCity"
                    defaultValue={defaults.homeCity ?? ""}
                    placeholder="e.g. Chicago, IL or Grand Rapids, MI"
                  />
                  <p className="mt-1.5 text-xs text-charcoal/45">
                    Used to show driving and flight options tailored to you.
                  </p>
                </div>

                <SubmitButton label="Save preferences" pendingLabel="Saving..." />
              </form>
            </Card>

            {/* Group / People */}
            {isOrganizer ? (
              <Card id="group">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-charcoal">Invite and manage people</h2>
                  <Badge className="bg-forest-900/8 text-forest-900">{detail.members.length} already in</Badge>
                </div>

                <form action={inviteMemberAction} className="mt-5 rounded-[22px] bg-forest-950 p-4 text-cream">
                  <input type="hidden" name="outingId" value={detail.outing.id} />
                  <h3 className="font-semibold tracking-[-0.02em]">Invite more golfers</h3>
                  <p className="mt-1 text-sm text-cream/60">One email per line, or comma-separated.</p>
                  <div className="mt-3">
                    <Textarea
                      name="emails"
                      placeholder={"friend@example.com\nanother@example.com"}
                      className="min-h-24 bg-white/10 text-cream placeholder:text-cream/35"
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
                {detail.memberSnapshots.length > 0 ? (
                  <div className="mt-5">
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
                          {!snapshot.responded && snapshot.member.profileId !== profile.id && (
                            <div className="mb-2 flex justify-end">
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
                  </div>
                ) : null}

                {detail.invites.length > 0 ? (
                  <div className="mt-4 space-y-2">
                    {detail.invites.map((invite) => (
                      <div key={invite.id} className="flex items-center justify-between gap-3 rounded-[18px] bg-cream px-4 py-3">
                        <div className="min-w-0">
                          <p className="text-sm text-charcoal">{invite.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>{labelize(invite.status)}</Badge>
                          {invite.status === "pending" ? (
                            <form action={resendInviteAction}>
                              <input type="hidden" name="outingId" value={detail.outing.id} />
                              <input type="hidden" name="inviteId" value={invite.id} />
                              <Button type="submit" variant="secondary" className="px-3 py-2 text-xs">
                                Resend invite
                              </Button>
                            </form>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Card>
            ) : null}

            {/* Ready to book CTA */}
            {(detail.destinations.length > 0 || detail.golfCourses.length > 0) && detail.insights.respondedCount >= 1 && (
              <div className="rounded-[28px] border-2 border-emerald-200 bg-[linear-gradient(135deg,#ecfdf3,#f7f4ee)] px-6 py-5">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-800/60">Next step</p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-charcoal">
                  {detail.insights.respondedCount >= 2
                    ? "Ready to compare and lock it in"
                    : "Compare options while the group responds"}
                </h2>
                <p className="mt-2 text-sm text-charcoal/60">
                  {detail.insights.respondedCount >= 2
                    ? "Enough preferences are in — head to the compare view to pick your hotel and tee times."
                    : "You can start comparing options now. Rankings update as more preferences come in."}
                </p>
                <div className="mt-4">
                  <Button href={`/outings/${detail.outing.id}/compare`} className="w-full justify-center">
                    Compare &amp; finalize →
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
