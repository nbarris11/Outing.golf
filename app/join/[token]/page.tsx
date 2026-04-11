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
      .select("id,name,destination_label,status")
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

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Card className="text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Shared outing link</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">{outingRow.name}</h1>
          <p className="mt-5 text-base leading-7 text-charcoal/68">
            Join this outing to share your dates, budget, destination lean, and lodging preferences in the same plan as the rest of the group.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Badge>{outingRow.status.replaceAll("_", " ")}</Badge>
            <Badge>{outingRow.destination_label}</Badge>
          </div>
          {notices.error ? (
            <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{notices.error}</p>
          ) : null}
          {!profile ? (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-charcoal/60">
                Create an account or sign in first, then you’ll come right back here to join this exact outing.
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
                Signed in as <strong>{profile.email}</strong>. You’re already part of this outing.
              </p>
              <div className="flex justify-center">
                <Button href={`/outings/${outingId}`}>Open outing</Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-charcoal/60">
                Signed in as <strong>{profile.email}</strong>. Join now and you’ll land in the outing with your preference form ready.
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
