import { FunnelEvents } from "@/components/outings/funnel-events";
import { getFunnelContext } from "@/lib/analytics/funnel-context";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { getInvitation } from "@/lib/invitation";
import { getCurrentProfile } from "@/lib/auth";
import { getOutingDetail } from "@/modules/outings/service";
import {
  acceptInviteAction,
  joinOutingFromShareLinkAction,
} from "@/lib/actions/outings";
import { switchInviteAccount } from "@/lib/actions/auth";
import {
  courseRoundDays,
  datesAreConfirmed,
  tripCosts,
  tripDayCount,
  tripDayLabel,
} from "@/lib/trip-plan";
import { currency } from "@/lib/utils";
import { CoursePreview } from "@/components/outings/course-preview";

export async function InvitationPage({
  token,
  kind,
  error,
}: {
  token: string;
  kind: "join" | "invite";
  error?: string;
}) {
  const [invite, profile] = await Promise.all([
    getInvitation(token, kind),
    getCurrentProfile(),
  ]);
  if (!invite)
    return (
      <PageShell>
        <section className="mx-auto max-w-2xl px-4 py-16">
          <EmptyState
            title="This invitation is no longer available"
            body="Ask the organizer for a fresh link and try again."
            cta={{ href: "/", label: "Return home" }}
          />
        </section>
      </PageShell>
    );
  const { outing, courses, lodging, organizerName, joined, inviteEmail } =
    invite;
  const alreadyJoined = profile
    ? Boolean(await getOutingDetail(outing.id, profile.id))
    : false;
  const mismatch =
    profile &&
    inviteEmail &&
    profile.email.toLowerCase() !== inviteEmail.toLowerCase();
  const next = `/${kind}/${token}`;
  const window = outing.preferredDateWindows[0];
  const confirmed = datesAreConfirmed(outing);
  const costs = tripCosts(
    courses,
    lodging?.nightlyRate ?? null,
    Math.max(0, tripDayCount(window?.start, window?.end) - 1),
    outing.numberOfPlayers,
    outing.personsPerRoom ?? 2,
    outing.golfOnly,
  );
  return (
    <PageShell>
      {!alreadyJoined && (
        <FunnelEvents
          context={getFunnelContext(outing.id, undefined, profile)}
          events={["outing_invite_opened"]}
          placement={kind === "join" ? "share_link" : "email_invite"}
        />
      )}
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="rounded-[32px] bg-forest-900 p-6 text-cream sm:p-10">
          <p className="text-sm text-cream/75">
            {organizerName.split(" ")[0]} invited you to a golf trip
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
            {outing.name}
          </h1>
          <p className="mt-3 text-lg">
            {outing.destinationLabel || "Destination being decided"}
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span>
              {window
                ? `${tripDayLabel(window.start, 1)} – ${tripDayLabel(window.end, 1)}, ${window.end.slice(0, 4)}`
                : "Dates to be decided"}{" "}
              · {confirmed ? "Confirmed" : "Proposed"}
            </span>
            <span>
              {joined} joined · planning for {outing.numberOfPlayers} golfers
            </span>
          </div>
          <p className="mt-5 text-2xl font-semibold">
            {!costs.incomplete
              ? `${currency(costs.total)} / person`
              : costs.total > 0
                ? `From ${currency(costs.total)} / person`
                : `${currency(outing.budgetTarget)} / person target`}
          </p>
          <p className="mt-1 text-xs text-cream/70">
            {costs.incomplete ? "Estimate is incomplete. " : "Estimated "}
            {outing.golfOnly ? "golf" : "golf and lodging"}. Travel, meals,
            taxes, and extra fees are separate.
          </p>
        </div>
        <div className="mt-5 rounded-[28px] border bg-white p-5 sm:p-7">
          <h2 className="font-serif text-2xl">Your weekend at a glance</h2>
          <p className="mt-2 text-sm text-charcoal/65">
            {confirmed
              ? "Take a look at the plan, then let the group know if you're in."
              : "The plan is taking shape. Preview it here, then share your availability and budget."}
          </p>
          {courses.length ? (
            <div className="mt-4 space-y-3">
              {courses.map((c) => (
                <article key={c.id} className="rounded-2xl border p-4">
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="mt-1 text-sm">
                    {courseRoundDays(c)
                      .map((d) =>
                        d
                          ? tripDayLabel(window?.start, d)
                          : "Day to be decided",
                      )
                      .join(" · ")}
                  </p>
                  <p className="mt-2 text-sm text-charcoal/65">{c.summary}</p>
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm underline">
                      Photos, details & map
                    </summary>
                    <CoursePreview
                      outingId={outing.id}
                      course={c}
                      previewUrl={`/api/invitations/${kind}/${encodeURIComponent(token)}/courses/${c.id}`}
                    />
                  </details>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-cream p-4 text-sm">
              Courses are still being chosen. Your input will help shape the
              trip.
            </p>
          )}
          {!outing.golfOnly && (
            <div className="mt-4 rounded-2xl bg-cream p-4">
              <p className="text-xs uppercase tracking-widest">The stay</p>
              <p className="mt-2 font-semibold">
                {lodging?.name ?? "The group is still choosing a stay"}
              </p>
              {lodging?.thumbnailUrl && (
                <img
                  src={lodging.thumbnailUrl}
                  alt={lodging.name}
                  className="mt-3 h-44 w-full rounded-xl object-cover"
                  loading="lazy"
                />
              )}
            </div>
          )}
        </div>
        <div className="mt-5 rounded-[28px] border bg-white p-5 text-center sm:p-7">
          {error && (
            <p role="alert" className="mb-4 text-sm text-red-700">
              {error}
            </p>
          )}
          {alreadyJoined ? (
            <Button href={`/outings/${outing.id}/trip`}>View your trip</Button>
          ) : !profile ? (
            <>
              <h2 className="font-serif text-2xl">Ready to respond?</h2>
              <p className="my-3 text-sm text-charcoal/65">
                {inviteEmail ? `Use ${inviteEmail} to join. ` : ""}Create an
                account or sign in to save your response. We&apos;ll bring you
                back to {outing.name}.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button href={`/sign-up?next=${encodeURIComponent(next)}`}>
                  Join & respond
                </Button>
                <Button
                  href={`/sign-in?next=${encodeURIComponent(next)}`}
                  variant="secondary"
                >
                  Already have an account? Sign in
                </Button>
              </div>
            </>
          ) : mismatch ? (
            <>
              <p className="mb-4 text-sm">
                You&apos;re signed in as {profile.email}. This invitation is for{" "}
                {inviteEmail}.
              </p>
              <form action={switchInviteAccount}>
                <input type="hidden" name="next" value={next} />
                <SubmitButton
                  label="Switch account to join"
                  pendingLabel="Switching…"
                />
              </form>
            </>
          ) : (
            <>
              <p className="mb-4 text-sm text-charcoal/65">
                Signed in as {profile.email}. Join to save your RSVP and follow
                the trip. Joining does not commit you to a booking.
              </p>
              <form
                action={
                  kind === "join"
                    ? joinOutingFromShareLinkAction
                    : acceptInviteAction
                }
              >
                <input type="hidden" name="token" value={token} />
                <SubmitButton label="Join & respond" pendingLabel="Joining…" />
              </form>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}
