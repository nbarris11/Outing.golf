import Link from "next/link";
import { redirect } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { acceptInviteAction } from "@/lib/actions/outings";
import { getCurrentProfile } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function InvitePage({
  params,
  searchParams
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const notices = await searchParams;
  const profile = await getCurrentProfile();
  const adminClient = createSupabaseAdminClient();

  if (!adminClient) {
    return (
      <PageShell>
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            title="Invite acceptance is not configured"
            body="The server-side invite helper is missing. Add the service role key and try again."
          />
        </section>
      </PageShell>
    );
  }

  const { data: invite } = await adminClient
    .from("invites")
    .select("id,email,status,outing_id,token")
    .eq("token", token)
    .maybeSingle();

  if (!invite) {
    return (
      <PageShell>
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            title="This invite link is no longer valid"
            body="The link may be wrong, expired, or already removed. Ask the organizer to send a fresh invite."
            cta={{ href: "/", label: "Return home" }}
          />
        </section>
      </PageShell>
    );
  }

  if (!profile) {
    redirect(`/sign-in?next=${encodeURIComponent(`/invite/${token}`)}`);
  }

  if (profile.email.toLowerCase() !== invite.email.toLowerCase()) {
    return (
      <PageShell>
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <Card className="text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Invite email mismatch</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
              Sign in with {invite.email}
            </h1>
            <p className="mt-5 text-base leading-7 text-charcoal/68">
              This invite was sent to a different email address. Switch accounts, then open this invite again.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/settings">
                <Button variant="secondary">Check account</Button>
              </Link>
            </div>
          </Card>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <Card className="text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-charcoal/45">Outing invite</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">
            {invite.status === "accepted" ? "You already joined this outing" : "You’ve been invited to an outing"}
          </h1>
          <p className="mt-5 text-base leading-7 text-charcoal/68">
            Signed in as <strong>{profile.email}</strong>. {invite.status === "accepted"
              ? "You can open the outing directly."
              : "Accept below and you’ll be added to the group right away."}
          </p>
          {notices.error ? (
            <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{notices.error}</p>
          ) : null}
          <div className="mt-8 flex items-center justify-center gap-3">
            <Badge>{invite.status}</Badge>
            <Badge>{invite.email}</Badge>
          </div>
          <div className="mt-8 flex justify-center gap-3">
            {invite.status === "accepted" ? (
              <Link href={`/outings/${invite.outing_id}`}>
                <Button>Open outing</Button>
              </Link>
            ) : (
              <form action={acceptInviteAction}>
                <input type="hidden" name="token" value={token} />
                <SubmitButton label="Accept invite" pendingLabel="Joining..." />
              </form>
            )}
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
