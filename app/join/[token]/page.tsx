import type { Metadata } from "next";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { joinOutingFromShareLinkAction } from "@/lib/actions/outings";
import { getCurrentProfile } from "@/lib/auth";
import { resolveOutingIdFromShareToken } from "@/lib/outing-share-links";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function generateMetadata({
  params
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const outingId = await resolveOutingIdFromShareToken(token);

  if (!outingId) {
    return { title: "Join Outing · Outing.golf" };
  }

  const adminClient = createSupabaseAdminClient();
  if (!adminClient) return { title: "Join Outing · Outing.golf" };

  const { data: outing } = await adminClient
    .from("outings")
    .select("name,destination_label")
    .eq("id", outingId)
    .maybeSingle();

  if (!outing) return { title: "Join Outing · Outing.golf" };

  const title = `${outing.name} · Outing.golf`;
  const description = `Join this golf trip${outing.destination_label ? ` to ${outing.destination_label}` : ""}. Fill out your dates and budget so the group can lock in a plan.`;
  const pageUrl = `https://www.outing.golf/join/${token}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Outing.golf",
      type: "website",
      images: [{ url: `/join/${token}/opengraph-image`, width: 1200, height: 630 }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/join/${token}/opengraph-image`]
    }
  };
}

export default async function JoinOutingPage({
  params,
  searchParams
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const notices = await searchParams;
  const outingId = await resolveOutingIdFromShareToken(token);

  if (!outingId) {
    return (
      <PageShell>
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            title="This share link is no longer valid"
            body="Ask the organizer for a fresh link and try again."
            cta={{ href: "/", label: "Return home" }}
          />
        </section>
      </PageShell>
    );
  }

  const adminClient = createSupabaseAdminClient();

  if (!adminClient) {
    return (
      <PageShell>
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            title="Joining is not configured"
            body="The server-side join helper is missing. Add the service role key and try again."
          />
        </section>
      </PageShell>
    );
  }

  const [{ data: outingRow }, profile] = await Promise.all([
    adminClient
      .from("outings")
      .select("id,name,destination_label,status,organizer_id,budget_target,number_of_players,preferred_date_windows")
      .eq("id", outingId)
      .maybeSingle(),
    getCurrentProfile()
  ]);

  if (!outingRow) {
    return (
      <PageShell>
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            title="This outing could not be found"
            body="The share link points to an outing that is no longer available."
            cta={{ href: "/", label: "Return home" }}
          />
        </section>
      </PageShell>
    );
  }

  const existingMember = profile
    ? await adminClient
        .from("outing_members")
        .select("id")
        .eq("outing_id", outingId)
        .eq("profile_id", profile.id)
        .maybeSingle()
    : null;

  const alreadyJoined = Boolean(existingMember?.data?.id);
  const next = `/join/${token}`;

  // Fetch organizer name for personalization
  const { data: organizerProfile } = await adminClient
    .from("profiles")
    .select("full_name,email")
    .eq("id", outingRow.organizer_id)
    .maybeSingle();

  const organizerFirstName = (organizerProfile?.full_name ?? organizerProfile?.email ?? "")
    .split(/[\s@]/)[0] || "Your organizer";

  // Extract first date window for the trip detail strip
  const dateWindows = Array.isArray(outingRow.preferred_date_windows) ? outingRow.preferred_date_windows : [];
  const firstWindow = dateWindows[0] as { start?: string; end?: string } | undefined;
  const dateLabel = firstWindow?.start && firstWindow?.end
    ? `${new Date(firstWindow.start + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}–${new Date(firstWindow.end + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    : null;

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Card className="text-center">
          {/* Organizer inviter card */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-900 text-xs font-semibold text-cream">
              {organizerFirstName[0]?.toUpperCase() ?? "O"}
            </div>
            <p className="text-sm font-medium text-charcoal/65">
              <span className="text-charcoal font-semibold">{organizerFirstName}</span> invited you to a golf trip
            </p>
          </div>

          <h1 className="mt-5 font-serif text-5xl font-semibold tracking-[-0.05em]">{outingRow.name}</h1>
          <p className="mt-4 text-base leading-7 text-charcoal/68">
            Add your dates and budget so {organizerFirstName} can lock in the trip.
          </p>

          {/* Trip detail strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-charcoal/55">
            {outingRow.destination_label && (
              <span className="flex items-center gap-1.5">
                <span>📍</span> {outingRow.destination_label}
              </span>
            )}
            {dateLabel && (
              <span className="flex items-center gap-1.5">
                <span>📅</span> {dateLabel}
              </span>
            )}
            {outingRow.number_of_players && (
              <span className="flex items-center gap-1.5">
                <span>👥</span> {outingRow.number_of_players} golfers
              </span>
            )}
            {outingRow.budget_target && (
              <span className="flex items-center gap-1.5">
                <span>💰</span> ~${outingRow.budget_target.toLocaleString()}/person
              </span>
            )}
          </div>

          {/* Status pill — visually distinct from destination */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-forest-900/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-forest-900">
              {outingRow.status.replaceAll("_", " ")}
            </span>
          </div>
          {notices.error ? (
            <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{notices.error}</p>
          ) : null}
          {!profile ? (
            <div className="mt-8 space-y-4">
              <p className="text-xs font-medium text-forest-900/70 uppercase tracking-[0.18em]">Takes about 90 seconds</p>
              <p className="text-sm text-charcoal/60">
                Create an account or sign in — you&apos;ll come right back here to join this exact outing.
              </p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button href={`/sign-up?next=${encodeURIComponent(next)}`}>Create account to join</Button>
                <Button href={`/sign-in?next=${encodeURIComponent(next)}`} variant="secondary">
                  Already have an account?
                </Button>
              </div>
            </div>
          ) : alreadyJoined ? (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-charcoal/60">
                Signed in as <strong>{profile.email}</strong>. You&apos;re already part of this outing.
              </p>
              <div className="flex justify-center">
                <Button href={`/outings/${outingId}`}>Open outing</Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              <p className="text-xs font-medium text-forest-900/70 uppercase tracking-[0.18em]">Takes about 90 seconds</p>
              <p className="text-sm text-charcoal/60">
                Signed in as <strong>{profile.email}</strong>. Fill out your preferences and {organizerFirstName} will see your input right away.
              </p>
              <div className="flex justify-center">
                <form action={joinOutingFromShareLinkAction}>
                  <input type="hidden" name="token" value={token} />
                  <SubmitButton label="Join this outing" pendingLabel="Joining..." />
                </form>
              </div>
            </div>
          )}
        </Card>
      </section>
    </PageShell>
  );
}
