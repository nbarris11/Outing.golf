import { redirect } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { PageShell } from "@/components/layout/page-shell";
import { getCurrentProfile } from "@/lib/auth";
import { isDemoMode } from "@/lib/env";
import { joinDemoOuting } from "@/lib/demo/store";
import { resolveOutingIdFromShareToken } from "@/lib/outing-share-links";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export default async function JoinOutingPage({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
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

  const profile = await getCurrentProfile();

  if (!profile) {
    redirect(`/sign-up?next=${encodeURIComponent(`/join/${token}`)}`);
  }

  if (isDemoMode) {
    await joinDemoOuting(outingId, profile.id);
    redirect(`/outings/${outingId}?success=You%20joined%20the%20outing`);
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

  const { data: existingMember } = await adminClient
    .from("outing_members")
    .select("id")
    .eq("outing_id", outingId)
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (!existingMember) {
    await adminClient.from("outing_members").insert({
      outing_id: outingId,
      profile_id: profile.id,
      role: "participant"
    });
  }

  redirect(`/outings/${outingId}?success=You%20joined%20the%20outing`);
}
